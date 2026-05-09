import { NextRequest, NextResponse } from 'next/server';
import { updateMatchStatus, createApplication } from '@/lib/tenderStorage';
import type { MatchStatus } from '@/lib/tenderStorage';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }   = await params;
    const body     = await req.json();
    const { status, admin_notes } = body;

    const validStatuses: MatchStatus[] = [
      'new', 'notified', 'reviewed', 'applying', 'applied', 'won', 'lost', 'declined',
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const extras: Record<string, string> = {};
    if (admin_notes) extras.admin_notes = admin_notes;
    if (status === 'applied') extras.applied_at = new Date().toISOString();
    if (['won', 'lost'].includes(status)) extras.outcome_at = new Date().toISOString();

    await updateMatchStatus(id, status, extras);

    // Auto-create application record when we start applying
    if (status === 'applying' && body.tender_id && body.client_id) {
      try {
        await createApplication({
          match_id:                  id,
          tender_id:                 body.tender_id,
          client_id:                 body.client_id,
          status:                    'preparing',
          documents_submitted:       [],
          meeting_attended:          false,
          extra_charges:             0,
          extra_charges_description: undefined,
          notes:                     admin_notes,
          submitted_at:              undefined,
          meeting_date:              undefined,
          meeting_location:          undefined,
        });
      } catch {
        // Application may already exist — non-fatal
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/tender-matches/[id]:', error);
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 });
  }
}
