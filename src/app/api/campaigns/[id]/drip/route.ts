/**
 * POST /api/campaigns/[id]/drip — send the next throttled batch of invites.
 * Use this to launch a campaign (first batch) and to keep it moving.
 * Protected by middleware (admin session).
 */

import { NextRequest, NextResponse } from 'next/server';
import { dripCampaign } from '@/lib/campaigns/engine';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const result = await dripCampaign(id);
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}
