'use client';

import { useState, useEffect, use } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import {
  ArrowLeft, Mail, Phone, MapPin, Award, FileText,
  CheckCircle, Clock, TrendingUp, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

type Client = {
  id: string; name: string; company_name: string;
  email: string; phone?: string; cidb_grade?: string; bee_level?: number;
  csd_number?: string; tax_pin?: string; provinces: string[];
  service_categories: string[]; max_tender_value: number;
  package: string; is_active: boolean; notes?: string;
  package_started_at: string;
};

type Match = {
  id: string; match_score: number; status: string; match_reasons: string[];
  notified_at?: string; applied_at?: string;
  tender?: {
    id: string; reference_number: string; title: string;
    closing_date: string; province?: string; estimated_value?: number;
    source_url?: string; status: string;
  };
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-300', notified: 'bg-purple-500/20 text-purple-300',
  reviewed: 'bg-yellow-500/20 text-yellow-300', applying: 'bg-orange-500/20 text-orange-300',
  applied: 'bg-cyan-500/20 text-cyan-300', won: 'bg-green-500/20 text-green-300',
  lost: 'bg-red-500/20 text-red-300', declined: 'bg-gray-500/20 text-gray-300',
};

const PACKAGE_LABELS: Record<string, { label: string; color: string }> = {
  watch: { label: 'Tender Watch — R950/mo', color: 'text-purple-400' },
  apply: { label: 'Tender Apply — R2,500/mo', color: 'text-blue-400' },
  full:  { label: 'Tender Full — R6,500/mo', color: 'text-accent' },
};

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });
}

function daysLeft(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function TenderClientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [client, setClient]   = useState<Client | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setTab]   = useState<'matches' | 'profile'>('matches');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/tender-clients/${id}`)
      .then(r => r.json())
      .then(d => {
        setClient(d.client);
        setMatches(d.matches ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateMatch = async (matchId: string, status: string) => {
    setUpdating(matchId);
    await fetch(`/api/tender-matches/${matchId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const r = await fetch(`/api/tender-clients/${id}`);
    const d = await r.json();
    setMatches(d.matches ?? []);
    setUpdating(null);
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-color-bg-secondary flex items-center justify-center">
          <p className="text-white/40">Loading…</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!client) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-color-bg-secondary flex items-center justify-center">
          <p className="text-white/40">Client not found.</p>
        </div>
        <Footer />
      </>
    );
  }

  const pkg = PACKAGE_LABELS[client.package];
  const matchStats = {
    total:   matches.length,
    new:     matches.filter(m => m.status === 'new').length,
    applied: matches.filter(m => m.status === 'applied').length,
    won:     matches.filter(m => m.status === 'won').length,
  };

  return (
    <>
      <Header />
      <PageHero
        title={client.company_name}
        subtitle="Tender Client"
        description={`${client.name} · ${client.email}`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Tender Clients', href: '/admin/tender-clients' },
          { label: client.company_name, href: `/admin/tender-clients/${id}` },
        ]}
        size="default"
        align="left"
      >
        <div className="flex gap-3">
          <button
            onClick={toggleActive}
            className={`btn ${client.is_active ? 'btn-outline' : 'btn-primary'} text-sm`}
          >
            {client.is_active ? 'Deactivate' : 'Activate'}
          </button>
          <Link href="/admin/tender-clients" className="btn btn-outline flex items-center gap-2 text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </PageHero>

      <section className="py-16 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Matches', value: matchStats.total,   icon: TrendingUp, color: 'text-blue-400',   bg: 'bg-blue-500/10' },
              { label: 'New',           value: matchStats.new,     icon: Clock,      color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { label: 'Applied',       value: matchStats.applied, icon: FileText,   color: 'text-cyan-400',   bg: 'bg-cyan-500/10' },
              { label: 'Won',           value: matchStats.won,     icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
            ].map((s, i) => (
              <div key={i} className="glass-card p-5">
                <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-3`}>
                  <s.icon className={s.color} size={18} />
                </div>
                <p className="text-white/60 text-xs mb-1">{s.label}</p>
                <p className="text-3xl font-heading font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left: Profile */}
            <div className="col-span-1 space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Package</h3>
                <p className={`text-lg font-heading font-bold ${pkg?.color ?? 'text-white'}`}>
                  {pkg?.label ?? client.package}
                </p>
                <p className="text-white/40 text-xs mt-1">Since {fmtDate(client.package_started_at)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${client.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {client.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="glass-card p-6 space-y-3">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-1">Contact</h3>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Mail size={14} className="text-accent" />
                  <a href={`mailto:${client.email}`} className="hover:text-accent">{client.email}</a>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Phone size={14} className="text-accent" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.provinces.length > 0 && (
                  <div className="flex items-start gap-2 text-white/70 text-sm">
                    <MapPin size={14} className="text-accent mt-0.5" />
                    <span>{client.provinces.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Credentials</h3>
                <div className="space-y-2 text-sm">
                  {client.cidb_grade && (
                    <div className="flex justify-between">
                      <span className="text-white/50">CIDB Grade</span>
                      <span className="text-white font-medium">{client.cidb_grade}</span>
                    </div>
                  )}
                  {client.bee_level && (
                    <div className="flex justify-between">
                      <span className="text-white/50">BEE Level</span>
                      <span className="text-white font-medium">{client.bee_level}</span>
                    </div>
                  )}
                  {client.csd_number && (
                    <div className="flex justify-between">
                      <span className="text-white/50">CSD No</span>
                      <span className="text-white font-mono text-xs">{client.csd_number}</span>
                    </div>
                  )}
                  {client.tax_pin && (
                    <div className="flex justify-between">
                      <span className="text-white/50">Tax Pin</span>
                      <span className="text-white font-mono text-xs">{client.tax_pin}</span>
                    </div>
                  )}
                </div>
              </div>

              {client.service_categories.length > 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {client.service_categories.map(c => (
                      <span key={c} className="px-2 py-1 bg-white/5 rounded text-xs text-white/70">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {client.notes && (
                <div className="glass-card p-6">
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-2">Notes</h3>
                  <p className="text-white/60 text-sm">{client.notes}</p>
                </div>
              )}
            </div>

            {/* Right: Matches */}
            <div className="col-span-2">
              <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <h3 className="text-lg font-heading font-bold text-white">Tender Matches</h3>
                  <p className="text-white/50 text-sm">{matches.length} tenders matched to this client</p>
                </div>

                {matches.length === 0 ? (
                  <div className="text-center py-16">
                    <TrendingUp size={36} className="mx-auto mb-3 text-white/20" />
                    <p className="text-white/40">No matches yet. Run a scrape to find tenders.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {matches.map(m => (
                      <div key={m.id} className="p-5 hover:bg-white/2 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-accent">{m.tender?.reference_number}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[m.status] ?? ''}`}>
                                {m.status}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                m.match_score >= 70 ? 'bg-green-500/20 text-green-300' :
                                m.match_score >= 40 ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>{m.match_score}/100</span>
                            </div>
                            <p className="text-white font-medium truncate">{m.tender?.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                              {m.tender?.province && <span>{m.tender.province}</span>}
                              {m.tender?.closing_date && (
                                <span className={daysLeft(m.tender.closing_date) <= 7 ? 'text-yellow-400' : ''}>
                                  Closes {fmtDate(m.tender.closing_date)}
                                </span>
                              )}
                              {m.tender?.estimated_value && (
                                <span>R{(m.tender.estimated_value / 100).toLocaleString('en-ZA')}</span>
                              )}
                            </div>
                            {m.match_reasons.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {m.match_reasons.map((r, i) => (
                                  <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded text-xs text-white/40">{r}</span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {m.tender?.source_url && (
                              <a href={m.tender.source_url} target="_blank" rel="noopener noreferrer"
                                 className="p-1.5 text-white/30 hover:text-accent transition-colors">
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <select
                              disabled={updating === m.id}
                              defaultValue=""
                              onChange={e => {
                                if (e.target.value) updateMatch(m.id, e.target.value);
                                e.target.value = '';
                              }}
                              className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white/70 focus:outline-none focus:border-accent"
                            >
                              <option value="">Update status…</option>
                              {['notified','reviewed','applying','applied','won','lost','declined']
                                .filter(s => s !== m.status)
                                .map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </>
  );
}
