'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { Invoice } from '@/types/invoice';
import { 
  FileText, 
  Send, 
  Download, 
  Eye, 
  Trash2, 
  Filter,
  Search,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, paymentFilter, searchQuery, page]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });

      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (paymentFilter !== 'all') params.append('paymentStatus', paymentFilter);
      if (searchQuery) params.append('customerEmail', searchQuery);

      const response = await fetch(`/api/invoices?${params}`);
      const data = await response.json();

      setInvoices(data.invoices || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    if (!confirm('Send this invoice to the customer?')) return;

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('Invoice sent successfully!');
        fetchInvoices();
      } else {
        alert('Failed to send invoice');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice');
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Invoice deleted successfully!');
        fetchInvoices();
      } else {
        alert('Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    }
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const styles = {
      draft: 'bg-gray-500/20 text-gray-300',
      sent: 'bg-blue-500/20 text-blue-300',
      paid: 'bg-green-500/20 text-green-300',
      overdue: 'bg-red-500/20 text-red-300',
      cancelled: 'bg-gray-500/20 text-gray-400'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: Invoice['paymentStatus']) => {
    const styles = {
      unpaid: 'bg-red-500/20 text-red-300',
      partial: 'bg-yellow-500/20 text-yellow-300',
      paid: 'bg-green-500/20 text-green-300'
    };

    const icons = {
      unpaid: <XCircle size={12} />,
      partial: <Clock size={12} />,
      paid: <CheckCircle size={12} />
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${styles[paymentStatus]}`}>
        {icons[paymentStatus]}
        {paymentStatus.toUpperCase()}
      </span>
    );
  };

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
        title="Invoice Management"
        subtitle="Admin Dashboard"
        description="Manage invoices, track payments, and send invoices to customers."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Invoices', href: '/admin/invoices' }
        ]}
        size="default"
      >
        <Link href="/admin/invoices/create" className="btn btn-primary">
          <Plus size={16} />
          Create Invoice
        </Link>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Filters */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  <Search size={14} className="inline mr-1" />
                  Search by Email
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
                  <Filter size={14} className="inline mr-1" />
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
                  <DollarSign size={14} className="inline mr-1" />
                  Payment Status
                </label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setPaymentFilter('all');
                    setSearchQuery('');
                  }}
                  className="btn btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="glass-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-white/60">
                Loading invoices...
              </div>
            ) : invoices.length === 0 ? (
              <div className="p-12 text-center text-white/60">
                No invoices found. Create your first invoice to get started.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                          Invoice #
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText size={16} className="text-accent mr-2" />
                              <span className="text-white font-medium">{invoice.invoiceNumber}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{invoice.customerName}</div>
                            <div className="text-white/60 text-sm">{invoice.customerEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-white font-bold">{formatCurrency(invoice.totalAmount)}</div>
                            {invoice.monthlyTotal > 0 && (
                              <div className="text-accent text-xs">+{formatCurrency(invoice.monthlyTotal)}/mo</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(invoice.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getPaymentBadge(invoice.paymentStatus)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white/70">
                            {new Date(invoice.dueDate).toLocaleDateString('en-ZA')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href={`/api/invoices/${invoice.id}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                title="Download PDF"
                              >
                                <Download size={16} />
                              </a>
                              <button
                                onClick={() => handleSendInvoice(invoice.id)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-accent/20 text-white/70 hover:text-accent transition-colors"
                                title="Send Invoice"
                              >
                                <Send size={16} />
                              </button>
                              <Link
                                href={`/admin/invoices/${invoice.id}`}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </Link>
                              <button
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors"
                                title="Delete Invoice"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {total > pageSize && (
                  <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                    <div className="text-white/60 text-sm">
                      Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} invoices
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page * pageSize >= total}
                        className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
