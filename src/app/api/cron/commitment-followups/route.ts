/**
 * POST/GET /api/cron/commitment-followups
 * Called by Vercel Cron (see vercel.json). Runs the daily client follow-up
 * sweep: flags overdue, nudges clients, emails the owner digest.
 *
 * Auth: Authorization: Bearer ${CRON_SECRET}. Fails CLOSED if the secret is
 * not configured (a missing secret rejects rather than opening the endpoint).
 */

import { NextRequest, NextResponse } from 'next/server';
import { runCommitmentFollowups } from '@/lib/commitments/followup';

export const runtime = 'nodejs';
export const maxDuration = 120;

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  }
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runCommitmentFollowups({ sendDigest: true });
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    console.error('[commitment-followups] failed:', e?.message);
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

export const POST = handle;
export const GET = handle; // Vercel Cron issues GET
