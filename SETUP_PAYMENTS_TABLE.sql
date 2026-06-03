-- Create payments table for tracking PayFast and other payment methods
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id TEXT NOT NULL,
  pf_payment_id TEXT UNIQUE, -- PayFast payment ID
  amount DECIMAL(10, 2) NOT NULL,
  amount_gross DECIMAL(10, 2), -- Gross amount before fees
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, complete, failed, cancelled
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT DEFAULT 'payfast', -- payfast, eft, card, etc.
  payment_reference TEXT, -- Transaction reference
  raw_data JSONB, -- Full ITN data from PayFast
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_pf_payment_id ON payments(pf_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

-- Add payment_method, payment_reference, paid_at columns to invoices table if they don't exist
ALTER TABLE invoices 
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (for API routes)
CREATE POLICY "Service role full access on payments"
  ON payments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated admin to read payments
CREATE POLICY "Admins can read payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (true);
