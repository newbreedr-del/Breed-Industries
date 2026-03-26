import { NextResponse } from 'next/server';
import { createPaymentRequest } from '@/lib/stitchService';
import { getInvoiceById, updateInvoice } from '@/lib/invoiceStorage';

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json();

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Get invoice details
    const invoice = await getInvoiceById(invoiceId);
    
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Calculate amount to pay (total - paid amount)
    const amountDue = invoice.totalAmount - (invoice.paidAmount || 0);

    if (amountDue <= 0) {
      return NextResponse.json(
        { error: 'Invoice is already fully paid' },
        { status: 400 }
      );
    }

    // Create Stitch payment request
    const paymentInitiation = await createPaymentRequest(
      invoice.id,
      amountDue,
      invoice.customerName,
      invoice.invoiceNumber
    );

    // Update invoice with payment request ID
    await updateInvoice(invoice.id, {
      ...invoice,
      stitchPaymentId: paymentInitiation.paymentRequestId,
      paymentStatus: 'pending'
    });

    return NextResponse.json({
      success: true,
      paymentUrl: paymentInitiation.url,
      paymentRequestId: paymentInitiation.paymentRequestId,
      amount: amountDue
    });

  } catch (error) {
    console.error('Error creating payment request:', error);
    return NextResponse.json(
      { error: 'Failed to create payment request', details: error.message },
      { status: 500 }
    );
  }
}
