# Tender Engine — Deployment & Setup Guide

## 1. Run the database migration

Open **Supabase → SQL Editor** and paste the contents of `src/db/tender-schema.sql`, then click **Run**.

This creates five tables:
- `tender_clients` — businesses subscribed to tender services
- `tenders` — all scraped government tenders
- `tender_matches` — which tenders matched which clients
- `tender_applications` — bid tracking and outcomes
- `tender_notifications` — deduplication log (prevents repeat emails)

---

## 2. Set environment variables

### Local development — `.env.local`

These are already set for you:

```
CRON_SECRET=breed-tender-cron-2025-secret
ADMIN_EMAIL=info@thebreed.co.za
CONTACT_PHONE=+27 60 496 4105
```

### Vercel production — Dashboard → Settings → Environment Variables

Add all of these (use the same values as `.env.local` but with production credentials):

| Variable | Description | Example |
|---|---|---|
| `CRON_SECRET` | Secret used to authenticate Vercel Cron calls. Must match exactly. | `breed-tender-cron-2025-secret` |
| `ADMIN_EMAIL` | Receives internal copies of all match alerts + weekly digest | `info@thebreed.co.za` |
| `COMPANY_EMAIL` | Sender address on client-facing emails (must be verified in Resend) | `info@thebreed.co.za` |
| `CONTACT_PHONE` | Phone number shown in client emails | `+27 60 496 4105` |
| `RESEND_API_KEY` | Already set — confirm it's in Vercel too | `re_xxx...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Already set | `https://zdpbkrrohdwohelsrvic.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Already set | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Already set — **keep secret, server-only** | `eyJ...` |

> **Important:** `CRON_SECRET` must be identical in Vercel env vars and in `vercel.json`. Vercel sends it as `Authorization: Bearer <CRON_SECRET>` with every cron call, and the `/api/cron/scrape-tenders` route checks it before running.

---

## 3. Verify Vercel Cron jobs

`vercel.json` already defines two cron jobs:

```json
{ "path": "/api/cron/scrape-tenders",           "schedule": "0 6,18 * * *" }
{ "path": "/api/cron/scrape-tenders?mode=digest","schedule": "0 8 * * 1"   }
```

- **Twice-daily scrape** — runs at 06:00 and 18:00 UTC every day
- **Weekly digest** — runs at 08:00 UTC every Monday, sends admin the weekly summary

After deploying, confirm they appear in **Vercel Dashboard → Project → Cron Jobs**.

---

## 4. Add your first tender client

1. Go to `https://www.thebreed.co.za/admin/tender-clients`
2. Click **Add Client**
3. Fill in: company name, contact name, email, province(s), industry categories, CIDB grade, package tier
4. Save — the client is now active and will receive match emails on the next scrape

---

## 5. Trigger a manual scrape (optional)

To test immediately without waiting for the cron:

```bash
curl -X POST https://www.thebreed.co.za/api/cron/scrape-tenders \
  -H "Authorization: Bearer breed-tender-cron-2025-secret"
```

Or open the URL directly in your browser (it will return 401 without the header — that's correct).

From the admin dashboard at `/admin/tenders`, you can also view all scraped tenders and matches without needing to trigger a scrape.

---

## 6. Client email flow

Clients **do not** need to log in anywhere. The entire client-facing experience is email:

1. Breed adds the client to the admin panel with their email + preferences
2. The cron scrapes eTenders twice a day, matches tenders to clients
3. Each matched client gets an email with the tender details and a "Contact Our Team" button
4. Admin gets a separate internal copy with a link to the dashboard
5. Closing reminders are sent 7 days and 1 day before the deadline
6. Admin receives a Monday morning digest with stats

---

## 7. Tender sources scraped

- South African Government eTenders Portal (`etenders.gov.za`)
- Eastern Cape (SCMU)
- Gauteng Provincial Treasury
- KwaZulu-Natal Treasury
- Western Cape Supply Chain
- City of Johannesburg
- City of Cape Town
- eThekwini Municipality
- SANRAL, Transnet, Eskom
- Department of Public Works

The scraper uses regex-based HTML parsing (no external dependencies). If a portal changes its HTML structure, update the regex in `src/lib/tenderScraper.ts` under the `parseHtmlTenders()` function.

---

## 8. Package pricing reference

| Package | Price | Billing |
|---|---|---|
| Tender Ready | R3,500 | Once-off |
| Tender Watch | R950 | Monthly |
| Tender Apply | R2,500 | Monthly |
| Tender Full Service | R6,500 | Monthly |

These are also selectable in the **Build Package** quote builder at `/build-package`.
