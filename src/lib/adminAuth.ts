import { NextRequest, NextResponse } from 'next/server';

// Admin credentials (in production, these should be environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'breed2025';

// Session cookie settings
const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

export interface AdminSession {
  username: string;
  loginTime: number;
}

// Generate a simple session token
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Verify admin credentials
export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// Create session cookie
export function createSessionCookie(token: string): NextResponse {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // Set to false for local development
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/'
  });
  
  return response;
}

// Clear session cookie
export function clearSessionCookie(): NextResponse {
  const response = NextResponse.json({ success: true });
  
  response.cookies.delete(SESSION_COOKIE_NAME);
  
  return response;
}

// Check if user is authenticated
export function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) {
    return false;
  }
  
  // Simple token validation - just check if it exists
  // In production, you'd validate against a database or JWT
  return token.length > 10; // Basic validation
}

// Middleware for protecting admin routes
export function requireAuth(request: NextRequest): NextResponse | null {
  if (!isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  return null;
}
