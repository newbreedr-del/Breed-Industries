-- Real Quote Data with Actual PDF Dates
-- Run this in Supabase SQL Editor to populate with your actual quote dates

-- Quote 1: Lino (PDF created: 2026/02/27)
INSERT INTO quotes (
  id, quote_number, customer_name, customer_email, project_name, contact_person, 
  items, total, status, created_at, updated_at
) VALUES (
  'quote_q_2026_9926',
  'Q-2026-9926',
  'Lino',
  'lino@example.com',
  'Website Development',
  'Lino',
  '[{"id":"item_1","name":"Website Development","description":"Website Development services","quantity":1,"rate":10000,"amount":10000,"pricingType":"one-time"}]',
  10000,
  'sent',
  '2026-02-27T12:27:31.670Z',
  '2026-02-27T12:27:31.670Z'
);

-- Quote 2: Mzokuthula Chiliza (PDF created: 2026/03/18)
INSERT INTO quotes (
  id, quote_number, customer_name, customer_email, project_name, contact_person, 
  items, total, status, created_at, updated_at
) VALUES (
  'quote_q_2026_5447',
  'Q-2026-5447',
  'Mzokuthula Chiliza',
  'mzokuthula.chiliza@example.com',
  'Business Registration',
  'Mzokuthula Chiliza',
  '[{"id":"item_1","name":"Business Registration","description":"Business Registration services","quantity":1,"rate":15000,"amount":15000,"pricingType":"one-time"}]',
  15000,
  'sent',
  '2026-03-18T12:48:32.595Z',
  '2026-03-18T12:48:32.595Z'
);

-- Quote 3: Nolwazi Herbal (PDF created: 2026/02/17)
INSERT INTO quotes (
  id, quote_number, customer_name, customer_email, project_name, contact_person, 
  items, total, status, created_at, updated_at
) VALUES (
  'quote_q_2026_3433',
  'Q-2026-3433',
  'Nolwazi Herbal',
  'nolwazi.herbal@example.com',
  'Herbal Business',
  'Nolwazi Herbal',
  '[{"id":"item_1","name":"Herbal Business","description":"Herbal Business services","quantity":1,"rate":20000,"amount":20000,"pricingType":"one-time"}]',
  20000,
  'sent',
  '2026-02-17T09:48:24.253Z',
  '2026-02-17T09:48:24.253Z'
);

-- Quote 4: Zama Shengu (PDF created: 2026/03/20)
INSERT INTO quotes (
  id, quote_number, customer_name, customer_email, project_name, contact_person, 
  items, total, status, created_at, updated_at
) VALUES (
  'quote_q_2026_3225',
  'Q-2026-3225',
  'Zama Shengu',
  'zama.shengu@example.com',
  'Development Project',
  'Zama Shengu',
  '[{"id":"item_1","name":"Development Project","description":"Development Project services","quantity":1,"rate":25000,"amount":25000,"pricingType":"one-time"}]',
  25000,
  'sent',
  '2026-03-20T09:15:54.110Z',
  '2026-03-20T09:15:54.110Z'
);

-- Verify data was inserted with correct dates
SELECT 'Quotes with real PDF dates:' as info;
SELECT 
  quote_number, 
  customer_name, 
  project_name, 
  total, 
  status,
  created_at,
  DATE(created_at) as quote_date
FROM quotes 
ORDER BY created_at DESC;
