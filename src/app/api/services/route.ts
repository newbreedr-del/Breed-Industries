import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET /api/services - List all services
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Group by category for easier frontend consumption
    const grouped = data?.reduce((acc: any, service: any) => {
      if (!acc[service.category]) acc[service.category] = [];
      acc[service.category].push(service);
      return acc;
    }, {});
    
    return NextResponse.json({
      services: data,
      grouped,
      categories: Object.keys(grouped || {}),
      total: data?.length || 0
    });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/services - Create new service (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, description, estimated_hours, priority } = body;
    
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase
      .from('services')
      .insert([{
        name,
        category,
        description,
        estimated_hours,
        priority: priority || 1,
        is_active: true
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ service: data, success: true });
  } catch (error: any) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create service' },
      { status: 500 }
    );
  }
}
