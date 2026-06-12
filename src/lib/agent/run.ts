/**
 * Breed Industries — Agent Core (the "brain")
 * ───────────────────────────────────────────
 * One function, `runAgent`, drives the whole super-agent:
 *   1. Sends the user's message + the tool registry to the model.
 *   2. The model decides which tools to call.
 *   3. READ tools run immediately.
 *   4. WRITE / SENSITIVE tools are NOT executed unless `confirm` is true —
 *      instead they're returned as `pendingActions` for the UI to confirm.
 *   5. Loops until the model produces a final answer (or hits the iteration cap).
 *
 * This same function backs the ⌘K command bar, and can be called from WhatsApp
 * or a scheduled task. It is transport-agnostic: give it text, get back a reply.
 */

import { chatCompletion, type ChatMessage, type ToolCall } from '@/lib/openrouter';
import { AGENT_TOOLS, getTool, toolDefinitions } from './registry';

const MAX_ITERATIONS = 6;

const SYSTEM_PROMPT = `You are the Breed Industries Operations Agent — the owner's right hand.

Breed Industries is a South African professional services agency (company registration, CIPC, SARS compliance, tenders, BEE, web & marketing). Currency is South African Rand (ZAR); the business is NOT VAT registered, so all amounts are VAT-exclusive.

Your most important job is the CLIENT TRACKER: keeping every client on top of what they owe — documents to submit, statutory deadlines (CIPC/SARS/VAT/BEE), tender submissions, day-to-day operations (stock-takes, targets, staff check-ins), and training events. When the owner asks "what's outstanding", "who's behind", or "what's due", use list_commitments. You can create, complete, reschedule commitments, and run the follow-up sweep that nudges clients automatically.

How you work:
- Use the provided tools to answer with real data. Never invent numbers, statuses, or records.
- Be concise and action-oriented. Lead with the answer.
- For money or messages (marking invoices paid, sending WhatsApp, triggering scrapes), call the tool — the system will pause and ask the owner to confirm before anything actually happens. Tell the owner clearly what you're about to do.
- Format amounts as "R12,500". Keep replies short enough to read at a glance.
- If a request is ambiguous, ask one clarifying question instead of guessing.`;

export interface PendingAction {
  tool: string;
  description: string;
  args: Record<string, any>;
}

export interface AgentResult {
  reply: string;
  pendingActions: PendingAction[];
  toolsRun: string[];
}

export interface RunAgentOptions {
  message: string;
  /** Prior turns for multi-message context (optional). */
  history?: ChatMessage[];
  /** When true, write/sensitive tools execute. When false, they're queued for confirmation. */
  confirm?: boolean;
}

export async function runAgent({ message, history = [], confirm = false }: RunAgentOptions): Promise<AgentResult> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: message },
  ];

  const pendingActions: PendingAction[] = [];
  const toolsRun: string[] = [];
  const defs = toolDefinitions();

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const { message: assistant, toolCalls, finishReason } = await chatCompletion(messages, defs, 700);
    messages.push(assistant);

    if (!toolCalls || toolCalls.length === 0 || finishReason === 'stop') {
      return {
        reply: assistant.content?.trim() || 'Done.',
        pendingActions,
        toolsRun,
      };
    }

    const results = await Promise.all(
      toolCalls.map(async (tc: ToolCall) => {
        const tool = getTool(tc.function.name);
        let args: Record<string, any> = {};
        try { args = JSON.parse(tc.function.arguments || '{}'); } catch { /* ignore */ }

        if (!tool) {
          return toolMessage(tc, { error: `Unknown tool: ${tc.function.name}` });
        }

        // Gate: write/sensitive tools need confirmation.
        if (tool.permission !== 'read' && !confirm) {
          pendingActions.push({
            tool: tool.name,
            description: describeAction(tool.name, args),
            args,
          });
          return toolMessage(tc, {
            status: 'awaiting_confirmation',
            note: 'This action was NOT executed. It is queued for the owner to confirm.',
          });
        }

        try {
          const out = await tool.handler(args);
          toolsRun.push(tool.name);
          return toolMessage(tc, out);
        } catch (err: any) {
          return toolMessage(tc, { error: err?.message ?? 'Tool failed' });
        }
      }),
    );

    messages.push(...results);

    // If everything this round is awaiting confirmation, stop and let the UI confirm.
    if (pendingActions.length > 0 && toolsRun.length === 0 && !confirm) {
      const summary = pendingActions.map((p) => `• ${p.description}`).join('\n');
      return {
        reply: `I'm ready to do the following — confirm to proceed:\n${summary}`,
        pendingActions,
        toolsRun,
      };
    }
  }

  return {
    reply: 'I worked through several steps but ran out of room. Try narrowing the request.',
    pendingActions,
    toolsRun,
  };
}

function toolMessage(tc: ToolCall, payload: unknown): ChatMessage {
  return {
    role: 'tool',
    content: typeof payload === 'string' ? payload : JSON.stringify(payload),
    tool_call_id: tc.id,
    name: tc.function.name,
  };
}

/** Human-readable summary of a pending action for the confirm card. */
function describeAction(name: string, args: Record<string, any>): string {
  switch (name) {
    case 'update_quote_status':
      return `Set quote ${args.quote_id} → ${args.status}`;
    case 'mark_invoice_paid':
      return `Mark invoice ${args.invoice_id} as PAID${args.paid_amount ? ` (R${args.paid_amount})` : ''}`;
    case 'update_lead_status':
      return `Move lead ${args.lead_id} → ${args.status}`;
    case 'run_tender_scrape':
      return 'Run a full tender scrape + match now';
    case 'send_whatsapp':
      return `Send WhatsApp to ${args.phone}: "${String(args.message ?? '').slice(0, 60)}"`;
    case 'create_commitment':
      return `Track new ${args.type ?? 'item'}: "${args.title}"${args.due_date ? ` due ${args.due_date}` : ''}${args.recurrence && args.recurrence !== 'none' ? ` (${args.recurrence})` : ''}`;
    case 'complete_commitment':
      return `Mark commitment ${args.commitment_id} as done`;
    case 'reschedule_commitment':
      return `Reschedule commitment ${args.commitment_id} → ${args.due_date}`;
    case 'run_client_followups':
      return 'Run the client follow-up sweep now (sends reminders to everyone behind)';
    case 'apply_onboarding_template':
      return `Apply "${args.template_id}" template to ${args.client_name ?? args.client_id ?? 'client'} (creates the full commitment set)`;
    case 'send_campaign_batch':
      return `Send the next batch of WhatsApp invites for campaign ${args.campaign_id}`;
    default:
      return `${name}(${JSON.stringify(args)})`;
  }
}

/** Exposed for a future "/help" or settings screen. */
export function listCapabilities() {
  return AGENT_TOOLS.map((t) => ({ name: t.name, permission: t.permission, description: t.description }));
}
