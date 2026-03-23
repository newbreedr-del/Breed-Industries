import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById, updateInvoice } from '@/lib/invoiceStorage';
import { sendInvoiceEmail } from '@/lib/emailService';
import jsPDF from 'jspdf';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = getInvoiceById(id);

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Generate PDF (same logic as pdf route)
    const pdf = new jsPDF({
      compress: true,
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    
    const accentColor: [number, number, number] = [202, 129, 20];
    const darkBg: [number, number, number] = [26, 26, 27];
    const white: [number, number, number] = [255, 255, 255];
    const lightGray: [number, number, number] = [245, 245, 245];
    const textDark: [number, number, number] = [40, 40, 40];
    const textMuted: [number, number, number] = [100, 100, 100];

    const fmt = (n: number) => 'R ' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Header
    pdf.setFillColor(...darkBg);
    pdf.rect(0, 0, pageWidth, 52, 'F');
    
    pdf.setTextColor(...white);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BREED INDUSTRIES', margin, 30);

    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('The Breed Industries (PTY) LTD', pageWidth - margin, 14, { align: 'right' });
    pdf.text('4 Ivy Road, Pinetown, 3610', pageWidth - margin, 20, { align: 'right' });
    pdf.text('Phone: +27 60 496 4105', pageWidth - margin, 26, { align: 'right' });
    pdf.text('Email: info@thebreed.co.za', pageWidth - margin, 32, { align: 'right' });
    pdf.text('Web: www.thebreed.co.za', pageWidth - margin, 38, { align: 'right' });

    pdf.setFillColor(...accentColor);
    pdf.rect(0, 52, pageWidth, 14, 'F');
    pdf.setTextColor(...white);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INVOICE', margin, 61);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`#${invoice.invoiceNumber}`, pageWidth - margin, 61, { align: 'right' });

    let y = 74;

    pdf.setFillColor(...lightGray);
    pdf.rect(margin, y, contentWidth, 10, 'F');
    pdf.setTextColor(...textDark);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString('en-ZA')}`, margin + 4, y + 7);
    pdf.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-ZA')}`, margin + 70, y + 7);
    pdf.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - margin - 4, y + 7, { align: 'right' });
    y += 14;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...accentColor);
    pdf.text('BILL TO:', margin, y);
    y += 6;
    pdf.setTextColor(...textDark);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoice.customerName, margin, y);
    y += 5;
    if (invoice.customerEmail) {
      pdf.setFontSize(8);
      pdf.text(invoice.customerEmail, margin, y);
      y += 4;
    }
    if (invoice.customerPhone) {
      pdf.setFontSize(8);
      pdf.text(invoice.customerPhone, margin, y);
      y += 4;
    }
    y += 8;

    pdf.setFillColor(...darkBg);
    pdf.rect(margin, y, contentWidth, 10, 'F');
    pdf.setTextColor(...white);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('#', margin + 3, y + 7);
    pdf.text('Service / Description', margin + 12, y + 7);
    pdf.text('Qty', margin + 110, y + 7, { align: 'center' });
    pdf.text('Rate', margin + 135, y + 7, { align: 'right' });
    pdf.text('Amount', margin + contentWidth - 2, y + 7, { align: 'right' });
    y += 10;

    invoice.items.forEach((item, index) => {
      if (y > 230) { pdf.addPage(); y = 20; }
      if (index % 2 === 0) { 
        pdf.setFillColor(250, 250, 250); 
        pdf.rect(margin, y, contentWidth, 12, 'F'); 
      }
      
      pdf.setTextColor(...textDark);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${index + 1}`, margin + 3, y + 5);
      pdf.setFont('helvetica', 'bold');
      const itemName = item.name.substring(0, 55) + (item.pricingType === 'monthly' ? ' (Monthly)' : '');
      pdf.text(itemName, margin + 12, y + 5);
      
      if (item.description) {
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...textMuted);
        pdf.setFontSize(7);
        const descLines = pdf.splitTextToSize(item.description.substring(0, 120), 90);
        pdf.text(descLines[0] || '', margin + 12, y + 10);
      }
      
      pdf.setTextColor(...textDark);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(item.quantity.toString(), margin + 110, y + 5, { align: 'center' });
      const rateText = fmt(item.rate) + (item.pricingType === 'monthly' ? '/mo' : '');
      pdf.text(rateText, margin + 135, y + 5, { align: 'right' });
      pdf.setFont('helvetica', 'bold');
      const amountText = fmt(item.amount) + (item.pricingType === 'monthly' ? '/mo' : '');
      pdf.text(amountText, margin + contentWidth - 2, y + 5, { align: 'right' });
      y += 12;
    });

    y += 4;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin + 90, y, margin + contentWidth, y);
    y += 6;

    pdf.setTextColor(...textMuted);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('One-Time Fees:', margin + 95, y);
    pdf.text(fmt(invoice.oneTimeTotal), margin + contentWidth - 2, y, { align: 'right' });
    y += 6;

    if (invoice.monthlyTotal > 0) {
      pdf.text('Monthly Subscription:', margin + 95, y);
      pdf.text(fmt(invoice.monthlyTotal) + '/mo', margin + contentWidth - 2, y, { align: 'right' });
      y += 6;
    }

    pdf.setTextColor(...accentColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('50% Deposit Required:', margin + 95, y);
    pdf.text(fmt(invoice.deposit), margin + contentWidth - 2, y, { align: 'right' });
    y += 6;

    pdf.setTextColor(...textMuted);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Balance on Completion:', margin + 95, y);
    pdf.text(fmt(invoice.balance), margin + contentWidth - 2, y, { align: 'right' });
    y += 4;

    pdf.setFillColor(...darkBg);
    pdf.rect(margin + 90, y, contentWidth - 90, 12, 'F');
    pdf.setTextColor(...white);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTAL DUE:', margin + 95, y + 8);
    pdf.text(fmt(invoice.totalAmount), margin + contentWidth - 4, y + 8, { align: 'right' });
    y += 16;

    if (invoice.monthlyTotal > 0) {
      pdf.setFillColor(255, 250, 240);
      pdf.rect(margin, y, contentWidth, 14, 'F');
      pdf.setTextColor(...accentColor);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MONTHLY SUBSCRIPTIONS:', margin + 4, y + 5);
      pdf.setTextColor(...textDark);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Recurring monthly fees will be invoiced separately after initial payment is received.', margin + 4, y + 10);
      y += 18;
    }

    y += 4;
    pdf.setFillColor(255, 248, 235);
    pdf.rect(margin, y, contentWidth, 32, 'F');
    pdf.setTextColor(...accentColor);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT DETAILS', margin + 4, y + 6);
    pdf.setTextColor(...textDark);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Bank: Standard Bank', margin + 4, y + 12);
    pdf.text('Account Name: The Breed Industries (PTY) LTD', margin + 4, y + 17);
    pdf.text('Account Number: 10268731932', margin + 4, y + 22);
    pdf.text('Branch Code: 051001  |  SWIFT: SBZA ZA JJ', margin + 4, y + 27);

    pdf.setFillColor(...darkBg);
    pdf.rect(0, pageHeight - 18, pageWidth, 18, 'F');
    pdf.setTextColor(...white);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('www.thebreed.co.za  |  info@thebreed.co.za  |  +27 60 496 4105', pageWidth / 2, pageHeight - 10, { align: 'center' });

    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Send email
    await sendInvoiceEmail(
      invoice.customerEmail,
      invoice.customerName,
      invoice.invoiceNumber,
      pdfBuffer
    );

    // Update invoice status to 'sent'
    updateInvoice(id, { status: 'sent' });

    return NextResponse.json({
      success: true,
      message: 'Invoice sent successfully'
    });

  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500 }
    );
  }
}
