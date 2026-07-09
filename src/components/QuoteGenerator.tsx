'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import {
  PlusCircle, MinusCircle, Loader2, CheckCircle,
  Download, ChevronDown, Search, X, Tag
} from 'lucide-react';
import { serviceDefinitions } from '@/data/serviceDefinitions';
import { getScopeDetail } from '@/data/scopeDetails';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  pricingType?: 'one-time' | 'monthly';
}

interface SelectedItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  rate?: number;
  pricingType?: 'one-time' | 'monthly';
}

interface QuoteGeneratorProps {
  selectedItems?: SelectedItem[];
  onSuccess?: (details: { quoteNumber: string; customerEmail: string }) => void;
}

// ── Extra services not in serviceDefinitions (tender packages) ────────────────

const tenderServices = [
  { id: 'tender-ready',   category: 'Tender Services', name: 'Tender Ready',         basePrice: 'R3,500',  pricingType: 'one-time' as const },
  { id: 'tender-watch',   category: 'Tender Services', name: 'Tender Watch',          basePrice: 'R350',    pricingType: 'monthly'  as const },
  { id: 'tender-apply',   category: 'Tender Services', name: 'Tender Apply',          basePrice: 'R950',    pricingType: 'monthly'  as const },
  { id: 'tender-full',    category: 'Tender Services', name: 'Tender Full Service',   basePrice: 'R2,550',  pricingType: 'monthly'  as const },
];

const platformServices = [
  // ── Setup / build (once-off) ──────────────────────────────────────────
  { id: 'platform-starter',   category: 'AI Platforms & Automation', name: 'AI Platform - Starter',          basePrice: 'R9,500',   pricingType: 'one-time' as const },
  { id: 'platform-pro',       category: 'AI Platforms & Automation', name: 'AI Platform - Pro',              basePrice: 'R18,500',  pricingType: 'one-time' as const },
  { id: 'platform-mobile',    category: 'AI Platforms & Automation', name: 'Mobile App (iOS & Android)',     basePrice: 'R15,000',  pricingType: 'one-time' as const },
  { id: 'platform-app-store', category: 'AI Platforms & Automation', name: 'App Store Submission (Both)',    basePrice: 'R2,500',   pricingType: 'one-time' as const },
  // ── Monthly maintenance ───────────────────────────────────────────────
  { id: 'platform-hosting',   category: 'AI Platforms & Automation', name: 'Platform Hosting',               basePrice: 'R1,500',   pricingType: 'monthly'  as const },
  { id: 'platform-support',   category: 'AI Platforms & Automation', name: 'Platform Support & Updates',     basePrice: 'R2,500',   pricingType: 'monthly'  as const },
  { id: 'platform-managed',   category: 'AI Platforms & Automation', name: 'Platform Fully Managed',         basePrice: 'R4,500',   pricingType: 'monthly'  as const },
];

// ── Service picker ────────────────────────────────────────────────────────────

interface ServicePickerProps {
  onSelect: (name: string, rate: number, description: string, pricingType?: 'one-time' | 'monthly') => void;
}

function ServicePicker({ onSelect }: ServicePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Build combined list: real serviceDefinitions + tender services
  const allServices = useMemo(() => {
    const mapped = serviceDefinitions.map(s => ({
      id: s.id,
      category: s.category,
      name: s.name,
      basePrice: s.basePrice ?? '',
      pricingType: undefined as 'one-time' | 'monthly' | undefined,
    }));
    return [...mapped, ...tenderServices, ...platformServices];
  }, []);

  // Group by category
  const grouped = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = q
      ? allServices.filter(
          s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
        )
      : allServices;

    const map: Record<string, typeof filtered> = {};
    for (const s of filtered) {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    }
    return Object.entries(map);
  }, [allServices, query]);

  const parsePrice = (raw: string): number => {
    const match = raw.match(/[\d,]+/);
    return match ? parseFloat(match[0].replace(',', '')) : 0;
  };

  const handleSelect = (service: typeof allServices[number]) => {
    const scope = getScopeDetail(service.name);
    const description = scope.clientRequirements.length
      ? scope.clientRequirements.join(' · ')
      : '';
    onSelect(service.name, parsePrice(service.basePrice), description, service.pricingType);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2">
          <Tag size={14} className="text-accent" />
          Pick from service catalogue…
        </span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#111] border border-white/15 rounded-xl shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-white/10">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
              <Search size={14} className="text-white/40 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search services…"
                className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')}>
                  <X size={13} className="text-white/40 hover:text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto">
            {grouped.length === 0 ? (
              <p className="text-center text-white/40 text-sm py-6">No services match "{query}"</p>
            ) : (
              grouped.map(([category, services]) => (
                <div key={category}>
                  <div className="px-3 py-1.5 text-xs font-bold text-accent uppercase tracking-wider bg-white/3 border-b border-white/5 sticky top-0 z-10 bg-[#0e0e0f]">
                    {category}
                  </div>
                  {services.map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleSelect(service)}
                      className="w-full text-left flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-sm text-white group-hover:text-accent transition-colors">
                        {service.name}
                      </span>
                      <span className="text-xs text-white/40 group-hover:text-accent/70 transition-colors shrink-0 ml-3">
                        {service.basePrice}
                        {service.pricingType === 'monthly' ? '/mo' : ''}
                      </span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function QuoteGenerator({ selectedItems = [], onSuccess }: QuoteGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteNumber, setQuoteNumber] = useState<string | null>(null);

  // Form state
  const [customerName, setCustomerName]       = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerEmail, setCustomerEmail]     = useState('');
  const [customerPhone, setCustomerPhone]     = useState('');
  const [projectName, setProjectName]         = useState('');
  const [contactPerson, setContactPerson]     = useState('');
  const [paymentTerms, setPaymentTerms]       = useState('50% Upfront');
  const [notes, setNotes]                     = useState('');
  const [requireDeposit, setRequireDeposit]   = useState(true);

  const defaultItem = useMemo<QuoteItem>(
    () => ({ id: '1', name: '', description: '', quantity: 1, rate: 0, pricingType: 'one-time' }),
    []
  );
  const [items, setItems] = useState<QuoteItem[]>([defaultItem]);

  // Pre-fill from selectedItems (coming from /build-package)
  useEffect(() => {
    if (selectedItems.length > 0) {
      setItems(selectedItems.map((item, i) => ({
        id: item.id ?? String(i + 1),
        name: item.name,
        description: item.description ?? '',
        quantity: item.quantity ?? 1,
        rate: item.price ?? 0,
        pricingType: item.pricingType ?? 'one-time',
      })));
    } else {
      setItems([defaultItem]);
    }
  }, [selectedItems, defaultItem]);

  // Item mutations
  const addItem = () =>
    setItems(prev => [...prev, { id: Date.now().toString(), name: '', description: '', quantity: 1, rate: 0, pricingType: 'one-time' }]);

  const removeItem = (id: string) =>
    setItems(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);

  const updateItem = (id: string, field: keyof QuoteItem, value: unknown) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  // Service picker callback - fills row + auto-sets projectName if blank
  const handleServiceSelected = (
    itemId: string,
    name: string,
    rate: number,
    description: string,
    pricingType?: 'one-time' | 'monthly'
  ) => {
    setItems(prev => prev.map(i =>
      i.id === itemId
        ? { ...i, name, rate, description: description || i.description, pricingType: pricingType ?? 'one-time' }
        : i
    ));
    // Auto-fill project name on first service selection
    if (!projectName.trim()) {
      setProjectName(name + ' Package');
    }
    // Auto-fill contact person from customer name if blank
    if (!contactPerson.trim() && customerName.trim()) {
      setContactPerson(customerName.trim());
    }
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  const resetForm = () => {
    setCustomerName(''); setCustomerCompany(''); setCustomerAddress('');
    setCustomerEmail(''); setCustomerPhone('');
    setProjectName(''); setContactPerson('');
    setPaymentTerms('50% Upfront'); setNotes('');
    setItems([defaultItem]);
  };

  const validateForm = (): string | null => {
    if (!customerName.trim())   return 'Customer name is required.';
    if (!customerEmail.trim())  return 'Customer email is required.';
    if (!projectName.trim())    return 'Project name is required.';
    if (!contactPerson.trim())  return 'Contact person is required.';
    const bad = items.filter(i => !i.name.trim() || i.quantity < 1 || i.rate <= 0);
    if (bad.length) return 'Each item needs a name, quantity ≥ 1, and a rate above R0.';
    return null;
  };

  const downloadPDF = (base64: string, qNum: string) => {
    const arr = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([arr], { type: 'application/pdf' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `Breed_Industries_Quote_${qNum}.pdf` });
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm();
    if (err) { setError(err); return; }
    setIsLoading(true); setError(null);

    try {
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerCompany: customerCompany.trim(),
          customerAddress: customerAddress.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          projectName: projectName.trim(),
          contactPerson: contactPerson.trim(),
          paymentTerms, requireDeposit,
          items: items.map(i => ({
            ...i,
            name: i.name.trim(),
            description: i.description.trim(),
            quantity: Number(i.quantity),
            rate: Number(i.rate),
          })),
          notes: notes.trim(),
        }),
      });

      if (!res.ok) throw new Error(await res.text() || 'Failed to generate quote');
      const data = await res.json();
      if (data.pdfBase64) downloadPDF(data.pdfBase64, data.quoteNumber);
      setQuoteNumber(data.quoteNumber);
      setIsSuccess(true);
      onSuccess?.({ quoteNumber: data.quoteNumber, customerEmail: customerEmail.trim() });

      // WhatsApp notification (best-effort)
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote_status_update',
          data: { quoteId: data.quoteNumber, clientName: customerName.trim(), status: 'pending', amount: calculateTotal().toFixed(2), updatedAt: new Date().toLocaleString() },
        }),
      }).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quote');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="glass-card p-8">
      <h2 className="text-2xl font-heading font-bold text-white mb-6">Generate Quote</h2>

      {isSuccess ? (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-white mb-2">Quote Generated!</h3>
          <p className="text-white/70 mb-4">Quote #{quoteNumber} has been sent to {customerEmail}</p>
          <button onClick={() => { setIsSuccess(false); setQuoteNumber(null); resetForm(); }} className="btn btn-primary">
            Generate Another Quote
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Client ─────────────────────────────────────────────────── */}
          <section>
            <h3 className="text-base font-heading font-semibold text-white mb-4 pb-2 border-b border-white/10">
              Client Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 text-xs mb-1">Full Name *</label>
                <input type="text" value={customerName}
                  onChange={e => { setCustomerName(e.target.value); if (!contactPerson.trim()) setContactPerson(e.target.value); }}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm focus:border-accent focus:outline-none" required />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Company</label>
                <input type="text" value={customerCompany} onChange={e => setCustomerCompany(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Email *</label>
                <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm focus:border-accent focus:outline-none" required />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Phone</label>
                <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm focus:border-accent focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/60 text-xs mb-1">Address</label>
                <textarea value={customerAddress} onChange={e => setCustomerAddress(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm focus:border-accent focus:outline-none" rows={2} />
              </div>
            </div>
          </section>

          {/* ── Project ────────────────────────────────────────────────── */}
          <section>
            <h3 className="text-base font-heading font-semibold text-white mb-4 pb-2 border-b border-white/10">
              Project Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 text-xs mb-1">Project Name *</label>
                <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)}
                  placeholder="e.g. CIPC Registration Package"
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm focus:border-accent focus:outline-none" required />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Contact Person *</label>
                <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm focus:border-accent focus:outline-none" required />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">Payment Terms</label>
                <select value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}
                  className="w-full rounded-lg bg-[#1a1a1a] border border-white/10 p-3 text-white text-sm focus:border-accent focus:outline-none">
                  <option value="50% Upfront">50% Upfront</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 border border-white/10 rounded-lg bg-white/5 flex items-start gap-3">
              <input type="checkbox" id="deposit-toggle" checked={requireDeposit}
                onChange={e => setRequireDeposit(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-amber-500" />
              <label htmlFor="deposit-toggle" className="cursor-pointer">
                <span className="text-white text-sm font-medium">Require 50% deposit</span>
                <p className="text-white/50 text-xs mt-0.5">Uncheck if the client has already paid or if full payment is required upfront.</p>
              </label>
            </div>
          </section>

          {/* ── Items ──────────────────────────────────────────────────── */}
          <section>
            <h3 className="text-base font-heading font-semibold text-white mb-4 pb-2 border-b border-white/10">
              Quote Items
            </h3>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="p-4 border border-white/10 rounded-xl bg-white/3">
                  {/* Item header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Item {index + 1}</span>
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(item.id)}
                        className="text-white/30 hover:text-red-400 transition-colors" title="Remove item">
                        <MinusCircle size={16} />
                      </button>
                    )}
                  </div>

                  {/* Service picker */}
                  <div className="mb-3">
                    <label className="block text-white/60 text-xs mb-1">
                      Quick-fill from catalogue <span className="text-white/30">(optional - search to find a service)</span>
                    </label>
                    <ServicePicker
                      onSelect={(name, rate, desc, pt) => handleServiceSelected(item.id, name, rate, desc, pt)}
                    />
                  </div>

                  {/* Name + pricing type */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-3 mb-3">
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Service / Item Name *</label>
                      <input type="text" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)}
                        placeholder="e.g. CIPC Registration"
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-2.5 text-white text-sm focus:border-accent focus:outline-none" required />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Billing</label>
                      <select value={item.pricingType ?? 'one-time'} onChange={e => updateItem(item.id, 'pricingType', e.target.value)}
                        className="w-full rounded-lg bg-[#1a1a1a] border border-white/10 p-2.5 text-white text-sm focus:border-accent focus:outline-none">
                        <option value="one-time">Once-off</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  {/* Qty + Rate */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Qty *</label>
                      <input type="number" min="1" value={item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-2.5 text-white text-sm focus:border-accent focus:outline-none" required />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1">Rate (R) *</label>
                      <input type="number" min="0" step="0.01" value={item.rate}
                        onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-2.5 text-white text-sm focus:border-accent focus:outline-none" required />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-white/60 text-xs mb-1">Description / Scope Notes</label>
                    <textarea value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)}
                      placeholder="What's included, client requirements, revision rounds…"
                      className="w-full rounded-lg bg-white/5 border border-white/10 p-2.5 text-white text-sm focus:border-accent focus:outline-none" rows={2} />
                  </div>

                  {/* Line total */}
                  <div className="mt-2 text-right">
                    <span className="text-xs text-white/40">
                      Line total: <span className="text-accent font-bold">R {(item.quantity * item.rate).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      {item.pricingType === 'monthly' ? ' /month' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addItem}
              className="flex items-center gap-2 text-accent hover:text-accent/80 mt-3 text-sm">
              <PlusCircle size={16} />
              Add another item
            </button>

            {/* Quote total */}
            <div className="mt-4 p-4 border border-accent/30 rounded-xl bg-accent/5">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium text-sm">Quote Total (ex VAT)</span>
                <span className="text-accent font-heading font-bold text-2xl">
                  R {calculateTotal().toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-white/40 mt-1">Breed Industries is not VAT registered. All amounts are VAT exclusive.</p>
            </div>
          </section>

          {/* ── Notes ──────────────────────────────────────────────────── */}
          <section>
            <h3 className="text-base font-heading font-semibold text-white mb-3 pb-2 border-b border-white/10">
              Notes <span className="text-white/30 font-normal text-xs">(optional)</span>
            </h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Additional terms, delivery timeline, or anything else to include on the quote…"
              className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm focus:border-accent focus:outline-none" rows={3} />
          </section>

          {/* Error */}
          {error && (
            <div className="bg-red-500/15 border border-red-500/40 rounded-lg p-4 text-red-300 text-sm flex items-start gap-2">
              <X size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-center pt-2">
            <button type="submit" disabled={isLoading}
              className="btn btn-primary px-10 py-3 flex items-center gap-2 text-base">
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating…</>
              ) : (
                <><Download className="w-5 h-5" /> Generate &amp; Download Quote</>
              )}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
