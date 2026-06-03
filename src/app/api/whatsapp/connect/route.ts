import { NextRequest, NextResponse } from 'next/server';
import { getQRCode, registerWebhook } from '@/lib/whatsapp';

export const runtime = 'nodejs';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

/** GET — fetch QR code for initial pairing */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await getQRCode();
  return NextResponse.json(result);
}

/** POST — register webhook URL with Evolution API (run once after deploy) */
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const ok = await registerWebhook();
  return NextResponse.json({ success: ok });
}
