/**
 * GET  /api/campaigns — list campaigns (with stats)
 * POST /api/campaigns — create a campaign
 * Protected by middleware (admin session required).
 */

import { NextRequest, NextResponse } from 'next/server';
import { listCampaigns, createCampaign, getStats } from '@/lib/campaigns/store';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const campaigns = await listCampaigns();
    const withStats = await Promise.all(
      campaigns.map(async (c) => ({ ...c, stats: await getStats(c.id).catch(() => null) })),
    );
    return NextResponse.json({ ok: true, campaigns: withStats });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.name) return NextResponse.json({ ok: false, error: { message: 'name is required' } }, { status: 400 });
    if (!body?.intro_message) return NextResponse.json({ ok: false, error: { message: 'intro_message is required' } }, { status: 400 });
    const campaign = await createCampaign(body);
    return NextResponse.json({ ok: true, campaign }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}
