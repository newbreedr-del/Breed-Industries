# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build (run before every deploy to catch type errors)
npm run lint       # ESLint check
npm run lint:fix   # ESLint auto-fix
```

No test suite exists. Use `npm run build` as the primary verification step — TypeScript and Next.js will surface broken imports, type mismatches, and missing `export const runtime` declarations.

---

## Architecture Overview

This is a **Next.js 16 App Router** project (not Pages Router). All routes live under `src/app/`. The site is a full-stack business services platform for Breed Industries — a South African agency. It has three distinct systems:

### 1. Public Marketing Site (`src/app/`)
Standard Next.js pages. Each has its own `page.tsx`. No shared state between pages. Animation via Framer Motion; icons via Lucide React.

Key pages:
- `/build-package` — interactive multi-step service quote builder (purely client-side, no API until form submission)
- `/tender-services` — marketing landing page for the tender product
- `/fresh-start` — client onboarding page

### 2. Admin Panel (`src/app/admin/`)
All admin pages are `'use client'` components that call API routes directly. There is **no middleware auth guard** — authentication is checked by each API route individually via the `admin_session` cookie. The login sets a cookie; `adminAuth.ts` checks it. The session token is a random string (not JWT); validity is checked only by length > 10 chars.

Admin sections:
- `/admin` — dashboard with stat cards
- `/admin/quotes` — CRUD for quotes; delete uses `supabaseAdmin`
- `/admin/quotes/new` — `QuoteGenerator` component with grouped searchable service picker
- `/admin/invoices` — invoice management, PDF generation
- `/admin/tenders` — tender dashboard (stats, matches, add manually)
- `/admin/tender-clients` — client profile management with province/category/CIDB fields
- `/admin/tender-clients/[id]` — individual client detail with match history

### 3. Tender Intelligence Engine
Fully automated. No client-facing UI — clients receive everything by email.

Flow: `vercel.json` cron → `POST /api/cron/scrape-tenders` → `tenderScraper.ts` → `tenderStorage.ts` → `tenderEmail.ts` → client email

Key files:
- `src/lib/tenderScraper.ts` — scrapes eTenders + 10 provincial portals via `fetch` + regex HTML parsing (no cheerio). `scoreTenderForClient()` returns `{ score: number; reasons: string[] } | null`. Score < 20 = no match. Scoring: province (+30/hard-fail), category (+25), commodity codes (+20), CIDB grade (+15/hard-fail), value range (−20 if over max), keywords (+10).
- `src/lib/tenderStorage.ts` — all Supabase reads/writes for tender tables. Uses `supabaseAdmin` (service role key).
- `src/lib/tenderEmail.ts` — sends match alerts directly to `client.email`, with a separate internal copy to `ADMIN_EMAIL`. The weekly digest goes to admin only.
- `src/db/tender-schema.sql` — run once in Supabase SQL Editor to create the 5 tender tables.

Cron schedule (vercel.json):
- `0 6,18 * * *` — scrape + match twice daily
- `0 8 * * 1` — weekly digest to admin (Mondays)

Cron auth: `Authorization: Bearer ${CRON_SECRET}` header. Set `CRON_SECRET` in Vercel env vars.

---

## Supabase Client Rules — Important

There are **two Supabase clients** in `src/lib/supabase.ts`:

```ts
export const supabase      // anon key — use in public-facing read operations only
export const supabaseAdmin // service role key — use in ALL API routes that write or delete
```

All server-side API routes (`src/app/api/**`) that perform INSERT, UPDATE, or DELETE **must** import `supabaseAdmin`. The anon client is blocked by RLS for write operations. `tenderStorage.ts` and all quote/invoice API routes already use `supabaseAdmin`. If you add new API routes that write to Supabase, use `supabaseAdmin`.

The `invoiceStorage.ts` lib still uses the anon key — if invoice mutations start failing, switch it to `supabaseAdmin`.

All API routes must include `export const runtime = 'nodejs'` at the top (required for jsPDF, fs, and Supabase server-side usage).

---

## PDF Generation

`src/lib/pdf/breedPdf.ts` is a single-file PDF design system built on jsPDF (v4). It is **server-side only** — never import it in client components.

Key functions:
- `generateQuotePDF(data: QuoteData): Buffer` — full multi-page quote PDF with branded letterhead, items table, scope section, payment terms, and banking details
- `generateInvoicePDF(data: InvoiceData): Buffer` — invoice variant

Page overflow guard pattern used throughout:
```ts
y = Math.min(y, FOOTER_Y - blockH - 4);
```
The `checkPageBreak(doc, y, neededHeight)` function handles pagination and re-draws the letterhead on continuation pages.

Logo is loaded from `public/assets/images/logos/breed-logo-just.png` at runtime via `fs.readFileSync`. If the logo file path changes, update the `logoPaths` array in `loadLogoBase64()`.

---

## Service Data Architecture

Service information is split across three files that must stay in sync when adding new services:

| File | Purpose |
|---|---|
| `src/data/serviceDefinitions.ts` | Service metadata, categories, required documents (used by `ServiceRequestForm`) |
| `src/data/scopeDetails.ts` | Timeline + client requirements per service (used by PDF generator and `QuoteGenerator`) |
| `src/app/build-package/page.tsx` | Pricing options displayed in the builder UI |

When adding a new service, add it to all three. The `getScopeDetail(serviceName)` function in `scopeDetails.ts` returns a fallback for unknown names, so missing entries won't crash — they'll just show generic text in PDFs.

---

## Design System

CSS tokens are in `src/styles/tokens.css` (imported in root layout). Key values:

| Token | Value | Notes |
|---|---|---|
| `--color-bg-deep` | `#0B1118` | Primary page background |
| `--color-bg-secondary` | `#121820` | Section backgrounds |
| `--color-accent` | `#FF9F00` | Orange — all interactive elements, highlights |
| `--font-heading` | Montserrat | All `font-heading` classes |
| `--font-body` | Inter | Default body |

Glassmorphism utilities (defined in `globals.css`): `.glass-card`, `.glass-card-strong`, `.glass-card-light`, `.glass-card-accent`. Use these for admin panels, cards, and modals — not raw `bg-white/5` combinations.

The `.grid-overlay` class renders the background grid texture used on section backgrounds.

Marketing brand accent is `#CA8114` (burnt amber) in the SVG poster files under `Marketing Campaign/03-Posters/` — this is intentionally different from the site's `#FF9F00` orange.

---

## Email

All transactional email uses **Resend** via `src/lib/tenderEmail.ts` and the quote/invoice routes.

- From address must be a domain verified in Resend (`COMPANY_EMAIL` env var)
- Quote emails: sent from `/api/generate-quote` and `/api/admin/send-quote-email`
- Tender match alerts: go directly to `client.email` with BCC-equivalent separate send to `ADMIN_EMAIL`
- Never send from `@gmail.com` or unverified domains — Resend will reject

WhatsApp notifications use Twilio (`src/lib/twilio.ts`, `src/lib/whatsapp.ts`). These are best-effort — failures are caught and logged but don't block the main flow.

---

## Environment Variables

Required in `.env.local` (local) and Vercel dashboard (production):

```
# Core
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY     # server-side writes — never expose to client
RESEND_API_KEY
COMPANY_EMAIL                 # verified Resend sender domain
ADMIN_EMAIL                   # internal notifications recipient
ADMIN_USERNAME
ADMIN_PASSWORD

# Tender engine
CRON_SECRET                   # secures /api/cron/scrape-tenders

# Optional
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER
YOUR_WHATSAPP_NUMBER
CONTACT_PHONE
```

`NEXT_PUBLIC_` prefix exposes variables to the browser. Never put `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, or `ADMIN_PASSWORD` with the `NEXT_PUBLIC_` prefix.

---

## Admin API Routes — Scrape Trigger

**Never call `/api/cron/scrape-tenders` from the browser.** That endpoint requires `Authorization: Bearer ${CRON_SECRET}`, which is a server-only env var and is never available in `'use client'` components.

The admin panel uses a dedicated proxy route instead:

```
POST /api/admin/run-scrape
```

This route (`src/app/api/admin/run-scrape/route.ts`) authenticates via the `admin_session` cookie (same as all other admin routes) and calls `runTenderScrapeAndMatch()` directly on the server. The button in `src/app/admin/tenders/page.tsx` calls this route — do not change it back to the cron endpoint.

The two endpoints serve different callers:
- `/api/cron/scrape-tenders` — Vercel Cron only (CRON_SECRET header required)
- `/api/admin/run-scrape` — Admin panel browser button (admin_session cookie required)

---

## Tender Client Categories

`src/app/admin/tender-clients/page.tsx` contains a `CATEGORIES` constant (~80 entries) aligned to South African government procurement taxonomy: CIDB disciplines, CSD commodity groups, and eTenders portal categories. When adding or removing categories, keep them consistent with the scoring logic in `src/lib/tenderScraper.ts` — the scraper's `scoreTenderForClient()` matches tender categories against `client.service_categories` using case-insensitive substring matching.

---

## Key Conventions

- All API routes under `src/app/api/` must export `export const runtime = 'nodejs'` — the default Edge runtime breaks `fs`, jsPDF, and the Supabase Node client.
- The admin panel has no Next.js middleware. Individual page components redirect to `/admin/login` if the API returns 401.
- `src/lib/supabase-server.ts` and `src/lib/supabase-storage.ts` exist but are legacy — prefer the clients exported from `src/lib/supabase.ts`.
- Currency is always South African Rand (ZAR). Format as `R {amount}` with no space between R and digits in headings, but `R {amount}` in body text. Breed Industries is not VAT registered — all quotes/invoices are VAT-exclusive.
- All monetary values stored in Supabase are in **cents** for tender `estimated_value` (`tender.estimated_value / 100` to display), but in **rands** for quotes and invoices.
- **Never expose `CRON_SECRET` to the browser.** Do not add a `NEXT_PUBLIC_CRON_SECRET` env var — if you need to trigger a scrape from the admin UI, use `/api/admin/run-scrape` instead.
