/**
 * Breed Industries — Questionnaire Engine
 * ───────────────────────────────────────
 * Two halves:
 *   1. handleInbound(phone, text) — the state machine. Called from the WhatsApp
 *      webhook for every inbound message. If the sender is an active campaign
 *      participant, it captures their answer / advances them and returns
 *      { handled: true, reply }. The webhook sends the reply and SKIPS the AI
 *      agent. Otherwise returns { handled: false } and normal routing continues.
 *   2. dripCampaign / dripAllSending — the throttled outbound sender. Sends the
 *      consent-first invite to the next batch of queued contacts, with a delay
 *      between messages to protect the WhatsApp number.
 *
 * Compliance: every contact is consent-gated (must reply YES before any
 * questions) and STOP opts them out globally across all campaigns.
 */

import { sendText, formatPhone, notifyAdmin } from '@/lib/whatsapp';
import { supabaseAdmin } from '@/lib/supabase';
import {
  getCampaign,
  updateContact,
  findActiveContactByPhone,
  isGloballyOptedOut,
  addGlobalOptOut,
  getContacts,
  updateCampaign,
} from './store';
import { Campaign, CampaignContact, Question } from './types';

const STOP_WORDS = ['stop', 'unsubscribe', 'opt out', 'optout', 'cancel', 'no thanks', 'remove me'];
const YES_WORDS = ['yes', 'yeah', 'yep', 'y', 'sure', 'ok', 'okay', 'yebo', 'ja', 'start', 'continue'];
const NO_WORDS = ['no', 'nope', 'n', 'not now', 'later'];

const norm = (s: string) => s.trim().toLowerCase();
const isStop = (t: string) => STOP_WORDS.some((w) => norm(t) === w || norm(t).startsWith(w));
const isYes = (t: string) => YES_WORDS.includes(norm(t));
const isNo = (t: string) => NO_WORDS.includes(norm(t));

function questionText(q: Question, index: number, total: number): string {
  const counter = `*Q${index + 1}/${total}*`;
  if (q.type === 'choice' && q.options?.length) {
    const opts = q.options.map((o, i) => `${i + 1}. ${o}`).join('\n');
    return `${counter} ${q.prompt}\n\n${opts}\n\n_Reply with the number or the option._`;
  }
  if (q.type === 'yes_no') return `${counter} ${q.prompt}\n\n_Reply YES or NO._`;
  if (q.type === 'rating') return `${counter} ${q.prompt}\n\n_Reply with a number 1–5._`;
  return `${counter} ${q.prompt}`;
}

/** Interpret an answer against the question type. Returns null if invalid. */
function parseAnswer(q: Question, text: string): string | null {
  const t = text.trim();
  if (q.type === 'choice' && q.options?.length) {
    const n = parseInt(t, 10);
    if (!isNaN(n) && n >= 1 && n <= q.options.length) return q.options[n - 1];
    const match = q.options.find((o) => norm(o) === norm(t));
    return match ?? null;
  }
  if (q.type === 'yes_no') {
    if (isYes(t)) return 'Yes';
    if (isNo(t)) return 'No';
    return null;
  }
  if (q.type === 'number' || q.type === 'rating') {
    const n = Number(t.replace(/[^\d.]/g, ''));
    if (isNaN(n)) return null;
    if (q.type === 'rating' && (n < 1 || n > 5)) return null;
    return String(n);
  }
  return t.length ? t : null;
}

// ── Inbound state machine ─────────────────────────────────────────────────────

export interface InboundResult {
  handled: boolean;
  reply?: string;
}

export async function handleInbound(rawPhone: string, text: string): Promise<InboundResult> {
  const phone = formatPhone(rawPhone);

  const contact = await findActiveContactByPhone(phone);
  if (!contact) return { handled: false };

  const campaign = await getCampaign(contact.campaign_id);
  if (!campaign) return { handled: false };

  // STOP — opt out globally, end participation.
  if (isStop(text)) {
    await addGlobalOptOut(phone, `campaign:${campaign.id}`);
    await updateContact(contact.id, { status: 'opted_out', consent_status: 'opted_out' });
    return { handled: true, reply: 'You\'ve been unsubscribed and won\'t receive further messages. Thank you. — Breed Industries' };
  }

  // Consent gate: invited but not yet opted in.
  if (contact.consent_status === 'pending' && contact.status === 'invited') {
    if (isYes(text)) {
      await updateContact(contact.id, { consent_status: 'opted_in', status: 'in_progress', current_q: 0 });
      return { handled: true, reply: firstQuestionOrFinish(campaign, contact) };
    }
    if (isNo(text)) {
      await updateContact(contact.id, { status: 'opted_out', consent_status: 'opted_out' });
      return { handled: true, reply: 'No problem — we won\'t take up more of your time. Have a great day! — Breed Industries' };
    }
    // Unclear → re-prompt for consent.
    return { handled: true, reply: 'Reply *YES* to continue, or *STOP* to opt out. 🙏' };
  }

  // In progress: capture the answer to the current question.
  if (contact.status === 'in_progress') {
    const q = campaign.questions[contact.current_q];
    if (!q) {
      await finishContact(campaign, contact);
      return { handled: true, reply: campaign.outro_message };
    }

    const parsed = parseAnswer(q, text);
    if (parsed == null) {
      return { handled: true, reply: `Sorry, I didn\'t catch that.\n\n${questionText(q, contact.current_q, campaign.questions.length)}` };
    }

    const answers = { ...contact.answers, [q.key]: parsed };
    const nextIdx = contact.current_q + 1;

    if (nextIdx >= campaign.questions.length) {
      await updateContact(contact.id, { answers, current_q: nextIdx });
      await finishContact(campaign, { ...contact, answers });
      return { handled: true, reply: campaign.outro_message };
    }

    await updateContact(contact.id, { answers, current_q: nextIdx });
    return { handled: true, reply: questionText(campaign.questions[nextIdx], nextIdx, campaign.questions.length) };
  }

  return { handled: false };
}

function firstQuestionOrFinish(campaign: Campaign, contact: CampaignContact): string {
  if (campaign.questions.length === 0) {
    // No questions = pure marketing blast; treat consent as completion.
    finishContact(campaign, contact).catch(() => {});
    return campaign.outro_message;
  }
  return questionText(campaign.questions[0], 0, campaign.questions.length);
}

/** Mark complete, optionally create a CRM lead, and notify the owner. */
async function finishContact(campaign: Campaign, contact: CampaignContact): Promise<void> {
  let leadId: string | null = null;

  if (campaign.create_lead) {
    try {
      const summary = Object.entries(contact.answers)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' | ');
      const { data } = await supabaseAdmin
        .from('crm_leads')
        .insert({
          name: contact.name ?? 'WhatsApp respondent',
          phone: contact.phone,
          source: `Campaign: ${campaign.name}`,
          status: 'new',
        })
        .select('id')
        .single();
      leadId = data?.id ?? null;

      await notifyAdmin(
        `🎯 *New campaign lead*\nCampaign: ${campaign.name}\nName: ${contact.name ?? '—'}\nPhone: ${contact.phone}\n\n${summary || '(no answers)'}`,
      ).catch(() => {});
    } catch {
      /* lead creation is best-effort */
    }
  }

  await updateContact(contact.id, {
    status: 'completed',
    completed_at: new Date().toISOString(),
    lead_id: leadId,
  });
}

// ── Outbound drip sender ──────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface DripResult {
  campaignId: string;
  sent: number;
  failed: number;
  remaining: number;
}

/** Send the consent-first invite to the next batch of queued contacts. */
export async function dripCampaign(campaignId: string): Promise<DripResult> {
  const campaign = await getCampaign(campaignId);
  if (!campaign) throw new Error('Campaign not found');

  const all = await getContacts(campaignId, 100000);
  const queued = all.filter((c) => c.status === 'queued');
  const batch = queued.slice(0, campaign.batch_size);

  let sent = 0;
  let failed = 0;

  for (const c of batch) {
    if (await isGloballyOptedOut(c.phone)) {
      await updateContact(c.id, { status: 'opted_out', consent_status: 'opted_out' });
      continue;
    }
    const greeting = c.name ? `Hi ${c.name.split(' ')[0]} 👋\n\n` : 'Hi 👋\n\n';
    try {
      await sendText(c.phone, greeting + campaign.intro_message);
      await updateContact(c.id, { status: 'invited', last_sent_at: new Date().toISOString() });
      sent++;
    } catch {
      await updateContact(c.id, { status: 'failed' });
      failed++;
    }
    await sleep(1500); // throttle: ~1 msg / 1.5s to protect the number
  }

  const remaining = queued.length - batch.length;

  // Flip status as the campaign progresses.
  if (campaign.status === 'draft' || campaign.status === 'sending') {
    await updateCampaign(campaignId, {
      status: remaining > 0 ? 'sending' : 'active',
      started_at: campaign.started_at ?? new Date().toISOString(),
    });
  }

  return { campaignId, sent, failed, remaining };
}

/** Cron entry: drip every campaign that still has queued contacts. */
export async function dripAllSending(): Promise<DripResult[]> {
  const { data } = await supabaseAdmin
    .from('campaigns')
    .select('id')
    .in('status', ['sending', 'active']);
  const results: DripResult[] = [];
  for (const c of data ?? []) {
    try {
      results.push(await dripCampaign((c as any).id));
    } catch {
      /* skip failing campaign */
    }
  }
  return results;
}
