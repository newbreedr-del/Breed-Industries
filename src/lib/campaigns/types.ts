/** Breed Industries — Campaign / Questionnaire types */

export type QuestionType = 'text' | 'choice' | 'number' | 'yes_no' | 'rating';

export interface Question {
  key: string;        // short slug stored as the answer key, e.g. "service"
  prompt: string;     // what the person is asked
  type: QuestionType;
  options?: string[]; // for 'choice'
}

export type CampaignPurpose = 'lead_qual' | 'marketing' | 'research' | 'event';
export type CampaignStatus = 'draft' | 'sending' | 'active' | 'paused' | 'completed';

export interface Campaign {
  id: string;
  name: string;
  purpose: CampaignPurpose;
  channel: 'whatsapp';
  intro_message: string;
  outro_message: string;
  questions: Question[];
  create_lead: boolean;
  status: CampaignStatus;
  source_tag: string | null;
  batch_size: number;
  created_at: string;
  started_at: string | null;
  updated_at: string;
}

export type ContactStatus = 'queued' | 'invited' | 'in_progress' | 'completed' | 'opted_out' | 'failed';
export type ConsentStatus = 'pending' | 'opted_in' | 'opted_out';

export interface CampaignContact {
  id: string;
  campaign_id: string;
  phone: string;
  name: string | null;
  extra: Record<string, string>;
  consent_status: ConsentStatus;
  status: ContactStatus;
  current_q: number;
  answers: Record<string, string>;
  lead_id: string | null;
  last_sent_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignStats {
  total: number;
  queued: number;
  invited: number;
  in_progress: number;
  completed: number;
  opted_out: number;
  failed: number;
  completion_rate: number; // % of invited that completed
}
