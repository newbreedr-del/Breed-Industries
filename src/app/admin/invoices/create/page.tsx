'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { InvoiceItem } from '@/types/invoice';
import { 
  Plus,
  Trash2,
  ArrowLeft,
  Save
} from 'lucide-react';
import Link from 'next/link';

export default function CreateInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: `item_${Date.now()}`,
      name: '',
      description: '',
      quantity: 1,
      rate: 0,
      pricingType: 'one-time',
      amount: 0
    }
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item_${Date.now()}`,
        name: '',
        description: '',
        quantity: 1,
        rate: 0,
        pricingType: 'one-time',
        amount: 0
      }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate amount
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setItems(newItems);
  };

  const calculateTotals = () => {
    const oneTimeTotal = items.reduce((sum, item) => {
      return item.pricingType === 'one-time' ? sum + item.amount : sum;
    }, 0);

    const monthlyTotal = items.reduce((sum, item) => {
      return item.pricingType === 'monthly' ? sum + item.amount : sum;
    }, 0);

    const deposit = oneTimeTotal * 0.5;
    const balance = oneTimeTotal - deposit;

    return { oneTimeTotal, monthlyTotal, deposit, balance, totalAmount: oneTimeTotal };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerEmail || items.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          quoteNumber,
          dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes,
          items
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Invoice created successfully!');
        router.push(`/admin/invoices/${data.invoice.id}`);
      } else {
        const error = await response.json();
        alert(`Failed to create invoice: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount).replace('ZAR', 'R');
  };

  const totals = calculateTotals();

  return (
    <>
      <Header />
      
      <PageHero
        title="Create Invoice"
        subtitle="Admin Dashboard"
        description="Create a new invoice for a customer"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Invoices', href: '/admin/invoices' },
          { label: 'Create', href: '/admin/invoices/create' }
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
        
        <div className="container mx-auto px-4 relative z-10">
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
            {/* Customer Information */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Customer Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Customer Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    placeholder="+27 12 345 6789"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Quote Number
                  </label>
                  <input
                    type="text"
                    value={quoteNumber}
                    onChange={(e) => setQuoteNumber(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    placeholder="Q-2026-0001"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm mb-2">
                    Customer Address
                  </label>
                  <textarea
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    placeholder="123 Main Street, City, 1234"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Invoice Items</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="btn btn-outline btn-sm"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-4">
                        <label className="block text-white/70 text-sm mb-2">Item Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-white text-sm"
                          placeholder="Service or Product"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/70 text-sm mb-2">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-white text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/70 text-sm mb-2">Rate (R)</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-white text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/70 text-sm mb-2">Type</label>
                        <select
                          value={item.pricingType}
                          onChange={(e) => updateItem(index, 'pricingType', e.target.value as 'one-time' | 'monthly')}
                          className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-white text-sm"
                        >
                          <option value="one-time">One-Time</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div className="md:col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="w-full p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} className="mx-auto" />
                        </button>
                      </div>
                      <div className="md:col-span-12">
                        <label className="block text-white/70 text-sm mb-2">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-white text-sm"
                          placeholder="Brief description of the item"
                        />
                      </div>
                      <div className="md:col-span-12 text-right">
                        <span className="text-white/70 text-sm">Amount: </span>
                        <span className="text-white font-bold">{formatCurrency(item.amount)}</span>
                        {item.pricingType === 'monthly' && <span className="text-accent text-sm">/mo</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Invoice Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-white/70">
                  <span>One-Time Fees:</span>
                  <span className="font-medium">{formatCurrency(totals.oneTimeTotal)}</span>
                </div>
                {totals.monthlyTotal > 0 && (
                  <div className="flex justify-between text-white/70">
                    <span>Monthly Subscription:</span>
                    <span className="font-medium">{formatCurrency(totals.monthlyTotal)}/mo</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-accent font-bold text-lg">
                    <span>50% Deposit Required:</span>
                    <span>{formatCurrency(totals.deposit)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Balance on Completion:</span>
                  <span className="font-medium">{formatCurrency(totals.balance)}</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-white font-bold text-xl">
                    <span>Total Due:</span>
                    <span>{formatCurrency(totals.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  />
                  <p className="text-white/50 text-xs mt-1">Leave empty for 30 days from today</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    placeholder="Additional notes or terms..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link href="/admin/invoices" className="btn btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
