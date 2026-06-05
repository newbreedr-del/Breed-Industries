/**
 * GET /api/admin/test-scrape
 *
 * Diagnostic endpoint — shows exactly what the scraper fetches from
 * eTenders and each portal so we can see if requests are blocked,
 * redirected, or returning unexpected HTML.
 *
 * Admin session cookie required. Remove this route after debugging.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/adminAuth';

export const runtime = 'nodejs';

const TARGETS = [
  // eTenders new paths
  { label: 'eTenders /home/opportunity',       url: 'https://www.etenders.gov.za/home/opportunity' },
  { label: 'eTenders /home/tenders',           url: 'https://www.etenders.gov.za/home/tenders' },
  { label: 'eTenders API /tenders',            url: 'https://www.etenders.gov.za/api/tenders?limit=20' },
  { label: 'eTenders API /opportunities',      url: 'https://www.etenders.gov.za/api/opportunities?limit=20' },
  // Government Gazette / Tender Bulletin
  { label: 'Gov Gazette tender bulletin',      url: 'https://www.gpwonline.co.za/Gazettes/Pages/Published-Tender-Bulletin.aspx' },
  // SA tender aggregators
  { label: 'saha tendering',                   url: 'https://www.sahatendering.co.za/tenders' },
  { label: 'Tender portal (tender.co.za)',      url: 'https://tender.co.za/tenders' },
  { label: 'Tenders Online',                   url: 'https://www.tendersonline.co.za/tenders' },
  // CIDB
  { label: 'CIDB projects/tenders',            url: 'https://www.cidb.org.za/projects-tenders/' },
];

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = [];

  for (const target of TARGETS) {
    try {
      const res = await fetch(target.url, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; BreedTenderBot/1.0)',
        },
        signal: AbortSignal.timeout(12_000),
        redirect: 'follow',
      });

      const text = await res.text();
      const snippet = text.slice(0, 1200).replace(/\s+/g, ' ').trim();

      // Check if it looks like useful tender data or a block/redirect
      const hasTable    = /<table/i.test(text);
      const hasTr       = /<tr/i.test(text);
      const hasOddEven  = /class="(odd|even)"/i.test(text);
      const hasTender   = /tender/i.test(text);
      const isJson      = text.trim().startsWith('{') || text.trim().startsWith('[');
      const isLoginPage = /login|sign in|captcha|access denied/i.test(text);

      results.push({
        label:       target.label,
        url:         target.url,
        status:      res.status,
        contentType: res.headers.get('content-type'),
        finalUrl:    res.url,
        bodyLength:  text.length,
        hasTable,
        hasTr,
        hasOddEven,
        hasTender,
        isJson,
        isLoginPage,
        snippet,
      });
    } catch (err) {
      results.push({
        label:  target.label,
        url:    target.url,
        status: null,
        error:  String(err),
      });
    }
  }

  return NextResponse.json({ results }, { status: 200 });
}
