export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabaseAdmin } from '@/lib/supabase';
import { sendText, formatPhone } from '@/lib/whatsapp';

const POSTER_IMAGE_URL = 'https://thebreed.co.za/assets/images/fpb-event-flyer.jpg';
const COMPANY_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';

// Hostinger SMTP transporter
const smtpTransporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SALES_EMAIL_USER ?? 'sales@thebreed.co.za',
    pass: process.env.SALES_EMAIL_PASSWORD ?? '',
  },
});

// Generate a unique booking reference
function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BREED-${timestamp.slice(-6)}${random}`;
}

// POST /api/book-seats - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, seats, seatCount } = body;

    // Validation
    if (!firstName || !lastName || !email || !seats || !Array.isArray(seats) || seats.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, and seats are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // ── Guard rails: prevent duplicate bookings by email or phone ──
    const { data: existingByEmail, error: dupEmailErr } = await supabaseAdmin
      .from('seat_bookings')
      .select('id, reference')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (dupEmailErr) {
      console.error('[Book Seats] Duplicate email check error:', dupEmailErr);
    }
    if (existingByEmail) {
      return NextResponse.json(
        { error: `This email already has a booking (Ref: ${existingByEmail.reference}). Contact us to modify your seats.` },
        { status: 409 }
      );
    }

    if (phone) {
      const { data: existingByPhone, error: dupPhoneErr } = await supabaseAdmin
        .from('seat_bookings')
        .select('id, reference')
        .eq('phone', phone)
        .maybeSingle();

      if (dupPhoneErr) {
        console.error('[Book Seats] Duplicate phone check error:', dupPhoneErr);
      }
      if (existingByPhone) {
        return NextResponse.json(
          { error: `This phone number already has a booking (Ref: ${existingByPhone.reference}). Contact us to modify your seats.` },
          { status: 409 }
        );
      }
    }

    const reference = generateReference();

    // Save booking to seat_bookings table
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
      console.error('[Book Seats] Booking insert error:', bookingError);
      return NextResponse.json(
        { error: 'Failed to save booking: ' + bookingError.message },
        { status: 500 }
      );
    }

    // Mark seats as reserved in reserved_seats table
    const reservedSeats = seats.map((seatId: string) => ({
      seat_id: seatId,
      booking_reference: reference,
    }));

    const { error: reservedError } = await supabaseAdmin
      .from('reserved_seats')
      .insert(reservedSeats);

    if (reservedError) {
      console.error('[Book Seats] Reserved seats insert error:', reservedError);
      // Don't fail the whole request if just the reserved seats part fails
      // The booking is already saved
    }

    // Send WhatsApp confirmation if phone provided
    if (phone) {
      const formattedPhone = formatPhone(phone);
      const whatsappMessage = 
        `🎭 *Breed Industries Event Booking Confirmed!*\n\n` +
        `Hi ${firstName}, your seats are reserved.\n\n` +
        `📅 Event: Breed Industries Special Event\n` +
        `🎟️ Reference: *${reference}*\n` +
        `💺 Seats: ${seats.join(', ')}\n\n` +
        `Check your email for full details.\n` +
        `See you there! 🎉\n\n` +
        `www.thebreed.co.za\n\n` +
        `_Breed Industries — 060 496 4105_`;

      // Send poster image first if Evolution API supports it, otherwise text only
      try {
        await sendText(formattedPhone, whatsappMessage);
      } catch (err) {
        console.error('[Book Seats] WhatsApp send error:', err);
        // Non-critical - don't fail the booking
      }
    }

    // Send email confirmation via Hostinger SMTP
    if (process.env.SALES_EMAIL_PASSWORD) {
      try {
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Seat Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0B1118;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B1118; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #121820; border-radius: 16px; border: 1px solid #1f2937; overflow: hidden;">
          <!-- Poster Image -->
          <tr>
            <td>
              <img src="${POSTER_IMAGE_URL}" alt="Breed Industries Event" style="width: 100%; height: auto; display: block;" />
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h1 style="color: #FF9F00; font-size: 24px; font-weight: 700; margin: 0 0 16px 0; text-align: center;">
                Thank you ${firstName}!
              </h1>
              
              <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0 0 8px 0; text-align: center;">
                Your seats are confirmed. We'll see you on the 1st! 🎉
              </p>

              <!-- Event Details Banner -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FF9F00; border-radius: 10px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="color: #0B1118; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0;">📅 Date &amp; Time</p>
                    <p style="color: #0B1118; font-size: 18px; font-weight: 800; margin: 0 0 14px 0;">Wednesday, 1 July 2026 — 10:00 AM</p>
                    <p style="color: #0B1118; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0;">📍 Venue</p>
                    <p style="color: #0B1118; font-size: 16px; font-weight: 700; margin: 0;">65 St Johns Avenue, Nisbett Rd, Pinetown, 3610</p>
                  </td>
                </tr>
              </table>
              
              <!-- Booking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B1118; border-radius: 12px; margin: 24px 0; border: 1px solid #1f2937;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Booking Reference</p>
                    <p style="color: #FF9F00; font-size: 20px; font-weight: 700; letter-spacing: 2px; margin: 0 0 20px 0;">${reference}</p>
                    
                    <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Your Seats</p>
                    <p style="color: #e5e7eb; font-size: 18px; font-weight: 600; margin: 0 0 20px 0;">${seats.join(', ')}</p>
                    
                    <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Name</p>
                    <p style="color: #e5e7eb; font-size: 16px; margin: 0 0 20px 0;">${firstName} ${lastName}</p>
                    
                    <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Email</p>
                    <p style="color: #e5e7eb; font-size: 16px; margin: 0;">${email}</p>
                    ${phone ? `<p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0 8px 0;">Phone</p><p style="color: #e5e7eb; font-size: 16px; margin: 0;">${phone}</p>` : ''}
                  </td>
                </tr>
              </table>
              
              <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0; text-align: center;">
                Please arrive 30 minutes early. Present your booking reference at the door.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0B1118; border-top: 1px solid #1f2937; text-align: center;">
              <p style="color: #FF9F00; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Breed Industries</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 4px 0;">060 496 4105</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">
                <a href="https://www.thebreed.co.za" style="color: #FF9F00; text-decoration: none;">www.thebreed.co.za</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        const info = await smtpTransporter.sendMail({
          from: `Breed Industries <${process.env.SALES_EMAIL_USER ?? 'sales@thebreed.co.za'}>`,
          to: email,
          bcc: COMPANY_EMAIL,
          subject: '🎟️ Your Seats Are Confirmed — The Future-Proof Business | 1 July 2026',
          html: emailHtml,
        });
        console.log('[Book Seats] Email sent:', info.messageId);
      } catch (err) {
        console.error('[Book Seats] Email send error:', err);
        // Non-critical - don't fail the booking
      }
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        reference: reference,
        firstName: firstName,
        lastName: lastName,
        email: email,
        seats: seats,
        seatCount: seatCount || seats.length,
      },
    }, { status: 201 });

  } catch (err: any) {
    console.error('[Book Seats] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error: ' + err.message },
      { status: 500 }
    );
  }
}

// GET /api/book-seats - List all reserved seat IDs
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('reserved_seats')
      .select('seat_id, booking_reference')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Book Seats] GET error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reserved seats' },
        { status: 500 }
      );
    }

    const reservedSeatIds = (data || []).map((r) => r.seat_id);

    return NextResponse.json({
      reservedSeats: reservedSeatIds,
      totalReserved: reservedSeatIds.length,
    });

  } catch (err: any) {
    console.error('[Book Seats] GET unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
