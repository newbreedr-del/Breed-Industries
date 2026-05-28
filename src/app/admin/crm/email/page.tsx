'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Mail, Users, FileText, RefreshCw, Check, Loader2, X } from 'lucide-react';

interface Client { id: string; company_name: string; contact_email: string; }
interface ClientService { id: string; service_name: string; billing_type: string; renewal_date: string; amount_rands: number; }
interface EmailSend { id: string; recipient_name: string; recipient_email: string; template_type: string; subject: string; status: string; sent_at: string; }

const PAGE_SIZE = 25;

export default function EmailCampaignsPage() {
  const [clients, setClients]   = useState<Client[]>([]);
  const [events, setEvents]     = useState<string[]>([]);
  const [history, setHistory]   = useState<EmailSend[]>([]);
  const [page, setPage]         = useState(0);
  const [loading, setLoading]   = useState(true);

  // Event thank you
  const [tyEvent, setTyEvent]   = useState('');
  const [tyCount, setTyCount]   = useState(0);
  const [tySending, setTySending] = useState(false);
  const [tyResult, setTyResult] = useState('');

  // Payment reminder
  const [prClient, setPrClient] = useState('');
  const [prServices, setPrServices] = useState<ClientService[]>([]);
  const [prService, setPrService] = useState('');
  const [prSending, setPrSending] = useState(false);
  const [prResult, setPrResult] = useState('');

  // Document renewal
  const [drClient, setDrClient] = useState('');
  const [drServices, setDrServices] = useState<ClientService[]>([]);
  const [drService, setDrService] = useState('');
  const [drSending, setDrSending] = useState(false);
  const [drResult, setDrResult] = useState('');

  // Monthly check-in
  const [ciClient, setCiClient] = useState('all');
  const [ciSending, setCiSending] = useState(false);
  const [ciResult, setCiResult] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/crm/clients', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/crm/leads', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/crm/email/history', { credentials: 'include' }).then(r => r.ok ? r.json() : { sends: [] }),
    ]).then(([cd, ld, ed]) => {
      setClients(cd.clients || []);
      const evts = [...new Set((ld.leads || []).map((l: any) => l.source_event).filter(Boolean))];
      setEvents(evts as string[]);
      setHistory(ed.sends || []);
    }).finally(() => setLoading(false));
  }, []);

  // Load ty count when event changes
  useEffect(() => {
    if (!tyEvent) { setTyCount(0); return; }
    fetch(`/api/crm/leads?event=${encodeURIComponent(tyEvent)}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setTyCount((d.leads || []).filter((l: any) => !l.thank_you_sent && l.email).length));
  }, [tyEvent]);

  // Load services when payment reminder client changes
  useEffect(() => {
    if (!prClient) { setPrServices([]); return; }
    fetch(`/api/crm/clients/${prClient}/services`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setPrServices(d.services || []));
  }, [prClient]);

  // Load services with renewal date when doc renewal client changes
  useEffect(() => {
    if (!drClient) { setDrServices([]); return; }
    fetch(`/api/crm/clients/${drClient}/services`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setDrServices((d.services || []).filter((s: any) => s.renewal_date)));
  }, [drClient]);

  const sendEmail = async (template: string, recipient_type: string, recipient_id: string, extra?: object) => {
    const res = await fetch('/api/crm/email/send', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template, recipient_type, recipient_id, ...extra }),
    });
    return res.ok;
  };

  const handleTySend = async () => {
    if (!tyEvent) return;
    setTySending(true);
    const res = await fetch('/api/crm/email/bulk', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_name: tyEvent, template: 'event_thank_you' }),
    });
    const data = await res.json();
    setTyResult(`✓ ${data.sent} sent${data.failed > 0 ? `, ${data.failed} failed` : ''}`);
    setTySending(false);
  };

  const handlePrSend = async () => {
    if (!prClient || !prService) return;
    setPrSending(true);
    const service = prServices.find(s => s.id === prService);
    const ok = await sendEmail('payment_reminder', 'client', prClient, { custom_message: `Service: ${service?.service_name}`, amount_rands: service?.amount_rands, service_name: service?.service_name });
    setPrResult(ok ? '✓ Payment reminder sent' : '✗ Failed to send');
    setPrSending(false);
  };

  const handleDrSend = async () => {
    if (!drClient || !drService) return;
    setDrSending(true);
    const service = drServices.find(s => s.id === drService);
    const ok = await sendEmail('document_renewal', 'client', drClient, { service_name: service?.service_name, renewal_date: service?.renewal_date });
    setDrResult(ok ? '✓ Renewal alert sent' : '✗ Failed to send');
    setDrSending(false);
  };

  const handleCiSend = async () => {
    setCiSending(true);
    const targets = ciClient === 'all' ? clients.filter(c => c.contact_email) : clients.filter(c => c.id === ciClient && c.contact_email);
    let ok = 0;
    for (const c of targets) {
      const success = await sendEmail('service_checkin', 'client', c.id);
      if (success) ok++;
    }
    setCiResult(`✓ ${ok} check-in${ok !== 1 ? 's' : ''} sent`);
    setCiSending(false);
  };

  const panelClass = 'rounded-xl p-5';
  const panelStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' };
  const inputClass = 'w-full px-3 py-2 rounded-lg text-white text-sm outline-none focus:ring-1 focus:ring-orange-500/50 transition-all';
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const sendBtnClass = 'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-black disabled:opacity-50';

  const paged = history.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-deep, #0B1118)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/crm" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Email Campaigns</h1>
            <p className="text-slate-400 text-sm mt-0.5">Send targeted emails to clients and leads</p>
          </div>
        </div>

        {/* Quick send panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

          {/* Event Thank You */}
          <div className={panelClass} style={panelStyle}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-400/10"><Mail size={16} className="text-blue-400" /></div>
              <h2 className="text-white font-semibold">Event Thank You</h2>
            </div>
            <div className="space-y-3">
              <select className={inputClass} style={inputStyle} value={tyEvent} onChange={e => setTyEvent(e.target.value)}>
                <option value="">Select event…</option>
                {events.map(ev => <option key={ev} value={ev}>{ev}</option>)}
              </select>
              {tyEvent && <p className="text-slate-400 text-xs">{tyCount} unsent lead{tyCount !== 1 ? 's' : ''} with email for this event</p>}
              {tyResult && <p className="text-green-400 text-xs">{tyResult}</p>}
              <button onClick={handleTySend} disabled={!tyEvent || tyCount === 0 || tySending} className={sendBtnClass} style={{ background: '#FF9F00' }}>
                {tySending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send to All ({tyCount})
              </button>
            </div>
          </div>

          {/* Payment Reminder */}
          <div className={panelClass} style={panelStyle}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-yellow-400/10"><FileText size={16} className="text-yellow-400" /></div>
              <h2 className="text-white font-semibold">Payment Reminder</h2>
            </div>
            <div className="space-y-3">
              <select className={inputClass} style={inputStyle} value={prClient} onChange={e => { setPrClient(e.target.value); setPrService(''); }}>
                <option value="">Select client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
              {prServices.length > 0 && (
                <select className={inputClass} style={inputStyle} value={prService} onChange={e => setPrService(e.target.value)}>
                  <option value="">Select service…</option>
                  {prServices.map(s => <option key={s.id} value={s.id}>{s.service_name} {s.amount_rands > 0 ? `(R${s.amount_rands})` : ''}</option>)}
                </select>
              )}
              {prResult && <p className="text-green-400 text-xs">{prResult}</p>}
              <button onClick={handlePrSend} disabled={!prClient || !prService || prSending} className={sendBtnClass} style={{ background: '#FF9F00' }}>
                {prSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send Reminder
              </button>
            </div>
          </div>

          {/* Document Renewal */}
          <div className={panelClass} style={panelStyle}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-red-400/10"><FileText size={16} className="text-red-400" /></div>
              <h2 className="text-white font-semibold">Document Renewal Alert</h2>
            </div>
            <div className="space-y-3">
              <select className={inputClass} style={inputStyle} value={drClient} onChange={e => { setDrClient(e.target.value); setDrService(''); }}>
                <option value="">Select client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
              {drServices.length > 0 ? (
                <select className={inputClass} style={inputStyle} value={drService} onChange={e => setDrService(e.target.value)}>
                  <option value="">Select document…</option>
                  {drServices.map(s => <option key={s.id} value={s.id}>{s.service_name} — renews {s.renewal_date}</option>)}
                </select>
              ) : drClient ? (
                <p className="text-slate-500 text-xs">No services with renewal dates set.</p>
              ) : null}
              {drResult && <p className="text-green-400 text-xs">{drResult}</p>}
              <button onClick={handleDrSend} disabled={!drClient || !drService || drSending} className={sendBtnClass} style={{ background: '#FF9F00' }}>
                {drSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send Alert
              </button>
            </div>
          </div>

          {/* Monthly Check-in */}
          <div className={panelClass} style={panelStyle}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-green-400/10"><Users size={16} className="text-green-400" /></div>
              <h2 className="text-white font-semibold">Monthly Check-in</h2>
            </div>
            <div className="space-y-3">
              <select className={inputClass} style={inputStyle} value={ciClient} onChange={e => setCiClient(e.target.value)}>
                <option value="all">All Active Clients ({clients.filter(c => c.contact_email).length})</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
              {ciResult && <p className="text-green-400 text-xs">{ciResult}</p>}
              <button onClick={handleCiSend} disabled={ciSending} className={sendBtnClass} style={{ background: '#FF9F00' }}>
                {ciSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send Check-in
              </button>
            </div>
          </div>

        </div>

        {/* Send history */}
        <div className="rounded-xl overflow-hidden" style={panelStyle}>
          <div className="p-4 border-b border-white/8 flex items-center justify-between">
            <h2 className="text-white font-semibold">Send History</h2>
            <span className="text-slate-400 text-sm">{history.length} total</span>
          </div>
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No emails sent yet.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/8">
                    {['Date', 'Recipient', 'Template', 'Subject', 'Status'].map(h => (
                      <th key={h} className="text-left text-slate-400 font-medium px-4 py-3 text-xs">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {paged.map(e => (
                      <tr key={e.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{new Date(e.sent_at).toLocaleDateString('en-ZA')}</td>
                        <td className="px-4 py-3">
                          <div className="text-white text-sm">{e.recipient_name || '—'}</div>
                          <div className="text-slate-500 text-xs">{e.recipient_email}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs capitalize">{e.template_type.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3 text-slate-300 text-sm max-w-xs truncate">{e.subject}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${e.status === 'sent' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>{e.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {history.length > PAGE_SIZE && (
                <div className="p-4 flex items-center justify-between border-t border-white/8">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 rounded text-xs text-slate-300 disabled:opacity-40" style={{ background: 'rgba(255,255,255,0.05)' }}>← Prev</button>
                  <span className="text-slate-400 text-xs">{page + 1} / {Math.ceil(history.length / PAGE_SIZE)}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= history.length} className="px-3 py-1.5 rounded text-xs text-slate-300 disabled:opacity-40" style={{ background: 'rgba(255,255,255,0.05)' }}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-8">
          <Link href="/admin/crm" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">← Back to CRM</Link>
        </div>
      </div>
    </div>
  );
}
