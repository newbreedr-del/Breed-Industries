-- ─── CRM CLIENT SEED DATA ────────────────────────────────────────────────────
-- Clients with full contact details extracted from Breed Industries tracker
-- Run AFTER the schema SQL (crm_clients + crm_client_services tables must exist)

-- ─── INSERT CLIENTS ───────────────────────────────────────────────────────────
insert into crm_clients (company_name, contact_name, contact_phone, contact_email, status, source, notes) values
  ('Nthandokazi Herbal',          'Nthona',                   '0659992025',       'info@intandokaziherbal.co.za',    'Active', 'Direct', null),
  ('Ellabody Treats',             'Stella Lekhoana',          '0610943760',       'stella_lekhoana@live.co.za',      'Active', 'Direct', null),
  ('Kays Logistic PTY LTD',       'Khalid Dladla',            '+27 67 694 5364',  'dladlakhalid@gmail.com',          'Active', 'Direct', null),
  ('Mamphela Manyaka',            'Mamphela Manyaka',         '0638878384',       'Mamphelamanyaka@gmail.com',       'Active', 'Direct', 'Private individual'),
  ('Manqoba Mfeka',               'Manqoba Mfeka',            '0766329939',       'manqoba@gmail.com',               'Active', 'Direct', 'Private individual'),
  ('Mpilwenhle Gasa',             'Mpilwenhle Gasa',          '0725345409',       'ziggygasa@gmail.com',             'Active', 'Direct', '16 Sanderson Rd, Cowies Hill'),
  ('Nokukhanya Mpanza',           'Nokukhanya Patricia Mpanza','0818111946',      'patmpanza@gmail.com',             'Active', 'Direct', '514 8th Ave Clermont'),
  ('Nthona M Perfumes',           'Nthona Mokoatle',          '0659992025',       'nthonamokoatle@gmail.com',        'Active', 'Direct', '114 Fairyway, Durban North'),
  ('Oxen E-Sport',                'Darryn Mogane',            '+27 65 939 3227',  'oxenesports1@gmail.com',          'Active', 'Direct', 'Team discount applied'),
  ('Sibongiseni Khati',           'Sibongiseni Khati',        '0686117692',       'djsboh.networks@gmail.com',       'Active', 'Direct', '49 Tyzack St, South Beach, Durban'),
  ('Sihle Xulu',                  'Sihle Xulu',               '0848647967',       'xulu199@gmail.com',               'Active', 'Direct', 'Private individual'),
  ('Sizwile Training and Internet','Mr Mnguni',               '0612549353',       'sizwiletechnology@gmail.com',     'Active', 'Direct', null),
  ('THABANI NDIMANDE',            'Thabani Ndimande',         '0766860824',       'lsambulo28@gmail.com',            'Active', 'Direct', '6 Michael Rd, Mount Vernon, Durban'),
  ('Tenshu Holdings',             'Gugulethu',                '0629495549',       'gugulethu@gmail.com',             'Active', 'Direct', '104 Cartmel Rd, Palmiet, Durban'),
  ('Zamashengu Agri Business',    'Zamashengu Tshabalala',    '0631602261',       'zamashengu.t1@gmail.com',         'Active', 'Direct', null);

-- ─── INSERT SERVICES ──────────────────────────────────────────────────────────
-- Nthandokazi Herbal
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'Marketing Materials Design', 'Marketing', 'Once-off', 450, 'Active', 'Quote value: R450'
from crm_clients where company_name = 'Nthandokazi Herbal' limit 1;

-- Ellabody Treats
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status)
select id, 'Business Watch Monthly', 'Retainer Package', 'Monthly Retainer', 950, 'Active'
from crm_clients where company_name = 'Ellabody Treats' limit 1;

-- Kays Logistic PTY LTD
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status)
select id, 'Tender Apply Monthly', 'Tender Services', 'Monthly Retainer', 950, 'Active'
from crm_clients where company_name = 'Kays Logistic PTY LTD' limit 1;

-- Mamphela Manyaka
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'BEE Certification', 'Compliance', 'Once-off', 250, 'Active', 'Quote value: R250'
from crm_clients where company_name = 'Mamphela Manyaka' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CIPC Company Registration', 'Compliance', 'Once-off', 550, 'Active', 'Quote value: R550'
from crm_clients where company_name = 'Mamphela Manyaka' limit 1;

-- Manqoba Mfeka
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'Indlovu Artwork (Logo & Branding)', 'Brand Identity', 'Once-off', 1200, 'Active', 'Quote value: R1,200'
from crm_clients where company_name = 'Manqoba Mfeka' limit 1;

-- Mpilwenhle Gasa
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CIPC Company Registration', 'Compliance', 'Once-off', 550, 'Active', 'Quote value: R550'
from crm_clients where company_name = 'Mpilwenhle Gasa' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CSD Registration', 'Compliance', 'Once-off', 450, 'Active', 'Quote value: R450'
from crm_clients where company_name = 'Mpilwenhle Gasa' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'SARS Tax Returns', 'Compliance', 'Once-off', 850, 'Active', 'Quote value: R850'
from crm_clients where company_name = 'Mpilwenhle Gasa' limit 1;

-- Nokukhanya Mpanza
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CIPC Company Registration', 'Compliance', 'Once-off', 550, 'Active', 'Quote value: R550'
from crm_clients where company_name = 'Nokukhanya Mpanza' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'BEE & Beneficial Ownership Certificate', 'Compliance', 'Once-off', 250, 'Active', 'Quote value: R250'
from crm_clients where company_name = 'Nokukhanya Mpanza' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'Tax Clearance Setup & Pin', 'Compliance', 'Once-off', 800, 'Active', 'Quote value: R800'
from crm_clients where company_name = 'Nokukhanya Mpanza' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CSD Registration & Pin', 'Compliance', 'Once-off', 450, 'Active', 'Quote value: R450'
from crm_clients where company_name = 'Nokukhanya Mpanza' limit 1;

-- Nthona M Perfumes
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'Mobile App Development (iOS & Android)', 'Technology', 'Project-based', 15000, 'Active', 'Quote value: R15,000'
from crm_clients where company_name = 'Nthona M Perfumes' limit 1;

-- Oxen E-Sport
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'Website Development (5-page, team discount)', 'Technology', 'Once-off', 1500, 'Active', 'Quote value: R1,500'
from crm_clients where company_name = 'Oxen E-Sport' limit 1;

-- Sibongiseni Khati
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CIPC Company Registration', 'Compliance', 'Once-off', 550, 'Active', 'Quote value: R550'
from crm_clients where company_name = 'Sibongiseni Khati' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'Tax Compliance (SARS registration)', 'Compliance', 'Once-off', 850, 'Active', 'Quote value: R850'
from crm_clients where company_name = 'Sibongiseni Khati' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CSD Registration', 'Compliance', 'Once-off', 450, 'Active', 'Quote value: R450'
from crm_clients where company_name = 'Sibongiseni Khati' limit 1;

-- Sihle Xulu
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'Tender Ready Package', 'Tender Services', 'Once-off', 3000, 'Active', 'Quote value: R3,000'
from crm_clients where company_name = 'Sihle Xulu' limit 1;

-- Sizwile Training and Internet
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status)
select id, 'Business Watch Monthly', 'Retainer Package', 'Monthly Retainer', 950, 'Active'
from crm_clients where company_name = 'Sizwile Training and Internet' limit 1;

-- THABANI NDIMANDE
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CIPC Company Registration', 'Compliance', 'Once-off', 550, 'Active', 'Quote value: R550'
from crm_clients where company_name = 'THABANI NDIMANDE' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'BEE Certification and SARS', 'Compliance', 'Once-off', 250, 'Active', 'Quote value: R250'
from crm_clients where company_name = 'THABANI NDIMANDE' limit 1;

-- Tenshu Holdings
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CIPC Update (Director Amendments)', 'Compliance', 'Once-off', 550, 'Active', 'Quote value: R550'
from crm_clients where company_name = 'Tenshu Holdings' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'Tax Compliance (SARS returns + clearance)', 'Compliance', 'Once-off', 650, 'Active', 'Quote value: R650'
from crm_clients where company_name = 'Tenshu Holdings' limit 1;

-- Zamashengu Agri Business
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CIPC Company Registration', 'Compliance', 'Once-off', 550, 'Active', 'Quote value: R550'
from crm_clients where company_name = 'Zamashengu Agri Business' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'Tax Compliance (SARS registration)', 'Compliance', 'Once-off', 850, 'Active', 'Quote value: R850'
from crm_clients where company_name = 'Zamashengu Agri Business' limit 1;
insert into crm_client_services (client_id, service_name, service_category, billing_type, amount_rands, status, notes)
select id, 'CSD Registration', 'Compliance', 'Once-off', 450, 'Active', 'Quote value: R450'
from crm_clients where company_name = 'Zamashengu Agri Business' limit 1;
