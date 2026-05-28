import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const BANKING_HTML = `
  <table style="width:100%;border-collapse:collapse;background:#161616;border-radius:8px;overflow:hidden;margin:16px 0;">
    <tr><td style="padding:8px 16px;color:#888;font-size:12px;width:40%;">Bank</td><td style="padding:8px 16px;color:#fff;font-size:12px;">Standard Bank</td></tr>
    <tr style="background:#1a1a1a;"><td style="padding:8px 16px;color:#888;font-size:12px;">Account Name</td><td style="padding:8px 16px;color:#fff;font-size:12px;">The Breed Industries (PTY) LTD</td></tr>
    <tr><td style="padding:8px 16px;color:#888;font-size:12px;">Account Number</td><td style="padding:8px 16px;color:#c8a96e;font-size:12px;font-weight:700;">10268731932</td></tr>
    <tr style="background:#1a1a1a;"><td style="padding:8px 16px;color:#888;font-size:12px;">Branch Code</td><td style="padding:8px 16px;color:#fff;font-size:12px;">051001</td></tr>
    <tr><td style="padding:8px 16px;color:#888;font-size:12px;">SWIFT</td><td style="padding:8px 16px;color:#fff;font-size:12px;">SBZAZAJJ</td></tr>
  </table>
  <p style="margin:8px 0 0;color:#c8a96e;font-size:12px;font-weight:700;">Use your company name as payment reference.</p>`;

const gold = '#c8a96e';
const body = (content: string) => `<p style="color:#ccc;font-size:14px;line-height:1.7;margin:0 0 16px;">${content}</p>`;
const highlight = (text: string) => `<strong style="color:${gold};">${text}</strong>`;
const cta = (label: string, href: string) =>
  `<div style="text-align:center;margin-top:24px;"><a href="${href}" style="display:inline-block;background:${gold};color:#111;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:900;font-size:14px;letter-spacing:0.5px;">${label}</a></div>`;

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

const TEMPLATES: Record<string, { subject: string; html: string }> = {
  event_thank_you: {
    subject: 'Thank you for attending - Breed Industries',
    html: emailShell(
      `<div style="background:linear-gradient(135deg,#c8a96e 0%,#9b6310 100%);padding:24px 28px;">
        <p style="margin:0 0 4px;color:#111;font-size:11px;font-weight:700;letter-spacing:2px;">THANK YOU FOR ATTENDING</p>
        <h1 style="margin:0;color:#111;font-size:22px;font-weight:900;line-height:1.3;">Great connecting with you, Thokozani!</h1>
        <p style="margin:8px 0 0;color:#333;font-size:13px;">Breed Industries Business Meeting - Pinetown Civic Centre &nbsp;|&nbsp; 27 May 2026</p>
      </div>`,
      `${body(`Hi ${highlight('Thokozani')}, it was a pleasure meeting you at ${highlight('Breed Industries Business Meeting - Pinetown Civic Centre')}.`)}
       ${body(`Breed Industries helps South African businesses grow through compliance, branding, digital presence, and government tender support. We would love to explore how we can help ${highlight('Inihadlh Insikaariz')} thrive.`)}
       ${cta('Get Started with Breed Industries', 'mailto:info@thebreed.co.za')}`
    ),
  },
  welcome_client: {
    subject: 'Welcome to Breed Industries - Ellabody Treats',
    html: emailShell(
      `<div style="background:linear-gradient(135deg,#c8a96e 0%,#9b6310 100%);padding:24px 28px;">
        <p style="margin:0 0 4px;color:#111;font-size:11px;font-weight:700;letter-spacing:2px;">WELCOME ABOARD</p>
        <h1 style="margin:0;color:#111;font-size:22px;font-weight:900;">Welcome to the Breed Industries family!</h1>
      </div>`,
      `${body(`Hi ${highlight('Stella')}, we are thrilled to welcome ${highlight('Ellabody Treats')} to the Breed Industries family.`)}
       <div style="background:#1a1a1a;border-left:3px solid ${gold};padding:14px 18px;border-radius:0 6px 6px 0;margin:16px 0 20px;">
         <p style="margin:0 0 4px;color:#fff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Active Services</p>
         <p style="margin:0;color:${gold};font-size:14px;">Business Watch Monthly</p>
       </div>
       ${body(`Your dedicated contact is <a href="mailto:info@thebreed.co.za" style="color:${gold};">info@thebreed.co.za</a>. Do not hesitate to reach out at any time.`)}
       ${cta('Contact Your Account Manager', 'mailto:info@thebreed.co.za')}`
    ),
  },
  payment_reminder: {
    subject: 'Payment reminder - Business Watch Monthly - Breed Industries',
    html: emailShell(
      `<div style="background:#1e1e1e;padding:24px 28px;border-bottom:1px solid #2a2218;">
        <p style="margin:0 0 4px;color:${gold};font-size:11px;font-weight:700;letter-spacing:2px;">PAYMENT REMINDER</p>
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:900;">Business Watch Monthly - R950.00</h1>
      </div>`,
      `${body(`Hi ${highlight('Stella')}, this is a friendly reminder that your invoice for ${highlight('Business Watch Monthly')} (R950.00) is due.`)}
       <p style="color:#fff;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:20px 0 8px;">Banking Details</p>
       ${BANKING_HTML}
       ${cta('Contact Us Once Paid', 'mailto:info@thebreed.co.za?subject=Payment confirmation - Business Watch Monthly')}`
    ),
  },
  document_renewal: {
    subject: 'Action required: CSD Registration renewal - Breed Industries',
    html: emailShell(
      `<div style="background:linear-gradient(135deg,#c8502a 0%,#8b2a0e 100%);padding:24px 28px;">
        <p style="margin:0 0 4px;color:#ffd0c0;font-size:11px;font-weight:700;letter-spacing:2px;">ACTION REQUIRED</p>
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:900;">CSD Registration Renewal</h1>
        <p style="margin:8px 0 0;color:#ffd0c0;font-size:13px;">Due: 30 June 2026</p>
      </div>`,
      `${body(`Hi ${highlight('Mpilwenhle')}, we want to alert you that your ${highlight('CSD Registration')} is due for renewal on ${highlight('30 June 2026')}.`)}
       <div style="background:#1a1a1a;border-left:3px solid #ff6b6b;padding:14px 18px;border-radius:0 6px 6px 0;margin:16px 0 20px;">
         <p style="margin:0;color:#ccc;font-size:13px;">Letting this lapse could result in tender disqualification, compliance penalties, or loss of government supplier status.</p>
       </div>
       ${cta('Start Your Renewal Today', 'mailto:info@thebreed.co.za?subject=Renewal request - CSD Registration')}`
    ),
  },
  service_checkin: {
    subject: 'Monthly check-in - June 2026 - Breed Industries',
    html: emailShell(
      `<div style="background:linear-gradient(135deg,#c8a96e 0%,#9b6310 100%);padding:24px 28px;">
        <p style="margin:0 0 4px;color:#111;font-size:11px;font-weight:700;letter-spacing:2px;">MONTHLY CHECK-IN</p>
        <h1 style="margin:0;color:#111;font-size:22px;font-weight:900;">June 2026</h1>
      </div>`,
      `${body(`Hi ${highlight('Khalid')}, the Breed Industries team is checking in for ${highlight('June 2026')}.`)}
       <div style="background:#1a1a1a;border-left:3px solid ${gold};padding:14px 18px;border-radius:0 6px 6px 0;margin:16px 0 20px;">
         <p style="margin:0 0 4px;color:#fff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Your Active Services</p>
         <p style="margin:0;color:${gold};font-size:14px;">Tender Apply Monthly</p>
       </div>
       ${body('Is there anything you need from us this month? We also assist with branding, compliance, digital presence, and tender submissions.')}
       ${cta('Reply to Our Team', 'mailto:info@thebreed.co.za')}`
    ),
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
