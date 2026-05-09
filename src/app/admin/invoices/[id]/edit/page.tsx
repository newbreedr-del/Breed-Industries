'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { InvoiceItem } from '@/types/invoice';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Receipt } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  oneTimeTotal: number;
  monthlyTotal: number;
  deposit: number;
  balance: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  dueDate: string;
  issueDate: string;
  notes?: string;
}

function EditInvoiceContent() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (!response.ok) throw new Error('Failed to fetch invoice');
      const data = await response.json();
      setInvoice(data.invoice);
    } catch (err) {
      setError('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: invoice.customerName,
          customerEmail: invoice.customerEmail,
          customerPhone: invoice.customerPhone,
          customerAddress: invoice.customerAddress,
          items: invoice.items,
          oneTimeTotal: invoice.oneTimeTotal,
          monthlyTotal: invoice.monthlyTotal,
          deposit: invoice.deposit,
          balance: invoice.balance,
          totalAmount: invoice.totalAmount,
          notes: invoice.notes,
          dueDate: invoice.dueDate,
          status: invoice.status,
          paymentStatus: invoice.paymentStatus
        })
      });

      if (response.ok) {
        alert('Invoice updated successfully!');
        router.push('/admin/invoices');
      } else {
        alert('Failed to update invoice');
      }
    } catch (err) {
      alert('Failed to update invoice');
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    if (!invoice) return;
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}`,
      name: '',
      description: '',
      quantity: 1,
      rate: 0,
      pricingType: 'one-time',
      amount: 0
    };
    setInvoice({ ...invoice, items: [...invoice.items, newItem] });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    if (!invoice) return;
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate amounts
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    // Recalculate totals
    const oneTimeTotal = newItems
      .filter(item => item.pricingType === 'one-time' || !item.pricingType)
      .reduce((sum, item) => sum + item.amount, 0);
    const monthlyTotal = newItems
      .filter(item => item.pricingType === 'monthly')
      .reduce((sum, item) => sum + item.amount, 0);
    const totalAmount = oneTimeTotal;
    const deposit = invoice.deposit > 0 ? oneTimeTotal * 0.5 : 0;
    const balance = oneTimeTotal - deposit;
    
    setInvoice({ 
      ...invoice, 
      items: newItems, 
      oneTimeTotal,
      monthlyTotal,
      totalAmount,
      deposit,
      balance
    });
  };

  const removeItem = (index: number) => {
    if (!invoice) return;
    const newItems = invoice.items.filter((_, i) => i !== index);
    
    // Recalculate totals
    const oneTimeTotal = newItems
      .filter(item => item.pricingType === 'one-time' || !item.pricingType)
      .reduce((sum, item) => sum + item.amount, 0);
    const monthlyTotal = newItems
      .filter(item => item.pricingType === 'monthly')
      .reduce((sum, item) => sum + item.amount, 0);
    const totalAmount = oneTimeTotal;
    const deposit = invoice.deposit > 0 ? oneTimeTotal * 0.5 : 0;
    const balance = oneTimeTotal - deposit;
    
    setInvoice({ 
      ...invoice, 
      items: newItems, 
      oneTimeTotal,
      monthlyTotal,
      totalAmount,
      deposit,
      balance
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
        <div className="text-white/60 flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          Loading invoice...
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
        <div className="text-red-400">{error || 'Invoice not found'}</div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <PageHero
        title={`Edit Invoice ${invoice.invoiceNumber}`}
        subtitle="Admin Dashboard"
        description="Modify invoice details, items, and payment status."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Invoices', href: '/admin/invoices' },
          { label: 'Edit Invoice', href: `/admin/invoices/${invoiceId}/edit` }
        ]}
        size="default"
      >
        <Link href="/admin/invoices" className="btn btn-outline">
          <ArrowLeft size={16} />
          Back to Invoices
        </Link>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <form onSubmit={handleSave} className="glass-card p-8 space-y-6">
            {/* Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Invoice Number</label>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  disabled
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white/50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Quote Reference</label>
                <input
                  type="text"
                  value={invoice.quoteNumber || ''}
                  disabled
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white/50 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Due Date</label>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                />
              </div>
            </div>

            {/* Customer Info */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={invoice.customerName}
                    onChange={(e) => setInvoice({ ...invoice, customerName: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    value={invoice.customerEmail}
                    onChange={(e) => setInvoice({ ...invoice, customerEmail: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    value={invoice.customerPhone || ''}
                    onChange={(e) => setInvoice({ ...invoice, customerPhone: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Status</label>
                  <select
                    value={invoice.status}
                    onChange={(e) => setInvoice({ ...invoice, status: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm mb-2">Address</label>
                  <textarea
                    value={invoice.customerAddress || ''}
                    onChange={(e) => setInvoice({ ...invoice, customerAddress: e.target.value })}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Invoice Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="btn btn-sm btn-outline flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Item
                </button>
              </div>
              
              <div className="space-y-4">
                {invoice.items.map((item, index) => (
                  <div key={item.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-4">
                        <label className="block text-white/60 text-xs mb-1">Service Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          className="w-full rounded bg-white/5 border border-white/10 p-2 text-white text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/60 text-xs mb-1">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full rounded bg-white/5 border border-white/10 p-2 text-white text-sm"
                          min="1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/60 text-xs mb-1">Rate (R)</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseInt(e.target.value) || 0)}
                          className="w-full rounded bg-white/5 border border-white/10 p-2 text-white text-sm"
                          min="0"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/60 text-xs mb-1">Type</label>
                        <select
                          value={item.pricingType || 'one-time'}
                          onChange={(e) => updateItem(index, 'pricingType', e.target.value)}
                          className="w-full rounded bg-white/5 border border-white/10 p-2 text-white text-sm"
                        >
                          <option value="one-time">One-time</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div className="md:col-span-1">
                        <div className="text-right text-white font-medium">
                          R{item.amount.toLocaleString('en-ZA')}
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 size={14} />
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
              
              {/* Totals */}
              <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60">One-time Total:</span>
                  <span className="text-white">R{invoice.oneTimeTotal.toLocaleString('en-ZA')}</span>
                </div>
                {invoice.monthlyTotal > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Monthly Subscription:</span>
                    <span className="text-white">R{invoice.monthlyTotal.toLocaleString('en-ZA')}/mo</span>
                  </div>
                )}
                {invoice.deposit > 0 && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60">50% Deposit:</span>
                      <span className="text-accent">R{invoice.deposit.toLocaleString('en-ZA')}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60">Balance on Completion:</span>
                      <span className="text-white">R{invoice.balance.toLocaleString('en-ZA')}</span>
                    </div>
                  </>
                )}
                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-white">TOTAL DUE:</span>
                  <span className="text-xl font-bold text-accent">R{invoice.totalAmount.toLocaleString('en-ZA')}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t border-white/10 pt-6">
              <label className="block text-white/70 text-sm mb-2">Notes</label>
              <textarea
                value={invoice.notes || ''}
                onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                rows={3}
                placeholder="Any additional notes..."
              />
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
              <Link href="/admin/invoices" className="btn btn-outline">
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

export default function EditInvoicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
        <div className="text-white/60 text-sm flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          Loading...
        </div>
      </div>
    }>
      <EditInvoiceContent />
    </Suspense>
  );
}
