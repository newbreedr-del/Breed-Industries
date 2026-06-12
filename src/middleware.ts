/**
 * Breed Industries — single auth gate.
 *
 * Before this file, every API route reimplemented (or forgot) its own auth
 * check, and the page guard only tested `token.length < 10` — meaning any
 * 10+ character cookie was accepted. This middleware now verifies a *signed*
 * session ONCE for every protected route. Add new admin route prefixes to
 * `config.matcher` below to bring them under the gate.
 *
 * Public endpoints (webhooks, login, public forms) are listed in
 * PUBLIC_PREFIXES and skipped — they authenticate themselves by signature /
 * secret.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/auth/session';

// Endpoints that must remain reachable without an admin session.
const PUBLIC_PREFIXES = [
  '/api/admin/login',
  '/api/admin/logout',
  '/admin/login',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Carve-out: invoice/quote PDF + download links may be emailed to customers,
  // so they must stay reachable without an admin session. NOTE: these are
  // currently unauthenticated by ID — add signed download tokens as a follow-up
  // (tracked in ADMIN-PANEL-AUDIT.md) so they can't be enumerated.
  if (pathname.startsWith('/api/quotes/download') || pathname.endsWith('/pdf')) {
    return NextResponse.next();
  }

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  // Unauthenticated:
  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { ok: false, error: { code: 'UNAUTHENTICATED', message: 'Sign in required' } },
      { status: 401 },
    );
  }
  const loginUrl = new URL('/admin/login', req.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Protected surfaces. Add more API prefixes here as you lock them down.
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/agent/:path*',
    '/api/commitments/:path*',
    '/api/campaigns/:path*',
    '/api/quotes/:path*',
    '/api/invoices/:path*',
    '/api/crm/:path*',
  ],
};
