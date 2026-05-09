-- ============================================================
-- BREED INDUSTRIES — TENDER SYSTEM SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ─── Tender Clients ─────────────────────────────────────────
-- One record per client enrolled in a tender package

CREATE TABLE IF NOT EXISTS tender_clients (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,                     -- contact person
  company_name      TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  cidb_grade        TEXT,                              -- e.g. '2GB', '5CE'
  bee_level         INTEGER,                           -- 1–8
  csd_number        TEXT,                              -- Central Supplier Database
  tax_pin           TEXT,                              -- SARS tax reference
  provinces         TEXT[] DEFAULT '{}',               -- ['KZN','GP','WC', ...]
  commodity_codes   TEXT[] DEFAULT '{}',               -- SCOA / UNSPSC codes
  service_categories TEXT[] DEFAULT '{}',              -- ['Construction','IT','Consulting',...]
  max_tender_value  BIGINT DEFAULT 0,                  -- cents, 0 = no limit
  package           TEXT NOT NULL DEFAULT 'watch',     -- 'watch' | 'apply' | 'full'
  package_started_at TIMESTAMPTZ DEFAULT now(),
  package_expires_at TIMESTAMPTZ,                      -- null = active until cancelled
  is_active         BOOLEAN DEFAULT true,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tender_clients_email ON tender_clients(email);
CREATE INDEX IF NOT EXISTS idx_tender_clients_active ON tender_clients(is_active);
CREATE INDEX IF NOT EXISTS idx_tender_clients_package ON tender_clients(package);

-- ─── Tenders ────────────────────────────────────────────────
-- Scraped/manually entered tender opportunities

CREATE TABLE IF NOT EXISTS tenders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number  TEXT UNIQUE NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  department        TEXT,
  province          TEXT,
  category          TEXT,
  commodity_codes   TEXT[] DEFAULT '{}',
  estimated_value   BIGINT,                            -- cents, nullable
  required_cidb_grade TEXT,
  required_bee_level  INTEGER,
  issue_date        DATE,
  closing_date      TIMESTAMPTZ NOT NULL,
  briefing_date     TIMESTAMPTZ,
  briefing_location TEXT,
  source_url        TEXT,
  source            TEXT DEFAULT 'etenders',           -- 'etenders'|'kzn'|'gp'|'manual'
  status            TEXT DEFAULT 'open',               -- 'open'|'closed'|'awarded'|'cancelled'
  documents_required BOOLEAN DEFAULT false,
  document_fee      INTEGER DEFAULT 0,                 -- cents
  raw_data          JSONB,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_closing ON tenders(closing_date);
CREATE INDEX IF NOT EXISTS idx_tenders_province ON tenders(province);
CREATE INDEX IF NOT EXISTS idx_tenders_source ON tenders(source);

-- ─── Tender Matches ─────────────────────────────────────────
-- Junction table: which tenders matched which clients

CREATE TABLE IF NOT EXISTS tender_matches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id     UUID REFERENCES tenders(id) ON DELETE CASCADE,
  client_id     UUID REFERENCES tender_clients(id) ON DELETE CASCADE,
  match_score   INTEGER DEFAULT 0,                     -- 0–100
  match_reasons TEXT[] DEFAULT '{}',                   -- why it matched
  status        TEXT DEFAULT 'new',
  -- 'new' → 'notified' → 'reviewed' → 'applying' → 'applied' → 'won'|'lost'|'declined'
  admin_notes   TEXT,
  notified_at   TIMESTAMPTZ,
  applied_at    TIMESTAMPTZ,
  outcome_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tender_id, client_id)
);

CREATE INDEX IF NOT EXISTS idx_tender_matches_tender ON tender_matches(tender_id);
CREATE INDEX IF NOT EXISTS idx_tender_matches_client ON tender_matches(client_id);
CREATE INDEX IF NOT EXISTS idx_tender_matches_status ON tender_matches(status);

-- ─── Tender Applications ────────────────────────────────────
-- Tracks applications we filed on behalf of clients (apply/full packages)

CREATE TABLE IF NOT EXISTS tender_applications (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id                   UUID REFERENCES tender_matches(id) ON DELETE CASCADE,
  tender_id                  UUID REFERENCES tenders(id),
  client_id                  UUID REFERENCES tender_clients(id),
  status                     TEXT DEFAULT 'preparing',
  -- 'preparing'|'submitted'|'shortlisted'|'won'|'lost'
  submitted_at               TIMESTAMPTZ,
  documents_submitted        TEXT[] DEFAULT '{}',
  meeting_attended           BOOLEAN DEFAULT false,
  meeting_date               TIMESTAMPTZ,
  meeting_location           TEXT,
  extra_charges              INTEGER DEFAULT 0,        -- cents
  extra_charges_description  TEXT,
  notes                      TEXT,
  created_at                 TIMESTAMPTZ DEFAULT now(),
  updated_at                 TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tender_apps_client ON tender_applications(client_id);
CREATE INDEX IF NOT EXISTS idx_tender_apps_status ON tender_applications(status);

-- ─── Tender Notifications ───────────────────────────────────
-- Email audit log

CREATE TABLE IF NOT EXISTS tender_notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID REFERENCES tender_clients(id),
  tender_id         UUID REFERENCES tenders(id),
  match_id          UUID REFERENCES tender_matches(id),
  notification_type TEXT NOT NULL,
  -- 'new_match'|'closing_reminder'|'weekly_digest'|'application_update'
  sent_to           TEXT NOT NULL,
  email_id          TEXT,                              -- Resend email ID
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tender_notifs_client ON tender_notifications(client_id);
CREATE INDEX IF NOT EXISTS idx_tender_notifs_type   ON tender_notifications(notification_type);

-- ─── Updated-at trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_tender_clients_updated
  BEFORE UPDATE ON tender_clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_tenders_updated
  BEFORE UPDATE ON tenders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_tender_matches_updated
  BEFORE UPDATE ON tender_matches
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_tender_apps_updated
  BEFORE UPDATE ON tender_applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
