import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateFreshStartPDF } from '@/lib/pdf/breedPdf';

export const runtime = 'nodejs';

function generateRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FS-${ts}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, businessName, businessIdea, sector, ageGroup, agreedToTerms } = body;

    // ── Validation ──────────────────────────────────────────────────────────────
    if (!name || !email || !agreedToTerms) {
      return NextResponse.json(
        { error: 'Name, email, and agreement to terms are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // ── Generate Reference & Date ────────────────────────────────────────────────
    const refNumber = generateRef();
    const date = new Date().toLocaleDateString('en-ZA', {
      day: '2-digit', month: 'long', year: 'numeric',
    });

    // ── Generate PDF ────────────────────────────────────────────────────────────
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = generateFreshStartPDF({ name, email, businessName, businessIdea, refNumber, date });
    } catch (pdfErr) {
      console.error('PDF generation failed:', pdfErr);
      // Continue — we still send the email, just without the PDF
    }

    // ── Send Emails via Resend ────────────────────────────────────────────────
    const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
    const COMPANY_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';

    if (!RESEND_API_KEY) {
      console.warn('Resend API key not configured');
    } else {
      const resend = new Resend(RESEND_API_KEY);

      // ── 1. Client welcome email (with PDF) ────────────────────────────────────
      const clientAttachments = pdfBuffer
        ? [{ filename: `FreshStart_WelcomePack_${refNumber}.pdf`, content: pdfBuffer }]
        : [];

      const clientHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:Arial,sans-serif;">
  <div style="max-width:620px;margin:32px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#0B1118;padding:32px;text-align:center;">
      <div style="display:inline-block;margin-bottom:16px;">
        <img src="https://www.thebreed.co.za/assets/images/logos/breed-logo-just.png" alt="Breed Industries" style="height:52px;" />
      </div>
      <div style="color:#FF9F00;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;">Fresh Start</div>
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Your Application Has Been Received</h1>
    </div>

    <!-- Orange accent bar -->
    <div style="background:#FF9F00;height:3px;"></div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="color:#1c222c;font-size:16px;margin:0 0 20px;">Hi ${name.split(' ')[0]},</p>
      <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Thank you for applying to <strong>Fresh Start by Breed Industries</strong>. We've received your application and our team will be in touch within <strong>1–2 business days</strong> to confirm your details and begin the funding suitability assessment.
      </p>

      <!-- Reference box -->
      <div style="background:#f8f8fa;border-left:4px solid #FF9F00;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Your Reference Number</p>
        <p style="margin:0;color:#0B1118;font-size:18px;font-weight:700;font-family:monospace;">${refNumber}</p>
        <p style="margin:6px 0 0;color:#aaa;font-size:11px;">Keep this reference handy when contacting us.</p>
      </div>

      <p style="color:#444;font-size:14px;line-height:1.7;margin:0 0 16px;">
        We've attached your <strong>Fresh Start Welcome Pack</strong> to this email — it contains a full breakdown of how the programme works, the funding bodies we'll approach on your behalf, and the terms governing our service.
      </p>

      <!-- What happens next -->
      <div style="background:#0B1118;border-radius:8px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 16px;color:#FF9F00;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">What Happens Next</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
          <tr>
            <td width="34" valign="top" style="padding-bottom:14px;">
              <div style="background:#FF9F00;color:#0B1118;font-weight:700;font-size:11px;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px;display:block;">1</div>
            </td>
            <td valign="top" style="padding-bottom:14px;">
              <p style="margin:0;color:#ccc;font-size:13px;line-height:1.6;padding-top:3px;">We review your application and confirm the best-fit funding programmes for your situation.</p>
            </td>
          </tr>
          <tr>
            <td width="34" valign="top" style="padding-bottom:14px;">
              <div style="background:#FF9F00;color:#0B1118;font-weight:700;font-size:11px;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px;display:block;">2</div>
            </td>
            <td valign="top" style="padding-bottom:14px;">
              <p style="margin:0;color:#ccc;font-size:13px;line-height:1.6;padding-top:3px;">We draft your application and engage with the relevant agencies on your behalf.</p>
            </td>
          </tr>
          <tr>
            <td width="34" valign="top">
              <div style="background:#FF9F00;color:#0B1118;font-weight:700;font-size:11px;width:24px;height:24px;border-radius:50%;text-align:center;line-height:24px;display:block;">3</div>
            </td>
            <td valign="top">
              <p style="margin:0;color:#ccc;font-size:13px;line-height:1.6;padding-top:3px;">Once your funding is approved, your R1,000 commitment fee is deducted from your Breed Industries package.</p>
            </td>
          </tr>
        </table>
      </div>

      <p style="color:#444;font-size:14px;margin:0 0 20px;">
        If you have any questions in the meantime, reply to this email or reach us on WhatsApp at <a href="https://wa.me/27604964105" style="color:#FF9F00;">+27 60 496 4105</a>.
      </p>

      <p style="color:#888;font-size:13px;margin:0;">Warm regards,<br /><strong style="color:#0B1118;">The Breed Industries Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="background:#0B1118;padding:20px;text-align:center;">
      <p style="margin:0;color:#666;font-size:11px;">
        The Breed Industries (PTY) LTD · 12 Kings Road, Pinetown, Durban 3610<br />
        <a href="https://www.thebreed.co.za" style="color:#FF9F00;">www.thebreed.co.za</a> · info@thebreed.co.za · +27 60 496 4105
      </p>
    </div>
  </div>
</body>
</html>`;

      const clientResult = await resend.emails.send({
        from: `Breed Industries <${COMPANY_EMAIL}>`,
        to: email,
        replyTo: COMPANY_EMAIL,
        subject: `Your Fresh Start Application — Ref ${refNumber}`,
        html: clientHtml,
        attachments: clientAttachments,
      });

      if (clientResult.error) {
        console.error('Resend client email error:', clientResult.error);
      } else {
        console.log('✅ Fresh Start client email sent:', clientResult.data?.id);
      }

      // ── 2. Admin notification ─────────────────────────────────────────────────
      const adminHtml = `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#111;color:#fff;border-radius:8px;overflow:hidden;">
  <div style="background:#FF9F00;padding:20px 30px;">
    <h2 style="margin:0;color:#0B1118;">🌱 New Fresh Start Application</h2>
    <p style="margin:6px 0 0;color:#1c1c1c;font-size:13px;">Reference: <strong>${refNumber}</strong></p>
  </div>
  <div style="padding:24px 30px;">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="color:#999;padding:6px 0;width:140px;">Name</td><td style="color:#fff;">${name}</td></tr>
      <tr><td style="color:#999;padding:6px 0;">Email</td><td><a href="mailto:${email}" style="color:#FF9F00;">${email}</a></td></tr>
      ${phone ? `<tr><td style="color:#999;padding:6px 0;">Phone</td><td style="color:#fff;">${phone}</td></tr>` : ''}
      ${businessName ? `<tr><td style="color:#999;padding:6px 0;">Business Name</td><td style="color:#fff;">${businessName}</td></tr>` : ''}
      ${sector ? `<tr><td style="color:#999;padding:6px 0;">Sector</td><td style="color:#fff;">${sector}</td></tr>` : ''}
      ${ageGroup ? `<tr><td style="color:#999;padding:6px 0;">Age Group</td><td style="color:#fff;">${ageGroup}</td></tr>` : ''}
      <tr><td style="color:#999;padding:6px 0;">Submitted</td><td style="color:#fff;">${new Date().toLocaleString('en-ZA')}</td></tr>
    </table>
    ${businessIdea ? `
    <div style="background:#1a1a1a;border-left:3px solid #FF9F00;padding:12px 16px;margin-bottom:16px;border-radius:0 6px 6px 0;">
      <p style="margin:0 0 4px;color:#FF9F00;font-size:11px;text-transform:uppercase;">Business Idea</p>
      <p style="margin:0;color:#ccc;font-size:13px;">${businessIdea}</p>
    </div>` : ''}
    <div style="margin-top:20px;padding:12px 16px;background:#1a1a1a;border-radius:6px;">
      <p style="margin:0;color:#999;font-size:12px;">Action required: Contact client within 1–2 business days.</p>
      <p style="margin:6px 0 0;font-size:13px;"><a href="mailto:${email}" style="color:#FF9F00;">Reply to ${name} →</a></p>
    </div>
  </div>
</div>`;

      const adminResult = await resend.emails.send({
        from: `Breed Industries <${COMPANY_EMAIL}>`,
        to: COMPANY_EMAIL,
        replyTo: email,
        subject: `🌱 Fresh Start Application — ${name} [${refNumber}]`,
        html: adminHtml,
      });

      if (adminResult.error) {
        console.error('Resend admin email error:', adminResult.error);
      } else {
        console.log('✅ Fresh Start admin notification sent:', adminResult.data?.id);
      }
    }

    return NextResponse.json(
      { success: true, refNumber, message: 'Application received. Check your email for your welcome pack.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Fresh Start submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process application. Please try again.' },
      { status: 500 }
    );
  }
}
