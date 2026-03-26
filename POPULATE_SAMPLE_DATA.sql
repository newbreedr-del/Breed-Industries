-- Sample Data for Quotes and Invoices
-- Run this in Supabase SQL Editor to populate your database

-- Insert Sample Quotes
INSERT INTO quotes (
  id, quote_number, customer_name, customer_email, project_name, contact_person, 
  items, total, status, created_at, updated_at
) VALUES 
(
  'quote_lino_9926',
  'Q-2026-9926',
  'Lino',
  'lino@example.com',
  'Website Development',
  'Lino',
  '[
    {
      "id": "item_1",
      "name": "Website Design & Development",
      "description": "Full responsive website with CMS",
      "quantity": 1,
      "rate": 15000,
      "amount": 15000,
      "pricingType": "one-time"
    },
    {
      "id": "item_2",
      "name": "Hosting Setup",
      "description": "First year hosting included",
      "quantity": 1,
      "rate": 2000,
      "amount": 2000,
      "pricingType": "one-time"
    }
  ]',
  17000,
  'sent',
  '2026-03-20T10:00:00.000Z',
  '2026-03-20T10:00:00.000Z'
),
(
  'quote_mzokuthula_5447',
  'Q-2026-5447',
  'Mzokuthula Chiliza',
  'mzokuthula.chiliza@example.com',
  'Business Registration',
  'Mzokuthula Chiliza',
  '[
    {
      "id": "item_1",
      "name": "Company Registration",
      "description": "Private company registration with CIPC",
      "quantity": 1,
      "rate": 3500,
      "amount": 3500,
      "pricingType": "one-time"
    },
    {
      "id": "item_2",
      "name": "Tax Registration",
      "description": "SARS tax registration and compliance",
      "quantity": 1,
      "rate": 1500,
      "amount": 1500,
      "pricingType": "one-time"
    }
  ]',
  5000,
  'sent',
  '2026-03-15T10:00:00.000Z',
  '2026-03-15T10:00:00.000Z'
),
(
  'quote_nolwazi_3433',
  'Q-2026-3433',
  'Nolwazi Herbal',
  'nolwazi@herbal.co.za',
  'E-commerce Website',
  'Nolwazi',
  '[
    {
      "id": "item_1",
      "name": "E-commerce Platform",
      "description": "Online store with payment integration",
      "quantity": 1,
      "rate": 25000,
      "amount": 25000,
      "pricingType": "one-time"
    },
    {
      "id": "item_2",
      "name": "Product Photography",
      "description": "Professional product photoshoot",
      "quantity": 50,
      "rate": 100,
      "amount": 5000,
      "pricingType": "one-time"
    }
  ]',
  30000,
  'pending',
  '2026-03-10T10:00:00.000Z',
  '2026-03-10T10:00:00.000Z'
),
(
  'quote_zama_3225',
  'Q-2026-3225',
  'Zama Shengu',
  'zama.shengu@example.com',
  'Mobile App Development',
  'Zama Shengu',
  '[
    {
      "id": "item_1",
      "name": "iOS App Development",
      "description": "Native iOS application",
      "quantity": 1,
      "rate": 20000,
      "amount": 20000,
      "pricingType": "one-time"
    },
    {
      "id": "item_2",
      "name": "Android App Development",
      "description": "Native Android application",
      "quantity": 1,
      "rate": 20000,
      "amount": 20000,
      "pricingType": "one-time"
    }
  ]',
  40000,
  'sent',
  '2026-03-05T10:00:00.000Z',
  '2026-03-05T10:00:00.000Z'
);

-- Insert Sample Invoice
INSERT INTO invoices (
  id, invoice_number, quote_number, customer_name, customer_email, customer_phone, 
  customer_address, items, one_time_total, monthly_total, deposit, balance, total_amount,
  status, payment_status, due_date, issue_date, paid_date, paid_amount, payment_date,
  stitch_payment_id, stitch_payment_url, notes, created_at, updated_at
) VALUES (
  'inv_sample_001',
  'INV-202603-0001',
  'Q-2026-9926',
  'Lino',
  'lino@example.com',
  '+27 12 345 6789',
  '123 Main St, Johannesburg',
  '[
    {
      "id": "item_1",
      "name": "Website Design & Development",
      "description": "Full responsive website with CMS",
      "quantity": 1,
      "rate": 15000,
      "amount": 15000,
      "pricingType": "one-time"
    }
  ]',
  15000,
  0,
  7500,
  7500,
  15000,
  'sent',
  'unpaid',
  '2026-04-20T10:00:00.000Z',
  '2026-03-20T10:00:00.000Z',
  NULL,
  0,
  NULL,
  NULL,
  NULL,
  'Payment terms: 50% deposit required before work commences',
  '2026-03-20T10:00:00.000Z',
  '2026-03-20T10:00:00.000Z'
);

-- Verify data was inserted
SELECT 'Quotes inserted:' as info;
SELECT COUNT(*) as quote_count FROM quotes;

SELECT 'Invoices inserted:' as info;
SELECT COUNT(*) as invoice_count FROM invoices;

SELECT 'Sample quotes:' as info;
SELECT quote_number, customer_name, project_name, total, status FROM quotes ORDER BY created_at DESC;

SELECT 'Sample invoice:' as info;
SELECT invoice_number, customer_name, total_amount, payment_status FROM invoices ORDER BY created_at DESC;
