import { NextRequest, NextResponse } from 'next/server';
import { getTenderClients, createTenderClient } from '@/lib/tenderStorage';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const activeOnly = searchParams.get('active') !== 'false';
    const clients = await getTenderClients(activeOnly);
    return NextResponse.json({ clients, total: clients.length });
  } catch (error) {
    console.error('GET /api/tender-clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ['name', 'company_name', 'email', 'package'];
    for (const f of required) {
      if (!body[f]) return NextResponse.json({ error: `${f} is required` }, { status: 400 });
    }

    const validPackages = ['watch', 'apply', 'full'];
    if (!validPackages.includes(body.package)) {
      return NextResponse.json({ error: 'package must be watch | apply | full' }, { status: 400 });
    }

    const client = await createTenderClient({
      name:               body.name,
      company_name:       body.company_name,
      email:              body.email,
      phone:              body.phone,
      cidb_grade:         body.cidb_grade,
      bee_level:          body.bee_level ? Number(body.bee_level) : undefined,
      csd_number:         body.csd_number,
      tax_pin:            body.tax_pin,
      provinces:          body.provinces ?? [],
      commodity_codes:    body.commodity_codes ?? [],
      service_categories: body.service_categories ?? [],
      max_tender_value:   body.max_tender_value ? Number(body.max_tender_value) : 0,
      package:            body.package,
      package_started_at: new Date().toISOString(),
      package_expires_at: body.package_expires_at,
      is_active:          body.is_active ?? true,
      notes:              body.notes,
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tender-clients:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
