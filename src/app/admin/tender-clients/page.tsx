'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { Plus, Search, Users, ChevronRight, CheckCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Client = {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  company_name: string;
  email: string;
  phone?: string;
  cidb_grade?: string;
  bee_level?: number;
  provinces: string[];
  service_categories: string[];
  package: string;
  is_active: boolean;
  created_at: string;
};

const PROVINCES = ['KZN','GP','WC','EC','LP','MP','NW','FS','NC','NAT'];
const CATEGORIES = [
  // Construction & Infrastructure (CIDB disciplines)
  'General Building',
  'Civil Engineering',
  'Electrical Infrastructure',
  'Electrical Building',
  'Mechanical Engineering',
  'Wet Services – Building',
  'Wet Services – Infrastructure',
  'Roads & Earthworks',
  'Structural Steel',
  'Demolition & Excavation',
  'Piling & Ground Engineering',
  'Landscaping & Horticulture',
  'HVAC & Air Conditioning',
  'Fire Protection & Detection',
  'Painting & Waterproofing',
  'Glazing & Aluminium Works',
  'Flooring & Tiling',
  'Roofing',
  // ICT & Technology
  'ICT Hardware & Equipment',
  'ICT Software & Licensing',
  'ICT Support & Maintenance',
  'Networking & Telecommunications',
  'Cybersecurity',
  'Cloud & Data Services',
  'Audio Visual & Multimedia',
  'CCTV & Access Control',
  // Professional & Consulting Services
  'Engineering Consulting',
  'Architecture & Town Planning',
  'Project Management',
  'Legal Services',
  'Audit & Accounting',
  'Financial Advisory',
  'HR & Recruitment',
  'Training & Skills Development',
  'Research & Development',
  'Environmental Assessment',
  'Surveying & Geospatial',
  // Health & Social Services
  'Medical Supplies & Equipment',
  'Pharmaceutical',
  'Healthcare Services',
  'Social Development Services',
  'Early Childhood Development',
  // Facilities & Support Services
  'Security Services',
  'Cleaning & Hygiene',
  'Catering & Food Services',
  'Laundry & Linen Services',
  'Pest Control',
  'Waste Management',
  'Property & Facilities Management',
  // Office & Administrative
  'Office Supplies & Furniture',
  'Printing & Stationery',
  'Document Management',
  'Records & Archiving',
  'Postal & Courier Services',
  // Transport & Logistics
  'Transport & Logistics',
  'Vehicle & Fleet Management',
  'Passenger Transport',
  'Aviation Services',
  // Marketing & Media
  'Advertising & Marketing',
  'Events Management',
  'Branding & Design',
  'Photography & Videography',
  'Media Production',
  'Signage & Banners',
  // Energy & Environment
  'Energy & Renewables',
  'Water & Sanitation',
  'Environmental Services',
  'Waste-to-Energy',
  // Specialised Industries
  'Agriculture & Food Production',
  'Veterinary & Animal Health',
  'Mining & Extraction',
  'Industrial Equipment',
  'Manufacturing & Assembly',
  'Laboratory & Scientific',
  'Clothing, Uniforms & PPE',
  'Books & Educational Materials',
  'Sports & Recreation Equipment',
  'Arts, Culture & Heritage',
  'Tourism & Hospitality',
];
const PACKAGES = [
  { value: 'ready', label: 'Tender Ready',  price: 'R3,500 once-off',         color: 'bg-white/10 text-white/70'      },
  { value: 'watch', label: 'Tender Watch',  price: 'R350/mo',                 color: 'bg-purple-500/20 text-purple-300' },
  { value: 'apply', label: 'Tender Apply',  price: 'R950/mo + from R1,200/doc', color: 'bg-blue-500/20 text-blue-300'   },
  { value: 'full',  label: 'Full Service',  price: 'R2,550/mo + from R3k/tend', color: 'bg-accent/20 text-accent'        },
];

const emptyForm = {
  first_name: '', last_name: '', name: '',
  company_name: '', email: '', phone: '',
  cidb_grade: '', bee_level: '', csd_number: '', tax_pin: '',
  provinces: [] as string[], service_categories: [] as string[],
  commodity_codes: '', max_tender_value: '', package: 'watch', notes: '',
};

export default function TenderClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [filter, setFilter]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ ...emptyForm });
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tender-clients?active=false');
      if (res.ok) {
        const d = await res.json();
        setClients(d.clients ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleArr = (field: 'provinces' | 'service_categories', val: string) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val)
        ? f[field].filter(v => v !== val)
        : [...f[field], val],
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const displayName = `${form.first_name} ${form.last_name}`.trim() || form.name;
      const res = await fetch('/api/tender-clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          name:             displayName,
          bee_level:        form.bee_level    ? Number(form.bee_level)    : undefined,
          max_tender_value: form.max_tender_value ? Math.round(parseFloat(form.max_tender_value) * 100) : 0,
          commodity_codes:  form.commodity_codes.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        setSaved(true);
        setForm({ ...emptyForm });
        setShowForm(false);
        await load();
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const filtered = clients.filter(c => {
    const q = filter.toLowerCase();
    return !q
      || c.company_name.toLowerCase().includes(q)
      || c.name.toLowerCase().includes(q)
      || c.email.toLowerCase().includes(q);
  });

  const pkg = (p: string) => PACKAGES.find(x => x.value === p);

  return (
    <>
      <Header />
      <PageHero
        title="Tender Clients"
        subtitle="Breed Industries"
        description="Manage clients enrolled in tender watch, apply, or full service packages."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Tenders', href: '/admin/tenders' },
          { label: 'Clients', href: '/admin/tender-clients' },
        ]}
        size="default"
        align="left"
      >
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add Client
        </button>
      </PageHero>

      <section className="py-16 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">

          {saved && (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-6">
              <CheckCircle size={16} className="text-green-400" />
              <p className="text-green-300 text-sm">Client added successfully.</p>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search clients…"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {/* Package summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {PACKAGES.map(p => {
              const count = clients.filter(c => c.package === p.value && c.is_active).length;
              return (
                <div key={p.value} className="glass-card p-5">
                  <p className="text-white/60 text-xs mb-1">{p.label}</p>
                  <p className="text-3xl font-heading font-bold text-white">{count}</p>
                  <p className="text-accent text-xs mt-1">{p.price}</p>
                </div>
              );
            })}
          </div>

          {/* Client table */}
          <div className="glass-card overflow-hidden">
            {loading ? (
              <div className="text-center py-16 text-white/40">Loading clients…</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users size={40} className="mx-auto mb-3 text-white/20" />
                <p className="text-white/50">No clients yet. Add your first tender client.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 text-left">Company</th>
                        <th className="px-4 py-3 text-left">Contact</th>
                        <th className="px-4 py-3 text-left">Phone</th>
                        <th className="px-4 py-3 text-left">Package</th>
                        <th className="px-4 py-3 text-left">CIDB / BEE</th>
                        <th className="px-4 py-3 text-left">Provinces</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c, i) => {
                        const p = pkg(c.package);
                        const displayName = c.first_name
                          ? `${c.first_name} ${c.last_name ?? ''}`.trim()
                          : c.name;
                        return (
                          <tr
                            key={c.id}
                            className={`border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}
                            onClick={() => router.push(`/admin/tender-clients/${c.id}`)}
                          >
                            <td className="px-4 py-3">
                              <p className="text-white font-medium">{c.company_name}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-white/80 text-sm">{displayName}</p>
                              <p className="text-white/40 text-xs">{c.email}</p>
                            </td>
                            <td className="px-4 py-3 text-white/60 text-sm">{c.phone ?? '-'}</td>
                            <td className="px-4 py-3">
                              {p && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.color}`}>
                                  {p.label}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-white/60 text-sm">
                              {c.cidb_grade && <span className="mr-2">{c.cidb_grade}</span>}
                              {c.bee_level  && <span>BEE {c.bee_level}</span>}
                              {!c.cidb_grade && !c.bee_level && '-'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {c.provinces.slice(0, 3).map(pv => (
                                  <span key={pv} className="px-1.5 py-0.5 bg-white/5 rounded text-xs text-white/60">{pv}</span>
                                ))}
                                {c.provinces.length > 3 && (
                                  <span className="text-xs text-white/40">+{c.provinces.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${c.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {c.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <ChevronRight size={15} className="text-white/30 ml-auto" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card list */}
                <div className="md:hidden divide-y divide-white/5">
                  {filtered.map(c => {
                    const p = pkg(c.package);
                    const displayName = c.first_name
                      ? `${c.first_name} ${c.last_name ?? ''}`.trim()
                      : c.name;
                    return (
                      <div
                        key={c.id}
                        className="p-4 hover:bg-white/3 transition-colors cursor-pointer"
                        onClick={() => router.push(`/admin/tender-clients/${c.id}`)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-white font-medium">{c.company_name}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${c.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {c.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">{displayName}</p>
                        {c.phone && <p className="text-white/40 text-xs mt-0.5">{c.phone}</p>}
                        <p className="text-white/40 text-xs">{c.email}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {p && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.color}`}>{p.label}</span>
                          )}
                          {c.cidb_grade && (
                            <span className="px-1.5 py-0.5 bg-white/5 rounded text-xs text-white/50">{c.cidb_grade}</span>
                          )}
                          {c.provinces.slice(0, 3).map(pv => (
                            <span key={pv} className="px-1.5 py-0.5 bg-white/5 rounded text-xs text-white/50">{pv}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Add Client Modal ───────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-heading font-bold text-white">Add Tender Client</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-white/50 hover:text-white" /></button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-5">
              {/* Contact info */}
              <div>
                <label className="block text-white/60 text-xs mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={form.company_name}
                  onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    placeholder="+27 60 000 0000"
                  />
                </div>
              </div>

              {/* Package */}
              <div>
                <label className="block text-white/60 text-xs mb-2">Package *</label>
                <div className="grid grid-cols-3 gap-3">
                  {PACKAGES.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, package: p.value }))}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        form.package === p.value
                          ? 'border-accent bg-accent/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <p className="text-white text-sm font-medium">{p.label}</p>
                      <p className="text-accent text-xs">{p.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Provinces */}
              <div>
                <label className="block text-white/60 text-xs mb-2">Provinces</label>
                <div className="flex flex-wrap gap-2">
                  {PROVINCES.map(prov => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => toggleArr('provinces', prov)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        form.provinces.includes(prov)
                          ? 'bg-accent text-black'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service categories */}
              <div>
                <label className="block text-white/60 text-xs mb-2">Service Categories</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleArr('service_categories', cat)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        form.service_categories.includes(cat)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* CIDB / BEE / Value */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'cidb_grade',        label: 'CIDB Grade (e.g. 2GB)' },
                  { name: 'bee_level',          label: 'BEE Level (1–8)', type: 'number' },
                  { name: 'max_tender_value',   label: 'Max Tender Value (R)', type: 'number' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-white/60 text-xs mb-1">{f.label}</label>
                    <input
                      type={f.type ?? 'text'}
                      value={(form as any)[f.name]}
                      onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                ))}
              </div>

              {/* CSD / Tax */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'csd_number', label: 'CSD Number' },
                  { name: 'tax_pin',    label: 'Tax Pin / Reference' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-white/60 text-xs mb-1">{f.label}</label>
                    <input
                      type="text"
                      value={(form as any)[f.name]}
                      onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-white/60 text-xs mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                  {saving ? 'Saving…' : 'Add Client'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
