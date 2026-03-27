-- Setup RLS Policies for Quotes and Invoices
-- Run this in Supabase SQL Editor to allow public access to quotes and invoices tables

-- First, disable RLS temporarily to clean up
ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all operations on quotes" ON quotes;
DROP POLICY IF EXISTS "Allow all operations on invoices" ON invoices;
DROP POLICY IF EXISTS "Enable read access for all users" ON quotes;
DROP POLICY IF EXISTS "Enable insert access for all users" ON quotes;
DROP POLICY IF EXISTS "Enable update access for all users" ON quotes;
DROP POLICY IF EXISTS "Enable delete access for all users" ON quotes;
DROP POLICY IF EXISTS "Enable read access for all users" ON invoices;
DROP POLICY IF EXISTS "Enable insert access for all users" ON invoices;
DROP POLICY IF EXISTS "Enable update access for all users" ON invoices;
DROP POLICY IF EXISTS "Enable delete access for all users" ON invoices;

-- Re-enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for quotes (allow all operations)
CREATE POLICY "Enable read access for all users" ON quotes
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users" ON quotes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON quotes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON quotes
  FOR DELETE
  USING (true);

-- Create permissive policies for invoices (allow all operations)
CREATE POLICY "Enable read access for all users" ON invoices
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users" ON invoices
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON invoices
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON invoices
  FOR DELETE
  USING (true);

-- Verify policies are created
SELECT 'Quotes table policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'quotes';

SELECT 'Invoices table policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'invoices';

-- Test access by counting records
SELECT 'Testing quotes access:' as info;
SELECT COUNT(*) as quote_count FROM quotes;

SELECT 'Testing invoices access:' as info;
SELECT COUNT(*) as invoice_count FROM invoices;

-- Show sample data
SELECT 'Sample quotes:' as info;
SELECT quote_number, customer_name, project_name, total, status 
FROM quotes 
ORDER BY created_at DESC 
LIMIT 5;

SELECT 'Setup complete!' as info;
