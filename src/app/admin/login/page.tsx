'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

type Stage = 'form' | 'sent' | 'error';

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<Stage>('form');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStage('sent');
      } else {
        setErrMsg(data.error ?? 'Could not send link. Please try again.');
        setStage('error');
      }
    } catch {
      setErrMsg('Network error. Please try again.');
      setStage('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <PageHero
        title="Admin Login"
        subtitle="Authentication Required"
        description="Access the Breed Industries admin dashboard."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Login', href: '/admin/login' },
        ]}
        size="default"
      />

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="glass-card p-8">

              {/* Icon */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-accent" size={24} />
                </div>
                <h2 className="text-2xl font-heading font-bold text-white mb-2">
                  Admin Access
                </h2>
                <p className="text-white/60 text-sm">
                  Enter your email and we'll send you a secure login link.
                </p>
              </div>

              {/* Unauthorized redirect error */}
              {urlError === 'unauthorized' && stage === 'form' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-5">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-red-400 text-sm">
                    That email isn't authorised for admin access.
                  </p>
                </div>
              )}

              {/* ── Sent state ── */}
              {stage === 'sent' && (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="text-green-400" size={28} />
                  </div>
                  <p className="text-white font-medium">Check your inbox</p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    We've sent a secure login link to <strong className="text-white">{email}</strong>.
                    Click it to access the dashboard — no password needed.
                  </p>
                  <p className="text-white/40 text-xs">Link expires in 1 hour.</p>
                  <button
                    onClick={() => setStage('form')}
                    className="text-accent text-sm hover:underline mt-2"
                  >
                    Resend or use a different email →
                  </button>
                </div>
              )}

              {/* ── Form / Error state ── */}
              {(stage === 'form' || stage === 'error') && (
                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-white/70 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoFocus
                        className="w-full pl-9 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-accent/50 focus:outline-none transition-colors text-sm"
                        placeholder="newbreed.r@gmail.com"
                      />
                    </div>
                  </div>

                  {errMsg && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      <p className="text-red-400 text-sm">{errMsg}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending link…' : 'Send Login Link'}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
        <div className="text-white">Loading…</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
