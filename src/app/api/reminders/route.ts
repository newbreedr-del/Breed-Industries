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
      .select('*')
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
      is_recurring = false,
      recurrence_pattern,
      recurrence_interval = 1,
      recurrence_end_date,
      max_recurrences
    } = body;

    // Form sends 'auto_send'; API originally used 'auto_send_whatsapp' — support both
    const auto_send_whatsapp: boolean = body.auto_send ?? body.auto_send_whatsapp ?? true;

    // Extract manual client fields (frontend only, not stored in DB)
    const { client_phone, client_name } = body;

    if (!title || !scheduled_at) {
      return NextResponse.json({ error: 'Title and scheduled_at are required' }, { status: 400 });
    }

    // Get phone number from manual input, phone_number field, client/lead/admin
    let phone = phone_number || client_phone;
    
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

    // Build insert object, converting empty strings to null for foreign keys
    const insertData: any = {
      title,
      description,
      reminder_type: reminder_type || 'custom',
      scheduled_at,
      phone_number: phone ? formatPhone(phone) : null,
      message_text: message_text || description || title,
      is_recurring: is_recurring || false,
      source_type: 'manual',
      created_by: 'admin',
      status: 'pending'
    };

    // Only add client_id if it's not empty and not 'ADMIN'
    if (client_id && client_id !== 'ADMIN') {
      insertData.client_id = client_id;
    }
    
    // Only add lead_id if it exists
    if (lead_id) {
      insertData.lead_id = lead_id;
    }

    // Add recurrence fields only if recurring
    if (is_recurring) {
      insertData.recurrence_pattern = recurrence_pattern || 'weekly';
      insertData.recurrence_interval = recurrence_interval || 1;
      if (recurrence_end_date) insertData.recurrence_end_date = recurrence_end_date;
      if (max_recurrences) insertData.max_recurrences = max_recurrences;
    }

    const { data, error } = await supabaseAdmin
      .from('scheduled_reminders')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    // If scheduled for now or past, send immediately (failure must not 500 the creation)
    const scheduledTime = new Date(scheduled_at);
    const now = new Date();
    if (auto_send_whatsapp && phone && scheduledTime <= now) {
      try {
        const result = await sendText(formatPhone(phone), message_text || description || title);
        if (result.success) {
          await supabaseAdmin
            .from('scheduled_reminders')
            .update({ status: 'sent', sent_at: new Date().toISOString(), whatsapp_sent: true })
            .eq('id', data.id);
        }
      } catch (sendErr: any) {
        console.error('[Reminders API] Auto-send failed (reminder still created):', sendErr.message);
      }
    }

    return NextResponse.json({ reminder: data }, { status: 201 });
  } catch (err: any) {
    console.error('[Reminders API] POST error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
