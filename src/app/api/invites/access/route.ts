import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

// POST - check if a device can access an already-verified invite
export async function POST(req: NextRequest) {
  try {
    const { token, device_fingerprint } = await req.json();

    if (!token || !device_fingerprint) {
      return NextResponse.json({ error: 'Token and device fingerprint are required' }, { status: 400 });
    }

    // Find the invite
    const { data: invite, error } = await supabaseAdmin
      .from('invites')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    // Check status
    if (invite.status === 'revoked') {
      return NextResponse.json({ error: 'This invite has been revoked', status: 'revoked' }, { status: 403 });
    }

    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This invite has expired', status: 'expired' }, { status: 410 });
    }

    // Check view count
    if (invite.view_count >= invite.max_views) {
      return NextResponse.json({ error: 'Maximum view limit reached', status: 'max_views' }, { status: 403 });
    }

    // If not yet verified, return pending status (needs OTP flow)
    if (!invite.device_fingerprint) {
      return NextResponse.json({
        status: 'pending',
        recipient_name: invite.recipient_name,
        invite_type: invite.invite_type,
      });
    }

    // Check device fingerprint matches
    if (invite.device_fingerprint !== device_fingerprint) {
      return NextResponse.json({
        error: 'This invite is locked to another device. It cannot be viewed here.',
        status: 'device_mismatch',
      }, { status: 403 });
    }

    // Device matches — grant access and increment view count
    await supabaseAdmin
      .from('invites')
      .update({
        view_count: (invite.view_count || 0) + 1,
        status: 'viewed',
      })
      .eq('id', invite.id);

    return NextResponse.json({
      status: 'verified',
      invite: {
        id: invite.id,
        recipient_name: invite.recipient_name,
        invite_type: invite.invite_type,
        content: invite.content,
        image_url: invite.image_url,
        background_image_url: invite.background_image_url,
        event_date: invite.event_date,
        event_location: invite.event_location,
        verified_at: invite.verified_at,
      },
    });
  } catch (err: any) {
    console.error('Access check error:', err);
    return NextResponse.json({ error: 'Access check failed' }, { status: 500 });
  }
}
