# Breed Industries — Admin Panel Audit & Master-Class Roadmap

**Date:** 12 June 2026
**Scope:** `src/app/admin/**`, `src/app/api/**`, `src/lib/**`
**Reviewer:** Engineering audit

---

## 1. Executive Summary

The admin panel is genuinely impressive in surface area. In one Next.js app you've built an invoicing system, a quote generator with branded PDF output, a full CRM (clients, leads, email campaigns), a bookings/seat-reservation system, a blog CMS, an FAQ manager, a payments integration (PayFast + Stitch), an automated tender-intelligence engine scraping 26+ government sources, and a WhatsApp AI agent that can run admin tasks over chat. That is a remarkable amount of working product for a single codebase.

The problem is not capability — it's that the foundation hasn't kept pace with the feature growth. The single most important finding is that **the authentication system does not actually protect anything**. Most API routes have no auth check at all, and the ones that do accept any cookie longer than 10 characters as valid. A person who types `document.cookie = "admin_session=aaaaaaaaaaa"` into their browser console has full admin access to quotes, invoices, client data, and the AI agent. Everything else in this document is secondary to fixing that.

Below: the critical issues first (fix this week), then structural improvements that would take this from "powerful but fragile" to "master-class," then a concrete code appendix you can lift directly.

**Severity counts:** 🔴 Critical: 4 · 🟠 High: 6 · 🟡 Medium: 7 · 🟢 Polish: 8

---

## 2. What You've Built (Feature Inventory)

| Module | Routes | Purpose |
|---|---|---|
| Dashboard | `/admin` | Stat cards, nav hub (17 sections) |
| Invoices | `/admin/invoices`, `/create`, `/[id]`, `/[id]/edit` | CRUD + branded PDF + payment status |
| Quotes | `/admin/quotes`, `/new`, `/import`, `/[id]/edit` | Quote builder, PDF, email send |
| CRM | `/admin/crm`, `/new`, `/[id]`, `/leads`, `/email` | Clients, MRR rollups, leads, bulk email |
| Bookings | `/admin/bookings` | Seat reservations + reminders |
| Tenders | `/admin/tenders`, `/[id]`, `/tender-clients` | Scrape engine, matches, client profiles |
| Comms | `/admin/messages`, `/contacts`, `/whatsapp`, `/secretary` | Inbox, contacts, WhatsApp AI agent |
| Content | `/admin/blog`, `/faq` | Blog CMS (Tiptap), FAQ manager |
| Growth | `/admin/invites`, `/reminders`, `/subscriptions` | Invites/OTP, reminders, subscriptions |

Roughly **76 API routes** and **37 admin pages**. The breadth is the achievement; the consistency is the opportunity.

---

## 3. 🔴 Critical Findings (fix this week)

### 3.1 Authentication is effectively absent

**The token check accepts anything.** `src/lib/adminAuth.ts`:

```ts
export function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  return token.length > 10; // Basic validation  ← any 11-char string passes
}
```

The session token is `Math.random().toString(36)...` — not signed, not stored, not verifiable. There is no way to tell a real session from a forged one, because "validation" is just a length check. Anyone can self-issue a valid cookie. This single line nullifies the entire admin login.

**Most routes don't even call it.** Of ~76 API routes, only **22** contain any auth check. The core business endpoints — `/api/quotes`, `/api/quotes/[id]`, `/api/invoices`, `/api/invoices/[id]`, `/api/blog`, `/api/service-requests`, `/api/clients` — are fully open. `DELETE /api/quotes?id=…` runs with `supabaseAdmin` (service-role, bypasses RLS) and has no auth at all. Your customer list, invoice totals, and client PII are a single `curl` away.

**Each route reimplements the check.** `run-scrape` imports from `adminAuth`; `crm/clients` defines its own local `isAuthenticated`. Same logic, copy-pasted, drifting. There's no single source of truth to harden.

**Fix:** signed/stored sessions + Next.js middleware that guards `/admin` and `/api/admin` (and the business routes) in one place. Full code in Appendix A. This is the highest-leverage change in the entire document.

### 3.2 Secrets committed to source

`src/lib/supabase.ts` hardcodes the production Supabase URL **and anon key** as fallback literals:

```ts
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJI...Oe0';
```

The anon key is in your git history. While the anon key is "public" by Supabase's model, it is only safe **if RLS is enforced on every table** — and you're routinely bypassing RLS with `supabaseAdmin`, which means your security model leans on app-layer auth that (per 3.1) isn't there. Remove the literals; fail loudly if the env var is missing. Rotate the key after confirming RLS coverage.

### 3.3 Default admin password fallback

`adminAuth.ts`:

```ts
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'breed2025';
```

If `ADMIN_PASSWORD` is ever unset in an environment, the password silently becomes a value that's now written in your repo. (The newer `/api/admin/login/route.ts` correctly refuses when env vars are missing — but the old `verifyCredentials` helper still ships the fallback.) Delete the literal; treat a missing env var as a hard 500, never a default credential.

### 3.4 The WhatsApp webhook trusts a spoofable identity

`/api/whatsapp/webhook` has **no signature verification**. It determines "is this the owner?" purely from the phone number in the request body:

```ts
const ownerSending = isOwner(phone); // phone comes from untrusted webhook payload
if (ownerSending) {
  const reply = await processMessage(...); // full admin AI agent: can update statuses, trigger scrapes, read business data
}
```

Anyone who can POST to this public endpoint and sets `data.key.remoteJid` to your owner number gets the **full admin AI agent** — the same one that can mutate records and read quotes/invoices/clients. Webhooks must be authenticated by a shared secret or provider signature (Twilio/Evolution both support this), *and* owner-elevation should never rest on a value the caller controls. Appendix D.

---

## 4. 🟠 High-Priority Findings

### 4.1 `if (secret && auth !== ...)` — auth that disables itself

The cron route (and others) use this shape:

```ts
const secret = process.env.CRON_SECRET ?? '';
if (secret && auth !== `Bearer ${secret}`) return 401;
```

If `CRON_SECRET` is unset, `secret` is falsy and **the check is skipped entirely** — the endpoint becomes public. "Misconfiguration → wide open" is exactly backwards. A missing secret should fail closed (reject), not fail open.

### 4.2 Three different data-access patterns

Writes happen via (a) direct `supabase`/`supabaseAdmin` calls inside routes, (b) `invoiceStorage.ts` / `tenderStorage.ts` lib functions, and (c) a mix of anon vs admin client. The CLAUDE.md even notes `invoiceStorage.ts` "still uses the anon key" — except it now imports `supabaseAdmin as supabase`, so the docs are already stale. This inconsistency is how RLS-bypass mistakes and "why is this read using the admin client?" bugs creep in. Standardize on a thin repository layer (Appendix C).

### 4.3 Public reads use the anon client but rely on no RLS

`GET /api/quotes` uses the anon `supabase` client. That's correct *only* if `quotes` has an RLS policy. If it doesn't (and given `supabaseAdmin` is used to bypass RLS elsewhere, policies are likely absent), then either the read fails in prod or the table is world-readable. You need an explicit RLS posture per table, documented and tested.

### 4.4 No rate limiting on login or webhooks

`/api/admin/login` does a plain string compare with no attempt throttling — brute-forceable. Public webhooks (`whatsapp`, `payfast/itn`, `stitch`) can be hammered. Add IP-based rate limiting (Appendix E uses Upstash; a memory limiter is fine for single-instance).

### 4.5 Production logging leaks environment state

`/api/quotes` logs key previews and env presence on every request:

```ts
console.log('🔍 Environment check:', { keyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0,20) + '...' });
```

Partial keys in logs are still a leak, and error responses return `details: error.message` plus environment status to the client. Strip diagnostic logging and never return internal error text or env state to the browser.

### 4.6 No input validation layer

Routes destructure `await req.json()` and trust it. `POST /api/crm/clients` checks only that `company_name` exists; everything else flows straight to the DB. There's no schema validation, so malformed or oversized payloads, wrong types, and unexpected fields all reach Supabase. Adopt **Zod** at the route boundary (Appendix B) — it's the single biggest reliability win after auth.

---

## 5. 🟡 Medium-Priority Findings

1. **No middleware at all.** CLAUDE.md states this as a deliberate choice, but it's the root cause of 3.1's "every route reimplements auth." One `middleware.ts` removes ~22 copy-pasted checks and closes the ~54 routes that have none.
2. **Inconsistent error contracts.** Some routes return `{ error }`, some `{ error, details, code, environment }`, some `{ success: false }`. The frontend can't handle errors uniformly. Standardize on `{ ok: false, error: { code, message } }`.
3. **No pagination on heavy lists.** `GET /api/quotes` and CRM clients `select('*')` with no limit. Fine at 50 rows, a problem at 5,000. Invoices already paginate — bring the rest in line.
4. **In-process state won't survive serverless.** `whatsappAgent.ts` keeps `conversationHistory` in a module-level `Map`. On Vercel each invocation may be a fresh instance, so conversation memory is lost or inconsistent. Move to Supabase (you already log messages) or Redis.
5. **Client-side auth gating is cosmetic.** Admin pages redirect to `/admin/login` on a 401, but the page and its data are already shipped to the browser before that. Real protection must be server-side (middleware).
6. **`maxDuration` mismatch risk.** `run-scrape` sets `maxDuration = 300` and a 270s wall clock; the cron route sets `maxDuration = 60`. On Hobby plans the platform cap is 10s/60s — a 270s scrape will be killed mid-run. Confirm the plan tier matches these numbers.
7. **Type safety opt-outs.** Pervasive `any` (`items: any` in the DB types, `catch (error: any)`, `.map((c: any) => …)`). Each `any` is a place a runtime shape can drift from the type with no warning. Tighten the hot paths (money, tender scoring) first.

---

## 6. 🟢 Polish & DX

- **Dead/test routes in prod:** `/api/test-supabase`, `/api/test-twilio`, `/api/admin/test-scrape`, `/api/admin/verify-supabase` should be gated to non-production or deleted.
- **Shared admin layout:** every admin page re-imports `Header`/`Footer`/`PageHero` and re-implements logout. An `admin/layout.tsx` with a sidebar + auth gate would remove hundreds of duplicated lines.
- **Loading/empty/error states:** standardize via a `<DataState>` wrapper instead of per-page `useState` booleans.
- **Optimistic UI** on status toggles (quote → sent, invoice → paid) for snappiness.
- **Toast system** instead of `alert()` / inline banners.
- **`React Query` / SWR** for fetching — dedupes, caches, revalidates, and kills most of the manual `useEffect` + `fetch` boilerplate.
- **Audit log table** — who changed which quote/invoice/client and when. Cheap to add, invaluable later.
- **No test suite.** Even a handful of tests around `scoreTenderForClient()` and PDF money math would catch the costly regressions.

---

## 7. Prioritized Roadmap

**Week 1 — Stop the bleeding (security)**
1. Replace `isAuthenticated` with signed sessions (Appendix A).
2. Add `middleware.ts` guarding `/admin` + `/api/admin` + business routes (Appendix A).
3. Remove hardcoded Supabase key and password fallbacks (3.2, 3.3).
4. Authenticate the WhatsApp webhook; stop trusting payload phone for elevation (3.4).
5. Flip all `if (secret && …)` checks to fail-closed (4.1).

**Week 2 — Make it trustworthy (correctness)**
6. Introduce Zod validation on every mutating route (Appendix B).
7. Audit RLS policies per table; document the posture (4.3).
8. Standardize the error contract and strip diagnostic logging (4.5, 5.2).
9. Add rate limiting to login + public webhooks (4.4).

**Week 3–4 — Make it scale (architecture)**
10. Introduce a repository layer; collapse the three data patterns (4.2, Appendix C).
11. Move WhatsApp conversation memory to the DB (5.4).
12. Add `admin/layout.tsx` with shared sidebar + server auth gate.
13. Adopt SWR/React Query; add pagination everywhere.
14. Add an audit log + a first test around tender scoring and PDF math.

---

## 8. Appendix — Drop-in Code

> These are starting points matched to your stack (Next 16 App Router, Supabase, TypeScript). Adjust table/column names to your schema.

### Appendix A — Real sessions + one middleware guard

**`src/lib/auth/session.ts`** — signed, verifiable tokens (HMAC, no new dependency):

```ts
import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = process.env.SESSION_SECRET;
if (!SECRET) throw new Error('SESSION_SECRET is not set'); // fail closed

const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function issueSession(username: string): string {
  const payload = JSON.stringify({ u: username, t: Date.now() });
  const body = Buffer.from(payload).toString('base64url');
  const sig = createHmac('sha256', SECRET!).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifySession(token: string | undefined): { username: string } | null {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const expected = createHmac('sha256', SECRET!).update(body).digest('base64url');
  const a = Buffer.from(sig); const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { u, t } = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (Date.now() - t > MAX_AGE_MS) return null; // expired
    return { username: u };
  } catch { return null; }
}
```

**`src/middleware.ts`** — guards everything in one place:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';

const PUBLIC_API = [
  '/api/admin/login',
  '/api/payments/payfast/itn',
  '/api/stitch/webhook',
  '/api/whatsapp/webhook', // authenticated separately by signature
  '/api/cron/',            // authenticated by CRON_SECRET
  '/api/contact',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith('/admin') ||
    (pathname.startsWith('/api/admin') && !PUBLIC_API.some(p => pathname.startsWith(p)));

  if (!isProtected) return NextResponse.next();

  const session = verifySession(req.cookies.get('admin_session')?.value);
  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHENTICATED' } }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/quotes/:path*', '/api/invoices/:path*', '/api/clients/:path*', '/api/crm/:path*'],
};
```

Update `/api/admin/login` to call `issueSession(username)` instead of `Math.random()`. After this, individual routes can delete their local `isAuthenticated` helpers — the middleware has already rejected unauthenticated callers.

### Appendix B — Zod validation at the route boundary

```ts
// src/lib/validation/crmClient.ts
import { z } from 'zod';

export const CreateClientSchema = z.object({
  company_name: z.string().min(1).max(200),
  contact_name: z.string().max(200).optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().max(40).optional(),
  status: z.enum(['Active', 'Inactive', 'Prospect']).default('Active'),
  source: z.string().max(80).default('Direct'),
  industry: z.string().max(120).optional(),
  notes: z.string().max(5000).optional(),
});

// in the route:
const parsed = CreateClientSchema.safeParse(await request.json());
if (!parsed.success) {
  return NextResponse.json(
    { ok: false, error: { code: 'VALIDATION', issues: parsed.error.flatten() } },
    { status: 400 },
  );
}
const { data, error } = await supabaseAdmin.from('crm_clients').insert(parsed.data).select().single();
```

### Appendix C — One repository layer (collapses the 3 patterns)

```ts
// src/lib/repos/quotes.ts
import { supabaseAdmin } from '@/lib/supabase';

export const quotesRepo = {
  list: ({ limit = 50, offset = 0 } = {}) =>
    supabaseAdmin.from('quotes').select('*', { count: 'exact' })
      .order('created_at', { ascending: false }).range(offset, offset + limit - 1),
  get: (id: string) => supabaseAdmin.from('quotes').select('*').eq('id', id).single(),
  create: (row: QuoteInsert) => supabaseAdmin.from('quotes').insert(row).select().single(),
  remove: (id: string) => supabaseAdmin.from('quotes').delete().eq('id', id),
};
```

Routes become three lines and there's exactly one place that decides anon-vs-admin and applies pagination.

### Appendix D — Authenticate the WhatsApp webhook

```ts
export async function POST(request: NextRequest) {
  // 1. Shared-secret header (set the same value in your WhatsApp provider config)
  const sig = request.headers.get('x-webhook-token');
  if (!process.env.WHATSAPP_WEBHOOK_SECRET || sig !== process.env.WHATSAPP_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // 2. Even authenticated, never let a payload phone grant admin powers without
  //    a server-side allowlist AND a second factor for destructive actions.
  // ...existing handling...
}
```

If your provider (Twilio / Evolution) signs requests, verify the HMAC signature instead of a static token — it's strictly better.

### Appendix E — Fail-closed secret check + simple rate limit

```ts
// Fail closed: missing secret = reject, not allow
const secret = process.env.CRON_SECRET;
if (!secret) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
if (req.headers.get('authorization') !== `Bearer ${secret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Minimal in-memory limiter (single instance) — swap for Upstash on multi-instance
const hits = new Map<string, { n: number; reset: number }>();
export function rateLimit(key: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now > rec.reset) { hits.set(key, { n: 1, reset: now + windowMs }); return true; }
  if (rec.n >= max) return false;
  rec.n++; return true;
}
```

---

## 9. Closing

You've built something most agencies pay a team to build. The features are real and they work. What's missing is the unglamorous layer underneath — authentication that authenticates, validation that validates, one consistent way to touch the database. None of the Week-1 fixes change what the app *does*; they change whether you can trust it in front of real customer data. Do those five things first, and the rest of this roadmap is steady, low-risk refinement on a foundation that finally holds weight.
