'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { Users, Mail, Search, FileText, ClipboardList } from 'lucide-react';

type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: 'quote' | 'service-request';
  detail: string;
  date: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'quote' | 'service-request'>('all');

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const all: Contact[] = [];

    try {
      const res = await fetch('/api/quotes');
      if (res.ok) {
        const { quotes } = await res.json();
        quotes?.forEach((q: any) => {
          all.push({ id: `q-${q.id}`, name: q.customer_name, email: q.customer_email, source: 'quote', detail: q.project_name || 'Quote Request', date: q.created_at || '' });
        });
      }
    } catch (_) {}

    try {
      const res = await fetch('/api/service-requests');
      if (res.ok) {
        const { requests } = await res.json();
        requests?.forEach((r: any) => {
          all.push({ id: `sr-${r.id}`, name: r.customerName, email: r.customerEmail, phone: r.customerPhone, company: r.customerCompany, source: 'service-request', detail: r.serviceName || 'Service Request', date: r.createdAt || '' });
        });
      }
    } catch (_) {}

    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setContacts(all);
    setLoading(false);
  };

  const filtered = contacts.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone || '').includes(q);
    return matchSearch && (filter === 'all' || c.source === filter);
  });

  return (
    <>
      <Header />
      <PageHero
        title="Contacts & Leads"
        subtitle="Admin Dashboard"
        description="Customer contacts aggregated from quote requests and service submissions."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Contacts', href: '/admin/contacts' }]}
        size="default"
      />
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Contacts', value: contacts.length, color: 'text-white' },
              { label: 'Quote Leads', value: contacts.filter(c => c.source === 'quote').length, color: 'text-accent' },
              { label: 'Service Requests', value: contacts.filter(c => c.source === 'service-request').length, color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="glass-card p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-white/60 text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email or phone..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent/50" />
              </div>
              <div className="flex gap-2">
                {(['all', 'quote', 'service-request'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-accent text-color-bg-deep' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                    {f === 'all' ? 'All' : f === 'quote' ? 'Quotes' : 'Services'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-white/60">Loading contacts…</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-white/60">
                <Users size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">{contacts.length === 0 ? 'No contacts yet' : 'No matching contacts'}</p>
                <p className="text-sm mt-1">Contacts appear automatically when clients submit quotes or service requests.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      {['Contact', 'Phone', 'Source', 'Request', 'Date', ''].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filtered.map(c => (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{c.name}</p>
                          <p className="text-white/60 text-sm">{c.email}</p>
                          {c.company && <p className="text-white/40 text-xs">{c.company}</p>}
                        </td>
                        <td className="px-6 py-4 text-white/70 text-sm">{c.phone || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.source === 'quote' ? 'bg-accent/20 text-accent' : 'bg-blue-500/20 text-blue-400'}`}>
                            {c.source === 'quote' ? <FileText size={10} /> : <ClipboardList size={10} />}
                            {c.source === 'quote' ? 'Quote' : 'Service'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white/70 text-sm max-w-[200px] truncate">{c.detail}</td>
                        <td className="px-6 py-4 text-white/50 text-sm whitespace-nowrap">
                          {c.date ? new Date(c.date).toLocaleDateString('en-ZA') : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a href={`mailto:${c.email}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs hover:bg-accent/20 transition-colors">
                            <Mail size={12} /> Email
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
