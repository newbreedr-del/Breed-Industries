/**
 * Breed Industries — WhatsApp AI Agent
 *
 * AI-powered assistant with function calling for admin tasks.
 * Model: anthropic/claude-3-haiku (via OpenRouter)
 *
 * Owner number (WHATSAPP_OWNER_NUMBER) gets full admin access with all tools.
 * Clients get professional AI replies + silent admin notification.
 */

import { chatCompletion, ChatMessage, ToolDefinition, ToolCall } from './openrouter';
import { supabaseAdmin } from './supabase';
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
1. 📊 Give business insights — quotes, invoices, tenders, clients
2. ✅ Complete admin tasks — update statuses, trigger scrapes, send messages
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
- Always confirm actions taken
- Keep responses WhatsApp-friendly (no markdown headers, use *bold* for emphasis)
- If you cannot complete a task, explain why and suggest an alternative

When the owner says "clear" or "reset", call the clear_conversation tool.
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

// ── Tool definitions (owner only) ─────────────────────────────────────────────

const OWNER_TOOLS: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'get_dashboard_stats',
      description: 'Get a business overview: quote counts by status, invoice totals, tender matches, CRM lead counts',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_quotes',
      description: 'List recent quotes with their status, client name, and amount',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by status',
            enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
          },
          limit: { type: 'string', description: 'Number of results (default 10, max 20)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_quote_status',
      description: 'Update the status of a quote by its ID or quote number',
      parameters: {
        type: 'object',
        properties: {
          quote_id: { type: 'string', description: 'The quote UUID or quote number (e.g. QT-001)' },
          status: {
            type: 'string',
            description: 'New status',
            enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
          },
          notes: { type: 'string', description: 'Optional notes to add' },
        },
        required: ['quote_id', 'status'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_invoices',
      description: 'List recent invoices with payment status and amounts',
      parameters: {
        type: 'object',
        properties: {
          payment_status: {
            type: 'string',
            description: 'Filter by payment status',
            enum: ['unpaid', 'partial', 'paid', 'overdue'],
          },
          limit: { type: 'string', description: 'Number of results (default 10)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_crm_clients',
      description: 'List CRM clients with contact info',
      parameters: {
        type: 'object',
        properties: {
          search: { type: 'string', description: 'Search by name, email, or company' },
          limit: { type: 'string', description: 'Number of results (default 10)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_tender_clients',
      description: 'List companies registered for the tender intelligence service',
      parameters: {
        type: 'object',
        properties: {
          limit: { type: 'string', description: 'Number of results (default 10)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_recent_tenders',
      description: 'List recently scraped tenders from SA government sources',
      parameters: {
        type: 'object',
        properties: {
          limit: { type: 'string', description: 'Number of results (default 10)' },
          hours: { type: 'string', description: 'Tenders from the last N hours (default 24)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'run_tender_scrape',
      description: 'Trigger a tender scrape and match run immediately',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_client_whatsapp',
      description: 'Send a WhatsApp message to a client by phone number',
      parameters: {
        type: 'object',
        properties: {
          phone: { type: 'string', description: 'Phone number (e.g. 0821234567 or 27821234567)' },
          message: { type: 'string', description: 'Message to send' },
        },
        required: ['phone', 'message'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_crm_leads',
      description: 'List CRM leads (potential clients not yet converted)',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by status',
            enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
          },
          limit: { type: 'string', description: 'Number of results (default 10)' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'clear_conversation',
      description: "Clear this conversation's memory and start fresh",
      parameters: { type: 'object', properties: {} },
    },
  },
];

// ── Tool execution ────────────────────────────────────────────────────────────

async function executeTool(
  name: string,
  args: Record<string, string>,
  phone: string,
): Promise<string> {
  try {
    switch (name) {

      case 'get_dashboard_stats': {
        const [quotesRes, leadsRes, tenderClientsRes, tendersRes] = await Promise.allSettled([
          supabaseAdmin.from('quotes').select('status'),
          supabaseAdmin.from('crm_leads').select('id', { count: 'exact' }),
          supabaseAdmin.from('tender_clients').select('id', { count: 'exact' }),
          supabaseAdmin
            .from('tenders')
            .select('id', { count: 'exact' })
            .gte('scraped_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        ]);

        const quotes = quotesRes.status === 'fulfilled' ? (quotesRes.value.data ?? []) : [];
        const quotesByStatus: Record<string, number> = {};
        for (const q of quotes) {
          quotesByStatus[q.status] = (quotesByStatus[q.status] ?? 0) + 1;
        }

        return JSON.stringify({
          quotes: { total: quotes.length, byStatus: quotesByStatus },
          leads: { total: leadsRes.status === 'fulfilled' ? leadsRes.value.count ?? 0 : 'N/A' },
          tenderClients: {
            total: tenderClientsRes.status === 'fulfilled' ? tenderClientsRes.value.count ?? 0 : 'N/A',
          },
          tendersScrapedLast24h:
            tendersRes.status === 'fulfilled' ? tendersRes.value.count ?? 0 : 'N/A',
        });
      }

      case 'list_quotes': {
        const limit = Math.min(parseInt(args.limit ?? '10', 10), 20);
        let query = supabaseAdmin
          .from('quotes')
          .select('id, quote_number, customer_name, customer_email, total_amount, status, created_at')
          .order('created_at', { ascending: false })
          .limit(limit);
        if (args.status) query = query.eq('status', args.status);
        const { data, error } = await query;
        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ quotes: data ?? [], count: data?.length ?? 0 });
      }

      case 'update_quote_status': {
        const { quote_id, status, notes } = args;
        const isUuid = /^[0-9a-f-]{36}$/i.test(quote_id);
        const updateData: Record<string, unknown> = {
          status,
          updated_at: new Date().toISOString(),
        };
        if (notes) updateData.notes = notes;

        const { data, error } = isUuid
          ? await supabaseAdmin.from('quotes').update(updateData).eq('id', quote_id).select().single()
          : await supabaseAdmin.from('quotes').update(updateData).eq('quote_number', quote_id).select().single();

        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ success: true, quote: data });
      }

      case 'list_invoices': {
        const limit = Math.min(parseInt(args.limit ?? '10', 10), 20);
        let query = supabaseAdmin
          .from('invoices')
          .select('id, invoice_number, customer_name, total_amount, payment_status, status, due_date, created_at')
          .order('created_at', { ascending: false })
          .limit(limit);
        if (args.payment_status) query = query.eq('payment_status', args.payment_status);
        const { data, error } = await query;
        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ invoices: data ?? [], count: data?.length ?? 0 });
      }

      case 'list_crm_clients': {
        const limit = Math.min(parseInt(args.limit ?? '10', 10), 20);
        let query = supabaseAdmin
          .from('crm_clients')
          .select('id, company_name, contact_name, contact_email, contact_phone, status, created_at')
          .order('created_at', { ascending: false })
          .limit(limit);
        if (args.search) {
          query = query.or(
            `company_name.ilike.%${args.search}%,contact_name.ilike.%${args.search}%,contact_email.ilike.%${args.search}%`,
          );
        }
        const { data, error } = await query;
        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ clients: data ?? [], count: data?.length ?? 0 });
      }

      case 'list_tender_clients': {
        const limit = Math.min(parseInt(args.limit ?? '10', 10), 20);
        const { data, error } = await supabaseAdmin
          .from('tender_clients')
          .select('id, company_name, email, province, service_categories, cidb_grade, active')
          .order('company_name')
          .limit(limit);
        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ clients: data ?? [], count: data?.length ?? 0 });
      }

      case 'list_recent_tenders': {
        const limit = Math.min(parseInt(args.limit ?? '10', 10), 20);
        const hours = parseInt(args.hours ?? '24', 10);
        const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
        const { data, error } = await supabaseAdmin
          .from('tenders')
          .select('id, title, department, province, closing_date, source, scraped_at')
          .gte('scraped_at', since)
          .order('scraped_at', { ascending: false })
          .limit(limit);
        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ tenders: data ?? [], count: data?.length ?? 0, since });
      }

      case 'run_tender_scrape': {
        try {
          const { runTenderScrapeAndMatch } = await import('./tenderScraper');
          const result = await runTenderScrapeAndMatch();
          return JSON.stringify({ success: true, result });
        } catch (e: any) {
          return JSON.stringify({ error: `Scrape failed: ${e.message}` });
        }
      }

      case 'send_client_whatsapp': {
        const { phone: targetPhone, message } = args;
        if (!targetPhone || !message) return JSON.stringify({ error: 'phone and message are required' });
        const result = await sendText(targetPhone, message);
        return JSON.stringify(result);
      }

      case 'list_crm_leads': {
        const limit = Math.min(parseInt(args.limit ?? '10', 10), 20);
        let query = supabaseAdmin
          .from('crm_leads')
          .select('id, name, email, phone, company, source, status, created_at')
          .order('created_at', { ascending: false })
          .limit(limit);
        if (args.status) query = query.eq('status', args.status);
        const { data, error } = await query;
        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ leads: data ?? [], count: data?.length ?? 0 });
      }

      case 'clear_conversation': {
        clearHistory(phone);
        return JSON.stringify({ success: true });
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (err: any) {
    console.error(`[Agent] Tool ${name} error:`, err.message);
    return JSON.stringify({ error: err.message });
  }
}

// ── Main agent entry point ────────────────────────────────────────────────────

export async function processMessage(
  phone: string,
  text: string,
  senderName: string,
): Promise<string> {
  const ownerMode = isOwner(phone);
  const systemPrompt = ownerMode ? OWNER_SYSTEM_PROMPT : CLIENT_SYSTEM_PROMPT;
  const tools = ownerMode ? OWNER_TOOLS : undefined;

  const history = getHistory(phone);
  const userMessage: ChatMessage = { role: 'user', content: text };
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    userMessage,
  ];
  const newMessages: ChatMessage[] = [userMessage];

  try {
    const MAX_ITERATIONS = 5;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const response = await chatCompletion(messages, tools, 512);
      const { message: assistantMsg, toolCalls, finishReason } = response;

      messages.push(assistantMsg);
      newMessages.push(assistantMsg);

      // No tool calls — final answer
      if (!toolCalls || toolCalls.length === 0 || finishReason === 'stop') {
        const finalText =
          assistantMsg.content ??
          '⚡ Sorry, I could not generate a response. Please try again.';
        addToHistory(phone, newMessages);
        return finalText;
      }

      // Execute all tool calls (in parallel for speed)
      const toolResults = await Promise.all(
        toolCalls.map(async (tc: ToolCall) => {
          let parsedArgs: Record<string, string> = {};
          try { parsedArgs = JSON.parse(tc.function.arguments ?? '{}'); } catch { /* ignore */ }

          console.log(`[Agent] 🔧 ${tc.function.name}`, parsedArgs);
          const result = await executeTool(tc.function.name, parsedArgs, phone);
          console.log(`[Agent] ✅ ${tc.function.name}:`, result.slice(0, 200));

          return {
            role: 'tool' as const,
            content: result,
            tool_call_id: tc.id,
            name: tc.function.name,
          };
        }),
      );

      for (const tr of toolResults) {
        messages.push(tr);
        newMessages.push(tr);
      }
    }

    addToHistory(phone, newMessages);
    return '⚡ Task completed. Let me know if you need anything else.';

  } catch (err: any) {
    console.error('[Agent] processMessage error:', err.message);
    if (ownerMode) {
      return `❌ *Agent Error*\n${err.message}\n\nCheck server logs or try again.`;
    }
    return `Thank you for your message! 🤝 Our team will get back to you shortly.\n\nFor immediate assistance: *060 496 4105* or visit *www.thebreed.co.za*\n\n_— Breed Industries_`;
  }
}

// ── Route client messages to admin ───────────────────────────────────────────

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
    `_Reply: SEND ${phone} <message>_`,
  ).catch(() => {});
}
