import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

// GET all invites (admin)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('invites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ invites: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create a new invite
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipient_email, recipient_name, invite_type, content, expires_hours = 72, max_views = 10, image_url, background_image_url, event_date, event_location } = body;

    if (!recipient_email) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + expires_hours * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from('invites')
      .insert({
        token,
        recipient_email: recipient_email.toLowerCase().trim(),
        recipient_name: recipient_name || null,
        invite_type: invite_type || 'document',
        content: content || null,
        image_url: image_url || null,
        background_image_url: background_image_url || null,
        event_date: event_date || null,
        event_location: event_location || null,
        status: 'pending',
        expires_at,
        max_views,
        created_by: 'admin',
      })
      .select()
      .single();

    if (error) throw error;

    const invite_url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.thebreed.co.za'}/invite/${token}`;

    return NextResponse.json({ invite: data, invite_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH update invite status (revoke, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('invites')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ invite: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE an invite
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('invites')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
