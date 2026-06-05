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
export const maxDuration = 300; // Vercel Pro: up to 300s for long-running scrapes

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Hard wall-clock limit slightly under maxDuration so we always return a result
  const HARD_LIMIT_MS = 270_000;
  const deadline = Date.now() + HARD_LIMIT_MS;

  try {
    const result = await Promise.race([
      runTenderScrapeAndMatch(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Scrape timed out after 270s')), HARD_LIMIT_MS)
      ),
    ]);
    const elapsed = Math.round((Date.now() - (deadline - HARD_LIMIT_MS)) / 1000);
    return NextResponse.json({ success: true, elapsed_seconds: elapsed, ...result });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Scrape failed';
    console.error('Manual scrape error:', msg);
    // Return 200 with partial results info rather than 500, so the UI shows something
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
