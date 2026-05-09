import { NextRequest, NextResponse } from 'next/server';
import {
  getTenderClientById,
  updateTenderClient,
  getMatchesForAdmin,
  getApplications,
} from '@/lib/tenderStorage';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }  = await params;
    const client  = await getTenderClientById(id);
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    const [matches, applications] = await Promise.all([
      getMatchesForAdmin({ client_id: id }),
      getApplications(id),
    ]);

    return NextResponse.json({ client, matches, applications });
  } catch (error) {
    console.error('GET /api/tender-clients/[id]:', error);
    return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body   = await req.json();
    const client = await updateTenderClient(id, body);
    return NextResponse.json({ client });
  } catch (error) {
    console.error('PATCH /api/tender-clients/[id]:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}
