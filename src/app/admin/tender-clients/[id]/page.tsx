'use client';

/**
 * /admin/tender-clients/[id]
 *
 * Complete client profile with:
 *  – Tender Matches tab (all packages)
 *  – Applications tab   (apply / full packages) — document checklist, submission, meetings
 *  – Reg Docs tab       (all packages) — CSD, CIDB, BBBEE, Tax Pin, Company Profile
 *  – Profile sidebar    — contact, credentials, categories, notes
 *
 * Package tiers (from poster):
 *  watch  R350/mo  — matching + alerts + digest
 *  apply  R950/mo + R750/doc set — watch + doc compilation + submission
 *  full   R2,550/mo + R2,000/tender — apply + site meetings + full managed
 *  ready  R3,500 once-off — registration docs only
 */

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header }   from '@/components/layout/Header';
import { Footer }   from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import {
  ArrowLeft, Mail, Phone, MapPin, Award, FileText, CheckCircle,
  Clock, TrendingUp, ExternalLink, Bell, ChevronDown, ChevronUp,
  Plus, Save, AlertCircle, Users, Briefcase, BookOpen, X,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────

type Client = {
  id: string; name: string; first_name?: string; last_name?: string;
  company_name: string; email: string; phone?: string;
  cidb_grade?: string; bee_level?: number; csd_number?: string; tax_pin?: string;
  provinces: string[]; service_categories: string[];
  max_tender_value: number; package: string;
  is_active: boolean; notes?: string;
  package_started_at: string; package_expires_at?: string;
};

type Match = {
  id: string; match_score: number; status: string; match_reasons: string[];
  notified_at?: string; applied_at?: string;
  tender?: {
    id: string; reference_number: string; title: string;
    closing_date: string; province?: string; estimated_value?: number;
    source_url?: string; status: string; department?: string;
    briefing_date?: string; briefing_location?: string;
  };
};

type Application = {
  id: string; match_id: string; tender_id: string; client_id: string;
  status: string; submitted_at?: string;
  documents_submitted: string[];
  meeting_attended: boolean; meeting_date?: string; meeting_location?: string;
  extra_charges: number; extra_charges_description?: string; notes?: string;
  created_at: string; updated_at: string;
};

// ── Constants ──────────────────────────────────────────────────

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

const APP_STATUS_COLORS: Record<string, string> = {
  preparing:   'bg-yellow-500/20 text-yellow-300',
  submitted:   'bg-cyan-500/20 text-cyan-300',
  shortlisted: 'bg-purple-500/20 text-purple-300',
  won:         'bg-green-500/20 text-green-300',
  lost:        'bg-red-500/20 text-red-300',
};

const PACKAGES: Record<string, { label: string; color: string; price: string }> = {
  ready: { label: 'Tender Ready',  color: 'text-white',      price: 'R3,500 once-off' },
  watch: { label: 'Tender Watch',  color: 'text-purple-400', price: 'R350/month' },
  apply: { label: 'Tender Apply',  color: 'text-blue-400',   price: 'R950/month + R750/doc set' },
  full:  { label: 'Full Service',  color: 'text-accent',     price: 'R2,550/month + R2,000/tender' },
};

// Docs required for a full application (Apply + Full packages)
const APPLICATION_DOCS = [
  'Tax Clearance Certificate',
  'CIDB Certificate',
  'BBBEE Certificate',
  'CSD Registration Printout',
  'Company Registration (CIPC)',
  'Company Profile',
  'Pricing Schedule / BOQ',
  'Method Statement',
  'ID Copies (Directors)',
  'Bank Statement (3 months)',
];

// Registration docs (Tender Ready + all packages)
const REG_DOCS = [
  { key: 'csd',      label: 'CSD Registration',     desc: 'Central Supplier Database profile' },
  { key: 'cidb',     label: 'CIDB Registration',     desc: 'Construction Industry Development Board' },
  { key: 'bbbee',    label: 'BBBEE Certificate',     desc: 'Broad-Based Black Economic Empowerment' },
  { key: 'tax_pin',  label: 'Tax Compliance Pin',    desc: 'SARS tax compliance status' },
  { key: 'profile',  label: 'Company Profile',       desc: 'Professional company overview document' },
  { key: 'cipc',     label: 'CIPC Registration',     desc: 'Companies and Intellectual Property Commission' },
];

// ── Helpers ────────────────────────────────────────────────────

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtRand(cents?: number) {
  if (!cents) return '—';
  return `R${(cents / 100).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`;
}
function daysLeft(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

// ── Select component ───────────────────────────────────────────

function DarkSelect({
  value, onChange, options, disabled, placeholder, className = '',
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean; placeholder?: string; className?: string;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      className={`bg-[#0B1118] border border-white/10 text-white text-sm rounded-lg px-3 py-2
        focus:outline-none focus:border-accent disabled:opacity-40 appearance-none ${className}`}
      style={{ colorScheme: 'dark' }}
    >
      {placeholder && <option value="" style={{ background: '#0B1118' }}>{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: '#0B1118' }}>{o.label}</option>
      ))}
    </select>
  );
}

// ── Main page ──────────────────────────────────────────────────

export default function TenderClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id }    = use(params);
  const router    = useRouter();

  const [client,       setClient]       = useState<Client | null>(null);
  const [matches,      setMatches]      = useState<Match[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState<'matches' | 'applications' | 'docs'>('matches');

  // per-match UI state
  const [updating,   setUpdating]   = useState<string | null>(null);
  const [sending,    setSending]    = useState<string | null>(null);
  const [sentOk,     setSentOk]     = useState<string | null>(null);

  // reg docs (stored as JSON in client.notes prefixed with __docs:)
  const [regDocs,    setRegDocs]    = useState<Record<string, 'pending' | 'in-progress' | 'done'>>({});
  const [savingDocs, setSavingDocs] = useState(false);

  // expanded application card
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [savingApp,   setSavingApp]   = useState<string | null>(null);

  // ── Load ─────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, aRes] = await Promise.all([
        fetch(`/api/tender-clients/${id}`),
        fetch(`/api/tender-applications?client_id=${id}`),
      ]);
      if (cRes.ok) {
        const d = await cRes.json();
        setClient(d.client);
        setMatches(d.matches ?? []);

        // Parse reg docs from notes field
        const notes: string = d.client?.notes ?? '';
        const docsMatch = notes.match(/__docs:([\s\S]*?)(?:__end|$)/);
        if (docsMatch) {
          try { setRegDocs(JSON.parse(docsMatch[1])); } catch { /* ignore */ }
        }
      }
      if (aRes.ok) {
        const d = await aRes.json();
        setApplications(d.applications ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // ── Actions ───────────────────────────────────────────────────

  const updateMatchStatus = async (matchId: string, status: string) => {
    setUpdating(matchId);
    await fetch(`/api/tender-matches/${matchId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await load();
    setUpdating(null);
  };

  const sendNotification = async (matchId: string) => {
    setSending(matchId);
    setSentOk(null);
    try {
      const res = await fetch('/api/admin/send-match-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: matchId }),
      });
      if (res.ok) {
        setSentOk(matchId);
        setTimeout(() => setSentOk(null), 4000);
        await load();
      }
    } finally {
      setSending(null);
    }
  };

  const toggleActive = async () => {
    if (!client) return;
    await fetch(`/api/tender-clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !client.is_active }),
    });
    setClient(c => c ? { ...c, is_active: !c.is_active } : c);
  };

  const saveRegDocs = async () => {
    if (!client) return;
    setSavingDocs(true);
    // Store docs JSON in notes field, preserving any real notes
    const baseNotes = (client.notes ?? '').replace(/__docs:[\s\S]*?(?:__end|$)/, '').trim();
    const newNotes = `${baseNotes}\n__docs:${JSON.stringify(regDocs)}__end`.trim();
    await fetch(`/api/tender-clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: newNotes }),
    });
    setSavingDocs(false);
  };

  const createApplication = async (match: Match) => {
    if (!match.tender) return;
    const res = await fetch('/api/tender-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        match_id:  match.id,
        tender_id: match.tender.id,
        client_id: id,
        status:    'preparing',
      }),
    });
    if (res.ok) {
      await load();
      setActiveTab('applications');
    }
  };

  const saveApplication = async (appId: string, updates: Partial<Application>) => {
    setSavingApp(appId);
    await fetch(`/api/tender-applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    await load();
    setSavingApp(null);
  };

  // ── Computed ──────────────────────────────────────────────────

  if (loading) return (
    <>
      <Header />
      <div className="min-h-screen bg-color-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/40 text-sm">Loading client…</p>
        </div>
      </div>
      <Footer />
    </>
  );

  if (!client) return (
    <>
      <Header />
      <div className="min-h-screen bg-color-bg-secondary flex items-center justify-center">
        <p className="text-white/40">Client not found.</p>
      </div>
      <Footer />
    </>
  );

  const pkg = PACKAGES[client.package] ?? { label: client.package, color: 'text-white', price: '' };

  const stats = {
    total:   matches.length,
    pending: matches.filter(m => ['new', 'notified', 'reviewed'].includes(m.status)).length,
    applied: matches.filter(m => ['applying', 'applied'].includes(m.status)).length,
    won:     matches.filter(m => m.status === 'won').length,
  };

  const hasApplicationsAccess = ['apply', 'full'].includes(client.package);
  const hasFullService         = client.package === 'full';
  const tabs = [
    { key: 'matches',      label: 'Tender Matches',     icon: TrendingUp },
    ...(hasApplicationsAccess ? [{ key: 'applications', label: 'Applications', icon: Briefcase }] : []),
    { key: 'docs',         label: 'Registration Docs',  icon: BookOpen },
  ] as { key: 'matches' | 'applications' | 'docs'; label: string; icon: React.ElementType }[];

  // ── Render ────────────────────────────────────────────────────

  return (
    <>
      <Header />

      <PageHero
        title={client.company_name}
        subtitle={`${pkg.label} · ${pkg.price}`}
        description={`${client.first_name ?? client.name} ${client.last_name ?? ''} · ${client.email}`.trim()}
        breadcrumbs={[
          { label: 'Admin',          href: '/admin' },
          { label: 'Tender Clients', href: '/admin/tender-clients' },
          { label: client.company_name, href: `/admin/tender-clients/${id}` },
        ]}
        size="default"
        align="left"
      >
        <div className="flex flex-wrap gap-2 mt-1">
          <button
            onClick={toggleActive}
            className={`btn text-sm ${client.is_active ? 'btn-outline' : 'btn-primary'}`}
          >
            {client.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <Link href={`/admin/tender-clients/${id}/edit`} className="btn btn-outline text-sm">
            Edit Profile
          </Link>
          <Link href="/admin/tender-clients" className="btn btn-outline flex items-center gap-1.5 text-sm">
            <ArrowLeft size={13} /> Back
          </Link>
        </div>
      </PageHero>

      <section className="py-10 md:py-14 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Matches', value: stats.total,   icon: TrendingUp, color: 'text-blue-400',   bg: 'bg-blue-500/10' },
              { label: 'Pending',       value: stats.pending, icon: Clock,       color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { label: 'Applied',       value: stats.applied, icon: FileText,    color: 'text-cyan-400',   bg: 'bg-cyan-500/10' },
              { label: 'Won',           value: stats.won,     icon: CheckCircle, color: 'text-green-400',  bg: 'bg-green-500/10' },
            ].map((s, i) => (
              <div key={i} className="glass-card p-4">
                <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-2`}>
                  <s.icon className={s.color} size={16} />
                </div>
                <p className="text-white/60 text-xs mb-0.5">{s.label}</p>
                <p className="text-2xl font-heading font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1 space-y-4">

              {/* Package */}
              <div className="glass-card p-5">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Package</p>
                <p className={`text-lg font-heading font-bold ${pkg.color}`}>{pkg.label}</p>
                <p className="text-white/50 text-sm">{pkg.price}</p>
                <p className="text-white/30 text-xs mt-1">Since {fmtDate(client.package_started_at)}</p>
                {client.package_expires_at && (
                  <p className="text-white/30 text-xs">Expires {fmtDate(client.package_expires_at)}</p>
                )}
                <div className="mt-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${client.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {client.is_active ? '● Active' : '○ Inactive'}
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div className="glass-card p-5 space-y-3">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Contact</p>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Mail size={13} className="text-accent shrink-0" />
                  <a href={`mailto:${client.email}`} className="hover:text-accent truncate">{client.email}</a>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Phone size={13} className="text-accent shrink-0" />
                    <a href={`tel:${client.phone}`} className="hover:text-accent">{client.phone}</a>
                  </div>
                )}
                {client.provinces.length > 0 && (
                  <div className="flex items-start gap-2 text-white/70 text-sm">
                    <MapPin size={13} className="text-accent mt-0.5 shrink-0" />
                    <span>{client.provinces.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Credentials */}
              <div className="glass-card p-5">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Credentials</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'CIDB Grade',  value: client.cidb_grade },
                    { label: 'BEE Level',   value: client.bee_level ? `Level ${client.bee_level}` : undefined },
                    { label: 'CSD No.',     value: client.csd_number, mono: true },
                    { label: 'Tax Pin',     value: client.tax_pin,    mono: true },
                    { label: 'Max Value',   value: client.max_tender_value ? fmtRand(client.max_tender_value * 100) : undefined },
                  ].filter(r => r.value).map(r => (
                    <div key={r.label} className="flex justify-between gap-2">
                      <span className="text-white/40">{r.label}</span>
                      <span className={`text-white font-medium ${r.mono ? 'font-mono text-xs' : ''}`}>{r.value}</span>
                    </div>
                  ))}
                  {!client.cidb_grade && !client.csd_number && (
                    <p className="text-white/30 text-xs">No credentials on record</p>
                  )}
                </div>
              </div>

              {/* Categories */}
              {client.service_categories.length > 0 && (
                <div className="glass-card p-5">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Service Categories</p>
                  <div className="flex flex-wrap gap-1.5">
                    {client.service_categories.map(c => (
                      <span key={c} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-white/60">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes (clean — no internal JSON) */}
              {client.notes && !client.notes.includes('__docs:') && (
                <div className="glass-card p-5">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Notes</p>
                  <p className="text-white/60 text-sm leading-relaxed">{client.notes}</p>
                </div>
              )}
              {client.notes?.includes('__docs:') && (() => {
                const clean = client.notes.replace(/__docs:[\s\S]*?__end/, '').trim();
                return clean ? (
                  <div className="glass-card p-5">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-white/60 text-sm leading-relaxed">{clean}</p>
                  </div>
                ) : null;
              })()}

            </div>

            {/* ── Main content ── */}
            <div className="lg:col-span-3">

              {/* Tabs */}
              <div className="flex gap-1 mb-5 bg-white/5 rounded-lg p-1 w-fit overflow-x-auto max-w-full">
                {tabs.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === t.key ? 'bg-accent text-black' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <t.icon size={14} />
                    {t.label}
                    {t.key === 'matches' && stats.pending > 0 && (
                      <span className="ml-0.5 bg-yellow-500/30 text-yellow-300 text-xs rounded-full px-1.5 py-0.5">{stats.pending}</span>
                    )}
                    {t.key === 'applications' && applications.filter(a => a.status === 'preparing').length > 0 && (
                      <span className="ml-0.5 bg-orange-500/30 text-orange-300 text-xs rounded-full px-1.5 py-0.5">
                        {applications.filter(a => a.status === 'preparing').length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── MATCHES TAB ── */}
              {activeTab === 'matches' && (
                <div className="glass-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-heading font-bold text-white">Tender Matches</h3>
                      <p className="text-white/40 text-xs mt-0.5">{matches.length} tenders found for this client</p>
                    </div>
                  </div>

                  {matches.length === 0 ? (
                    <div className="text-center py-16">
                      <TrendingUp size={36} className="mx-auto mb-3 text-white/20" />
                      <p className="text-white/40 text-sm">No matches yet. Run a scrape to find tenders.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {matches.map(m => {
                        const days  = m.tender ? daysLeft(m.tender.closing_date) : 0;
                        const appExists = applications.some(a => a.match_id === m.id);
                        return (
                          <div key={m.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">

                                {/* Header row */}
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  <span className="font-mono text-xs text-accent">{m.tender?.reference_number}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${STATUS_COLORS[m.status] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                                    {m.status}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    m.match_score >= 70 ? 'bg-green-500/20 text-green-300' :
                                    m.match_score >= 40 ? 'bg-yellow-500/20 text-yellow-300' :
                                    'bg-red-500/20 text-red-300'
                                  }`}>{m.match_score}/100</span>
                                </div>

                                <p className="text-white font-medium text-sm leading-snug">{m.tender?.title}</p>

                                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-white/40">
                                  {m.tender?.province && <span>{m.tender.province}</span>}
                                  {m.tender?.closing_date && (
                                    <span className={days <= 3 ? 'text-red-400 font-medium' : days <= 7 ? 'text-yellow-400' : ''}>
                                      Closes {fmtDate(m.tender.closing_date)}{days > 0 ? ` · ${days}d` : ' · CLOSED'}
                                    </span>
                                  )}
                                  {m.tender?.estimated_value && <span>{fmtRand(m.tender.estimated_value)}</span>}
                                  {m.notified_at && <span><Bell size={10} className="inline mr-0.5" />Notified {fmtDate(m.notified_at)}</span>}
                                </div>

                                {m.match_reasons.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {m.match_reasons.map((r, i) => (
                                      <span key={i} className="px-1.5 py-0.5 bg-accent/10 border border-accent/20 rounded text-xs text-accent/70">{r}</span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                                {m.tender?.source_url && (
                                  <a href={m.tender.source_url} target="_blank" rel="noopener noreferrer"
                                    className="p-1.5 text-white/30 hover:text-accent transition-colors" title="View source">
                                    <ExternalLink size={13} />
                                  </a>
                                )}
                                <Link href={`/admin/tenders/${m.tender?.id}`}
                                  className="p-1.5 text-white/30 hover:text-accent transition-colors" title="View tender">
                                  <FileText size={13} />
                                </Link>

                                {/* Send notification */}
                                {sentOk === m.id ? (
                                  <span className="flex items-center gap-1 text-green-400 text-xs px-2 py-1">
                                    <CheckCircle size={12} /> Sent
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => sendNotification(m.id)}
                                    disabled={sending === m.id}
                                    title="Send email notification to client"
                                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors disabled:opacity-40"
                                  >
                                    <Bell size={12} />
                                    {sending === m.id ? 'Sending…' : 'Notify'}
                                  </button>
                                )}

                                {/* Status update */}
                                <DarkSelect
                                  value=""
                                  disabled={updating === m.id}
                                  placeholder={updating === m.id ? 'Updating…' : 'Update…'}
                                  options={['new','notified','reviewed','applying','applied','won','lost','declined']
                                    .filter(s => s !== m.status)
                                    .map(s => ({ value: s, label: s }))}
                                  onChange={v => { if (v) updateMatchStatus(m.id, v); }}
                                  className="text-xs py-1.5"
                                />

                                {/* Start application (Apply/Full only) */}
                                {hasApplicationsAccess && !appExists && ['applying','applied'].includes(m.status) && (
                                  <button
                                    onClick={() => createApplication(m)}
                                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition-colors"
                                  >
                                    <Plus size={12} /> Track
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── APPLICATIONS TAB ── */}
              {activeTab === 'applications' && hasApplicationsAccess && (
                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <div className="glass-card text-center py-16">
                      <Briefcase size={36} className="mx-auto mb-3 text-white/20" />
                      <p className="text-white/50 font-medium mb-2">No applications tracked yet</p>
                      <p className="text-white/30 text-sm max-w-xs mx-auto leading-relaxed">
                        Go to the Matches tab, move a match to "applying", and click <strong className="text-white/50">Track</strong> to start tracking.
                      </p>
                    </div>
                  ) : (
                    applications.map(app => {
                      const match   = matches.find(m => m.id === app.match_id);
                      const isOpen  = expandedApp === app.id;
                      const isSaving = savingApp === app.id;

                      return (
                        <ApplicationCard
                          key={app.id}
                          app={app}
                          match={match}
                          isOpen={isOpen}
                          isSaving={isSaving}
                          hasFullService={hasFullService}
                          onToggle={() => setExpandedApp(isOpen ? null : app.id)}
                          onSave={updates => saveApplication(app.id, updates)}
                        />
                      );
                    })
                  )}
                </div>
              )}

              {/* ── REGISTRATION DOCS TAB ── */}
              {activeTab === 'docs' && (
                <div className="glass-card p-5 md:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-base font-heading font-bold text-white">Registration Documents</h3>
                      <p className="text-white/40 text-xs mt-0.5">Track compliance document status for this client</p>
                    </div>
                    <button
                      onClick={saveRegDocs}
                      disabled={savingDocs}
                      className="flex items-center gap-1.5 btn btn-primary text-sm py-2 px-4 disabled:opacity-40"
                    >
                      <Save size={13} />
                      {savingDocs ? 'Saving…' : 'Save'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {REG_DOCS.map(doc => {
                      const status = regDocs[doc.key] ?? 'pending';
                      return (
                        <div key={doc.key} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                          status === 'done'        ? 'bg-green-500/5 border-green-500/20' :
                          status === 'in-progress' ? 'bg-yellow-500/5 border-yellow-500/20' :
                          'bg-white/[0.02] border-white/10'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              status === 'done'        ? 'bg-green-500/20' :
                              status === 'in-progress' ? 'bg-yellow-500/20' :
                              'bg-white/10'
                            }`}>
                              {status === 'done'        ? <CheckCircle size={16} className="text-green-400" /> :
                               status === 'in-progress' ? <Clock size={16} className="text-yellow-400" /> :
                               <FileText size={16} className="text-white/40" />}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{doc.label}</p>
                              <p className="text-white/40 text-xs">{doc.desc}</p>
                            </div>
                          </div>
                          <DarkSelect
                            value={status}
                            onChange={v => setRegDocs(d => ({ ...d, [doc.key]: v as any }))}
                            options={[
                              { value: 'pending',     label: 'Pending' },
                              { value: 'in-progress', label: 'In Progress' },
                              { value: 'done',        label: '✓ Done' },
                            ]}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-6 text-sm">
                    <span className="text-green-400 font-medium">
                      {Object.values(regDocs).filter(v => v === 'done').length} / {REG_DOCS.length} Complete
                    </span>
                    <span className="text-yellow-400">
                      {Object.values(regDocs).filter(v => v === 'in-progress').length} In Progress
                    </span>
                    <span className="text-white/40">
                      {REG_DOCS.length - Object.keys(regDocs).length + Object.values(regDocs).filter(v => v === 'pending').length} Pending
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// ── Application Card ───────────────────────────────────────────

function ApplicationCard({
  app, match, isOpen, isSaving, hasFullService, onToggle, onSave,
}: {
  app: Application;
  match?: Match;
  isOpen: boolean;
  isSaving: boolean;
  hasFullService: boolean;
  onToggle: () => void;
  onSave: (updates: Partial<Application>) => void;
}) {
  const [form, setForm] = useState({
    status:                    app.status,
    submitted_at:              app.submitted_at ?? '',
    notes:                     app.notes ?? '',
    meeting_attended:          app.meeting_attended,
    meeting_date:              app.meeting_date ?? '',
    meeting_location:          app.meeting_location ?? '',
    extra_charges:             app.extra_charges ?? 0,
    extra_charges_description: app.extra_charges_description ?? '',
  });

  const [docs, setDocs] = useState<Record<string, boolean>>(
    Object.fromEntries(APPLICATION_DOCS.map(d => [d, app.documents_submitted.includes(d)]))
  );

  const handleSave = () => {
    onSave({
      ...form,
      submitted_at: form.submitted_at || undefined,
      meeting_date: form.meeting_date || undefined,
      meeting_location: form.meeting_location || undefined,
      documents_submitted: Object.entries(docs).filter(([, v]) => v).map(([k]) => k),
    });
  };

  const docsComplete = Object.values(docs).filter(Boolean).length;
  const days = match?.tender ? daysLeft(match.tender.closing_date) : 0;

  return (
    <div className={`glass-card overflow-hidden transition-all`}>
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-xs text-accent">{match?.tender?.reference_number ?? '—'}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${APP_STATUS_COLORS[app.status] ?? 'bg-gray-500/20 text-gray-300'}`}>
                {app.status}
              </span>
              <span className="text-xs text-white/40">{docsComplete}/{APPLICATION_DOCS.length} docs</span>
              {days > 0 && (
                <span className={`text-xs font-medium ${days <= 3 ? 'text-red-400' : days <= 7 ? 'text-yellow-400' : 'text-white/40'}`}>
                  {days}d left
                </span>
              )}
            </div>
            <p className="text-white text-sm font-medium leading-snug truncate">{match?.tender?.title ?? '—'}</p>
            <p className="text-white/40 text-xs mt-0.5">{match?.tender?.department}</p>
          </div>
          <div className="shrink-0 text-white/30">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {/* Doc progress bar */}
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${docsComplete === APPLICATION_DOCS.length ? 'bg-green-500' : 'bg-accent'}`}
            style={{ width: `${(docsComplete / APPLICATION_DOCS.length) * 100}%` }}
          />
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="border-t border-white/10 px-5 py-5 space-y-6">

          {/* Status + Submission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wider">Application Status</label>
              <DarkSelect
                value={form.status}
                onChange={v => setForm(f => ({ ...f, status: v }))}
                options={[
                  { value: 'preparing',   label: 'Preparing Documents' },
                  { value: 'submitted',   label: 'Submitted' },
                  { value: 'shortlisted', label: 'Shortlisted' },
                  { value: 'won',         label: '🏆 Won' },
                  { value: 'lost',        label: 'Lost / Unsuccessful' },
                ]}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wider">Date Submitted</label>
              <input
                type="date"
                value={form.submitted_at ? form.submitted_at.slice(0, 10) : ''}
                onChange={e => setForm(f => ({ ...f, submitted_at: e.target.value }))}
                className="w-full px-3 py-2 bg-[#0B1118] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          {/* Document Checklist */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Document Checklist</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {APPLICATION_DOCS.map(doc => (
                <label key={doc} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  docs[doc] ? 'bg-green-500/5 border-green-500/20' : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}>
                  <input
                    type="checkbox"
                    checked={docs[doc] ?? false}
                    onChange={e => setDocs(d => ({ ...d, [doc]: e.target.checked }))}
                    className="accent-accent w-4 h-4"
                  />
                  <span className={`text-sm ${docs[doc] ? 'text-green-300' : 'text-white/60'}`}>{doc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Site Meeting (Full Service only) */}
          {hasFullService && (
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Site / Briefing Meeting</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.meeting_attended}
                    onChange={e => setForm(f => ({ ...f, meeting_attended: e.target.checked }))}
                    className="accent-accent w-4 h-4"
                  />
                  <span className="text-white/70 text-sm">Meeting Attended</span>
                </label>
                <div>
                  <label className="block text-white/50 text-xs mb-1">Meeting Date</label>
                  <input
                    type="date"
                    value={form.meeting_date ? form.meeting_date.slice(0, 10) : ''}
                    onChange={e => setForm(f => ({ ...f, meeting_date: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#0B1118] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1">Location</label>
                  <input
                    type="text"
                    value={form.meeting_location}
                    onChange={e => setForm(f => ({ ...f, meeting_location: e.target.value }))}
                    placeholder="e.g. DPW Durban offices"
                    className="w-full px-3 py-2 bg-[#0B1118] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent placeholder-white/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Extra Charges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wider">Extra Charges (R)</label>
              <input
                type="number"
                min="0"
                value={form.extra_charges}
                onChange={e => setForm(f => ({ ...f, extra_charges: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-[#0B1118] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wider">Charges Description</label>
              <input
                type="text"
                value={form.extra_charges_description}
                onChange={e => setForm(f => ({ ...f, extra_charges_description: e.target.value }))}
                placeholder="e.g. Document fee, courier"
                className="w-full px-3 py-2 bg-[#0B1118] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent placeholder-white/30"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white/50 text-xs mb-1.5 uppercase tracking-wider">Internal Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Track anything relevant about this application…"
              className="w-full px-3 py-2 bg-[#0B1118] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent resize-none placeholder-white/30"
            />
          </div>

          {/* Save */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 btn btn-primary text-sm px-5 py-2 disabled:opacity-40"
            >
              <Save size={14} />
              {isSaving ? 'Saving…' : 'Save Application'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
