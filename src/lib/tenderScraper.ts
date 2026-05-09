/**
 * Tender Scraper — eTenders + provincial portal
 *
 * Runs as a cron job via /api/cron/scrape-tenders
 * Fetches open tenders, scores them against active clients,
 * creates matches in Supabase, and queues email notifications.
 */

import {
  getTenderClients,
  upsertTender,
  createOrUpdateMatch,
  wasAlreadyNotified,
  markMatchNotified,
  logNotification,
  type TenderClient,
  type Tender,
} from '@/lib/tenderStorage';
import { sendTenderMatchEmail } from '@/lib/tenderEmail';

// ─── eTenders scraper ────────────────────────────────────────

interface ScrapedTender {
  reference_number: string;
  title: string;
  description?: string;
  department?: string;
  province?: string;
  category?: string;
  closing_date: string;
  briefing_date?: string;
  briefing_location?: string;
  source_url?: string;
  source: string;
  estimated_value?: number;
  required_cidb_grade?: string;
  commodity_codes: string[];
  documents_required: boolean;
  document_fee: number;
}

/**
 * Scrape the eTenders advertised tenders page.
 * The portal at etenders.gov.za lists tenders in a structured HTML table.
 * We parse the raw HTML to extract tender details.
 */
export async function scrapeETenders(): Promise<ScrapedTender[]> {
  const BASE = 'https://etenders.gov.za';
  const tenders: ScrapedTender[] = [];

  try {
    // eTenders search endpoint — returns paginated JSON when queried correctly
    const res = await fetch(
      `${BASE}/content/advertised-tenders?page=0`,
      {
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'User-Agent': 'Mozilla/5.0 (compatible; BreedTenderBot/1.0)',
        },
        signal: AbortSignal.timeout(15_000),
      }
    );

    if (!res.ok) {
      console.warn(`eTenders fetch returned ${res.status}`);
      return [];
    }

    const html = await res.text();

    // Extract table rows — eTenders renders a standard <table class="views-table">
    const rowPattern = /<tr[^>]*class="[^"]*(?:odd|even)[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const tagPattern  = /<[^>]+>/g;
    const hrefPattern = /href="([^"]+)"/i;

    let rowMatch: RegExpExecArray | null;
    while ((rowMatch = rowPattern.exec(html)) !== null) {
      const rowHtml = rowMatch[1];
      const cells: string[] = [];
      let cellMatch: RegExpExecArray | null;

      while ((cellMatch = cellPattern.exec(rowHtml)) !== null) {
        cells.push(cellMatch[1].replace(tagPattern, '').trim());
      }

      if (cells.length < 4) continue;

      // Typical eTenders columns: [ref, description, dept, closing, province, ...]
      const refRaw       = cells[0] || '';
      const titleRaw     = cells[1] || '';
      const deptRaw      = cells[2] || '';
      const closingRaw   = cells[3] || '';
      const provinceRaw  = cells[4] || '';

      if (!refRaw || !closingRaw) continue;

      // Extract URL from row
      const hrefMatch = hrefPattern.exec(rowHtml);
      const detailUrl = hrefMatch ? `${BASE}${hrefMatch[1]}` : undefined;

      // Parse closing date (format: dd/mm/yyyy HH:MM or similar)
      const closing = parseSADate(closingRaw);
      if (!closing) continue;

      tenders.push({
        reference_number: refRaw,
        title:            titleRaw || refRaw,
        department:       deptRaw  || undefined,
        province:         normaliseProvince(provinceRaw),
        closing_date:     closing,
        source_url:       detailUrl,
        source:           'etenders',
        commodity_codes:  [],
        documents_required: false,
        document_fee:     0,
      });
    }
  } catch (err) {
    console.error('eTenders scrape failed:', err);
  }

  return tenders;
}

/**
 * Attempt to scrape eTenders JSON API endpoint (unofficial but often available)
 */
export async function scrapeETendersJson(): Promise<ScrapedTender[]> {
  const tenders: ScrapedTender[] = [];
  try {
    const res = await fetch(
      'https://etenders.gov.za/index.php/tenders/advertised?format=json&limit=100',
      {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10_000),
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const items: any[] = Array.isArray(json) ? json : (json.items ?? json.data ?? []);

    for (const item of items) {
      const closing = parseSADate(item.closing_date || item.closingDate || item.closeDate || '');
      if (!closing) continue;
      tenders.push({
        reference_number: item.reference || item.ref_number || item.id?.toString() || `ET-${Date.now()}`,
        title:            item.title || item.description || 'Untitled Tender',
        description:      item.description,
        department:       item.institution || item.department,
        province:         normaliseProvince(item.province || item.region),
        category:         item.category,
        closing_date:     closing,
        briefing_date:    item.briefing_date ? parseSADate(item.briefing_date) ?? undefined : undefined,
        briefing_location: item.briefing_venue,
        source_url:       item.url,
        source:           'etenders',
        estimated_value:  item.value ? Math.round(Number(item.value) * 100) : undefined,
        required_cidb_grade: item.cidb_grade,
        commodity_codes:  item.commodity_codes ?? [],
        documents_required: !!item.documents_required,
        document_fee:     item.document_fee ? Math.round(Number(item.document_fee) * 100) : 0,
      });
    }
  } catch {
    // JSON API unavailable — fall back to HTML scrape
  }
  return tenders;
}

// ─── Match Engine ────────────────────────────────────────────

/**
 * Score a tender against a client profile (0–100).
 * Returns { score, reasons } or null if absolutely no match.
 */
export function scoreTenderForClient(
  tender: Tender | ScrapedTender,
  client: TenderClient
): { score: number; reasons: string[] } | null {
  let score = 0;
  const reasons: string[] = [];

  // 1. Province match (high weight — most tenders are regional)
  const tProvince = normaliseProvince(tender.province ?? '');
  if (!tProvince || client.provinces.length === 0) {
    score += 15; // national or unspecified
    reasons.push('National / province unspecified');
  } else if (client.provinces.some(p => p.toUpperCase() === tProvince.toUpperCase())) {
    score += 30;
    reasons.push(`Province match: ${tProvince}`);
  } else {
    return null; // Hard fail — wrong province entirely
  }

  // 2. Category / service category match
  const tCat = (tender.category ?? '').toLowerCase();
  const clientCats = client.service_categories.map(c => c.toLowerCase());
  if (tCat && clientCats.some(c => tCat.includes(c) || c.includes(tCat))) {
    score += 25;
    reasons.push(`Category match: ${tender.category}`);
  }

  // 3. Commodity code overlap
  const tCodes = tender.commodity_codes ?? [];
  const overlap = tCodes.filter(c => client.commodity_codes.includes(c));
  if (overlap.length > 0) {
    score += Math.min(20, overlap.length * 7);
    reasons.push(`Commodity codes: ${overlap.join(', ')}`);
  }

  // 4. CIDB grade eligibility
  const tGrade = (tender as any).required_cidb_grade ?? '';
  const cGrade = client.cidb_grade ?? '';
  if (!tGrade || !cGrade) {
    score += 10;
  } else {
    const tN = parseInt(tGrade.replace(/\D/g, ''), 10);
    const cN = parseInt(cGrade.replace(/\D/g, ''), 10);
    if (!isNaN(tN) && !isNaN(cN) && cN >= tN) {
      score += 15;
      reasons.push(`CIDB grade eligible (${cGrade} ≥ ${tGrade})`);
    } else {
      return null; // Below required grade
    }
  }

  // 5. Value within client's range
  const tVal = (tender as any).estimated_value;
  if (tVal && client.max_tender_value > 0 && tVal > client.max_tender_value) {
    score = Math.max(0, score - 20);
    reasons.push('Tender value may exceed client ceiling');
  }

  // 6. Keyword match on title/description
  const titleLower = tender.title.toLowerCase();
  const matchedKeywords = clientCats.filter(k => titleLower.includes(k));
  if (matchedKeywords.length > 0) {
    score += Math.min(10, matchedKeywords.length * 5);
    reasons.push(`Title keyword match: ${matchedKeywords.join(', ')}`);
  }

  // Minimum threshold
  if (score < 20 || reasons.length === 0) return null;

  return { score: Math.min(100, score), reasons };
}

// ─── Main Orchestrator ───────────────────────────────────────

export interface ScrapeResult {
  scraped:    number;
  newTenders: number;
  matches:    number;
  notified:   number;
  errors:     string[];
}

export async function runTenderScrapeAndMatch(): Promise<ScrapeResult> {
  const result: ScrapeResult = { scraped: 0, newTenders: 0, matches: 0, notified: 0, errors: [] };

  // 1. Fetch tenders (try JSON first, fall back to HTML)
  let scraped = await scrapeETendersJson();
  if (scraped.length === 0) scraped = await scrapeETenders();
  result.scraped = scraped.length;

  if (scraped.length === 0) {
    result.errors.push('No tenders scraped from eTenders portal');
    return result;
  }

  // 2. Upsert tenders into DB
  const savedTenders: Tender[] = [];
  for (const raw of scraped) {
    try {
      const saved = await upsertTender({
        reference_number:   raw.reference_number,
        title:              raw.title,
        description:        raw.description,
        department:         raw.department,
        province:           raw.province,
        category:           raw.category,
        commodity_codes:    raw.commodity_codes,
        estimated_value:    raw.estimated_value,
        required_cidb_grade: raw.required_cidb_grade,
        required_bee_level: undefined,
        issue_date:         undefined,
        closing_date:       raw.closing_date,
        briefing_date:      raw.briefing_date,
        briefing_location:  raw.briefing_location,
        source_url:         raw.source_url,
        source:             raw.source,
        status:             'open',
        documents_required: raw.documents_required,
        document_fee:       raw.document_fee,
        raw_data:           undefined,
      });
      savedTenders.push(saved);
      result.newTenders++;
    } catch (err) {
      result.errors.push(`Failed to save tender ${raw.reference_number}: ${String(err)}`);
    }
  }

  // 3. Load active clients
  const clients = await getTenderClients(true);
  if (clients.length === 0) return result;

  // 4. Score every tender against every client
  for (const tender of savedTenders) {
    for (const client of clients) {
      const scored = scoreTenderForClient(tender, client);
      if (!scored) continue;

      try {
        const match = await createOrUpdateMatch(tender.id, client.id, {
          match_score: scored.score,
          match_reasons: scored.reasons
        });
        result.matches++;

        // 5. Send email notification if not already notified
        if (match && !(await wasAlreadyNotified(client.id, tender.id, 'new_match'))) {
          try {
            await sendTenderMatchEmail(client, tender, scored.score, scored.reasons);
            await markMatchNotified(match.id);
            await logNotification({
              client_id:         client.id,
              tender_id:         tender.id,
              match_id:          match.id,
              notification_type: 'new_match',
              sent_to:           client.email,
            });
            result.notified++;
          } catch (emailErr) {
            result.errors.push(`Email failed for ${client.email}: ${String(emailErr)}`);
          }
        }
      } catch (matchErr) {
        result.errors.push(`Match error ${tender.id}/${client.id}: ${String(matchErr)}`);
      }
    }
  }

  return result;
}

// ─── Helpers ─────────────────────────────────────────────────

function parseSADate(raw: string): string | null {
  if (!raw) return null;
  // Formats: "26 May 2025 11:00", "26/05/2025", "2025-05-26"
  const iso = /^\d{4}-\d{2}-\d{2}/.test(raw);
  if (iso) return new Date(raw).toISOString();

  const slash = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(raw);
  if (slash) {
    const [, d, m, y] = slash;
    return new Date(`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`).toISOString();
  }

  const textDate = Date.parse(raw);
  if (!isNaN(textDate)) return new Date(textDate).toISOString();

  return null;
}

export function normaliseProvince(raw: string): string {
  const map: Record<string, string> = {
    'kwazulu-natal': 'KZN', 'kzn': 'KZN', 'kwazulu natal': 'KZN',
    'gauteng': 'GP', 'gp': 'GP',
    'western cape': 'WC', 'wc': 'WC',
    'eastern cape': 'EC', 'ec': 'EC',
    'limpopo': 'LP', 'lp': 'LP',
    'mpumalanga': 'MP', 'mp': 'MP',
    'north west': 'NW', 'nw': 'NW',
    'free state': 'FS', 'fs': 'FS',
    'northern cape': 'NC', 'nc': 'NC',
    'national': 'NAT',
  };
  const key = raw.toLowerCase().trim();
  return map[key] ?? raw.toUpperCase().trim();
}
