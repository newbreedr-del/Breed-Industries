import { NextRequest, NextResponse } from 'next/server';
import { getTenderById, updateTender, getMatchesForAdmin } from '@/lib/tenderStorage';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tender  = await getTenderById(id);
    if (!tender) return NextResponse.json({ error: 'Tender not found' }, { status: 404 });

    const matches = await getMatchesForAdmin({ tender_id: id });
    return NextResponse.json({ tender, matches });
  } catch (error) {
    console.error('GET /api/tenders/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch tender' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body    = await req.json();
    const tender  = await updateTender(id, body);
    return NextResponse.json({ tender });
  } catch (error) {
    console.error('PATCH /api/tenders/[id]:', error);
    return NextResponse.json({ error: 'Failed to update tender' }, { status: 500 });
  }
}
