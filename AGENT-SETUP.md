# Breed Industries — Super Agent & Security Setup

You now have a unified **Operations Agent** reachable with one keystroke, sitting on a
real authentication foundation. This file is what you need to turn it on.

---

## 1. What was added

**Security foundation (the lock):**

| File | What it does |
|---|---|
| `src/lib/auth/session.ts` | HMAC-signed, expiring session tokens (Web Crypto — works in Edge + Node). Replaces the old "any 10-char cookie is valid" check. |
| `src/middleware.ts` | One gate that verifies the signed session for `/admin`, `/api/admin`, `/api/agent`, `/api/quotes`, `/api/invoices`, `/api/crm`. |
| `src/app/api/admin/login/route.ts` | Now issues a *signed* session + has basic brute-force throttling. Fails closed if credentials aren't configured. |

**The agent (the brain + the whisper):**

| File | What it does |
|---|---|
| `src/lib/agent/registry.ts` | The single source of truth for every agent capability. One object per skill. |
| `src/lib/agent/run.ts` | The agent core. Drives the model, runs read tools, and **queues write/sensitive tools for confirmation**. |
| `src/app/api/agent/route.ts` | Secured `POST /api/agent` endpoint. |
| `src/components/agent/CommandBar.tsx` | The ⌘K command bar UI. |
| `src/app/admin/layout.tsx` | Mounts the command bar across the whole admin panel. |

---

## 2. Required: set `SESSION_SECRET`

The new sessions are signed with `SESSION_SECRET`. **Until you set it, login and the
admin panel will return a 500** (this is intentional — it fails closed rather than
falling back to a guessable default).

Add to `.env.local` and to your Vercel project (Settings → Environment Variables):

```
SESSION_SECRET=<paste a long random string>
```

Generate one:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

You already have `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `OPENROUTER_API_KEY` — the
agent reuses those. No new keys beyond `SESSION_SECRET`.

> After deploying, everyone is logged out once (old cookies are no longer valid).
> Log in again and you'll get a proper signed session.

---

## 3. How to use it

Press **⌘K** (Mac) or **Ctrl+K** (Windows) anywhere in the admin panel — or click the
**Ask Agent** button bottom-right. Then talk to it:

- *"how are we doing this month"* → live snapshot: quotes, outstanding invoices, leads, tenders
- *"show unpaid invoices"* → instant list
- *"latest tender matches"* → newest matches with scores
- *"mark INV-014 as paid"* → **confirm card** appears; nothing happens until you click Confirm
- *"run a tender scrape"* → confirm card → triggers the real scrape
- *"whatsapp 0821234567 that their documents are ready"* → confirm card → sends

Read requests answer immediately. Anything that changes data or sends a message is
**queued and shown to you to confirm first** — that's the safety rail.

---

## 4. How to give it new powers

Add one object to `AGENT_TOOLS` in `src/lib/agent/registry.ts`. That's the only file
you touch — the command bar, the API, and any future WhatsApp/scheduled use all pick it
up automatically.

```ts
{
  name: 'create_invoice_from_quote',
  description: 'Create an invoice from an accepted quote by quote number.',
  permission: 'write',          // 'read' = instant · 'write'/'sensitive' = needs confirm
  parameters: {
    type: 'object',
    properties: { quote_id: { type: 'string', description: 'Quote number or UUID' } },
    required: ['quote_id'],
  },
  handler: async (a) => {
    // ...call your real code, return any JSON-serialisable value
  },
},
```

Pick the permission honestly: if it spends money or sends a message, make it
`sensitive`. The confirmation gate is only as good as the labels.

---

## 5. Verify before deploying

The sandbox couldn't build here (disk space), so run this locally:

```bash
npm run build
```

It should compile clean. If TypeScript flags a Supabase column name (e.g. the tender
tables use `scraped_at` / `active` in the existing WhatsApp agent but the generated
types say `created_at` / `is_active`), align the column name in `registry.ts` to your
actual schema — the read tools are written to match the existing working WhatsApp agent.

---

## 6. Deliberate follow-ups (noted, not done)

- **Invoice/quote PDF links** are exempted from the auth gate so emailed links keep
  working. They're currently reachable by ID — add signed, expiring download tokens.
- **WhatsApp webhook** still trusts the payload phone number for owner elevation
  (Appendix D in `ADMIN-PANEL-AUDIT.md`). Lock that next so the *chat* whisper channel
  is as safe as the web one.
- **Migrate the WhatsApp owner agent** to call `runAgent()` so both surfaces share this
  one registry instead of maintaining two tool lists.
