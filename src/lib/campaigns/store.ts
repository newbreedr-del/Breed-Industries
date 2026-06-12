/**
 * Breed Industries — Campaign store (the only place that touches campaign tables).
 */

import { supabaseAdmin } from '@/lib/supabase';
import { Campaign, CampaignContact, CampaignStats } from './types';
import { ParsedContact } from './csv';

export async function listCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabaseAdmin
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Campaign[];
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const { data, error } = await supabaseAdmin.from('campaigns').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Campaign) ?? null;
}

export async function createCampaign(input: Partial<Campaign>): Promise<Campaign> {
  if (!input.name) throw new Error('name is required');
  if (!input.intro_message) throw new Error('intro_message is required');
  const { data, error } = await supabaseAdmin.from('campaigns').insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Campaign;
}

export async function updateCampaign(id: string, patch: Partial<Campaign>): Promise<Campaign> {
  const { data, error } = await supabaseAdmin
    .from('campaigns')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Campaign;
}

export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('campaigns').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function isGloballyOptedOut(phone: string): Promise<boolean> {
  const { data } = await supabaseAdmin.from('campaign_optouts').select('phone').eq('phone', phone).maybeSingle();
  return !!data;
}

export async function addGlobalOptOut(phone: string, reason?: string): Promise<void> {
  await supabaseAdmin.from('campaign_optouts').upsert({ phone, reason: reason ?? null }, { onConflict: 'phone' });
}

/**
 * Import parsed contacts into a campaign. Skips numbers already on the global
 * opt-out list. Relies on the unique(campaign_id, phone) constraint to dedupe
 * against existing contacts (ignoreDuplicates).
 */
export async function importContacts(
  campaignId: string,
  contacts: ParsedContact[],
): Promise<{ inserted: number; optedOutSkipped: number }> {
  if (contacts.length === 0) return { inserted: 0, optedOutSkipped: 0 };

  const { data: optouts } = await supabaseAdmin.from('campaign_optouts').select('phone');
  const optoutSet = new Set((optouts ?? []).map((o: any) => o.phone));

  const rows = contacts
    .filter((c) => !optoutSet.has(c.phone))
    .map((c) => ({
      campaign_id: campaignId,
      phone: c.phone,
      name: c.name,
      extra: c.extra,
    }));

  const optedOutSkipped = contacts.length - rows.length;
  if (rows.length === 0) return { inserted: 0, optedOutSkipped };

  const { data, error } = await supabaseAdmin
    .from('campaign_contacts')
    .upsert(rows, { onConflict: 'campaign_id,phone', ignoreDuplicates: true })
    .select('id');
  if (error) throw new Error(error.message);

  return { inserted: data?.length ?? 0, optedOutSkipped };
}

export async function getContacts(campaignId: string, limit = 1000): Promise<CampaignContact[]> {
  const { data, error } = await supabaseAdmin
    .from('campaign_contacts')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as CampaignContact[];
}

export async function updateContact(id: string, patch: Partial<CampaignContact>): Promise<CampaignContact> {
  const { data, error } = await supabaseAdmin
    .from('campaign_contacts')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as CampaignContact;
}

/** Find an active questionnaire participant for an inbound phone (most recent). */
export async function findActiveContactByPhone(phone: string): Promise<CampaignContact | null> {
  const { data, error } = await supabaseAdmin
    .from('campaign_contacts')
    .select('*')
    .eq('phone', phone)
    .in('status', ['invited', 'in_progress'])
    .order('last_sent_at', { ascending: false, nullsFirst: false })
    .limit(1);
  if (error) throw new Error(error.message);
  return (data?.[0] as CampaignContact) ?? null;
}

export async function getStats(campaignId: string): Promise<CampaignStats> {
  const contacts = await getContacts(campaignId, 100000);
  const by = (s: string) => contacts.filter((c) => c.status === s).length;
  const invited = by('invited') + by('in_progress') + by('completed');
  const completed = by('completed');
  return {
    total: contacts.length,
    queued: by('queued'),
    invited: by('invited'),
    in_progress: by('in_progress'),
    completed,
    opted_out: by('opted_out'),
    failed: by('failed'),
    completion_rate: invited ? Math.round((completed / invited) * 100) : 0,
  };
}
