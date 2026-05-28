import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { lead_id, company_name, contact_name, contact_email, contact_phone, service_name, billing_type, amount_rands } = body;

    if (!lead_id || !company_name) {
      return NextResponse.json({ error: 'lead_id and company_name are required' }, { status: 400 });
    }

    // Create the new CRM client
    const { data: client, error: clientError } = await supabaseAdmin
      .from('crm_clients')
      .insert([{
        company_name,
        contact_name,
        contact_email,
        contact_phone,
        status: 'Active',
        source: 'Event',
      }])
      .select()
      .single();

    if (clientError) throw clientError;

    // Add first service if provided
    if (service_name) {
      await supabaseAdmin
        .from('crm_client_services')
        .insert([{
          client_id: client.id,
          service_name,
          billing_type: billing_type || 'Once-off',
          amount_rands: amount_rands || 0,
          status: 'Active',
          start_date: new Date().toISOString().split('T')[0],
        }]);
    }

    // Update the lead: set converted_client_id and status
    const { error: leadError } = await supabaseAdmin
      .from('crm_leads')
      .update({ status: 'Converted', converted_client_id: client.id })
      .eq('id', lead_id);

    if (leadError) throw leadError;

    return NextResponse.json({ client, success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
