import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY || '');
const FROM_EMAIL = 'Breed Industries <info@thebreed.co.za>';
const BANKING_HTML = `
  <table style="width:100%;border-collapse:collapse;background:#161616;border-radius:8px;overflow:hidden;margin:16px 0;">
    <tr><td style="padding:8px 16px;color:#888;font-size:12px;width:40%;">Bank</td><td style="padding:8px 16px;color:#fff;font-size:12px;">Standard Bank</td></tr>
    <tr style="background:#1a1a1a;"><td style="padding:8px 16px;color:#888;font-size:12px;">Account Name</td><td style="padding:8px 16px;color:#fff;font-size:12px;">The Breed Industries (PTY) LTD</td></tr>
    <tr><td style="padding:8px 16px;color:#888;font-size:12px;">Account Number</td><td style="padding:8px 16px;color:#c8a96e;font-size:12px;font-weight:700;">10268731932</td></tr>
    <tr style="background:#1a1a1a;"><td style="padding:8px 16px;color:#888;font-size:12px;">Branch Code</td><td style="padding:8px 16px;color:#fff;font-size:12px;">051001</td></tr>
    <tr><td style="padding:8px 16px;color:#888;font-size:12px;">SWIFT</td><td style="padding:8px 16px;color:#fff;font-size:12px;">SBZAZAJJ</td></tr>
  </table>
  <p style="margin:8px 0 0;color:#c8a96e;font-size:12px;font-weight:700;">Use your company name as payment reference.</p>`;

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

function emailShell(headerHtml: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:620px;margin:32px auto;background:#111111;border-radius:12px;overflow:hidden;border:1px solid #2a2218;">
    <div style="background:#0f0f0f;padding:18px 28px;border-bottom:1px solid #2a2218;display:table;width:100%;box-sizing:border-box;">
      <div style="display:table-cell;vertical-align:middle;">
        <span style="font-size:20px;font-weight:900;color:#c8a96e;letter-spacing:4px;font-family:Arial,sans-serif;">BREED</span><span style="font-size:10px;font-weight:400;color:#888;letter-spacing:3px;margin-left:8px;font-family:Arial,sans-serif;">INDUSTRIES</span>
      </div>
      <div style="display:table-cell;vertical-align:middle;text-align:right;">
        <span style="font-size:10px;color:#555;letter-spacing:1px;">PREMIUM GROWTH AGENCY</span>
      </div>
    </div>
    ${headerHtml}
    <div style="padding:28px 32px;">${bodyHtml}</div>
    <div style="background:#0a0a0a;padding:20px 32px;border-top:1px solid #1e1e1e;text-align:center;">
      <p style="margin:0 0 6px;color:#444;font-size:11px;letter-spacing:0.5px;">Breed Industries (PTY) LTD &nbsp;|&nbsp; Premium Growth Agency &nbsp;|&nbsp; Durban, KZN</p>
      <p style="margin:0;font-size:11px;">
        <a href="https://www.thebreed.co.za" style="color:#c8a96e;text-decoration:none;">www.thebreed.co.za</a>
        &nbsp;&nbsp;
        <a href="mailto:info@thebreed.co.za" style="color:#c8a96e;text-decoration:none;">info@thebreed.co.za</a>
        &nbsp;&nbsp;
        <span style="color:#555;">+27 60 496 4105</span>
      </p>
    </div>
  </div>
</body></html>`;
}

function getTemplate(template: string, recipient: any, customMessage?: string): { subject: string; html: string } {
  const firstName = (recipient.contact_name || recipient.full_name || '').split(' ')[0] || 'there';
  const company = recipient.company_name || '';

  const gold = '#c8a96e';
  const body = (content: string) => `<p style="color:#ccc;font-size:14px;line-height:1.7;margin:0 0 16px;">${content}</p>`;
  const highlight = (text: string) => `<strong style="color:${gold};">${text}</strong>`;
  const cta = (label: string, href: string) =>
    `<div style="text-align:center;margin-top:24px;"><a href="${href}" style="display:inline-block;background:${gold};color:#111;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:900;font-size:14px;letter-spacing:0.5px;">${label}</a></div>`;

  switch (template) {
    case 'event_thank_you': {
      const event = recipient.source_event || 'our recent event';
      const eventDate = recipient.event_date ? new Date(recipient.event_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      return {
        subject: `Thank you for attending - Breed Industries`,
        html: emailShell(
          `<div style="background:linear-gradient(135deg,#c8a96e 0%,#9b6310 100%);padding:24px 28px;">
            <p style="margin:0 0 4px;color:#111;font-size:11px;font-weight:700;letter-spacing:2px;">THANK YOU FOR ATTENDING</p>
            <h1 style="margin:0;color:#111;font-size:22px;font-weight:900;line-height:1.3;">Great connecting with you${eventDate ? `, ${firstName}` : ''}!</h1>
            ${eventDate ? `<p style="margin:8px 0 0;color:#333;font-size:13px;">${event} &nbsp;|&nbsp; ${eventDate}</p>` : ''}
          </div>`,
          `${body(`Hi ${highlight(firstName)}, it was a pleasure meeting you${eventDate ? ` at ${highlight(event)}` : ''}.`)}
           ${body(`Breed Industries helps South African businesses grow through compliance, branding, digital presence, and government tender support. We would love to explore how we can help ${highlight(company || 'your business')} thrive.`)}
           ${customMessage ? body(customMessage) : ''}
           ${cta('Get Started with Breed Industries', 'mailto:info@thebreed.co.za?subject=Enquiry from ' + encodeURIComponent(company || firstName))}`
        ),
      };
    }

    case 'welcome_client': {
      const services = (recipient.services || []).filter((s: any) => s.status === 'Active').map((s: any) => s.service_name).join(', ') || 'your services';
      return {
        subject: `Welcome to Breed Industries - ${company}`,
        html: emailShell(
          `<div style="background:linear-gradient(135deg,#c8a96e 0%,#9b6310 100%);padding:24px 28px;">
            <p style="margin:0 0 4px;color:#111;font-size:11px;font-weight:700;letter-spacing:2px;">WELCOME ABOARD</p>
            <h1 style="margin:0;color:#111;font-size:22px;font-weight:900;">Welcome to the Breed Industries family!</h1>
          </div>`,
          `${body(`Hi ${highlight(firstName)}, we are thrilled to welcome ${highlight(company)} to the Breed Industries family.`)}
           <div style="background:#1a1a1a;border-left:3px solid ${gold};padding:14px 18px;border-radius:0 6px 6px 0;margin:16px 0 20px;">
             <p style="margin:0 0 4px;color:#fff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Active Services</p>
             <p style="margin:0;color:${gold};font-size:14px;">${services}</p>
           </div>
           ${customMessage ? body(customMessage) : ''}
           ${body(`Your dedicated contact is <a href="mailto:info@thebreed.co.za" style="color:${gold};">info@thebreed.co.za</a>. Do not hesitate to reach out at any time.`)}
           ${cta('Contact Your Account Manager', 'mailto:info@thebreed.co.za')}`
        ),
      };
    }

    case 'payment_reminder': {
      const serviceName = recipient.service_name || 'your service';
      const amount = recipient.amount_rands ? `R${Number(recipient.amount_rands).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : '';
      return {
        subject: `Payment reminder - ${serviceName} - Breed Industries`,
        html: emailShell(
          `<div style="background:#1e1e1e;padding:24px 28px;border-bottom:1px solid #2a2218;">
            <p style="margin:0 0 4px;color:${gold};font-size:11px;font-weight:700;letter-spacing:2px;">PAYMENT REMINDER</p>
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:900;">${serviceName}${amount ? ` - ${amount}` : ''}</h1>
          </div>`,
          `${body(`Hi ${highlight(firstName)}, this is a friendly reminder that your invoice for ${highlight(serviceName)}${amount ? ` (${amount})` : ''} is due.`)}
           ${customMessage ? body(customMessage) : ''}
           <p style="color:#fff;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:20px 0 8px;">Banking Details</p>
           ${BANKING_HTML}
           ${cta('Contact Us Once Paid', 'mailto:info@thebreed.co.za?subject=Payment confirmation - ' + encodeURIComponent(serviceName))}`
        ),
      };
    }

    case 'document_renewal': {
      const docType = recipient.service_name || 'your compliance document';
      const renewalDate = recipient.renewal_date ? new Date(recipient.renewal_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      return {
        subject: `Action required: ${docType} renewal - Breed Industries`,
        html: emailShell(
          `<div style="background:linear-gradient(135deg,#c8502a 0%,#8b2a0e 100%);padding:24px 28px;">
            <p style="margin:0 0 4px;color:#ffd0c0;font-size:11px;font-weight:700;letter-spacing:2px;">ACTION REQUIRED</p>
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:900;">${docType} Renewal</h1>
            ${renewalDate ? `<p style="margin:8px 0 0;color:#ffd0c0;font-size:13px;">Due: ${renewalDate}</p>` : ''}
          </div>`,
          `${body(`Hi ${highlight(firstName)}, we want to alert you that your ${highlight(docType)}${renewalDate ? ` is due for renewal on ${highlight(renewalDate)}` : ' needs to be renewed soon'}.`)}
           <div style="background:#1a1a1a;border-left:3px solid #ff6b6b;padding:14px 18px;border-radius:0 6px 6px 0;margin:16px 0 20px;">
             <p style="margin:0;color:#ccc;font-size:13px;">Letting this lapse could result in tender disqualification, compliance penalties, or loss of government supplier status.</p>
           </div>
           ${customMessage ? body(customMessage) : ''}
           ${cta('Start Your Renewal Today', 'mailto:info@thebreed.co.za?subject=Renewal request - ' + encodeURIComponent(docType))}`
        ),
      };
    }

    case 'service_checkin': {
      const month = new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
      const services = (recipient.services || []).filter((s: any) => s.status === 'Active').map((s: any) => s.service_name).join(', ') || 'your active services';
      return {
        subject: `Monthly check-in - ${month} - Breed Industries`,
        html: emailShell(
          `<div style="background:linear-gradient(135deg,#c8a96e 0%,#9b6310 100%);padding:24px 28px;">
            <p style="margin:0 0 4px;color:#111;font-size:11px;font-weight:700;letter-spacing:2px;">MONTHLY CHECK-IN</p>
            <h1 style="margin:0;color:#111;font-size:22px;font-weight:900;">${month}</h1>
          </div>`,
          `${body(`Hi ${highlight(firstName)}, the Breed Industries team is checking in for ${highlight(month)}.`)}
           <div style="background:#1a1a1a;border-left:3px solid ${gold};padding:14px 18px;border-radius:0 6px 6px 0;margin:16px 0 20px;">
             <p style="margin:0 0 4px;color:#fff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Your Active Services</p>
             <p style="margin:0;color:${gold};font-size:14px;">${services}</p>
           </div>
           ${customMessage ? body(customMessage) : ''}
           ${body('Is there anything you need from us this month? We also assist with branding, compliance, digital presence, and tender submissions.')}
           ${cta('Reply to Our Team', 'mailto:info@thebreed.co.za')}`
        ),
      };
    }

    default:
      return { subject: 'Message from Breed Industries', html: emailShell('', `<p style="color:#ccc;">${customMessage || ''}</p>`) };
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { template, recipient_type, recipient_id, custom_subject, custom_message } = body;

    if (!template || !recipient_type || !recipient_id) {
      return NextResponse.json({ error: 'template, recipient_type, and recipient_id are required' }, { status: 400 });
    }

    // Fetch recipient
    const table = recipient_type === 'lead' ? 'crm_leads' : 'crm_clients';
    const { data: recipientData, error: recipientError } = await supabaseAdmin
      .from(table)
      .select('*')
      .eq('id', recipient_id)
      .single();

    if (recipientError || !recipientData) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // If client, also fetch services
    let enrichedRecipient = { ...recipientData };
    if (recipient_type === 'client') {
      const { data: services } = await supabaseAdmin
        .from('crm_client_services')
        .select('*')
        .eq('client_id', recipient_id)
        .eq('status', 'Active');
      enrichedRecipient.services = services || [];
    }

    const recipientEmail = recipientData.contact_email || recipientData.email;
    const recipientName = recipientData.contact_name || recipientData.full_name;

    if (!recipientEmail) {
      return NextResponse.json({ error: 'Recipient has no email address' }, { status: 400 });
    }

    const { subject, html } = getTemplate(template, enrichedRecipient, custom_message);
    const finalSubject = custom_subject || subject;

    const { data: sendData, error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: finalSubject,
      html,
    });

    const sendStatus = sendError ? 'failed' : 'sent';

    // Log the send
    await supabaseAdmin.from('crm_email_sends').insert([{
      recipient_type,
      recipient_id,
      recipient_email: recipientEmail,
      recipient_name: recipientName,
      template_type: template,
      subject: finalSubject,
      status: sendStatus,
      resend_message_id: (sendData as any)?.id || null,
    }]);

    if (sendError) {
      return NextResponse.json({ error: sendError.message, status: 'failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message_id: (sendData as any)?.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
