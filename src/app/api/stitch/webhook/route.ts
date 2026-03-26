import { NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/stitchService';
import { getInvoiceById, updateInvoice } from '@/lib/invoiceStorage';
import { StitchWebhookPayload } from '@/types/stitch';

export async function POST(request: Request) {
  try {
    const payload: StitchWebhookPayload = await request.json();

    console.log('Stitch webhook received:', payload);

    if (payload.type !== 'payment.status.updated') {
      return NextResponse.json({ received: true });
    }

    const { paymentRequestId, status } = payload.data;

    // Get full payment details
    const paymentStatus = await getPaymentStatus(paymentRequestId);

    // Find invoice by payment request ID
    const invoiceId = paymentStatus.externalReference;
    
    if (!invoiceId) {
      console.error('No invoice ID found in payment external reference');
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = await getInvoiceById(invoiceId);
    
    if (!invoice) {
      console.error('Invoice not found:', invoiceId);
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Update invoice based on payment status
    if (status === 'complete') {
      const paidAmount = parseFloat(paymentStatus.amount.quantity) / 100;
      const newPaidAmount = (invoice.paidAmount || 0) + paidAmount;
      const newPaymentStatus = newPaidAmount >= invoice.totalAmount ? 'paid' : 'partial';

      await updateInvoice(invoice.id, {
        ...invoice,
        paidAmount: newPaidAmount,
        paymentStatus: newPaymentStatus,
        paymentDate: newPaymentStatus === 'paid' ? new Date().toISOString() : invoice.paymentDate,
        stitchPaymentId: paymentRequestId
      });

      console.log(`Invoice ${invoice.invoiceNumber} updated: R${paidAmount} paid`);
    } else if (status === 'failed' || status === 'cancelled') {
      await updateInvoice(invoice.id, {
        ...invoice,
        paymentStatus: 'unpaid',
        stitchPaymentId: paymentRequestId
      });

      console.log(`Payment ${status} for invoice ${invoice.invoiceNumber}`);
    }

    return NextResponse.json({ 
      success: true,
      invoiceId: invoice.id,
      status: status
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}
