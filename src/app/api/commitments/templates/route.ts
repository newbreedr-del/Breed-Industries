/**
 * GET  /api/commitments/templates — list available onboarding templates
 * POST /api/commitments/templates — apply one to a client
 *   Body: { templateId, clientId?, clientName?, clientEmail?, clientPhone?, anchorDate? }
 * Protected by middleware (admin session required).
 */

import { NextRequest, NextResponse } from 'next/server';
import { listTemplates } from '@/lib/commitments/templates';
import { applyTemplate } from '@/lib/commitments/applyTemplate';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ ok: true, templates: listTemplates() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.templateId) {
      return NextResponse.json({ ok: false, error: { message: 'templateId is required' } }, { status: 400 });
    }
    const result = await applyTemplate(body);
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e.message } }, { status: 500 });
  }
}
