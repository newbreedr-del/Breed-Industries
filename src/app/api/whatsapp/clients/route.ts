import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { formatPhone } from '@/lib/whatsapp';

export const runtime = 'nodejs';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value;
  return !!(token && token.length >= 10);
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() ?? '';

  let query = supabaseAdmin
    .from('crm_clients')
    .select('id, company_name, contact_name, contact_email, contact_phone, status')
    .not('contact_phone', 'is', null)
    .order('company_name');

  if (q) {
    query = query.or(`company_name.ilike.%${q}%,contact_name.ilike.%${q}%,contact_phone.ilike.%${q}%`);
  }

  const { data, error } = await query.limit(30);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const clients = (data ?? []).map(c => ({
    ...c,
    phone_formatted: formatPhone(c.contact_phone),
  }));

  return NextResponse.json({ clients });
}
