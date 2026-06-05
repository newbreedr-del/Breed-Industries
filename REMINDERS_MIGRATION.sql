-- Migration: Add recurring reminder columns to existing table
-- Run this in Supabase SQL Editor if you already created the table

-- Add recurring columns
ALTER TABLE scheduled_reminders 
  ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS recurrence_pattern TEXT CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
  ADD COLUMN IF NOT EXISTS recurrence_interval INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS recurrence_end_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS parent_reminder_id UUID REFERENCES scheduled_reminders(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS recurrence_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_recurrences INTEGER;

-- Function to generate next recurring reminder when one is sent
CREATE OR REPLACE FUNCTION generate_next_recurring_reminder()
RETURNS TRIGGER AS $$
DECLARE
    next_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Only proceed if this is a recurring reminder that was just sent
    IF NEW.status = 'sent' AND OLD.status != 'sent' AND NEW.is_recurring = true THEN
        -- Check if we've hit the max recurrences
        IF NEW.max_recurrences IS NOT NULL AND NEW.recurrence_count >= NEW.max_recurrences THEN
            RETURN NEW;
        END IF;
        
        -- Check if we've passed the end date
        IF NEW.recurrence_end_date IS NOT NULL AND NOW() > NEW.recurrence_end_date THEN
            RETURN NEW;
        END IF;
        
        -- Calculate next date based on pattern
        CASE NEW.recurrence_pattern
            WHEN 'daily' THEN
                next_date := NEW.scheduled_at + (NEW.recurrence_interval || ' days')::INTERVAL;
            WHEN 'weekly' THEN
                next_date := NEW.scheduled_at + (NEW.recurrence_interval || ' weeks')::INTERVAL;
            WHEN 'monthly' THEN
                next_date := NEW.scheduled_at + (NEW.recurrence_interval || ' months')::INTERVAL;
            WHEN 'yearly' THEN
                next_date := NEW.scheduled_at + (NEW.recurrence_interval || ' years')::INTERVAL;
        END CASE;
        
        -- Create the next reminder
        INSERT INTO scheduled_reminders (
            client_id,
            lead_id,
            title,
            description,
            reminder_type,
            scheduled_at,
            phone_number,
            message_text,
            is_recurring,
            recurrence_pattern,
            recurrence_interval,
            recurrence_end_date,
            parent_reminder_id,
            max_recurrences,
            source_type,
            created_by,
            status
        ) VALUES (
            NEW.client_id,
            NEW.lead_id,
            NEW.title,
            NEW.description,
            NEW.reminder_type,
            next_date,
            NEW.phone_number,
            NEW.message_text,
            NEW.is_recurring,
            NEW.recurrence_pattern,
            NEW.recurrence_interval,
            NEW.recurrence_end_date,
            COALESCE(NEW.parent_reminder_id, NEW.id),
            NEW.max_recurrences,
            NEW.source_type,
            NEW.created_by,
            'pending'
        );
        
        -- Update the parent with incremented count
        UPDATE scheduled_reminders 
        SET recurrence_count = recurrence_count + 1
        WHERE id = COALESCE(NEW.parent_reminder_id, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS auto_generate_recurring_reminder ON scheduled_reminders;

-- Create trigger to auto-generate next recurring reminder
CREATE TRIGGER auto_generate_recurring_reminder
    AFTER UPDATE ON scheduled_reminders
    FOR EACH ROW
    WHEN (OLD.status != 'sent' AND NEW.status = 'sent')
    EXECUTE FUNCTION generate_next_recurring_reminder();
