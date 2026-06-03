-- WhatsApp message log table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  direction   TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  phone       TEXT NOT NULL,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'received')),
  sender_name TEXT,
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wa_messages_phone       ON whatsapp_messages(phone);
CREATE INDEX IF NOT EXISTS idx_wa_messages_direction   ON whatsapp_messages(direction);
CREATE INDEX IF NOT EXISTS idx_wa_messages_created_at  ON whatsapp_messages(created_at DESC);

-- RLS: only service_role (supabaseAdmin) can read/write
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON whatsapp_messages
  FOR ALL USING (auth.role() = 'service_role');
