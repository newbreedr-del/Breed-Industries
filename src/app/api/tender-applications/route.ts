import { NextRequest, NextResponse } from 'next/server';
import { getApplications, createApplication } from '@/lib/tenderStorage';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const clientId = req.nextUrl.searchParams.get('client_id') ?? undefined;
    const apps = await getApplications(clientId);
    return NextResponse.json({ applications: apps });
  } catch (err) {
    console.error('GET /api/tender-applications:', err);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const app = await createApplication({
      match_id:                    body.match_id,
      tender_id:                   body.tender_id,
      client_id:                   body.client_id,
      status:                      body.status ?? 'preparing',
      submitted_at:                body.submitted_at ?? null,
      documents_submitted:         body.documents_submitted ?? [],
      meeting_attended:            body.meeting_attended ?? false,
      meeting_date:                body.meeting_date ?? null,
      meeting_location:            body.meeting_location ?? null,
      extra_charges:               body.extra_charges ?? 0,
      extra_charges_description:   body.extra_charges_description ?? null,
      notes:                       body.notes ?? null,
    });
    return NextResponse.json({ application: app }, { status: 201 });
  } catch (err) {
    console.error('POST /api/tender-applications:', err);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
