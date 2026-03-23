'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { FileText, Download, Eye, Search, Filter, Calendar } from 'lucide-react';

interface Quote {
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  items: any[];
  total: number;
  createdAt: string;
  status: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // This will be populated when quotes are stored
    // For now, showing empty state
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('ZAR', 'R');
  };

  return (
    <>
      <Header />
      
      <PageHero
        title="Quotes Management"
        subtitle="Admin Dashboard"
        description="View and manage all customer quotes generated from the website."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Quotes', href: '/admin/quotes' }
        ]}
        size="default"
      />

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Filters */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  <Search size={14} className="inline mr-1" />
                  Search by Customer
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Customer name or email"
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
                  <Calendar size={14} className="inline mr-1" />
                  Date Range
                </label>
                <select className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Quotes Table */}
          <div className="glass-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-white/60">
                Loading quotes...
              </div>
            ) : quotes.length === 0 ? (
              <div className="p-12 text-center text-white/60">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No quotes yet</p>
                <p className="text-sm">Quotes generated from the Lab page will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                        Quote #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {quotes.map((quote) => (
                      <tr key={quote.quoteNumber} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white font-medium">{quote.quoteNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{quote.customerName}</div>
                          <div className="text-white/60 text-sm">{quote.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white font-bold">{formatCurrency(quote.total)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white/70">
                          {new Date(quote.createdAt).toLocaleDateString('en-ZA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                              <Download size={16} />
                            </button>
                          </div>
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
