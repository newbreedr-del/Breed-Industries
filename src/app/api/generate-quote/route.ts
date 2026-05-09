import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin as supabase } from '@/lib/supabase';
import { generateQuotePDF, QuoteData } from '@/lib/pdf/breedPdf';

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
      requireDeposit = true,
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

    // Add date and validUntil
    const date = new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });

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
      customer_phone: customerPhone || null,
      customer_company: customerCompany || null,
      project_name: projectName,
      contact_person: contactPerson,
      items: items,
      total: total,
      notes: notes || null,
      status: 'pending'
    });

    if (dbError) {
      console.error('Failed to save quote to database:', dbError.message);
      // Continue — don't block PDF download if DB fails
    }

    // Generate PDF
    let pdfBuffer: Buffer | null = null;
    try {
      const quoteData: QuoteData = {
        quoteNumber, customerName, customerCompany, customerAddress,
        customerEmail, customerPhone, projectName, contactPerson,
        paymentTerms, requireDeposit, items, notes, date, validUntil,
      };
      pdfBuffer = generateQuotePDF(quoteData);
    } catch (pdfErr) {
      console.error('Quote PDF generation failed:', pdfErr);
    }

    // Send email notification to admin
    const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
    const COMPANY_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';

    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      try {
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

        const emailResult = await resend.emails.send({
          from: `Breed Industries <${COMPANY_EMAIL}>`,
          to: COMPANY_EMAIL,
          replyTo: customerEmail,
          subject: `📋 New Quote ${quoteNumber} — ${customerName} (R${total.toLocaleString('en-ZA')})`,
          html: emailHtml,
        });
        if (emailResult.error) {
          console.error('Resend rejected quote notification email:', JSON.stringify(emailResult.error));
        } else {
          console.log('✅ Quote notification email sent, id:', emailResult.data?.id);
        }
      } catch (emailError) {
        console.error('Failed to send quote notification email:', emailError instanceof Error ? emailError.message : emailError);
      }

      // Client confirmation email
      if (customerEmail) {
        try {
          const timeline = String(data.estimatedTimeline || '3 – 7 Business Days');
          const clientItemsHtml = items.map((item: any, i: number) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid #2a2a2a;">
              <span style="color:#ccc;font-size:13px;">${i + 1}. ${item.name || 'Service'}</span>
              <span style="color:#c8a96e;font-weight:bold;font-size:13px;">R${((Number(item.quantity)||1)*(Number(item.rate)||0)).toLocaleString('en-ZA')}</span>
            </div>`).join('');

          const confirmHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
<div style="max-width:620px;margin:0 auto;background:#111;border-radius:10px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#c8a96e,#a8893e);padding:28px 32px;">
    <h1 style="margin:0 0 6px;color:#111;font-size:22px;">Quote Request Received!</h1>
    <p style="margin:0;color:#333;font-size:13px;">Reference: <strong>${quoteNumber}</strong> &nbsp;·&nbsp; We'll be in touch within 24 hours</p>
  </div>
  <div style="padding:28px 32px;">
    <p style="color:#ccc;font-size:15px;margin:0 0 24px;line-height:1.6;">Hi ${customerName},<br><br>Thank you for your quote request! Our team will review your package and prepare a formal quote shortly.</p>

    <div style="background:#1a1a1a;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <div style="background:#222;padding:12px 16px;border-bottom:1px solid #333;">
        <h2 style="margin:0;color:#c8a96e;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Your Requested Package</h2>
      </div>
      ${clientItemsHtml}
      <div style="background:#c8a96e;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;color:#111;font-size:14px;">Total Estimate</span>
        <span style="font-weight:bold;color:#111;font-size:18px;">R${total.toLocaleString('en-ZA')}</span>
      </div>
    </div>

    <div style="background:#1a1a1a;border-left:4px solid #c8a96e;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
      <p style="margin:0 0 4px;color:#fff;font-weight:bold;font-size:13px;">Estimated Turnaround</p>
      <p style="margin:0 0 4px;color:#c8a96e;font-size:20px;font-weight:bold;">${timeline}</p>
      <p style="margin:0;color:#999;font-size:11px;">Timeline begins after receipt of required documents and 50% deposit</p>
    </div>

    <div style="margin-bottom:24px;">
      <h3 style="color:#fff;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">What Happens Next</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="vertical-align:top;padding-bottom:10px;width:32px;"><div style="width:22px;height:22px;background:#c8a96e;border-radius:50%;text-align:center;line-height:22px;color:#111;font-weight:bold;font-size:11px;">1</div></td><td style="vertical-align:top;padding-bottom:10px;padding-left:10px;color:#999;font-size:13px;">Our team reviews your package and prepares a formal quote document</td></tr>
        <tr><td style="vertical-align:top;padding-bottom:10px;width:32px;"><div style="width:22px;height:22px;background:#c8a96e;border-radius:50%;text-align:center;line-height:22px;color:#111;font-weight:bold;font-size:11px;">2</div></td><td style="vertical-align:top;padding-bottom:10px;padding-left:10px;color:#999;font-size:13px;">We contact you within 24 hours with the formal quote and deposit invoice</td></tr>
        <tr><td style="vertical-align:top;width:32px;"><div style="width:22px;height:22px;background:#c8a96e;border-radius:50%;text-align:center;line-height:22px;color:#111;font-weight:bold;font-size:11px;">3</div></td><td style="vertical-align:top;padding-left:10px;color:#999;font-size:13px;">Once 50% deposit is confirmed, your project begins immediately</td></tr>
      </table>
    </div>

    <div style="background:#1a1a1a;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 10px;color:#fff;font-weight:bold;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Banking Details</p>
      <p style="margin:0 0 3px;color:#999;font-size:12px;">Bank: <strong style="color:#fff;">Standard Bank</strong></p>
      <p style="margin:0 0 3px;color:#999;font-size:12px;">Account Name: <strong style="color:#fff;">The Breed Industries (PTY) LTD</strong></p>
      <p style="margin:0 0 3px;color:#999;font-size:12px;">Account Number: <strong style="color:#fff;">10268731932</strong></p>
      <p style="margin:0 0 3px;color:#999;font-size:12px;">Branch Code: <strong style="color:#fff;">051001</strong> &nbsp;|&nbsp; SWIFT: <strong style="color:#fff;">SBZAZAJJ</strong></p>
      <p style="margin:6px 0 0;color:#c8a96e;font-size:12px;font-weight:bold;">50% deposit required before work commences</p>
    </div>

    <p style="color:#999;font-size:13px;margin:0 0 4px;">Questions? Reply to this email or contact us:</p>
    <a href="mailto:${COMPANY_EMAIL}" style="color:#c8a96e;font-size:13px;">${COMPANY_EMAIL}</a>
    ${customerPhone ? `<p style="color:#999;font-size:12px;margin:4px 0 0;">We may also reach you on <strong style="color:#fff;">${customerPhone}</strong></p>` : ''}
    <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
    <p style="color:#555;font-size:11px;margin:0;text-align:center;">Breed Industries (PTY) LTD &nbsp;·&nbsp; <a href="https://www.thebreed.co.za" style="color:#555;">www.thebreed.co.za</a></p>
  </div>
</div>
</body></html>`;

          const confirmResult = await resend.emails.send({
            from: `Breed Industries <${COMPANY_EMAIL}>`,
            to: customerEmail,
            replyTo: COMPANY_EMAIL,
            subject: `Quote Request Received — Ref ${quoteNumber} | Breed Industries`,
            html: confirmHtml,
            attachments: pdfBuffer
              ? [{ filename: `Breed_Industries_Quote_${quoteNumber}.pdf`, content: pdfBuffer }]
              : [],
          });
          if (confirmResult.error) {
            console.error('Resend error on client confirmation email:', JSON.stringify(confirmResult.error));
          } else {
            console.log('✅ Client confirmation email sent to', customerEmail, 'id:', confirmResult.data?.id);
          }
        } catch (confirmError) {
          console.error('Failed to send client confirmation email:', confirmError instanceof Error ? confirmError.message : confirmError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Quote generated successfully',
      quoteNumber,
      pdfBase64: pdfBuffer ? pdfBuffer.toString('base64') : null,
    });

  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quote' },
      { status: 500 }
    );
  }
}
