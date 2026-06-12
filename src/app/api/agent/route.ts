/**
 * POST /api/agent — the super-agent command endpoint.
 *
 * Auth: protected by middleware (signed admin_session required). Because the
 * agent can mutate records and send messages, this route must never be public.
 *
 * Body: { message: string, confirm?: boolean, history?: ChatMessage[] }
 *  - confirm=false (default) → write/sensitive tools are queued, not executed.
 *  - confirm=true            → the UI is re-running an action the owner approved.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/auth/session';
import { runAgent } from '@/lib/agent/run';
import type { ChatMessage } from '@/lib/openrouter';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // Defense in depth: middleware already gated this, but verify again here.
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHENTICATED' } }, { status: 401 });
  }

  let body: { message?: string; confirm?: boolean; history?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'BAD_REQUEST' } }, { status: 400 });
  }

  const message = (body.message ?? '').trim();
  if (!message) {
    return NextResponse.json({ ok: false, error: { code: 'EMPTY_MESSAGE' } }, { status: 400 });
  }

  try {
    const result = await runAgent({
      message,
      confirm: body.confirm === true,
      history: Array.isArray(body.history) ? body.history.slice(-12) : [],
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err: any) {
    console.error('[agent] run failed:', err?.message);
    return NextResponse.json(
      { ok: false, error: { code: 'AGENT_ERROR', message: err?.message ?? 'Agent failed' } },
      { status: 500 },
    );
  }
}
