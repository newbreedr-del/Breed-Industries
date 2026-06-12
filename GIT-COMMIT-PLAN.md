# Git Commit Plan — June 2026 build session

Everything below was added/changed in this session. Suggested as **four commits**
so the history stays readable, but one commit also works. Verify `npm run build`
passes before pushing.

> **Never commit:** `.env.local` (contains secrets — confirm it's in `.gitignore`).
> The `.next/` build folder should also be ignored.

---

## Commit 1 — Security: signed sessions + single auth gate

```
feat(auth): signed HMAC sessions, middleware gate, hardened login
```

| File | Status |
|---|---|
| `src/lib/auth/session.ts` | NEW — HMAC-signed expiring session tokens (Web Crypto, Edge+Node) |
| `src/middleware.ts` | MODIFIED — verifies signed session for /admin, /api/admin, /api/agent, /api/commitments, /api/campaigns, /api/quotes, /api/invoices, /api/crm; PDF/download carve-out |
| `src/app/api/admin/login/route.ts` | MODIFIED — issues signed token, rate-limited, fails closed (no default password) |

**Requires env var:** `SESSION_SECRET` (local + Vercel).

## Commit 2 — Super agent: tool registry + ⌘K command bar

```
feat(agent): unified tool registry, agent core with confirm gate, command bar
```

| File | Status |
|---|---|
| `src/lib/agent/registry.ts` | NEW — every agent capability defined once (read/write/sensitive) |
| `src/lib/agent/run.ts` | NEW — run loop; write/sensitive tools queue for confirmation |
| `src/app/api/agent/route.ts` | NEW — secured POST /api/agent |
| `src/components/agent/CommandBar.tsx` | NEW — ⌘K / Ctrl+K UI with confirm cards |
| `src/app/admin/layout.tsx` | NEW — mounts CommandBar across admin |
| `AGENT-SETUP.md` | NEW — setup + how to add tools |
| `ADMIN-PANEL-AUDIT.md` | NEW — full audit findings + roadmap |

## Commit 3 — Client tracker: commitments, follow-up engine, templates

```
feat(tracker): client commitments, daily follow-up engine, onboarding templates
```

| File | Status |
|---|---|
| `src/db/commitments-schema.sql` | NEW — run in Supabase (client_commitments, commitment_reminders) |
| `src/lib/commitments/types.ts` | NEW |
| `src/lib/commitments/store.ts` | NEW — CRUD + recurrence roll-forward |
| `src/lib/commitments/followup.ts` | NEW — daily nudges (WhatsApp/email) + owner digest |
| `src/lib/commitments/templates.ts` | NEW — New Company / VAT / Tender-Ready / Ops Baseline |
| `src/lib/commitments/applyTemplate.ts` | NEW |
| `src/app/api/commitments/route.ts` | NEW |
| `src/app/api/commitments/[id]/route.ts` | NEW |
| `src/app/api/commitments/templates/route.ts` | NEW |
| `src/app/api/cron/commitment-followups/route.ts` | NEW — daily 07:00 cron |
| `src/app/api/admin/run-followups/route.ts` | NEW — manual trigger |
| `src/app/admin/tracker/page.tsx` | NEW — dashboard + template picker |
| `CLIENT-TRACKER.md` | NEW — docs |

## Commit 4 — WhatsApp campaigns: CSV → questionnaire → leads

```
feat(campaigns): consent-first WhatsApp questionnaire campaigns from CSV
```

| File | Status |
|---|---|
| `src/db/campaigns-schema.sql` | NEW — run in Supabase (campaigns, campaign_contacts, campaign_optouts) |
| `src/lib/campaigns/types.ts` | NEW |
| `src/lib/campaigns/csv.ts` | NEW — dependency-free CSV parser, SA number normalisation |
| `src/lib/campaigns/store.ts` | NEW — CRUD, import, global opt-out, stats |
| `src/lib/campaigns/engine.ts` | NEW — inbound state machine + throttled drip sender |
| `src/app/api/campaigns/route.ts` | NEW |
| `src/app/api/campaigns/[id]/route.ts` | NEW |
| `src/app/api/campaigns/[id]/contacts/route.ts` | NEW — CSV import |
| `src/app/api/campaigns/[id]/drip/route.ts` | NEW — send next batch |
| `src/app/api/cron/campaign-drip/route.ts` | NEW — business-hours drip cron |
| `src/app/admin/campaigns/page.tsx` | NEW — list + builder |
| `src/app/admin/campaigns/[id]/page.tsx` | NEW — upload/launch/responses |
| `src/app/api/whatsapp/webhook/route.ts` | MODIFIED — campaign replies intercepted before AI agent |
| `WHATSAPP-CAMPAIGNS.md` | NEW — docs + POPIA notes |

## Shared (include in whichever commit lands last)

| File | Status |
|---|---|
| `src/app/admin/page.tsx` | MODIFIED — Client Tracker + WhatsApp Campaigns nav cards |
| `vercel.json` | MODIFIED — 2 new crons (commitment-followups daily 07:00, campaign-drip 15-min weekday business hours) |
| `CLAUDE.md` | MODIFIED — new architecture sections for IDE/assistant context |
| `GIT-COMMIT-PLAN.md` | NEW — this file |

---

## Pre-push checklist

1. `SESSION_SECRET` in `.env.local` (login depends on it) and in Vercel.
2. Run `src/db/commitments-schema.sql` and `src/db/campaigns-schema.sql` in Supabase.
3. `npm run build` — must pass clean.
4. Confirm `.env.local` is git-ignored: `git check-ignore .env.local` should print the path.
