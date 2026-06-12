/**
 * POST /api/campaigns/[id]/contacts — import contacts from raw CSV text.
 *   Body: { csv: string }
 * Parses, normalises SA numbers, dedupes, and skips globally opted-out numbers.
 * Protected by middleware.
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseContactsCsv } from '@/lib/campaigns/csv';
import { importContacts } from '@/lib/campaigns/store';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { csv } = await req.json();
    if (!csv || typeof csv !== 'string') {
      return NextResponse.json({ ok: false, error: { message: 'csv text is required' } }, { status: 400 });
    }

    const parsed = parseContactsCsv(csv);
    const { inserted, optedOutSkipped } = await importContacts(id, parsed.contacts);

    return NextResponse.json({
      ok: true,
      parsed: parsed.contacts.length,
      inserted,
      invalidSkipped: parsed.skipped,
      duplicatesRemoved: parsed.duplicatesRemoved,
      optedOutSkipped,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}
