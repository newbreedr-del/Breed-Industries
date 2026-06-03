import { NextRequest, NextResponse } from 'next/server';
import { sendText } from '@/lib/whatsapp';

export const runtime = 'nodejs';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { phone, message } = await request.json();
    if (!phone || !message) {
      return NextResponse.json({ error: 'phone and message are required' }, { status: 400 });
    }
    const result = await sendText(phone, message);
    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
