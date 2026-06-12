/**
 * Breed Industries — Onboarding Templates
 * ───────────────────────────────────────
 * A template is a standard set of commitments applied to a client in one go,
 * so every new client starts fully tracked from day one. Dates are computed
 * relative to an anchor date (usually onboarding day or registration day).
 *
 * Edit/add templates here — the API, agent tool, and tracker UI all read
 * from this one list automatically.
 *
 * NOTE: offsets are sensible defaults, not legal advice. Adjust the statutory
 * timings to match how you actually run these processes (e.g. CIPC annual
 * returns are due in the anniversary month of incorporation).
 */

import { CommitmentType, Recurrence } from './types';

export interface TemplateItem {
  title: string;
  description?: string;
  type: CommitmentType;
  /** Days after the anchor date that this item is due. */
  dueOffsetDays: number;
  recurrence: Recurrence;
  priority?: 'low' | 'normal' | 'high';
  checklist?: string[];
  /** Most items chase the client; set false for internal-only steps. */
  notifyClient?: boolean;
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  items: TemplateItem[];
}

export const TEMPLATES: OnboardingTemplate[] = [
  {
    id: 'new_company',
    name: 'New Company Registration',
    description:
      'Full obligation set for a freshly registered company: incorporation documents, tax registrations, and the recurring statutory cycle.',
    items: [
      {
        title: 'Submit incorporation documents',
        description: 'We need these to complete your company file.',
        type: 'document',
        dueOffsetDays: 7,
        recurrence: 'none',
        priority: 'high',
        checklist: ['Certified ID copies of all directors', 'Proof of business address', 'Signed power of attorney'],
      },
      {
        title: 'SARS income tax registration',
        description: 'Confirm your company income tax number is active on eFiling.',
        type: 'statutory',
        dueOffsetDays: 21,
        recurrence: 'none',
        priority: 'high',
      },
      {
        title: 'Open business bank account',
        description: 'Required for CSD registration and tender payments.',
        type: 'document',
        dueOffsetDays: 14,
        recurrence: 'none',
        checklist: ['Bank confirmation letter'],
      },
      {
        title: 'CIPC annual return',
        description: 'Annual CIPC filing — lapsing leads to deregistration.',
        type: 'statutory',
        dueOffsetDays: 365,
        recurrence: 'annually',
        priority: 'high',
      },
      {
        title: 'Provisional tax (IRP6) submission',
        description: 'First provisional tax return cycle.',
        type: 'statutory',
        dueOffsetDays: 180,
        recurrence: 'none',
      },
    ],
  },
  {
    id: 'vat_vendor',
    name: 'VAT Vendor Pack',
    description: 'For clients registered (or registering) for VAT: registration documents plus the recurring VAT201 cycle.',
    items: [
      {
        title: 'Submit VAT registration documents',
        type: 'document',
        dueOffsetDays: 7,
        recurrence: 'none',
        priority: 'high',
        checklist: ['Bank confirmation letter', 'Proof of trading (invoices/contracts)', 'Director ID copies'],
      },
      {
        title: 'VAT201 return + payment',
        description: 'Bi-monthly VAT return. Send us your sales & purchase records the week before.',
        type: 'statutory',
        dueOffsetDays: 60,
        recurrence: 'bi_monthly',
        priority: 'high',
      },
    ],
  },
  {
    id: 'tender_ready',
    name: 'Tender-Ready Pack',
    description: 'Everything a client needs current to bid: CSD, tax clearance, BEE certificate — kept fresh on their renewal cycles.',
    items: [
      {
        title: 'CSD registration / verification',
        description: 'Central Supplier Database profile must be active and verified.',
        type: 'document',
        dueOffsetDays: 7,
        recurrence: 'none',
        priority: 'high',
        checklist: ['CSD MAAA number confirmed', 'Bank details verified on CSD'],
      },
      {
        title: 'Tax clearance (pin) renewal',
        description: 'SARS compliance pin — required for every tender submission.',
        type: 'statutory',
        dueOffsetDays: 30,
        recurrence: 'annually',
        priority: 'high',
      },
      {
        title: 'BEE affidavit / certificate renewal',
        type: 'statutory',
        dueOffsetDays: 30,
        recurrence: 'annually',
      },
      {
        title: 'Company profile & capability statement update',
        description: 'Keep the bid pack current so we can submit fast.',
        type: 'document',
        dueOffsetDays: 14,
        recurrence: 'quarterly',
      },
    ],
  },
  {
    id: 'ops_baseline',
    name: 'Operations Baseline',
    description: 'The day-to-day accountability drumbeat: stock-takes, target reviews, and staff check-ins.',
    items: [
      {
        title: 'Weekly stock-take',
        description: 'Count stock and send us the sheet so we can track shrinkage and reorder points.',
        type: 'operations',
        dueOffsetDays: 7,
        recurrence: 'weekly',
      },
      {
        title: 'Monthly sales target review',
        description: 'Compare actuals vs target; flag gaps early.',
        type: 'operations',
        dueOffsetDays: 30,
        recurrence: 'monthly',
        priority: 'high',
      },
      {
        title: 'Monthly staff check-in',
        description: 'Attendance, performance flags, and any HR issues to action.',
        type: 'operations',
        dueOffsetDays: 30,
        recurrence: 'monthly',
      },
    ],
  },
];

export function getTemplate(id: string): OnboardingTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function listTemplates() {
  return TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    itemCount: t.items.length,
  }));
}
