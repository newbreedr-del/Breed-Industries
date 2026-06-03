import { NextRequest, NextResponse } from 'next/server';
import { getConnectionState } from '@/lib/whatsapp';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [connectionState, messagesResult] = await Promise.all([
    getConnectionState(),
    supabaseAdmin
      .from('whatsapp_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  return NextResponse.json({
    connection: connectionState,
    messages: messagesResult.data ?? [],
    configured: !!(process.env.EVOLUTION_API_URL && process.env.EVOLUTION_API_KEY),
  });
}
