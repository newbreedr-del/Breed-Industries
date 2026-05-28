import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById, updateInvoice } from '@/lib/invoiceStorage';
import { generateInvoicePDF } from '@/lib/pdf/breedPdf';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY || '');
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'info@thebreed.co.za';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Generate branded PDF using shared breedPdf.ts (same as quote PDF engine)
    const pdfBuffer = generateInvoicePDF({
      invoiceNumber:   invoice.invoiceNumber,
      quoteNumber:     invoice.quoteNumber,
      customerName:    invoice.customerName,
      customerEmail:   invoice.customerEmail,
      customerPhone:   invoice.customerPhone,
      customerAddress: invoice.customerAddress,
      items:           invoice.items,
      oneTimeTotal:    invoice.oneTimeTotal,
      monthlyTotal:    invoice.monthlyTotal,
      deposit:         invoice.deposit,
      balance:         invoice.balance,
      totalAmount:     invoice.totalAmount,
      status:          invoice.status,
      paymentStatus:   invoice.paymentStatus,
      dueDate:         invoice.dueDate,
      issueDate:       invoice.issueDate,
      notes:           invoice.notes,
    });

    const gold = '#c8a96e';
    const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:620px;margin:32px auto;background:#111111;border-radius:12px;overflow:hidden;border:1px solid #2a2218;">
    <div style="background:#0f0f0f;padding:18px 28px;border-bottom:1px solid #2a2218;display:table;width:100%;box-sizing:border-box;">
      <div style="display:table-cell;vertical-align:middle;">
        <span style="font-size:20px;font-weight:900;color:${gold};letter-spacing:4px;">BREED</span><span style="font-size:10px;color:#888;letter-spacing:3px;margin-left:8px;">INDUSTRIES</span>
      </div>
      <div style="display:table-cell;vertical-align:middle;text-align:right;">
        <span style="font-size:10px;color:#555;letter-spacing:1px;">PREMIUM GROWTH AGENCY</span>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,#c8a96e 0%,#9b6310 100%);padding:24px 28px;">
      <p style="margin:0 0 4px;color:#111;font-size:11px;font-weight:700;letter-spacing:2px;">INVOICE</p>
      <h1 style="margin:0;color:#111;font-size:22px;font-weight:900;">#${invoice.invoiceNumber}</h1>
      <p style="margin:6px 0 0;color:#333;font-size:13px;">Issued to: <strong>${invoice.customerName}</strong></p>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#ccc;font-size:14px;line-height:1.7;margin:0 0 16px;">Hi <strong style="color:${gold};">${invoice.customerName}</strong>, please find your invoice attached. A 50% deposit is required before work commences.</p>
      <div style="background:#1a1a1a;border-radius:8px;overflow:hidden;margin-bottom:20px;">
        <div style="background:#222;padding:10px 16px;"><p style="margin:0;color:${gold};font-size:11px;font-weight:700;letter-spacing:1px;">INVOICE SUMMARY</p></div>
        <div style="padding:14px 16px;">
          <p style="margin:0 0 6px;color:#888;font-size:12px;">Invoice Number: <strong style="color:#fff;">#${invoice.invoiceNumber}</strong></p>
          <p style="margin:0 0 6px;color:#888;font-size:12px;">Issue Date: <strong style="color:#fff;">${new Date(invoice.issueDate).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></p>
          <p style="margin:0 0 6px;color:#888;font-size:12px;">Due Date: <strong style="color:#fff;">${new Date(invoice.dueDate).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></p>
          <p style="margin:0;color:#888;font-size:12px;">Total Amount: <strong style="color:${gold};font-size:16px;">R${invoice.totalAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</strong></p>
        </div>
      </div>
      <p style="color:#fff;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:20px 0 8px;">Banking Details</p>
      <table style="width:100%;border-collapse:collapse;background:#161616;border-radius:8px;overflow:hidden;margin-bottom:20px;">
        <tr><td style="padding:8px 16px;color:#888;font-size:12px;width:40%;">Bank</td><td style="padding:8px 16px;color:#fff;font-size:12px;">Standard Bank</td></tr>
        <tr style="background:#1a1a1a;"><td style="padding:8px 16px;color:#888;font-size:12px;">Account Name</td><td style="padding:8px 16px;color:#fff;font-size:12px;">The Breed Industries (PTY) LTD</td></tr>
        <tr><td style="padding:8px 16px;color:#888;font-size:12px;">Account Number</td><td style="padding:8px 16px;color:${gold};font-size:12px;font-weight:700;">10268731932</td></tr>
        <tr style="background:#1a1a1a;"><td style="padding:8px 16px;color:#888;font-size:12px;">Branch Code</td><td style="padding:8px 16px;color:#fff;font-size:12px;">051001</td></tr>
        <tr><td style="padding:8px 16px;color:#888;font-size:12px;">SWIFT</td><td style="padding:8px 16px;color:#fff;font-size:12px;">SBZAZAJJ</td></tr>
      </table>
      <p style="margin:0 0 20px;color:${gold};font-size:12px;font-weight:700;">Use your company name or invoice number as payment reference.</p>
      <div style="text-align:center;">
        <a href="mailto:${COMPANY_EMAIL}?subject=Payment confirmation - Invoice ${invoice.invoiceNumber}" style="display:inline-block;background:${gold};color:#111;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:900;font-size:14px;">Contact Us Once Paid</a>
      </div>
    </div>
    <div style="background:#0a0a0a;padding:20px 32px;border-top:1px solid #1e1e1e;text-align:center;">
      <p style="margin:0 0 6px;color:#444;font-size:11px;">Breed Industries (PTY) LTD &nbsp;|&nbsp; Premium Growth Agency &nbsp;|&nbsp; Durban, KZN</p>
      <p style="margin:0;font-size:11px;">
        <a href="https://www.thebreed.co.za" style="color:${gold};text-decoration:none;">www.thebreed.co.za</a>
        &nbsp;&nbsp;
        <a href="mailto:${COMPANY_EMAIL}" style="color:${gold};text-decoration:none;">${COMPANY_EMAIL}</a>
        &nbsp;&nbsp;
        <span style="color:#555;">+27 60 496 4105</span>
      </p>
    </div>
  </div>
</body></html>`;

    await resend.emails.send({
      from:    `Breed Industries <${COMPANY_EMAIL}>`,
      to:      invoice.customerEmail,
      replyTo: COMPANY_EMAIL,
      subject: `Invoice #${invoice.invoiceNumber} from Breed Industries`,
      html:    invoiceHtml,
      attachments: [{ filename: `Breed_Industries_Invoice_${invoice.invoiceNumber}.pdf`, content: pdfBuffer }],
    });

    // Update invoice status to 'sent'
    await updateInvoice(id, { status: 'sent' });

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
