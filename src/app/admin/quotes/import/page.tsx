'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { Upload, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ImportQuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState([
    {
      quote_number: 'Q-2026-9926',
      customer_name: 'Lino',
      customer_email: '',
      project_name: '',
      contact_person: 'Lino',
      total: 0,
      items: [{ name: '', description: '', quantity: 1, rate: 0 }]
    },
    {
      quote_number: 'Q-2026-5447',
      customer_name: 'Mzokuthula Chiliza',
      customer_email: '',
      project_name: 'Business Registration',
      contact_person: 'Mzokuthula Chiliza',
      total: 0,
      items: [{ name: 'Business Registration', description: '', quantity: 1, rate: 0 }]
    },
    {
      quote_number: 'Q-2026-3433',
      customer_name: 'Nolwazi Herbal',
      customer_email: '',
      project_name: '',
      contact_person: 'Nolwazi',
      total: 0,
      items: [{ name: '', description: '', quantity: 1, rate: 0 }]
    },
    {
      quote_number: 'Q-2026-3225',
      customer_name: 'Zama Shengu',
      customer_email: '',
      project_name: '',
      contact_person: 'Zama Shengu',
      total: 0,
      items: [{ name: '', description: '', quantity: 1, rate: 0 }]
    }
  ]);
  const [importing, setImporting] = useState(false);

  const updateQuote = (index: number, field: string, value: any) => {
    const newQuotes = [...quotes];
    newQuotes[index] = { ...newQuotes[index], [field]: value };
    setQuotes(newQuotes);
  };

  const updateItem = (quoteIndex: number, itemIndex: number, field: string, value: any) => {
    const newQuotes = [...quotes];
    const newItems = [...newQuotes[quoteIndex].items];
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
    
    // Recalculate total
    const total = newItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    newQuotes[quoteIndex] = { ...newQuotes[quoteIndex], items: newItems, total };
    
    setQuotes(newQuotes);
  };

  const addItem = (quoteIndex: number) => {
    const newQuotes = [...quotes];
    newQuotes[quoteIndex].items.push({ name: '', description: '', quantity: 1, rate: 0 });
    setQuotes(newQuotes);
  };

  const removeItem = (quoteIndex: number, itemIndex: number) => {
    const newQuotes = [...quotes];
    newQuotes[quoteIndex].items = newQuotes[quoteIndex].items.filter((_, i) => i !== itemIndex);
    
    // Recalculate total
    const total = newQuotes[quoteIndex].items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    newQuotes[quoteIndex].total = total;
    
    setQuotes(newQuotes);
  };

  const handleImport = async () => {
    if (!confirm('Import all quotes? Make sure all information is correct.')) return;

    setImporting(true);

    try {
      for (const quote of quotes) {
        // Validate required fields
        if (!quote.customer_email || !quote.project_name || quote.total === 0) {
          alert(`Please fill in all fields for ${quote.customer_name}`);
          setImporting(false);
          return;
        }

        // Format items for database
        const formattedItems = quote.items.map((item, idx) => ({
          id: `item_${idx + 1}`,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.quantity * item.rate,
          pricingType: 'one-time'
        }));

        const quoteData = {
          id: `quote_${quote.quote_number.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`,
          quote_number: quote.quote_number,
          customer_name: quote.customer_name,
          customer_email: quote.customer_email,
          project_name: quote.project_name,
          contact_person: quote.contact_person,
          items: formattedItems,
          total: quote.total,
          status: 'sent',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Import to Supabase
        const response = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quoteData)
        });

        if (!response.ok) {
          throw new Error(`Failed to import ${quote.quote_number}`);
        }
      }

      alert('All quotes imported successfully!');
      router.push('/admin/quotes');
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import quotes. Check console for details.');
    } finally {
      setImporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount).replace('ZAR', 'R');
  };

  return (
    <>
      <Header />
      
      <PageHero
        title="Import Old Quotes"
        subtitle="Admin Dashboard"
        description="Import your existing quotes from PDFs into the system"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Quotes', href: '/admin/quotes' },
          { label: 'Import', href: '/admin/quotes/import' }
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
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="glass-card p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">📋 Instructions</h2>
              <ul className="text-white/70 space-y-2">
                <li>• Fill in the missing information from your PDF quotes</li>
                <li>• Make sure customer emails are correct</li>
                <li>• Add all items with their prices</li>
                <li>• Totals will calculate automatically</li>
                <li>• Click "Import All Quotes" when ready</li>
              </ul>
            </div>

            <div className="space-y-8">
              {quotes.map((quote, quoteIndex) => (
                <div key={quoteIndex} className="glass-card p-6">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {quote.quote_number} - {quote.customer_name}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Customer Email *</label>
                      <input
                        type="email"
                        value={quote.customer_email}
                        onChange={(e) => updateQuote(quoteIndex, 'customer_email', e.target.value)}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                        placeholder="customer@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Project Name *</label>
                      <input
                        type="text"
                        value={quote.project_name}
                        onChange={(e) => updateQuote(quoteIndex, 'project_name', e.target.value)}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                        placeholder="Project description"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-white">Items</h4>
                      <button
                        onClick={() => addItem(quoteIndex)}
                        className="btn btn-outline btn-sm"
                      >
                        <Plus size={14} />
                        Add Item
                      </button>
                    </div>

                    {quote.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white/5 rounded-lg p-4 mb-3 border border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                          <div className="md:col-span-4">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(quoteIndex, itemIndex, 'name', e.target.value)}
                              className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-white text-sm"
                              placeholder="Item name"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(quoteIndex, itemIndex, 'description', e.target.value)}
                              className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-white text-sm"
                              placeholder="Description"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(quoteIndex, itemIndex, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-white text-sm"
                              placeholder="Qty"
                              min="0"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItem(quoteIndex, itemIndex, 'rate', parseFloat(e.target.value) || 0)}
                              className="w-full rounded-lg bg-white/5 border border-white/10 p-2 text-white text-sm"
                              placeholder="Rate (R)"
                              min="0"
                            />
                          </div>
                          <div className="md:col-span-1 flex items-center justify-center">
                            {quote.items.length > 1 && (
                              <button
                                onClick={() => removeItem(quoteIndex, itemIndex)}
                                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-right">
                    <div className="text-white/70 text-sm">Total:</div>
                    <div className="text-accent font-bold text-2xl">
                      {formatCurrency(quote.total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Link href="/admin/quotes" className="btn btn-outline">
                Cancel
              </Link>
              <button
                onClick={handleImport}
                disabled={importing}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={16} />
                {importing ? 'Importing...' : 'Import All Quotes'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
