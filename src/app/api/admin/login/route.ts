/**
 * POST /api/admin/login
 *
 * Traditional username/password authentication for admin access.
 * Validates credentials against environment variables and sets a session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const runtime = 'nodejs';

// Simple session token generator
function generateSessionToken(): string {
  return createHash('sha256')
    .update(Date.now().toString() + Math.random().toString())
    .digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Validate credentials
    if (username !== adminUsername || password !== adminPassword) {
      console.warn(`Failed login attempt for username: ${username}`);
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Create response with session cookie
    const response = NextResponse.json({ 
      success: true, 
      session: sessionToken 
    });

    // Set secure session cookie
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/'
    });

    console.log(`Successful login for username: ${username}`);
    return response;

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
