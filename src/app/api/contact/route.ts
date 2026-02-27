import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CONTACT_TO_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';
const CONTACT_FROM_EMAIL = 'onboarding@resend.dev';

const resend = new Resend(RESEND_API_KEY);

export async function POST(request: Request) {
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Email service is not configured.' },
      { status: 500 },
    );
  }

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
