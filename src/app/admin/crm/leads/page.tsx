'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, UserPlus, Search, X, Check, Loader2, ChevronDown, Trash2 } from 'lucide-react';

interface Lead {
  id: string; full_name: string; company_name: string; position: string;
  email: string; phone: string; source_event: string; event_date: string;
  status: string; follow_up_date: string; thank_you_sent: boolean; created_at: string;
  package_interest: string; notes: string;
}

const STATUSES = ['New Lead', 'Contacted', 'Proposal Sent', 'Converted', 'Not Interested'];
const STATUS_STYLES: Record<string, string> = {
  'New Lead':        'text-blue-400 bg-blue-400/10',
  Contacted:         'text-yellow-400 bg-yellow-400/10',
  'Proposal Sent':   'text-purple-400 bg-purple-400/10',
  Converted:         'text-green-400 bg-green-400/10',
  'Not Interested':  'text-red-400 bg-red-400/10',
};

export default function LeadsPipelinePage() {
  const [leads, setLeads]         = useState<Lead[]>([]);
  const [loading, setLoading]     = useState(true);
  const [searchQ, setSearchQ]     = useState('');
  const [filterEvent, setEvent]   = useState('');
  const [filterStatus, setStatus] = useState('');
  const [events, setEvents]       = useState<string[]>([]);

  // Bulk send state
  const [showBulkModal, setShowBulkModal]       = useState(false);
  const [bulkEvent, setBulkEvent]               = useState('');
  const [bulkSending, setBulkSending]           = useState(false);
  const [bulkResult, setBulkResult]             = useState<{ sent: number; failed: number } | null>(null);

  // Convert modal
  const [convertLead, setConvertLead]           = useState<Lead | null>(null);
  const [convertForm, setConvertForm]           = useState({ company_name: '', contact_name: '', contact_email: '', contact_phone: '', service_name: '', billing_type: 'Once-off', amount_rands: '' });
  const [converting, setConverting]             = useState(false);
  const [sendingTY, setSendingTY]               = useState<string | null>(null);
  const [sentTY, setSentTY]                     = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/crm/leads', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        const allLeads: Lead[] = d.leads || [];
        setLeads(allLeads);
        const evts = [...new Set(allLeads.map(l => l.source_event).filter(Boolean))];
        setEvents(evts as string[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/crm/leads/${id}`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/crm/leads/${id}`, { method: 'DELETE', credentials: 'include' });
    setLeads(ls => ls.filter(l => l.id !== id));
  };

  const handleSendTY = async (lead: Lead) => {
    if (!lead.email) return alert('This lead has no email address.');
    setSendingTY(lead.id);
    await fetch('/api/crm/email/send', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template: 'event_thank_you', recipient_type: 'lead', recipient_id: lead.id }),
    });
    setSentTY(s => new Set([...s, lead.id]));
    setSendingTY(null);
  };

  const handleBulkSend = async () => {
    if (!bulkEvent) return;
    setBulkSending(true);
    const res = await fetch('/api/crm/email/bulk', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_name: bulkEvent, template: 'event_thank_you' }),
    });
    const data = await res.json();
    setBulkResult({ sent: data.sent, failed: data.failed });
    setBulkSending(false);
    // Refresh
    const refreshed = await fetch('/api/crm/leads', { credentials: 'include' }).then(r => r.json());
    setLeads(refreshed.leads || []);
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertLead) return;
    setConverting(true);
    const res = await fetch('/api/crm/leads/convert', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead_id: convertLead.id, ...convertForm, amount_rands: Number(convertForm.amount_rands) || 0 }),
    });
    const data = await res.json();
    if (data.client) {
      setLeads(ls => ls.map(l => l.id === convertLead.id ? { ...l, status: 'Converted' } : l));
      setConvertLead(null);
    }
    setConverting(false);
  };

  const filtered = leads.filter(l => {
    if (filterEvent && l.source_event !== filterEvent) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      if (!l.full_name?.toLowerCase().includes(q) && !l.company_name?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const unsentForEvent = bulkEvent ? leads.filter(l => l.source_event === bulkEvent && !l.thank_you_sent && l.email).length : 0;

  const inputClass = 'w-full px-3 py-2 rounded-lg text-white text-sm outline-none focus:ring-1 focus:ring-orange-500/50 transition-all';
  const inputStyle = { background: '#1a2535', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' as const };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-deep, #0B1118)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/crm" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"><ArrowLeft size={20} /></Link>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-slate-300 transition-colors">Admin</Link>
              <span>/</span>
              <Link href="/admin/crm" className="hover:text-slate-300 transition-colors">CRM</Link>
              <span>/</span>
              <span className="text-slate-300">Leads Pipeline</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Leads Pipeline</h1>
          </div>
          <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-black" style={{ background: '#FF9F00' }}>
            <Send size={14} /> Send Thank You to All
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="w-full pl-9 pr-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} placeholder="Search name or company…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          </div>
          <select className="px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} value={filterEvent} onChange={e => setEvent(e.target.value)}>
            <option value="">All Events</option>
            {events.map(ev => <option key={ev} value={ev}>{ev}</option>)}
          </select>
          <select className="px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} value={filterStatus} onChange={e => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No leads found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/8">
                  {['Name', 'Company', 'Phone', 'Email', 'Event', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-slate-400 font-medium px-4 py-3 text-xs">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered.map(l => (
                    <tr key={l.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{l.full_name}</td>
                      <td className="px-4 py-3 text-slate-300">{l.company_name || '—'}</td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{l.phone || '—'}</td>
                      <td className="px-4 py-3 text-slate-400 max-w-32 truncate">{l.email || '—'}</td>
                      <td className="px-4 py-3 text-slate-400 max-w-36 truncate text-xs">{l.source_event || '—'}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{l.created_at ? new Date(l.created_at).toLocaleDateString('en-ZA') : '—'}</td>
                      <td className="px-4 py-3">
                        <select
                          value={l.status}
                          onChange={e => updateStatus(l.id, e.target.value)}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 outline-none cursor-pointer ${STATUS_STYLES[l.status] || 'text-slate-400 bg-white/8'}`}
                          style={{ background: 'transparent' }}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {l.status !== 'Converted' && (
                            <button
                              onClick={() => { setConvertLead(l); setConvertForm({ company_name: l.company_name || '', contact_name: l.full_name, contact_email: l.email || '', contact_phone: l.phone || '', service_name: '', billing_type: 'Once-off', amount_rands: '' }); }}
                              className="text-xs px-2 py-1 rounded text-green-400 bg-green-400/10 hover:bg-green-400/20 transition-colors whitespace-nowrap"
                            >
                              <UserPlus size={11} className="inline mr-1" />Convert
                            </button>
                          )}
                          {l.email && (
                            <button
                              onClick={() => handleSendTY(l)}
                              disabled={sendingTY === l.id || sentTY.has(l.id) || l.thank_you_sent}
                              className="text-xs px-2 py-1 rounded text-orange-400 bg-orange-400/10 hover:bg-orange-400/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              {sendingTY === l.id ? <Loader2 size={11} className="inline animate-spin" /> : sentTY.has(l.id) || l.thank_you_sent ? <Check size={11} className="inline" /> : <Send size={11} className="inline mr-1" />}
                              {sentTY.has(l.id) || l.thank_you_sent ? 'Sent' : 'Thank You'}
                            </button>
                          )}
                          <button onClick={() => handleDelete(l.id)} className="text-red-400/50 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Bulk send modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131c27', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Send Thank You to All</h3>
              <button onClick={() => { setShowBulkModal(false); setBulkResult(null); }} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            {bulkResult ? (
              <div className="text-center py-4">
                <Check size={32} className="text-green-400 mx-auto mb-3" />
                <p className="text-white font-medium">{bulkResult.sent} emails sent</p>
                {bulkResult.failed > 0 && <p className="text-red-400 text-sm mt-1">{bulkResult.failed} failed (no email address)</p>}
                <button onClick={() => { setShowBulkModal(false); setBulkResult(null); }} className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-black" style={{ background: '#FF9F00' }}>Done</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Select Event</label>
                  <select className={inputClass} style={inputStyle} value={bulkEvent} onChange={e => setBulkEvent(e.target.value)}>
                    <option value="">Choose event…</option>
                    {events.map(ev => <option key={ev} value={ev}>{ev}</option>)}
                  </select>
                </div>
                {bulkEvent && (
                  <p className="text-slate-300 text-sm">
                    This will send <span className="text-orange-400 font-semibold">{unsentForEvent}</span> thank you email{unsentForEvent !== 1 ? 's' : ''} to leads from this event who haven't received one yet.
                  </p>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setShowBulkModal(false); setBulkResult(null); }} className="flex-1 py-2.5 rounded-lg text-sm text-slate-300" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                  <button onClick={handleBulkSend} disabled={!bulkEvent || unsentForEvent === 0 || bulkSending} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black disabled:opacity-50" style={{ background: '#FF9F00' }}>
                    {bulkSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send {unsentForEvent > 0 ? `(${unsentForEvent})` : ''}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Convert modal */}
      {convertLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131c27', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Convert to Client — {convertLead.full_name}</h3>
              <button onClick={() => setConvertLead(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleConvert} className="space-y-3">
              <div><input required placeholder="Company name *" className={inputClass} style={inputStyle} value={convertForm.company_name} onChange={e => setConvertForm(f => ({...f, company_name: e.target.value}))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Contact name" className={inputClass} style={inputStyle} value={convertForm.contact_name} onChange={e => setConvertForm(f => ({...f, contact_name: e.target.value}))} />
                <input placeholder="Phone" className={inputClass} style={inputStyle} value={convertForm.contact_phone} onChange={e => setConvertForm(f => ({...f, contact_phone: e.target.value}))} />
              </div>
              <div><input placeholder="Email" className={inputClass} style={inputStyle} value={convertForm.contact_email} onChange={e => setConvertForm(f => ({...f, contact_email: e.target.value}))} /></div>
              <div className="pt-2 border-t border-white/8">
                <p className="text-slate-400 text-xs mb-3">First service (optional)</p>
                <div><input placeholder="Service name" className={inputClass} style={inputStyle} value={convertForm.service_name} onChange={e => setConvertForm(f => ({...f, service_name: e.target.value}))} /></div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <select className={inputClass} style={inputStyle} value={convertForm.billing_type} onChange={e => setConvertForm(f => ({...f, billing_type: e.target.value}))}>
                    <option>Once-off</option><option>Monthly Retainer</option><option>Project-based</option>
                  </select>
                  <input type="number" placeholder="Amount (R)" className={inputClass} style={inputStyle} value={convertForm.amount_rands} onChange={e => setConvertForm(f => ({...f, amount_rands: e.target.value}))} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setConvertLead(null)} className="flex-1 py-2.5 rounded-lg text-sm text-slate-300" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                <button type="submit" disabled={converting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black disabled:opacity-50" style={{ background: '#FF9F00' }}>
                  {converting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />} Convert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
