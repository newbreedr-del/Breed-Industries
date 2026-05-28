import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

// WhatsApp Business API Configuration
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v18.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

// Helper: Format phone number for WhatsApp (27xxxxxxxxxx format)
function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  // If starts with 0, replace with 27
  if (cleaned.startsWith('0')) {
    cleaned = '27' + cleaned.substring(1);
  }
  return cleaned;
}

// Helper: Send WhatsApp message via Business API
async function sendWhatsAppMessage(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      return { success: false, error: 'WhatsApp not configured' };
    }

    const formattedNumber = formatWhatsAppNumber(to);
    
    const response = await fetch(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: message
          }
        })
      }
    );

    const data = await response.json();
    
    if (response.ok && data.messages?.[0]?.id) {
      return { success: true, messageId: data.messages[0].id };
    } else {
      return { success: false, error: data.error?.message || 'Failed to send message' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// POST /api/reminders/send - Send WhatsApp reminder for a task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task_id, manual = false } = body;
    
    // Get task details
    const { data: task, error: taskError } = await supabase
      .from('client_tasks')
      .select(`
        *,
        clients (id, name, company_name, phone)
      `)
      .eq('id', task_id)
      .single();
    
    if (taskError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Determine WhatsApp number to use
    const whatsappNumber = task.whatsapp_number || task.clients?.phone;
    if (!whatsappNumber) {
      return NextResponse.json({ error: 'No WhatsApp number configured' }, { status: 400 });
    }
    
    // Build reminder message
    const frequency = task.reminder_frequency;
    const clientName = task.clients?.name || 'Client';
    const taskName = task.task_name;
    const companyName = task.clients?.company_name;
    
    let message = `📋 *SECRETARY REMINDER*\n\n`;
    message += `Hi! This is your work reminder.\n\n`;
    message += `*Client:* ${clientName}${companyName ? ` (${companyName})` : ''}\n`;
    message += `*Task:* ${taskName}\n`;
    message += `*Frequency:* ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}\n`;
    
    if (task.task_description) {
      message += `*Details:* ${task.task_description}\n`;
    }
    
    if (!manual) {
      message += `\n⏰ This task is due today. Please complete and update the system.`;
    }
    
    message += `\n\nReply DONE when complete.`;
    
    // Send WhatsApp message
    const result = await sendWhatsAppMessage(whatsappNumber, message);
    
    // Log the reminder
    await supabase.from('whatsapp_reminders').insert([{
      task_id: task.id,
      client_id: task.client_id,
      reminder_type: frequency,
      message_text: message,
      status: result.success ? 'sent' : 'failed',
      error_message: result.error,
      whatsapp_message_id: result.messageId
    }]);
    
    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error
    });
  } catch (error: any) {
    console.error('Error sending reminder:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reminder' },
      { status: 500 }
    );
  }
}
