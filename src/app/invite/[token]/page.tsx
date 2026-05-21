'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Shield, Lock, CheckCircle, AlertTriangle, Loader2, Eye, EyeOff, Send } from 'lucide-react';

type InviteStatus = 'loading' | 'pending' | 'otp_sent' | 'verified' | 'error';

interface InviteContent {
  id: string;
  recipient_name: string;
  invite_type: string;
  content: any;
  image_url: string | null;
  background_image_url: string | null;
  event_date: string | null;
  event_location: string | null;
  verified_at: string;
}

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;

  const [status, setStatus] = useState<InviteStatus>('loading');
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fingerprint, setFingerprint] = useState<string>('');
  const [invite, setInvite] = useState<InviteContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Get device fingerprint on mount
  useEffect(() => {
    const getFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch (err) {
        console.error('Fingerprint error:', err);
        // Fallback: use a combination of available data
        const fallback = btoa(
          navigator.userAgent + screen.width + screen.height + new Date().getTimezoneOffset()
        ).slice(0, 32);
        setFingerprint(fallback);
      }
    };
    getFingerprint();
  }, []);

  // Check invite access once fingerprint is ready
  const checkAccess = useCallback(async () => {
    if (!fingerprint || !token) return;

    try {
      const res = await fetch('/api/invites/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, device_fingerprint: fingerprint }),
      });

      const data = await res.json();

      if (data.status === 'verified' && data.invite) {
        setInvite(data.invite);
        setStatus('verified');
      } else if (data.status === 'pending') {
        setRecipientName(data.recipient_name || '');
        setStatus('pending');
      } else if (data.status === 'device_mismatch') {
        setError('This invite is locked to another device. It cannot be viewed here.');
        setStatus('error');
      } else if (data.status === 'revoked') {
        setError('This invite has been revoked by the sender.');
        setStatus('error');
      } else if (res.status === 410) {
        setError('This invite has expired.');
        setStatus('error');
      } else if (res.status === 404) {
        setError('Invite not found. The link may be invalid.');
        setStatus('error');
      } else {
        setError(data.error || 'Unable to access this invite.');
        setStatus('error');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  }, [fingerprint, token]);

  useEffect(() => {
    if (fingerprint) {
      checkAccess();
    }
  }, [fingerprint, checkAccess]);

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/invites/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('otp_sent');
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/invites/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, otp_code: otp, device_fingerprint: fingerprint }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setInvite(data.invite);
        setStatus('verified');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (invite?.event_date) {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const eventTime = new Date(invite.event_date).getTime();
        const distance = eventTime - now;

        if (distance > 0) {
          setCountdown({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        } else {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [invite]);

  // Prevent right-click and text selection on content
  useEffect(() => {
    if (status === 'verified') {
      const handler = (e: Event) => e.preventDefault();
      document.addEventListener('contextmenu', handler);
      return () => document.removeEventListener('contextmenu', handler);
    }
  }, [status]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image (only for verified status with background_image_url) */}
      {status === 'verified' && invite?.background_image_url && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${invite.background_image_url})` }}
          />
          <div className="absolute inset-0 bg-black/25" />
        </>
      )}
      
      {/* Default gradient background for non-verified states */}
      {(!status || status !== 'verified' || !invite?.background_image_url) && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]" />
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Loading */}
        {status === 'loading' && (
          <div className="text-center">
            <img
              src="/assets/images/The Breed Industries Just Logo-01-01.png"
              alt="Breed Industries"
              className="w-20 h-20 mx-auto mb-6 opacity-90"
            />
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
              <Loader2 className="w-8 h-8 text-[#00e87e] animate-spin" />
            </div>
            <h2 className="text-white text-xl font-semibold">Verifying access...</h2>
            <p className="text-white/50 mt-2 text-sm">Checking your device identity</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="glass-card p-8 text-center border border-red-500/20">
            <img
              src="/assets/images/The Breed Industries Just Logo-01-01.png"
              alt="Breed Industries"
              className="w-16 h-16 mx-auto mb-6 opacity-90"
            />
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-white/60 text-sm">{error}</p>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/40 text-xs">
                If you believe this is an error, please contact the sender.
              </p>
            </div>
          </div>
        )}

        {/* Pending - Email Entry */}
        {status === 'pending' && (
          <div className="glass-card p-8 border border-white/10">
            <div className="text-center mb-6">
              <img
                src="/assets/images/The Breed Industries Just Logo-01-01.png"
                alt="Breed Industries"
                className="w-16 h-16 mx-auto mb-4 opacity-90"
              />
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00e87e]/10 mb-4">
                <Shield className="w-8 h-8 text-[#00e87e]" />
              </div>
              <h2 className="text-white text-xl font-semibold">Secure Invite</h2>
              {recipientName && (
                <p className="text-white/60 text-sm mt-1">For: {recipientName}</p>
              )}
              <p className="text-white/50 text-sm mt-3">
                This invite is locked to one person and one device. Please verify your email to continue.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00e87e]/50 transition"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-[#00e87e] text-black font-semibold py-3 rounded-lg hover:bg-[#00e87e]/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send Verification Code
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 justify-center">
              <Lock className="w-3 h-3 text-white/30" />
              <p className="text-white/30 text-xs">This invite will be locked to your device after verification</p>
            </div>
          </div>
        )}

        {/* OTP Sent - Enter Code */}
        {status === 'otp_sent' && (
          <div className="glass-card p-8 border border-white/10">
            <div className="text-center mb-6">
              <img
                src="/assets/images/The Breed Industries Just Logo-01-01.png"
                alt="Breed Industries"
                className="w-16 h-16 mx-auto mb-4 opacity-90"
              />
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-white text-xl font-semibold">Enter Verification Code</h2>
              <p className="text-white/50 text-sm mt-2">
                We sent a 6-digit code to <span className="text-white/80">{email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium block mb-1.5">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  maxLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-[0.5em] placeholder:text-white/20 focus:outline-none focus:border-[#00e87e]/50 transition font-mono"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#00e87e] text-black font-semibold py-3 rounded-lg hover:bg-[#00e87e]/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Verify & Unlock
              </button>

              <button
                type="button"
                onClick={() => { setStatus('pending'); setOtp(''); setError(''); }}
                className="w-full text-white/50 text-sm hover:text-white/70 transition py-2"
              >
                Use a different email
              </button>
            </form>

            <p className="text-white/30 text-xs text-center mt-4">
              Code expires in 10 minutes
            </p>
          </div>
        )}

        {/* Verified - Show Content */}
        {status === 'verified' && invite && (
          <div className="w-full max-w-3xl mx-auto">
            {/* Glassmorphic Burgundy/Purple Card */}
            <div 
              className="relative overflow-hidden rounded-3xl p-8 md:p-12"
              style={{
                background: 'linear-gradient(135deg, rgba(128, 0, 64, 0.15) 0%, rgba(75, 0, 130, 0.15) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '2px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px 0 rgba(128, 0, 128, 0.3)',
              }}
            >
              {/* Watermark */}
              <div
                className="absolute inset-0 pointer-events-none select-none opacity-[0.03] flex items-center justify-center"
                style={{ transform: 'rotate(-30deg)' }}
              >
                <span className="text-white text-4xl font-bold whitespace-nowrap">
                  {invite.recipient_name || email}
                </span>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                {invite.content?.title && (
                  <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {invite.content.title}
                  </h1>
                )}
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white/90 text-sm font-medium">Verified Invite</span>
                </div>
              </div>

              {/* Content - protected */}
              <div
                className="select-none"
                style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
              >
                {/* Image Display */}
                {invite.image_url && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-[#00e87e]/20 bg-gradient-to-br from-white/5 to-white/10 p-2">
                    <img
                      src={invite.image_url}
                      alt="Invite content"
                      className="w-full h-auto rounded-lg shadow-2xl"
                      style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: 'rgba(255,255,255,0.05)' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Message */}
                {invite.content?.message && (
                  <div className="text-center mb-8">
                    <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
                      {invite.content.message}
                    </p>
                  </div>
                )}

                {/* Countdown Timer */}
                {invite.event_date && (
                  <div className="mb-8">
                    <h3 className="text-white text-center text-xl font-bold mb-6">Event Countdown</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Days', value: countdown.days },
                        { label: 'Hours', value: countdown.hours },
                        { label: 'Minutes', value: countdown.minutes },
                        { label: 'Seconds', value: countdown.seconds },
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <div 
                            className="bg-white/10 rounded-2xl p-4 mb-2 flex items-center justify-center"
                            style={{
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            <div className="text-white text-3xl md:text-4xl font-bold leading-none">
                              {String(item.value).padStart(2, '0')}
                            </div>
                          </div>
                          <div className="text-white/70 text-sm font-medium">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Event Location (only shown after verification) */}
                {invite.event_location && (
                  <button
                    onClick={() => {
                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invite.event_location || '')}`;
                      window.open(mapsUrl, '_blank');
                    }}
                    className="w-full text-center bg-white/10 rounded-2xl p-6 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all cursor-pointer"
                  >
                    <h3 className="text-white text-lg font-bold mb-2">Event Location</h3>
                    <p className="text-white/90 text-base">{invite.event_location}</p>
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#00e87e]/60" />
                  <span className="text-white/30 text-xs">Device-locked</span>
                </div>
                <span className="text-white/30 text-xs">
                  The Breed Industries (PTY) LTD
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
