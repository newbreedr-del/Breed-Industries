import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY || '');
const FROM_EMAIL = 'Breed Industries <info@thebreed.co.za>';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

function thankYouHtml(lead: any): string {
  const firstName = (lead.full_name || '').split(' ')[0] || 'there';
  const company = lead.company_name || '';
  const event = lead.source_event || 'our recent event';
  const eventDate = lead.event_date
    ? new Date(lead.event_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{font-family:Arial,sans-serif;background:#0B1118;color:#e2e8f0;margin:0;padding:0}
    .wrap{max-width:600px;margin:0 auto;padding:32px 24px}
    .logo{color:#FF9F00;font-size:22px;font-weight:700;letter-spacing:1px;margin-bottom:24px}
    .card{background:#131c27;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:28px;margin-bottom:20px}
    h2{color:#fff;margin-top:0}p{color:#94a3b8;line-height:1.6}
    .highlight{color:#FF9F00;font-weight:600}
    .footer{font-size:12px;color:#475569;margin-top:24px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px}
  </style></head><body><div class="wrap">
    <div class="logo">BREED INDUSTRIES</div>
    <div class="card">
      <h2>Thank you, ${firstName}!</h2>
      <p>It was great meeting you${eventDate ? ` at <span class="highlight">${event}</span> on ${eventDate}` : ` at <span class="highlight">${event}</span>`}.</p>
      <p>Breed Industries helps South African businesses grow through compliance, branding, digital presence, and government tender support. We would love to explore how we can help <span class="highlight">${company || 'your business'}</span>.</p>
      <p>Reply to this email or call us on <span class="highlight">+27 60 496 4105</span> to get started.</p>
    </div>
    <div class="footer">Breed Industries (PTY) LTD · info@thebreed.co.za · +27 60 496 4105</div>
  </div></body></html>`;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { event_name, template } = body;

    if (!event_name) {
      return NextResponse.json({ error: 'event_name is required' }, { status: 400 });
    }

    // Fetch all leads for this event where thank_you_sent = false
    const { data: leads, error: leadsError } = await supabaseAdmin
      .from('crm_leads')
      .select('*')
      .eq('source_event', event_name)
      .eq('thank_you_sent', false);

    if (leadsError) throw leadsError;
    if (!leads || leads.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0, recipients: [], message: 'No unsent leads found for this event' });
    }

    let sent = 0;
    let failed = 0;
    const recipients: string[] = [];

    for (const lead of leads) {
      if (!lead.email) {
        failed++;
        continue;
      }

      try {
        const { error: sendError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: lead.email,
          subject: 'Thank you for attending — Breed Industries',
          html: thankYouHtml(lead),
        });

        if (sendError) {
          failed++;
          await supabaseAdmin.from('crm_email_sends').insert([{
            recipient_type: 'lead',
            recipient_id: lead.id,
            recipient_email: lead.email,
            recipient_name: lead.full_name,
            template_type: template || 'event_thank_you',
            subject: 'Thank you for attending — Breed Industries',
            status: 'failed',
          }]);
        } else {
          sent++;
          recipients.push(lead.email);
          // Mark thank_you_sent
          await supabaseAdmin.from('crm_leads').update({ thank_you_sent: true }).eq('id', lead.id);
          await supabaseAdmin.from('crm_email_sends').insert([{
            recipient_type: 'lead',
            recipient_id: lead.id,
            recipient_email: lead.email,
            recipient_name: lead.full_name,
            template_type: template || 'event_thank_you',
            subject: 'Thank you for attending — Breed Industries',
            status: 'sent',
          }]);
        }
      } catch {
        failed++;
      }
    }

    return NextResponse.json({ sent, failed, recipients });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
