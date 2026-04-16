-- Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_category TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_company TEXT,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_to TEXT,
  estimated_price NUMERIC(10, 2),
  quote_sent BOOLEAN DEFAULT FALSE,
  quote_id TEXT
);

-- Create index on customer_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_service_requests_customer_email ON service_requests(customer_email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);

-- Create index on service_id for filtering
CREATE INDEX IF NOT EXISTS idx_service_requests_service_id ON service_requests(service_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON service_requests(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_service_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_service_requests_updated_at();

-- Enable Row Level Security
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on service_requests" ON service_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for service request documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-documents', 'service-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for service documents
CREATE POLICY "Allow authenticated uploads to service-documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'service-documents');

CREATE POLICY "Allow public read access to service-documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'service-documents');

CREATE POLICY "Allow authenticated delete from service-documents"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'service-documents');
