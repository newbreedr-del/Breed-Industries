import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { data: clients, error } = await supabaseAdmin
      .from('crm_clients')
      .select(`*, crm_client_services(id, service_name, billing_type, amount_rands, status)`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const enriched = (clients || []).map((c: any) => {
      const services = c.crm_client_services || [];
      const mrr = services
        .filter((s: any) => s.billing_type === 'Monthly Retainer' && s.status === 'Active')
        .reduce((sum: number, s: any) => sum + (Number(s.amount_rands) || 0), 0);
      return { ...c, mrr, service_count: services.length };
    });

    return NextResponse.json({ clients: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { company_name, contact_name, contact_email, contact_phone, status, source, source_event, industry, drive_folder_url, address, notes } = body;

    if (!company_name) {
      return NextResponse.json({ error: 'company_name is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('crm_clients')
      .insert([{ company_name, contact_name, contact_email, contact_phone, status: status || 'Active', source: source || 'Direct', source_event, industry, drive_folder_url, address, notes }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ client: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
