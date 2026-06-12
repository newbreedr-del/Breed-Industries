# Breed Industries — WhatsApp Questionnaire Campaigns

Upload a CSV of numbers → the system sends a consent-first questionnaire over
WhatsApp → captures answers one question at a time → turns completed responses
into CRM leads. Built for lead generation, marketing, research, and event
recruitment.

---

## How it works

1. **Create a campaign** (`/admin/campaigns` → New campaign): name it, write the
   opening message, add your questions, set whether completion creates a lead.
2. **Upload contacts** (campaign page → Upload CSV): SA numbers are normalised,
   de-duplicated, and anyone on the global opt-out list is skipped automatically.
3. **Send** (Send next batch): the engine messages the next throttled batch with a
   **consent-first** opener — recipients must reply **YES** before any questions,
   and **STOP** opts them out forever.
4. **Replies are captured** by the WhatsApp webhook and walked through the
   questionnaire. The AI agent is bypassed for active participants.
5. **Completion** stores the answers, optionally creates a CRM lead, and pings you
   on WhatsApp for hot leads.

The daily/business-hours **drip cron** (`/api/cron/campaign-drip`, every 15 min on
weekday business hours) keeps large lists sending gradually so your number isn't
flagged.

---

## One-time setup

1. **Create the tables**: Supabase → SQL Editor → run `src/db/campaigns-schema.sql`.
2. Confirm your **Evolution WhatsApp** env vars are set (same ones the existing
   WhatsApp agent uses) and `CRON_SECRET` is set.
3. Deploy — the drip cron is already in `vercel.json`.

No new keys.

---

## CSV format

A header row is detected automatically. Recognised phone headers: `phone`, `number`,
`mobile`, `cell`, `whatsapp`, `contact`. Recognised name headers: `name`, `full name`,
`client`. If there's no header, column 1 is treated as the phone and column 2 as the
name. Any other columns are stored against the contact.

```csv
name,phone
Thandi Mokoena,082 123 4567
Sipho Dlamini,0739876543
```

Only valid SA mobile numbers (normalised to `27XXXXXXXXX`) are imported; the upload
report tells you how many were skipped.

---

## ⚠️ Compliance — read this

You chose mixed warm/cold lists, so the guardrails are on by default, but the law is
still your responsibility:

- **POPIA**: South Africa restricts unsolicited direct marketing. You should have
  consent or an existing relationship for the numbers you upload. The consent-first
  opener and STOP handling are built in to support this — keep them.
- **WhatsApp bans**: Evolution is an unofficial gateway. Even with throttling,
  blasting large cold lists risks a permanent ban on your number. Start with warm
  lists, small batches, and watch for delivery issues before scaling.
- The global opt-out list (`campaign_optouts`) is honoured across **every** campaign —
  once someone says STOP, they're never contacted again.

Use it as a relationship tool, not a spam cannon, and it'll bring in clients without
torching your number or your compliance.

---

## From the agent (⌘K)

- *"list my campaigns"* / *"how did the [x] campaign do"*
- *"send the next batch for campaign <id>"* → confirm card → sends invites

---

## Natural next steps

- **Branching questions** (different next question based on an answer).
- **Scheduled sends** (e.g. only 09:00–17:00, which the cron window already approximates).
- **Lead scoring** from answers, so hot leads jump to the top of the CRM.
