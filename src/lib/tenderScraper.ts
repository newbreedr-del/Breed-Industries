/**
 * Tender Scraper — Multi-source SA Government
 *
 * Strategy:
 *  1. WordPress REST API  — clean JSON from WP-based department sites
 *  2. HTML table scrape   — tabular listings on non-WP portals
 *  3. WordPress post scan — free-text WP pages that embed tender details
 *
 * Sources covered:
 *  National departments (DIRCO, DPW, DPSA, NT, COGTA, DBE, DOH, DTIC, DWS, DSD)
 *  SOEs / parastatals (SANRAL, Eskom, Transnet, PRASA)
 *  Provincial (KZN, GP, WC, EC, LP)
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

// ─── Types ────────────────────────────────────────────────────

export interface ScrapedTender {
  reference_number: string;
  title: string;
  description?: string;
  department?: string;
  province?: string;
  category?: string;
  closing_date: string;
  source_url?: string;
  source: string;
  estimated_value?: number;
  required_cidb_grade?: string;
  commodity_codes: string[];
  documents_required: boolean;
  document_fee: number;
}

// ─── Source registry ─────────────────────────────────────────

interface Source {
  label:    string;
  domain:   string;
  province: string;
  strategy: 'wp-api' | 'html-table' | 'wp-post-scan';
  url:      string;
  /** Optional: WP category slug or ID to filter by */
  wpCategory?: string;
}

const SOURCES: Source[] = [
  // ── National departments (WordPress REST API) ──────────────
  {
    label: 'DIRCO', domain: 'dirco.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://dirco.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'DPW', domain: 'publicworks.gov.za', province: 'NAT',
    strategy: 'wp-post-scan',
    url: 'http://www.publicworks.gov.za/tenders.html',
  },
  {
    label: 'DPSA', domain: 'dpsa.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.dpsa.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'National Treasury', domain: 'treasury.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.treasury.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'COGTA', domain: 'cogta.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://cogta.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'DBE', domain: 'education.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.education.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'DOH', domain: 'health.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.health.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'DTIC', domain: 'thedti.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.thedti.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'DWS', domain: 'dws.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.dws.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'DSD', domain: 'dsd.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.dsd.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'DoT', domain: 'transport.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.transport.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'DCDT', domain: 'dcdt.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.dcdt.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  // ── SOEs / Parastatals ────────────────────────────────────
  {
    label: 'SANRAL', domain: 'sanral.co.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.sanral.co.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'PRASA', domain: 'prasa.com', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.prasa.com/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'NHBRC', domain: 'nhbrc.org.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.nhbrc.org.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'DBSA', domain: 'dbsa.org', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.dbsa.org/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  // ── Provincial ───────────────────────────────────────────
  {
    label: 'KZN Treasury', domain: 'treasury.kzntl.gov.za', province: 'KZN',
    strategy: 'wp-api',
    url: 'https://treasury.kzntl.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'KZN Health', domain: 'kznhealth.gov.za', province: 'KZN',
    strategy: 'wp-api',
    url: 'https://www.kznhealth.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'GP Treasury', domain: 'treasury.gpg.gov.za', province: 'GP',
    strategy: 'wp-api',
    url: 'https://treasury.gpg.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'Gauteng DID', domain: 'did.gpg.gov.za', province: 'GP',
    strategy: 'wp-api',
    url: 'https://www.did.gpg.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'Western Cape Gov', domain: 'westerncape.gov.za', province: 'WC',
    strategy: 'wp-api',
    url: 'https://www.westerncape.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'Eastern Cape Gov', domain: 'ecprov.gov.za', province: 'EC',
    strategy: 'wp-api',
    url: 'https://www.ecprov.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'Limpopo Gov', domain: 'limpopo.gov.za', province: 'LP',
    strategy: 'wp-api',
    url: 'https://www.limpopo.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'Mpumalanga Gov', domain: 'mpumalanga.gov.za', province: 'MP',
    strategy: 'wp-api',
    url: 'https://www.mpumalanga.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'North West Gov', domain: 'nwpg.gov.za', province: 'NW',
    strategy: 'wp-api',
    url: 'https://www.nwpg.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'Free State Gov', domain: 'freestate.gov.za', province: 'FS',
    strategy: 'wp-api',
    url: 'https://www.freestate.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'Northern Cape Gov', domain: 'northern-cape.gov.za', province: 'NC',
    strategy: 'wp-api',
    url: 'https://www.northern-cape.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  // ── HTML post-scan (DIRCO-style free text pages) ──────────
  {
    label: 'DIRCO HTML', domain: 'dirco.gov.za', province: 'NAT',
    strategy: 'wp-post-scan',
    url: 'https://dirco.gov.za/tenders/',
  },
];

// ─── Strategy: WordPress REST API ───────────────────────────

async function scrapeWpApi(source: Source): Promise<ScrapedTender[]> {
  const tenders: ScrapedTender[] = [];
  try {
    const res = await fetch(source.url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; BreedTenderBot/1.0)',
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];

    // Some WP sites return HTTP 200 with an HTML error body — guard before parsing.
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) return [];

    const posts: any[] = await res.json();
    if (!Array.isArray(posts)) return [];

    for (const post of posts) {
      const rawContent = stripHtml(post.content?.rendered ?? '');
      const rawTitle   = stripHtml(post.title?.rendered ?? '');
      const combined   = `${rawTitle} ${rawContent}`;

      // Only process posts that actually talk about tenders/bids/procurement
      if (!/tender|bid|rfq|rfp|procurement|quotation/i.test(combined)) continue;

      // Try to extract closing date from content
      const closing = extractDate(combined) ?? futureDate(30);

      // Extract reference number
      const ref = extractRef(combined) ?? `${source.label.toUpperCase().replace(/\s+/g, '-')}-WP-${post.id}`;

      // Extract CIDB grade if mentioned
      const cidb = extractCidb(combined);

      // Extract estimated value
      const value = extractValue(combined);

      tenders.push({
        reference_number:    ref,
        title:               rawTitle || `${source.label} Tender`,
        description:         rawContent.slice(0, 800),
        department:          source.label,
        province:            source.province,
        category:            inferCategory(combined),
        closing_date:        closing,
        source_url:          post.link ?? `https://${source.domain}`,
        source:              source.domain,
        estimated_value:     value,
        required_cidb_grade: cidb,
        commodity_codes:     [],
        documents_required:  /document|specification|compulsory/i.test(combined),
        document_fee:        0,
      });
    }
  } catch (err) {
    console.warn(`[${source.label}] WP API failed:`, String(err).slice(0, 120));
  }
  return tenders;
}

// ─── Strategy: HTML post-scan (DIRCO-style) ─────────────────

async function scrapeWpPostScan(source: Source): Promise<ScrapedTender[]> {
  const tenders: ScrapedTender[] = [];
  try {
    const res = await fetch(source.url, {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; BreedTenderBot/1.0)',
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];

    const html = await res.text();
    const text = stripHtml(html);

    // Split by known tender block separators
    // DIRCO uses "Date:" and ref numbers like "DIRCO 01 2026-2027"
    const refPattern = /([A-Z][A-Z0-9\/\-\s]{3,40}(?:\d{4}(?:[\/\-]\d{2,4})?))[\s:–-]/g;
    const blocks: string[] = [];

    // Extract paragraphs of text that contain "tender" or "bid"
    const paraPattern = /(?:tender|bid|rfq|rfp|procurement)[^.]{20,600}\./gi;
    let m: RegExpExecArray | null;
    while ((m = paraPattern.exec(text)) !== null) {
      blocks.push(m[0]);
    }

    // Also try to extract structured blocks around reference numbers
    let refMatch: RegExpExecArray | null;
    while ((refMatch = refPattern.exec(text)) !== null) {
      const start = Math.max(0, refMatch.index - 50);
      const end   = Math.min(text.length, refMatch.index + 600);
      const block = text.slice(start, end);
      if (/tender|bid|service|closing/i.test(block)) {
        blocks.push(block);
      }
    }

    // De-duplicate by first 80 chars
    const seen = new Set<string>();
    for (const block of blocks) {
      const key = block.slice(0, 80);
      if (seen.has(key)) continue;
      seen.add(key);

      const closing = extractDate(block) ?? futureDate(30);
      const ref     = extractRef(block) ?? `${source.label.toUpperCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const cidb    = extractCidb(block);
      const value   = extractValue(block);

      // Clean up the title: take first meaningful sentence
      const title = block.replace(/\s+/g, ' ').trim().slice(0, 160).split(/[.\n]/)[0].trim();
      if (!title || title.length < 10) continue;

      tenders.push({
        reference_number:    ref,
        title,
        description:         block.slice(0, 800),
        department:          source.label,
        province:            source.province,
        category:            inferCategory(block),
        closing_date:        closing,
        source_url:          source.url,
        source:              source.domain,
        estimated_value:     value,
        required_cidb_grade: cidb,
        commodity_codes:     [],
        documents_required:  /document|specification|compulsory/i.test(block),
        document_fee:        0,
      });
    }
  } catch (err) {
    console.warn(`[${source.label}] HTML scan failed:`, String(err).slice(0, 120));
  }
  return tenders;
}

// ─── Orchestrate all sources ─────────────────────────────────

export async function scrapeAllSources(): Promise<ScrapedTender[]> {
  // Run all sources in parallel, capped at 6 concurrent
  const results: ScrapedTender[] = [];
  const BATCH = 6;

  for (let i = 0; i < SOURCES.length; i += BATCH) {
    const batch = SOURCES.slice(i, i + BATCH);
    const batched = await Promise.allSettled(
      batch.map(src => {
        if (src.strategy === 'wp-api')        return scrapeWpApi(src);
        if (src.strategy === 'wp-post-scan')  return scrapeWpPostScan(src);
        return Promise.resolve([]);
      })
    );
    for (const r of batched) {
      if (r.status === 'fulfilled') results.push(...r.value);
    }
  }

  // De-duplicate by reference number
  const seen = new Set<string>();
  return results.filter(t => {
    const key = t.reference_number.trim().toUpperCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Match Engine ────────────────────────────────────────────

export function scoreTenderForClient(
  tender: Tender | ScrapedTender,
  client: TenderClient
): { score: number; reasons: string[] } | null {
  let score = 0;
  const reasons: string[] = [];

  // 1. Province match
  const tProvince = normaliseProvince(tender.province ?? '');
  if (!tProvince || tProvince === 'NAT' || client.provinces.length === 0) {
    score += 15;
    reasons.push('National / province unspecified');
  } else if (client.provinces.some(p => p.toUpperCase() === tProvince.toUpperCase())) {
    score += 30;
    reasons.push(`Province match: ${tProvince}`);
  } else {
    return null; // Hard fail — wrong province
  }

  // 2. Category match
  const tCat = (tender.category ?? '').toLowerCase();
  const clientCats = client.service_categories.map(c => c.toLowerCase());
  if (tCat && clientCats.some(c => tCat.includes(c) || c.includes(tCat))) {
    score += 25;
    reasons.push(`Category match: ${tender.category}`);
  }

  // 3. Keyword match in title / description
  const contentLower = `${tender.title} ${(tender as any).description ?? ''}`.toLowerCase();
  const matchedKeywords = clientCats.filter(k => contentLower.includes(k));
  if (matchedKeywords.length > 0) {
    score += Math.min(15, matchedKeywords.length * 5);
    reasons.push(`Keyword match: ${matchedKeywords.slice(0, 3).join(', ')}`);
  }

  // 4. Commodity code overlap
  const tCodes  = tender.commodity_codes ?? [];
  const overlap = tCodes.filter(c => client.commodity_codes.includes(c));
  if (overlap.length > 0) {
    score += Math.min(20, overlap.length * 7);
    reasons.push(`Commodity codes: ${overlap.join(', ')}`);
  }

  // 5. CIDB grade eligibility
  const tGrade = (tender as any).required_cidb_grade ?? '';
  const cGrade = client.cidb_grade ?? '';
  if (tGrade && cGrade) {
    const tN = parseInt(tGrade.replace(/\D/g, ''), 10);
    const cN = parseInt(cGrade.replace(/\D/g, ''), 10);
    if (!isNaN(tN) && !isNaN(cN)) {
      if (cN >= tN) {
        score += 15;
        reasons.push(`CIDB grade eligible (${cGrade} ≥ ${tGrade})`);
      } else {
        return null; // Below required grade
      }
    }
  } else {
    score += 10;
  }

  // 6. Value ceiling
  const tVal = (tender as any).estimated_value;
  if (tVal && client.max_tender_value > 0 && tVal > client.max_tender_value) {
    score = Math.max(0, score - 20);
    reasons.push('Tender value may exceed client ceiling');
  }

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

  // 1. Scrape all sources
  const scraped = await scrapeAllSources();
  result.scraped = scraped.length;

  if (scraped.length === 0) {
    result.errors.push('No tenders found across all sources');
    return result;
  }

  // 2. Upsert into DB
  const savedTenders: Tender[] = [];
  for (const raw of scraped) {
    try {
      const saved = await upsertTender({
        reference_number:    raw.reference_number,
        title:               raw.title,
        description:         raw.description,
        department:          raw.department,
        province:            raw.province,
        category:            raw.category,
        commodity_codes:     raw.commodity_codes,
        estimated_value:     raw.estimated_value,
        required_cidb_grade: raw.required_cidb_grade,
        required_bee_level:  undefined,
        issue_date:          undefined,
        closing_date:        raw.closing_date,
        briefing_date:       undefined,
        briefing_location:   undefined,
        source_url:          raw.source_url,
        source:              raw.source,
        status:              'open',
        documents_required:  raw.documents_required,
        document_fee:        raw.document_fee,
        raw_data:            undefined,
      });
      savedTenders.push(saved);
      result.newTenders++;
    } catch (err) {
      result.errors.push(`Save failed (${raw.reference_number}): ${String(err).slice(0, 80)}`);
    }
  }

  // 3. Load active clients
  let clients: TenderClient[];
  try {
    clients = await getTenderClients(true);
  } catch (clientErr) {
    result.errors.push(`Failed to load clients: ${String(clientErr).slice(0, 120)}`);
    return result;
  }
  if (clients.length === 0) return result;

  // 4. Score + notify
  for (const tender of savedTenders) {
    for (const client of clients) {
      const scored = scoreTenderForClient(tender, client);
      if (!scored) continue;

      try {
        const match = await createOrUpdateMatch(tender.id, client.id, {
          match_score:   scored.score,
          match_reasons: scored.reasons,
        });
        result.matches++;

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
            result.errors.push(`Email failed (${client.email}): ${String(emailErr).slice(0, 80)}`);
          }
        }
      } catch (matchErr) {
        result.errors.push(`Match error (${tender.id}): ${String(matchErr).slice(0, 80)}`);
      }
    }
  }

  return result;
}

// ─── Helpers ─────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractDate(text: string): string | null {
  // "05 May 2026", "2026-05-05", "05/05/2026", "closing date: 5 May 2026"
  const patterns = [
    /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
    /(\d{4})-(\d{2})-(\d{2})/,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
  ];

  for (const pat of patterns) {
    const m = pat.exec(text);
    if (!m) continue;
    const d = new Date(m[0]);
    if (!isNaN(d.getTime()) && d > new Date()) return d.toISOString();
  }
  return null;
}

function extractRef(text: string): string | null {
  // Patterns like: "DIRCO 01 2026-2027", "RFQ/2026/001", "BID NO. ABC/123/2026"
  const patterns = [
    /\b([A-Z]{2,10}[\s\/\-]\d{2,4}[\s\/\-]\d{4}(?:[\/\-]\d{2,4})?)\b/,
    /\b((?:BID|RFQ|RFP|EOI|SCM|QUO|TEN)[\s\/\-]?(?:NO\.?\s*)?[A-Z0-9\/\-]{4,20})\b/i,
    /\b([A-Z]{2,6}[-\/]\d{3,6}[-\/]\d{4})\b/,
  ];
  for (const pat of patterns) {
    const m = pat.exec(text);
    if (m) return m[1].trim();
  }
  return null;
}

function extractCidb(text: string): string | undefined {
  const m = /\b(\d[A-Z]{2}[A-Z]?)\b/.exec(text) ??
            /CIDB\s+grade\s+(\d)/i.exec(text) ??
            /grade\s+(\d)/i.exec(text);
  return m ? m[1] : undefined;
}

function extractValue(text: string): number | undefined {
  // "R 2,500,000", "R2.5 million", "R500 000"
  const m = /R\s?(\d[\d\s,]*(?:\.\d+)?)\s*(million|mil|m\b)?/i.exec(text);
  if (!m) return undefined;
  const num   = parseFloat(m[1].replace(/[\s,]/g, ''));
  const multi = /million|mil|\bm\b/i.test(m[2] ?? '') ? 1_000_000 : 1;
  const rands = num * multi;
  return Math.round(rands * 100); // stored in cents
}

function inferCategory(text: string): string | undefined {
  const cats: [RegExp, string][] = [
    [/construction|building|civils|earthworks|roads|structural/i, 'Construction'],
    [/electrical|wiring|solar|power|energy/i, 'Electrical'],
    [/plumbing|sanitation|water|sewage/i, 'Wet Services – Building'],
    [/cleaning|hygiene|janitorial/i, 'Cleaning & Hygiene'],
    [/security|guard|surveillance|cctv/i, 'Security Services'],
    [/IT|software|network|ICT|computer|system/i, 'ICT Hardware & Equipment'],
    [/catering|food|beverage/i, 'Catering & Food Services'],
    [/consult|advisory|professional|audit/i, 'Professional & Consulting Services'],
    [/transport|fleet|vehicle|logistics/i, 'Transport & Logistics'],
    [/health|medical|pharmaceutical|clinic/i, 'Healthcare Services'],
    [/training|education|learning/i, 'Training & Skills Development'],
    [/printing|stationery|paper/i, 'Printing & Stationery'],
    [/landscaping|garden|horticulture/i, 'Landscaping & Horticulture'],
    [/waste|refuse|recycling/i, 'Waste Management'],
    [/marketing|advertising|branding/i, 'Advertising & Marketing'],
    [/legal|attorney|advocate/i, 'Legal Services'],
  ];
  for (const [re, cat] of cats) {
    if (re.test(text)) return cat;
  }
  return undefined;
}

function futureDate(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString();
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
    'national': 'NAT', 'nat': 'NAT',
  };
  const key = (raw ?? '').toLowerCase().trim();
  return map[key] ?? raw.toUpperCase().trim();
}
