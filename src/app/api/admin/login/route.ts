/**
 * POST /api/admin/login
 * Username + password login validated against env vars.
 * On success, sets a SIGNED admin_session cookie (HMAC, verifiable + expiring).
 */

import { NextRequest, NextResponse } from 'next/server';
import { issueSession, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/lib/auth/session';

export const runtime = 'nodejs';

// Tiny in-memory throttle to blunt brute-force. For multi-instance, swap for Upstash.
const attempts = new Map<string, { n: number; reset: number }>();
function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.reset) {
    attempts.set(ip, { n: 1, reset: now + 60_000 });
    return false;
  }
  rec.n++;
  return rec.n > 8; // max 8 tries / minute / IP
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (tooManyAttempts(ip)) {
      return NextResponse.json({ error: 'Too many attempts. Try again shortly.' }, { status: 429 });
    }

    const { username, password } = await req.json();

    const validUser = process.env.ADMIN_USERNAME;
    const validPass = process.env.ADMIN_PASSWORD;

    // Fail closed: if credentials aren't configured, nobody gets in.
    if (!validUser || !validPass || username !== validUser || password !== validPass) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await issueSession(username);
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
