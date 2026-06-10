export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/admin/bookings - List all bookings
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('seat_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin Bookings] GET error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookings: data || [] });

  } catch (err: any) {
    console.error('[Admin Bookings] GET unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
