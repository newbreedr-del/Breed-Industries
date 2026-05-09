import { supabaseAdmin as supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────

export type TenderPackage = 'watch' | 'apply' | 'full';
export type TenderStatus  = 'open' | 'closed' | 'awarded' | 'cancelled';
export type MatchStatus   =
  | 'new' | 'notified' | 'reviewed'
  | 'applying' | 'applied' | 'won' | 'lost' | 'declined';
export type AppStatus =
  | 'preparing' | 'submitted' | 'shortlisted' | 'won' | 'lost';
export type NotifType =
  | 'new_match' | 'closing_reminder' | 'weekly_digest' | 'application_update';

export interface TenderClient {
  id: string;
  name: string;
  company_name: string;
  email: string;
  phone?: string;
  cidb_grade?: string;
  bee_level?: number;
  csd_number?: string;
  tax_pin?: string;
  provinces: string[];
  commodity_codes: string[];
  service_categories: string[];
  max_tender_value: number;
  package: TenderPackage;
  package_started_at: string;
  package_expires_at?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Tender {
  id: string;
  reference_number: string;
  title: string;
  description?: string;
  department?: string;
  province?: string;
  category?: string;
  commodity_codes: string[];
  estimated_value?: number;
  required_cidb_grade?: string;
  required_bee_level?: number;
  issue_date?: string;
  closing_date: string;
  briefing_date?: string;
  briefing_location?: string;
  source_url?: string;
  source: string;
  status: TenderStatus;
  documents_required: boolean;
  document_fee: number;
  raw_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TenderMatch {
  id: string;
  tender_id: string;
  client_id: string;
  match_score: number;
  match_reasons: string[];
  status: MatchStatus;
  admin_notes?: string;
  notified_at?: string;
  applied_at?: string;
  outcome_at?: string;
  created_at: string;
  updated_at: string;
  // Joined
  tender?: Tender;
  client?: TenderClient;
}

export interface TenderApplication {
  id: string;
  match_id: string;
  tender_id: string;
  client_id: string;
  status: AppStatus;
  submitted_at?: string;
  documents_submitted: string[];
  meeting_attended: boolean;
  meeting_date?: string;
  meeting_location?: string;
  extra_charges: number;
  extra_charges_description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TenderNotification {
  id: string;
  client_id?: string;
  tender_id?: string;
  match_id?: string;
  notification_type: NotifType;
  sent_to: string;
  email_id?: string;
  created_at: string;
}

// ─── Tender Clients ──────────────────────────────────────────

export async function getTenderClients(activeOnly = true): Promise<TenderClient[]> {
  let q = supabase
    .from('tender_clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (activeOnly) q = q.eq('is_active', true);

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function getTenderClientById(id: string): Promise<TenderClient | null> {
  const { data, error } = await supabase
    .from('tender_clients')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createTenderClient(
  client: Omit<TenderClient, 'id' | 'created_at' | 'updated_at'>
): Promise<TenderClient> {
  const { data, error } = await supabase
    .from('tender_clients')
    .insert(client)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTenderClient(
  id: string,
  updates: Partial<TenderClient>
): Promise<TenderClient> {
  const { data, error } = await supabase
    .from('tender_clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Tenders ─────────────────────────────────────────────────

export async function getTenders(opts?: {
  status?: TenderStatus;
  limit?: number;
  offset?: number;
}): Promise<{ tenders: Tender[]; total: number }> {
  let q = supabase
    .from('tenders')
    .select('*', { count: 'exact' })
    .order('closing_date', { ascending: true });

  if (opts?.status) q = q.eq('status', opts.status);
  if (opts?.limit)  q = q.limit(opts.limit);
  if (opts?.offset) q = q.range(opts.offset, (opts.offset + (opts.limit ?? 50)) - 1);

  const { data, error, count } = await q;
  if (error) throw error;
  return { tenders: data || [], total: count || 0 };
}

export async function getTenderById(id: string): Promise<Tender | null> {
  const { data, error } = await supabase
    .from('tenders')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertTender(
  tender: Omit<Tender, 'id' | 'created_at' | 'updated_at'>
): Promise<Tender> {
  const { data, error } = await supabase
    .from('tenders')
    .upsert(tender, { onConflict: 'reference_number' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTender(
  id: string,
  updates: Partial<Tender>
): Promise<Tender> {
  const { data, error } = await supabase
    .from('tenders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Matches ─────────────────────────────────────────────────

export async function getMatchesForAdmin(opts?: {
  status?: MatchStatus;
  client_id?: string;
  tender_id?: string;
  limit?: number;
}): Promise<TenderMatch[]> {
  let q = supabase
    .from('tender_matches')
    .select(`
      *,
      tender:tenders(*),
      client:tender_clients(*)
    `)
    .order('created_at', { ascending: false });

  if (opts?.status)    q = q.eq('status', opts.status);
  if (opts?.client_id) q = q.eq('client_id', opts.client_id);
  if (opts?.tender_id) q = q.eq('tender_id', opts.tender_id);
  if (opts?.limit)     q = q.limit(opts.limit);

  const { data, error } = await q;
  if (error) throw error;
  return (data as TenderMatch[]) || [];
}

export async function createOrUpdateMatch(
  tenderId: string,
  clientId: string,
  matchData: { match_score: number; match_reasons: string[] }
): Promise<TenderMatch> {
  const { data, error } = await supabase
    .from('tender_matches')
    .upsert(
      {
        tender_id: tenderId,
        client_id: clientId,
        match_score: matchData.match_score,
        match_reasons: matchData.match_reasons,
        status: 'new',
      },
      { onConflict: 'tender_id,client_id', ignoreDuplicates: true }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMatchStatus(
  id: string,
  status: MatchStatus,
  extras?: { admin_notes?: string; applied_at?: string; outcome_at?: string }
): Promise<void> {
  const { error } = await supabase
    .from('tender_matches')
    .update({ status, ...extras })
    .eq('id', id);
  if (error) throw error;
}

export async function markMatchNotified(matchId: string): Promise<void> {
  const { error } = await supabase
    .from('tender_matches')
    .update({ status: 'notified', notified_at: new Date().toISOString() })
    .eq('id', matchId);
  if (error) throw error;
}

// ─── Applications ────────────────────────────────────────────

export async function getApplications(clientId?: string): Promise<TenderApplication[]> {
  let q = supabase
    .from('tender_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (clientId) q = q.eq('client_id', clientId);

  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function createApplication(
  app: Omit<TenderApplication, 'id' | 'created_at' | 'updated_at'>
): Promise<TenderApplication> {
  const { data, error } = await supabase
    .from('tender_applications')
    .insert(app)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateApplication(
  id: string,
  updates: Partial<TenderApplication>
): Promise<TenderApplication> {
  const { data, error } = await supabase
    .from('tender_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Notifications ───────────────────────────────────────────

export async function logNotification(
  notif: Omit<TenderNotification, 'id' | 'created_at'>
): Promise<void> {
  const { error } = await supabase
    .from('tender_notifications')
    .insert(notif);
  if (error) console.error('Failed to log tender notification:', error);
}

export async function wasAlreadyNotified(
  clientId: string,
  tenderId: string,
  type: NotifType
): Promise<boolean> {
  const { count, error } = await supabase
    .from('tender_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .eq('tender_id', tenderId)
    .eq('notification_type', type);
  if (error) return false;
  return (count ?? 0) > 0;
}

// ─── Dashboard Stats ─────────────────────────────────────────

export async function getTenderDashboardStats() {
  const [
    { count: activeClients },
    { count: openTenders },
    { count: newMatches },
    { count: applied },
    { count: won },
  ] = await Promise.all([
    supabase.from('tender_clients').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('tenders').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('tender_matches').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('tender_applications').select('*', { count: 'exact', head: true }).eq('status', 'submitted'),
    supabase.from('tender_applications').select('*', { count: 'exact', head: true }).eq('status', 'won'),
  ]);

  return {
    activeClients: activeClients ?? 0,
    openTenders:   openTenders   ?? 0,
    newMatches:    newMatches    ?? 0,
    applied:       applied       ?? 0,
    won:           won           ?? 0,
  };
}
