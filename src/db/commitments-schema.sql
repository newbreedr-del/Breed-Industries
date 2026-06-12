-- Breed Industries — Client Commitment Tracker
-- Run once in the Supabase SQL Editor.
--
-- A "commitment" is anything a client owes or must do by a date: a document
-- they need to submit, a statutory filing, a tender submission, a recurring
-- operations task (stock-take, target review, staff check-in), or attendance
-- at a training event. The follow-up engine chases these automatically.

create extension if not exists "pgcrypto";

create table if not exists client_commitments (
  id                uuid primary key default gen_random_uuid(),
  client_id         uuid references crm_clients(id) on delete set null,

  -- Contact snapshot: reminders still work even if the CRM row changes/deletes.
  client_name       text,
  client_email      text,
  client_phone      text,

  title             text not null,
  description       text,
  -- document | statutory | tender | operations | event_training | custom
  type              text not null default 'document',
  -- pending | awaiting_client | submitted | done | overdue | cancelled
  status            text not null default 'pending',
  -- client | breed  (who owns the next action)
  responsible       text not null default 'client',
  -- low | normal | high
  priority          text not null default 'normal',

  due_date          timestamptz,
  -- none | weekly | monthly | bi_monthly | quarterly | annually
  recurrence        text not null default 'none',

  -- [{ "label": "Certified ID", "done": false }, ...]
  checklist         jsonb not null default '[]'::jsonb,

  notify_client     boolean not null default true,
  -- subset of { 'whatsapp', 'email' }
  notify_channels   text[]  not null default array['whatsapp','email'],
  -- days BEFORE due_date to send a nudge; 0 = on the day
  reminder_offsets  int[]   not null default array[7,3,1,0],

  last_reminded_at  timestamptz,
  reminder_count    int not null default 0,
  completed_at      timestamptz,
  notes             text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_commitments_status   on client_commitments (status);
create index if not exists idx_commitments_due       on client_commitments (due_date);
create index if not exists idx_commitments_client    on client_commitments (client_id);

-- Audit log of every reminder the engine sends (client nudges + owner digests).
create table if not exists commitment_reminders (
  id             uuid primary key default gen_random_uuid(),
  commitment_id  uuid references client_commitments(id) on delete cascade,
  channel        text,           -- whatsapp | email | owner_digest
  sent_to        text,
  outcome        text,           -- sent | failed
  detail         text,
  created_at     timestamptz not null default now()
);

create index if not exists idx_reminders_commitment on commitment_reminders (commitment_id);
