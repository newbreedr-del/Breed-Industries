/**
 * Breed Industries — WhatsApp Service (Evolution API)
 *
 * Uses Evolution API (self-hosted on Railway) for session-persistent WhatsApp
 * messaging via QR code scan — no Meta/Business API approval required.
 *
 * Session is stored in PostgreSQL so the container can restart without
 * requiring a re-scan. One scan = permanent connection.
 */

import { supabaseAdmin } from '@/lib/supabase';

// ── Config ───────────────────────────────────────────────────────────────────

function evoConfig() {
  const url = process.env.EVOLUTION_API_URL ?? '';
  const key = process.env.EVOLUTION_API_KEY ?? '';
  const instance = process.env.EVOLUTION_INSTANCE_NAME ?? 'breed-agent';
  return { url: url.startsWith('http') ? url : `https://${url}`, key, instance };
}

export function formatPhone(raw: string): string {
  let n = raw.replace(/\D/g, '');
  if (n.startsWith('0') && n.length === 10) n = '27' + n.slice(1);
  else if (n.length === 9 && !n.startsWith('27')) n = '27' + n;
  return n;
}

// ── Core send with retry ──────────────────────────────────────────────────────

interface SendResult { success: boolean; messageId?: string; error?: string }

export async function sendText(
  rawPhone: string,
  message: string,
  retries = 3,
): Promise<SendResult> {
  const { url, key, instance } = evoConfig();

  if (!url || !key) {
    console.warn('[WhatsApp] Evolution API not configured — skipping send');
    return { success: false, error: 'WhatsApp not configured (EVOLUTION_API_URL / EVOLUTION_API_KEY missing)' };
  }

  // Common misconfiguration: a URL pasted into the API key slot. The key must be
  // the Evolution AUTHENTICATION_API_KEY (a secret token), not a URL.
  if (/^https?:\/\//i.test(key)) {
    const msg = 'EVOLUTION_API_KEY is set to a URL, not an API key. Set it to your Evolution AUTHENTICATION_API_KEY (Railway → Evolution service → Variables).';
    console.error('[WhatsApp] ' + msg);
    return { success: false, error: msg };
  }

  const phone = formatPhone(rawPhone);
  let lastError = '';

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${url}/message/sendText/${instance}`, {
        method: 'POST',
        headers: { apikey: key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: phone, text: message }),
        signal: AbortSignal.timeout(30_000),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        await logMessage({ direction: 'outbound', phone, message, status: 'sent' });
        return { success: true, messageId: data.key?.id };
      }

      lastError = data?.message ?? `HTTP ${res.status}`;
      console.warn(`[WhatsApp] Attempt ${attempt} failed for ${phone}: ${lastError}`);
    } catch (err: any) {
      lastError = err.message ?? 'Network error';
      console.warn(`[WhatsApp] Attempt ${attempt} error: ${lastError}`);
    }

    if (attempt < retries) await sleep(1_000 * attempt);
  }

  await logMessage({ direction: 'outbound', phone, message, status: 'failed', error: lastError });
  return { success: false, error: lastError };
}

// ── Connection management ─────────────────────────────────────────────────────

export async function getConnectionState(): Promise<{
  state: 'open' | 'connecting' | 'close' | 'unknown';
  qrCode?: string;
  phone?: string;
}> {
  const { url, key, instance } = evoConfig();
  if (!url || !key) return { state: 'unknown' };

  try {
    const res = await fetch(`${url}/instance/connectionState/${instance}`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return { state: 'unknown' };
    const data = await res.json();
    const state = data?.instance?.state ?? data?.state ?? 'unknown';

    // Extract the connected phone number (owner) if available
    const rawOwner: string = data?.instance?.owner ?? data?.owner ?? '';
    const phone = rawOwner.replace('@s.whatsapp.net', '').replace('@c.us', '') || undefined;

    return { state, phone };
  } catch {
    return { state: 'unknown' };
  }
}

export async function getQRCode(): Promise<{ qrCode?: string; error?: string }> {
  const { url, key, instance } = evoConfig();
  if (!url || !key) return { error: 'Not configured' };

  try {
    // Step 1 — ensure the instance exists; create it if not
    const stateRes = await fetch(`${url}/instance/connectionState/${instance}`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(8_000),
    });

    if (stateRes.status === 404) {
      // Instance doesn't exist yet — create it
      console.log(`[WhatsApp] Instance "${instance}" not found — creating it`);
      const createRes = await fetch(`${url}/instance/create`, {
        method: 'POST',
        headers: { apikey: key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceName: instance,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        return { error: err?.message ?? `Failed to create instance (${createRes.status})` };
      }
    }

    // Step 2 — fetch QR code
    const res = await fetch(`${url}/instance/connect/${instance}`, {
      headers: { apikey: key },
      signal: AbortSignal.timeout(15_000),
    });
    const data = await res.json().catch(() => ({}));
    const base64 = data?.base64 ?? data?.qrcode?.base64 ?? data?.code;
    if (base64) return { qrCode: base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}` };
    return { error: data?.message ?? 'QR not available — try refreshing in a few seconds' };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function registerWebhook(): Promise<boolean> {
  const { url, key, instance } = evoConfig();
  const webhookUrl = process.env.EVOLUTION_WEBHOOK_URL ?? `${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/webhook`;

  try {
    const res = await fetch(`${url}/webhook/set/${instance}`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhook: {
          enabled: true,
          url: webhookUrl,
          events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE', 'QRCODE_UPDATED'],
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Notification helpers ──────────────────────────────────────────────────────

const ADMIN_PHONE = () => formatPhone(process.env.WHATSAPP_ADMIN_NUMBER ?? '');

export async function notifyAdmin(message: string): Promise<void> {
  const phone = ADMIN_PHONE();
  if (!phone) return;
  await sendText(phone, message).catch(err => console.error('[WhatsApp] Admin notify error:', err));
}

export async function notifyClient(rawPhone: string, message: string): Promise<void> {
  if (!rawPhone) return;
  await sendText(rawPhone, message).catch(err => console.error('[WhatsApp] Client notify error:', err));
}

// ── Pre-built notification templates ─────────────────────────────────────────

export const notify = {
  newLead: (name: string, source: string, email: string, phone?: string) =>
    notifyAdmin(
      `🔔 *New Lead*\nName: ${name}\nSource: ${source}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}`,
    ),

  newPayment: (name: string, amount: number, item: string, phone?: string) =>
    Promise.all([
      notifyAdmin(`💰 *Payment Received*\nFrom: ${name}\nItem: ${item}\nAmount: R${amount.toLocaleString('en-ZA')}`),
      phone ? notifyClient(phone, `Hi ${name}! ✅ We've received your payment of *R${amount.toLocaleString('en-ZA')}* for *${item}*.\n\nThank you! The Breed Industries team will be in touch shortly.\n\n_Breed Industries — 060 496 4105_`) : Promise.resolve(),
    ]),

  subscriptionStarted: (name: string, plan: string, amount: number, phone?: string) =>
    Promise.all([
      notifyAdmin(`✅ *New Subscription*\nClient: ${name}\nPlan: ${plan}\nR${amount.toLocaleString('en-ZA')}/month`),
      phone ? notifyClient(phone, `Hi ${name}! 🎉 Your *${plan}* subscription is now active.\n\nWelcome to Breed Industries! We'll be in touch within 5 business days to complete your onboarding.\n\nQuestions? Reply here or call 060 496 4105.\n\n_Breed Industries_`) : Promise.resolve(),
    ]),

  eventRegistration: (name: string, event: string, email: string) =>
    notifyAdmin(`📋 *Event Registration*\nName: ${name}\nEvent: ${event}\nEmail: ${email}`),

  complianceReminder: (clientName: string, phone: string, item: string, daysLeft: number) =>
    notifyClient(phone, `Hi ${clientName} 👋\n\nReminder: Your *${item}* is due for renewal in *${daysLeft} days*.\n\nReply YES or call 060 496 4105 and we'll handle the renewal for you.\n\n_Breed Industries Compliance Watch_`),

  adminReminder: (message: string) =>
    notifyAdmin(`📌 *Reminder*\n${message}`),

  invoiceSent: (clientName: string, phone: string, amount: number, invoiceNum: string) =>
    notifyClient(phone, `Hi ${clientName} 👋\n\nYour invoice *${invoiceNum}* for *R${amount.toLocaleString('en-ZA')}* has been sent to your email.\n\nPay securely online or via EFT:\nStandard Bank | The Breed Industries (PTY) LTD\nAcc: 10268731932\n\n_Reply if you have questions — Breed Industries_`),
};

// ── Message logging ───────────────────────────────────────────────────────────

interface LogEntry {
  direction: 'inbound' | 'outbound';
  phone: string;
  message: string;
  status: 'sent' | 'failed' | 'received';
  error?: string;
}

async function logMessage(entry: LogEntry): Promise<void> {
  try {
    await supabaseAdmin.from('whatsapp_messages').insert({
      direction: entry.direction,
      phone: entry.phone,
      message: entry.message.slice(0, 2000),
      status: entry.status,
      error: entry.error ?? null,
    });
  } catch {
    /* non-critical — don't throw */
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
