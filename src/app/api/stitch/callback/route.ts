import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus } from '@/lib/stitchService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentRequestId = searchParams.get('paymentRequestId');
    const status = searchParams.get('status');

    if (!paymentRequestId) {
      return NextResponse.redirect(new URL('/admin/invoices?error=missing_payment_id', request.url));
    }

    // Get payment status from Stitch
    const paymentStatus = await getPaymentStatus(paymentRequestId);

    // Redirect to invoice page with status
    const invoiceId = paymentStatus.externalReference;
    
    if (paymentStatus.status === 'complete') {
      return NextResponse.redirect(
        new URL(`/admin/invoices?success=payment_complete&invoice=${invoiceId}`, request.url)
      );
    } else if (paymentStatus.status === 'cancelled') {
      return NextResponse.redirect(
        new URL(`/admin/invoices?error=payment_cancelled&invoice=${invoiceId}`, request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL(`/admin/invoices?status=payment_pending&invoice=${invoiceId}`, request.url)
      );
    }

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(
      new URL('/admin/invoices?error=payment_error', request.url)
    );
  }
}
