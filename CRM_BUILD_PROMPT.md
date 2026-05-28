# BREED INDUSTRIES — CRM + EMAIL SYSTEM BUILD PROMPT
## Complete build brief for IDE AI agent (Claude / Copilot / Cursor)

---

> **READ THIS FIRST.**
> You are building a full CRM system + email campaign system for the Breed Industries admin panel.
> The codebase is a **Next.js 16 App Router** project. All existing patterns, conventions, and utilities
> must be followed exactly. Read `CLAUDE.md` at the root before writing any code.
>
> **Tech stack already in place:** Next.js 16 App Router · TypeScript · Tailwind CSS · Supabase (PostgreSQL)
> · Resend (email) · jsPDF (PDF) · `supabaseAdmin` (service role) for all server writes.
>
> **Key rules:**
> - All API routes MUST have `export const runtime = 'nodejs'` at the top
> - All writes to Supabase MUST use `supabaseAdmin` from `src/lib/supabase.ts`
> - Admin auth is via `admin_session` cookie — validate in every API route
> - Currency is ZAR, stored in **rands** (quotes/invoices) — no VAT charged
> - Follow the existing dark glassmorphism design system (`--color-bg-deep: #0B1118`, `--color-accent: #FF9F00`)

---

## PART 1 — DATABASE SCHEMA

Run this SQL in the Supabase SQL Editor to create the CRM tables.
Do NOT modify the existing `quotes`, `invoices`, or `tender_*` tables.

```sql
-- ─── CRM CLIENTS ──────────────────────────────────────────────────────────────
create table if not exists crm_clients (
  id            uuid primary key default gen_random_uuid(),
  company_name  text not null,
  contact_name  text,
  contact_email text,
  contact_phone text,
  address       text,
  industry      text,
  status        text not null default 'Active'
                  check (status in ('Active','On Hold','Churned','Prospect')),
  source        text default 'Direct',           -- 'Event', 'Referral', 'Direct', 'Website'
  source_event  text,                             -- event name if source = 'Event'
  drive_folder_url text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── CLIENT SERVICES (many per client) ───────────────────────────────────────
create table if not exists crm_client_services (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references crm_clients(id) on delete cascade,
  service_name  text not null,
  service_category text,
  billing_type  text not null default 'Once-off'
                  check (billing_type in ('Monthly Retainer','Once-off','Project-based')),
  amount_rands  numeric(10,2) default 0,
  start_date    date,
  end_date      date,
  renewal_date  date,           -- for annual renewals (CSD, BEE, CIPC Annual Return)
  status        text not null default 'Active'
                  check (status in ('Active','Completed','Paused','Cancelled')),
  notes         text,
  created_at    timestamptz not null default now()
);

-- ─── LEADS / EVENT ATTENDEES ──────────────────────────────────────────────────
create table if not exists crm_leads (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  company_name  text,
  position      text,
  email         text,
  phone         text,
  source_event  text,
  event_date    date,
  status        text not null default 'New Lead'
                  check (status in ('New Lead','Contacted','Proposal Sent','Converted','Not Interested')),
  package_interest text,
  follow_up_date   date,
  converted_client_id uuid references crm_clients(id),
  notes         text,
  thank_you_sent boolean default false,
  created_at    timestamptz not null default now()
);

-- ─── EMAIL CAMPAIGNS / SENDS ──────────────────────────────────────────────────
create table if not exists crm_email_sends (
  id            uuid primary key default gen_random_uuid(),
  recipient_type text not null check (recipient_type in ('lead','client')),
  recipient_id  uuid not null,         -- crm_leads.id or crm_clients.id
  recipient_email text not null,
  recipient_name  text,
  template_type text not null,         -- see EMAIL TEMPLATES section below
  subject       text,
  status        text default 'sent' check (status in ('sent','failed','bounced')),
  resend_message_id text,
  sent_at       timestamptz not null default now()
);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
create index if not exists idx_crm_client_services_client_id on crm_client_services(client_id);
create index if not exists idx_crm_leads_status on crm_leads(status);
create index if not exists idx_crm_leads_event on crm_leads(source_event);
create index if not exists idx_crm_email_sends_recipient on crm_email_sends(recipient_id);

-- ─── UPDATED AT TRIGGER ───────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;

create trigger crm_clients_updated_at before update on crm_clients
  for each row execute procedure update_updated_at();
```

---

## PART 2 — SERVICE DEFINITIONS FIX

### 2a. Add missing "Business Watch" package to `src/data/serviceDefinitions.ts`

Add this entry to the `serviceDefinitions` array under a new **"Retainer Packages"** category,
placed FIRST in the array so it appears at the top of the quote generator:

```typescript
// ── Retainer Packages (add these at the TOP of the serviceDefinitions array) ──
{
  id: 'business-watch',
  category: 'Retainer Packages',
  name: 'Business Watch (Monthly)',
  description: 'Funding & Accreditation support service designed to help your business proactively access funding opportunities and maintain essential accreditations. Includes monthly monitoring, alerts, and support.',
  basePrice: 'R950/mo',
  requiredDocuments: [
    { name: 'Company Registration', description: 'CIPC certificate', required: true, acceptedFormats: ['.pdf'] },
    { name: 'Current Accreditations', description: 'Any existing certificates (BEE, CSD, Tax Clearance)', required: false, acceptedFormats: ['.pdf'] },
  ],
  additionalInfo: 'Month-to-month. Cancel anytime with 30 days notice.',
},
{
  id: 'business-growth-essentials',
  category: 'Retainer Packages',
  name: 'Business Growth Essentials (Monthly)',
  description: 'Monthly business growth retainer: compliance monitoring, tender watch alerts, social media support, monthly strategy check-in, and priority access to all Breed Industries services.',
  basePrice: 'R950/mo',
  requiredDocuments: [
    { name: 'Company Registration', description: 'CIPC certificate', required: true, acceptedFormats: ['.pdf'] },
    { name: 'Business Overview', description: 'Brief description of your business and goals', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
  ],
  additionalInfo: 'Month-to-month retainer. Includes quarterly business review.',
},
{
  id: 'brand-launch-package',
  category: 'Retainer Packages',
  name: 'Brand Launch Package',
  description: 'Everything to get your brand off the ground: Company Registration + Logo Design + Business Profile + Business Cards. Bundled price, one team, one process.',
  basePrice: 'From R4,500',
  requiredDocuments: [
    { name: 'Director ID Copies', description: 'Certified copies', required: true, acceptedFormats: ['.pdf', '.jpg', '.png'] },
    { name: 'Proof of Address', description: 'Not older than 3 months', required: true, acceptedFormats: ['.pdf', '.jpg', '.png'] },
    { name: 'Brand Brief', description: 'Business name, industry, colour preferences, style references', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
  ],
  additionalInfo: 'Bundled package — saves approx. R800 vs. purchasing individually.',
},
{
  id: 'tender-growth-package',
  category: 'Retainer Packages',
  name: 'Tender Growth Package (Monthly)',
  description: 'Full compliance stack + active tender hunting: CSD + BEE + Tax Clearance + Tender Watch included. Monthly retainer with guaranteed tender alerts every week.',
  basePrice: 'R1,950/mo',
  requiredDocuments: [
    { name: 'CIPC Certificate', description: 'Company registration', required: true, acceptedFormats: ['.pdf'] },
    { name: 'Director ID Copies', description: 'Certified copies of all directors', required: true, acceptedFormats: ['.pdf', '.jpg', '.png'] },
    { name: 'Current Compliance Docs', description: 'Any existing BEE, CSD, Tax Clearance certificates', required: false, acceptedFormats: ['.pdf'] },
  ],
  additionalInfo: 'First month includes compliance audit and setup. Ongoing alerts + monthly report thereafter.',
},
```

### 2b. Add matching entries to `src/data/scopeDetails.ts`

Add these to the `scopeDetails` record:

```typescript
'Business Watch (Monthly)': {
  timeline: 'Month-to-month — first report within 5 business days',
  clientRequirements: [
    'CIPC registration certificate',
    'Current accreditation documents (BEE, CSD, Tax Clearance if available)',
    'Industries and sectors your business operates in',
    'Province(s) you operate in',
    'Contact email for monthly alerts and reports',
    'NOTE: Cancel anytime with 30 days written notice.',
  ],
},
'Business Growth Essentials (Monthly)': {
  timeline: 'Month-to-month — onboarding call within 48 hours',
  clientRequirements: [
    'CIPC registration certificate',
    'Business overview (services, target market, goals)',
    'Current social media accounts (if any)',
    'Province(s) you operate in',
    'Primary contact for monthly check-ins',
  ],
},
'Brand Launch Package': {
  timeline: '10 – 15 Business Days (end-to-end)',
  clientRequirements: [
    'Certified ID copies of all directors',
    'Proof of residential address (not older than 3 months)',
    'Three preferred company name options',
    'Brand name, tagline (if any), and industry description',
    'Target audience and colour preferences',
    'Contact details for business cards',
    'NOTE: Timeline assumes all documents received upfront.',
  ],
},
'Tender Growth Package (Monthly)': {
  timeline: 'Month-to-month — compliance setup in first 10 business days',
  clientRequirements: [
    'All Tender Watch requirements',
    'CIPC certificate',
    'Certified ID copies of all directors',
    'Existing compliance documents (BEE, CSD, Tax Clearance — if any)',
    'Three months bank statements',
    'NOTE: Month 1 includes full compliance audit and gap analysis.',
  ],
},
```

---

## PART 3 — API ROUTES

Create the following API routes. All routes must follow the existing pattern in `src/app/api/`.
Every route needs `export const runtime = 'nodejs'` and must validate `admin_session` cookie.
Use `supabaseAdmin` for all database operations. See `src/lib/supabase.ts` for the import.

### 3a. `src/app/api/crm/clients/route.ts`
- `GET` — list all clients, join `crm_client_services` to compute monthly total per client
- `POST` — create new client; body: `{ company_name, contact_name, contact_email, contact_phone, status, source, drive_folder_url, notes }`

### 3b. `src/app/api/crm/clients/[id]/route.ts`
- `GET` — fetch single client + their services array + email send history
- `PATCH` — update client fields
- `DELETE` — delete client (cascade deletes services)

### 3c. `src/app/api/crm/clients/[id]/services/route.ts`
- `GET` — list all services for a client
- `POST` — add a service; body: `{ service_name, service_category, billing_type, amount_rands, start_date, end_date, renewal_date, status, notes }`

### 3d. `src/app/api/crm/clients/[id]/services/[serviceId]/route.ts`
- `PATCH` — update a service
- `DELETE` — remove a service

### 3e. `src/app/api/crm/leads/route.ts`
- `GET` — list all leads, support query param `?event=` to filter by event name
- `POST` — create lead; body: `{ full_name, company_name, position, email, phone, source_event, event_date, package_interest, notes }`

### 3f. `src/app/api/crm/leads/[id]/route.ts`
- `PATCH` — update lead (status, follow_up_date, notes, converted_client_id)
- `DELETE` — delete lead

### 3g. `src/app/api/crm/leads/convert/route.ts`
- `POST` — convert a lead to a client
- Body: `{ lead_id, company_name, contact_name, contact_email, contact_phone, service_name, billing_type, amount_rands }`
- Creates a new `crm_clients` record, links `crm_leads.converted_client_id`, sets lead status to `'Converted'`

### 3h. `src/app/api/crm/email/send/route.ts`
Full email dispatch endpoint using Resend. Body:
```typescript
{
  template: 'event_thank_you' | 'payment_reminder' | 'document_renewal' | 'service_checkin' | 'welcome_client',
  recipient_type: 'lead' | 'client',
  recipient_id: string,    // crm_leads.id or crm_clients.id
  // optional overrides:
  custom_subject?: string,
  custom_message?: string,
}
```

**Template logic** — implement each template as a function returning `{ subject, html }`:

**`event_thank_you`** (for leads):
- Subject: `"Thank you for attending — Breed Industries"`
- Body: Thanks them by first name for attending [event name] on [event date]. Briefly introduces Breed Industries services. Includes a soft CTA: "We'd love to explore how we can help grow [company]. Reply to this email or call us on +27 60 496 4105."
- Sign off with the Breed Industries branding (orange accent, logo text)

**`welcome_client`** (for new clients):
- Subject: `"Welcome to Breed Industries — [company name]"`
- Body: Welcomes them as a client, lists their active services, gives their dedicated contact (info@thebreed.co.za), and links to the agreement they signed.

**`payment_reminder`** (for clients):
- Subject: `"Payment reminder — [service name] — Breed Industries"`
- Body: Friendly reminder that their [service] invoice is due. Includes banking details (Standard Bank · The Breed Industries (PTY) LTD · Acc: 10268731932 · Branch: 051001 · SWIFT: SBZAZAJJ). Includes the amount due.

**`document_renewal`** (for clients):
- Subject: `"Action required: [document type] renewal — Breed Industries"`
- Body: Alerts them that their [BEE Certificate / CSD Registration / CIPC Annual Return / Tax Clearance] expires / is due for renewal on [date]. Explains what happens if they don't renew (tender disqualification, compliance issues). Includes a CTA to book renewal.

**`service_checkin`** (for clients):
- Subject: `"Monthly check-in — [month] — Breed Industries"`
- Body: Friendly monthly check-in from the team. Lists their current active services. Asks if there's anything they need this month. Soft upsell: "We also help with [complementary services]."

After sending, record the send in `crm_email_sends` table.

### 3i. `src/app/api/crm/email/bulk/route.ts`
- `POST` — send an email to multiple leads from the same event
- Body: `{ event_name: string, template: string }`
- Fetches all leads for that event where `thank_you_sent = false`
- Sends `event_thank_you` to each, marks `thank_you_sent = true`
- Returns `{ sent: number, failed: number, recipients: string[] }`

---

## PART 4 — ADMIN UI PAGES

Use the existing admin glassmorphism design system throughout. Study `src/app/admin/quotes/page.tsx`
for the correct layout pattern (dark cards, orange accents, stats row, table). All pages are
`'use client'` components. Use `fetch('/api/...')` with `credentials: 'include'` for API calls.

### 4a. `src/app/admin/crm/page.tsx` — CRM Dashboard

**Layout (top to bottom):**

1. **Stats row** — 4 cards: Total Active Clients · Total MRR (R) · Leads This Month · Pending Follow-ups
2. **Two-column layout:**
   - Left (60%): Clients table with columns: Company, Contact, Services (badge count), MRR, Status (coloured badge), Actions
   - Right (40%): Recent leads list (last 10, newest first) with name, company, status badge, date added
3. **Buttons:** "Add Client" (top right) · "Import from Register" (imports leads in bulk, see 4c)

**Client status badge colours:**
- Active → green (`text-green-400 bg-green-400/10`)
- On Hold → yellow (`text-yellow-400 bg-yellow-400/10`)
- Churned → red (`text-red-400 bg-red-400/10`)
- Prospect → blue (`text-blue-400 bg-blue-400/10`)

### 4b. `src/app/admin/crm/[id]/page.tsx` — Client Detail

**Layout:**

1. **Header card:** Company name (large), contact name/email/phone, status badge, Drive folder link (if set), "Edit" button
2. **Services section:**
   - Table: Service Name · Category · Billing Type · Amount · Status · Renewal Date · Actions (edit/delete)
   - "+ Add Service" button that opens an inline form
   - Show total MRR at bottom of table
3. **Email history section:** List of all emails sent to this client (date, template type, subject, status)
4. **"Send Email" button** — opens a modal with template selector dropdown + optional custom message field + Send button

### 4c. `src/app/admin/crm/new/page.tsx` — Add Client

Form fields: Company Name · Contact Name · Contact Number · Email · Industry · Status · Source (dropdown: Event/Referral/Direct/Website) · Source Event (text, shows if source=Event) · Drive Folder URL · Notes.

On submit: `POST /api/crm/clients` then redirect to the new client's detail page.

### 4d. `src/app/admin/crm/leads/page.tsx` — Leads Pipeline

**Layout:**

1. **Filter bar:** Filter by event (dropdown from distinct `source_event` values) · Filter by status · Search by name/company
2. **Kanban-style status columns OR table** (table is fine):
   - Columns: Name · Company · Phone · Email · Event · Date · Status (editable inline dropdown) · Follow-up Date · Actions
3. **Per-lead actions:**
   - "Convert to Client" button → opens a modal to confirm company name, add first service, then calls `POST /api/crm/leads/convert`
   - "Send Thank You" button → calls `POST /api/crm/email/send` with template `event_thank_you`
   - Status dropdown inline (updates via `PATCH /api/crm/leads/[id]`)
4. **"Send Thank You to All"** button at the top — calls `POST /api/crm/email/bulk` for the selected event. Shows a confirmation modal listing how many emails will be sent before proceeding.

### 4e. `src/app/admin/crm/email/page.tsx` — Email Campaigns

**Layout:**

1. **Quick Send section:**
   - "Send Event Thank You" — select event from dropdown, shows count of unsent leads, "Send to All" button
   - "Send Payment Reminder" — select client, select service, preview email, send button
   - "Send Document Renewal Alert" — select client, select service with renewal_date set, send button
   - "Monthly Check-in Blast" — select all active clients or individual client, send button

2. **Send History table:**
   - Date · Recipient · Company · Template · Status (sent/failed) · Subject
   - Paginated, 25 per page

---

## PART 5 — ADMIN NAV UPDATE

Update `src/components/admin/AdminNav.tsx` (or wherever the admin sidebar nav is defined) to add:

```
CRM (new section)
  ├── Clients          → /admin/crm
  ├── Leads Pipeline   → /admin/crm/leads
  └── Email Campaigns  → /admin/crm/email
```

Place this section between "Quotes" and "Tenders" in the nav order.

---

## PART 6 — WEBSITE IMPROVEMENTS

After building the CRM, fix these issues on the public-facing site:

### 6a. Retainer Packages visible on `/build-package`

The "Business Watch" and other retainer packages defined in Part 2 are NOT currently in the
`build-package/page.tsx` services list. Add them to the `SERVICES` array at the TOP of the list
so they appear as the first category:

```typescript
// Retainer Packages — add these at the top of the SERVICES array
{ id: 'business-watch',           name: 'Business Watch (Monthly)',           price: 950,  pricingType: 'monthly', icon: <Eye size={16} />,     description: 'Monthly funding & accreditation monitoring with alerts and support.' },
{ id: 'business-growth-essentials', name: 'Business Growth Essentials (Monthly)', price: 950,  pricingType: 'monthly', icon: <TrendingUp size={16} />, description: 'Monthly retainer: compliance monitoring + tender alerts + social media support + strategy check-in.' },
{ id: 'brand-launch-package',     name: 'Brand Launch Package',               price: 4500, pricingType: 'one-time', icon: <Rocket size={16} />,  description: 'Company Registration + Logo + Business Profile + Business Cards. Everything to launch your brand.' },
{ id: 'tender-growth-package',    name: 'Tender Growth Package (Monthly)',    price: 1950, pricingType: 'monthly', icon: <Award size={16} />,   description: 'Full compliance setup + monthly tender watch. Compliance audit in month 1.' },
```

Import `Eye`, `TrendingUp`, `Rocket` from `lucide-react` if not already imported.

### 6b. Services page — ensure packages show

The `/services` page should show the Retainer Packages category. If it filters categories,
make sure 'Retainer Packages' is included and shown first.

### 6c. Quote generator — package names

In `src/components/admin/QuoteGenerator.tsx`, the grouped service picker currently groups by
`serviceDefinitions[].category`. Since we added 'Retainer Packages' as a category, it will
automatically appear. Verify this works by running `npm run build` after changes.

### 6d. Quote PDF — Business Watch description

The quote for Q-2026-6618 shows "Funding & Accreditation support service designed to help your
business" as the description. This comes from `scopeDetails`. After adding the scope detail in
Part 2b, new Business Watch quotes will automatically show the correct full description.

---

## PART 7 — SEED DATA (OPTIONAL BUT RECOMMENDED)

After running the SQL schema, optionally run this in Supabase SQL Editor to seed the 7 leads
from the 27 May 2026 event (update emails/phones where marked with * once verified):

```sql
insert into crm_leads (full_name, company_name, position, email, phone, source_event, event_date, status, package_interest)
values
  ('Thokozani Luthuli',  'Inihadlh Insikaariz',               'Director', 'luthuli@gmail.com',               '078 246 1378', 'Breed Industries Business Meeting — Pinetown Civic Centre', '2026-05-27', 'New Lead', null),
  ('Dumsile Nxunalo',    'Emsedin (Pty) Ltd',                  'Director', 'dumsile.nxunalo@gmail.com',       '073 903 3162', 'Breed Industries Business Meeting — Pinetown Civic Centre', '2026-05-27', 'New Lead', null),
  ('Nkathi Nzunyane',    'Somaphungi Development (Pty) Ltd',   'Director', '',                                '063 866 6703', 'Breed Industries Business Meeting — Pinetown Civic Centre', '2026-05-27', 'New Lead', null),
  ('Ntokoso Nkumalo',    'Hluma Keetsi (Pty) Ltd',             'Director', '',                                '072 271 2716', 'Breed Industries Business Meeting — Pinetown Civic Centre', '2026-05-27', 'New Lead', null),
  ('Blekani Mousyana',   'Blue Case (Pty) Ltd',                'Director', 'blekani.mousyana18@gmail.com',    '067 692 5772', 'Breed Industries Business Meeting — Pinetown Civic Centre', '2026-05-27', 'New Lead', null),
  ('Winkle Zures',       '',                                   'Director', '',                                '084 722 2771', 'Breed Industries Business Meeting — Pinetown Civic Centre', '2026-05-27', 'New Lead', null),
  ('Brekane Mousyana',   'Blue Case (Pty) Ltd',                'Director', '',                                '',             'Breed Industries Business Meeting — Pinetown Civic Centre', '2026-05-27', 'New Lead', null);
```

---

## PART 8 — VERIFICATION

After completing all parts, run:

```bash
npm run build
```

Fix ALL TypeScript errors before considering the build complete. Common things to check:
- All new API routes have `export const runtime = 'nodejs'`
- All `supabaseAdmin` imports are from `src/lib/supabase.ts` (not the anon client)
- All admin pages use `'use client'` at the top
- No circular imports between `serviceDefinitions.ts` and `scopeDetails.ts`
- The `Retainer Packages` category appears in both `serviceDefinitions.ts` and the quote generator

---

## SUMMARY OF FILES TO CREATE / MODIFY

### New files:
- `src/app/api/crm/clients/route.ts`
- `src/app/api/crm/clients/[id]/route.ts`
- `src/app/api/crm/clients/[id]/services/route.ts`
- `src/app/api/crm/clients/[id]/services/[serviceId]/route.ts`
- `src/app/api/crm/leads/route.ts`
- `src/app/api/crm/leads/[id]/route.ts`
- `src/app/api/crm/leads/convert/route.ts`
- `src/app/api/crm/email/send/route.ts`
- `src/app/api/crm/email/bulk/route.ts`
- `src/app/admin/crm/page.tsx`
- `src/app/admin/crm/[id]/page.tsx`
- `src/app/admin/crm/new/page.tsx`
- `src/app/admin/crm/leads/page.tsx`
- `src/app/admin/crm/email/page.tsx`

### Modified files:
- `src/data/serviceDefinitions.ts` — add Retainer Packages category
- `src/data/scopeDetails.ts` — add scope details for new packages
- `src/app/build-package/page.tsx` — add retainer packages to SERVICES array
- `src/components/admin/AdminNav.tsx` (or equivalent) — add CRM nav section

### Database:
- Run the SQL in Part 1 in the Supabase SQL Editor
- Optionally run the seed SQL in Part 7
