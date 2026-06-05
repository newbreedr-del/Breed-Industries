'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header }   from '@/components/layout/Header';
import { Footer }   from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import {
  ArrowLeft, ExternalLink, Calendar, MapPin, Building2,
  Tag, DollarSign, Award, Users, ChevronRight, Clock,
  CheckCircle, XCircle, AlertTriangle, RefreshCw, Bell,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────

type Tender = {
  id: string;
  reference_number: string;
  title: string;
  description?: string;
  department?: string;
  province?: string;
  category?: string;
  commodity_codes: string[];
  estimated_value?: number;
  required_cidb_grade?: string;
  required_bee_level?: number;
  issue_date?: string;
  closing_date: string;
  briefing_date?: string;
  briefing_location?: string;
  source_url?: string;
  source: string;
  status: string;
  documents_required: boolean;
  document_fee: number;
  created_at: string;
};

type Match = {
  id: string;
  tender_id: string;
  client_id: string;
  match_score: number;
  match_reasons: string[];
  status: string;
  admin_notes?: string;
  notified_at?: string;
  client?: {
    id: string;
    name: string;
    company_name: string;
    email: string;
    package: string;
    cidb_grade?: string;
    provinces: string[];
  };
};

// ── Helpers ────────────────────────────────────────────────────

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}
function fmtRand(cents?: number) {
  if (!cents) return '—';
  return `R${(cents / 100).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`;
}
function daysLeft(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

const STATUS_COLORS: Record<string, string> = {
  new:      'bg-blue-500/20 text-blue-300 border-blue-500/30',
  notified: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  reviewed: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  applying: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  applied:  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  won:      'bg-green-500/20 text-green-300 border-green-500/30',
  lost:     'bg-red-500/20 text-red-300 border-red-500/30',
  declined: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

const TENDER_STATUS_COLORS: Record<string, string> = {
  open:      'bg-green-500/20 text-green-300',
  closed:    'bg-red-500/20 text-red-300',
  awarded:   'bg-blue-500/20 text-blue-300',
  cancelled: 'bg-gray-500/20 text-gray-300',
};

// ── Page ───────────────────────────────────────────────────────

export default function TenderDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [tender,  setTender]  = useState<Tender | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [updating,     setUpdating]     = useState<string | null>(null);
  const [sending,      setSending]      = useState<string | null>(null);
  const [sentOk,       setSentOk]       = useState<string | null>(null);
  const [tenderStatus, setTenderStatus] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/tenders/${id}`);
      if (res.status === 404) { setError('Tender not found.'); return; }
      if (!res.ok) throw new Error('Failed to load tender');
      const data = await res.json();
      setTender(data.tender);
      setMatches(data.matches ?? []);
      setTenderStatus(data.tender?.status ?? '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const sendNotification = async (matchId: string) => {
    setSending(matchId);
    setSentOk(null);
    try {
      const res = await fetch('/api/admin/send-match-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: matchId }),
      });
      if (res.ok) { setSentOk(matchId); setTimeout(() => setSentOk(null), 4000); await load(); }
    } finally { setSending(null); }
  };

  const updateMatchStatus = async (matchId: string, status: string) => {
    setUpdating(matchId);
    try {
      await fetch(`/api/tender-matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setMatches(ms => ms.map(m => m.id === matchId ? { ...m, status } : m));
    } finally {
      setUpdating(null);
    }
  };

  const saveTenderStatus = async () => {
    if (!tender || tenderStatus === tender.status) return;
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/tenders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: tenderStatus }),
      });
      if (res.ok) {
        const d = await res.json();
        setTender(d.tender);
      }
    } finally {
      setSavingStatus(false);
    }
  };

  const days = tender ? daysLeft(tender.closing_date) : 0;

  // ── Loading / error states ────────────────────────────────

  if (loading) return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0B1118] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-accent mx-auto mb-3" size={28} />
          <p className="text-white/50 text-sm">Loading tender…</p>
        </div>
      </div>
      <Footer />
    </>
  );

  if (error || !tender) return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0B1118] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="text-red-400 mx-auto mb-3" size={36} />
          <p className="text-white font-medium mb-1">Tender not found</p>
          <p className="text-white/50 text-sm mb-5">{error || 'This tender does not exist.'}</p>
          <button onClick={() => router.push('/admin/tenders')} className="btn btn-primary text-sm px-5 py-2">
            Back to Tenders
          </button>
        </div>
      </div>
      <Footer />
    </>
  );

  // ── Main render ───────────────────────────────────────────

  return (
    <>
      <Header />

      <PageHero
        title={tender.title}
        subtitle={tender.reference_number}
        description={tender.department ?? tender.source}
        breadcrumbs={[
          { label: 'Admin',   href: '/admin' },
          { label: 'Tenders', href: '/admin/tenders' },
          { label: tender.reference_number, href: `/admin/tenders/${id}` },
        ]}
        size="default"
        align="left"
      >
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${TENDER_STATUS_COLORS[tender.status] ?? 'bg-gray-500/20 text-gray-300'}`}>
            {tender.status}
          </span>
          {days > 0
            ? <span className={`text-sm font-medium ${days <= 3 ? 'text-red-400' : days <= 7 ? 'text-yellow-400' : 'text-white/60'}`}>
                {days} day{days !== 1 ? 's' : ''} left
              </span>
            : <span className="text-sm text-red-400 font-medium">Closed</span>
          }
          {tender.source_url && (
            <a
              href={tender.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-accent text-sm hover:underline"
            >
              <ExternalLink size={13} /> View Source
            </a>
          )}
        </div>
      </PageHero>

      <section className="py-10 md:py-14 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">

          {/* Back link */}
          <Link href="/admin/tenders" className="inline-flex items-center gap-1.5 text-white/50 hover:text-accent text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to Tenders
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT: Details ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Core info */}
              <div className="glass-card p-5 md:p-6">
                <h2 className="text-base font-heading font-bold text-white mb-4 flex items-center gap-2">
                  <FileText2 /> Tender Details
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <Detail icon={<Tag size={14} />}      label="Reference"  value={tender.reference_number} mono />
                  <Detail icon={<Building2 size={14} />} label="Department" value={tender.department} />
                  <Detail icon={<MapPin size={14} />}   label="Province"   value={tender.province} />
                  <Detail icon={<Tag size={14} />}      label="Category"   value={tender.category} />
                  <Detail icon={<Calendar size={14} />} label="Closes"     value={fmtDate(tender.closing_date)}
                    extra={days > 0 ? `${days} days left` : 'Closed'}
                    extraColor={days <= 3 ? 'text-red-400' : days <= 7 ? 'text-yellow-400' : 'text-white/40'}
                  />
                  {tender.issue_date && (
                    <Detail icon={<Calendar size={14} />} label="Issued" value={fmtDate(tender.issue_date)} />
                  )}
                  <Detail icon={<DollarSign size={14} />} label="Est. Value" value={fmtRand(tender.estimated_value)} />
                  <Detail icon={<Award size={14} />}     label="CIDB Grade" value={tender.required_cidb_grade} />
                  {tender.required_bee_level && (
                    <Detail icon={<Award size={14} />}   label="BEE Level"  value={`Level ${tender.required_bee_level}`} />
                  )}
                  <Detail icon={<Tag size={14} />} label="Source" value={tender.source} />
                </dl>

                {tender.briefing_date && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Briefing</p>
                    <p className="text-white text-sm">{fmtDate(tender.briefing_date)}</p>
                    {tender.briefing_location && (
                      <p className="text-white/60 text-xs mt-0.5">{tender.briefing_location}</p>
                    )}
                  </div>
                )}

                {tender.commodity_codes?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Commodity Codes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tender.commodity_codes.map(c => (
                        <span key={c} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-white/70 font-mono">{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {tender.description && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Description</p>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{tender.description}</p>
                  </div>
                )}
              </div>

              {/* Matches */}
              <div className="glass-card overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
                    <Users size={16} className="text-accent" />
                    Matched Clients
                    <span className="ml-1 text-xs bg-white/10 text-white/60 rounded-full px-2 py-0.5">{matches.length}</span>
                  </h2>
                </div>

                {matches.length === 0 ? (
                  <div className="text-center py-12 text-white/40 text-sm">
                    No client matches for this tender yet.
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {matches.map(m => (
                      <div key={m.id} className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-white font-medium text-sm">{m.client?.company_name ?? m.client_id}</p>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_COLORS[m.status] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                                {m.status}
                              </span>
                            </div>
                            <p className="text-white/50 text-xs mt-0.5">{m.client?.email}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <ScoreBadge score={m.match_score} />
                            <Link
                              href={`/admin/tender-clients/${m.client_id}`}
                              className="text-white/30 hover:text-accent transition-colors"
                            >
                              <ChevronRight size={16} />
                            </Link>
                          </div>
                        </div>

                        {/* Match reasons */}
                        {m.match_reasons?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {m.match_reasons.map((r, i) => (
                              <span key={i} className="text-xs bg-accent/10 text-accent/80 border border-accent/20 rounded px-2 py-0.5">
                                {r}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Client meta */}
                        <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                          {m.client?.cidb_grade && <span>CIDB {m.client.cidb_grade}</span>}
                          {m.client?.provinces?.length > 0 && <span>{m.client.provinces.join(', ')}</span>}
                          {m.client?.package && (
                            <span className={`capitalize px-1.5 py-0.5 rounded text-xs ${
                              m.client.package === 'full'  ? 'bg-accent/20 text-accent' :
                              m.client.package === 'apply' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-purple-500/20 text-purple-300'
                            }`}>{m.client.package}</span>
                          )}
                          {m.notified_at && <span><Clock size={10} className="inline mr-0.5" />Notified {fmtDate(m.notified_at)}</span>}
                        </div>

                        {/* Send notification */}
                        {sentOk === m.id ? (
                          <span className="flex items-center gap-1 text-green-400 text-xs px-2 py-1">
                            <CheckCircle size={12} /> Sent
                          </span>
                        ) : (
                          <button
                            onClick={() => sendNotification(m.id)}
                            disabled={sending === m.id}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors disabled:opacity-40"
                          >
                            <Bell size={12} />
                            {sending === m.id ? 'Sending…' : 'Notify'}
                          </button>
                        )}

                        {/* Status update */}
                        <select
                          value=""
                          disabled={updating === m.id}
                          onChange={e => { if (e.target.value) updateMatchStatus(m.id, e.target.value); }}
                          className="text-xs bg-[#0B1118] border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-accent disabled:opacity-40"
                          style={{ colorScheme: 'dark' }}
                        >
                          <option value="" style={{ background: '#0B1118' }}>{updating === m.id ? 'Updating…' : 'Update status…'}</option>
                          {['new','notified','reviewed','applying','applied','won','lost','declined']
                            .filter(s => s !== m.status)
                            .map(s => <option key={s} value={s} style={{ background: '#0B1118' }}>{s}</option>)
                          }
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div className="space-y-5">

              {/* Status control */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-medium text-white/70 mb-3">Tender Status</h3>
                <select
                  value={tenderStatus}
                  onChange={e => setTenderStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0B1118] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent mb-3"
                  style={{ colorScheme: 'dark' }}
                >
                  {['open','closed','awarded','cancelled'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <button
                  onClick={saveTenderStatus}
                  disabled={savingStatus || tenderStatus === tender.status}
                  className="w-full btn btn-primary text-sm py-2 disabled:opacity-40"
                >
                  {savingStatus ? 'Saving…' : 'Update Status'}
                </button>
              </div>

              {/* Quick stats */}
              <div className="glass-card p-5 space-y-3">
                <h3 className="text-sm font-medium text-white/70 mb-3">Match Summary</h3>
                {(['new','notified','applying','applied','won'] as const).map(s => {
                  const count = matches.filter(m => m.status === s).length;
                  if (count === 0) return null;
                  return (
                    <div key={s} className="flex items-center justify-between text-sm">
                      <span className={`capitalize px-2 py-0.5 rounded-full text-xs border ${STATUS_COLORS[s] ?? ''}`}>{s}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  );
                })}
                {matches.length === 0 && <p className="text-white/40 text-sm">No matches yet</p>}
              </div>

              {/* Dates */}
              <div className="glass-card p-5 space-y-3 text-sm">
                <h3 className="text-sm font-medium text-white/70 mb-3">Key Dates</h3>
                {tender.issue_date && (
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">Issued</span>
                    <span>{fmtDate(tender.issue_date)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/70">
                  <span className="text-white/40">Closes</span>
                  <span className={days <= 3 ? 'text-red-400' : days <= 7 ? 'text-yellow-400' : ''}>{fmtDate(tender.closing_date)}</span>
                </div>
                {tender.briefing_date && (
                  <div className="flex justify-between text-white/70">
                    <span className="text-white/40">Briefing</span>
                    <span>{fmtDate(tender.briefing_date)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/70">
                  <span className="text-white/40">Added</span>
                  <span>{fmtDate(tender.created_at)}</span>
                </div>
              </div>

              {tender.source_url && (
                <a
                  href={tender.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full btn btn-outline text-sm py-2.5"
                >
                  <ExternalLink size={14} /> View Original Tender
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function FileText2() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
}

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 70 ? 'bg-green-500/20 text-green-300' :
              score >= 40 ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300';
  return (
    <span className={`inline-flex items-center justify-center w-10 h-6 rounded text-xs font-bold ${cls}`}>
      {score}
    </span>
  );
}

function Detail({
  icon, label, value, mono, extra, extraColor,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  mono?: boolean;
  extra?: string;
  extraColor?: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-white/40 text-xs mb-0.5">
        {icon} {label}
      </dt>
      <dd className={`text-white text-sm ${mono ? 'font-mono' : ''}`}>
        {value ?? '—'}
        {extra && <span className={`text-xs ml-1.5 ${extraColor ?? 'text-white/40'}`}>{extra}</span>}
      </dd>
    </div>
  );
}
