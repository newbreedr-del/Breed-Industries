import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

async function sendWhatsAppNotification(data: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'new_client_request',
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: 'General Enquiry',
          message: data.message
        }
      })
    });
    
    const result = await response.json();
    console.log('WhatsApp notification sent:', result);
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error);
  }
}

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export async function POST(request: Request) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
  const CONTACT_TO_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';
  const CONTACT_FROM_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';

  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Email service is not configured.' },
      { status: 500 },
    );
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const payload = (await request.json()) as Partial<ContactPayload>;
    const { name, email, phone, message } = payload;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 },
      );
    }

    const content = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      '',
      'Message:',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await resend.emails.send({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL,
        replyTo: email,
        subject: `New enquiry from ${name}`,
        text: content,
      });
      
      sendWhatsAppNotification({ name, email, phone, message }).catch(console.error);

      // Save to Supabase (non-blocking — fails gracefully if table doesn't exist yet)
      supabaseAdmin.from('contact_messages').insert({
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        phone: phone || null,
        message,
        status: 'unread'
      }).then(({ error }) => {
        if (error) console.error('Failed to log contact message to DB:', error.message);
      });

      return NextResponse.json({ success: true });
    } catch (sendError) {
      console.error('Resend send error:', sendError);
      throw new Error('Failed to send email: ' + (sendError instanceof Error ? sendError.message : 'Unknown error'));
    }
  } catch (error) {
    console.error('Failed to send contact enquiry:', error);
    return NextResponse.json(
      { error: 'Unable to send your message right now. Please try again later.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching contact messages:', error.message);
      return NextResponse.json({ messages: [], total: 0 });
    }
    return NextResponse.json({ messages: data || [], total: data?.length || 0 });
  } catch (error) {
    return NextResponse.json({ messages: [], total: 0 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    await supabaseAdmin.from('contact_messages').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
