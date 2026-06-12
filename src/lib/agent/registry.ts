/**
 * Breed Industries — Unified Agent Tool Registry
 * ──────────────────────────────────────────────
 * The single source of truth for everything the "super agent" can do.
 *
 * Every capability is defined ONCE here as an AgentTool: its name, what it does,
 * its parameters, a permission level, and a handler that calls your real code.
 *
 * The same registry powers:
 *   - the ⌘K command bar in the admin panel  (src/components/agent/CommandBar.tsx)
 *   - the WhatsApp owner agent                (can be migrated to use this)
 *   - scheduled "do this every morning" tasks (call runAgent server-side)
 *
 * Permission levels:
 *   'read'      → safe, no side effects. Runs immediately.
 *   'write'     → mutates a record. Requires confirmation in the UI.
 *   'sensitive' → money or outbound messages. Requires confirmation, always.
 *
 * Add a new capability by appending one object to AGENT_TOOLS. No other file
 * needs to change for the agent to learn the new skill.
 */

import { supabaseAdmin } from '@/lib/supabase';
import type { ToolDefinition } from '@/lib/openrouter';
import {
  listCommitments,
  createCommitment,
  completeCommitment,
  updateCommitment,
} from '@/lib/commitments/store';
import { daysUntil } from '@/lib/commitments/types';

export type Permission = 'read' | 'write' | 'sensitive';

export interface AgentTool {
  name: string;
  description: string;
  permission: Permission;
  parameters: ToolDefinition['function']['parameters'];
  /** Returns any JSON-serialisable value; it is fed back to the model. */
  handler: (args: Record<string, any>) => Promise<unknown>;
}

const limit = (v: any, def = 10, max = 25) =>
  Math.min(Math.max(parseInt(String(v ?? def), 10) || def, 1), max);

const isUuid = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

// ── The registry ───────────────────────────────────────────────────────────────

export const AGENT_TOOLS: AgentTool[] = [
  // ───────────────────────── READ ─────────────────────────
  {
    name: 'get_business_snapshot',
    description:
      'A one-shot overview of the business: quote counts by status, unpaid vs paid invoice totals (Rands), CRM lead count, active tender clients, and tenders scraped in the last 24h. Use this for "how are we doing", "give me the numbers", morning briefings.',
    permission: 'read',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      const [quotesR, invoicesR, leadsR, tenderClientsR, tendersR] = await Promise.allSettled([
        supabaseAdmin.from('quotes').select('status, total_amount'),
        supabaseAdmin.from('invoices').select('payment_status, total_amount, paid_amount'),
        supabaseAdmin.from('crm_leads').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('tender_clients').select('id', { count: 'exact', head: true }).eq('active', true),
        supabaseAdmin
          .from('tenders')
          .select('id', { count: 'exact', head: true })
          .gte('scraped_at', new Date(Date.now() - 86_400_000).toISOString()),
      ]);

      const quotes = quotesR.status === 'fulfilled' ? quotesR.value.data ?? [] : [];
      const quotesByStatus: Record<string, number> = {};
      for (const q of quotes) quotesByStatus[q.status] = (quotesByStatus[q.status] ?? 0) + 1;

      const invoices = invoicesR.status === 'fulfilled' ? invoicesR.value.data ?? [] : [];
      let outstanding = 0;
      let collected = 0;
      for (const inv of invoices) {
        const total = Number(inv.total_amount) || 0;
        const paid = Number(inv.paid_amount) || 0;
        collected += paid;
        if (inv.payment_status !== 'paid') outstanding += total - paid;
      }

      return {
        quotes: { total: quotes.length, byStatus: quotesByStatus },
        invoices: {
          count: invoices.length,
          outstanding_rands: Math.round(outstanding),
          collected_rands: Math.round(collected),
        },
        crm_leads: leadsR.status === 'fulfilled' ? leadsR.value.count ?? 0 : 'N/A',
        active_tender_clients: tenderClientsR.status === 'fulfilled' ? tenderClientsR.value.count ?? 0 : 'N/A',
        tenders_last_24h: tendersR.status === 'fulfilled' ? tendersR.value.count ?? 0 : 'N/A',
      };
    },
  },
  {
    name: 'list_quotes',
    description: 'List recent quotes with status, client, and amount. Optionally filter by status.',
    permission: 'read',
    parameters: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Filter by status', enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'] },
        limit: { type: 'string', description: 'Max results (default 10)' },
      },
    },
    handler: async (a) => {
      let q = supabaseAdmin
        .from('quotes')
        .select('id, quote_number, customer_name, customer_email, total_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(limit(a.limit));
      if (a.status) q = q.eq('status', a.status);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return { quotes: data ?? [], count: data?.length ?? 0 };
    },
  },
  {
    name: 'list_invoices',
    description: 'List recent invoices with payment status and amounts. Optionally filter by payment status.',
    permission: 'read',
    parameters: {
      type: 'object',
      properties: {
        payment_status: { type: 'string', description: 'Filter', enum: ['unpaid', 'partial', 'paid', 'overdue'] },
        limit: { type: 'string', description: 'Max results (default 10)' },
      },
    },
    handler: async (a) => {
      let q = supabaseAdmin
        .from('invoices')
        .select('id, invoice_number, customer_name, total_amount, paid_amount, payment_status, status, due_date, created_at')
        .order('created_at', { ascending: false })
        .limit(limit(a.limit));
      if (a.payment_status) q = q.eq('payment_status', a.payment_status);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return { invoices: data ?? [], count: data?.length ?? 0 };
    },
  },
  {
    name: 'search_crm',
    description: 'Search CRM clients by name, company, or email. Returns contact details and status.',
    permission: 'read',
    parameters: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Name, company, or email fragment' },
        limit: { type: 'string', description: 'Max results (default 10)' },
      },
    },
    handler: async (a) => {
      let q = supabaseAdmin
        .from('crm_clients')
        .select('id, company_name, contact_name, contact_email, contact_phone, status, created_at')
        .order('created_at', { ascending: false })
        .limit(limit(a.limit));
      if (a.search)
        q = q.or(
          `company_name.ilike.%${a.search}%,contact_name.ilike.%${a.search}%,contact_email.ilike.%${a.search}%`,
        );
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return { clients: data ?? [], count: data?.length ?? 0 };
    },
  },
  {
    name: 'list_recent_tenders',
    description: 'List tenders scraped from SA government sources in the last N hours.',
    permission: 'read',
    parameters: {
      type: 'object',
      properties: {
        hours: { type: 'string', description: 'Look back this many hours (default 24)' },
        limit: { type: 'string', description: 'Max results (default 10)' },
      },
    },
    handler: async (a) => {
      const since = new Date(Date.now() - (parseInt(a.hours ?? '24', 10) || 24) * 3_600_000).toISOString();
      const { data, error } = await supabaseAdmin
        .from('tenders')
        .select('id, title, department, province, closing_date, source, scraped_at')
        .gte('scraped_at', since)
        .order('scraped_at', { ascending: false })
        .limit(limit(a.limit));
      if (error) throw new Error(error.message);
      return { tenders: data ?? [], count: data?.length ?? 0, since };
    },
  },
  {
    name: 'list_tender_matches',
    description: 'List the latest tender matches found for clients, with match score and reasons. Use for "what came in", "any good matches".',
    permission: 'read',
    parameters: {
      type: 'object',
      properties: { limit: { type: 'string', description: 'Max results (default 10)' } },
    },
    handler: async (a) => {
      const { data, error } = await supabaseAdmin
        .from('tender_matches')
        .select('id, tender_id, client_id, match_score, match_reasons, status, created_at')
        .order('created_at', { ascending: false })
        .limit(limit(a.limit));
      if (error) throw new Error(error.message);
      return { matches: data ?? [], count: data?.length ?? 0 };
    },
  },

  // ───────────────────────── WRITE (needs confirm) ─────────────────────────
  {
    name: 'update_quote_status',
    description: 'Change a quote\'s status by quote number (e.g. QT-001) or UUID. Confirm before running.',
    permission: 'write',
    parameters: {
      type: 'object',
      properties: {
        quote_id: { type: 'string', description: 'Quote number or UUID' },
        status: { type: 'string', description: 'New status', enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'] },
        notes: { type: 'string', description: 'Optional note' },
      },
      required: ['quote_id', 'status'],
    },
    handler: async (a) => {
      const patch: Record<string, unknown> = { status: a.status, updated_at: new Date().toISOString() };
      if (a.notes) patch.notes = a.notes;
      const col = isUuid(a.quote_id) ? 'id' : 'quote_number';
      const { data, error } = await supabaseAdmin.from('quotes').update(patch).eq(col, a.quote_id).select().single();
      if (error) throw new Error(error.message);
      return { success: true, quote: data };
    },
  },
  {
    name: 'mark_invoice_paid',
    description: 'Mark an invoice as paid by invoice number or UUID. Money-related — always confirm.',
    permission: 'sensitive',
    parameters: {
      type: 'object',
      properties: {
        invoice_id: { type: 'string', description: 'Invoice number (e.g. INV-001) or UUID' },
        paid_amount: { type: 'string', description: 'Amount paid in Rands (defaults to full total)' },
      },
      required: ['invoice_id'],
    },
    handler: async (a) => {
      const col = isUuid(a.invoice_id) ? 'id' : 'invoice_number';
      const { data: inv, error: findErr } = await supabaseAdmin
        .from('invoices')
        .select('id, total_amount')
        .eq(col, a.invoice_id)
        .single();
      if (findErr) throw new Error(findErr.message);
      const paid = a.paid_amount != null ? Number(a.paid_amount) : Number(inv.total_amount);
      const { data, error } = await supabaseAdmin
        .from('invoices')
        .update({
          payment_status: 'paid',
          status: 'paid',
          paid_amount: paid,
          paid_date: new Date().toISOString(),
          payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', inv.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { success: true, invoice: data };
    },
  },
  {
    name: 'update_lead_status',
    description: 'Move a CRM lead along the pipeline by lead UUID. Confirm before running.',
    permission: 'write',
    parameters: {
      type: 'object',
      properties: {
        lead_id: { type: 'string', description: 'Lead UUID' },
        status: { type: 'string', description: 'New status', enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] },
      },
      required: ['lead_id', 'status'],
    },
    handler: async (a) => {
      const { data, error } = await supabaseAdmin
        .from('crm_leads')
        .update({ status: a.status, updated_at: new Date().toISOString() })
        .eq('id', a.lead_id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { success: true, lead: data };
    },
  },

  // ───────────────────────── SENSITIVE (needs confirm) ─────────────────────────
  {
    name: 'run_tender_scrape',
    description: 'Trigger an immediate scrape + match run across all SA government sources. Heavy operation — confirm first.',
    permission: 'sensitive',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      const { runTenderScrapeAndMatch } = await import('@/lib/tenderScraper');
      const result = await runTenderScrapeAndMatch();
      return { success: true, result };
    },
  },
  {
    name: 'send_whatsapp',
    description: 'Send a WhatsApp message to a phone number (e.g. 0821234567). Outbound message — always confirm.',
    permission: 'sensitive',
    parameters: {
      type: 'object',
      properties: {
        phone: { type: 'string', description: 'Recipient phone number' },
        message: { type: 'string', description: 'Message text' },
      },
      required: ['phone', 'message'],
    },
    handler: async (a) => {
      const { sendText } = await import('@/lib/whatsapp');
      const result = await sendText(a.phone, a.message);
      return result;
    },
  },

  // ───────────────────────── CLIENT TRACKER ─────────────────────────
  {
    name: 'list_commitments',
    description:
      'List client commitments (documents owed, statutory deadlines, tenders, operations tasks, training events). Use "overdue" or "due_soon" to triage. This is the core tracker — use it for "what\'s outstanding", "who\'s behind", "what\'s due this week".',
    permission: 'read',
    parameters: {
      type: 'object',
      properties: {
        filter: { type: 'string', description: 'Which slice', enum: ['active', 'overdue', 'due_soon'] },
        type: { type: 'string', description: 'Filter by type', enum: ['document', 'statutory', 'tender', 'operations', 'event_training', 'custom'] },
        client_id: { type: 'string', description: 'Limit to one client (UUID)' },
        limit: { type: 'string', description: 'Max results (default 25)' },
      },
    },
    handler: async (a) => {
      const lim = limit(a.limit, 25, 100);
      const items =
        a.filter === 'overdue'
          ? await listCommitments({ overdueOnly: true, type: a.type, clientId: a.client_id, limit: lim })
          : a.filter === 'due_soon'
            ? await listCommitments({ dueWithinDays: 7, type: a.type, clientId: a.client_id, limit: lim })
            : await listCommitments({ status: 'active', type: a.type, clientId: a.client_id, limit: lim });
      return {
        count: items.length,
        commitments: items.map((c) => ({
          id: c.id, client: c.client_name, title: c.title, type: c.type,
          status: c.status, due_date: c.due_date, days_until: daysUntil(c.due_date),
        })),
      };
    },
  },
  {
    name: 'create_commitment',
    description:
      'Create a new client commitment to track and chase. For recurring items (weekly stock-take, monthly targets, annual returns) set recurrence. Confirm before creating.',
    permission: 'write',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Short title, e.g. "Submit certified ID" or "Monthly stock-take"' },
        client_id: { type: 'string', description: 'CRM client UUID this belongs to' },
        type: { type: 'string', description: 'Commitment type', enum: ['document', 'statutory', 'tender', 'operations', 'event_training', 'custom'] },
        due_date: { type: 'string', description: 'ISO date the item is due (e.g. 2026-07-01)' },
        recurrence: { type: 'string', description: 'Repeat cycle', enum: ['none', 'weekly', 'monthly', 'bi_monthly', 'quarterly', 'annually'] },
        description: { type: 'string', description: 'Optional detail shown to the client' },
        priority: { type: 'string', description: 'Priority', enum: ['low', 'normal', 'high'] },
      },
      required: ['title'],
    },
    handler: async (a) => {
      const created = await createCommitment({
        title: a.title,
        client_id: a.client_id ?? null,
        type: a.type ?? 'custom',
        due_date: a.due_date ?? null,
        recurrence: a.recurrence ?? 'none',
        description: a.description ?? null,
        priority: a.priority ?? 'normal',
      } as any);
      return { success: true, commitment: { id: created.id, title: created.title, due_date: created.due_date } };
    },
  },
  {
    name: 'complete_commitment',
    description: 'Mark a commitment done by its ID. Recurring ones automatically roll forward to the next due date. Confirm first.',
    permission: 'write',
    parameters: {
      type: 'object',
      properties: { commitment_id: { type: 'string', description: 'Commitment UUID' } },
      required: ['commitment_id'],
    },
    handler: async (a) => {
      const c = await completeCommitment(a.commitment_id);
      return { success: true, status: c.status, next_due: c.due_date };
    },
  },
  {
    name: 'reschedule_commitment',
    description: 'Change a commitment\'s due date by its ID. Confirm first.',
    permission: 'write',
    parameters: {
      type: 'object',
      properties: {
        commitment_id: { type: 'string', description: 'Commitment UUID' },
        due_date: { type: 'string', description: 'New ISO due date' },
      },
      required: ['commitment_id', 'due_date'],
    },
    handler: async (a) => {
      const c = await updateCommitment(a.commitment_id, { due_date: a.due_date, status: 'pending' });
      return { success: true, due_date: c.due_date };
    },
  },
  {
    name: 'list_onboarding_templates',
    description:
      'List the standard onboarding templates (New Company, VAT Vendor, Tender-Ready, Operations Baseline) that can be applied to a client to create their full obligation set in one go.',
    permission: 'read',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      const { listTemplates } = await import('@/lib/commitments/templates');
      return { templates: listTemplates() };
    },
  },
  {
    name: 'apply_onboarding_template',
    description:
      'Apply an onboarding template to a client — creates every commitment in the set (documents, statutory cycle, ops drumbeat) anchored to a start date. Use list_onboarding_templates first if unsure of the id. Creates multiple records — confirm first.',
    permission: 'write',
    parameters: {
      type: 'object',
      properties: {
        template_id: { type: 'string', description: 'Template id', enum: ['new_company', 'vat_vendor', 'tender_ready', 'ops_baseline'] },
        client_id: { type: 'string', description: 'CRM client UUID (preferred — contact details auto-fill)' },
        client_name: { type: 'string', description: 'Client name (if no CRM id)' },
        client_email: { type: 'string', description: 'Client email (if no CRM id)' },
        client_phone: { type: 'string', description: 'Client WhatsApp number (if no CRM id)' },
        anchor_date: { type: 'string', description: 'ISO start date offsets count from (default today)' },
      },
      required: ['template_id'],
    },
    handler: async (a) => {
      const { applyTemplate } = await import('@/lib/commitments/applyTemplate');
      const result = await applyTemplate({
        templateId: a.template_id,
        clientId: a.client_id,
        clientName: a.client_name,
        clientEmail: a.client_email,
        clientPhone: a.client_phone,
        anchorDate: a.anchor_date,
      });
      return { success: true, ...result };
    },
  },
  {
    name: 'run_client_followups',
    description:
      'Run the follow-up sweep now: flag overdue items, send WhatsApp/email reminders to clients who are behind, and email you the digest. Sends real messages — always confirm.',
    permission: 'sensitive',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      const { runCommitmentFollowups } = await import('@/lib/commitments/followup');
      const result = await runCommitmentFollowups({ sendDigest: true });
      return { success: true, ...result };
    },
  },

  // ───────────────────────── CAMPAIGNS ─────────────────────────
  {
    name: 'list_campaigns',
    description: 'List WhatsApp questionnaire campaigns with their status and response stats (sent, completed, opted out).',
    permission: 'read',
    parameters: { type: 'object', properties: {} },
    handler: async () => {
      const { listCampaigns, getStats } = await import('@/lib/campaigns/store');
      const campaigns = await listCampaigns();
      return {
        campaigns: await Promise.all(
          campaigns.map(async (c) => ({
            id: c.id, name: c.name, purpose: c.purpose, status: c.status,
            stats: await getStats(c.id).catch(() => null),
          })),
        ),
      };
    },
  },
  {
    name: 'get_campaign_results',
    description: 'Get the stats and completed responses for one campaign by its ID. Use for "how did the [x] campaign do".',
    permission: 'read',
    parameters: {
      type: 'object',
      properties: { campaign_id: { type: 'string', description: 'Campaign UUID' } },
      required: ['campaign_id'],
    },
    handler: async (a) => {
      const { getCampaign, getStats, getContacts } = await import('@/lib/campaigns/store');
      const [campaign, stats, contacts] = await Promise.all([
        getCampaign(a.campaign_id), getStats(a.campaign_id), getContacts(a.campaign_id, 2000),
      ]);
      if (!campaign) return { error: 'Campaign not found' };
      const completed = contacts.filter((c) => c.status === 'completed');
      return {
        campaign: campaign.name, stats,
        responses: completed.slice(0, 50).map((c) => ({ name: c.name, phone: c.phone, answers: c.answers })),
      };
    },
  },
  {
    name: 'send_campaign_batch',
    description: 'Send the next throttled batch of invites for a campaign (launches it / keeps it moving). Sends real WhatsApp messages — always confirm.',
    permission: 'sensitive',
    parameters: {
      type: 'object',
      properties: { campaign_id: { type: 'string', description: 'Campaign UUID' } },
      required: ['campaign_id'],
    },
    handler: async (a) => {
      const { dripCampaign } = await import('@/lib/campaigns/engine');
      return await dripCampaign(a.campaign_id);
    },
  },
];

// ── Helpers used by the run loop ────────────────────────────────────────────────

const byName = new Map(AGENT_TOOLS.map((t) => [t.name, t]));

export function getTool(name: string): AgentTool | undefined {
  return byName.get(name);
}

/** Convert the registry into the OpenRouter tool-definition format. */
export function toolDefinitions(): ToolDefinition[] {
  return AGENT_TOOLS.map((t) => ({
    type: 'function',
    function: { name: t.name, description: t.description, parameters: t.parameters },
  }));
}
