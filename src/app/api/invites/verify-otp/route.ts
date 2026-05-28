import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { token, email, otp_code, device_fingerprint } = await req.json();

    if (!token || !email || !otp_code || !device_fingerprint) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Find the invite
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('invites')
      .select('*')
      .eq('token', token)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    // Check invite status
    if (invite.status === 'revoked') {
      return NextResponse.json({ error: 'This invite has been revoked' }, { status: 403 });
    }

    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This invite has expired' }, { status: 410 });
    }

    // Check email matches
    if (email.toLowerCase().trim() !== invite.recipient_email) {
      return NextResponse.json({ error: 'Email does not match this invite' }, { status: 403 });
    }

    // If already verified, check device fingerprint matches
    if (invite.device_fingerprint && invite.device_fingerprint !== device_fingerprint) {
      return NextResponse.json({ error: 'This invite is locked to another device' }, { status: 403 });
    }

    // Verify OTP
    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from('invite_otp')
      .select('*')
      .eq('invite_id', invite.id)
      .eq('otp_code', otp_code)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
    }

    // Check OTP expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 410 });
    }

    // Mark OTP as used
    await supabaseAdmin
      .from('invite_otp')
      .update({ used: true })
      .eq('id', otpRecord.id);

    // Lock device fingerprint and update invite status
    const { data: updatedInvite, error: updateError } = await supabaseAdmin
      .from('invites')
      .update({
        device_fingerprint,
        status: 'verified',
        verified_at: new Date().toISOString(),
        view_count: (invite.view_count || 0) + 1,
      })
      .eq('id', invite.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      invite: {
        id: updatedInvite.id,
        recipient_name: updatedInvite.recipient_name,
        invite_type: updatedInvite.invite_type,
        content: updatedInvite.content,
        image_url: updatedInvite.image_url,
        background_image_url: updatedInvite.background_image_url,
        event_date: updatedInvite.event_date,
        event_location: updatedInvite.event_location,
        verified_at: updatedInvite.verified_at,
      },
    });
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
