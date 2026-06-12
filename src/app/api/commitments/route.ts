/**
 * GET  /api/commitments  — list (filters: status, clientId, type, overdueOnly, dueWithinDays)
 * POST /api/commitments  — create
 * Protected by middleware (admin session required).
 */

import { NextRequest, NextResponse } from 'next/server';
import { listCommitments, createCommitment } from '@/lib/commitments/store';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const items = await listCommitments({
      status: (sp.get('status') as any) ?? 'active',
      clientId: sp.get('clientId') ?? undefined,
      type: sp.get('type') ?? undefined,
      overdueOnly: sp.get('overdueOnly') === 'true',
      dueWithinDays: sp.get('dueWithinDays') ? Number(sp.get('dueWithinDays')) : undefined,
      limit: sp.get('limit') ? Number(sp.get('limit')) : undefined,
    });
    return NextResponse.json({ ok: true, commitments: items });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.title || typeof body.title !== 'string') {
      return NextResponse.json({ ok: false, error: { message: 'title is required' } }, { status: 400 });
    }
    const created = await createCommitment(body);
    return NextResponse.json({ ok: true, commitment: created }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}
