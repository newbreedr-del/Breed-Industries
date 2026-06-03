import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendText, formatPhone } from '@/lib/whatsapp';

export const runtime = 'nodejs';

// GET /api/reminders - List reminders with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabaseAdmin
      .from('scheduled_reminders')
      .select(`
        *,
        client:client_id(full_name, company_name, phone),
        lead:lead_id(full_name, company_name, phone)
      `)
      .order('scheduled_at', { ascending: true })
      .limit(limit);

    if (status) query = query.eq('status', status);
    if (clientId) query = query.or(`client_id.eq.${clientId},lead_id.eq.${clientId}`);
    if (from) query = query.gte('scheduled_at', from);
    if (to) query = query.lte('scheduled_at', to);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ reminders: data || [] });
  } catch (err: any) {
    console.error('[Reminders API] GET error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/reminders - Create new reminder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      client_id,
      lead_id,
      title,
      description,
      reminder_type,
      scheduled_at,
      phone_number,
      message_text,
      auto_send_whatsapp = true,
      is_recurring = false,
      recurrence_pattern,
      recurrence_interval = 1,
      recurrence_end_date,
      max_recurrences
    } = body;

    if (!title || !scheduled_at) {
      return NextResponse.json({ error: 'Title and scheduled_at are required' }, { status: 400 });
    }

    // Get phone number from client/lead/admin if not provided
    let phone = phone_number;
    
    // Admin self-reminder
    if (client_id === 'ADMIN') {
      phone = process.env.WHATSAPP_ADMIN_NUMBER || '';
    } else if (!phone && client_id) {
      const { data: client } = await supabaseAdmin
        .from('crm_clients')
        .select('contact_phone, phone')
        .eq('id', client_id)
        .single();
      phone = client?.contact_phone || client?.phone;
    }
    if (!phone && lead_id) {
      const { data: lead } = await supabaseAdmin
        .from('crm_leads')
        .select('phone')
        .eq('id', lead_id)
        .single();
      phone = lead?.phone;
    }

    const { data, error } = await supabaseAdmin
      .from('scheduled_reminders')
      .insert([{
        client_id,
        lead_id,
        title,
        description,
        reminder_type: reminder_type || 'custom',
        scheduled_at,
        phone_number: phone ? formatPhone(phone) : null,
        message_text: message_text || description || title,
        is_recurring,
        recurrence_pattern,
        recurrence_interval,
        recurrence_end_date,
        max_recurrences,
        source_type: 'manual',
        created_by: 'admin',
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    // If scheduled for now or past, send immediately
    const scheduledTime = new Date(scheduled_at);
    const now = new Date();
    if (auto_send_whatsapp && phone && scheduledTime <= now) {
      const result = await sendText(formatPhone(phone), message_text || description || title);
      if (result.success) {
        await supabaseAdmin
          .from('scheduled_reminders')
          .update({ status: 'sent', sent_at: new Date().toISOString(), whatsapp_sent: true })
          .eq('id', data.id);
      }
    }

    return NextResponse.json({ reminder: data }, { status: 201 });
  } catch (err: any) {
    console.error('[Reminders API] POST error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
