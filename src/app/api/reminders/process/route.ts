/**
 * POST /api/reminders/process
 * Runs every due scheduled reminder now. Used by the "Run due reminders now"
 * test button in the admin panel (verifies the whole pipe works end-to-end).
 *
 * Auth: admin session cookie OR Bearer ${CRON_SECRET} (so an external scheduler
 * can also drive it). This route guards itself because /api/reminders is not in
 * the middleware matcher.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/auth/session';
import { processDueReminders } from '@/lib/reminders/processDue';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  const cronOk =
    !!process.env.CRON_SECRET && req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;

  if (!session && !cronOk) {
    return NextResponse.json({ ok: false, error: { code: 'UNAUTHENTICATED' } }, { status: 401 });
  }

  try {
    const result = await processDueReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message } }, { status: 500 });
  }
}
