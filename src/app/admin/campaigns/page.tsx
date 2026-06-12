'use client';

/**
 * Campaigns list + builder. Create a WhatsApp questionnaire campaign, then open
 * it to upload contacts and launch. Consent-first by design.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Megaphone, Loader2, Trash2, X } from 'lucide-react';

interface Stats { total: number; completed: number; invited: number; opted_out: number }
interface Campaign {
  id: string; name: string; purpose: string; status: string; stats?: Stats | null;
}

const PURPOSE_LABEL: Record<string, string> = {
  lead_qual: 'Lead qualification', marketing: 'Marketing', research: 'Research', event: 'Event / training',
};
const STATUS_COLOR: Record<string, string> = {
  draft: '#888', sending: '#FF9F00', active: '#4caf50', paused: '#c8a96e', completed: '#3a4754',
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (data.ok) setCampaigns(data.campaigns);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('Delete this campaign and all its contacts?')) return;
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="min-h-screen bg-[#0B1118] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="mb-4 inline-flex items-center gap-1 text-sm text-white/50 hover:text-white">
          <ArrowLeft size={15} /> Dashboard
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">WhatsApp Campaigns</h1>
            <p className="text-sm text-white/50">CSV in → questionnaire out → leads back. Consent-first.</p>
          </div>
          <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5 rounded-lg bg-[#FF9F00] px-3 py-2 text-sm font-semibold text-[#0B1118]">
            <Plus size={15} /> New campaign
          </button>
        </div>

        {showForm && <Builder onCreated={() => { setShowForm(false); load(); }} onClose={() => setShowForm(false)} />}

        {loading ? (
          <div className="flex items-center gap-2 text-white/40"><Loader2 size={16} className="animate-spin" /> Loading…</div>
        ) : campaigns.length === 0 ? (
          <p className="text-white/40">No campaigns yet. Create one to get started.</p>
        ) : (
          <div className="space-y-2">
            {campaigns.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#121820] px-4 py-3">
                <Link href={`/admin/campaigns/${c.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Megaphone size={15} className="text-[#FF9F00]" />
                    <span className="truncate font-medium">{c.name}</span>
                    <span className="rounded px-1.5 py-0.5 text-[10px] uppercase" style={{ background: (STATUS_COLOR[c.status] ?? '#888') + '22', color: STATUS_COLOR[c.status] ?? '#888' }}>{c.status}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-white/40">
                    {PURPOSE_LABEL[c.purpose] ?? c.purpose}
                    {c.stats && ` · ${c.stats.total} contacts · ${c.stats.completed} completed · ${c.stats.opted_out} opted out`}
                  </div>
                </Link>
                <button onClick={() => remove(c.id)} className="ml-3 rounded-lg border border-white/10 p-1.5 text-white/40 hover:text-[#e5484d]"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const DEFAULT_INTRO =
  'This is Breed Industries 👋 We help SA businesses with company registration, tax, tenders & more. We\'d love to ask you a couple of quick questions.\n\nReply *YES* to continue, or *STOP* to opt out.';

function Builder({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const [f, setF] = useState({
    name: '', purpose: 'lead_qual', source_tag: 'warm',
    intro_message: DEFAULT_INTRO,
    outro_message: 'Thank you! 🙏 Our team will be in touch shortly. — Breed Industries',
    create_lead: true,
  });
  const [questions, setQuestions] = useState([{ key: 'q1', prompt: '', type: 'text', options: '' }]);
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setF((s) => ({ ...s, [k]: v }));

  const setQ = (i: number, k: string, v: string) =>
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, [k]: v } : q)));
  const addQ = () => setQuestions((qs) => [...qs, { key: `q${qs.length + 1}`, prompt: '', type: 'text', options: '' }]);
  const delQ = (i: number) => setQuestions((qs) => qs.filter((_, idx) => idx !== i));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name || !f.intro_message) return;
    setSaving(true);
    try {
      const built = questions
        .filter((q) => q.prompt.trim())
        .map((q, i) => ({
          key: q.key?.trim() || `q${i + 1}`,
          prompt: q.prompt.trim(),
          type: q.type,
          options: q.type === 'choice' ? q.options.split(',').map((o) => o.trim()).filter(Boolean) : undefined,
        }));
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, questions: built }),
      });
      onCreated();
    } finally { setSaving(false); }
  }

  const input = 'w-full rounded-lg border border-white/15 bg-[#0B1118] px-3 py-2 text-sm outline-none focus:border-[#FF9F00]';

  return (
    <form onSubmit={submit} className="mb-6 space-y-4 rounded-xl border border-white/10 bg-[#121820] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">New campaign</h3>
        <button type="button" onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input className={input} placeholder="Campaign name" value={f.name} onChange={(e) => set('name', e.target.value)} />
        <select className={input} value={f.purpose} onChange={(e) => set('purpose', e.target.value)}>
          {Object.entries(PURPOSE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className={input} value={f.source_tag} onChange={(e) => set('source_tag', e.target.value)}>
          <option value="warm">Warm list (prior contact)</option>
          <option value="cold">Cold list (no prior contact)</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-white/50">Opening message (consent-first — must let them opt out)</label>
        <textarea className={input} rows={4} value={f.intro_message} onChange={(e) => set('intro_message', e.target.value)} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs text-white/50">Questions (asked one at a time after they reply YES)</label>
          <button type="button" onClick={addQ} className="text-xs text-[#FF9F00]">+ Add question</button>
        </div>
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={i} className="rounded-lg border border-white/10 p-2">
              <div className="flex gap-2">
                <input className={input} placeholder={`Question ${i + 1}`} value={q.prompt} onChange={(e) => setQ(i, 'prompt', e.target.value)} />
                <select className={input + ' max-w-[120px]'} value={q.type} onChange={(e) => setQ(i, 'type', e.target.value)}>
                  <option value="text">Text</option><option value="choice">Choice</option>
                  <option value="number">Number</option><option value="yes_no">Yes/No</option><option value="rating">Rating 1–5</option>
                </select>
                {questions.length > 1 && <button type="button" onClick={() => delQ(i)} className="rounded-lg border border-white/10 px-2 text-white/40 hover:text-[#e5484d]"><Trash2 size={14} /></button>}
              </div>
              {q.type === 'choice' && (
                <input className={input + ' mt-2'} placeholder="Options, comma-separated (e.g. Company reg, Tax, Tenders)" value={q.options} onChange={(e) => setQ(i, 'options', e.target.value)} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-white/50">Closing message</label>
          <textarea className={input} rows={2} value={f.outro_message} onChange={(e) => set('outro_message', e.target.value)} />
        </div>
        <label className="flex items-center gap-2 self-end text-sm text-white/70">
          <input type="checkbox" checked={f.create_lead} onChange={(e) => set('create_lead', e.target.checked)} />
          Auto-create a CRM lead on completion
        </label>
      </div>

      <button disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-[#FF9F00] px-4 py-2 text-sm font-semibold text-[#0B1118] disabled:opacity-50">
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Create campaign
      </button>
    </form>
  );
}
