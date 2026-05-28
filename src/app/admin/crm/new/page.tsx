'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';

const SOURCE_OPTIONS = ['Direct', 'Event', 'Referral', 'Website'];
const STATUS_OPTIONS = ['Active', 'Prospect', 'On Hold', 'Churned'];
const INDUSTRY_OPTIONS = ['Construction', 'Technology', 'Retail', 'Healthcare', 'Finance', 'Education', 'Agriculture', 'Mining', 'Manufacturing', 'Services', 'Other'];

export default function AddClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    industry: '',
    status: 'Active',
    source: 'Direct',
    source_event: '',
    address: '',
    drive_folder_url: '',
    notes: '',
  });

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/crm/clients', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create client');
      router.push(`/admin/crm/${data.client.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg text-white text-sm outline-none focus:ring-1 focus:ring-orange-500/50 transition-all';
  const inputStyle = { background: '#1a2535', border: '1px solid rgba(255,255,255,0.12)', colorScheme: 'dark' as const };
  const labelClass = 'block text-slate-400 text-xs font-medium mb-1';

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-deep, #0B1118)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/crm" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-slate-300 transition-colors">Admin</Link>
              <span>/</span>
              <Link href="/admin/crm" className="hover:text-slate-300 transition-colors">CRM</Link>
              <span>/</span>
              <span className="text-slate-300">Add Client</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Add New Client</h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-white font-semibold mb-4">Company Details</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input required className={inputClass} style={inputStyle} value={form.company_name} onChange={e => set('company_name', e.target.value)} placeholder="e.g. Acme (Pty) Ltd" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Status</label>
                  <select className={inputClass} style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                    {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Industry</label>
                  <select className={inputClass} style={inputStyle} value={form.industry} onChange={e => set('industry', e.target.value)}>
                    <option value="">Select industry</option>
                    {INDUSTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input className={inputClass} style={inputStyle} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Business address" />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-white font-semibold mb-4">Contact Person</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Contact Name</label>
                <input className={inputClass} style={inputStyle} value={form.contact_name} onChange={e => set('contact_name', e.target.value)} placeholder="Full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input className={inputClass} style={inputStyle} value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} placeholder="+27 60 000 0000" />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" className={inputClass} style={inputStyle} value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="email@company.co.za" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-white font-semibold mb-4">Source & Tracking</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Source</label>
                  <select className={inputClass} style={inputStyle} value={form.source} onChange={e => set('source', e.target.value)}>
                    {SOURCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                {form.source === 'Event' && (
                  <div>
                    <label className={labelClass}>Event Name</label>
                    <input className={inputClass} style={inputStyle} value={form.source_event} onChange={e => set('source_event', e.target.value)} placeholder="Event name" />
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>Google Drive Folder URL</label>
                <input className={inputClass} style={inputStyle} value={form.drive_folder_url} onChange={e => set('drive_folder_url', e.target.value)} placeholder="https://drive.google.com/..." />
              </div>
              <div>
                <label className={labelClass}>Notes</label>
                <textarea rows={3} className={inputClass} style={inputStyle} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Internal notes about this client…" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/admin/crm" className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center text-slate-300 transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-black transition-colors disabled:opacity-50" style={{ background: '#FF9F00' }}>
              {loading ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Save size={15} /> Save Client</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
