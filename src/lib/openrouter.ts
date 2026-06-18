/**
 * Breed Industries — OpenRouter AI Client
 *
 * Provides chat completions with function/tool calling support via OpenRouter.
 * Model can be swapped by changing OPENROUTER_MODEL env var.
 * Default: google/gemini-2.0-flash-001  (fast, cheap, excellent for tool use)
 */

export const runtime = 'nodejs';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
  name?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, {
        type: string;
        description: string;
        enum?: string[];
      }>;
      required?: string[];
    };
  };
}

export interface CompletionResponse {
  message: ChatMessage;
  toolCalls: ToolCall[];
  finishReason: string;
  usage?: { prompt_tokens: number; completion_tokens: number };
}

// ── Config ────────────────────────────────────────────────────────────────────

function orConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY ?? '';
  // Free model by default. Override with OPENROUTER_MODEL (keep ':free' suffix to
  // stay free). Paid models like google/gemini-2.0-flash-001 are better but cost.
  const model = process.env.OPENROUTER_MODEL ?? 'nvidia/nemotron-nano-9b-v2:free';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://thebreed.co.za';
  return { apiKey, model, appUrl };
}

// ── Core chat completion ──────────────────────────────────────────────────────

export async function chatCompletion(
  messages: ChatMessage[],
  tools?: ToolDefinition[],
  maxTokens = 1024,
): Promise<CompletionResponse> {
  const { apiKey, model, appUrl } = orConfig();

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const body: Record<string, unknown> = {
    model,
    messages,
    max_tokens: maxTokens,
    temperature: 0.4,
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = 'auto';
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': appUrl,
      'X-Title': 'Breed Industries Agent',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(45_000),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0];
  if (!choice) throw new Error('No choices returned from OpenRouter');

  const message: ChatMessage = choice.message;
  const toolCalls: ToolCall[] = message.tool_calls ?? [];
  const finishReason: string = choice.finish_reason ?? 'stop';

  return { message, toolCalls, finishReason, usage: data.usage };
}
