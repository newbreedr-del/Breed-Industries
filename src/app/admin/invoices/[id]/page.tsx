'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { Invoice } from '@/types/invoice';
import { 
  FileText, 
  Send, 
  Download, 
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInvoice(params.id as string);
    }
  }, [params.id]);

  const fetchInvoice = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/invoices/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
      } else {
        alert('Invoice not found');
        router.push('/admin/invoices');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      alert('Failed to load invoice');
      router.push('/admin/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!invoice || !confirm('Send this invoice to the customer?')) return;

    try {
      const response = await fetch(`/api/invoices/${invoice.id}/send`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('Invoice sent successfully!');
        fetchInvoice(invoice.id);
      } else {
        alert('Failed to send invoice');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice');
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: Invoice['paymentStatus']) => {
    const styles = {
      unpaid: 'bg-red-500/20 text-red-300',
      partial: 'bg-yellow-500/20 text-yellow-300',
      paid: 'bg-green-500/20 text-green-300',
      pending: 'bg-blue-500/20 text-blue-300'
    };

    const icons = {
      unpaid: <XCircle size={16} />,
      partial: <Clock size={16} />,
      paid: <CheckCircle size={16} />,
      pending: <Clock size={16} />
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${styles[paymentStatus]}`}>
        {icons[paymentStatus]}
        {paymentStatus.toUpperCase()}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount).replace('ZAR', 'R');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
          <div className="text-white text-xl">Loading invoice...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!invoice) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
          <div className="text-white text-xl">Invoice not found</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <PageHero
        title={`Invoice ${invoice.invoiceNumber}`}
        subtitle="Invoice Details"
        description="View and manage invoice information"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Invoices', href: '/admin/invoices' },
          { label: invoice.invoiceNumber, href: `/admin/invoices/${invoice.id}` }
        ]}
        size="default"
      >
        <div className="flex gap-3">
          <Link href="/admin/invoices" className="btn btn-outline">
            <ArrowLeft size={16} />
            Back to Invoices
          </Link>
          <a
            href={`/api/invoices/${invoice.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <Download size={16} />
            Download PDF
          </a>
          <button onClick={handleSendInvoice} className="btn btn-primary">
            <Send size={16} />
            Send Invoice
          </button>
        </div>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invoice Status */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Invoice Status</h2>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <div className="text-white/60 text-sm mb-1">Status</div>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">Payment Status</div>
                    {getPaymentBadge(invoice.paymentStatus)}
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <User size={20} className="text-accent" />
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-white/60 mt-1" />
                    <div>
                      <div className="text-white/60 text-sm">Name</div>
                      <div className="text-white font-medium">{invoice.customerName}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-white/60 mt-1" />
                    <div>
                      <div className="text-white/60 text-sm">Email</div>
                      <div className="text-white font-medium">{invoice.customerEmail}</div>
                    </div>
                  </div>
                  {invoice.customerPhone && (
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="text-white/60 mt-1" />
                      <div>
                        <div className="text-white/60 text-sm">Phone</div>
                        <div className="text-white font-medium">{invoice.customerPhone}</div>
                      </div>
                    </div>
                  )}
                  {invoice.customerAddress && (
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-white/60 mt-1" />
                      <div>
                        <div className="text-white/60 text-sm">Address</div>
                        <div className="text-white font-medium">{invoice.customerAddress}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Items */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-accent" />
                  Invoice Items
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase">Item</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-white/70 uppercase">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase">Rate</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-white/70 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4">
                            <div className="text-white font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-white/60 text-sm">{item.description}</div>
                            )}
                            {item.pricingType === 'monthly' && (
                              <span className="text-accent text-xs">(Monthly)</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center text-white">{item.quantity}</td>
                          <td className="px-4 py-4 text-right text-white">
                            {formatCurrency(item.rate)}
                            {item.pricingType === 'monthly' && <span className="text-accent text-xs">/mo</span>}
                          </td>
                          <td className="px-4 py-4 text-right text-white font-bold">
                            {formatCurrency(item.amount)}
                            {item.pricingType === 'monthly' && <span className="text-accent text-xs">/mo</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Invoice Summary */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-accent" />
                  Invoice Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-white/70">
                    <span>One-Time Fees:</span>
                    <span className="font-medium">{formatCurrency(invoice.oneTimeTotal)}</span>
                  </div>
                  {invoice.monthlyTotal > 0 && (
                    <div className="flex justify-between text-white/70">
                      <span>Monthly Subscription:</span>
                      <span className="font-medium">{formatCurrency(invoice.monthlyTotal)}/mo</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-accent font-bold text-lg">
                      <span>50% Deposit:</span>
                      <span>{formatCurrency(invoice.deposit)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Balance on Completion:</span>
                    <span className="font-medium">{formatCurrency(invoice.balance)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-white font-bold text-xl">
                      <span>Total Due:</span>
                      <span>{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                  </div>
                  {invoice.paidAmount > 0 && (
                    <>
                      <div className="flex justify-between text-green-400">
                        <span>Amount Paid:</span>
                        <span className="font-medium">{formatCurrency(invoice.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold">
                        <span>Balance Due:</span>
                        <span>{formatCurrency(invoice.totalAmount - invoice.paidAmount)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Invoice Dates */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-accent" />
                  Important Dates
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-white/60 text-sm">Issue Date</div>
                    <div className="text-white font-medium">
                      {new Date(invoice.issueDate).toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm">Due Date</div>
                    <div className="text-white font-medium">
                      {new Date(invoice.dueDate).toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  {invoice.paidDate && (
                    <div>
                      <div className="text-white/60 text-sm">Paid Date</div>
                      <div className="text-green-400 font-medium">
                        {new Date(invoice.paidDate).toLocaleDateString('en-ZA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Notes</h2>
                  <p className="text-white/70 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
