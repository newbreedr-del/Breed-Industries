import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendText, formatPhone } from '@/lib/whatsapp';

export const runtime = 'nodejs';

// POST /api/reminders/send-now - Send reminder immediately via WhatsApp
export async function POST(request: NextRequest) {
  try {
    const { reminder_id, phone_override, message_override } = await request.json();

    if (!reminder_id) {
      return NextResponse.json({ error: 'reminder_id required' }, { status: 400 });
    }

    // Get reminder
    const { data: reminder, error: fetchError } = await supabaseAdmin
      .from('scheduled_reminders')
      .select('*, client:client_id(full_name, contact_phone), lead:lead_id(full_name, phone)')
      .eq('id', reminder_id)
      .single();

    if (fetchError || !reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    // Determine phone number
    const phone = phone_override || reminder.phone_number || 
                  reminder.client?.contact_phone || reminder.client?.phone ||
                  reminder.lead?.phone;

    if (!phone) {
      return NextResponse.json({ error: 'No phone number available' }, { status: 400 });
    }

    // Determine message
    const message = message_override || reminder.message_text || reminder.description || reminder.title;
    const formattedPhone = formatPhone(phone);

    // Send WhatsApp
    const result = await sendText(formattedPhone, message);

    if (result.success) {
      // Update reminder as sent
      await supabaseAdmin
        .from('scheduled_reminders')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          whatsapp_sent: true,
          wa_message_id: result.messageId,
          updated_at: new Date().toISOString()
        })
        .eq('id', reminder_id);

      return NextResponse.json({ 
        success: true, 
        message: 'WhatsApp sent',
        phone: formattedPhone,
        messageId: result.messageId
      });
    } else {
      // Mark as failed
      await supabaseAdmin
        .from('scheduled_reminders')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', reminder_id);

      return NextResponse.json({ 
        success: false, 
        error: result.error,
        phone: formattedPhone
      }, { status: 500 });
    }
  } catch (err: any) {
    console.error('[Reminders API] Send-now error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
