import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

const SMTP_HOST = process.env.SENDGRID_SMTP_HOST || 'smtp.sendgrid.net';
const SMTP_PORT = Number(process.env.SENDGRID_SMTP_PORT ?? 587);
const SMTP_USER = process.env.SENDGRID_SMTP_USER || 'apikey';
const SMTP_PASS = process.env.SENDGRID_SMTP_PASS || '';

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'info@thebreed.co.za';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? 'info@thebreed.co.za';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
}

export async function POST(request: Request) {
  if (!SMTP_PASS) {
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

    const smtpTransporter = getTransporter();

    try {
      await smtpTransporter.sendMail(emailData);
      return NextResponse.json({ success: true });
    } catch (sendError) {
      console.error('SMTP send error:', sendError);
      throw new Error('Failed to send email: ' + (sendError instanceof Error ? sendError.message : 'Unknown SMTP error'));
    }
  } catch (error) {
    console.error('Failed to send contact enquiry:', error);
    return NextResponse.json(
      { error: 'Unable to send your message right now. Please try again later.' },
      { status: 500 },
    );
  }
}
