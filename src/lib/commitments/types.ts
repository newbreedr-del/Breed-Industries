/** Breed Industries — Client Commitment types */

export type CommitmentType =
  | 'document'        // paperwork the client must submit to Breed
  | 'statutory'       // CIPC / SARS / VAT / BEE recurring filings
  | 'tender'          // a tender submission deadline
  | 'operations'      // client's day-to-day: stock-take, targets, staff
  | 'event_training'  // an event/training session the client must attend
  | 'custom';

export type CommitmentStatus =
  | 'pending'
  | 'awaiting_client'
  | 'submitted'
  | 'done'
  | 'overdue'
  | 'cancelled';

export type Recurrence = 'none' | 'weekly' | 'monthly' | 'bi_monthly' | 'quarterly' | 'annually';

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export interface Commitment {
  id: string;
  client_id: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  title: string;
  description: string | null;
  type: CommitmentType;
  status: CommitmentStatus;
  responsible: 'client' | 'breed';
  priority: 'low' | 'normal' | 'high';
  due_date: string | null;
  recurrence: Recurrence;
  checklist: ChecklistItem[];
  notify_client: boolean;
  notify_channels: ('whatsapp' | 'email')[];
  reminder_offsets: number[];
  last_reminded_at: string | null;
  reminder_count: number;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type NewCommitment = Partial<Commitment> & { title: string };

export const ACTIVE_STATUSES: CommitmentStatus[] = ['pending', 'awaiting_client', 'submitted', 'overdue'];

/** Whole-day difference between a due date and now (negative = overdue). */
export function daysUntil(due: string | null): number | null {
  if (!due) return null;
  const ms = new Date(due).setHours(23, 59, 59, 999) - Date.now();
  return Math.ceil(ms / 86_400_000);
}

/** Advance a due date by its recurrence interval. */
export function nextDueDate(due: string, recurrence: Recurrence): string | null {
  if (recurrence === 'none') return null;
  const d = new Date(due);
  switch (recurrence) {
    case 'weekly':     d.setDate(d.getDate() + 7); break;
    case 'monthly':    d.setMonth(d.getMonth() + 1); break;
    case 'bi_monthly': d.setMonth(d.getMonth() + 2); break;
    case 'quarterly':  d.setMonth(d.getMonth() + 3); break;
    case 'annually':   d.setFullYear(d.getFullYear() + 1); break;
  }
  return d.toISOString();
}
