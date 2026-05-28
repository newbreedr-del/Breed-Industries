/**
 * Tender Email Notifications — using Resend (same as quote emails)
 *
 * Delivery model (no client portal):
 *   - Match alerts  → client.email (CC) + ADMIN_EMAIL (BCC)
 *   - Closing reminders → client.email (CC) + ADMIN_EMAIL (BCC)
 *   - Weekly digest → ADMIN_EMAIL only (internal ops summary)
 */

import { Resend } from 'resend';
import type { TenderClient, Tender } from '@/lib/tenderStorage';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const COMPANY_EMAIL  = process.env.COMPANY_EMAIL  ?? 'info@thebreed.co.za';
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? 'info@thebreed.co.za';
const CONTACT_PHONE  = process.env.CONTACT_PHONE  ?? '+27 60 496 4105';

function resend() {
  return new Resend(RESEND_API_KEY);
}

function fmtDate(iso?: string): string {
  if (!iso) return 'TBC';
  return new Date(iso).toLocaleDateString('en-ZA', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function daysLeft(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

// ─── Shared email shell ──────────────────────────────────────

function emailShell(headerHtml: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:620px;margin:32px auto;background:#111111;border-radius:12px;overflow:hidden;border:1px solid #2a2218;">

    <!-- Logo bar -->
    <div style="background:#0f0f0f;padding:18px 28px;border-bottom:1px solid #2a2218;display:table;width:100%;box-sizing:border-box;">
      <div style="display:table-cell;vertical-align:middle;">
        <span style="font-size:20px;font-weight:900;color:#c8a96e;letter-spacing:4px;font-family:Arial,sans-serif;">BREED</span><span style="font-size:10px;font-weight:400;color:#888;letter-spacing:3px;margin-left:8px;font-family:Arial,sans-serif;">INDUSTRIES</span>
      </div>
      <div style="display:table-cell;vertical-align:middle;text-align:right;">
        <span style="font-size:10px;color:#555;letter-spacing:1px;">PREMIUM GROWTH AGENCY</span>
      </div>
    </div>

    <!-- Coloured header -->
    ${headerHtml}

    <!-- Body -->
    <div style="padding:28px 32px;">
      ${bodyHtml}
    </div>

    <!-- Footer -->
    <div style="background:#0a0a0a;padding:20px 32px;border-top:1px solid #1e1e1e;text-align:center;">
      <p style="margin:0 0 6px;color:#444;font-size:11px;letter-spacing:0.5px;">Breed Industries (PTY) LTD &nbsp;|&nbsp; Premium Growth Agency &nbsp;|&nbsp; Durban, KZN</p>
      <p style="margin:0;font-size:11px;">
        <a href="https://www.thebreed.co.za" style="color:#c8a96e;text-decoration:none;">www.thebreed.co.za</a>
        &nbsp;&nbsp;
        <a href="mailto:${COMPANY_EMAIL}" style="color:#c8a96e;text-decoration:none;">${COMPANY_EMAIL}</a>
        &nbsp;&nbsp;
        <span style="color:#555;">${CONTACT_PHONE}</span>
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ─── Client-friendly match email ─────────────────────────────

function buildClientMatchHtml(
  client: TenderClient,
  tender: Tender,
  score: number,
  reasons: string[]
): string {
  const days = daysLeft(tender.closing_date);
  const urgentColour = days <= 7 ? '#ff6b6b' : '#c8a96e';

  const header = `
    <div style="background:linear-gradient(135deg,#c8a96e 0%,#9b6310 100%);padding:24px 28px;">
      <p style="margin:0 0 4px;color:#111;font-size:11px;font-weight:700;letter-spacing:2px;">TENDER WATCH ALERT</p>
      <h1 style="margin:0;color:#111;font-size:21px;font-weight:900;line-height:1.3;">
        We found a tender that matches your business
      </h1>
      <p style="margin:8px 0 0;color:#333;font-size:13px;">Match confidence: <strong>${score}/100</strong></p>
    </div>`;

  const body = `
    <p style="color:#ccc;margin:0 0 20px;font-size:14px;line-height:1.6;">
      Hi <strong style="color:#fff;">${client.name}</strong>, our tender tracking system
      has found a government tender that looks like a strong fit for
      <strong style="color:#fff;">${client.company_name}</strong>.
      We're already on it. Here are the details so you're in the loop.
    </p>

    <!-- Tender details card -->
    <table style="width:100%;border-collapse:collapse;background:#1a1a1a;border-radius:8px;overflow:hidden;margin-bottom:20px;">
      <tr style="background:#222;">
        <th colspan="2" style="padding:10px 16px;text-align:left;color:#c8a96e;font-size:11px;letter-spacing:1.5px;">TENDER DETAILS</th>
      </tr>
      <tr>
        <td style="padding:10px 16px;color:#777;font-size:13px;width:38%;">Reference</td>
        <td style="padding:10px 16px;color:#fff;font-size:13px;font-weight:700;">${tender.reference_number}</td>
      </tr>
      <tr style="background:#161616;">
        <td style="padding:10px 16px;color:#777;font-size:13px;">Tender Title</td>
        <td style="padding:10px 16px;color:#fff;font-size:13px;">${tender.title}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;color:#777;font-size:13px;">Department</td>
        <td style="padding:10px 16px;color:#fff;font-size:13px;">${tender.department ?? 'Government Department'}</td>
      </tr>
      <tr style="background:#161616;">
        <td style="padding:10px 16px;color:#777;font-size:13px;">Province</td>
        <td style="padding:10px 16px;color:#fff;font-size:13px;">${tender.province ?? 'National'}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;color:#777;font-size:13px;">Closing Date</td>
        <td style="padding:10px 16px;color:${urgentColour};font-size:13px;font-weight:700;">
          ${fmtDate(tender.closing_date)}<br/>
          <span style="font-size:11px;font-weight:400;opacity:0.75;">${days} day${days !== 1 ? 's' : ''} remaining</span>
        </td>
      </tr>
      ${tender.briefing_date ? `
      <tr style="background:#161616;">
        <td style="padding:10px 16px;color:#777;font-size:13px;">Briefing Date</td>
        <td style="padding:10px 16px;color:#fff;font-size:13px;">
          ${fmtDate(tender.briefing_date)}${tender.briefing_location ? '<br/><span style="font-size:11px;opacity:0.65;">' + tender.briefing_location + '</span>' : ''}
        </td>
      </tr>` : ''}
      ${tender.estimated_value ? `
      <tr>
        <td style="padding:10px 16px;color:#777;font-size:13px;">Est. Value</td>
        <td style="padding:10px 16px;color:#c8a96e;font-size:14px;font-weight:700;">
          R${(tender.estimated_value / 100).toLocaleString('en-ZA')}
        </td>
      </tr>` : ''}
    </table>

    <!-- Why it matched -->
    <div style="background:#1a1a1a;border-left:3px solid #c8a96e;padding:14px 18px;border-radius:0 6px 6px 0;margin-bottom:24px;">
      <p style="margin:0 0 10px;color:#fff;font-weight:700;font-size:13px;">Why this tender matches ${client.company_name}</p>
      ${reasons.map(r => `<p style="margin:0 0 5px;color:#aaa;font-size:13px;line-height:1.5;">✓ ${r}</p>`).join('')}
    </div>

    <!-- What happens next -->
    <div style="background:#111;border:1px solid #2a2a2a;border-radius:8px;padding:18px;margin-bottom:24px;">
      <p style="margin:0 0 10px;color:#c8a96e;font-weight:700;font-size:13px;letter-spacing:1px;">WHAT HAPPENS NEXT</p>
      <p style="margin:0 0 8px;color:#ccc;font-size:13px;line-height:1.6;">
        Based on your package, our team will be preparing the bid documents and handling the submission on your behalf.
        You don't need to do anything. We've got it covered.
      </p>
      <p style="margin:0;color:#ccc;font-size:13px;line-height:1.6;">
        If you have any supporting documents you'd like us to include, or if you have questions about this tender,
        reach out to us directly and we'll take care of it.
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:8px;">
      <a href="mailto:${COMPANY_EMAIL}?subject=Tender ${tender.reference_number} - ${client.company_name}"
         style="display:inline-block;background:#c8a96e;color:#111;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:900;font-size:14px;letter-spacing:0.5px;margin-bottom:12px;">
        Reply to Our Team →
      </a>
      <br/>
      <a href="tel:${CONTACT_PHONE.replace(/\s/g, '')}"
         style="color:#c8a96e;font-size:12px;text-decoration:none;">
        Or call us: ${CONTACT_PHONE}
      </a>
    </div>`;

  return emailShell(header, body);
}

// ─── Admin internal copy of match ────────────────────────────

function buildAdminMatchHtml(
  client: TenderClient,
  tender: Tender,
  score: number,
  reasons: string[]
): string {
  const days = daysLeft(tender.closing_date);

  const header = `
    <div style="background:#222;padding:20px 28px;border-bottom:1px solid #333;">
      <p style="margin:0 0 2px;color:#c8a96e;font-size:11px;font-weight:700;letter-spacing:2px;">INTERNAL / TENDER MATCH</p>
      <h2 style="margin:0;color:#fff;font-size:18px;">${client.company_name} · Score ${score}/100</h2>
    </div>`;

  const body = `
    <p style="color:#aaa;font-size:13px;margin:0 0 16px;">
      Client email sent to <strong style="color:#fff;">${client.email}</strong>.
      Reference: <strong style="color:#c8a96e;">${tender.reference_number}</strong> - closes in ${days} day${days !== 1 ? 's' : ''}.
    </p>
    <div style="background:#1a1a1a;border-left:3px solid #c8a96e;padding:12px 16px;border-radius:0 6px 6px 0;margin-bottom:20px;">
      ${reasons.map(r => `<p style="margin:0 0 4px;color:#999;font-size:12px;">• ${r}</p>`).join('')}
    </div>
    <a href="https://www.thebreed.co.za/admin/tenders"
       style="display:inline-block;background:#c8a96e;color:#111;padding:8px 18px;border-radius:5px;text-decoration:none;font-weight:700;font-size:12px;">
      Open Admin Dashboard →
    </a>`;

  return emailShell(header, body);
}

// ─── Public API: send match notification ─────────────────────

export async function sendTenderMatchEmail(
  client: TenderClient,
  tender: Tender,
  score: number,
  reasons: string[]
): Promise<void> {
  if (!RESEND_API_KEY) return;

  // Send client-friendly email directly to the client
  await resend().emails.send({
    from:    `Breed Industries Tender Watch <${COMPANY_EMAIL}>`,
    to:      client.email,
    replyTo: COMPANY_EMAIL,
    subject: `Tender Match Found for ${client.company_name} - ${tender.reference_number}`,
    html:    buildClientMatchHtml(client, tender, score, reasons),
  });

  // Separate internal copy to admin (different subject prefix for filtering)
  if (ADMIN_EMAIL && ADMIN_EMAIL !== client.email) {
    await resend().emails.send({
      from:    `Breed Tender Engine <${COMPANY_EMAIL}>`,
      to:      ADMIN_EMAIL,
      subject: `[INTERNAL] Tender Match [${score}/100] - ${client.company_name}: ${tender.reference_number}`,
      html:    buildAdminMatchHtml(client, tender, score, reasons),
    });
  }
}

// ─── Closing reminder ────────────────────────────────────────

export async function sendClosingReminderEmail(
  client: TenderClient,
  tender: Tender
): Promise<void> {
  if (!RESEND_API_KEY) return;
  const days = daysLeft(tender.closing_date);

  const clientHeader = `
    <div style="background:linear-gradient(135deg,#c8502a 0%,#8b2a0e 100%);padding:24px 28px;">
      <p style="margin:0 0 4px;color:#ffd0c0;font-size:11px;font-weight:700;letter-spacing:2px;">DEADLINE APPROACHING</p>
      <h1 style="margin:0;color:#fff;font-size:21px;font-weight:900;">
        ${days} Day${days !== 1 ? 's' : ''} Left to Submit
      </h1>
    </div>`;

  const clientBody = `
    <p style="color:#ccc;margin:0 0 20px;font-size:14px;line-height:1.6;">
      Hi <strong style="color:#fff;">${client.name}</strong>, this is a reminder that the tender
      <strong style="color:#fff;">${tender.reference_number}</strong> (${tender.title})
      closes on <strong style="color:#c8a96e;">${fmtDate(tender.closing_date)}</strong>.
    </p>
    <p style="color:#ccc;margin:0 0 20px;font-size:14px;line-height:1.6;">
      Our team is actively working on the submission for <strong style="color:#fff;">${client.company_name}</strong>.
      If you need to get anything to us urgently, please contact us now.
    </p>
    <div style="text-align:center;">
      <a href="mailto:${COMPANY_EMAIL}?subject=URGENT: Tender ${tender.reference_number}"
         style="display:inline-block;background:#c8a96e;color:#111;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:900;font-size:14px;margin-bottom:12px;">
        Contact Our Team Now →
      </a>
      <br/>
      <a href="tel:${CONTACT_PHONE.replace(/\s/g, '')}"
         style="color:#c8a96e;font-size:12px;text-decoration:none;">${CONTACT_PHONE}</a>
    </div>`;

  // Send to client
  await resend().emails.send({
    from:    `Breed Industries Tender Watch <${COMPANY_EMAIL}>`,
    to:      client.email,
    replyTo: COMPANY_EMAIL,
    subject: `${days} day${days !== 1 ? 's' : ''} left - ${tender.reference_number} (${client.company_name})`,
    html:    emailShell(clientHeader, clientBody),
  });

  // Admin copy
  if (ADMIN_EMAIL && ADMIN_EMAIL !== client.email) {
    const adminHeader = `
      <div style="background:#222;padding:20px 28px;border-bottom:1px solid #333;">
        <p style="margin:0 0 2px;color:#ff6b6b;font-size:11px;font-weight:700;letter-spacing:2px;">INTERNAL / CLOSING REMINDER</p>
        <h2 style="margin:0;color:#fff;font-size:18px;">${tender.reference_number} · ${days}d left · ${client.company_name}</h2>
      </div>`;
    const adminBody = `
      <p style="color:#aaa;font-size:13px;margin:0 0 16px;">
        Reminder sent to <strong style="color:#fff;">${client.email}</strong>.
      </p>
      ${tender.source_url ? `<a href="${tender.source_url}" style="color:#c8a96e;font-size:13px;">View on eTenders →</a>` : ''}
      <br/><br/>
      <a href="https://www.thebreed.co.za/admin/tenders"
         style="display:inline-block;background:#c8a96e;color:#111;padding:8px 18px;border-radius:5px;text-decoration:none;font-weight:700;font-size:12px;">
        Open Admin Dashboard →
      </a>`;
    await resend().emails.send({
      from:    `Breed Tender Engine <${COMPANY_EMAIL}>`,
      to:      ADMIN_EMAIL,
      subject: `[INTERNAL] ${days}d left - ${tender.reference_number} (${client.company_name})`,
      html:    emailShell(adminHeader, adminBody),
    });
  }
}

// ─── Weekly Digest (admin only — internal ops summary) ───────

export async function sendWeeklyDigestEmail(
  summary: {
    newTenders:      number;
    newMatches:      number;
    closingThisWeek: { tender: Tender; client: TenderClient }[];
  }
): Promise<void> {
  if (!RESEND_API_KEY) return;
  if (summary.newTenders === 0 && summary.newMatches === 0) return;

  const closingRows = summary.closingThisWeek
    .slice(0, 10)
    .map(({ tender, client }) => `
      <tr>
        <td style="padding:8px 12px;color:#ccc;font-size:12px;border-bottom:1px solid #222;">${tender.reference_number}</td>
        <td style="padding:8px 12px;color:#ccc;font-size:12px;border-bottom:1px solid #222;">${client.company_name}</td>
        <td style="padding:8px 12px;color:#c8a96e;font-size:12px;border-bottom:1px solid #222;">${fmtDate(tender.closing_date)}</td>
      </tr>`)
    .join('');

  const header = `
    <div style="background:linear-gradient(135deg,#c8a96e 0%,#9b6310 100%);padding:24px 28px;">
      <p style="margin:0 0 4px;color:#111;font-size:11px;font-weight:700;letter-spacing:2px;">INTERNAL / WEEKLY DIGEST</p>
      <h1 style="margin:0;color:#111;font-size:21px;font-weight:900;">Tender Engine Summary</h1>
      <p style="margin:6px 0 0;color:#333;font-size:13px;">${new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
    </div>`;

  const body = `
    <!-- Stats row -->
    <table style="width:100%;border-collapse:separate;border-spacing:8px;margin-bottom:24px;">
      <tr>
        <td style="background:#1a1a1a;border-radius:8px;padding:16px;text-align:center;">
          <p style="font-size:32px;font-weight:bold;color:#c8a96e;margin:0;">${summary.newTenders}</p>
          <p style="color:#888;font-size:12px;margin:4px 0 0;">New Tenders</p>
        </td>
        <td style="background:#1a1a1a;border-radius:8px;padding:16px;text-align:center;">
          <p style="font-size:32px;font-weight:bold;color:#c8a96e;margin:0;">${summary.newMatches}</p>
          <p style="color:#888;font-size:12px;margin:4px 0 0;">Clients Notified</p>
        </td>
        <td style="background:#1a1a1a;border-radius:8px;padding:16px;text-align:center;">
          <p style="font-size:32px;font-weight:bold;color:${summary.closingThisWeek.length > 0 ? '#ff6b6b' : '#c8a96e'};margin:0;">${summary.closingThisWeek.length}</p>
          <p style="color:#888;font-size:12px;margin:4px 0 0;">Closing This Week</p>
        </td>
      </tr>
    </table>

    ${closingRows ? `
    <h3 style="color:#fff;font-size:14px;margin:0 0 12px;letter-spacing:0.5px;">Deadlines This Week</h3>
    <table style="width:100%;border-collapse:collapse;background:#1a1a1a;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <thead>
        <tr style="background:#222;">
          <th style="padding:8px 12px;text-align:left;color:#c8a96e;font-size:11px;letter-spacing:1px;">REF</th>
          <th style="padding:8px 12px;text-align:left;color:#c8a96e;font-size:11px;letter-spacing:1px;">CLIENT</th>
          <th style="padding:8px 12px;text-align:left;color:#c8a96e;font-size:11px;letter-spacing:1px;">CLOSES</th>
        </tr>
      </thead>
      <tbody>${closingRows}</tbody>
    </table>` : ''}

    <a href="https://www.thebreed.co.za/admin/tenders"
       style="display:inline-block;background:#c8a96e;color:#111;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:900;font-size:14px;">
      Open Tender Dashboard →
    </a>`;

  await resend().emails.send({
    from:    `Breed Tender Engine <${COMPANY_EMAIL}>`,
    to:      ADMIN_EMAIL,
    subject: `Weekly Tender Digest - ${summary.newMatches} clients notified - ${summary.closingThisWeek.length} closing`,
    html:    emailShell(header, body),
  });
}
