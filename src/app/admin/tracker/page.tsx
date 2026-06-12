'use client';

/**
 * Breed Industries — Client Tracker dashboard.
 * Shows every active client commitment grouped by urgency, with quick actions
 * (complete, run follow-ups) and a create form. The daily cron does the
 * chasing automatically; this page is your at-a-glance command view.
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  AlertTriangle, Clock, CalendarDays, CheckCircle2, Plus, Send, RefreshCw, Loader2, ArrowLeft, Layers,
} from 'lucide-react';

interface Commitment {
  id: string;
  client_name: string | null;
  title: string;
  type: string;
  status: string;
  due_date: string | null;
  recurrence: string;
  priority: string;
}

const TYPE_LABEL: Record<string, string> = {
  document: 'Document', statutory: 'Statutory', tender: 'Tender',
  operations: 'Operations', event_training: 'Event / Training', custom: 'Custom',
};

function daysUntil(due: string | null): number | null {
  if (!due) return null;
  return Math.ceil((new Date(due).setHours(23, 59, 59, 999) - Date.now()) / 86_400_000);
}
function fmt(due: string | null): string {
  if (!due) return 'No date';
  return new Date(due).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TrackerPage() {
  const [items, setItems] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/commitments?status=active&limit=500');
      const data = await res.json();
      if (data.ok) setItems(data.commitments);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function complete(id: string) {
    await fetch(`/api/commitments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete' }),
    });
    load();
  }

  async function runFollowups() {
    setRunning(true);
    setBanner(null);
    try {
      const res = await fetch('/api/admin/run-followups', { method: 'POST' });
      const data = await res.json();
      setBanner(
        data.ok
          ? `Swept ${data.scanned} items · ${data.remindersSent} clients nudged (${data.whatsappSent} WhatsApp, ${data.emailsSent} email) · ${data.markedOverdue} newly overdue.`
          : `Failed: ${data.error?.message ?? 'unknown error'}`,
      );
      load();
    } finally {
      setRunning(false);
    }
  }

  const overdue = items.filter((c) => { const d = daysUntil(c.due_date); return d != null && d < 0; });
  const today = items.filter((c) => daysUntil(c.due_date) === 0);
  const soon = items.filter((c) => { const d = daysUntil(c.due_date); return d != null && d > 0 && d <= 7; });
  const later = items.filter((c) => { const d = daysUntil(c.due_date); return d == null || d > 7; });

  return (
    <div className="min-h-screen bg-[#0B1118] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="mb-4 inline-flex items-center gap-1 text-sm text-white/50 hover:text-white">
          <ArrowLeft size={15} /> Dashboard
        </Link>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">Client Tracker</h1>
            <p className="text-sm text-white/50">Everything your clients owe — and what&apos;s slipping.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setShowForm((s) => !s); setShowTemplates(false); }} className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5">
              <Plus size={15} /> New
            </button>
            <button onClick={() => { setShowTemplates((s) => !s); setShowForm(false); }} className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5">
              <Layers size={15} /> Onboard with template
            </button>
            <button onClick={runFollowups} disabled={running} className="flex items-center gap-1.5 rounded-lg bg-[#FF9F00] px-3 py-2 text-sm font-semibold text-[#0B1118] disabled:opacity-50">
              {running ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Run follow-ups
            </button>
            <button onClick={load} className="rounded-lg border border-white/15 p-2 hover:bg-white/5"><RefreshCw size={15} /></button>
          </div>
        </div>

        {banner && <div className="mb-5 rounded-lg border border-[#FF9F00]/30 bg-[#FF9F00]/10 px-4 py-3 text-sm">{banner}</div>}

        {showForm && <CreateForm onCreated={() => { setShowForm(false); load(); }} />}
        {showTemplates && (
          <TemplatePanel
            onApplied={(msg) => { setShowTemplates(false); setBanner(msg); load(); }}
          />
        )}

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={<AlertTriangle size={16} />} label="Overdue" value={overdue.length} tone="#e5484d" />
          <Stat icon={<Clock size={16} />} label="Due today" value={today.length} tone="#FF9F00" />
          <Stat icon={<CalendarDays size={16} />} label="Next 7 days" value={soon.length} tone="#c8a96e" />
          <Stat icon={<CheckCircle2 size={16} />} label="Active total" value={items.length} tone="#4caf50" />
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-white/40"><Loader2 size={16} className="animate-spin" /> Loading…</div>
        ) : (
          <div className="space-y-6">
            <Group title="🔴 Overdue" items={overdue} onComplete={complete} tone="#e5484d" />
            <Group title="🟠 Due today" items={today} onComplete={complete} tone="#FF9F00" />
            <Group title="🟡 Next 7 days" items={soon} onComplete={complete} tone="#c8a96e" />
            <Group title="Later / no date" items={later} onComplete={complete} tone="#3a4754" />
            {items.length === 0 && <p className="text-white/40">Nothing tracked yet. Add a commitment or ask the agent: “track a monthly stock-take for [client]”.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#121820] p-4">
      <div className="flex items-center gap-1.5 text-xs text-white/50" style={{ color: tone }}>{icon}{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Group({ title, items, onComplete, tone }: { title: string; items: Commitment[]; onComplete: (id: string) => void; tone: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold" style={{ color: tone }}>{title} <span className="text-white/30">({items.length})</span></h2>
      <div className="overflow-hidden rounded-xl border border-white/10">
        {items.map((c) => {
          const d = daysUntil(c.due_date);
          return (
            <div key={c.id} className="flex items-center justify-between gap-3 border-b border-white/5 bg-[#121820] px-4 py-3 last:border-0">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{c.title}</div>
                <div className="text-xs text-white/40">
                  {c.client_name ?? 'Unassigned'} · {TYPE_LABEL[c.type] ?? c.type}
                  {c.recurrence !== 'none' && ` · ↻ ${c.recurrence.replace('_', '-')}`}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="text-right text-xs">
                  <div className="text-white/70">{fmt(c.due_date)}</div>
                  {d != null && <div style={{ color: d < 0 ? '#e5484d' : d === 0 ? '#FF9F00' : '#888' }}>{d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? 'today' : `in ${d}d`}</div>}
                </div>
                <button onClick={() => onComplete(c.id)} title="Mark done" className="rounded-lg border border-white/15 p-1.5 text-white/60 hover:bg-[#4caf50]/20 hover:text-[#4caf50]">
                  <CheckCircle2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CreateForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', type: 'document', due_date: '', recurrence: 'none', client_name: '', client_email: '', client_phone: '', description: '' });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    try {
      await fetch('/api/commitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, due_date: form.due_date || null }),
      });
      onCreated();
    } finally {
      setSaving(false);
    }
  }

  const input = 'rounded-lg border border-white/15 bg-[#0B1118] px-3 py-2 text-sm outline-none focus:border-[#FF9F00]';

  return (
    <form onSubmit={submit} className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-[#121820] p-4 sm:grid-cols-2">
      <input className={input + ' sm:col-span-2'} placeholder="Title — e.g. Submit certified ID, Monthly stock-take" value={form.title} onChange={(e) => set('title', e.target.value)} />
      <select className={input} value={form.type} onChange={(e) => set('type', e.target.value)}>
        {Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <select className={input} value={form.recurrence} onChange={(e) => set('recurrence', e.target.value)}>
        <option value="none">One-off</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
        <option value="bi_monthly">Bi-monthly</option><option value="quarterly">Quarterly</option><option value="annually">Annually</option>
      </select>
      <input className={input} type="date" value={form.due_date} onChange={(e) => set('due_date', e.target.value)} />
      <input className={input} placeholder="Client name" value={form.client_name} onChange={(e) => set('client_name', e.target.value)} />
      <input className={input} placeholder="Client WhatsApp (e.g. 0821234567)" value={form.client_phone} onChange={(e) => set('client_phone', e.target.value)} />
      <input className={input} placeholder="Client email" value={form.client_email} onChange={(e) => set('client_email', e.target.value)} />
      <textarea className={input + ' sm:col-span-2'} placeholder="Description shown to the client (optional)" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} />
      <button disabled={saving} className="flex items-center justify-center gap-1.5 rounded-lg bg-[#FF9F00] px-4 py-2 text-sm font-semibold text-[#0B1118] disabled:opacity-50 sm:col-span-2">
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Add to tracker
      </button>
    </form>
  );
}

interface TemplateInfo { id: string; name: string; description: string; itemCount: number }

function TemplatePanel({ onApplied }: { onApplied: (msg: string) => void }) {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [client, setClient] = useState({ client_name: '', client_email: '', client_phone: '', anchorDate: '' });
  const [applying, setApplying] = useState(false);
  const set = (k: string, v: string) => setClient((c) => ({ ...c, [k]: v }));

  useEffect(() => {
    fetch('/api/commitments/templates')
      .then((r) => r.json())
      .then((d) => { if (d.ok) setTemplates(d.templates); })
      .catch(() => {});
  }, []);

  async function apply() {
    if (!selected || !client.client_name) return;
    setApplying(true);
    try {
      const res = await fetch('/api/commitments/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selected,
          clientName: client.client_name,
          clientEmail: client.client_email || undefined,
          clientPhone: client.client_phone || undefined,
          anchorDate: client.anchorDate || undefined,
        }),
      });
      const data = await res.json();
      onApplied(
        data.ok
          ? `Applied "${data.template}" — ${data.created.length} commitments created for ${client.client_name}.`
          : `Failed: ${data.error?.message ?? 'unknown error'}`,
      );
    } finally {
      setApplying(false);
    }
  }

  const input = 'rounded-lg border border-white/15 bg-[#0B1118] px-3 py-2 text-sm outline-none focus:border-[#FF9F00]';

  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-[#121820] p-4">
      <h3 className="mb-3 text-sm font-semibold text-white/80">Onboard a client with a standard obligation set</h3>
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`rounded-lg border p-3 text-left transition ${selected === t.id ? 'border-[#FF9F00] bg-[#FF9F00]/10' : 'border-white/10 hover:bg-white/5'}`}
          >
            <div className="text-sm font-medium">{t.name} <span className="text-xs text-white/40">· {t.itemCount} items</span></div>
            <div className="mt-0.5 text-xs text-white/50">{t.description}</div>
          </button>
        ))}
        {templates.length === 0 && <p className="text-sm text-white/40">Loading templates…</p>}
      </div>
      {selected && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input className={input} placeholder="Client name *" value={client.client_name} onChange={(e) => set('client_name', e.target.value)} />
          <input className={input} placeholder="Client WhatsApp (e.g. 0821234567)" value={client.client_phone} onChange={(e) => set('client_phone', e.target.value)} />
          <input className={input} placeholder="Client email" value={client.client_email} onChange={(e) => set('client_email', e.target.value)} />
          <input className={input} type="date" title="Start date (offsets count from here; default today)" value={client.anchorDate} onChange={(e) => set('anchorDate', e.target.value)} />
          <button
            onClick={apply}
            disabled={applying || !client.client_name}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-[#FF9F00] px-4 py-2 text-sm font-semibold text-[#0B1118] disabled:opacity-50 sm:col-span-2"
          >
            {applying ? <Loader2 size={15} className="animate-spin" /> : <Layers size={15} />} Apply template
          </button>
        </div>
      )}
    </div>
  );
}
