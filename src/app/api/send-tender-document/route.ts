import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { to, from, subject, html, attachments } = await req.json();

    if (!to || !html) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
    const COMPANY_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);

    // Convert base64 attachments back to Buffer
    const formattedAttachments = attachments?.map((att: any) => ({
      filename: att.filename,
      content: Buffer.from(att.content, 'base64')
    })) || [];

    const emailResult = await resend.emails.send({
      from: from || `Breed Industries <${COMPANY_EMAIL}>`,
      to: to,
      subject: subject,
      html: html,
      attachments: formattedAttachments,
    });

    if (emailResult.error) {
      console.error('Resend error sending tender document email:', JSON.stringify(emailResult.error));
      return NextResponse.json(
        { error: `Email delivery failed: ${emailResult.error.message || 'Unknown error'}` },
        { status: 422 }
      );
    }

    console.log('✅ Tender document email sent successfully to:', to);
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      emailId: emailResult.data?.id
    });

  } catch (error) {
    console.error('Error sending tender document email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
