import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { formatPhone } from '@/lib/whatsapp';

export const runtime = 'nodejs';

// POST /api/reminders/bulk - Create reminders for multiple clients
export async function POST(request: NextRequest) {
  try {
    const { 
      client_ids, 
      title, 
      description, 
      reminder_type, 
      scheduled_at,
      message_template,
      days_from_now
    } = await request.json();

    if (!client_ids?.length || !title || !(scheduled_at || days_from_now)) {
      return NextResponse.json({ error: 'client_ids, title, and scheduled_at (or days_from_now) required' }, { status: 400 });
    }

    // Get clients data
    const { data: clients, error: clientError } = await supabaseAdmin
      .from('crm_clients')
      .select('id, full_name, company_name, contact_phone, phone')
      .in('id', client_ids);

    if (clientError) throw clientError;

    const baseDate = days_from_now 
      ? new Date(Date.now() + days_from_now * 24 * 60 * 60 * 1000)
      : new Date(scheduled_at);

    const reminders = clients?.map(client => {
      const phone = client.contact_phone || client.phone;
      let message = message_template || description || title;
      // Replace template variables
      message = message
        .replace(/\{name\}/g, client.full_name || '')
        .replace(/\{company\}/g, client.company_name || '')
        .replace(/\{phone\}/g, phone || '');

      return {
        client_id: client.id,
        title,
        description,
        reminder_type: reminder_type || 'custom',
        scheduled_at: baseDate.toISOString(),
        phone_number: phone ? formatPhone(phone) : null,
        message_text: message,
        source_type: 'bulk',
        created_by: 'admin',
        status: 'pending'
      };
    }) || [];

    if (reminders.length === 0) {
      return NextResponse.json({ error: 'No valid clients found' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('scheduled_reminders')
      .insert(reminders)
      .select();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      created: data?.length || 0,
      reminders: data 
    }, { status: 201 });
  } catch (err: any) {
    console.error('[Reminders API] Bulk error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
