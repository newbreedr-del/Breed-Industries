import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json({ error: 'Token and email are required' }, { status: 400 });
    }

    // Find the invite by token
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('invites')
      .select('*')
      .eq('token', token)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    // Check if invite is expired or revoked
    if (invite.status === 'revoked') {
      return NextResponse.json({ error: 'This invite has been revoked' }, { status: 403 });
    }

    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This invite has expired' }, { status: 410 });
    }

    // Check email matches
    if (email.toLowerCase().trim() !== invite.recipient_email) {
      return NextResponse.json({ error: 'This invite is not associated with this email address' }, { status: 403 });
    }

    // Generate 6-digit OTP
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store OTP
    const { error: otpError } = await supabaseAdmin
      .from('invite_otp')
      .insert({
        invite_id: invite.id,
        email: email.toLowerCase().trim(),
        otp_code,
        expires_at: otp_expires,
      });

    if (otpError) throw otpError;

    // Send OTP via Resend
    const { data, error: emailError } = await resend.emails.send({
      from: 'Breed Industries <info@thebreed.co.za>',
      to: email.toLowerCase().trim(),
      subject: 'Your Secure Invite Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a2e; margin: 0;">Breed Industries</h1>
            <p style="color: #666; margin-top: 5px;">Secure Invite Verification</p>
          </div>
          <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; text-align: center;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Hi${invite.recipient_name ? ` ${invite.recipient_name}` : ''},<br/>
              Use the code below to verify your identity and access your secure invite.
            </p>
            <div style="background: #1a1a2e; color: #fff; font-size: 32px; letter-spacing: 8px; padding: 20px 40px; border-radius: 8px; display: inline-block; font-weight: bold;">
              ${otp_code}
            </div>
            <p style="color: #999; font-size: 13px; margin-top: 20px;">
              This code expires in 10 minutes.<br/>
              If you did not request this, please ignore this email.
            </p>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            The Breed Industries (PTY) LTD · Reg: 2021/963126/07<br/>
            12 Kings Road, Pinetown, Durban 3610
          </p>
        </div>
      `,
    });

    if (emailError) throw emailError;

    return NextResponse.json({ success: true, message: 'OTP sent to your email' });
  } catch (err: any) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
  }
}
