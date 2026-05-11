/**
 * POST /api/admin/send-match-notification
 *
 * Sends a tender match alert email for a single, specific match.
 * Used from the tender detail page and client detail page
 * when admin wants to notify one client about one tender.
 *
 * Body: { match_id: string }
 */

import { NextRequest, NextResponse }                             from 'next/server';
import { isAuthenticated }                                        from '@/lib/adminAuth';
import { getMatchesForAdmin, markMatchNotified, logNotification } from '@/lib/tenderStorage';
import { sendTenderMatchEmail }                                   from '@/lib/tenderEmail';

export const runtime     = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { match_id } = await req.json();
    if (!match_id) {
      return NextResponse.json({ error: 'match_id is required' }, { status: 400 });
    }

    const matches = await getMatchesForAdmin({ limit: 1 });
    // getMatchesForAdmin doesn't filter by id directly, so filter after fetch
    // Instead, fetch by client+tender join with a broader query and filter
    const allForMatch = await getMatchesForAdmin({});
    const match = allForMatch.find(m => m.id === match_id);

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    if (!match.client || !match.tender) {
      return NextResponse.json({ error: 'Match is missing client or tender data' }, { status: 400 });
    }

    await sendTenderMatchEmail(
      match.client,
      match.tender,
      match.match_score,
      match.match_reasons ?? [],
    );

    await markMatchNotified(match.id);

    await logNotification({
      client_id:         match.client_id,
      tender_id:         match.tender_id,
      match_id:          match.id,
      notification_type: 'new_match',
      sent_to:           match.client.email,
    });

    return NextResponse.json({
      success: true,
      sent_to: match.client.email,
      tender:  match.tender.reference_number,
    });

  } catch (err) {
    console.error('send-match-notification error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to send notification' },
      { status: 500 },
    );
  }
}
