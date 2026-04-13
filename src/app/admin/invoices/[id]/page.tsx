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
  XCircle,
  Loader2,
  RefreshCw,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

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
        setInvoice(data.invoice ?? data);
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

  const generateInvoicePDF = async () => {
    if (!invoice || pdfLoading) return;
    setPdfLoading(true);
    try {
      const { default: JsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      const pdf = new JsPDF({ compress: true, unit: 'mm', format: 'a4' });
      const pageWidth = 210, pageHeight = 297, margin = 20;
      const contentWidth = pageWidth - margin * 2;
      const accentColor: [number,number,number] = [202,129,20];
      const darkBg: [number,number,number] = [26,26,27];
      const white: [number,number,number] = [255,255,255];
      const lightGray: [number,number,number] = [245,245,245];
      const textDark: [number,number,number] = [40,40,40];
      const textMuted: [number,number,number] = [100,100,100];
      const fmt = (n: number) => 'R ' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const hasDeposit = invoice.deposit > 0;
      const oneTimeItems = invoice.items.filter(i => i.pricingType !== 'monthly');
      const monthlyItems = invoice.items.filter(i => i.pricingType === 'monthly');
      const drawFooter = () => {
        pdf.setFillColor(...darkBg); pdf.rect(0, pageHeight - 18, pageWidth, 18, 'F');
        pdf.setTextColor(...white); pdf.setFontSize(7); pdf.setFont('helvetica', 'normal');
        pdf.text('www.thebreed.co.za  |  info@thebreed.co.za  |  +27 60 496 4105', pageWidth / 2, pageHeight - 10, { align: 'center' });
      };
      // Header
      pdf.setFillColor(...darkBg); pdf.rect(0, 0, pageWidth, 52, 'F');
      try {
        const logoImg = new window.Image(); logoImg.crossOrigin = 'anonymous';
        await new Promise<void>((res, rej) => { logoImg.onload = () => res(); logoImg.onerror = () => rej(); logoImg.src = '/assets/images/The Breed Industries Just Logo-01 igkjh-01.png'; });
        const c = document.createElement('canvas'); c.width = 113; c.height = 113;
        const ctx = c.getContext('2d');
        if (ctx) { ctx.drawImage(logoImg, 0, 0, 113, 113); pdf.addImage(c.toDataURL('image/png', 1.0), 'PNG', margin, 6, 40, 40); }
      } catch { pdf.setTextColor(...white); pdf.setFontSize(18); pdf.setFont('helvetica','bold'); pdf.text('BREED INDUSTRIES', margin, 30); }
      pdf.setTextColor(200,200,200); pdf.setFontSize(7); pdf.setFont('helvetica','normal');
      pdf.text('The Breed Industries (PTY) LTD', pageWidth-margin, 14, {align:'right'});
      pdf.text('1 Kings Road, Pinetown, Durban 3610', pageWidth-margin, 20, {align:'right'});
      pdf.text('Phone: +27 60 496 4105', pageWidth-margin, 26, {align:'right'});
      pdf.text('Email: info@thebreed.co.za', pageWidth-margin, 32, {align:'right'});
      pdf.text('Web: www.thebreed.co.za', pageWidth-margin, 38, {align:'right'});
      // Title bar
      pdf.setFillColor(...accentColor); pdf.rect(0,52,pageWidth,14,'F');
      pdf.setTextColor(...white); pdf.setFontSize(14); pdf.setFont('helvetica','bold'); pdf.text('INVOICE', margin, 61);
      pdf.setFontSize(10); pdf.setFont('helvetica','normal'); pdf.text(`#${invoice.invoiceNumber}`, pageWidth-margin, 61, {align:'right'});
      // Meta row
      let y = 74;
      pdf.setFillColor(...lightGray); pdf.rect(margin, y, contentWidth, 10, 'F');
      pdf.setTextColor(...textDark); pdf.setFontSize(8); pdf.setFont('helvetica','bold');
      const issueFmt = new Date(invoice.issueDate).toLocaleDateString('en-ZA', {day:'2-digit',month:'short',year:'numeric'});
      const dueFmt = new Date(invoice.dueDate).toLocaleDateString('en-ZA', {day:'2-digit',month:'short',year:'numeric'});
      pdf.text(`Issue: ${issueFmt}`, margin+4, y+7);
      pdf.text(`Due: ${dueFmt}`, pageWidth/2, y+7);
      pdf.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth-margin-4, y+7, {align:'right'});
      // Bill To
      y = 92; pdf.setFillColor(...accentColor); pdf.rect(margin, y, contentWidth/2, 1, 'F'); y += 4;
      pdf.setTextColor(...accentColor); pdf.setFontSize(8); pdf.setFont('helvetica','bold'); pdf.text('BILL TO:', margin, y); y += 6;
      pdf.setTextColor(...textDark); pdf.setFontSize(9); pdf.setFont('helvetica','bold'); pdf.text(invoice.customerName, margin, y); y += 5;
      pdf.setFont('helvetica','normal'); pdf.setFontSize(8);
      if (invoice.customerEmail) { pdf.text(invoice.customerEmail, margin, y); y += 4; }
      if (invoice.customerPhone) { pdf.text(invoice.customerPhone, margin, y); y += 4; }
      if (invoice.customerAddress) { const ls = pdf.splitTextToSize(invoice.customerAddress, 85); pdf.text(ls, margin, y); y += ls.length * 4.5; }
      if (invoice.quoteNumber) { pdf.setTextColor(...textMuted); pdf.text(`Quote Ref: ${invoice.quoteNumber}`, margin, y); y += 4; }
      y = Math.max(y + 6, 132);
      // One-time items
      if (oneTimeItems.length > 0) {
        pdf.setFillColor(...darkBg); pdf.rect(margin, y, contentWidth, 10, 'F');
        pdf.setTextColor(...white); pdf.setFontSize(8); pdf.setFont('helvetica','bold');
        pdf.text('#', margin+3, y+7); pdf.text('Service / Description', margin+12, y+7);
        pdf.text('Qty', margin+113, y+7, {align:'center'}); pdf.text('Rate', margin+138, y+7, {align:'right'}); pdf.text('Amount', margin+contentWidth-2, y+7, {align:'right'}); y += 10;
        oneTimeItems.forEach((item, idx) => {
          if (y > 235) { pdf.addPage(); y = 20; }
          const rh = item.description ? 14 : 10;
          if (idx%2===0) { pdf.setFillColor(250,250,250); pdf.rect(margin, y, contentWidth, rh, 'F'); }
          pdf.setTextColor(...textDark); pdf.setFontSize(8); pdf.setFont('helvetica','normal');
          pdf.text(`${idx+1}`, margin+3, y+6); pdf.setFont('helvetica','bold'); pdf.text(item.name.substring(0,60), margin+12, y+6);
          if (item.description) { pdf.setFont('helvetica','normal'); pdf.setTextColor(...textMuted); pdf.setFontSize(7); pdf.text(item.description.substring(0,110), margin+12, y+11); pdf.setTextColor(...textDark); pdf.setFontSize(8); }
          pdf.setFont('helvetica','normal');
          pdf.text(item.quantity.toString(), margin+113, y+6, {align:'center'});
          pdf.text(fmt(item.rate), margin+138, y+6, {align:'right'});
          pdf.setFont('helvetica','bold'); pdf.text(fmt(item.amount), margin+contentWidth-2, y+6, {align:'right'}); y += rh;
        });
      }
      // Monthly items
      if (monthlyItems.length > 0) {
        y += 4;
        pdf.setFillColor(...accentColor); pdf.rect(margin, y, contentWidth, 10, 'F');
        pdf.setTextColor(...white); pdf.setFontSize(7.5); pdf.setFont('helvetica','bold');
        pdf.text('MONTHLY SUBSCRIPTION  (FIRST MONTH DUE NOW)', margin+3, y+7);
        pdf.text('Rate/mo', margin+138, y+7, {align:'right'}); pdf.text('1st Month', margin+contentWidth-2, y+7, {align:'right'}); y += 10;
        monthlyItems.forEach((item, idx) => {
          if (y > 235) { pdf.addPage(); y = 20; }
          const rh = item.description ? 14 : 10;
          if (idx%2===0) { pdf.setFillColor(255,250,240); pdf.rect(margin, y, contentWidth, rh, 'F'); }
          pdf.setTextColor(...textDark); pdf.setFontSize(8); pdf.setFont('helvetica','normal');
          pdf.text(`${idx+1}`, margin+3, y+6); pdf.setFont('helvetica','bold'); pdf.text(item.name.substring(0,60), margin+12, y+6);
          if (item.description) { pdf.setFont('helvetica','normal'); pdf.setTextColor(...textMuted); pdf.setFontSize(7); pdf.text(item.description.substring(0,110), margin+12, y+11); pdf.setTextColor(...textDark); pdf.setFontSize(8); }
          pdf.setFont('helvetica','normal'); pdf.text(item.quantity.toString(), margin+113, y+6, {align:'center'});
          pdf.setTextColor(...accentColor); pdf.text(fmt(item.rate)+'/mo', margin+138, y+6, {align:'right'});
          pdf.setFont('helvetica','bold'); pdf.text(fmt(item.amount), margin+contentWidth-2, y+6, {align:'right'}); pdf.setTextColor(...textDark); y += rh;
        });
      }
      // Totals
      y += 4; pdf.setDrawColor(200,200,200); pdf.line(margin+90, y, margin+contentWidth, y); y += 6;
      if (oneTimeItems.length > 0) { pdf.setTextColor(...textMuted); pdf.setFontSize(9); pdf.setFont('helvetica','normal'); pdf.text('One-Time Fees (ex VAT):', margin+95, y); pdf.text(fmt(invoice.oneTimeTotal), margin+contentWidth-2, y, {align:'right'}); y += 6; }
      if (invoice.monthlyTotal > 0) { pdf.setTextColor(...accentColor); pdf.setFont('helvetica','bold'); pdf.text('Monthly Subscription (1st Month):', margin+95, y); pdf.text(fmt(invoice.monthlyTotal), margin+contentWidth-2, y, {align:'right'}); y += 6; }
      if (hasDeposit) {
        pdf.setDrawColor(200,200,200); pdf.line(margin+90, y, margin+contentWidth, y); y += 5;
        pdf.setTextColor(...accentColor); pdf.setFont('helvetica','bold'); pdf.text('50% Deposit Required:', margin+95, y); pdf.text(fmt(invoice.deposit), margin+contentWidth-2, y, {align:'right'}); y += 6;
        pdf.setTextColor(...textMuted); pdf.setFont('helvetica','normal'); pdf.text('Balance on Completion:', margin+95, y); pdf.text(fmt(invoice.balance), margin+contentWidth-2, y, {align:'right'}); y += 4;
      }
      const amountNow = (hasDeposit ? invoice.deposit : invoice.oneTimeTotal) + invoice.monthlyTotal;
      pdf.setFillColor(...darkBg); pdf.rect(margin+90, y, contentWidth-90, 14, 'F');
      pdf.setTextColor(...white); pdf.setFontSize(11); pdf.setFont('helvetica','bold');
      pdf.text(hasDeposit ? 'AMOUNT DUE NOW:' : 'TOTAL DUE (EX VAT):', margin+95, y+10);
      pdf.text(fmt(amountNow), margin+contentWidth-4, y+10, {align:'right'}); y += 18;
      pdf.setTextColor(...textMuted); pdf.setFontSize(7); pdf.setFont('helvetica','italic');
      pdf.text('Breed Industries is not VAT registered. All pricing is exclusive of VAT.', margin, y); y += 10;
      // Banking details
      if (y > 215) { pdf.addPage(); y = 20; }
      pdf.setFillColor(255,248,235); pdf.rect(margin, y, contentWidth, 36, 'F');
      pdf.setDrawColor(...accentColor); pdf.rect(margin, y, contentWidth, 36, 'S');
      pdf.setTextColor(...accentColor); pdf.setFontSize(9); pdf.setFont('helvetica','bold'); pdf.text('BANKING DETAILS', margin+4, y+7);
      pdf.setTextColor(...textDark); pdf.setFontSize(8); pdf.setFont('helvetica','normal');
      pdf.text('Bank: Standard Bank', margin+4, y+14); pdf.text('Account Name: The Breed Industries (PTY) LTD', margin+95, y+14);
      pdf.text('Account Number: 10268731932', margin+4, y+20); pdf.text('Branch Code: 051001  |  SWIFT: SBZA ZA JJ', margin+95, y+20);
      pdf.setFont('helvetica','bold'); pdf.setTextColor(...accentColor);
      pdf.text(`Payment Reference: ${invoice.invoiceNumber}`, margin+4, y+28);
      pdf.setFont('helvetica','normal'); pdf.setTextColor(...textDark);
      pdf.text('Email proof of payment to: info@thebreed.co.za', margin+4, y+34); y += 40;
      // Notes
      if (invoice.notes && invoice.notes.trim()) {
        if (y > 230) { pdf.addPage(); y = 20; } y += 4;
        pdf.setFillColor(...lightGray); pdf.rect(margin, y, contentWidth, 8, 'F');
        pdf.setTextColor(...textDark); pdf.setFontSize(8.5); pdf.setFont('helvetica','bold'); pdf.text('ADDITIONAL NOTES', margin+4, y+6); y += 12;
        pdf.setFont('helvetica','normal'); pdf.setFontSize(8);
        const noteLines = pdf.splitTextToSize(invoice.notes.trim(), contentWidth - 8);
        noteLines.forEach((line: string) => { if (y > 265) { pdf.addPage(); y = 20; } pdf.text(line, margin+2, y); y += 5; });
      }
      drawFooter();
      pdf.save(`Breed_Industries_Invoice_${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
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
          <button
            onClick={generateInvoicePDF}
            disabled={pdfLoading}
            className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pdfLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {pdfLoading ? 'Generating...' : 'Download PDF'}
          </button>
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

                {/* One-Time Items */}
                {invoice.items.filter(i => i.pricingType !== 'monthly').length > 0 && (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#1a1a1b]">
                          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase rounded-tl-lg">Item</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase">Qty</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-white uppercase">Rate</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-white uppercase rounded-tr-lg">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {invoice.items.filter(i => i.pricingType !== 'monthly').map((item, index) => (
                          <tr key={index} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-4">
                              <div className="text-white font-medium">{item.name}</div>
                              {item.description && <div className="text-white/60 text-sm mt-0.5">{item.description}</div>}
                            </td>
                            <td className="px-4 py-4 text-center text-white">{item.quantity}</td>
                            <td className="px-4 py-4 text-right text-white">{formatCurrency(item.rate)}</td>
                            <td className="px-4 py-4 text-right text-white font-bold">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Monthly Items */}
                {invoice.items.filter(i => i.pricingType === 'monthly').length > 0 && (
                  <div className="overflow-x-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-1 bg-accent/30"></div>
                      <span className="text-accent text-xs font-bold uppercase tracking-wider px-2">Monthly Subscription</span>
                      <div className="h-px flex-1 bg-accent/30"></div>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2 mb-3 flex items-center gap-2">
                      <CreditCard size={14} className="text-accent flex-shrink-0" />
                      <span className="text-accent text-sm font-semibold">First month's subscription is due now along with this invoice</span>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="bg-accent/20">
                          <th className="px-4 py-3 text-left text-xs font-medium text-accent uppercase rounded-tl-lg">Service</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-accent uppercase">Qty</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-accent uppercase">Rate/mo</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-accent uppercase rounded-tr-lg">1st Month</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {invoice.items.filter(i => i.pricingType === 'monthly').map((item, index) => (
                          <tr key={index} className="hover:bg-accent/5 transition-colors">
                            <td className="px-4 py-4">
                              <div className="text-white font-medium">{item.name}</div>
                              {item.description && <div className="text-white/60 text-sm mt-0.5">{item.description}</div>}
                            </td>
                            <td className="px-4 py-4 text-center text-white">{item.quantity}</td>
                            <td className="px-4 py-4 text-right text-white">{formatCurrency(item.rate)}<span className="text-accent text-xs">/mo</span></td>
                            <td className="px-4 py-4 text-right text-accent font-bold">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                  {invoice.oneTimeTotal > 0 && (
                    <div className="flex justify-between text-white/70">
                      <span>One-Time Fees:</span>
                      <span className="font-medium">{formatCurrency(invoice.oneTimeTotal)}</span>
                    </div>
                  )}
                  {invoice.monthlyTotal > 0 && (
                    <div className="flex justify-between text-accent">
                      <span className="font-semibold">Monthly (1st Month Due Now):</span>
                      <span className="font-semibold">{formatCurrency(invoice.monthlyTotal)}</span>
                    </div>
                  )}
                  {invoice.deposit > 0 && (
                    <>
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex justify-between text-accent font-bold text-lg">
                          <span>50% Deposit Required:</span>
                          <span>{formatCurrency(invoice.deposit)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Balance on Completion:</span>
                        <span className="font-medium">{formatCurrency(invoice.balance)}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-white font-bold text-xl">
                      <span>{invoice.deposit > 0 ? 'Amount Due Now:' : 'Total Due (ex VAT):'}</span>
                      <span>{formatCurrency((invoice.deposit > 0 ? invoice.deposit : invoice.oneTimeTotal) + invoice.monthlyTotal)}</span>
                    </div>
                    {invoice.deposit > 0 && invoice.monthlyTotal === 0 && (
                      <p className="text-white/40 text-xs mt-1">Balance of {formatCurrency(invoice.balance)} due on completion</p>
                    )}
                  </div>
                  {invoice.paidAmount > 0 && (
                    <>
                      <div className="flex justify-between text-green-400">
                        <span>Amount Paid:</span>
                        <span className="font-medium">{formatCurrency(invoice.paidAmount)}</span>
                      </div>
                      <div className="flex justify-between text-white font-bold">
                        <span>Outstanding:</span>
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
