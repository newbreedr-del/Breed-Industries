import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    return clearSessionCookie();
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
