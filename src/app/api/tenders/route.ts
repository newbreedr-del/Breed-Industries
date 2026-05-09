import { NextRequest, NextResponse } from 'next/server';
import { getTenders, upsertTender } from '@/lib/tenderStorage';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status') as any ?? 'open';
    const limit  = parseInt(searchParams.get('limit')  ?? '50');
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const result = await getTenders({ status, limit, offset });
    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/tenders:', error);
    return NextResponse.json({ error: 'Failed to fetch tenders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ['reference_number', 'title', 'closing_date'];
    for (const f of required) {
      if (!body[f]) return NextResponse.json({ error: `${f} is required` }, { status: 400 });
    }

    const tender = await upsertTender({
      reference_number:    body.reference_number,
      title:               body.title,
      description:         body.description,
      department:          body.department,
      province:            body.province,
      category:            body.category,
      commodity_codes:     body.commodity_codes ?? [],
      estimated_value:     body.estimated_value,
      required_cidb_grade: body.required_cidb_grade,
      required_bee_level:  body.required_bee_level,
      issue_date:          body.issue_date,
      closing_date:        body.closing_date,
      briefing_date:       body.briefing_date,
      briefing_location:   body.briefing_location,
      source_url:          body.source_url,
      source:              body.source ?? 'manual',
      status:              body.status ?? 'open',
      documents_required:  body.documents_required ?? false,
      document_fee:        body.document_fee ?? 0,
      raw_data:            undefined,
    });

    return NextResponse.json({ tender }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tenders:', error);
    return NextResponse.json({ error: 'Failed to create tender' }, { status: 500 });
  }
}
