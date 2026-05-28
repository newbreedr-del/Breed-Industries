import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from('crm_client_services')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ services: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();
    const { service_name, service_category, billing_type, amount_rands, start_date, end_date, renewal_date, status, notes } = body;

    if (!service_name) {
      return NextResponse.json({ error: 'service_name is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('crm_client_services')
      .insert([{ client_id: id, service_name, service_category, billing_type: billing_type || 'Once-off', amount_rands: amount_rands || 0, start_date, end_date, renewal_date, status: status || 'Active', notes }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ service: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
