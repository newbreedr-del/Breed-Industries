import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { quote } = await req.json();

    if (!quote || !quote.id || !quote.customer_email) {
      return NextResponse.json({ error: 'Quote data is required' }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
    const COMPANY_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);
    const items: any[] = Array.isArray(quote.items) ? quote.items : [];

    const itemsHtml = items.map((item: any, i: number) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#ccc;">${i + 1}. ${item.name || item.description || 'Service'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;text-align:center;color:#ccc;">${item.quantity || 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;text-align:right;color:#ccc;">R${(Number(item.rate) || 0).toLocaleString('en-ZA')}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;text-align:right;color:#fff;font-weight:bold;">R${((Number(item.quantity) || 1) * (Number(item.rate) || 0)).toLocaleString('en-ZA')}</td>
      </tr>`).join('');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#111;border-radius:10px;overflow:hidden;">
    <div style="background:#c8a96e;padding:28px 32px;">
      <img src="https://www.thebreed.co.za/favicon.png" alt="Breed Industries" style="height:40px;margin-bottom:12px;" />
      <h1 style="margin:0;color:#111;font-size:22px;">Your Quote from Breed Industries</h1>
      <p style="margin:6px 0 0;color:#333;font-size:14px;">Quote Number: <strong>${quote.quote_number}</strong></p>
    </div>

    <div style="padding:28px 32px;">
      <p style="color:#ccc;margin:0 0 20px;">Dear ${quote.customer_name},</p>
      <p style="color:#ccc;margin:0 0 24px;">Please find your quote summary below. We look forward to working with you.</p>

      <table style="width:100%;border-collapse:collapse;background:#1a1a1a;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <thead>
          <tr style="background:#222;">
            <th style="padding:10px 12px;text-align:left;color:#c8a96e;font-size:12px;">Service</th>
            <th style="padding:10px 12px;text-align:center;color:#c8a96e;font-size:12px;">Qty</th>
            <th style="padding:10px 12px;text-align:right;color:#c8a96e;font-size:12px;">Rate</th>
            <th style="padding:10px 12px;text-align:right;color:#c8a96e;font-size:12px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr style="background:#c8a96e;">
            <td colspan="3" style="padding:12px;font-weight:bold;color:#111;font-size:15px;">TOTAL</td>
            <td style="padding:12px;font-weight:bold;color:#111;font-size:15px;text-align:right;">R${(Number(quote.total) || 0).toLocaleString('en-ZA')}</td>
          </tr>
        </tfoot>
      </table>

      <div style="background:#1a1a1a;border-left:4px solid #c8a96e;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
        <p style="margin:0 0 8px;color:#fff;font-weight:bold;">Payment Details</p>
        <p style="margin:0 0 4px;color:#999;font-size:13px;">Bank: Standard Bank</p>
        <p style="margin:0 0 4px;color:#999;font-size:13px;">Account: The Breed Industries (PTY) LTD</p>
        <p style="margin:0 0 4px;color:#999;font-size:13px;">Account Number: 10268731932</p>
        <p style="margin:0 0 4px;color:#999;font-size:13px;">Branch Code: 051001</p>
        <p style="margin:0;color:#c8a96e;font-size:13px;font-weight:bold;">50% deposit required before work commences</p>
      </div>

      <p style="color:#999;font-size:13px;margin:0 0 8px;">To proceed or if you have any questions, reply to this email or contact us at:</p>
      <p style="margin:0;"><a href="mailto:info@thebreed.co.za" style="color:#c8a96e;">info@thebreed.co.za</a></p>

      <hr style="border:none;border-top:1px solid #222;margin:28px 0;" />
      <p style="color:#555;font-size:11px;margin:0;">This quote was prepared by Breed Industries (PTY) LTD · <a href="https://www.thebreed.co.za" style="color:#555;">www.thebreed.co.za</a></p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: COMPANY_EMAIL,
      to: quote.customer_email,
      replyTo: COMPANY_EMAIL,
      subject: `Your Quote ${quote.quote_number} from Breed Industries — R${(Number(quote.total) || 0).toLocaleString('en-ZA')}`,
      html: emailHtml,
    });

    // Mark quote as sent in Supabase
    await supabase
      .from('quotes')
      .update({ status: 'sent', updated_at: new Date().toISOString() })
      .eq('id', quote.id);

    return NextResponse.json({ success: true, message: `Quote emailed to ${quote.customer_email}` });

  } catch (error) {
    console.error('Error sending quote email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
