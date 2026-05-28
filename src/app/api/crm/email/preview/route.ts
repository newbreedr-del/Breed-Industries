import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const BANKING = 'Standard Bank · The Breed Industries (PTY) LTD · Acc: 10268731932 · Branch: 051001 · SWIFT: SBZAZAJJ';

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

const TEMPLATES: Record<string, { subject: string; html: string }> = {
  event_thank_you: {
    subject: 'Thank you for attending — Breed Industries',
    html: baseHtml(`
      <h2>Thank you, <span class="highlight">Thokozani</span>!</h2>
      <p>It was great connecting with you at <span class="highlight">Breed Industries Business Meeting — Pinetown Civic Centre</span> on 27 May 2026.</p>
      <p>Breed Industries helps South African businesses grow through compliance, branding, digital presence, and government tender support. We would love to explore how we can help <span class="highlight">Inihadlh Insikaariz</span> thrive.</p>
      <p>Reply to this email or call us on <span class="highlight">+27 60 496 4105</span> to get started.</p>
    `),
  },
  welcome_client: {
    subject: 'Welcome to Breed Industries — Ellabody Treats',
    html: baseHtml(`
      <h2>Welcome aboard, <span class="highlight">Stella</span>!</h2>
      <p>We are thrilled to welcome <span class="highlight">Ellabody Treats</span> to the Breed Industries family.</p>
      <p>Your active services: <span class="highlight">Business Watch Monthly</span></p>
      <p>Your dedicated contact is <a href="mailto:info@thebreed.co.za">info@thebreed.co.za</a>. Do not hesitate to reach out at any time.</p>
    `),
  },
  payment_reminder: {
    subject: 'Payment reminder — Business Watch Monthly — Breed Industries',
    html: baseHtml(`
      <h2>Friendly payment reminder</h2>
      <p>Hi <span class="highlight">Stella</span>, this is a friendly reminder that your invoice for <span class="highlight">Business Watch Monthly</span> (R950.00) is due.</p>
      <p>Please make payment using the banking details below:</p>
      <div class="banking">${BANKING}</div>
      <p>Please use your company name as the payment reference. Contact us once payment has been made.</p>
    `),
  },
  document_renewal: {
    subject: 'Action required: CSD Registration renewal — Breed Industries',
    html: baseHtml(`
      <h2>Your <span class="highlight">CSD Registration</span> is due for renewal</h2>
      <p>Hi <span class="highlight">Mpilwenhle</span>, we want to alert you that your <span class="highlight">CSD Registration</span> is due for renewal on <span class="highlight">30 June 2026</span>.</p>
      <p>Letting this lapse could result in tender disqualification, compliance penalties, or loss of government supplier status.</p>
      <p>Reply to this email or call us on <span class="highlight">+27 60 496 4105</span> to start your renewal today.</p>
    `),
  },
  service_checkin: {
    subject: 'Monthly check-in — June 2026 — Breed Industries',
    html: baseHtml(`
      <h2>Your <span class="highlight">June 2026</span> check-in</h2>
      <p>Hi <span class="highlight">Khalid</span>, the team at Breed Industries is checking in for the month of <span class="highlight">June 2026</span>.</p>
      <p>Your current active services: <span class="highlight">Tender Apply Monthly</span></p>
      <p>Is there anything you need from us this month? We also assist with branding, compliance, digital presence, and tender submissions — reply or call us on <span class="highlight">+27 60 496 4105</span>.</p>
    `),
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || 'event_thank_you';
  const tpl = TEMPLATES[template] || TEMPLATES['event_thank_you'];
  return new NextResponse(tpl.html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
