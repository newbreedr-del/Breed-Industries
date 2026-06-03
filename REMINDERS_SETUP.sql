-- Scheduled Reminders & Calendar System for Breed Industries WhatsApp Agent
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main reminders table
CREATE TABLE IF NOT EXISTS scheduled_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES crm_clients(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,
    
    -- Reminder details
    title TEXT NOT NULL,
    description TEXT,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN ('appointment', 'follow_up', 'payment_due', 'milestone', 'quote_followup', 'subscription_renewal', 'custom')),
    
    -- Scheduling
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    timezone TEXT DEFAULT 'Africa/Johannesburg',
    
    -- Status tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled', 'snoozed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    whatsapp_sent BOOLEAN DEFAULT false,
    email_sent BOOLEAN DEFAULT false,
    
    -- WhatsApp details
    phone_number TEXT,
    message_text TEXT,
    wa_message_id TEXT,
    
    -- Auto-generated from triggers
    source_type TEXT, -- 'manual', 'quote_sent', 'project_start', 'payment_due', 'subscription'
    source_id TEXT,   -- ID of the source record
    
    -- Metadata
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    snoozed_until TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reminders_status ON scheduled_reminders(status);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_at ON scheduled_reminders(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_reminders_client_id ON scheduled_reminders(client_id);
CREATE INDEX IF NOT EXISTS idx_reminders_type ON scheduled_reminders(reminder_type);
CREATE INDEX IF NOT EXISTS idx_reminders_pending_date ON scheduled_reminders(status, scheduled_at) WHERE status = 'pending';

-- Calendar view helper
CREATE OR REPLACE VIEW calendar_reminders AS
SELECT 
    r.id,
    r.title,
    r.description,
    r.reminder_type,
    r.scheduled_at,
    r.status,
    r.whatsapp_sent,
    r.phone_number,
    COALESCE(c.full_name, l.full_name) as client_name,
    COALESCE(c.company_name, l.company_name) as company_name
FROM scheduled_reminders r
LEFT JOIN crm_clients c ON r.client_id = c.id
LEFT JOIN crm_leads l ON r.lead_id = l.id
ORDER BY r.scheduled_at;

-- RLS Policies
ALTER TABLE scheduled_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON scheduled_reminders
    FOR ALL USING (true) WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reminders_updated_at 
    BEFORE UPDATE ON scheduled_reminders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create follow-up reminders when quote is sent
CREATE OR REPLACE FUNCTION create_quote_followup_reminder()
RETURNS TRIGGER AS $$
BEGIN
    -- Create a follow-up reminder 3 days after quote is sent
    IF NEW.status = 'Quote Sent' AND OLD.status != 'Quote Sent' THEN
        INSERT INTO scheduled_reminders (
            client_id,
            title,
            description,
            reminder_type,
            scheduled_at,
            source_type,
            source_id,
            phone_number,
            message_text
        )
        SELECT 
            c.id,
            'Follow up on quote - ' || c.full_name,
            'Follow up regarding the quote sent on ' || TO_CHAR(NOW(), 'YYYY-MM-DD'),
            'quote_followup',
            NOW() + INTERVAL '3 days',
            'quote_sent',
            NEW.id::text,
            c.phone,
            'Hi ' || c.full_name || ', just following up on the quote we sent. Please let us know if you have any questions. - Breed Industries'
        FROM crm_clients c
        WHERE c.id = NEW.client_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: Add trigger to quotes table if you have one
-- CREATE TRIGGER quote_sent_followup
--     AFTER UPDATE ON quotes
--     FOR EACH ROW
--     EXECUTE FUNCTION create_quote_followup_reminder();
