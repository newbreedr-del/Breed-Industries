import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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
    const { searchParams } = new URL(request.url);
    const event = searchParams.get('event');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('crm_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (event) query = query.eq('source_event', event);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ leads: data || [] });
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
    const { full_name, company_name, position, email, phone, source_event, event_date, package_interest, notes } = body;

    if (!full_name) {
      return NextResponse.json({ error: 'full_name is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('crm_leads')
      .insert([{ full_name, company_name, position, email, phone, source_event, event_date, package_interest, notes, status: 'New Lead' }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
