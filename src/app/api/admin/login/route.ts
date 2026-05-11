/**
 * POST /api/admin/login
 *
 * Sends a Supabase magic link to the provided email address.
 * The link redirects to /auth/callback, which verifies the token
 * and sets the admin_session cookie if the email is authorised.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Build the callback URL from the incoming request origin
    const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const emailRedirectTo = `${origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });

    if (error) {
      console.error('Magic link send error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Failed to send login link' }, { status: 500 });
  }
}
