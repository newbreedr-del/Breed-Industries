-- Breed Industries — WhatsApp Questionnaire Campaigns
-- Run once in the Supabase SQL Editor.
--
-- Upload a CSV of numbers → a campaign sends a consent-first questionnaire over
-- WhatsApp → replies are captured question-by-question → completed responses can
-- auto-create CRM leads. Built with POPIA in mind: consent gate + global opt-out.

create extension if not exists "pgcrypto";

create table if not exists campaigns (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  -- lead_qual | marketing | research | event
  purpose         text not null default 'lead_qual',
  channel         text not null default 'whatsapp',

  -- Consent-first opener. Must explain who you are + how to opt out.
  intro_message   text not null,
  -- Thank-you / next-steps message after the last question.
  outro_message   text not null default 'Thank you for your time! 🙏 Our team will be in touch.',

  -- [{ "key": "service", "prompt": "Which service interests you?", "type": "choice",
  --    "options": ["Company reg","Tax","Tenders","Website"] }, ...]
  -- type ∈ text | choice | number | yes_no | rating
  questions       jsonb not null default '[]'::jsonb,

  -- Create a CRM lead automatically when someone completes the questionnaire.
  create_lead     boolean not null default true,

  -- draft | sending | active | paused | completed
  status          text not null default 'draft',
  source_tag      text,                 -- e.g. 'warm', 'cold', 'event-2026'

  -- Throttle: how many invites to send per drip run.
  batch_size      int not null default 25,

  created_at      timestamptz not null default now(),
  started_at      timestamptz,
  updated_at      timestamptz not null default now()
);

create index if not exists idx_campaigns_status on campaigns (status);

create table if not exists campaign_contacts (
  id              uuid primary key default gen_random_uuid(),
  campaign_id     uuid not null references campaigns(id) on delete cascade,

  phone           text not null,        -- normalised to 27XXXXXXXXX
  name            text,
  extra           jsonb not null default '{}'::jsonb,  -- any other CSV columns

  -- pending | opted_in | opted_out
  consent_status  text not null default 'pending',
  -- queued | invited | in_progress | completed | opted_out | failed
  status          text not null default 'queued',

  current_q       int not null default 0,              -- index into questions[]
  answers         jsonb not null default '{}'::jsonb,  -- { key: value }

  lead_id         uuid,
  last_sent_at    timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique (campaign_id, phone)
);

create index if not exists idx_campaign_contacts_campaign on campaign_contacts (campaign_id);
create index if not exists idx_campaign_contacts_phone    on campaign_contacts (phone);
create index if not exists idx_campaign_contacts_status   on campaign_contacts (status);

-- Global opt-out: once a person says STOP, they are never messaged again by ANY campaign.
create table if not exists campaign_optouts (
  phone        text primary key,        -- normalised
  reason       text,
  created_at   timestamptz not null default now()
);
