/**
 * PATCH  /api/commitments/[id]  — update (use { action: 'complete' } to close/roll forward)
 * DELETE /api/commitments/[id]  — delete
 * GET    /api/commitments/[id]  — single
 * Protected by middleware (admin session required).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCommitment, updateCommitment, deleteCommitment, completeCommitment } from '@/lib/commitments/store';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const c = await getCommitment(id);
    if (!c) return NextResponse.json({ ok: false, error: { message: 'Not found' } }, { status: 404 });
    return NextResponse.json({ ok: true, commitment: c });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const commitment = body?.action === 'complete'
      ? await completeCommitment(id)
      : await updateCommitment(id, body);
    return NextResponse.json({ ok: true, commitment });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deleteCommitment(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}
