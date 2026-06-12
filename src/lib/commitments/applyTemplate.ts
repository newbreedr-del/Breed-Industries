/**
 * Apply an onboarding template to a client — creates the full commitment set
 * in one call. Used by the API route, the agent tool, and the tracker UI.
 */

import { createCommitment } from './store';
import { getTemplate } from './templates';
import { Commitment } from './types';

export interface ApplyTemplateInput {
  templateId: string;
  /** Anchor date the offsets count from (default: today). ISO string. */
  anchorDate?: string;
  /** Either a CRM client id (contact details auto-snapshot) or manual contact fields. */
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export interface ApplyTemplateResult {
  template: string;
  created: { id: string; title: string; due_date: string | null }[];
}

export async function applyTemplate(input: ApplyTemplateInput): Promise<ApplyTemplateResult> {
  const template = getTemplate(input.templateId);
  if (!template) throw new Error(`Unknown template: ${input.templateId}`);

  const anchor = input.anchorDate ? new Date(input.anchorDate) : new Date();
  if (isNaN(anchor.getTime())) throw new Error('Invalid anchor date');

  const created: ApplyTemplateResult['created'] = [];

  for (const item of template.items) {
    const due = new Date(anchor);
    due.setDate(due.getDate() + item.dueOffsetDays);

    const c: Commitment = await createCommitment({
      title: item.title,
      description: item.description ?? null,
      type: item.type,
      due_date: due.toISOString(),
      recurrence: item.recurrence,
      priority: item.priority ?? 'normal',
      checklist: (item.checklist ?? []).map((label) => ({ label, done: false })),
      notify_client: item.notifyClient ?? true,
      client_id: input.clientId ?? null,
      client_name: input.clientName ?? null,
      client_email: input.clientEmail ?? null,
      client_phone: input.clientPhone ?? null,
    } as any);

    created.push({ id: c.id, title: c.title, due_date: c.due_date });
  }

  return { template: template.name, created };
}
