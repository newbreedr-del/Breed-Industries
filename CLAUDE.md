# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Who Breed Industries Is — Read This First

**Breed Industries builds the infrastructure serious businesses run on.**

This is not a marketing agency. It is not a startup factory. It is a business ecosystem — a community, a training programme, a funding mechanism, and a digital infrastructure builder, all under one roof. Every decision made in this codebase must serve that identity.

### The Origin

Breed Industries grew out of PINC Community NPC — an organisation that fixed infrastructure (streets, lights, public spaces) by organising communities. The same model was applied to business: most South African businesses don't fail because of bad ideas. They fail because of three systemic problems:

1. **Financial Illiteracy** — owners don't know their margins, cash flow, or how to present their numbers to a bank
2. **Accreditation Gaps** — CIPC, SARS, B-BBEE, CSD, CIDB — the compliance maze nobody explains, causing businesses to miss contracts, grants and funding
3. **No Succession** — most businesses die with their founders because nothing is documented, structured, or delegated

Breed Industries exists to solve all three.

### The Model

The business operates as an ecosystem with three entry points:

**1. The Breed Business Network (BBN)**
The community layer. Members pay a monthly retainer to access education, tools, peers, and the compliance support system. This is not a pay-to-start model — it is a pay-to-grow model. Clients don't pay for CIPC registration or a logo. They pay for sustained access to the infrastructure, knowledge and network that makes their business survive and scale.

Membership tiers:
- **Seed** — R950/month: all education events, resource hub, peer community, member rates on services
- **Build** — R1,500/month: everything in Seed + R550/month contribution to the Isivuno Fund, funding access up to R5,000 after 6 months
- **Grow** — R2,200/month: everything in Build + larger pool contribution, funding access up to R15,000, speaker opportunities
- **Scale** — R3,200/month: everything in Grow + max funding access, priority project slots, advisory access

The retainer covers community membership. All project work (web apps, accreditation, tender strategy) is scoped and quoted separately.

**2. The Isivuno Fund**
*Isivuno* = isiZulu for harvest. A community-pooled capital fund. Members contribute monthly. The pool grows. Members who are compliant, trained, and contributing for 6+ months can apply for funding that banks would never approve. 60% community vote determines who gets funded — not a committee, not a bank. Transparent. Accountable. Fair.

This is the funding pillar. It turns the community into a financial institution for its own members.

**3. Build Services (Infrastructure Work)**
When a member is ready, Breed builds the systems their business runs on. This is the high-value work. It is not outsourced. It is not commoditised.

The three pillars of Build Services:
- **Web Applications** — custom platforms, e-commerce, admin systems, AI integrations, WhatsApp agents. Not brochure websites. Actual operational infrastructure.
- **Accreditation & Compliance** — CIPC registration, SARS tax compliance, B-BBEE certification, CSD registration, CIDB grading, tender readiness. The full compliance stack, end to end.
- **Tender Strategy** — AI-powered tender matching across 26+ SA government sources, bid preparation, submission management, relationship tracking.

Everything else — logos, flyers, social media posts — is supplementary. Commodity work that can be outsourced or offered as a convenience to members, not the focus of Breed's energy or positioning.

### The Partner Ecosystem

Breed Industries operates in partnership with external specialists. Current active partnership:

**Peter William Mather (PWM)** — signed NDA dated 9 June 2026. Peter brings expertise in lobbying, safety management systems, training frameworks, ISO quality standards, and compliance accreditation. His Training Academy and sector relationships complement Breed's digital and compliance infrastructure. Peter is the gateway to institutional credibility, corporate supply chain access, and formal training frameworks that support the BBN education pillar.

The Silwela Impumelelo Volunteers SLA (digital services contract) is also connected to this relationship.

### The Brand Voice

Every word on this site should speak to a serious business owner who is done experimenting and ready to build properly. Not someone looking for the cheapest registration. Not someone who wants a quick logo. Someone who understands that a business is infrastructure — and that infrastructure has to be built right or it collapses.

**Headline:** *Breed Industries builds the infrastructure serious businesses run on.*

**Positioning:** Join the network. Get the tools, the training, the community, and the compliance support. When you're ready to build — we build with you.

**Tone:** Direct. Grounded. No hype. No empty superlatives. Speak in outcomes, not features.

---

## Site Restructure — What Is Being Built

The public-facing site is being restructured to reflect the ecosystem identity above. This is the new page map:

### Pages to Keep and Rewrite
- `/` (homepage) — new hero, new positioning, three pillars, CTA to join network
- `/about` — origin story (PINC → Breed), who Sabelo is, the mission
- `/network` *(new)* — The Breed Business Network: membership tiers, Isivuno Fund, what membership actually means, how to join
- `/services` — stripped to the three Build pillars: Web Applications, Accreditation & Compliance, Tender Strategy. Each with scope, process, and a "scope your project" CTA — not a price list
- `/tender-services` — keep as a standalone landing page (it converts well)
- `/portfolio` — proof of work; keep and maintain
- `/contact` — keep
- `/blog` — keep
- `/faq` — keep
- `/fpb-event` — keep (event page)
- `/g` and `/og` — internal utility pages, leave untouched
- `/privacy-policy` and `/terms-of-service` — keep

### Pages to Archive (Do Not Delete, Just Deprioritise)
- `/build-package` — the interactive quote builder. Useful internally but not the face of the brand. Do not link from nav or homepage. May be repurposed as a member-only tool.
- `/fresh-start` — built for zero-stage startups. Conflicts with the new positioning. Keep the route but remove from main navigation.
- `/business-growth` — vague, overlaps everything. Remove from nav.
- `/learners-to-leaders` — noble but off-brand for current focus. Keep the route, remove from nav.
- `/request-service` — superseded by the scoped project approach. Remove from nav.
- `/subscribe/business-growth` — redirect to `/network`

### New Page: `/network`
This is the most important page to build. It must cover:
- What the BBN is and why it exists
- The four membership tiers (Seed / Build / Grow / Scale) with clear benefits per tier
- The Isivuno Fund — how it works, who qualifies, how funding decisions are made
- The monthly education events
- The resource hub
- The peer community
- A clear join CTA (sign up form or WhatsApp link)

### New Page: `/services` (rewrite)
Three sections only:
1. Web Applications — what Breed builds, examples, "scope your project" CTA
2. Accreditation & Compliance — full compliance stack, what's included, timeline
3. Tender Strategy — how the AI matching works, what clients receive, pricing

Remove all package bundles, price lists, and the interactive builder from public view.

---

## Active Work — Site Overhaul in Progress

This codebase is currently undergoing a full public-facing site overhaul. The strategic direction has shifted and the site must reflect it. Here is exactly what that means in practice:

### What Is Being Pulled Out

The following pages, sections and patterns conflict with the new positioning and must be removed from navigation, homepage links, and any internal cross-links. Routes can stay in the filesystem (do not delete) but must be invisible to visitors:

- **All package bundles and price lists** — Breed does not sell off-the-shelf packages anymore. Pricing is scoped per project. Remove any section that shows bundled service pricing (Launch Essentials, Growth Momentum, Empire Ascend, etc.)
- **`/build-package`** — Remove from all navigation and homepage CTAs. Do not delete the route — it may be repurposed as a member-only internal tool.
- **`/fresh-start`** — Remove from navigation. The model of charging people to start businesses is being phased out. The network is the entry point now, not a startup package.
- **`/business-growth`** — Remove from navigation entirely. Vague positioning, overlaps everything, says nothing specific.
- **`/learners-to-leaders`** — Remove from navigation. The training pillar will be rebuilt properly as part of the BBN, not as a standalone page.
- **`/request-service`** — Remove from navigation. The "scope your project" CTA on `/services` replaces this.
- **`/subscribe/business-growth`** — Add a redirect to `/network`.
- **Homepage hero** — The current headline ("We Launch South African Businesses End to End") is gone. Replace with: *Breed Industries builds the infrastructure serious businesses run on.*
- **Any language about logos, flyers, social media posts as primary offerings** — These are supplementary and outsourced. Do not feature them.
- **Any language targeting people who haven't started a business yet** — The audience is serious business owners who are ready to invest in growth, not first-timers looking for the cheapest registration.

### What Is Being Built New

- **`/network`** — New page. The most important page on the site. Full details in the Site Restructure section above.
- **`/services`** — Full rewrite. Three pillars only. No bundles, no builder, no price list.
- **Homepage** — Full rewrite. New hero, ecosystem explanation, three pillars, network CTA.
- **`/about`** — Update to reflect the PINC origin story properly and position Sabelo as an ecosystem builder, not an agency founder.
- **Navigation** — Strip to: Home, Network, Services, Tender Services, Portfolio, About, Contact.

### What Must Not Be Touched

- `src/app/admin/` — the entire admin panel
- `src/app/api/` — all API routes
- All lib files under `src/lib/`
- `/g` and `/og` — internal utility pages, leave exactly as they are
- `/tender-services` — high-converting standalone page, leave the content alone
- `/portfolio` — proof of work, leave it
- `/blog`, `/faq`, `/contact`, `/privacy-policy`, `/terms-of-service` — keep as-is

### Tone Reminder for All New Copy

Every sentence written for the public site must pass this test: *would a serious business owner who is done experimenting find this credible and relevant?* If it sounds like it's selling to someone who just had an idea, rewrite it. If it's explaining what a logo is, cut it. The audience already has a business. They need infrastructure.

---

## What the Admin System Already Does (Do Not Break)

The backend is mature and should not be restructured during the rebrand. Key systems:

- **Tender Intelligence Engine** — automated scraping and matching, runs twice daily
- **Client Tracker (Commitments)** — tracks client obligations, sends WhatsApp/email reminders
- **WhatsApp Campaigns** — consent-first outbound campaign system
- **Operations Agent** — AI command bar (Ctrl+K) in the admin panel
- **Quote & Invoice System** — PDF generation, Supabase storage, email delivery

All of these remain unchanged during the public site rebrand. The rebrand touches `src/app/` public pages only — not `src/app/admin/`, not `src/app/api/`, not any lib files.

---

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
- `src/lib/tenderScraper.ts` — multi-source scraper covering 26+ SA government sources. **Never scrapes eTenders directly** — that portal is an Angular SPA and blocks server-side fetches. Instead uses two strategies per source: (1) `wp-api` — WordPress REST API (`/wp-json/wp/v2/posts?search=tender`) for WP-based departments; (2) `wp-post-scan` — regex HTML extraction for plain pages like DIRCO. Sources: 10 national departments (DIRCO, DPW, DPSA, NT, COGTA, DBE, DOH, DTIC, DWS, DSD, DoT), 4 SOEs (SANRAL, PRASA, NHBRC, DBSA), 9 provincial portals (KZN, GP, WC, EC, LP, MP, NW, FS, NC). All sources run in parallel batches of 6. `scoreTenderForClient()` returns `{ score: number; reasons: string[] } | null`. Score < 20 = no match. Scoring: province (+30/hard-fail if wrong province), category (+25), keywords (+15), commodity codes (+20), CIDB grade (+15/hard-fail if below grade), value ceiling (−20 if over max). Add new sources to the `SOURCES` array in `tenderScraper.ts` — no other changes needed.
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

# WhatsApp AI Agent (OpenRouter)
OPENROUTER_API_KEY            # from openrouter.ai — required for AI agent
OPENROUTER_MODEL              # optional override, default: google/gemini-2.0-flash-001
WHATSAPP_OWNER_NUMBER         # owner's number in SA format (e.g. 0604964105 or 27604964105) — gets full admin AI access
WHATSAPP_ADMIN_NUMBER         # same as owner for most setups; used as fallback notify target

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

---

## Authentication (June 2026 rewrite) — Important

The old "any cookie longer than 10 chars" check is GONE. Auth now works like this:

- `src/lib/auth/session.ts` — HMAC-SHA256 signed, expiring session tokens (Web Crypto, so the same code runs in Edge middleware and Node routes). Signed with the **`SESSION_SECRET`** env var. **If `SESSION_SECRET` is missing, login fails with a 500 — this is intentional fail-closed behaviour, not a bug.**
- `src/middleware.ts` — the single auth gate. It verifies the signed `admin_session` cookie for: `/admin/*`, `/api/admin/*`, `/api/agent/*`, `/api/commitments/*`, `/api/campaigns/*`, `/api/quotes/*`, `/api/invoices/*`, `/api/crm/*`. Emailed PDF/download links (`/api/quotes/download`, `*/pdf`) are carved out. **To protect a new API area, add its prefix to `config.matcher` — do not write per-route auth checks.**
- `/api/admin/login` issues the signed token, is rate-limited (8 tries/min/IP), and has **no default-password fallback** — `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars must be set.
- Old code in `src/lib/adminAuth.ts` (length-check `isAuthenticated`) is legacy; do not use it for new routes. Cron routes still authenticate separately via `Bearer ${CRON_SECRET}` and must fail closed if the secret is unset.

## Operations Agent (the "super agent")

One brain, reachable from the ⌘K / Ctrl+K command bar anywhere in the admin panel:

- `src/lib/agent/registry.ts` — **the single source of truth for every agent capability.** Each tool = one object with `name`, `description`, `permission` (`read` | `write` | `sensitive`), JSON-schema `parameters`, and a `handler`. **To give the agent a new skill, append one object here — nothing else changes.**
- `src/lib/agent/run.ts` — the run loop (OpenRouter chatCompletion). `read` tools execute immediately; `write`/`sensitive` tools are NOT executed — they return as `pendingActions` for the UI confirm card, and only run when the request is re-sent with `confirm: true`. Keep this gate intact: anything touching money or sending messages must be `write` or `sensitive`.
- `POST /api/agent` — secured endpoint; `src/components/agent/CommandBar.tsx` — the UI; mounted by `src/app/admin/layout.tsx`.
- The WhatsApp owner agent (`src/lib/whatsappAgent.ts`) still has its own older tool list — migrating it to `runAgent()` is a planned follow-up.

## Client Tracker (commitments system)

The accountability engine: tracks what clients owe (documents, statutory filings, tender deadlines, ops tasks like stock-takes/targets, training events) and chases them automatically.

- Schema: `src/db/commitments-schema.sql` (tables `client_commitments`, `commitment_reminders`) — run once in Supabase.
- `src/lib/commitments/` — `types.ts` (incl. `daysUntil`, `nextDueDate`), `store.ts` (all DB access; `completeCommitment` rolls recurring items forward instead of closing), `followup.ts` (the daily engine: flags overdue, sends WhatsApp+email nudges per each item's `reminder_offsets`, max once/day/item, then emails+WhatsApps the owner a digest), `templates.ts` + `applyTemplate.ts` (onboarding templates: new_company, vat_vendor, tender_ready, ops_baseline — **edit `templates.ts` only; API/agent/UI read from it**).
- Routes: `/api/commitments` (+`[id]`, `/templates`), cron `/api/cron/commitment-followups` (daily 07:00), manual `/api/admin/run-followups`. UI: `/admin/tracker`.

## WhatsApp Campaigns (CSV → questionnaire → leads)

Consent-first questionnaire campaigns over the Evolution WhatsApp pipe.

- Schema: `src/db/campaigns-schema.sql` (tables `campaigns`, `campaign_contacts`, `campaign_optouts`) — run once in Supabase.
- `src/lib/campaigns/` — `csv.ts` (dependency-free parser, normalises SA numbers to `27XXXXXXXXX`), `store.ts` (CRUD, import skips global opt-outs), `engine.ts` (**two halves**: `handleInbound` = the reply state machine — consent gate requires YES before questions, STOP opts out globally forever; `dripCampaign`/`dripAllSending` = throttled outbound sender, ~1 msg/1.5s, batch-sized).
- **Webhook integration:** `src/app/api/whatsapp/webhook/route.ts` calls `handleCampaignInbound` for non-owner messages BEFORE the AI agent; if `handled`, the AI agent is skipped. Preserve this ordering.
- Routes: `/api/campaigns` (+`[id]`, `[id]/contacts` CSV import, `[id]/drip`), cron `/api/cron/campaign-drip` (every 15 min, weekday business hours). UI: `/admin/campaigns`.
- **Compliance invariants — do not remove:** the consent-first intro, STOP → `campaign_optouts` (honoured across ALL campaigns), and send throttling. POPIA + WhatsApp ban risk are the reasons.

## New environment variables (June 2026)

```
SESSION_SECRET   # REQUIRED — signs admin sessions; login 500s without it (fail-closed)
```

No other new vars: the agent uses OPENROUTER_*, tracker/campaigns reuse RESEND_*, Evolution WhatsApp vars, and CRON_SECRET.

## Docs written this session

`ADMIN-PANEL-AUDIT.md` (full audit + roadmap), `AGENT-SETUP.md`, `CLIENT-TRACKER.md`, `WHATSAPP-CAMPAIGNS.md`, `GIT-COMMIT-PLAN.md` (what to commit and in what order).
