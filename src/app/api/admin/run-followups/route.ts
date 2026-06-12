/**
 * POST /api/admin/run-followups
 * Admin-panel button to run the client follow-up sweep on demand.
 * Auth via admin session (middleware). Optional ?digest=false to skip the digest.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runCommitmentFollowups } from '@/lib/commitments/followup';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const sendDigest = req.nextUrl.searchParams.get('digest') !== 'false';
  try {
    const result = await runCommitmentFollowups({ sendDigest });
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message } }, { status: 500 });
  }
}
