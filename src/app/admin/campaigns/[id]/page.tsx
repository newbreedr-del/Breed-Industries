'use client';

/**
 * Campaign detail — upload contacts, launch/continue sending, watch responses.
 */

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Send, Loader2, Users, CheckCircle2, UserX, RefreshCw } from 'lucide-react';

interface Question { key: string; prompt: string; type: string; options?: string[] }
interface Campaign { id: string; name: string; purpose: string; status: string; questions: Question[]; intro_message: string; batch_size: number }
interface Stats { total: number; queued: number; invited: number; in_progress: number; completed: number; opted_out: number; failed: number; completion_rate: number }
interface Contact { id: string; phone: string; name: string | null; status: string; answers: Record<string, string> }

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${id}`);
      const data = await res.json();
      if (data.ok) { setCampaign(data.campaign); setStats(data.stats); setContacts(data.contacts); }
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function uploadCsv(file: File) {
    setBusy('upload'); setBanner(null);
    try {
      const csv = await file.text();
      const res = await fetch(`/api/campaigns/${id}/contacts`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ csv }),
      });
      const data = await res.json();
      setBanner(data.ok
        ? `Imported ${data.inserted} contacts (${data.invalidSkipped} invalid, ${data.duplicatesRemoved} duplicate, ${data.optedOutSkipped} opted-out skipped).`
        : `Upload failed: ${data.error?.message}`);
      load();
    } finally { setBusy(null); }
  }

  async function sendBatch() {
    if (!confirm('Send the next batch of WhatsApp invites? This contacts real people.')) return;
    setBusy('send'); setBanner(null);
    try {
      const res = await fetch(`/api/campaigns/${id}/drip`, { method: 'POST' });
      const data = await res.json();
      setBanner(data.ok ? `Sent ${data.sent} invites (${data.failed} failed). ${data.remaining} still queued.` : `Send failed: ${data.error?.message}`);
      load();
    } finally { setBusy(null); }
  }

  if (loading) return <div className="min-h-screen bg-[#0B1118] p-10 text-white/50"><Loader2 className="animate-spin" /></div>;
  if (!campaign) return <div className="min-h-screen bg-[#0B1118] p-10 text-white/50">Campaign not found.</div>;

  const completed = contacts.filter((c) => c.status === 'completed');

  return (
    <div className="min-h-screen bg-[#0B1118] px-5 py-8 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/campaigns" className="mb-4 inline-flex items-center gap-1 text-sm text-white/50 hover:text-white">
          <ArrowLeft size={15} /> Campaigns
        </Link>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold">{campaign.name}</h1>
            <p className="text-sm text-white/50">{campaign.questions.length} questions · status: {campaign.status}</p>
          </div>
          <div className="flex gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5">
              {busy === 'upload' ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Upload CSV
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && uploadCsv(e.target.files[0])} />
            </label>
            <button onClick={sendBatch} disabled={busy === 'send' || !stats?.queued} className="flex items-center gap-1.5 rounded-lg bg-[#FF9F00] px-3 py-2 text-sm font-semibold text-[#0B1118] disabled:opacity-40">
              {busy === 'send' ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Send next batch
            </button>
            <button onClick={load} className="rounded-lg border border-white/15 p-2 hover:bg-white/5"><RefreshCw size={15} /></button>
          </div>
        </div>

        {banner && <div className="mb-5 rounded-lg border border-[#FF9F00]/30 bg-[#FF9F00]/10 px-4 py-3 text-sm">{banner}</div>}

        {stats && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={<Users size={15} />} label="Contacts" value={stats.total} />
            <Stat icon={<Send size={15} />} label="Queued" value={stats.queued} tone="#FF9F00" />
            <Stat icon={<CheckCircle2 size={15} />} label={`Completed (${stats.completion_rate}%)`} value={stats.completed} tone="#4caf50" />
            <Stat icon={<UserX size={15} />} label="Opted out" value={stats.opted_out} tone="#e5484d" />
          </div>
        )}

        <h2 className="mb-2 text-sm font-semibold text-white/80">Responses ({completed.length})</h2>
        {completed.length === 0 ? (
          <p className="text-sm text-white/40">No completed responses yet. Upload contacts and send the first batch.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#121820] text-xs uppercase text-white/40">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Phone</th>
                  {campaign.questions.map((q) => <th key={q.key} className="px-3 py-2">{q.prompt.slice(0, 24)}</th>)}
                </tr>
              </thead>
              <tbody>
                {completed.map((c) => (
                  <tr key={c.id} className="border-t border-white/5 bg-[#121820]/50">
                    <td className="px-3 py-2">{c.name ?? '—'}</td>
                    <td className="px-3 py-2 text-white/60">{c.phone}</td>
                    {campaign.questions.map((q) => <td key={q.key} className="px-3 py-2 text-white/80">{c.answers[q.key] ?? '—'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#121820] p-4">
      <div className="flex items-center gap-1.5 text-xs" style={{ color: tone ?? '#9aa4b2' }}>{icon}{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
