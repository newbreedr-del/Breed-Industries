# Breed Industries — Client Tracker

The accountability engine. It knows what every client owes — documents, statutory
deadlines, tender submissions, day-to-day operations, training events — and chases
them automatically so you don't have to.

---

## How it works

1. You (or the agent) log a **commitment** against a client: what's due, by when,
   whether it recurs, and how to reach them.
2. A **daily sweep** (07:00) flags anything overdue, sends the client a WhatsApp
   and/or email nudge based on each item's reminder schedule, and emails **you** a
   "who's behind" digest.
3. You watch it all from **`/admin/tracker`** or just ask the agent (`⌘K`).

Reminders are de-duplicated to once per day per item, so the sweep is safe to
re-run, and recurring items (weekly stock-take, annual returns) roll forward
automatically when marked done.

---

## One-time setup

1. **Create the tables.** Open Supabase → SQL Editor → paste and run
   `src/db/commitments-schema.sql`.

2. **Confirm env vars** (you already have these): `RESEND_API_KEY`, `COMPANY_EMAIL`,
   `ADMIN_EMAIL`, `CRON_SECRET`, and the Evolution WhatsApp vars. The owner digest
   WhatsApp uses `WHATSAPP_OWNER_NUMBER`.

3. **Deploy.** The daily cron is already added to `vercel.json`
   (`/api/cron/commitment-followups` at 07:00). Vercel injects the `CRON_SECRET`
   auth header automatically.

That's it — no new keys beyond what the agent setup already needed.

---

## Using it

**From the dashboard** (`/admin/tracker`):
- See everything grouped: Overdue · Due today · Next 7 days · Later.
- **New** adds a commitment (with client contact + recurrence).
- The green check marks an item done (recurring ones roll forward).
- **Run follow-ups** triggers the sweep on demand and reports what it sent.

**From the agent** (`⌘K`):
- *"what's overdue"* / *"who's behind this week"*
- *"track a monthly stock-take for Acme starting 1 July"*
- *"mark commitment <id> done"*
- *"run the follow-ups now"* → confirm card → sends real reminders

---

## Commitment types

| Type | For |
|---|---|
| `document` | Paperwork you need FROM the client (IDs, financials, proof of address) |
| `statutory` | CIPC annual returns, SARS/VAT, BEE renewals — set recurrence |
| `tender` | A tender's submission/briefing deadline |
| `operations` | Client's day-to-day: stock-takes, sales targets, staff check-ins |
| `event_training` | An event or training session the client must attend |
| `custom` | Anything else |

Each item carries its own `reminder_offsets` (default 7/3/1/0 days before due) and
`notify_channels` (WhatsApp + email). Once overdue, it nudges daily until closed.

---

## Verify before deploying

Run locally:

```bash
npm run build
```

If TypeScript flags a Supabase column on the CRM lookup inside
`src/lib/commitments/store.ts` (it reads `crm_clients.contact_name / contact_email /
contact_phone`), align it to your actual CRM column names.

---

## Onboarding templates

One click (or one sentence to the agent) applies a standard obligation set to a new
client, anchored to a start date. Defined in `src/lib/commitments/templates.ts` —
edit that one file to change or add templates; the API, agent, and UI pick it up.

| Template | What it creates |
|---|---|
| **New Company Registration** | Incorporation documents checklist, SARS registration, bank account, CIPC annual return (recurs annually), first provisional tax |
| **VAT Vendor Pack** | VAT registration documents, VAT201 cycle (recurs bi-monthly) |
| **Tender-Ready Pack** | CSD verification, tax clearance pin (annual), BEE renewal (annual), quarterly profile refresh |
| **Operations Baseline** | Weekly stock-take, monthly target review, monthly staff check-in |

Use it from `/admin/tracker` → **Onboard with template**, or via the agent:
*"apply the new company template to Acme, starting 1 July, phone 0821234567"*.

> The statutory timing offsets are sensible defaults, not legal advice — adjust
> them in `templates.ts` to match how you actually run these processes.

## Natural next steps

- **Per-client view**: a commitments tab on each CRM client page.
- **Document upload**: let a nudge link to an upload so clients can submit on the spot
  (pairs with the signed-download-token follow-up from the audit).
