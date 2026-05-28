import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { serviceId } = await params;
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('crm_client_services')
      .update(body)
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ service: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; serviceId: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { serviceId } = await params;
    const { error } = await supabaseAdmin
      .from('crm_client_services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
