/**
 * Breed Industries — Commitment Follow-up Engine
 * ──────────────────────────────────────────────
 * This is the part that solves "clients don't follow up". Run daily, it:
 *   1. Flags anything overdue.
 *   2. Decides which commitments are due for a nudge today (based on each
 *      commitment's reminder_offsets, e.g. 7/3/1/0 days before due, plus a
 *      steady drumbeat once overdue).
 *   3. Sends the client a WhatsApp and/or email reminder.
 *   4. Sends YOU a single owner digest: what's overdue, due today, due soon.
 *
 * De-duplication: a commitment is nudged at most once per calendar day
 * (tracked via last_reminded_at), so re-running the engine is safe.
 */

import { Resend } from 'resend';
import { listCommitments, updateCommitment, logReminder } from './store';
import { Commitment, daysUntil } from './types';
import { sendText } from '@/lib/whatsapp';

const COMPANY_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'info@thebreed.co.za';
const CONTACT_PHONE = process.env.CONTACT_PHONE ?? '060 496 4105';
const OWNER_WA = process.env.WHATSAPP_OWNER_NUMBER ?? process.env.WHATSAPP_ADMIN_NUMBER ?? '';

function resend() {
  return new Resend(process.env.RESEND_API_KEY ?? '');
}

function isSameDay(iso: string | null): boolean {
  if (!iso) return false;
  const a = new Date(iso);
  const b = new Date();
  return a.toDateString() === b.toDateString();
}

function fmtDate(iso: string | null): string {
  if (!iso) return 'TBC';
  return new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Should this commitment be nudged today? */
function isDueForReminder(c: Commitment): boolean {
  if (!c.notify_client || !c.due_date) return false;
  if (isSameDay(c.last_reminded_at)) return false; // already nudged today
  const d = daysUntil(c.due_date);
  if (d == null) return false;
  if (d < 0) return true;                          // overdue → keep chasing
  return c.reminder_offsets.includes(d);           // hits a configured offset
}

// ── Client-facing message copy ──────────────────────────────────────────────────

function clientMessage(c: Commitment): string {
  const d = daysUntil(c.due_date);
  const when =
    d == null ? '' :
    d < 0 ? `*${Math.abs(d)} day(s) overdue* (was due ${fmtDate(c.due_date)})` :
    d === 0 ? `*due today* (${fmtDate(c.due_date)})` :
    `due in *${d} day(s)* — ${fmtDate(c.due_date)}`;

  const name = c.client_name ? ` ${c.client_name.split(' ')[0]}` : '';
  const checklist =
    c.checklist?.length
      ? '\n\nOutstanding:\n' + c.checklist.filter((i) => !i.done).map((i) => `• ${i.label}`).join('\n')
      : '';

  const lead =
    c.type === 'event_training'
      ? `📅 *Reminder: ${c.title}*`
      : c.type === 'document'
        ? `📄 *We still need: ${c.title}*`
        : c.type === 'operations'
          ? `✅ *Operations reminder: ${c.title}*`
          : `🔔 *Reminder: ${c.title}*`;

  return (
    `Hi${name} 👋\n\n${lead}\n${when}` +
    (c.description ? `\n\n${c.description}` : '') +
    checklist +
    `\n\nReply here or call us on *${CONTACT_PHONE}* if you need a hand.\n\n_— Breed Industries_`
  );
}

function clientEmailHtml(c: Commitment): string {
  const d = daysUntil(c.due_date);
  const status =
    d == null ? '' :
    d < 0 ? `<span style="color:#e5484d;font-weight:700;">${Math.abs(d)} day(s) overdue</span>` :
    d === 0 ? `<span style="color:#FF9F00;font-weight:700;">Due today</span>` :
    `Due in <strong>${d} day(s)</strong> (${fmtDate(c.due_date)})`;

  const checklist =
    c.checklist?.filter((i) => !i.done).length
      ? `<p style="margin:16px 0 6px;color:#888;font-size:13px;">Outstanding items:</p><ul style="margin:0;padding-left:18px;color:#ccc;">${c.checklist.filter((i) => !i.done).map((i) => `<li>${i.label}</li>`).join('')}</ul>`
      : '';

  return `<!DOCTYPE html><html><body style="margin:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:28px auto;background:#111;border:1px solid #2a2218;border-radius:12px;overflow:hidden;">
    <div style="padding:16px 26px;border-bottom:1px solid #2a2218;">
      <span style="font-size:18px;font-weight:900;color:#c8a96e;letter-spacing:3px;">BREED</span>
      <span style="font-size:10px;color:#888;letter-spacing:2px;margin-left:6px;">INDUSTRIES</span>
    </div>
    <div style="padding:26px;color:#eee;">
      <h2 style="margin:0 0 6px;font-size:18px;color:#fff;">${c.title}</h2>
      <p style="margin:0 0 14px;font-size:14px;">${status}</p>
      ${c.description ? `<p style="color:#ccc;font-size:14px;line-height:1.6;">${c.description}</p>` : ''}
      ${checklist}
      <p style="margin-top:22px;color:#aaa;font-size:13px;">Reply to this email or call us on ${CONTACT_PHONE} and we'll help you get it done.</p>
    </div>
    <div style="padding:14px 26px;border-top:1px solid #2a2218;color:#555;font-size:11px;">Breed Industries · thebreed.co.za</div>
  </div></body></html>`;
}

// ── Engine ───────────────────────────────────────────────────────────────────

export interface FollowupResult {
  scanned: number;
  markedOverdue: number;
  remindersSent: number;
  whatsappSent: number;
  emailsSent: number;
  failures: number;
  digestSent: boolean;
}

export async function runCommitmentFollowups(opts: { sendDigest?: boolean } = {}): Promise<FollowupResult> {
  const all = await listCommitments({ status: 'active', limit: 1000 });
  const res: FollowupResult = {
    scanned: all.length, markedOverdue: 0, remindersSent: 0,
    whatsappSent: 0, emailsSent: 0, failures: 0, digestSent: false,
  };

  for (const c of all) {
    const d = daysUntil(c.due_date);

    // 1. Flag overdue
    if (d != null && d < 0 && c.status !== 'overdue') {
      await updateCommitment(c.id, { status: 'overdue' });
      c.status = 'overdue';
      res.markedOverdue++;
    }

    // 2. Nudge if due
    if (!isDueForReminder(c)) continue;

    let nudged = false;

    if (c.notify_channels.includes('whatsapp') && c.client_phone) {
      try {
        await sendText(c.client_phone, clientMessage(c));
        await logReminder(c.id, 'whatsapp', c.client_phone, 'sent');
        res.whatsappSent++; nudged = true;
      } catch (e: any) {
        await logReminder(c.id, 'whatsapp', c.client_phone, 'failed', e?.message);
        res.failures++;
      }
    }

    if (c.notify_channels.includes('email') && c.client_email) {
      try {
        await resend().emails.send({
          from: `Breed Industries <${COMPANY_EMAIL}>`,
          to: c.client_email,
          subject: `Reminder: ${c.title}`,
          html: clientEmailHtml(c),
        });
        await logReminder(c.id, 'email', c.client_email, 'sent');
        res.emailsSent++; nudged = true;
      } catch (e: any) {
        await logReminder(c.id, 'email', c.client_email, 'failed', e?.message);
        res.failures++;
      }
    }

    if (nudged) {
      res.remindersSent++;
      await updateCommitment(c.id, {
        last_reminded_at: new Date().toISOString(),
        reminder_count: (c.reminder_count ?? 0) + 1,
      });
    }
  }

  // 3. Owner digest
  if (opts.sendDigest !== false) {
    try {
      await sendOwnerDigest(all);
      res.digestSent = true;
    } catch {
      /* digest is best-effort */
    }
  }

  return res;
}

/** Build a "who's behind" summary and send it to the owner (email + WhatsApp). */
export async function sendOwnerDigest(active?: Commitment[]): Promise<void> {
  const list = active ?? (await listCommitments({ status: 'active', limit: 1000 }));

  const overdue = list.filter((c) => { const d = daysUntil(c.due_date); return d != null && d < 0; });
  const today   = list.filter((c) => daysUntil(c.due_date) === 0);
  const soon    = list.filter((c) => { const d = daysUntil(c.due_date); return d != null && d > 0 && d <= 7; });

  const line = (c: Commitment) =>
    `• ${c.client_name ?? 'Client'} — ${c.title} (${fmtDate(c.due_date)})`;

  const text =
    `📋 *Breed Daily Tracker*\n\n` +
    `🔴 Overdue: ${overdue.length}\n🟠 Due today: ${today.length}\n🟡 Next 7 days: ${soon.length}\n` +
    (overdue.length ? `\n*Overdue:*\n${overdue.slice(0, 15).map(line).join('\n')}` : '') +
    (today.length ? `\n\n*Due today:*\n${today.slice(0, 15).map(line).join('\n')}` : '');

  if (OWNER_WA) {
    await sendText(OWNER_WA, text).catch(() => {});
  }

  const section = (title: string, items: Commitment[], color: string) =>
    items.length
      ? `<h3 style="color:${color};font-size:14px;margin:18px 0 6px;">${title} (${items.length})</h3>` +
        `<ul style="margin:0;padding-left:18px;color:#ddd;font-size:13px;">${items.slice(0, 30).map((c) => `<li>${c.client_name ?? 'Client'} — ${c.title} <span style="color:#888;">(${fmtDate(c.due_date)})</span></li>`).join('')}</ul>`
      : '';

  await resend().emails.send({
    from: `Breed Tracker <${COMPANY_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `Daily Tracker — ${overdue.length} overdue, ${today.length} due today`,
    html: `<!DOCTYPE html><html><body style="background:#0a0a0a;font-family:Arial,sans-serif;padding:20px;">
      <div style="max-width:620px;margin:auto;background:#111;border:1px solid #2a2218;border-radius:12px;padding:24px;">
        <h2 style="color:#fff;margin:0 0 4px;">Daily Client Tracker</h2>
        <p style="color:#888;font-size:12px;margin:0;">${new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
        ${section('🔴 Overdue', overdue, '#e5484d')}
        ${section('🟠 Due today', today, '#FF9F00')}
        ${section('🟡 Next 7 days', soon, '#c8a96e')}
        ${!overdue.length && !today.length && !soon.length ? '<p style="color:#4caf50;margin-top:16px;">✅ Nothing outstanding. All clear.</p>' : ''}
      </div></body></html>`,
  });
}
