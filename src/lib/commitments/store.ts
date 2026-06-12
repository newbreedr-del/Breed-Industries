/**
 * Breed Industries — Commitment store (the only place that touches the
 * commitment tables). Uses supabaseAdmin (server-side, service role).
 */

import { supabaseAdmin } from '@/lib/supabase';
import {
  Commitment,
  NewCommitment,
  CommitmentStatus,
  ACTIVE_STATUSES,
  nextDueDate,
} from './types';

const TABLE = 'client_commitments';

export interface ListFilter {
  status?: CommitmentStatus | 'active';
  clientId?: string;
  type?: string;
  overdueOnly?: boolean;
  dueWithinDays?: number;
  limit?: number;
}

export async function listCommitments(f: ListFilter = {}): Promise<Commitment[]> {
  let q = supabaseAdmin.from(TABLE).select('*');

  if (f.status === 'active') q = q.in('status', ACTIVE_STATUSES);
  else if (f.status) q = q.eq('status', f.status);

  if (f.clientId) q = q.eq('client_id', f.clientId);
  if (f.type) q = q.eq('type', f.type);

  if (f.overdueOnly) {
    q = q.lt('due_date', new Date().toISOString()).in('status', ACTIVE_STATUSES);
  } else if (f.dueWithinDays != null) {
    const horizon = new Date(Date.now() + f.dueWithinDays * 86_400_000).toISOString();
    q = q.lte('due_date', horizon).in('status', ACTIVE_STATUSES);
  }

  q = q.order('due_date', { ascending: true, nullsFirst: false }).limit(f.limit ?? 200);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as Commitment[];
}

export async function getCommitment(id: string): Promise<Commitment | null> {
  const { data, error } = await supabaseAdmin.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Commitment) ?? null;
}

/**
 * Create a commitment. If clientId is given, the client's contact details are
 * snapshotted so reminders survive CRM edits.
 */
export async function createCommitment(input: NewCommitment): Promise<Commitment> {
  const row: Record<string, unknown> = { ...input };

  if (input.client_id && (!input.client_email || !input.client_phone || !input.client_name)) {
    const { data: client } = await supabaseAdmin
      .from('crm_clients')
      .select('company_name, contact_name, contact_email, contact_phone')
      .eq('id', input.client_id)
      .maybeSingle();
    if (client) {
      row.client_name = input.client_name ?? client.contact_name ?? client.company_name;
      row.client_email = input.client_email ?? client.contact_email;
      row.client_phone = input.client_phone ?? client.contact_phone;
    }
  }

  const { data, error } = await supabaseAdmin.from(TABLE).insert(row).select().single();
  if (error) throw new Error(error.message);
  return data as Commitment;
}

export async function updateCommitment(id: string, patch: Partial<Commitment>): Promise<Commitment> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Commitment;
}

export async function deleteCommitment(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Mark a commitment done. If it recurs, instead of closing it we roll it
 * forward to the next due date and reset the reminder state — so a weekly
 * stock-take or annual return keeps coming back automatically.
 */
export async function completeCommitment(id: string): Promise<Commitment> {
  const current = await getCommitment(id);
  if (!current) throw new Error('Commitment not found');

  if (current.recurrence !== 'none' && current.due_date) {
    const next = nextDueDate(current.due_date, current.recurrence);
    return updateCommitment(id, {
      status: 'pending',
      due_date: next,
      completed_at: null,
      last_reminded_at: null,
      reminder_count: 0,
      checklist: current.checklist.map((c) => ({ ...c, done: false })),
    });
  }

  return updateCommitment(id, { status: 'done', completed_at: new Date().toISOString() });
}

export async function logReminder(
  commitmentId: string,
  channel: 'whatsapp' | 'email' | 'owner_digest',
  sentTo: string,
  outcome: 'sent' | 'failed',
  detail?: string,
): Promise<void> {
  await supabaseAdmin.from('commitment_reminders').insert({
    commitment_id: commitmentId,
    channel,
    sent_to: sentTo,
    outcome,
    detail: detail ?? null,
  });
}
