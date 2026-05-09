/**
 * POST /api/cron/scrape-tenders
 *
 * Called by Vercel Cron (vercel.json) twice daily.
 * Also callable manually from the admin panel with the secret header.
 *
 * Authorization: Bearer ${CRON_SECRET} header required.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runTenderScrapeAndMatch } from '@/lib/tenderScraper';
import {
  getMatchesForAdmin,
  getTenderClients,
  getTenders,
  logNotification,
} from '@/lib/tenderStorage';
import { sendClosingReminderEmail, sendWeeklyDigestEmail } from '@/lib/tenderEmail';

export const runtime = 'nodejs';
export const maxDuration = 60; // seconds — Vercel Pro allows up to 300

export async function POST(req: NextRequest) {
  // Auth check
  const secret = process.env.CRON_SECRET ?? '';
  const auth   = req.headers.get('authorization') ?? '';
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mode = req.nextUrl.searchParams.get('mode') ?? 'full';

  try {
    if (mode === 'digest') {
      await runWeeklyDigest();
      return NextResponse.json({ success: true, mode: 'digest' });
    }

    // Full scrape + match + notify
    const result = await runTenderScrapeAndMatch();

    // Also check for closing reminders (within 3 days)
    await sendClosingReminders();

    return NextResponse.json({
      success: true,
      mode:    'scrape',
      ...result,
    });
  } catch (error) {
    console.error('Cron scrape-tenders error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron failed' },
      { status: 500 }
    );
  }
}

// Also allow GET so Vercel Cron (which sends GET for scheduled jobs) works
export async function GET(req: NextRequest) {
  return POST(req);
}

// ─── Closing Reminders ───────────────────────────────────────

async function sendClosingReminders() {
  const in3Days = new Date(Date.now() + 3 * 86_400_000).toISOString();
  const now     = new Date().toISOString();

  const { tenders } = await getTenders({ status: 'open' });
  const closingSoon = tenders.filter(
    t => t.closing_date >= now && t.closing_date <= in3Days
  );

  for (const tender of closingSoon) {
    const matches = await getMatchesForAdmin({
      tender_id: tender.id,
    });

    for (const match of matches) {
      if (!match.client || ['won', 'lost', 'declined'].includes(match.status)) continue;

      // Only notify once per tender per client per closing reminder
      const { supabase } = await import('@/lib/supabase');
      const { count } = await supabase
        .from('tender_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', match.client_id)
        .eq('tender_id', tender.id)
        .eq('notification_type', 'closing_reminder');

      if ((count ?? 0) > 0) continue;

      try {
        await sendClosingReminderEmail(match.client, tender);
        await logNotification({
          client_id:         match.client_id,
          tender_id:         tender.id,
          match_id:          match.id,
          notification_type: 'closing_reminder',
          sent_to:           match.client.email,
        });
      } catch (err) {
        console.error('Closing reminder failed:', err);
      }
    }
  }
}

// ─── Weekly Digest ───────────────────────────────────────────

async function runWeeklyDigest() {
  const oneWeekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const oneWeekFwd = new Date(Date.now() + 7 * 86_400_000).toISOString();
  const now        = new Date().toISOString();

  const [{ tenders: allTenders }, clients] = await Promise.all([
    getTenders({ status: 'open' }),
    getTenderClients(true),
  ]);

  // New tenders this week
  const newTenders = allTenders.filter(t => t.created_at >= oneWeekAgo).length;

  // New matches this week
  const allMatches = await getMatchesForAdmin({ status: 'new' });
  const newMatches = allMatches.filter(m => m.created_at >= oneWeekAgo).length;

  // Tenders closing this week with matched clients
  const closingThisWeek: { tender: any; client: any }[] = [];
  for (const tender of allTenders) {
    if (tender.closing_date >= now && tender.closing_date <= oneWeekFwd) {
      const matches = await getMatchesForAdmin({ tender_id: tender.id });
      for (const m of matches) {
        if (m.client) closingThisWeek.push({ tender, client: m.client });
      }
    }
  }

  await sendWeeklyDigestEmail({ newTenders, newMatches, closingThisWeek });
}
