import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY || '');
const FROM_EMAIL = 'Breed Industries <info@thebreed.co.za>';
const BANKING = 'Standard Bank · The Breed Industries (PTY) LTD · Acc: 10268731932 · Branch: 051001 · SWIFT: SBZAZAJJ';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

function baseHtml(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{font-family:Arial,sans-serif;background:#0B1118;color:#e2e8f0;margin:0;padding:0}
    .wrap{max-width:600px;margin:0 auto;padding:32px 24px}
    .logo{color:#FF9F00;font-size:22px;font-weight:700;letter-spacing:1px;margin-bottom:24px}
    .card{background:#131c27;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:28px;margin-bottom:20px}
    h2{color:#fff;margin-top:0}p{color:#94a3b8;line-height:1.6}
    .highlight{color:#FF9F00;font-weight:600}
    .banking{background:#0B1118;border-left:3px solid #FF9F00;padding:12px 16px;margin:16px 0;font-size:13px;color:#cbd5e1}
    .footer{font-size:12px;color:#475569;margin-top:24px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px}
    a{color:#FF9F00}
  </style></head><body><div class="wrap">
    <div class="logo">BREED INDUSTRIES</div>
    <div class="card">${content}</div>
    <div class="footer">Breed Industries (PTY) LTD · info@thebreed.co.za · +27 60 496 4105</div>
  </div></body></html>`;
}

function getTemplate(template: string, recipient: any, customMessage?: string): { subject: string; html: string } {
  const firstName = (recipient.contact_name || recipient.full_name || '').split(' ')[0] || 'there';
  const company = recipient.company_name || '';

  switch (template) {
    case 'event_thank_you': {
      const event = recipient.source_event || 'our recent event';
      const eventDate = recipient.event_date ? new Date(recipient.event_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      return {
        subject: 'Thank you for attending — Breed Industries',
        html: baseHtml(`
          <h2>Thank you, ${firstName}!</h2>
          <p>It was great connecting with you${eventDate ? ` at <span class="highlight">${event}</span> on ${eventDate}` : ` at <span class="highlight">${event}</span>`}.</p>
          <p>Breed Industries helps South African businesses grow through compliance, branding, digital presence, and government tender support. We would love to explore how we can help <span class="highlight">${company || 'your business'}</span> thrive.</p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p>Reply to this email or call us on <span class="highlight">+27 60 496 4105</span> to get started.</p>
        `),
      };
    }

    case 'welcome_client': {
      const services = (recipient.services || []).filter((s: any) => s.status === 'Active').map((s: any) => s.service_name).join(', ') || 'your services';
      return {
        subject: `Welcome to Breed Industries — ${company}`,
        html: baseHtml(`
          <h2>Welcome aboard, ${firstName}!</h2>
          <p>We are thrilled to welcome <span class="highlight">${company}</span> to the Breed Industries family.</p>
          <p>Your active services: <span class="highlight">${services}</span></p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p>Your dedicated contact is <a href="mailto:info@thebreed.co.za">info@thebreed.co.za</a>. Do not hesitate to reach out at any time.</p>
        `),
      };
    }

    case 'payment_reminder': {
      const serviceName = recipient.service_name || 'your service';
      const amount = recipient.amount_rands ? `R${Number(recipient.amount_rands).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : '';
      return {
        subject: `Payment reminder — ${serviceName} — Breed Industries`,
        html: baseHtml(`
          <h2>Friendly payment reminder</h2>
          <p>Hi ${firstName}, this is a friendly reminder that your invoice for <span class="highlight">${serviceName}</span>${amount ? ` (${amount})` : ''} is due.</p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p>Please make payment using the banking details below:</p>
          <div class="banking">${BANKING}</div>
          <p>Please use your company name as the payment reference. Contact us once payment has been made.</p>
        `),
      };
    }

    case 'document_renewal': {
      const docType = recipient.service_name || 'your compliance document';
      const renewalDate = recipient.renewal_date ? new Date(recipient.renewal_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      return {
        subject: `Action required: ${docType} renewal — Breed Industries`,
        html: baseHtml(`
          <h2>Your ${docType} is due for renewal</h2>
          <p>Hi ${firstName}, we want to alert you that your <span class="highlight">${docType}</span>${renewalDate ? ` is due for renewal on <span class="highlight">${renewalDate}</span>` : ' needs to be renewed soon'}.</p>
          <p>Letting this lapse could result in tender disqualification, compliance penalties, or loss of government supplier status.</p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p>Reply to this email or call us on <span class="highlight">+27 60 496 4105</span> to start your renewal today.</p>
        `),
      };
    }

    case 'service_checkin': {
      const month = new Date().toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
      const services = (recipient.services || []).filter((s: any) => s.status === 'Active').map((s: any) => s.service_name).join(', ') || 'your active services';
      return {
        subject: `Monthly check-in — ${month} — Breed Industries`,
        html: baseHtml(`
          <h2>Your ${month} check-in</h2>
          <p>Hi ${firstName}, the team at Breed Industries is checking in for the month of <span class="highlight">${month}</span>.</p>
          <p>Your current active services: <span class="highlight">${services}</span></p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p>Is there anything you need from us this month? We also assist with branding, compliance, digital presence, and tender submissions — reply or call us on <span class="highlight">+27 60 496 4105</span>.</p>
        `),
      };
    }

    default:
      return { subject: 'Message from Breed Industries', html: baseHtml(`<p>${customMessage || ''}</p>`) };
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
