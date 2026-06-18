/**
 * Single source of truth for the "Book Strategy Call" link.
 *
 * Set NEXT_PUBLIC_BOOKING_URL in .env.local / Vercel to your real Calendly or
 * TidyCal scheduling link, e.g.:
 *   NEXT_PUBLIC_BOOKING_URL=https://calendly.com/breedindustries/strategy-call
 *   NEXT_PUBLIC_BOOKING_URL=https://tidycal.com/breedindustries/strategy-call
 *
 * Until that env var is set, the CTAs fall back to the WhatsApp booking flow so
 * nothing is ever a dead button.
 */
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ||
  "https://wa.me/27604964105?text=Hi%20Breed%20Industries!%20I'd%20like%20to%20book%20a%20strategy%20call.";
