-- Add missing columns to quotes table
-- Run this in Supabase SQL Editor

ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS customer_company TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;
