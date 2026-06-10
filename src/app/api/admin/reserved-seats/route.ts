export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Generate a reference for manually added seats
function generateManualReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  return `MANUAL-${timestamp}`;
}

// POST /api/admin/reserved-seats - Add a reserved seat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seatId, reason } = body;

    if (!seatId || typeof seatId !== 'string') {
      return NextResponse.json(
        { error: 'Seat ID is required' },
        { status: 400 }
      );
    }

    // Check if seat is already reserved
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('reserved_seats')
      .select('seat_id')
      .eq('seat_id', seatId.trim().toUpperCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `Seat ${seatId} is already reserved` },
        { status: 409 }
      );
    }

    // Add to reserved_seats table
    const { error } = await supabaseAdmin
      .from('reserved_seats')
      .insert({
        seat_id: seatId.trim().toUpperCase(),
        booking_reference: generateManualReference(),
      });

    if (error) {
      console.error('[Admin Reserved Seats] POST error:', error);
      return NextResponse.json(
        { error: 'Failed to reserve seat: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: `Seat ${seatId} reserved` },
      { status: 201 }
    );

  } catch (err: any) {
    console.error('[Admin Reserved Seats] POST unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/reserved-seats - Release a seat or all seats
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seatId = searchParams.get('seatId');

    if (seatId) {
      // Release specific seat
      const { error } = await supabaseAdmin
        .from('reserved_seats')
        .delete()
        .eq('seat_id', seatId.trim().toUpperCase());

      if (error) {
        console.error('[Admin Reserved Seats] DELETE error:', error);
        return NextResponse.json(
          { error: 'Failed to release seat' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: `Seat ${seatId} released` },
        { status: 200 }
      );
    } else {
      // Clear all seats
      const { error } = await supabaseAdmin
        .from('reserved_seats')
        .delete()
        .neq('seat_id', ''); // Delete all (workaround for no-where delete)

      if (error) {
        console.error('[Admin Reserved Seats] DELETE all error:', error);
        return NextResponse.json(
          { error: 'Failed to clear all seats' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: 'All reserved seats cleared' },
        { status: 200 }
      );
    }

  } catch (err: any) {
    console.error('[Admin Reserved Seats] DELETE unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
