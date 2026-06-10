export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendText } from '@/lib/whatsapp';

const DEFAULT_TEMPLATE =
  `Hi {{name}} 👋\n\n` +
  `This is a friendly reminder about *The Future Proof Business* event.\n\n` +
  `🎟️ Booking Ref: *{{reference}}*\n` +
  `💺 Your Seats: {{seats}}\n\n` +
  `Please arrive 30 minutes early and have your booking reference ready at the door.\n\n` +
  `See you there! 🎉\n\n` +
  `_Breed Industries — 060 496 4105_`;

function fillTemplate(
  template: string,
  booking: { first_name: string; last_name: string; reference: string; seats: string },
): string {
  return template
    .replace(/\{\{name\}\}/g, booking.first_name)
    .replace(/\{\{fullName\}\}/g, `${booking.first_name} ${booking.last_name}`)
    .replace(/\{\{reference\}\}/g, booking.reference)
    .replace(/\{\{seats\}\}/g, booking.seats);
}

// POST /api/admin/bookings/remind
// Body: { id?: string, message?: string }
//  - id provided  -> send to that single booking
//  - id omitted   -> send to ALL bookings that have a phone number
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, message } = body as { id?: string; message?: string };
    const template = (message && message.trim()) || DEFAULT_TEMPLATE;

    // Build query
    let query = supabaseAdmin
      .from('seat_bookings')
      .select('id, first_name, last_name, phone, seats, reference');

    if (id) query = query.eq('id', id);

    const { data: bookings, error } = await query;

    if (error) {
      console.error('[Bookings Remind] Fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ error: 'No bookings found' }, { status: 404 });
    }

    const results: { id: string; name: string; success: boolean; error?: string }[] = [];
    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const b of bookings) {
      if (!b.phone) {
        skipped++;
        results.push({ id: b.id, name: `${b.first_name} ${b.last_name}`, success: false, error: 'No phone number' });
        continue;
      }

      const text = fillTemplate(template, b);
      const res = await sendText(b.phone, text);

      if (res.success) {
        sent++;
        results.push({ id: b.id, name: `${b.first_name} ${b.last_name}`, success: true });
      } else {
        failed++;
        results.push({ id: b.id, name: `${b.first_name} ${b.last_name}`, success: false, error: res.error });
      }
    }

    return NextResponse.json({
      success: true,
      summary: { total: bookings.length, sent, skipped, failed },
      results,
    });

  } catch (err: any) {
    console.error('[Bookings Remind] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
