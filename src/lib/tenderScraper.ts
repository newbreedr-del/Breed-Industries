/**
 * Tender Scraper — Multi-source SA Government
 *
 * Strategy:
 *  1. wp-api       — WordPress REST API (only for verified WP sites)
 *  2. html-scan    — generic HTML scraping for any tender listing page
 *  3. rss          — RSS/Atom feed parsing
 *
 * Sources covered:
 *  National departments, SOEs/parastatals, Municipalities, Provincial
 *
 * NOTE: eTenders (etenders.gov.za) is an Angular SPA — never scrape it directly.
 * Use /api/admin/run-scrape from the admin panel to trigger manually.
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
  /**
   * wp-api      — WordPress REST API (JSON). Only use for verified WP sites.
   * html-scan   — Generic HTML scrape of any tender listing page.
   * rss         — RSS/Atom feed parser.
   */
  strategy: 'wp-api' | 'html-scan' | 'rss';
  url:      string;
}

const SOURCES: Source[] = [

  // ════════════════════════════════════════════════════════════
  // NATIONAL DEPARTMENTS — html-scan on their actual /tenders pages
  // ════════════════════════════════════════════════════════════
  {
    label: 'DPW', domain: 'publicworks.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'http://www.publicworks.gov.za/tenders.html',
  },
  {
    label: 'DIRCO', domain: 'dirco.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://dirco.gov.za/tenders/',
  },
  {
    label: 'DPSA', domain: 'dpsa.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.dpsa.gov.za/content/tenders',
  },
  {
    label: 'National Treasury', domain: 'treasury.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.treasury.gov.za/tender-opportunities/',
  },
  {
    label: 'COGTA', domain: 'cogta.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://cogta.gov.za/tenders/',
  },
  {
    label: 'DBE', domain: 'education.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.education.gov.za/tenders/',
  },
  {
    label: 'DOH', domain: 'health.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.health.gov.za/tenders/',
  },
  {
    label: 'DTIC', domain: 'thedti.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.thedti.gov.za/tenders/',
  },
  {
    label: 'DWS', domain: 'dws.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.dws.gov.za/tenders/',
  },
  {
    label: 'DSD', domain: 'dsd.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.dsd.gov.za/tenders/',
  },
  {
    label: 'DoT', domain: 'transport.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.transport.gov.za/tenders/',
  },
  {
    label: 'DCDT', domain: 'dcdt.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.dcdt.gov.za/tenders/',
  },
  {
    label: 'DALRRD', domain: 'dalrrd.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.dalrrd.gov.za/Tenders',
  },
  {
    label: 'DoD / ARMSCOR', domain: 'armscor.co.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.armscor.co.za/tenders/',
  },
  {
    label: 'DoJ', domain: 'justice.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.justice.gov.za/tenders/',
  },
  {
    label: 'SAPS', domain: 'saps.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.saps.gov.za/about/stratframework/tenders/',
  },
  {
    label: 'DHS', domain: 'dhs.gov.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.dhs.gov.za/tenders',
  },

  // ════════════════════════════════════════════════════════════
  // SOEs / PARASTATALS
  // ════════════════════════════════════════════════════════════
  {
    label: 'SANRAL', domain: 'sanral.co.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.sanral.co.za/tenders/',
  },
  {
    label: 'PRASA', domain: 'prasa.com', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.prasa.com/tenders/',
  },
  {
    label: 'NHBRC', domain: 'nhbrc.org.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.nhbrc.org.za/tenders/',
  },
  {
    label: 'DBSA', domain: 'dbsa.org', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.dbsa.org/tenders',
  },
  {
    label: 'SITA', domain: 'sita.co.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.sita.co.za/about-sita/tenders/',
  },
  {
    label: 'CSIR', domain: 'csir.co.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.csir.co.za/procurement',
  },
  {
    label: 'Transnet', domain: 'transnet.net', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.transnet.net/TendersAndContracts/',
  },
  {
    label: 'Land Bank', domain: 'landbank.co.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.landbank.co.za/tenders/',
  },
  {
    label: 'NHFC', domain: 'nhfc.co.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.nhfc.co.za/tenders/',
  },
  {
    label: 'IDC', domain: 'idc.co.za', province: 'NAT',
    strategy: 'html-scan',
    url: 'https://www.idc.co.za/tenders/',
  },

  // ════════════════════════════════════════════════════════════
  // PROVINCIAL PORTALS
  // ════════════════════════════════════════════════════════════
  {
    label: 'KZN Treasury', domain: 'treasury.kzntl.gov.za', province: 'KZN',
    strategy: 'html-scan',
    url: 'https://treasury.kzntl.gov.za/tenders/',
  },
  {
    label: 'KZN Health', domain: 'kznhealth.gov.za', province: 'KZN',
    strategy: 'html-scan',
    url: 'https://www.kznhealth.gov.za/tenders.htm',
  },
  {
    label: 'KZN DPW', domain: 'kznpw.gov.za', province: 'KZN',
    strategy: 'html-scan',
    url: 'https://www.kznpw.gov.za/Tenders',
  },
  {
    label: 'GP Treasury', domain: 'treasury.gpg.gov.za', province: 'GP',
    strategy: 'html-scan',
    url: 'https://treasury.gpg.gov.za/tenders/',
  },
  {
    label: 'Gauteng DID', domain: 'did.gpg.gov.za', province: 'GP',
    strategy: 'html-scan',
    url: 'https://www.did.gpg.gov.za/tenders/',
  },
  {
    label: 'Gauteng Health', domain: 'health.gpg.gov.za', province: 'GP',
    strategy: 'html-scan',
    url: 'https://www.health.gpg.gov.za/tenders/',
  },
  {
    label: 'Western Cape Gov', domain: 'westerncape.gov.za', province: 'WC',
    strategy: 'html-scan',
    url: 'https://www.westerncape.gov.za/tenders/',
  },
  {
    label: 'Eastern Cape Gov', domain: 'ecprov.gov.za', province: 'EC',
    strategy: 'html-scan',
    url: 'https://www.ecprov.gov.za/tenders/',
  },
  {
    label: 'Limpopo Gov', domain: 'limpopo.gov.za', province: 'LP',
    strategy: 'html-scan',
    url: 'https://www.limpopo.gov.za/tenders/',
  },
  {
    label: 'Mpumalanga Gov', domain: 'mpumalanga.gov.za', province: 'MP',
    strategy: 'html-scan',
    url: 'https://www.mpumalanga.gov.za/tenders/',
  },
  {
    label: 'North West Gov', domain: 'nwpg.gov.za', province: 'NW',
    strategy: 'html-scan',
    url: 'https://www.nwpg.gov.za/tenders/',
  },
  {
    label: 'Free State Gov', domain: 'freestate.gov.za', province: 'FS',
    strategy: 'html-scan',
    url: 'https://www.freestate.gov.za/tenders/',
  },
  {
    label: 'Northern Cape Gov', domain: 'northern-cape.gov.za', province: 'NC',
    strategy: 'html-scan',
    url: 'https://www.northern-cape.gov.za/tenders/',
  },

  // ════════════════════════════════════════════════════════════
  // MUNICIPALITIES — major metros
  // ════════════════════════════════════════════════════════════
  {
    label: 'City of Johannesburg', domain: 'joburg.org.za', province: 'GP',
    strategy: 'html-scan',
    url: 'https://www.joburg.org.za/work_/Pages/Tenders/Active-Tenders.aspx',
  },
  {
    label: 'Ekurhuleni Metro', domain: 'ekurhuleni.gov.za', province: 'GP',
    strategy: 'html-scan',
    url: 'https://www.ekurhuleni.gov.za/tenders/',
  },
  {
    label: 'City of Tshwane', domain: 'tshwane.gov.za', province: 'GP',
    strategy: 'html-scan',
    url: 'https://www.tshwane.gov.za/sites/Departments/Financial%20Services/Pages/Tenders.aspx',
  },
  {
    label: 'eThekwini Municipality', domain: 'durban.gov.za', province: 'KZN',
    strategy: 'html-scan',
    url: 'https://www.durban.gov.za/City_Government/City_Manager/SCM/Pages/Tenders.aspx',
  },
  {
    label: 'City of Cape Town', domain: 'capetown.gov.za', province: 'WC',
    strategy: 'html-scan',
    url: 'https://www.capetown.gov.za/work%20and%20business/tenders-and-procurement/',
  },
  {
    label: 'Nelson Mandela Bay', domain: 'nelsonmandelabay.gov.za', province: 'EC',
    strategy: 'html-scan',
    url: 'https://www.nelsonmandelabay.gov.za/Content/Page/64',
  },
  {
    label: 'Buffalo City Metro', domain: 'buffalocity.gov.za', province: 'EC',
    strategy: 'html-scan',
    url: 'https://www.buffalocity.gov.za/tenders/',
  },
  {
    label: 'Mangaung Metro', domain: 'mangaung.co.za', province: 'FS',
    strategy: 'html-scan',
    url: 'https://www.mangaung.co.za/tenders/',
  },

  // ════════════════════════════════════════════════════════════
  // WP-API — Only for sites confirmed to run WordPress REST API
  // ════════════════════════════════════════════════════════════
  {
    label: 'DIRCO WP', domain: 'dirco.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://dirco.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'COGTA WP', domain: 'cogta.gov.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://cogta.gov.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'NHBRC WP', domain: 'nhbrc.org.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.nhbrc.org.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'DBSA WP', domain: 'dbsa.org', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.dbsa.org/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
  },
  {
    label: 'SANRAL WP', domain: 'sanral.co.za', province: 'NAT',
    strategy: 'wp-api',
    url: 'https://www.sanral.co.za/wp-json/wp/v2/posts?search=tender&per_page=20&orderby=date&order=desc',
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
    console.log(`[${source.label}] wp-api → ${tenders.length} tenders`);
  } catch (err) {
    console.warn(`[${source.label}] wp-api failed:`, String(err).slice(0, 120));
  }
  return tenders;
}

// ─── Strategy: Generic HTML scan ────────────────────────────
// Works on any tender listing page — WP or plain HTML.
// Extracts blocks of text that contain tender keywords, then
// parses each block for ref, date, CIDB grade, value, category.

async function scrapeHtmlScan(source: Source): Promise<ScrapedTender[]> {
  const tenders: ScrapedTender[] = [];
  try {
    const res = await fetch(source.url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; BreedTenderBot/1.0)',
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.warn(`[${source.label}] HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();
    const text = stripHtml(html);

    const blocks: string[] = [];
    const usedRanges: [number, number][] = [];

    // ── 1. Extract blocks anchored on known reference-number patterns ──
    const refPattern = /\b([A-Z]{2,10}[\s\/\-]\d{2,6}[\s\/\-]\d{4}(?:[\/\-]\d{2,4})?|(?:BID|RFQ|RFP|EOI|SCM|QUO|TEN)[\s\/\-]?(?:NO\.?\s*)?[A-Z0-9\/\-]{4,20})\b/gi;
    let rm: RegExpExecArray | null;
    while ((rm = refPattern.exec(text)) !== null) {
      const start = Math.max(0, rm.index - 80);
      const end   = Math.min(text.length, rm.index + 700);
      const overlaps = usedRanges.some(([s, e]) => start < e && end > s);
      if (!overlaps && /tender|bid|service|closing|procurement/i.test(text.slice(start, end))) {
        blocks.push(text.slice(start, end));
        usedRanges.push([start, end]);
      }
    }

    // ── 2. Extract paragraphs that contain tender keywords ──
    const paraPattern = /(?:tender|bid|rfq|rfp|procurement|quotation)[^.]{30,700}\./gi;
    let pm: RegExpExecArray | null;
    while ((pm = paraPattern.exec(text)) !== null) {
      const start = pm.index;
      const end   = pm.index + pm[0].length;
      const overlaps = usedRanges.some(([s, e]) => start < e && end > s);
      if (!overlaps) {
        blocks.push(pm[0]);
        usedRanges.push([start, end]);
      }
    }

    // ── 3. Build tender objects from blocks ──
    const seen = new Set<string>();
    for (const block of blocks) {
      const key = block.slice(0, 80).trim();
      if (seen.has(key) || key.length < 15) continue;
      seen.add(key);

      const closing = extractDate(block) ?? futureDate(30);
      const ref     = extractRef(block)
        ?? `${source.label.toUpperCase().replace(/\s+/g, '-')}-${Date.now()}-${seen.size}`;
      const cidb  = extractCidb(block);
      const value = extractValue(block);
      const title = block.replace(/\s+/g, ' ').trim().slice(0, 180).split(/[.\n]/)[0].trim();
      if (!title || title.length < 10) continue;

      tenders.push({
        reference_number:    ref,
        title,
        description:         block.replace(/\s+/g, ' ').slice(0, 800),
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

    console.log(`[${source.label}] html-scan → ${tenders.length} tenders`);
  } catch (err) {
    console.warn(`[${source.label}] html-scan failed:`, String(err).slice(0, 120));
  }
  return tenders;
}

// ─── Strategy: RSS / Atom feed ───────────────────────────────

async function scrapeRss(source: Source): Promise<ScrapedTender[]> {
  const tenders: ScrapedTender[] = [];
  try {
    const res = await fetch(source.url, {
      headers: {
        'Accept': 'application/rss+xml, application/atom+xml, text/xml, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; BreedTenderBot/1.0)',
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];

    const xml  = await res.text();
    // Parse <item> (RSS) or <entry> (Atom) elements
    const itemPattern = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
    let im: RegExpExecArray | null;
    while ((im = itemPattern.exec(xml)) !== null) {
      const itemXml = im[1];
      const title   = stripHtml(getXmlField(itemXml, 'title') ?? '');
      const desc    = stripHtml(getXmlField(itemXml, 'description') ?? getXmlField(itemXml, 'summary') ?? '');
      const link    = getXmlField(itemXml, 'link') ?? source.url;
      const combined = `${title} ${desc}`;

      if (!/tender|bid|rfq|rfp|procurement|quotation/i.test(combined)) continue;

      const closing = extractDate(combined) ?? futureDate(30);
      const ref     = extractRef(combined)
        ?? `${source.label.toUpperCase().replace(/\s+/g, '-')}-RSS-${Date.now()}-${tenders.length}`;

      tenders.push({
        reference_number:    ref,
        title:               title || `${source.label} Tender`,
        description:         desc.slice(0, 800),
        department:          source.label,
        province:            source.province,
        category:            inferCategory(combined),
        closing_date:        closing,
        source_url:          link.trim(),
        source:              source.domain,
        estimated_value:     extractValue(combined),
        required_cidb_grade: extractCidb(combined),
        commodity_codes:     [],
        documents_required:  /document|specification|compulsory/i.test(combined),
        document_fee:        0,
      });
    }

    console.log(`[${source.label}] rss → ${tenders.length} tenders`);
  } catch (err) {
    console.warn(`[${source.label}] RSS failed:`, String(err).slice(0, 120));
  }
  return tenders;
}

function getXmlField(xml: string, field: string): string | null {
  const m = new RegExp(`<${field}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${field}>`, 'i').exec(xml);
  return m ? m[1].trim() : null;
}

// ─── Orchestrate all sources ─────────────────────────────────

export async function scrapeAllSources(): Promise<ScrapedTender[]> {
  const results: ScrapedTender[] = [];
  const BATCH = 6;
  const sourceLog: Record<string, number> = {};

  for (let i = 0; i < SOURCES.length; i += BATCH) {
    const batch = SOURCES.slice(i, i + BATCH);
    const batched = await Promise.allSettled(
      batch.map(src => {
        if (src.strategy === 'wp-api')   return scrapeWpApi(src);
        if (src.strategy === 'html-scan') return scrapeHtmlScan(src);
        if (src.strategy === 'rss')      return scrapeRss(src);
        return Promise.resolve([]);
      })
    );
    for (let j = 0; j < batched.length; j++) {
      const r   = batched[j];
      const src = batch[j];
      if (r.status === 'fulfilled') {
        sourceLog[src.label] = r.value.length;
        results.push(...r.value);
      } else {
        sourceLog[src.label] = -1;
      }
    }
  }

  // Log summary so Vercel logs show which sources produced results
  const working = Object.entries(sourceLog).filter(([, n]) => n > 0).map(([l, n]) => `${l}:${n}`);
  const empty   = Object.entries(sourceLog).filter(([, n]) => n === 0).map(([l]) => l);
  const failed  = Object.entries(sourceLog).filter(([, n]) => n === -1).map(([l]) => l);
  console.log(`[scrapeAllSources] working(${working.length}): ${working.join(', ')}`);
  if (empty.length)  console.log(`[scrapeAllSources] empty(${empty.length}): ${empty.join(', ')}`);
  if (failed.length) console.warn(`[scrapeAllSources] failed(${failed.length}): ${failed.join(', ')}`);

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
