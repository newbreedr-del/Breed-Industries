'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, RefreshCw, Send, Loader2, CheckCircle, XCircle,
  QrCode, MessageSquare, Phone, Bell, User, Clock,
  AlertTriangle, Search, Users, Zap, BookOpen, ChevronDown,
  ChevronUp, Hash,
} from 'lucide-react';

interface Message {
  id: string; direction: 'inbound' | 'outbound'; phone: string;
  message: string; status: string; sender_name?: string; error?: string; created_at: string;
}
interface StatusData {
  connection: { state: 'open' | 'connecting' | 'close' | 'unknown' };
  messages: Message[]; configured: boolean;
}
interface CRMClient {
  id: string; company_name: string; contact_name: string;
  contact_phone: string; phone_formatted: string; status: string;
}

const QUICK_MSGS = [
  { label: 'Payment reminder', text: 'Hi there, this is a friendly reminder that your invoice is due. Please reply or call 060 496 4105 if you have any questions.\n\n_Breed Industries_' },
  { label: 'Welcome onboarding', text: 'Welcome to Breed Industries! 🎉 Your account is now active. Our team will be in touch within 5 business days to complete your onboarding.\n\n_Breed Industries_' },
  { label: 'Compliance renewal', text: 'Hi! Your compliance item is due for renewal soon. Reply YES and we will handle the renewal on your behalf.\n\n_Breed Industries Compliance Watch_' },
  { label: 'Document request', text: 'Hi, we need a few documents to continue with your application. Please reply or email info@thebreed.co.za with the requested documents.\n\n_Breed Industries_' },
  { label: 'Strategy check-in', text: 'Hi! Your monthly strategy check-in is due. Please reply to schedule a call or visit thebreed.co.za/contact to book a time.\n\n_Breed Industries Growth_' },
];

export default function WhatsAppAdminPage() {
  const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' };
  const inp  = { background: '#1a2535', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' as const };

  // ── Status polling ──────────────────────────────────────────────────────────
  const [status, setStatus]           = useState<StatusData | null>(null);
  const [loading, setLoading]         = useState(true);
  const pollRef                        = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/whatsapp/status', { credentials: 'include' });
      if (res.ok) setStatus(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchStatus();
    pollRef.current = setInterval(fetchStatus, 15_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchStatus]);

  const connected   = status?.connection?.state === 'open';
  const stateColour = { open:'text-green-400', connecting:'text-yellow-400', close:'text-red-400', unknown:'text-slate-400' }[status?.connection?.state ?? 'unknown'];
  const stateLabel  = { open:'Connected', connecting:'Connecting…', close:'Disconnected', unknown:'Not configured' }[status?.connection?.state ?? 'unknown'];

  // ── QR / webhook ────────────────────────────────────────────────────────────
  const [qrCode, setQrCode]                   = useState<string | null>(null);
  const [qrLoading, setQrLoading]             = useState(false);
  const [registeringWebhook, setRegWH]        = useState(false);
  const [webhookDone, setWebhookDone]         = useState(false);

  const fetchQR = async () => {
    setQrLoading(true); setQrCode(null);
    try {
      const d = await fetch('/api/whatsapp/connect', { credentials: 'include' }).then(r => r.json());
      if (d.qrCode) setQrCode(d.qrCode);
    } finally { setQrLoading(false); }
  };
  const registerWebhook = async () => {
    setRegWH(true);
    const d = await fetch('/api/whatsapp/connect', { method:'POST', credentials:'include' }).then(r => r.json());
    setWebhookDone(d.success); setRegWH(false);
  };

  // ── Send single message ─────────────────────────────────────────────────────
  const [sendPhone, setSendPhone]     = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [sending, setSending]         = useState(false);
  const [sendResult, setSendResult]   = useState<{ok:boolean;msg:string}|null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault(); setSending(true); setSendResult(null);
    const d = await fetch('/api/whatsapp/send', {
      method:'POST', credentials:'include',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ phone: sendPhone, message: sendMessage }),
    }).then(r => r.json());
    setSendResult({ ok: d.success, msg: d.success ? 'Sent!' : (d.error ?? 'Failed') });
    if (d.success) { setSendMessage(''); fetchStatus(); }
    setSending(false);
  };

  // ── CRM client lookup ────────────────────────────────────────────────────────
  const [clientSearch, setClientSearch]   = useState('');
  const [clients, setClients]             = useState<CRMClient[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const searchRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(async () => {
      setClientsLoading(true);
      const d = await fetch(`/api/whatsapp/clients?q=${encodeURIComponent(clientSearch)}`, { credentials:'include' }).then(r => r.json()).catch(() => ({clients:[]}));
      setClients(d.clients ?? []);
      setClientsLoading(false);
    }, 300);
  }, [clientSearch]);

  const selectClient = (c: CRMClient) => {
    setSendPhone(c.phone_formatted);
    setClientSearch('');
  };

  // ── Broadcast ────────────────────────────────────────────────────────────────
  const [broadcastMsg, setBroadcastMsg]   = useState('');
  const [broadcastTargets, setBcTargets]  = useState<CRMClient[]>([]);
  const [bcSearch, setBcSearch]           = useState('');
  const [bcClients, setBcClients]         = useState<CRMClient[]>([]);
  const [bcLoading, setBcLoading]         = useState(false);
  const [bcSending, setBcSending]         = useState(false);
  const [bcResults, setBcResults]         = useState<{phone:string;ok:boolean}[]>([]);
  const [showBc, setShowBc]               = useState(false);
  const bcRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => {
    if (!showBc) return;
    if (bcRef.current) clearTimeout(bcRef.current);
    bcRef.current = setTimeout(async () => {
      setBcLoading(true);
      const d = await fetch(`/api/whatsapp/clients?q=${encodeURIComponent(bcSearch)}`, { credentials:'include' }).then(r => r.json()).catch(() => ({clients:[]}));
      setBcClients(d.clients ?? []);
      setBcLoading(false);
    }, 300);
  }, [bcSearch, showBc]);

  const toggleBcTarget = (c: CRMClient) => {
    setBcTargets(prev => prev.find(x => x.id === c.id) ? prev.filter(x => x.id !== c.id) : [...prev, c]);
  };

  const handleBroadcast = async () => {
    if (!broadcastMsg.trim() || !broadcastTargets.length) return;
    setBcSending(true); setBcResults([]);
    const results: {phone:string;ok:boolean}[] = [];
    for (const c of broadcastTargets) {
      const d = await fetch('/api/whatsapp/send', {
        method:'POST', credentials:'include',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ phone: c.phone_formatted, message: broadcastMsg }),
      }).then(r => r.json()).catch(() => ({success:false}));
      results.push({ phone: c.phone_formatted, ok: d.success });
      await new Promise(r => setTimeout(r, 800)); // 800ms gap between messages
    }
    setBcResults(results); setBcSending(false); fetchStatus();
  };

  // ── Collapsed sections ───────────────────────────────────────────────────────
  const [showCommands, setShowCommands] = useState(false);

  return (
    <div className="min-h-screen" style={{ background:'#0B1118' }}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-5">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"><ArrowLeft size={20} /></Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">WhatsApp Agent</h1>
            <p className="text-slate-400 text-sm">Breed Agent — Evolution API</p>
          </div>
          <button onClick={() => { setLoading(true); fetchStatus(); }} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* ── Status banner ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Connection */}
          <div className="flex items-center gap-3 p-4 rounded-xl" style={card}>
            <div className={`w-3 h-3 rounded-full shrink-0 ${connected ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-400'}`} />
            <div>
              <p className={`font-semibold text-sm ${stateColour}`}>{stateLabel}</p>
              <p className="text-slate-500 text-xs">{connected ? 'Session persistent — no re-scan needed' : 'Scan QR to connect'}</p>
            </div>
          </div>
          {/* Agent / Business number */}
          <div className="flex items-center gap-3 p-4 rounded-xl" style={card}>
            <Hash size={16} className="text-orange-400 shrink-0" />
            <div>
              <p className="text-white text-sm font-semibold">Agent (Business) Number</p>
              <p className="text-orange-400 text-xs font-mono">27685834837</p>
              <p className="text-slate-600 text-xs">Clients message this → you get alerts on 27604964105</p>
            </div>
          </div>
          {/* Message count */}
          <div className="flex items-center gap-3 p-4 rounded-xl" style={card}>
            <MessageSquare size={16} className="text-blue-400 shrink-0" />
            <div>
              <p className="text-white text-sm font-semibold">Messages (last 50)</p>
              <p className="text-slate-400 text-xs">
                {status?.messages?.filter(m => m.direction === 'inbound').length ?? 0} inbound &nbsp;·&nbsp;
                {status?.messages?.filter(m => m.direction === 'outbound').length ?? 0} outbound
              </p>
            </div>
          </div>
        </div>

        {/* ── Setup warning ──────────────────────────────────────────────────── */}
        {!status?.configured && (
          <div className="p-5 rounded-xl" style={{ background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.2)' }}>
            <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2"><AlertTriangle size={15} /> Evolution API not configured</h3>
            <pre className="text-xs text-slate-300 font-mono leading-6 overflow-x-auto whitespace-pre-wrap">
{`EVOLUTION_API_URL=https://your-url.up.railway.app
EVOLUTION_API_KEY=your_key
EVOLUTION_INSTANCE_NAME=breed-agent
EVOLUTION_WEBHOOK_URL=https://www.thebreed.co.za/api/whatsapp/webhook
WHATSAPP_ADMIN_NUMBER=27604964105`}
            </pre>
            <p className="text-yellow-400/60 text-xs mt-2">See <strong>WHATSAPP_SETUP.md</strong> for full Railway guide.</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ── Left column — connect + controls ─────────────────────────────── */}
          <div className="space-y-4">

            {/* QR connect */}
            {!connected && (
              <div className="p-5 rounded-xl space-y-3" style={card}>
                <p className="text-white font-semibold flex items-center gap-2"><QrCode size={16} className="text-orange-400" /> Connect WhatsApp</p>
                <p className="text-slate-400 text-xs">Scan once — session is saved to database. No re-scan after restarts.</p>
                <button onClick={fetchQR} disabled={qrLoading} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black" style={{ background:'#FF9F00' }}>
                  {qrLoading ? <Loader2 size={13} className="animate-spin" /> : <QrCode size={13} />}
                  {qrLoading ? 'Generating…' : 'Get QR Code'}
                </button>
                {qrCode && (
                  <>
                    <div className="flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrCode} alt="WhatsApp QR" className="w-48 h-48 rounded-xl bg-white p-2" />
                    </div>
                    <p className="text-slate-600 text-xs text-center">Expires in ~60 s — page auto-refreshes</p>
                  </>
                )}
              </div>
            )}

            {/* Webhook */}
            <div className="p-5 rounded-xl" style={card}>
              <p className="text-white font-semibold flex items-center gap-2 mb-2"><Bell size={15} className="text-orange-400" /> Webhook</p>
              <p className="text-slate-500 text-xs mb-3">Register once so Evolution API knows where to send events.</p>
              <button onClick={registerWebhook} disabled={registeringWebhook} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white" style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)' }}>
                {registeringWebhook ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                {registeringWebhook ? 'Registering…' : 'Register Webhook'}
              </button>
              {webhookDone && <p className="text-green-400 text-xs mt-2 flex items-center gap-1"><CheckCircle size={11} /> Registered</p>}
            </div>

            {/* Agent command reference */}
            <div className="rounded-xl overflow-hidden" style={card}>
              <button onClick={() => setShowCommands(v => !v)} className="w-full flex items-center gap-2 p-4 text-white font-semibold text-sm hover:bg-white/5 transition-colors">
                <BookOpen size={15} className="text-orange-400" />
                Agent Commands (from your phone)
                {showCommands ? <ChevronUp size={14} className="ml-auto text-slate-400" /> : <ChevronDown size={14} className="ml-auto text-slate-400" />}
              </button>
              {showCommands && (
                <div className="px-4 pb-4 space-y-2 text-xs text-slate-400">
                  {[
                    ['HELP', 'List all commands'],
                    ['STATUS', 'Check connection state'],
                    ['LIST', 'Show CRM clients + numbers'],
                    ['SEND 27820001234 message', 'Send to a specific number'],
                    ['@27820001234 message', 'Shorthand send'],
                  ].map(([cmd, desc]) => (
                    <div key={cmd} className="flex gap-3">
                      <code className="text-orange-400 font-mono shrink-0">{cmd}</code>
                      <span className="text-slate-500">{desc}</span>
                    </div>
                  ))}
                  <p className="text-slate-600 mt-2 pt-2 border-t border-white/8">
                    When a client messages the agent, you get a WhatsApp alert on <span className="text-orange-400">27604964105</span> with a ready-to-use SEND reply.
                  </p>
                </div>
              )}
            </div>

            {/* Quick templates */}
            <div className="p-5 rounded-xl" style={card}>
              <p className="text-white font-semibold flex items-center gap-2 mb-3"><Zap size={15} className="text-orange-400" /> Quick Templates</p>
              <div className="space-y-1.5">
                {QUICK_MSGS.map(t => (
                  <button key={t.label} onClick={() => setSendMessage(t.text)} className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white transition-all" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Middle column — send + CRM lookup ────────────────────────────── */}
          <div className="space-y-4">

            {/* CRM client search */}
            <div className="p-5 rounded-xl" style={card}>
              <p className="text-white font-semibold flex items-center gap-2 mb-3"><Users size={15} className="text-orange-400" /> Find Client</p>
              <div className="relative mb-2">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg text-white text-sm outline-none"
                  style={inp}
                  placeholder="Search by name, company or phone…"
                  value={clientSearch}
                  onChange={e => setClientSearch(e.target.value)}
                />
              </div>
              {clientsLoading && <div className="flex justify-center py-3"><Loader2 size={16} className="animate-spin text-slate-500" /></div>}
              {!clientsLoading && clients.length > 0 && (
                <div className="space-y-1 max-h-52 overflow-y-auto">
                  {clients.map(c => (
                    <button key={c.id} onClick={() => selectClient(c)} className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between gap-2 hover:bg-white/6 transition-colors">
                      <div>
                        <p className="text-white text-xs font-medium">{c.company_name || c.contact_name}</p>
                        <p className="text-slate-500 text-xs font-mono">{c.phone_formatted}</p>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${c.status === 'Active' ? 'text-green-400 bg-green-400/10' : 'text-slate-400 bg-white/5'}`}>{c.status}</span>
                    </button>
                  ))}
                </div>
              )}
              {!clientsLoading && clientSearch && clients.length === 0 && (
                <p className="text-slate-600 text-xs text-center py-3">No clients found with a phone number</p>
              )}
            </div>

            {/* Single send */}
            <div className="p-5 rounded-xl" style={card}>
              <p className="text-white font-semibold flex items-center gap-2 mb-4"><Send size={15} className="text-orange-400" /> Send Message</p>
              <form onSubmit={handleSend} className="space-y-3">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Phone</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input required className="w-full pl-8 pr-3 py-2.5 rounded-lg text-white text-sm outline-none" style={inp} placeholder="27820001234" value={sendPhone} onChange={e => setSendPhone(e.target.value)} />
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5">Select a client above or type 27XXXXXXXXX</p>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Message</label>
                  <textarea required rows={5} className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none resize-none" style={inp} placeholder="Type your message…" value={sendMessage} onChange={e => setSendMessage(e.target.value)} />
                </div>
                {sendResult && (
                  <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${sendResult.ok ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {sendResult.ok ? <CheckCircle size={13} /> : <XCircle size={13} />} {sendResult.msg}
                  </div>
                )}
                <button type="submit" disabled={sending || !connected} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black disabled:opacity-50" style={{ background:'#FF9F00' }}>
                  {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  {sending ? 'Sending…' : connected ? 'Send to Client' : 'Connect first'}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right column — broadcast + message log ────────────────────────── */}
          <div className="space-y-4">

            {/* Broadcast */}
            <div className="rounded-xl overflow-hidden" style={card}>
              <button onClick={() => setShowBc(v => !v)} className="w-full flex items-center gap-2 p-4 text-white font-semibold text-sm hover:bg-white/5 transition-colors">
                <Users size={15} className="text-orange-400" />
                Broadcast to Multiple Clients
                {showBc ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
              </button>
              {showBc && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input className="w-full pl-8 pr-3 py-2 rounded-lg text-white text-xs outline-none" style={inp} placeholder="Search clients to add…" value={bcSearch} onChange={e => setBcSearch(e.target.value)} />
                  </div>
                  {/* Client picker */}
                  {bcLoading && <Loader2 size={14} className="animate-spin text-slate-500 mx-auto block" />}
                  {!bcLoading && bcClients.length > 0 && (
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {bcClients.map(c => {
                        const selected = !!broadcastTargets.find(x => x.id === c.id);
                        return (
                          <button key={c.id} onClick={() => toggleBcTarget(c)} className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs transition-colors ${selected ? 'bg-orange-500/15 text-white' : 'text-slate-300 hover:bg-white/5'}`}>
                            <div className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${selected ? 'bg-orange-500 border-orange-500' : 'border-slate-500'}`}>
                              {selected && <CheckCircle size={10} className="text-black" />}
                            </div>
                            <span className="truncate">{c.company_name || c.contact_name}</span>
                            <span className="text-slate-600 font-mono ml-auto">{c.phone_formatted.slice(-6)}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {/* Selected targets */}
                  {broadcastTargets.length > 0 && (
                    <div className="p-2 rounded-lg" style={{ background:'rgba(255,159,0,0.08)', border:'1px solid rgba(255,159,0,0.2)' }}>
                      <p className="text-orange-400 text-xs font-medium mb-1">{broadcastTargets.length} recipient{broadcastTargets.length !== 1 ? 's' : ''} selected</p>
                      <div className="flex flex-wrap gap-1">
                        {broadcastTargets.map(c => (
                          <button key={c.id} onClick={() => toggleBcTarget(c)} className="text-xs px-2 py-0.5 rounded-full text-white/70 hover:text-red-400 transition-colors" style={{ background:'rgba(255,255,255,0.08)' }}>
                            {c.company_name || c.contact_name} ×
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Broadcast message */}
                  <textarea rows={3} className="w-full px-3 py-2 rounded-lg text-white text-xs outline-none resize-none" style={inp} placeholder="Broadcast message…" value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} />
                  <button onClick={handleBroadcast} disabled={bcSending || !connected || !broadcastTargets.length || !broadcastMsg.trim()} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black disabled:opacity-50" style={{ background:'#FF9F00' }}>
                    {bcSending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    {bcSending ? `Sending (${bcResults.length}/${broadcastTargets.length})…` : `Broadcast to ${broadcastTargets.length} client${broadcastTargets.length !== 1 ? 's' : ''}`}
                  </button>
                  {bcResults.length > 0 && !bcSending && (
                    <div className="space-y-1">
                      {bcResults.map(r => (
                        <p key={r.phone} className={`text-xs flex items-center gap-2 ${r.ok ? 'text-green-400' : 'text-red-400'}`}>
                          {r.ok ? <CheckCircle size={11} /> : <XCircle size={11} />} {r.phone}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Message log */}
            <div className="p-5 rounded-xl flex flex-col" style={card}>
              <p className="text-white font-semibold flex items-center gap-2 mb-3">
                <MessageSquare size={15} className="text-orange-400" /> Message Log
                <span className="ml-auto text-slate-600 text-xs font-normal">Last 50</span>
              </p>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-500" size={18} /></div>
              ) : !status?.messages?.length ? (
                <p className="text-slate-500 text-xs text-center py-8">No messages yet</p>
              ) : (
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {status.messages.map(m => (
                    <div key={m.id} className={`flex gap-2.5 p-3 rounded-lg ${m.direction === 'inbound' ? 'bg-blue-500/6 border-l-2 border-blue-500/40' : 'bg-orange-500/6 border-l-2 border-orange-500/40'}`}>
                      <div className="shrink-0 mt-0.5">
                        {m.direction === 'inbound' ? <User size={13} className="text-blue-400" /> : <Send size={13} className="text-orange-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white/60 text-xs font-mono truncate">{m.phone}</span>
                          {m.sender_name && <span className="text-white/35 text-xs shrink-0">({m.sender_name})</span>}
                          <span className={`ml-auto text-xs shrink-0 ${m.status === 'failed' ? 'text-red-400' : 'text-slate-600'}`}>{m.status}</span>
                        </div>
                        <p className="text-white/75 text-xs leading-relaxed break-words">{m.message.slice(0, 180)}{m.message.length > 180 ? '…' : ''}</p>
                        <div className="flex items-center gap-1 mt-1 text-slate-700 text-xs">
                          <Clock size={9} />
                          {new Date(m.created_at).toLocaleString('en-ZA', { timeZone:'Africa/Johannesburg', hour12:false })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
