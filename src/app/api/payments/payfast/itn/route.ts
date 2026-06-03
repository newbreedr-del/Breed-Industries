import { NextRequest, NextResponse } from 'next/server';
import { validateITNSignature, isValidPayFastIP, PayFastITNData } from '@/lib/payfast';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for validation
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // Parse form data from PayFast
    const formData = await request.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log('PayFast ITN received:', {
      ip: clientIP,
      paymentId: data.pf_payment_id,
      status: data.payment_status,
      mPaymentId: data.m_payment_id,
    });

    // Validate IP address
    if (!isValidPayFastIP(clientIP)) {
      console.error('Invalid PayFast IP:', clientIP);
      return NextResponse.json(
        { error: 'Invalid IP address' },
        { status: 403 }
      );
    }

    // Validate signature
    if (!validateITNSignature(data)) {
      console.error('Invalid PayFast signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Check payment status
    if (data.payment_status !== 'COMPLETE') {
      console.log('Payment not complete:', data.payment_status);
      // Still return 200 to acknowledge receipt
      return NextResponse.json({ status: 'received', payment_status: data.payment_status });
    }

    // Extract relevant data
    const invoiceId = data.custom_str1; // We stored invoice ID in custom_str1
    const invoiceNumber = data.custom_str3; // Invoice number
    const pfPaymentId = data.pf_payment_id;
    const amountGross = parseFloat(data.amount_gross || '0');
    const amountNet = parseFloat(data.amount_net || '0');

    if (!invoiceId) {
      console.error('No invoice ID in ITN data');
      return NextResponse.json({ error: 'Missing invoice ID' }, { status: 400 });
    }

    // Check if this payment was already processed
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('pf_payment_id', pfPaymentId)
      .maybeSingle();

    if (existingPayment) {
      console.log('Payment already processed:', pfPaymentId);
      return NextResponse.json({ status: 'already_processed' });
    }

    // Record the payment
    const { error: paymentError } = await supabaseAdmin.from('payments').insert({
      invoice_id: invoiceId,
      pf_payment_id: pfPaymentId,
      amount: amountNet,
      amount_gross: amountGross,
      payment_status: data.payment_status,
      payment_date: new Date().toISOString(),
      raw_data: data,
    });

    if (paymentError) {
      console.error('Failed to record payment:', paymentError);
      // Continue anyway to update invoice status
    }

    // Update invoice payment status
    const { error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .update({
        payment_status: 'paid',
        status: 'paid',
        paid_at: new Date().toISOString(),
        payment_method: 'payfast',
        payment_reference: pfPaymentId,
      })
      .eq('id', invoiceId);

    if (invoiceError) {
      console.error('Failed to update invoice:', invoiceError);
    } else {
      console.log(`Invoice ${invoiceNumber} marked as paid`);
    }

    // Return success to PayFast
    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('PayFast ITN error:', error);
    // Still return 200 to avoid PayFast retrying
    return NextResponse.json({ status: 'error', error: error.message });
  }
}
