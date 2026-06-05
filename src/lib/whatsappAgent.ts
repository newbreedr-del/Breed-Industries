/**
 * Breed Industries — WhatsApp AI Agent
 *
 * Simple prompt-based AI assistant (no function calling for reliability).
 * Matches the working DOJA implementation pattern.
 */

import { chatCompletion, ChatMessage } from './openrouter';
import { sendText, formatPhone, notifyAdmin } from './whatsapp';

// ── Conversation memory (in-process, per phone) ───────────────────────────────

const conversationHistory = new Map<string, ChatMessage[]>();
const MAX_HISTORY = 20;

function getHistory(phone: string): ChatMessage[] {
  return conversationHistory.get(phone) ?? [];
}

function addToHistory(phone: string, messages: ChatMessage[]): void {
  const existing = conversationHistory.get(phone) ?? [];
  const updated = [...existing, ...messages].slice(-MAX_HISTORY);
  conversationHistory.set(phone, updated);
}

function clearHistory(phone: string): void {
  conversationHistory.delete(phone);
}

// ── Owner detection ───────────────────────────────────────────────────────────

export function isOwner(phone: string): boolean {
  const ownerRaw = process.env.WHATSAPP_OWNER_NUMBER ?? process.env.WHATSAPP_ADMIN_NUMBER ?? '27604964105';
  const ownerPhone = formatPhone(ownerRaw);
  return formatPhone(phone) === ownerPhone;
}

// ── System prompts ────────────────────────────────────────────────────────────

const OWNER_SYSTEM_PROMPT = `You are the Breed Industries AI Executive Assistant — a sharp, professional business assistant operating via WhatsApp.

You serve as the right hand of the business owner. Your job is to:
1. 📊 Give business insights when asked
2. ✅ Help with admin tasks via the admin dashboard
3. 🔔 Keep the owner informed of what's happening in the business
4. 🧭 Route and escalate anything you can't handle

Business context:
- Breed Industries is a South African professional services agency
- Services: company registration, CIPC filings, SARS compliance, tender applications, BEE certificates, website design, marketing
- Currency: South African Rand (ZAR). No VAT — not VAT registered
- All values in quotes/invoices are in Rands
- Tender system runs twice daily scraping 26+ SA government sources

Style rules:
- Professional business tone — concise, action-oriented
- Use these emojis appropriately: 📊 📋 ✅ ❌ 🔔 💼 💰 📞 🏢 🎯 📈 ⚡ 🔍 📌 ⏰ 🤝 📄 🚀
- Format lists clearly with line breaks
- Keep responses WhatsApp-friendly (no markdown headers, use *bold* for emphasis)

For data queries (quotes, invoices, clients, tenders), direct the owner to the admin dashboard at www.thebreed.co.za/admin
For actions like updating statuses or sending messages, direct to the admin dashboard

When the owner says "clear" or "reset", clear the conversation history.
When uncertain, ask a clarifying question rather than guessing.`;

const CLIENT_SYSTEM_PROMPT = `You are a professional business assistant for Breed Industries, responding via WhatsApp.

Breed Industries is a South African professional services agency offering:
• 🏢 Company Registration & CIPC Services
• 📋 SARS Tax Compliance & Returns
• 📄 BEE Certificates & Compliance
• 🎯 Tender Applications & Support
• 🌐 Website Design & Development
• 📈 Digital Marketing & Branding
• 💼 Business Consulting

Your role:
- Answer general questions about our services professionally
- Let clients know how to get in touch or request a quote
- For specific quotes, pricing, or account questions — ask them to contact us directly
- Keep responses friendly, brief, and professional

Contact details to share when relevant:
- WhatsApp: 060 496 4105
- Website: www.thebreed.co.za

Style: Professional, warm, South African business context. Use business emojis sparingly: 🤝 💼 📋 ✅ 🌐

NEVER promise specific pricing, timelines, or outcomes — direct those to the team.
NEVER discuss other clients or internal business details.
If a question is complex or sensitive, always say you'll pass it on to the team.`;

// ── Main agent entry point ────────────────────────────────────────────────────

export async function processMessage(
  phone: string,
  text: string,
  senderName: string,
): Promise<string> {
  const ownerMode = isOwner(phone);
  const systemPrompt = ownerMode ? OWNER_SYSTEM_PROMPT : CLIENT_SYSTEM_PROMPT;

  // Build messages array
  const history = getHistory(phone);
  const userMessage: ChatMessage = { role: 'user', content: text };
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    userMessage,
  ];

  const newMessages: ChatMessage[] = [userMessage];

  try {
    const response = await chatCompletion(messages, undefined, 400);
    const { message: assistantMsg } = response;

    const finalText = assistantMsg.content ?? '⚡ Sorry, I could not generate a response. Please try again.';
    
    newMessages.push(assistantMsg);
    addToHistory(phone, newMessages);
    
    return finalText;

  } catch (err: any) {
    console.error('[Agent] processMessage error:', err.message);

    // If owner, give a useful error; if client, give a generic reply
    if (ownerMode) {
      return `❌ *Agent Error*\n${err.message}\n\nCheck server logs or try again in a moment.`;
    }
    return `Thank you for your message! 🤝 Our team will get back to you shortly.\n\nFor immediate assistance: *060 496 4105* or visit *www.thebreed.co.za*\n\n_— Breed Industries_`;
  }
}

// ── Route unknown client messages to admin ────────────────────────────────────

export async function routeClientMessageToAdmin(
  phone: string,
  text: string,
  senderName: string,
): Promise<void> {
  const display = senderName || phone;
  await notifyAdmin(
    `💬 *Client Message — Action Needed*\n` +
    `👤 From: ${display}\n` +
    `📞 Number: ${phone}\n\n` +
    `"${text.slice(0, 300)}"\n\n` +
    `_Reply: SEND ${phone} <message>_`
  ).catch(() => {});
}
