-- Real Quote Data with Actual PDF Dates (Comma Format)
-- Run this in Supabase SQL Editor to update quote numbers to use commas

-- Update existing quotes to use comma format
UPDATE quotes SET quote_number = 'Q,2026,9926' WHERE quote_number = 'Q-2026-9926';
UPDATE quotes SET quote_number = 'Q,2026,5447' WHERE quote_number = 'Q-2026-5447';
UPDATE quotes SET quote_number = 'Q,2026,3433' WHERE quote_number = 'Q-2026-3433';
UPDATE quotes SET quote_number = 'Q,2026,3225' WHERE quote_number = 'Q-2026-3225';

-- Verify the updates
SELECT 'Updated quotes with comma format:' as info;
SELECT 
  quote_number, 
  customer_name, 
  project_name, 
  total, 
  status,
  DATE(created_at) as quote_date
FROM quotes 
ORDER BY created_at DESC;
