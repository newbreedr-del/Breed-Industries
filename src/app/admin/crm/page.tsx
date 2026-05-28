'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, TrendingUp, UserPlus, Clock, Plus, Building2, Mail, Phone, ChevronRight, Calendar } from 'lucide-react';

interface CrmClient {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  status: string;
  mrr: number;
  service_count: number;
  created_at: string;
}

interface CrmLead {
  id: string;
  full_name: string;
  company_name: string;
  status: string;
  source_event: string;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  Active:    'text-green-400 bg-green-400/10',
  'On Hold': 'text-yellow-400 bg-yellow-400/10',
  Churned:   'text-red-400 bg-red-400/10',
  Prospect:  'text-blue-400 bg-blue-400/10',
};

const LEAD_STATUS_STYLES: Record<string, string> = {
  'New Lead':        'text-blue-400 bg-blue-400/10',
  Contacted:         'text-yellow-400 bg-yellow-400/10',
  'Proposal Sent':   'text-purple-400 bg-purple-400/10',
  Converted:         'text-green-400 bg-green-400/10',
  'Not Interested':  'text-red-400 bg-red-400/10',
};

export default function CrmDashboard() {
  const [clients, setClients] = useState<CrmClient[]>([]);
  const [leads, setLeads]     = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/crm/clients', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/crm/leads',   { credentials: 'include' }).then(r => r.json()),
    ]).then(([clientsData, leadsData]) => {
      setClients(clientsData.clients || []);
      setLeads(leadsData.leads   || []);
    }).finally(() => setLoading(false));
  }, []);

  const activeClients   = clients.filter(c => c.status === 'Active').length;
  const totalMrr        = clients.reduce((s, c) => s + (c.mrr || 0), 0);
  const thisMonth       = new Date(); thisMonth.setDate(1);
  const leadsThisMonth  = leads.filter(l => new Date(l.created_at) >= thisMonth).length;
  const pendingFollowUp = leads.filter(l => ['New Lead', 'Contacted'].includes(l.status)).length;

  const formatZar = (n: number) => `R${n.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

  const stats = [
    { label: 'Active Clients',     value: activeClients,        icon: Users,      color: 'text-green-400',  bg: 'bg-green-400/10' },
    { label: 'Total MRR',          value: formatZar(totalMrr),  icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Leads This Month',   value: leadsThisMonth,       icon: UserPlus,   color: 'text-blue-400',   bg: 'bg-blue-400/10' },
    { label: 'Pending Follow-ups', value: pendingFollowUp,      icon: Clock,      color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-deep, #0B1118)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">CRM Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Clients, leads, and relationships</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/crm/leads" className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-sm transition-colors">
              Leads Pipeline
            </Link>
            <Link href="/admin/crm/new" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-black transition-colors" style={{ background: '#FF9F00' }}>
              <Plus size={15} /> Add Client
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="glass-card rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${s.bg}`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
                <span className="text-slate-400 text-xs">{s.label}</span>
              </div>
              <div className={`text-2xl font-bold ${s.color}`}>{loading ? '—' : s.value}</div>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Clients table (60%) */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-4 border-b border-white/8 flex items-center justify-between">
              <h2 className="text-white font-semibold">Clients</h2>
              <span className="text-slate-400 text-sm">{clients.length} total</span>
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading…</div>
            ) : clients.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No clients yet. <Link href="/admin/crm/new" className="text-orange-400 hover:underline">Add one</Link>.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left text-slate-400 font-medium px-4 py-3">Company</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 hidden md:table-cell">Contact</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3">Services</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3 hidden md:table-cell">MRR</th>
                      <th className="text-left text-slate-400 font-medium px-4 py-3">Status</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(c => (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{c.company_name}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300 hidden md:table-cell">{c.contact_name || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-white/8 text-slate-300">{c.service_count}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-300 hidden md:table-cell">
                          {c.mrr > 0 ? <span className="text-green-400">{formatZar(c.mrr)}</span> : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[c.status] || 'text-slate-400 bg-white/8'}`}>{c.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/crm/${c.id}`} className="text-orange-400 hover:text-orange-300 transition-colors">
                            <ChevronRight size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent leads (40%) */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-4 border-b border-white/8 flex items-center justify-between">
              <h2 className="text-white font-semibold">Recent Leads</h2>
              <Link href="/admin/crm/leads" className="text-orange-400 text-sm hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading…</div>
            ) : leads.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No leads yet.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {leads.slice(0, 10).map(l => (
                  <div key={l.id} className="px-4 py-3 hover:bg-white/3 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium text-white text-sm truncate">{l.full_name}</div>
                        <div className="text-slate-400 text-xs truncate">{l.company_name || l.source_event || '—'}</div>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${LEAD_STATUS_STYLES[l.status] || 'text-slate-400 bg-white/8'}`}>{l.status}</span>
                    </div>
                    <div className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(l.created_at).toLocaleDateString('en-ZA')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link href="/admin" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">← Back to Admin Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
