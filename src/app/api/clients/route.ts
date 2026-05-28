import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET /api/clients - List all clients
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const industry = searchParams.get('industry');
    
    let query = supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (industry) {
      query = query.eq('industry', industry);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ clients: data, total: data?.length || 0 });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create new client
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company_name, industry, notes } = body;
    
    if (!name || !industry) {
      return NextResponse.json(
        { error: 'Name and industry are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        name,
        email,
        phone,
        company_name,
        industry,
        notes,
        status: 'active'
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ client: data, success: true });
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create client' },
      { status: 500 }
    );
  }
}
