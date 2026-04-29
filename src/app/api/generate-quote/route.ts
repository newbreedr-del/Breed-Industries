import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      customerName = '',
      customerCompany = '',
      customerAddress = '',
      customerEmail = '',
      customerPhone = '',
      projectName = '',
      contactPerson = '',
      paymentTerms = '50% Upfront',
      items = [],
      notes = ''
    } = data ?? {};

    // Basic validation
    if (!customerName.trim() || !customerEmail.trim() || !projectName.trim() || !contactPerson.trim()) {
      return NextResponse.json(
        { error: 'Customer name, email, project name, and contact person are required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one quote item is required.' },
        { status: 400 }
      );
    }

    // Generate quote number
    const quoteNumber = `Q-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Calculate total correctly (QuoteGenerator sends item.rate not item.unitPrice)
    const total = items.reduce((sum: number, item: any) => {
      return sum + ((Number(item.quantity) || 1) * (Number(item.rate) || 0));
    }, 0);

    // Save quote to Supabase so it appears in admin
    const quoteId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const { error: dbError } = await supabase.from('quotes').insert({
      id: quoteId,
      quote_number: quoteNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      project_name: projectName,
      contact_person: contactPerson,
      items: items,
      total: total,
      status: 'pending'
    });

    if (dbError) {
      console.error('Failed to save quote to database:', dbError.message);
      // Continue — don't block PDF download if DB fails
    }

    // Send email notification to admin
    const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
    const COMPANY_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);

        const itemsHtml = items.map((item: any, i: number) => `
          <tr>
            <td style="padding:6px 12px;border-bottom:1px solid #333;">${i + 1}. ${item.name || 'N/A'}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #333;text-align:center;">${item.quantity || 1}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #333;text-align:right;">R${(Number(item.rate) || 0).toLocaleString('en-ZA')}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #333;text-align:right;">R${((Number(item.quantity) || 1) * (Number(item.rate) || 0)).toLocaleString('en-ZA')}</td>
          </tr>`).join('');

        const emailHtml = `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#111;color:#fff;border-radius:8px;overflow:hidden;">
  <div style="background:#c8a96e;padding:20px 30px;">
    <h2 style="margin:0;color:#111;">New Quote Created — ${quoteNumber}</h2>
  </div>
  <div style="padding:24px 30px;">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="color:#999;padding:4px 0;width:140px;">Client</td><td style="color:#fff;">${customerName}${customerCompany ? ` (${customerCompany})` : ''}</td></tr>
      <tr><td style="color:#999;padding:4px 0;">Email</td><td style="color:#fff;"><a href="mailto:${customerEmail}" style="color:#c8a96e;">${customerEmail}</a></td></tr>
      ${customerPhone ? `<tr><td style="color:#999;padding:4px 0;">Phone</td><td style="color:#fff;">${customerPhone}</td></tr>` : ''}
      ${customerAddress ? `<tr><td style="color:#999;padding:4px 0;">Address</td><td style="color:#fff;">${customerAddress}</td></tr>` : ''}
      <tr><td style="color:#999;padding:4px 0;">Project</td><td style="color:#fff;">${projectName}</td></tr>
      <tr><td style="color:#999;padding:4px 0;">Contact Person</td><td style="color:#fff;">${contactPerson}</td></tr>
      <tr><td style="color:#999;padding:4px 0;">Payment Terms</td><td style="color:#fff;">${paymentTerms}</td></tr>
    </table>
    <table style="width:100%;border-collapse:collapse;background:#1a1a1a;border-radius:6px;overflow:hidden;margin-bottom:20px;">
      <thead>
        <tr style="background:#222;">
          <th style="padding:8px 12px;text-align:left;color:#c8a96e;">Service</th>
          <th style="padding:8px 12px;text-align:center;color:#c8a96e;">Qty</th>
          <th style="padding:8px 12px;text-align:right;color:#c8a96e;">Rate</th>
          <th style="padding:8px 12px;text-align:right;color:#c8a96e;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr style="background:#c8a96e;">
          <td colspan="3" style="padding:10px 12px;font-weight:bold;color:#111;">TOTAL</td>
          <td style="padding:10px 12px;font-weight:bold;color:#111;text-align:right;">R${total.toLocaleString('en-ZA')}</td>
        </tr>
      </tfoot>
    </table>
    ${notes ? `<p style="color:#999;font-size:13px;"><strong style="color:#fff;">Notes:</strong> ${notes}</p>` : ''}
    <p style="color:#999;font-size:12px;margin-top:24px;">Generated: ${new Date().toLocaleString('en-ZA')}</p>
  </div>
</div>`;

        await resend.emails.send({
          from: COMPANY_EMAIL,
          to: COMPANY_EMAIL,
          replyTo: customerEmail,
          subject: `📋 New Quote ${quoteNumber} — ${customerName} (R${total.toLocaleString('en-ZA')})`,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error('Failed to send quote email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Quote generated successfully',
      quoteNumber
    });

  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quote' },
      { status: 500 }
    );
  }
}
