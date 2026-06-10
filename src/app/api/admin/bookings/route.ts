export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ADMIN-${timestamp.slice(-6)}${random}`;
}

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

// POST /api/admin/bookings - Admin creates a reservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, seats, seatCount } = body;

    if (!firstName || !lastName || !email || !seats || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const reference = generateReference();

    // Insert booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('seat_bookings')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        phone: phone || null,
        seats: seats.join(', '),
        seat_count: seatCount || seats.length,
        reference: reference,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('[Admin Bookings] POST error:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking: ' + bookingError.message },
        { status: 500 }
      );
    }

    // Mark seats as reserved
    const reservedSeats = seats.map((seatId: string) => ({
      seat_id: seatId,
      booking_reference: reference,
    }));

    const { error: reservedError } = await supabaseAdmin
      .from('reserved_seats')
      .insert(reservedSeats);

    if (reservedError) {
      console.error('[Admin Bookings] Reserved seats error:', reservedError);
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });

  } catch (err: any) {
    console.error('[Admin Bookings] POST unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/bookings?id=xxx - Delete a booking and free seats
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Get the booking reference to free up seats
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('seat_bookings')
      .select('reference')
      .eq('id', id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Delete from reserved_seats first
    const { error: deleteReservedError } = await supabaseAdmin
      .from('reserved_seats')
      .delete()
      .eq('booking_reference', booking.reference);

    if (deleteReservedError) {
      console.error('[Admin Bookings] Delete reserved seats error:', deleteReservedError);
    }

    // Delete the booking
    const { error: deleteError } = await supabaseAdmin
      .from('seat_bookings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('[Admin Bookings] DELETE error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Booking deleted' });

  } catch (err: any) {
    console.error('[Admin Bookings] DELETE unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
