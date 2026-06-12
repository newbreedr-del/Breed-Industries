/**
 * GET/POST /api/cron/campaign-drip
 * Vercel Cron entry — drips the next batch of every active/sending campaign so
 * large lists send out gradually (protects the WhatsApp number from rate bans).
 * Auth: Bearer ${CRON_SECRET}. Fails closed if the secret is unset.
 */

import { NextRequest, NextResponse } from 'next/server';
import { dripAllSending } from '@/lib/campaigns/engine';

export const runtime = 'nodejs';
export const maxDuration = 120;

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 });
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const results = await dripAllSending();
    return NextResponse.json({ ok: true, results });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
