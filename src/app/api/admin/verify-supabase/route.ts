/**
 * POST /api/admin/verify-supabase
 *
 * Called by /auth/callback after the Supabase magic link is confirmed.
 * Verifies the Supabase access_token, checks the user's email is the
 * configured ADMIN_EMAIL, and issues the admin_session cookie.
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

const ADMIN_EMAILS = ['newbreed.r@gmail.com'];

export async function POST(req: Request) {
  try {
    const { access_token } = await req.json();

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token' }, { status: 400 });
    }

    // Verify the token with Supabase and get the user
    const { data: { user }, error } = await supabase.auth.getUser(access_token);

    if (error || !user?.email) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Only allow the configured admin email(s)
    if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 403 });
    }

    // Issue the existing admin_session cookie (same mechanism, different source)
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const response = NextResponse.json({ success: true, email: user.email });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24, // 24 hours
      path:     '/',
    });

    return response;
  } catch (err) {
    console.error('Supabase verify error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
