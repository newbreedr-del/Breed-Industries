/**
 * Minimal, dependency-free CSV parser for contact uploads.
 * Handles quoted fields, commas inside quotes, and a header row.
 * Auto-detects the phone and name columns from common header names.
 */

import { formatPhone } from '@/lib/whatsapp';

export interface ParsedContact {
  phone: string;
  name: string | null;
  extra: Record<string, string>;
}

function splitLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      out.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const PHONE_HEADERS = ['phone', 'number', 'mobile', 'cell', 'cellphone', 'whatsapp', 'msisdn', 'contact'];
const NAME_HEADERS = ['name', 'full name', 'fullname', 'first name', 'firstname', 'client', 'contact name'];

/** Looks like a usable SA mobile number after normalisation. */
function isValidPhone(p: string): boolean {
  return /^27\d{9}$/.test(p);
}

export interface CsvResult {
  contacts: ParsedContact[];
  skipped: number;       // rows with no valid phone
  duplicatesRemoved: number;
}

export function parseContactsCsv(raw: string): CsvResult {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { contacts: [], skipped: 0, duplicatesRemoved: 0 };

  const headers = splitLine(lines[0]).map((h) => h.toLowerCase());
  const hasHeader = headers.some((h) => [...PHONE_HEADERS, ...NAME_HEADERS].includes(h));

  let phoneIdx = headers.findIndex((h) => PHONE_HEADERS.includes(h));
  let nameIdx = headers.findIndex((h) => NAME_HEADERS.includes(h));

  // No recognised header → assume col0 = phone, col1 = name.
  const dataStart = hasHeader ? 1 : 0;
  if (!hasHeader) { phoneIdx = 0; nameIdx = 1; }
  if (phoneIdx < 0) phoneIdx = 0;

  const seen = new Set<string>();
  const contacts: ParsedContact[] = [];
  let skipped = 0;
  let duplicatesRemoved = 0;

  for (let i = dataStart; i < lines.length; i++) {
    const cells = splitLine(lines[i]);
    const phone = formatPhone(cells[phoneIdx] ?? '');
    if (!isValidPhone(phone)) { skipped++; continue; }
    if (seen.has(phone)) { duplicatesRemoved++; continue; }
    seen.add(phone);

    const extra: Record<string, string> = {};
    if (hasHeader) {
      headers.forEach((h, idx) => {
        if (idx !== phoneIdx && idx !== nameIdx && cells[idx]) extra[h] = cells[idx];
      });
    }

    contacts.push({
      phone,
      name: nameIdx >= 0 ? cells[nameIdx] || null : null,
      extra,
    });
  }

  return { contacts, skipped, duplicatesRemoved };
}
