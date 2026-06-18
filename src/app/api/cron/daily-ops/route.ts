/**
 * GET/POST /api/cron/daily-ops
 *
 * One daily cron that runs the lighter recurring jobs together, so the whole
 * app fits inside Vercel Hobby's limit of 2 daily cron jobs:
 *   1. Client commitment follow-ups (nudges + owner digest)
 *   2. One WhatsApp campaign drip batch (next queued invites)
 *
 * Auth: Bearer ${CRON_SECRET}. Fails closed if the secret is unset.
 *
 * NOTE: On Hobby this runs once a day, so a large campaign sends ~one batch per
 * day. For faster sending, either (a) upgrade to Vercel Pro and use the
 * per-job crons in git history, or (b) hit /api/cron/campaign-drip from an
 * external scheduler (cron-job.org, or your Railway backend) with the same
 * Bearer CRON_SECRET header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runCommitmentFollowups } from '@/lib/commitments/followup';
import { dripAllSending } from '@/lib/campaigns/engine';
import { processDueReminders } from '@/lib/reminders/processDue';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const out: Record<string, unknown> = {};

  // 1. Scheduled reminders that are due (the /admin/reminders ones)
  try {
    out.reminders = await processDueReminders();
  } catch (e: any) {
    out.remindersError = e?.message;
  }

  // 2. Commitment follow-ups (fast: DB + a handful of sends)
  try {
    out.followups = await runCommitmentFollowups({ sendDigest: true });
  } catch (e: any) {
    out.followupsError = e?.message;
  }

  // 3. One campaign drip batch across active campaigns
  try {
    out.campaignDrip = await dripAllSending();
  } catch (e: any) {
    out.campaignDripError = e?.message;
  }

  return NextResponse.json({ ok: true, ...out });
}

export const GET = handle;
export const POST = handle;
