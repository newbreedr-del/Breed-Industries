'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Wifi, WifiOff, RefreshCw, Send, Loader2,
  CheckCircle, XCircle, QrCode, MessageSquare, Phone,
  Bell, User, Clock, AlertTriangle,
} from 'lucide-react';

interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  phone: string;
  message: string;
  status: string;
  sender_name?: string;
  error?: string;
  created_at: string;
}

interface StatusData {
  connection: { state: 'open' | 'connecting' | 'close' | 'unknown' };
  messages: Message[];
  configured: boolean;
}

const QUICK_MSGS = [
  { label: 'Payment reminder', text: 'Hi {name}, this is a friendly reminder that your invoice is due. Reply or call 060 496 4105 if you have questions.\n\n_Breed Industries_' },
  { label: 'Onboarding welcome', text: 'Hi {name}! Welcome to Breed Industries. Your account is now active and our team will contact you within 5 business days to complete your onboarding.\n\n_Breed Industries_' },
  { label: 'Compliance alert', text: 'Hi {name}, your compliance item is due for renewal soon. Reply YES and we will handle it for you.\n\n_Breed Industries Compliance Watch_' },
];

export default function WhatsAppAdminPage() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [sendPhone, setSendPhone] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [registeringWebhook, setRegisteringWebhook] = useState(false);
  const [webhookDone, setWebhookDone] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/status', { credentials: 'include' });
      if (res.ok) setStatus(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    pollRef.current = setInterval(fetchStatus, 15_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const fetchQR = async () => {
    setQrLoading(true);
    setQrCode(null);
    try {
      const res = await fetch('/api/whatsapp/connect', { credentials: 'include' });
      const data = await res.json();
      if (data.qrCode) setQrCode(data.qrCode);
    } finally {
      setQrLoading(false);
    }
  };

  const registerWebhook = async () => {
    setRegisteringWebhook(true);
    const res = await fetch('/api/whatsapp/connect', { method: 'POST', credentials: 'include' });
    const data = await res.json();
    setWebhookDone(data.success);
    setRegisteringWebhook(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendResult(null);
    const res = await fetch('/api/whatsapp/send', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: sendPhone, message: sendMessage }),
    });
    const data = await res.json();
    setSendResult({ ok: data.success, msg: data.success ? 'Message sent!' : (data.error ?? 'Failed') });
    if (data.success) { setSendMessage(''); fetchStatus(); }
    setSending(false);
  };

  const connected = status?.connection?.state === 'open';
  const stateColor = {
    open: 'text-green-400',
    connecting: 'text-yellow-400',
    close: 'text-red-400',
    unknown: 'text-slate-400',
  }[status?.connection?.state ?? 'unknown'];

  const stateLabel = {
    open: 'Connected',
    connecting: 'Connecting…',
    close: 'Disconnected',
    unknown: 'Not configured',
  }[status?.connection?.state ?? 'unknown'];

  const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' };

  return (
    <div className="min-h-screen" style={{ background: '#0B1118' }}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">WhatsApp Agent</h1>
            <p className="text-slate-400 text-sm">Evolution API — Breed Agent</p>
          </div>
          <button
            onClick={() => { setLoading(true); fetchStatus(); }}
            className="ml-auto p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Status banner */}
        <div className="flex items-center gap-4 p-5 rounded-xl" style={card}>
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-400'}`} />
          <div>
            <p className={`font-semibold ${stateColor}`}>{stateLabel}</p>
            <p className="text-slate-500 text-xs">
              {connected
                ? 'Agent is online and ready to send/receive messages'
                : 'Scan QR code below to connect your WhatsApp number'}
            </p>
          </div>
          {!status?.configured && (
            <div className="ml-auto flex items-center gap-2 text-yellow-400 text-sm">
              <AlertTriangle size={15} />
              Evolution API env vars missing
            </div>
          )}
          {connected && (
            <div className="ml-auto flex items-center gap-2 text-green-400 text-sm font-medium">
              <CheckCircle size={15} />
              Session active — no re-scan needed
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left — QR + Webhook setup */}
          <div className="space-y-4">

            {/* QR Code panel */}
            {!connected && (
              <div className="p-6 rounded-xl space-y-4" style={card}>
                <div className="flex items-center gap-2 text-white font-semibold mb-1">
                  <QrCode size={18} className="text-orange-400" />
                  Connect WhatsApp
                </div>
                <p className="text-slate-400 text-sm">
                  Click below to generate a QR code, then scan it with the dedicated WhatsApp number.
                  The session is stored in your database — <strong className="text-white">you only scan once</strong>.
                </p>
                <button
                  onClick={fetchQR}
                  disabled={qrLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black"
                  style={{ background: '#FF9F00' }}
                >
                  {qrLoading ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />}
                  {qrLoading ? 'Generating QR…' : 'Get QR Code'}
                </button>
                {qrCode && (
                  <div className="flex justify-center pt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrCode} alt="WhatsApp QR Code" className="w-52 h-52 rounded-xl bg-white p-2" />
                  </div>
                )}
                {qrCode && (
                  <p className="text-slate-500 text-xs text-center">
                    QR expires in ~60 seconds. Scan quickly — this page auto-refreshes status every 15 s.
                  </p>
                )}
              </div>
            )}

            {/* Webhook setup */}
            <div className="p-6 rounded-xl" style={card}>
              <div className="flex items-center gap-2 text-white font-semibold mb-3">
                <Bell size={16} className="text-orange-400" />
                Webhook Registration
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Run once after deploying to register your webhook URL with Evolution API.
                This tells Evolution API where to send incoming messages.
              </p>
              <button
                onClick={registerWebhook}
                disabled={registeringWebhook}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {registeringWebhook ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                {registeringWebhook ? 'Registering…' : 'Register Webhook'}
              </button>
              {webhookDone && (
                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                  <CheckCircle size={12} /> Webhook registered successfully
                </p>
              )}
            </div>

            {/* Quick message templates */}
            <div className="p-6 rounded-xl" style={card}>
              <p className="text-white font-semibold mb-3 flex items-center gap-2">
                <MessageSquare size={16} className="text-orange-400" /> Quick Templates
              </p>
              <div className="space-y-2">
                {QUICK_MSGS.map(t => (
                  <button
                    key={t.label}
                    onClick={() => setSendMessage(t.text)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Send message + log */}
          <div className="space-y-4">

            {/* Manual send */}
            <div className="p-6 rounded-xl" style={card}>
              <p className="text-white font-semibold mb-4 flex items-center gap-2">
                <Send size={16} className="text-orange-400" /> Send Message
              </p>
              <form onSubmit={handleSend} className="space-y-3">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      required
                      className="w-full pl-8 pr-3 py-2.5 rounded-lg text-white text-sm outline-none"
                      style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.12)' }}
                      placeholder="27820001234"
                      value={sendPhone}
                      onChange={e => setSendPhone(e.target.value)}
                    />
                  </div>
                  <p className="text-slate-600 text-xs mt-1">Format: 27XXXXXXXXX (no spaces, + or 0)</p>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none resize-none"
                    style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.12)' }}
                    placeholder="Type your message…"
                    value={sendMessage}
                    onChange={e => setSendMessage(e.target.value)}
                  />
                </div>
                {sendResult && (
                  <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${sendResult.ok ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {sendResult.ok ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {sendResult.msg}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={sending || !connected}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#FF9F00' }}
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {sending ? 'Sending…' : connected ? 'Send Message' : 'Connect WhatsApp first'}
                </button>
              </form>
            </div>

            {/* Message log */}
            <div className="p-6 rounded-xl" style={card}>
              <p className="text-white font-semibold mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-orange-400" />
                Recent Messages
                <span className="ml-auto text-slate-500 text-xs font-normal">Last 50</span>
              </p>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-500" size={20} /></div>
              ) : !status?.messages?.length ? (
                <p className="text-slate-500 text-sm text-center py-8">No messages yet</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {status.messages.map(m => (
                    <div
                      key={m.id}
                      className={`flex gap-3 p-3 rounded-lg text-sm ${
                        m.direction === 'inbound' ? 'bg-blue-500/8 border-l-2 border-blue-500/40' : 'bg-orange-500/8 border-l-2 border-orange-500/40'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {m.direction === 'inbound'
                          ? <User size={14} className="text-blue-400" />
                          : <Send size={14} className="text-orange-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white/70 text-xs font-mono">{m.phone}</span>
                          {m.sender_name && <span className="text-white/40 text-xs">({m.sender_name})</span>}
                          <span className={`ml-auto text-xs ${m.status === 'failed' ? 'text-red-400' : 'text-slate-500'}`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-white/80 text-xs leading-relaxed break-words">{m.message.slice(0, 200)}</p>
                        <div className="flex items-center gap-1 mt-1 text-slate-600 text-xs">
                          <Clock size={10} />
                          {new Date(m.created_at).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg', hour12: false })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Setup guide */}
        {!status?.configured && (
          <div className="p-6 rounded-xl" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Setup Required — Add these to your environment</h3>
            <pre className="text-xs text-slate-300 font-mono leading-6 overflow-x-auto">
{`EVOLUTION_API_URL=https://your-evolution-api.up.railway.app
EVOLUTION_API_KEY=your_api_key_here
EVOLUTION_INSTANCE_NAME=breed-agent
EVOLUTION_WEBHOOK_URL=https://www.thebreed.co.za/api/whatsapp/webhook
WHATSAPP_ADMIN_NUMBER=27XXXXXXXXX`}
            </pre>
            <p className="text-yellow-400/70 text-xs mt-3">
              See <strong>WHATSAPP_SETUP.md</strong> in the project root for Railway deployment instructions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
