'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, ExternalLink, Plus, Trash2, Send, X, Check, Loader2, Mail, ChevronDown, Link2, QrCode } from 'lucide-react';

interface Service {
  id: string; service_name: string; service_category: string; billing_type: string;
  amount_rands: number; status: string; renewal_date: string; notes: string;
}
interface EmailSend {
  id: string; template_type: string; subject: string; status: string; sent_at: string; recipient_email: string;
}
interface Client {
  id: string; company_name: string; contact_name: string; contact_email: string; contact_phone: string;
  status: string; source: string; industry: string; drive_folder_url: string; notes: string;
}

const STATUS_STYLES: Record<string, string> = {
  Active: 'text-green-400 bg-green-400/10', 'On Hold': 'text-yellow-400 bg-yellow-400/10',
  Churned: 'text-red-400 bg-red-400/10', Prospect: 'text-blue-400 bg-blue-400/10',
};
const EMAIL_TEMPLATES = [
  { value: 'welcome_client',     label: 'Welcome Client' },
  { value: 'payment_reminder',   label: 'Payment Reminder' },
  { value: 'document_renewal',   label: 'Document Renewal Alert' },
  { value: 'service_checkin',    label: 'Monthly Check-in' },
];

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [client, setClient]   = useState<Client | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [emails, setEmails]   = useState<EmailSend[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit client modal
  const [showEditClient, setShowEditClient] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [savingClient, setSavingClient] = useState(false);

  const openEditClient = () => {
    if (!client) return;
    setEditForm({
      company_name: client.company_name, contact_name: client.contact_name,
      contact_email: client.contact_email, contact_phone: client.contact_phone,
      status: client.status, source: client.source, industry: client.industry,
      drive_folder_url: client.drive_folder_url, notes: client.notes,
    });
    setShowEditClient(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingClient(true);
    const res = await fetch(`/api/crm/clients/${id}`, {
      method: 'PATCH', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setClient(c => c ? { ...c, ...editForm } as Client : c);
      setShowEditClient(false);
    }
    setSavingClient(false);
  };

  // Add service form
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ service_name: '', service_category: '', billing_type: 'Once-off', amount_rands: '', status: 'Active', renewal_date: '', notes: '' });
  const [savingService, setSavingService] = useState(false);

  // Email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ template: 'welcome_client', custom_message: '', custom_subject: '' });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent]   = useState(false);

  // Subscription link modal
  const [showSubModal, setShowSubModal] = useState(false);
  const [subPlan, setSubPlan] = useState('business-growth-essentials');
  const [subCopied, setSubCopied] = useState(false);

  const SUB_PLANS = [
    { id: 'business-growth-essentials', label: 'Business Growth Essentials — R950/mo', url: '/subscribe/business-growth' },
    { id: 'tender-growth-package',      label: 'Tender Growth Bundle — R1,950/mo',   url: '/subscribe/tender-growth' },
    { id: 'tender-watch',               label: 'Tender Watch — R350/mo',              url: '/subscribe/tender-watch' },
  ];

  const getSubUrl = () => {
    const plan = SUB_PLANS.find(p => p.id === subPlan);
    return `https://www.thebreed.co.za${plan?.url || '/subscribe/business-growth'}`;
  };

  const handleCopySubLink = () => {
    navigator.clipboard.writeText(getSubUrl());
    setSubCopied(true);
    setTimeout(() => setSubCopied(false), 2000);
  };

  const handleSendSubEmail = async () => {
    if (!client) return;
    setSendingEmail(true);
    const plan = SUB_PLANS.find(p => p.id === subPlan);
    await fetch('/api/crm/email/send', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient_type: 'client', recipient_id: id,
        template: 'custom',
        custom_subject: `Your Subscription Link — ${plan?.label.split(' —')[0]}`,
        custom_message: `Hi ${client.contact_name || client.company_name},\n\nHere is your subscription link to get started:\n\n${getSubUrl()}\n\nThis link takes you directly to a secure PayFast checkout to set up your monthly subscription.\n\nIf you have any questions, reply to this email or WhatsApp us on 060 496 4105.\n\nBest regards,\nBreed Industries`,
      }),
    });
    setSendingEmail(false);
    setShowSubModal(false);
  };

  useEffect(() => {
    fetch(`/api/crm/clients/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setClient(d.client); setServices(d.services || []); setEmails(d.emails || []); })
      .finally(() => setLoading(false));
  }, [id]);

  const mrr = services.filter(s => s.billing_type === 'Monthly Retainer' && s.status === 'Active')
    .reduce((sum, s) => sum + (Number(s.amount_rands) || 0), 0);
  const formatZar = (n: number) => `R${n.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

  const handleDeleteService = async (sid: string) => {
    if (!confirm('Delete this service?')) return;
    await fetch(`/api/crm/clients/${id}/services/${sid}`, { method: 'DELETE', credentials: 'include' });
    setServices(s => s.filter(x => x.id !== sid));
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingService(true);
    const res = await fetch(`/api/crm/clients/${id}/services`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newService, amount_rands: Number(newService.amount_rands) || 0 }),
    });
    const data = await res.json();
    if (data.service) setServices(s => [data.service, ...s]);
    setShowAddService(false);
    setNewService({ service_name: '', service_category: '', billing_type: 'Once-off', amount_rands: '', status: 'Active', renewal_date: '', notes: '' });
    setSavingService(false);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);
    const res = await fetch('/api/crm/email/send', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...emailForm, recipient_type: 'client', recipient_id: id }),
    });
    if (res.ok) {
      setEmailSent(true);
      setTimeout(() => { setShowEmailModal(false); setEmailSent(false); }, 1500);
      // Refresh email history
      fetch(`/api/crm/clients/${id}`, { credentials: 'include' }).then(r => r.json()).then(d => setEmails(d.emails || []));
    }
    setSendingEmail(false);
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg text-white text-sm outline-none focus:ring-1 focus:ring-orange-500/50 transition-all';
  const inputStyle = { background: '#1a2535', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' as const };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1118' }}><Loader2 className="animate-spin text-orange-400" /></div>;
  if (!client) return <div className="min-h-screen flex items-center justify-center text-slate-400" style={{ background: '#0B1118' }}>Client not found. <Link href="/admin/crm" className="text-orange-400 ml-2">Back</Link></div>;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-deep, #0B1118)' }}>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin/crm" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"><ArrowLeft size={20} /></Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-slate-300 transition-colors">Admin</Link>
              <span>/</span>
              <Link href="/admin/crm" className="hover:text-slate-300 transition-colors">CRM</Link>
              <span>/</span>
              <span className="text-slate-300 truncate">{client?.company_name}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{client.company_name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[client.status] || 'text-slate-400 bg-white/8'}`}>{client.status}</span>
            </div>
            <p className="text-slate-400 text-sm mt-0.5">{client.industry || client.source}</p>
          </div>
          <div className="flex gap-2">
            {client.drive_folder_url && (
              <a href={client.drive_folder_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <ExternalLink size={14} /> Drive
              </a>
            )}
            <button onClick={openEditClient} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Edit2 size={14} /> Edit
            </button>
            <button onClick={() => setShowSubModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Link2 size={14} /> Sub Link
            </button>
            <button onClick={() => setShowEmailModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-black" style={{ background: '#FF9F00' }}>
              <Send size={14} /> Send Email
            </button>
          </div>
        </div>

        {/* Info card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { label: 'Contact', value: client.contact_name || '—' },
            { label: 'Email',   value: client.contact_email || '—' },
            { label: 'Phone',   value: client.contact_phone || '—' },
            { label: 'Source',  value: client.source || '—' },
          ].map(row => (
            <div key={row.label}>
              <div className="text-slate-500 text-xs mb-1">{row.label}</div>
              <div className="text-white text-sm truncate">{row.value}</div>
            </div>
          ))}
          {client.notes && (
            <div className="col-span-2 md:col-span-4 mt-2 pt-3 border-t border-white/8">
              <div className="text-slate-500 text-xs mb-1">Notes</div>
              <div className="text-slate-300 text-sm">{client.notes}</div>
            </div>
          )}
        </div>

        {/* Services */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="p-4 border-b border-white/8 flex items-center justify-between">
            <h2 className="text-white font-semibold">Services</h2>
            <button onClick={() => setShowAddService(!showAddService)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-black" style={{ background: '#FF9F00' }}>
              <Plus size={13} /> Add Service
            </button>
          </div>

          {showAddService && (
            <form onSubmit={handleAddService} className="p-4 border-b border-white/8" style={{ background: 'rgba(255,159,0,0.04)' }}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                <div className="md:col-span-2"><input required placeholder="Service name *" className={inputClass} style={inputStyle} value={newService.service_name} onChange={e => setNewService(s => ({...s, service_name: e.target.value}))} /></div>
                <div><input placeholder="Category" className={inputClass} style={inputStyle} value={newService.service_category} onChange={e => setNewService(s => ({...s, service_category: e.target.value}))} /></div>
                <div>
                  <select className={inputClass} style={inputStyle} value={newService.billing_type} onChange={e => setNewService(s => ({...s, billing_type: e.target.value}))}>
                    <option>Once-off</option><option>Monthly Retainer</option><option>Project-based</option>
                  </select>
                </div>
                <div><input type="number" placeholder="Amount (R)" className={inputClass} style={inputStyle} value={newService.amount_rands} onChange={e => setNewService(s => ({...s, amount_rands: e.target.value}))} /></div>
                <div><input type="date" placeholder="Renewal date" className={inputClass} style={inputStyle} value={newService.renewal_date} onChange={e => setNewService(s => ({...s, renewal_date: e.target.value}))} /></div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddService(false)} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={savingService} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-black disabled:opacity-50" style={{ background: '#FF9F00' }}>
                  {savingService ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                </button>
              </div>
            </form>
          )}

          {services.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">No services added yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/8">
                  {['Service', 'Category', 'Billing', 'Amount', 'Status', 'Renewal', ''].map(h => (
                    <th key={h} className="text-left text-slate-400 font-medium px-4 py-3 text-xs">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{s.service_name}</td>
                      <td className="px-4 py-3 text-slate-400">{s.service_category || '—'}</td>
                      <td className="px-4 py-3 text-slate-400">{s.billing_type}</td>
                      <td className="px-4 py-3 text-slate-300">{s.amount_rands > 0 ? formatZar(s.amount_rands) : '—'}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${s.status === 'Active' ? 'text-green-400 bg-green-400/10' : 'text-slate-400 bg-white/8'}`}>{s.status}</span></td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{s.renewal_date || '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteService(s.id)} className="text-red-400/60 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {mrr > 0 && (
                    <tr className="border-t border-white/10 bg-white/2">
                      <td colSpan={3} className="px-4 py-2 text-right text-slate-400 text-xs font-medium">Total MRR</td>
                      <td className="px-4 py-2 text-green-400 font-semibold">{formatZar(mrr)}</td>
                      <td colSpan={3}></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Email history */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="p-4 border-b border-white/8"><h2 className="text-white font-semibold">Email History</h2></div>
          {emails.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">No emails sent yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {emails.map(e => (
                <div key={e.id} className="px-4 py-3 flex items-center gap-4">
                  <Mail size={14} className="text-slate-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm truncate">{e.subject}</div>
                    <div className="text-slate-500 text-xs">{e.template_type} · {new Date(e.sent_at).toLocaleDateString('en-ZA')} {new Date(e.sent_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${e.status === 'sent' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>{e.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Edit Client modal */}
      {showEditClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#131c27', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Edit Client</h3>
              <button onClick={() => setShowEditClient(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveClient} className="space-y-3">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">Company Name *</label>
                <input required className={inputClass} style={inputStyle} value={editForm.company_name || ''} onChange={e => setEditForm(f => ({...f, company_name: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Contact Name</label>
                  <input className={inputClass} style={inputStyle} value={editForm.contact_name || ''} onChange={e => setEditForm(f => ({...f, contact_name: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Phone</label>
                  <input className={inputClass} style={inputStyle} value={editForm.contact_phone || ''} onChange={e => setEditForm(f => ({...f, contact_phone: e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">Email</label>
                <input type="email" className={inputClass} style={inputStyle} value={editForm.contact_email || ''} onChange={e => setEditForm(f => ({...f, contact_email: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Status</label>
                  <select className={inputClass} style={inputStyle} value={editForm.status || 'Active'} onChange={e => setEditForm(f => ({...f, status: e.target.value}))}>
                    <option>Active</option>
                    <option>On Hold</option>
                    <option>Churned</option>
                    <option>Prospect</option>
                    <option>Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Industry</label>
                  <input className={inputClass} style={inputStyle} value={editForm.industry || ''} onChange={e => setEditForm(f => ({...f, industry: e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">Source</label>
                <input className={inputClass} style={inputStyle} value={editForm.source || ''} onChange={e => setEditForm(f => ({...f, source: e.target.value}))} />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">Google Drive Folder URL</label>
                <input type="url" className={inputClass} style={inputStyle} placeholder="https://drive.google.com/..." value={editForm.drive_folder_url || ''} onChange={e => setEditForm(f => ({...f, drive_folder_url: e.target.value}))} />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">Notes</label>
                <textarea rows={3} className={inputClass} style={inputStyle} value={editForm.notes || ''} onChange={e => setEditForm(f => ({...f, notes: e.target.value}))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditClient(false)} className="flex-1 py-2.5 rounded-lg text-sm text-slate-300" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                <button type="submit" disabled={savingClient} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black disabled:opacity-50" style={{ background: '#FF9F00' }}>
                  {savingClient ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131c27', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Send Email</h3>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            {emailSent ? (
              <div className="text-center py-6">
                <Check size={32} className="text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-medium">Email sent!</p>
              </div>
            ) : (
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Template</label>
                  <select className={inputClass} style={inputStyle} value={emailForm.template} onChange={e => setEmailForm(f => ({...f, template: e.target.value}))}>
                    {EMAIL_TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Custom Subject (optional)</label>
                  <input className={inputClass} style={inputStyle} placeholder="Leave blank to use default" value={emailForm.custom_subject} onChange={e => setEmailForm(f => ({...f, custom_subject: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1">Custom Message (optional)</label>
                  <textarea rows={3} className={inputClass} style={inputStyle} placeholder="Additional message to include in the email…" value={emailForm.custom_message} onChange={e => setEmailForm(f => ({...f, custom_message: e.target.value}))} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowEmailModal(false)} className="flex-1 py-2.5 rounded-lg text-sm text-slate-300" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                  <button type="submit" disabled={sendingEmail} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black disabled:opacity-50" style={{ background: '#FF9F00' }}>
                    {sendingEmail ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Subscription Link Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#131c27', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold flex items-center gap-2"><Link2 size={16} className="text-orange-400" /> Send Subscription Link</h3>
              <button onClick={() => setShowSubModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Select Package</label>
                <select
                  value={subPlan}
                  onChange={e => setSubPlan(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none"
                  style={{ background: '#1a2535', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' }}
                >
                  {SUB_PLANS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-slate-500 text-xs mb-1">Subscription URL</p>
                <p className="text-orange-400 text-xs font-mono break-all">{getSubUrl()}</p>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleCopySubLink}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm text-slate-300 transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {subCopied ? <><Check size={14} className="text-green-400" /> Copied!</> : <><QrCode size={14} /> Copy Link</>}
                </button>
                <button
                  onClick={handleSendSubEmail}
                  disabled={sendingEmail || !client?.contact_email}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black disabled:opacity-50"
                  style={{ background: '#FF9F00' }}
                >
                  {sendingEmail ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />} Email to Client
                </button>
              </div>
              {!client?.contact_email && <p className="text-red-400 text-xs text-center">No email on file — copy the link to share manually.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
