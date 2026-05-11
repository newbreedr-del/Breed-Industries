import { NextRequest, NextResponse } from 'next/server';
import { updateApplication } from '@/lib/tenderStorage';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id }  = await params;
    const body    = await req.json();
    const updated = await updateApplication(id, body);
    return NextResponse.json({ application: updated });
  } catch (err) {
    console.error('PATCH /api/tender-applications/[id]:', err);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
