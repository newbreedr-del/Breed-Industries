import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ?? '';
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'info@thebreed.co.za';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'info@thebreed.co.za';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export async function POST(request: Request) {
  if (!SENDGRID_API_KEY) {
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

    const emailData = {
      to: CONTACT_TO_EMAIL,
      from: CONTACT_FROM_EMAIL,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: content,
    };

    await sgMail.send(emailData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send contact enquiry:', error);
    return NextResponse.json(
      { error: 'Unable to send your message right now. Please try again later.' },
      { status: 500 },
    );
  }
}
