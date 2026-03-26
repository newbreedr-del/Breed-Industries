'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { FileText, Download, Eye, Search, Filter, Calendar } from 'lucide-react';

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  project_name: string;
  contact_person: string;
  items: any[];
  total: number;
  created_at: string;
  updated_at: string;
  status: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/quotes');
      const data = await response.json();
      
      if (data.quotes) {
        setQuotes(data.quotes);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter quotes based on search query
  const filteredQuotes = quotes.filter(quote => 
    quote.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.quote_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      >
        <Link href="/admin/quotes/import" className="btn btn-primary">
          Import Old Quotes
        </Link>
      </PageHero>

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
            ) : filteredQuotes.length === 0 ? (
              <div className="p-12 text-center text-white/60">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">
                  {searchQuery ? 'No quotes found matching your search' : 'No quotes yet'}
                </p>
                <p className="text-sm">
                  {searchQuery ? 'Try adjusting your search terms' : 'Import your old quotes or generate new ones from the website'}
                </p>
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
                        Project
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredQuotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white font-medium">{quote.quote_number}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{quote.customer_name}</div>
                          <div className="text-white/60 text-sm">{quote.customer_email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white">{quote.project_name}</div>
                          <div className="text-white/60 text-sm">{quote.contact_person}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white font-bold">{formatCurrency(quote.total)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white/70">
                          {new Date(quote.created_at).toLocaleDateString('en-ZA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            quote.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                            quote.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {quote.status}
                          </span>
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
