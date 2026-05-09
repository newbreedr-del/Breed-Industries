/**
 * POST /api/admin/run-scrape
 *
 * Admin-only endpoint to manually trigger the tender scrape.
 * Uses admin_session cookie auth (not CRON_SECRET) so it works
 * from the browser-based admin panel without exposing secrets.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/adminAuth';
import { runTenderScrapeAndMatch } from '@/lib/tenderScraper';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runTenderScrapeAndMatch();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Manual scrape error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scrape failed' },
      { status: 500 }
    );
  }
}
