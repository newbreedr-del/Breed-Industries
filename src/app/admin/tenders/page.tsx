'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header }     from '@/components/layout/Header';
import { Footer }     from '@/components/layout/Footer';
import { PageHero }   from '@/components/layout/PageHero';
import {
  Search, RefreshCw, Plus, Users, FileText,
  AlertTriangle, CheckCircle, Clock, TrendingUp, ExternalLink,
  ChevronRight, X, Bell,
} from 'lucide-react';
import Link        from 'next/link';
import { useRouter } from 'next/navigation';

type Tender = {
  id: string;
  reference_number: string;
  title: string;
  department?: string;
  province?: string;
  category?: string;
  closing_date: string;
  status: string;
  source: string;
  source_url?: string;
  estimated_value?: number;
  match_count?: number;
};

type Match = {
  id: string;
  tender_id: string;
  client_id: string;
  match_score: number;
  status: string;
  tender?: { reference_number: string; title: string; closing_date: string; province?: string };
  client?: { company_name: string; name: string; package: string };
};

type Stats = {
  activeClients: number;
  openTenders: number;
  newMatches: number;
  applied: number;
  won: number;
};

const STATUS_COLORS: Record<string, string> = {
  new:      'bg-blue-500/20 text-blue-300',
  notified: 'bg-purple-500/20 text-purple-300',
  reviewed: 'bg-yellow-500/20 text-yellow-300',
  applying: 'bg-orange-500/20 text-orange-300',
  applied:  'bg-cyan-500/20 text-cyan-300',
  won:      'bg-green-500/20 text-green-300',
  lost:     'bg-red-500/20 text-red-300',
  declined: 'bg-gray-500/20 text-gray-300',
};

function daysLeft(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}
function fmtDate(iso?: string) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtRand(cents?: number) {
  if (!cents) return '-';
  return `R${(cents / 100).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`;
}

export default function TendersDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab]     = useState<'tenders' | 'matches' | 'add'>('tenders');
  const [tenders, setTenders]         = useState<Tender[]>([]);
  const [matches, setMatches]         = useState<Match[]>([]);
  const [stats, setStats]             = useState<Stats>({ activeClients:0, openTenders:0, newMatches:0, applied:0, won:0 });
  const [filter, setFilter]           = useState('');
  const [statusFilter, setStatus]     = useState('all');
  const [scraping, setScraping]       = useState(false);
  const [scrapeResult, setScrapeResult] = useState<string | null>(null);
  const [sending, setSending]         = useState(false);
  const [sendResult, setSendResult]   = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading]         = useState(true);

  const [form, setForm] = useState({
    reference_number: '', title: '', department: '', province: '',
    category: '', closing_date: '', source_url: '', source: 'manual',
    estimated_value: '', required_cidb_grade: '', description: '',
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        fetch('/api/tenders?limit=100'),
        fetch('/api/tender-clients?active=true'),
      ]);
      if (tRes.ok) {
        const d = await tRes.json();
        setTenders(d.tenders ?? []);
      }
      if (cRes.ok) {
        const d = await cRes.json();
        setStats(s => ({ ...s, activeClients: d.total ?? 0 }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/tenders?status=open&limit=50');
      if (!res.ok) return;
      const { tenders: ts } = await res.json();
      const allMatches: Match[] = [];
      await Promise.all(
        ts.slice(0, 20).map(async (t: Tender) => {
          const r = await fetch(`/api/tenders/${t.id}`);
          if (!r.ok) return;
          const d = await r.json();
          (d.matches ?? []).forEach((m: Match) => allMatches.push(m));
        })
      );
      allMatches.sort((a, b) => b.match_score - a.match_score);
      setMatches(allMatches);
      const newOnes = allMatches.filter(m => m.status === 'new');
      setPendingCount(newOnes.length);
      setStats(s => ({
        ...s,
        openTenders: ts.length,
        newMatches:  newOnes.length,
        applied:     allMatches.filter(m => m.status === 'applied').length,
        won:         allMatches.filter(m => m.status === 'won').length,
      }));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { load(); loadMatches(); }, [load, loadMatches]);

  const runScrape = async () => {
    setScraping(true);
    setScrapeResult(null);
    try {
      const res = await fetch('/api/admin/run-scrape', { method: 'POST' });
      const d   = await res.json().catch(() => ({ error: 'Invalid response' }));
      setScrapeResult(
        res.ok
          ? `✅ Scraped ${d.scraped} tenders · ${d.newTenders} saved · ${d.matches} matched`
          : `❌ ${d.error}`
      );
      await load();
      await loadMatches();
    } catch (err) {
      setScrapeResult(`❌ ${String(err)}`);
    } finally {
      setScraping(false);
    }
  };

  const sendNotifications = async () => {
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch('/api/admin/send-tender-notifications', { method: 'POST' });
      const d   = await res.json().catch(() => ({ error: 'Invalid response' }));
      setSendResult(
        res.ok
          ? `✅ ${d.sent} email${d.sent !== 1 ? 's' : ''} sent${d.skipped ? ` · ${d.skipped} skipped` : ''}`
          : `❌ ${d.error}`
      );
      await loadMatches();
    } catch (err) {
      setSendResult(`❌ ${String(err)}`);
    } finally {
      setSending(false);
    }
  };

  const updateMatchStatus = async (matchId: string, status: string, tenderId?: string, clientId?: string) => {
    await fetch(`/api/tender-matches/${matchId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, tender_id: tenderId, client_id: clientId }),
    });
    await loadMatches();
  };

  const saveTender = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          estimated_value: form.estimated_value
            ? Math.round(parseFloat(form.estimated_value) * 100)
            : undefined,
          commodity_codes: [],
        }),
      });
      if (res.ok) {
        setForm({ reference_number:'', title:'', department:'', province:'',
          category:'', closing_date:'', source_url:'', source:'manual',
          estimated_value:'', required_cidb_grade:'', description:'' });
        setActiveTab('tenders');
        await load();
        await loadMatches();
      }
    } finally {
      setSaving(false);
    }
  };

  const filtered = tenders.filter(t => {
    const q = filter.toLowerCase();
    const matchesSearch = !q || t.title.toLowerCase().includes(q)
      || t.reference_number.toLowerCase().includes(q)
      || (t.department ?? '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMatches = matches
    .filter(m => {
      const q = filter.toLowerCase();
      return !q
        || (m.client?.company_name ?? '').toLowerCase().includes(q)
        || (m.tender?.reference_number ?? '').toLowerCase().includes(q)
        || (m.tender?.title ?? '').toLowerCase().includes(q);
    })
    .filter(m => statusFilter === 'all' || m.status === statusFilter);

  const statCards = [
    { label: 'Active Clients', value: stats.activeClients, icon: Users,        color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Open Tenders',   value: stats.openTenders,   icon: FileText,      color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
    { label: 'New Matches',    value: stats.newMatches,    icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Applied',        value: stats.applied,       icon: Clock,         color: 'text-cyan-400',   bg: 'bg-cyan-500/10'   },
    { label: 'Won',            value: stats.won,           icon: CheckCircle,   color: 'text-green-400',  bg: 'bg-green-500/10'  },
  ];

  return (
    <>
      <Header />
      <PageHero
        title="Tender Management"
        subtitle="Breed Industries"
        description="Track open tenders, matched clients, and application pipeline."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Tenders', href: '/admin/tenders' },
        ]}
        size="default"
        align="left"
      >
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/tender-clients" className="btn btn-outline flex items-center gap-2 text-sm">
            <Users size={15} /> Clients
          </Link>
          <button
            onClick={sendNotifications}
            disabled={sending || pendingCount === 0}
            className="btn btn-outline flex items-center gap-2 text-sm relative disabled:opacity-40"
          >
            <Bell size={15} className={sending ? 'animate-pulse' : ''} />
            {sending ? 'Sending…' : 'Send Notifications'}
            {pendingCount > 0 && !sending && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-black text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={runScrape}
            disabled={scraping}
            className="btn btn-primary flex items-center gap-2 text-sm"
          >
            <RefreshCw size={15} className={scraping ? 'animate-spin' : ''} />
            {scraping ? 'Scraping…' : 'Run Scrape'}
          </button>
        </div>
      </PageHero>

      <section className="py-10 md:py-16 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
            {statCards.map((s, i) => (
              <div key={i} className="glass-card p-4">
                <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-2`}>
                  <s.icon className={s.color} size={18} />
                </div>
                <p className="text-white/60 text-xs mb-0.5">{s.label}</p>
                <p className="text-2xl font-heading font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Result banners */}
          {scrapeResult && (
            <div className={`p-3 rounded-lg mb-4 flex items-start justify-between gap-3 text-sm ${
              scrapeResult.startsWith('✅') ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <p className="text-white/80">{scrapeResult}</p>
              <button onClick={() => setScrapeResult(null)}><X size={14} className="text-white/40" /></button>
            </div>
          )}
          {sendResult && (
            <div className={`p-3 rounded-lg mb-4 flex items-start justify-between gap-3 text-sm ${
              sendResult.startsWith('✅') ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <p className="text-white/80">{sendResult}</p>
              <button onClick={() => setSendResult(null)}><X size={14} className="text-white/40" /></button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white/5 rounded-lg p-1 w-fit overflow-x-auto max-w-full">
            {(['tenders', 'matches', 'add'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize whitespace-nowrap ${
                  activeTab === tab ? 'bg-accent text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                {tab === 'add' ? '+ Add Tender' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search + filter bar */}
          {activeTab !== 'add' && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder={activeTab === 'tenders' ? 'Search tenders…' : 'Search matches…'}
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatus(e.target.value)}
                className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
              >
                <option value="all">All statuses</option>
                {activeTab === 'tenders'
                  ? ['open','closed','awarded','cancelled'].map(s => <option key={s} value={s}>{s}</option>)
                  : ['new','notified','reviewed','applying','applied','won','lost','declined'].map(s => <option key={s} value={s}>{s}</option>)
                }
              </select>
            </div>
          )}

          {/* ── TENDERS TAB ── */}
          {activeTab === 'tenders' && (
            <div className="glass-card overflow-hidden">
              {loading ? (
                <div className="text-center py-16 text-white/40">Loading tenders…</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <FileText size={40} className="mx-auto mb-3 text-white/20" />
                  <p className="text-white/50">No tenders found. Run a scrape or add one manually.</p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                          <th className="px-4 py-3 text-left">Reference</th>
                          <th className="px-4 py-3 text-left">Title / Department</th>
                          <th className="px-4 py-3 text-left">Province</th>
                          <th className="px-4 py-3 text-left">Closes</th>
                          <th className="px-4 py-3 text-right">Value</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((t, i) => {
                          const days = daysLeft(t.closing_date);
                          return (
                            <tr key={t.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}>
                              <td className="px-4 py-3 font-mono text-xs text-accent">{t.reference_number}</td>
                              <td className="px-4 py-3 max-w-xs">
                                <p className="text-white font-medium truncate">{t.title}</p>
                                <p className="text-white/40 text-xs truncate">{t.department}</p>
                              </td>
                              <td className="px-4 py-3 text-white/70">{t.province ?? '-'}</td>
                              <td className="px-4 py-3">
                                <p className={`font-medium text-xs ${days <= 3 ? 'text-red-400' : days <= 7 ? 'text-yellow-400' : 'text-white/70'}`}>
                                  {fmtDate(t.closing_date)}
                                </p>
                                <p className="text-white/40 text-xs">{days > 0 ? `${days}d left` : 'Closed'}</p>
                              </td>
                              <td className="px-4 py-3 text-right text-white/70 text-xs">{fmtRand(t.estimated_value)}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                  t.status === 'open'    ? 'bg-green-500/20 text-green-300' :
                                  t.status === 'closed'  ? 'bg-red-500/20 text-red-300' :
                                  t.status === 'awarded' ? 'bg-blue-500/20 text-blue-300' :
                                  'bg-gray-500/20 text-gray-300'
                                }`}>{t.status}</span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {t.source_url && (
                                    <a href={t.source_url} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-accent">
                                      <ExternalLink size={13} />
                                    </a>
                                  )}
                                  <button onClick={() => router.push(`/admin/tenders/${t.id}`)} className="text-white/30 hover:text-accent">
                                    <ChevronRight size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile card list */}
                  <div className="md:hidden divide-y divide-white/5">
                    {filtered.map(t => {
                      const days = daysLeft(t.closing_date);
                      return (
                        <div
                          key={t.id}
                          className="p-4 hover:bg-white/3 transition-colors cursor-pointer"
                          onClick={() => router.push(`/admin/tenders/${t.id}`)}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0">
                              <p className="font-mono text-xs text-accent mb-0.5">{t.reference_number}</p>
                              <p className="text-white text-sm font-medium leading-snug">{t.title}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize shrink-0 ${
                              t.status === 'open' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                            }`}>{t.status}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-white/50">
                            {t.province && <span>{t.province}</span>}
                            <span className={days <= 3 ? 'text-red-400' : days <= 7 ? 'text-yellow-400' : ''}>
                              {fmtDate(t.closing_date)} · {days > 0 ? `${days}d left` : 'Closed'}
                            </span>
                            {t.estimated_value && <span className="text-white/40">{fmtRand(t.estimated_value)}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── MATCHES TAB ── */}
          {activeTab === 'matches' && (
            <div className="glass-card overflow-hidden">
              {filteredMatches.length === 0 ? (
                <div className="text-center py-16">
                  <TrendingUp size={40} className="mx-auto mb-3 text-white/20" />
                  <p className="text-white/50">No matches yet. Run a scrape to generate matches.</p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                          <th className="px-4 py-3 text-left">Client</th>
                          <th className="px-4 py-3 text-left">Tender</th>
                          <th className="px-4 py-3 text-left">Province</th>
                          <th className="px-4 py-3 text-left">Closes</th>
                          <th className="px-4 py-3 text-center">Score</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMatches.map((m, i) => (
                          <tr key={m.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}>
                            <td className="px-4 py-3">
                              <p className="text-white font-medium text-sm">{m.client?.company_name}</p>
                              <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${
                                m.client?.package === 'full'  ? 'bg-accent/20 text-accent' :
                                m.client?.package === 'apply' ? 'bg-blue-500/20 text-blue-300' :
                                'bg-purple-500/20 text-purple-300'
                              }`}>{m.client?.package}</span>
                            </td>
                            <td className="px-4 py-3 max-w-xs">
                              <p className="text-white/80 font-mono text-xs">{m.tender?.reference_number}</p>
                              <p className="text-white/50 text-xs truncate">{m.tender?.title}</p>
                            </td>
                            <td className="px-4 py-3 text-white/60 text-xs">{m.tender?.province ?? '-'}</td>
                            <td className="px-4 py-3">
                              {m.tender?.closing_date && (() => {
                                const d = daysLeft(m.tender.closing_date);
                                return (
                                  <span className={`text-xs ${d <= 3 ? 'text-red-400' : d <= 7 ? 'text-yellow-400' : 'text-white/60'}`}>
                                    {fmtDate(m.tender.closing_date)}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-block w-10 text-center text-xs font-bold px-1 py-0.5 rounded ${
                                m.match_score >= 70 ? 'bg-green-500/20 text-green-300' :
                                m.match_score >= 40 ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>{m.match_score}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[m.status] ?? 'bg-gray-500/20 text-gray-300'}`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <select
                                defaultValue=""
                                onChange={e => {
                                  if (e.target.value) {
                                    updateMatchStatus(m.id, e.target.value, m.tender_id, m.client_id);
                                    e.target.value = '';
                                  }
                                }}
                                className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-white/70 focus:outline-none focus:border-accent"
                              >
                                <option value="">Update…</option>
                                {['notified','reviewed','applying','applied','won','lost','declined']
                                  .filter(s => s !== m.status)
                                  .map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile card list */}
                  <div className="md:hidden divide-y divide-white/5">
                    {filteredMatches.map(m => (
                      <div key={m.id} className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="text-white font-medium text-sm">{m.client?.company_name}</p>
                            <p className="font-mono text-xs text-accent">{m.tender?.reference_number}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              m.match_score >= 70 ? 'bg-green-500/20 text-green-300' :
                              m.match_score >= 40 ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>{m.match_score}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[m.status] ?? 'bg-gray-500/20 text-gray-300'}`}>
                              {m.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-white/50 text-xs truncate mb-2">{m.tender?.title}</p>
                        <select
                          defaultValue=""
                          onChange={e => {
                            if (e.target.value) {
                              updateMatchStatus(m.id, e.target.value, m.tender_id, m.client_id);
                              e.target.value = '';
                            }
                          }}
                          className="w-full text-xs bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white/70 focus:outline-none focus:border-accent"
                        >
                          <option value="">Update status…</option>
                          {['notified','reviewed','applying','applied','won','lost','declined']
                            .filter(s => s !== m.status)
                            .map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── ADD TENDER TAB ── */}
          {activeTab === 'add' && (
            <div className="glass-card p-6 md:p-8 max-w-2xl">
              <h3 className="text-xl font-heading font-bold text-white mb-6">Add Tender Manually</h3>
              <form onSubmit={saveTender} className="space-y-4">
                {[
                  { name: 'reference_number', label: 'Reference Number *', required: true },
                  { name: 'title', label: 'Title / Description *', required: true },
                  { name: 'department', label: 'Department / Institution' },
                  { name: 'category', label: 'Category' },
                  { name: 'required_cidb_grade', label: 'Required CIDB Grade (e.g. 3GB)' },
                  { name: 'estimated_value', label: 'Estimated Value (R)', type: 'number' },
                  { name: 'source_url', label: 'Source URL', type: 'url' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-white/70 text-sm mb-1">{field.label}</label>
                    <input
                      type={field.type ?? 'text'}
                      required={field.required}
                      value={(form as any)[field.name]}
                      onChange={e => setForm(f => ({ ...f, [field.name]: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Province</label>
                    <select
                      value={form.province}
                      onChange={e => setForm(f => ({ ...f, province: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    >
                      <option value="">Select…</option>
                      {['KZN','GP','WC','EC','LP','MP','NW','FS','NC','NAT'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Closing Date *</label>
                    <input
                      type="datetime-local"
                      required
                      value={form.closing_date}
                      onChange={e => setForm(f => ({ ...f, closing_date: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1">Notes / Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <button type="submit" disabled={saving} className="btn btn-primary w-full">
                  {saving ? 'Saving…' : 'Add Tender & Run Matching'}
                </button>
              </form>
            </div>
          )}

        </div>
      </section>
      <Footer />
    </>
  );
}
