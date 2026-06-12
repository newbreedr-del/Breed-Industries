/**
 * GET    /api/campaigns/[id] — campaign + stats + contacts
 * PATCH  /api/campaigns/[id] — update fields (questions, intro, status, etc.)
 * DELETE /api/campaigns/[id]
 * Protected by middleware.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCampaign, updateCampaign, deleteCampaign, getStats, getContacts } from '@/lib/campaigns/store';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const campaign = await getCampaign(id);
    if (!campaign) return NextResponse.json({ ok: false, error: { message: 'Not found' } }, { status: 404 });
    const [stats, contacts] = await Promise.all([getStats(id), getContacts(id, 2000)]);
    return NextResponse.json({ ok: true, campaign, stats, contacts });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const campaign = await updateCampaign(id, body);
    return NextResponse.json({ ok: true, campaign });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deleteCampaign(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}
