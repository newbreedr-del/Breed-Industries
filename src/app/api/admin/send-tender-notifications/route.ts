/**
 * POST /api/admin/send-tender-notifications
 *
 * Sends pending tender match emails to clients.
 * Only matches with status='new' and no notified_at are processed.
 * Admin reviews the queued matches in the dashboard and clicks this button
 * when ready — no emails are ever sent automatically by the scraper.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/adminAuth';
import {
  getUnnotifiedMatches,
  markMatchNotified,
  logNotification,
  wasAlreadyNotified,
} from '@/lib/tenderStorage';
import { sendTenderMatchEmail } from '@/lib/tenderEmail';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const matches = await getUnnotifiedMatches();

    if (matches.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: 'No pending notifications.' });
    }

    let sent    = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const match of matches) {
      if (!match.client || !match.tender) {
        skipped++;
        continue;
      }

      try {
        // Double-check we haven't already notified this pair
        const alreadyDone = await wasAlreadyNotified(match.client_id, match.tender_id, 'new_match');
        if (alreadyDone) {
          // Just mark it notified so it leaves the queue
          await markMatchNotified(match.id);
          skipped++;
          continue;
        }

        await sendTenderMatchEmail(
          match.client,
          match.tender,
          match.match_score,
          match.match_reasons ?? []
        );

        await markMatchNotified(match.id);

        await logNotification({
          client_id:         match.client_id,
          tender_id:         match.tender_id,
          match_id:          match.id,
          notification_type: 'new_match',
          sent_to:           match.client.email,
        });

        sent++;
      } catch (err) {
        errors.push(`${match.client?.email ?? match.client_id}: ${String(err).slice(0, 100)}`);
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      skipped,
      total:   matches.length,
      errors,
    });
  } catch (err) {
    console.error('Send notifications error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
