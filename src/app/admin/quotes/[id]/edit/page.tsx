'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  pricingType?: 'one-time' | 'monthly';
}

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  customer_address?: string;
  project_name: string;
  contact_person: string;
  items: QuoteItem[];
  total: number;
  notes?: string;
  status: string;
  require_deposit?: boolean;
}

function EditQuoteContent() {
  const router = useRouter();
  const params = useParams();
  const quoteId = params.id as string;
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuote();
  }, [quoteId]);

  const fetchQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}`);
      if (!response.ok) throw new Error('Failed to fetch quote');
      const data = await response.json();
      setQuote(data.quote);
    } catch (err) {
      setError('Failed to load quote');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: quoteId,
          customer_name: quote.customer_name,
          customer_email: quote.customer_email,
          customer_phone: quote.customer_phone,
          customer_company: quote.customer_company,
          customer_address: quote.customer_address,
          project_name: quote.project_name,
          contact_person: quote.contact_person,
          items: quote.items,
          total: quote.total,
          notes: quote.notes,
          require_deposit: quote.require_deposit
        })
      });

      if (response.ok) {
        alert('Quote updated successfully!');
        router.push('/admin/quotes');
      } else {
        alert('Failed to update quote');
      }
    } catch (err) {
      alert('Failed to update quote');
    } finally {
      setSaving(false);
    }
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    if (!quote) return;
    const newItems = [...quote.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total
    const newTotal = newItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    
    setQuote({ ...quote, items: newItems, total: newTotal });
  };

  const removeItem = (index: number) => {
    if (!quote) return;
    const newItems = quote.items.filter((_, i) => i !== index);
    const newTotal = newItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    setQuote({ ...quote, items: newItems, total: newTotal });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
        <div className="text-white/60 flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          Loading quote...
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
        <div className="text-red-400">{error || 'Quote not found'}</div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <PageHero
        title={`Edit Quote ${quote.quote_number}`}
        subtitle="Admin Dashboard"
        description="Modify quote details, items, and payment terms."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Quotes', href: '/admin/quotes' },
          { label: 'Edit Quote', href: `/admin/quotes/${quoteId}/edit` }
        ]}
        size="default"
      >
        <Link href="/admin/quotes" className="btn btn-outline">
          <ArrowLeft size={16} />
          Back to Quotes
        </Link>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <form onSubmit={handleSave} className="glass-card p-8 space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Customer Name *</label>
                <input
                  type="text"
                  value={quote.customer_name}
                  onChange={(e) => setQuote({ ...quote, customer_name: e.target.value })}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Email *</label>
                <input
                  type="email"
                  value={quote.customer_email}
                  onChange={(e) => setQuote({ ...quote, customer_email: e.target.value })}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Phone</label>
                <input
                  type="tel"
                  value={quote.customer_phone || ''}
                  onChange={(e) => setQuote({ ...quote, customer_phone: e.target.value })}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Company</label>
                <input
                  type="text"
                  value={quote.customer_company || ''}
                  onChange={(e) => setQuote({ ...quote, customer_company: e.target.value })}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">Address</label>
                <textarea
                  value={quote.customer_address || ''}
                  onChange={(e) => setQuote({ ...quote, customer_address: e.target.value })}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  rows={2}
                />
              </div>
            </div>

            {/* Project Info */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Project Name *</label>
                  <input
                    type="text"
                    value={quote.project_name}
                    onChange={(e) => setQuote({ ...quote, project_name: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Contact Person</label>
                  <input
                    type="text"
                    value={quote.contact_person}
                    onChange={(e) => setQuote({ ...quote, contact_person: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Quote Items</h3>
              <div className="space-y-4">
                {quote.items.map((item, index) => (
                  <div key={item.id || index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-5">
                        <label className="block text-white/60 text-xs mb-1">Service Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          className="w-full rounded bg-white/5 border border-white/10 p-2 text-white text-sm"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-white/60 text-xs mb-1">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full rounded bg-white/5 border border-white/10 p-2 text-white text-sm"
                          min="1"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-white/60 text-xs mb-1">Rate (R)</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseInt(e.target.value) || 0)}
                          className="w-full rounded bg-white/5 border border-white/10 p-2 text-white text-sm"
                          min="0"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-white/60 text-xs mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full rounded bg-white/5 border border-white/10 p-2 text-white text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-xl font-bold text-white">
                  Total: R{quote.total.toLocaleString('en-ZA')}
                </div>
              </div>
            </div>

            {/* Notes & Deposit */}
            <div className="border-t border-white/10 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Notes</label>
                  <textarea
                    value={quote.notes || ''}
                    onChange={(e) => setQuote({ ...quote, notes: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    rows={3}
                    placeholder="Any additional notes..."
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                    <input
                      type="checkbox"
                      checked={quote.require_deposit || false}
                      onChange={(e) => setQuote({ ...quote, require_deposit: e.target.checked })}
                      className="rounded border-white/20 bg-white/5"
                    />
                    Require 50% deposit
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/10 pt-6 flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex items-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link href="/admin/quotes" className="btn btn-outline">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function EditQuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
        <div className="text-white/60 text-sm flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          Loading...
        </div>
      </div>
    }>
      <EditQuoteContent />
    </Suspense>
  );
}
