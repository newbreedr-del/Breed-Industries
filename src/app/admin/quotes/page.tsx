'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { FileText, Download, Eye, EyeOff, Search, Filter, Calendar, Receipt, ArrowRight, PlusCircle, Mail, ChevronDown, CheckCircle, Clock, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_company?: string;
  project_name: string;
  contact_person: string;
  items: any[];
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [converting, setConverting] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

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

  const sendQuoteEmail = async (quote: Quote) => {
    setSending(quote.id);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/admin/send-quote-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ id: quote.id, msg: `Sent to ${quote.customer_email}`, ok: true });
        setQuotes(prev => prev.map(q => q.id === quote.id ? { ...q, status: 'sent' } : q));
      } else {
        setStatusMsg({ id: quote.id, msg: data.error || 'Failed to send', ok: false });
      }
    } catch {
      setStatusMsg({ id: quote.id, msg: 'Network error', ok: false });
    } finally {
      setSending(null);
    }
  };

  const updateStatus = async (quote: Quote, newStatus: string) => {
    try {
      const res = await fetch('/api/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: quote.id, status: newStatus }),
      });
      if (res.ok) {
        setQuotes(prev => prev.map(q => q.id === quote.id ? { ...q, status: newStatus } : q));
      }
    } catch { /* silent */ }
  };

  const convertToInvoice = (quote: Quote) => {
    setConverting(quote.id);
    const params = new URLSearchParams({
      fromQuote: quote.quote_number,
      customerName: quote.customer_name,
      customerEmail: quote.customer_email,
      projectName: quote.project_name,
      contactPerson: quote.contact_person,
      items: JSON.stringify(quote.items),
      total: String(quote.total),
    });
    router.push(`/admin/invoices/create?${params.toString()}`);
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
        <div className="flex gap-3">
          <Link href="/admin/quotes/new" className="btn btn-primary flex items-center gap-2">
            <PlusCircle size={16} />
            New Quote
          </Link>
          <Link href="/admin/quotes/import" className="btn btn-outline">
            Import Old Quotes
          </Link>
        </div>
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
                    {filteredQuotes.map((quote) => {
                      return (
                      <Fragment key={quote.id}>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white font-medium">{quote.quote_number}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{quote.customer_name}</div>
                          <div className="text-white/60 text-sm">{quote.customer_email}</div>
                          {quote.customer_phone && <div className="text-white/40 text-xs">{quote.customer_phone}</div>}
                          {quote.customer_company && <div className="text-white/40 text-xs italic">{quote.customer_company}</div>}
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
                          <select
                            value={quote.status}
                            onChange={(e) => updateStatus(quote, e.target.value)}
                            className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer bg-transparent ${
                              quote.status === 'sent' ? 'text-green-400' :
                              quote.status === 'accepted' ? 'text-blue-400' :
                              quote.status === 'declined' ? 'text-red-400' :
                              'text-yellow-400'
                            }`}
                            style={{ background: 'transparent' }}
                          >
                            <option value="pending" className="bg-[#1a1a1a] text-yellow-400">pending</option>
                            <option value="sent" className="bg-[#1a1a1a] text-green-400">sent</option>
                            <option value="accepted" className="bg-[#1a1a1a] text-blue-400">accepted</option>
                            <option value="declined" className="bg-[#1a1a1a] text-red-400">declined</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => sendQuoteEmail(quote)}
                              disabled={sending === quote.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium transition-colors disabled:opacity-50"
                              title={`Email quote to ${quote.customer_email}`}
                            >
                              <Mail size={14} />
                              {sending === quote.id ? 'Sending…' : 'Email Client'}
                            </button>
                            <button
                              onClick={() => convertToInvoice(quote)}
                              disabled={converting === quote.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent text-xs font-medium transition-colors disabled:opacity-50"
                              title="Convert to Invoice"
                            >
                              <Receipt size={14} />
                              {converting === quote.id ? 'Loading…' : 'Invoice'}
                            </button>
                            <button
                              onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="View Items"
                            >
                              {expandedQuote === quote.id ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {statusMsg?.id === quote.id && (
                            <p className={`text-xs mt-1 ${statusMsg.ok ? 'text-green-400' : 'text-red-400'}`}>{statusMsg.msg}</p>
                          )}
                        </td>
                      </tr>
                      {expandedQuote === quote.id && (
                        <tr className="bg-black/30">
                          <td colSpan={7} className="px-6 py-4">
                            {quote.notes && (
                              <div className="mb-3 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 text-white/70 text-sm">
                                <span className="text-accent text-xs font-medium uppercase tracking-wide">Notes: </span>{quote.notes}
                              </div>
                            )}
                            <div className="rounded-lg overflow-hidden border border-white/10">
                              <table className="w-full text-sm">
                                <thead className="bg-white/5">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-white/60 font-medium">Service</th>
                                    <th className="px-4 py-2 text-center text-white/60 font-medium">Qty</th>
                                    <th className="px-4 py-2 text-right text-white/60 font-medium">Rate</th>
                                    <th className="px-4 py-2 text-right text-white/60 font-medium">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(quote.items || []).map((item: any, i: number) => (
                                    <tr key={i} className="border-t border-white/5">
                                      <td className="px-4 py-2 text-white">{item.name || item.description || '—'}</td>
                                      <td className="px-4 py-2 text-center text-white/70">{item.quantity || 1}</td>
                                      <td className="px-4 py-2 text-right text-white/70">R{(Number(item.rate) || 0).toLocaleString('en-ZA')}</td>
                                      <td className="px-4 py-2 text-right text-accent font-medium">R{((Number(item.quantity) || 1) * (Number(item.rate) || 0)).toLocaleString('en-ZA')}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                      </Fragment>
                      );
                    })}
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
