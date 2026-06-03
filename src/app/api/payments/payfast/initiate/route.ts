import { NextRequest, NextResponse } from 'next/server';
import { generatePayFastUrl, PayFastPaymentData } from '@/lib/payfast';
import { getInvoiceById } from '@/lib/invoiceStorage';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, returnUrl, cancelUrl } = body;

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Missing type or id' },
        { status: 400 }
      );
    }

    let paymentData: PayFastPaymentData;
    let reference: string;

    if (type === 'invoice') {
      const invoice = await getInvoiceById(id);
      if (!invoice) {
        return NextResponse.json(
          { error: 'Invoice not found' },
          { status: 404 }
        );
      }

      const nameParts = invoice.customerName.split(' ');
      paymentData = {
        name_first: nameParts[0] || '',
        name_last: nameParts.slice(1).join(' ') || '',
        email_address: invoice.customerEmail || '',
        amount: invoice.totalAmount,
        item_name: `Invoice #${invoice.invoiceNumber}`,
        item_description: `Payment for invoice #${invoice.invoiceNumber} - ${invoice.customerName}`,
        custom_str1: invoice.id, // invoice ID
        custom_str2: invoice.customerEmail, // customer email
        custom_str3: invoice.invoiceNumber, // invoice number
        m_payment_id: `INV-${invoice.invoiceNumber}-${Date.now()}`,
      };
      reference = invoice.invoiceNumber;
    } else if (type === 'quote') {
      // For quotes, we'd need to fetch quote data - add this later if needed
      return NextResponse.json(
        { error: 'Quote payments not yet implemented' },
        { status: 501 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid payment type. Use "invoice" or "quote"' },
        { status: 400 }
      );
    }

    // Build callback URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const defaultReturnUrl = `${baseUrl}/admin/invoices/${id}`;
    const defaultCancelUrl = `${baseUrl}/admin/invoices/${id}`;
    const notifyUrl = `${baseUrl}/api/payments/payfast/itn`;

    const { url, signature } = generatePayFastUrl(
      paymentData,
      returnUrl || defaultReturnUrl,
      cancelUrl || defaultCancelUrl,
      notifyUrl
    );

    return NextResponse.json({
      success: true,
      paymentUrl: url,
      signature,
      reference,
      amount: paymentData.amount,
    });
  } catch (error: any) {
    console.error('PayFast initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
