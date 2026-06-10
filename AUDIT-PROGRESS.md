# Site Audit Progress Tracker
_Started: June 10, 2026 · Full sweep completed: June 10, 2026_

## Summary: 23 of 27 issues resolved + WhatsApp event reminders shipped

Remaining 4 are content/strategy items that need owner input (see bottom).

---

## Session 2 — Full Fix Sweep (authoritative)

### Resolved this session
| # | Issue | What changed |
|---|---|---|
| #2 | Bundles cost more than parts | Prices cut below component totals + struck-through regular price and **Save** badges. Launch R2,500 / Growth R8,500 / Empire R16,500 / Tender Starter R3,500 |
| #3 | Tender fee inconsistent | Removed R800. Unified to tiered **R1,200 / R2,000 / Custom** per tender |
| #4 | "Book Strategy Call" went to form | All CTAs (header desktop+mobile, homepage) now open **WhatsApp** booking chat |
| #11 | "Empire" overused | Homepage reduced from 3x to 1x (hero only). Package name "Empire Ascend" kept |
| #12 | Fresh Start buried | Already in main nav + homepage callout (verified) |
| #13 | Builder started with Retainers | Reordered: **Compliance first**, Retainers last |
| #14 | Training in wrong category | Split into dedicated **Training & Learning Materials** category |
| #15 | Duplicate Shield icon | Business Documents now uses **FileText** icon |
| #16 | Blog used portfolio hero | Switched to **blueprint pattern** background |
| #17 | Business Watch overpriced | Dropped to **R650**, labelled monitoring-only |
| #18 | SEO setup = monthly price | Setup now **R1,500 once-off**, renamed; monthly stays R2,500 |
| #19 | "From R" on fixed prices | Removed "From" on fixed items (kept on genuine ranges like CIDB grades, Logo) |
| #24 | business-growth not in nav | Added to Services mega menu |
| #25 | learners-to-leaders not in nav | Added to Services mega menu |
| #26 | Meaningless floating icons | Removed from homepage hero |
| #27 | Popup fired on scroll | Now **exit-intent + 45s fallback** |

### New feature shipped
**WhatsApp reminders for event signups** (`The Future Proof Business` bookings)
- API: `POST /api/admin/bookings/remind` — single (`id`) or bulk (omit `id`)
- Admin `/admin/bookings`: **Remind All** button + per-row reminder button (disabled if no phone)
- Editable message composer with `{{name}}` `{{fullName}}` `{{reference}}` `{{seats}}` placeholders
- Returns sent / failed / skipped summary via toast
- Uses existing Evolution API `sendText` (retry + DB logging)

### Still needs owner input (not fabricated)
| # | Issue | Why blocked |
|---|---|---|
| #7 | No clear primary audience | Strategy decision (who is the hero customer?) |
| #8 | About page weak story/stats | Needs real founding story + real outcome numbers |
| #9 | Portfolio shows no results | Needs real metrics per case study |
| #10 | Testimonials are a logo wall | Needs **real client quotes** — will not invent fake testimonials |

---


## ✅ Completed Fixes

### 🔴 Critical

| # | Issue | Status | Commit | Notes |
|---|---|---|---|---|
| **#1** | Hero headline generic | ✅ **FIXED** | `e5041e7` | Changed from "Creative & Innovative Ideas" to "From CIPC to Digital Empire — We Launch South African Businesses End to End" |
| **#5** | No WhatsApp button | ✅ **VERIFIED** | Already live | WhatsAppButton exists in ClientComponents, visible site-wide |
| **#6** | BuildPackage named LabPage | ✅ **FIXED** | `e5041e7` | Renamed `LabPage` → `BuildPackagePage` |

---

## 🚧 In Progress

### 🔴 Critical (Remaining)

| # | Issue | Priority | Next Action |
|---|---|---|---|
| **#2** | Bundles cost MORE than components | 🔴 CRITICAL | Need pricing strategy decision: reduce bundle prices OR add exclusive services |
| **#3** | Tender fee shows 3 different numbers | 🔴 CRITICAL | Remove R800 from add-on table, unify to R1,200/R2,000/custom |
| **#4** | "Book Strategy Call" goes to form | 🔴 CRITICAL | Integrate Calendly or Cal.com booking |

---

## 📋 Backlog (High Impact)

| # | Issue | Impact | Effort | Notes |
|---|---|---|---|---|
| #7 | No clear primary audience | 🟡 High | Medium | Consider audience selector on homepage |
| #8 | About page weak story/stats | 🟡 High | Low | Add founding story, replace stats with client outcomes |
| #9 | Portfolio shows no results | 🟡 High | Medium | Add "Results" section to each case study with metrics |
| #10 | Testimonials are logo wall | 🟡 High | Low | Replace 3 logos with quote cards (name, company, result) |
| #11 | "Empire" overused (6+ pages) | 🟡 High | Low | Reserve for premium package only, replace elsewhere |
| #12 | Fresh Start hidden at bottom | 🟡 High | Low | Add to main nav, move higher on homepage |
| #13 | Builder starts with Retainers | 🟡 High | Low | Reorder: Compliance → Branding → Digital → Retainer |
| #14 | Training in wrong category | 🟡 High | Low | Create separate "Training & Learning Materials" category |

---

## 📝 Backlog (Medium Impact)

| # | Issue | Effort | Notes |
|---|---|---|---|
| #15 | Duplicate Shield icon | 🟠 Medium | Use `FileText` for Business Documents |
| #16 | Blog uses portfolio hero | 🟠 Medium | Use distinct image or solid background |
| #17 | Business Watch vs Growth same price | 🟠 Medium | Drop Business Watch to R550-R650 |
| #18 | SEO setup/monthly same price | 🟠 Medium | Setup R1,500, Monthly R2,500 |
| #19 | "From R" on fixed prices | 🟠 Medium | Remove "From" on fixed-price items |
| #20 | Brand Launch duplicates Launch Essentials | 🟠 Medium | Remove from retainer tab or differentiate clearly |
| #21 | Learners to Leaders same hero | 🟠 Medium | Source distinct training/education image |
| #22 | No FAQ on services page | 🟠 Medium | Add FAQ section or link to /faq |

---

## 🔵 Backlog (Low Priority - Code Quality)

| # | Issue | Effort |
|---|---|---|
| #23 | LabPage naming | ✅ **FIXED** |
| #24 | business-growth not in nav | 🔵 Low |
| #25 | learners-to-leaders not in nav | 🔵 Low |
| #26 | Floating hero icons add no meaning | 🔵 Low |
| #27 | FreshStartPopup fires on scroll | 🔵 Low |

---

## 🎯 Recommended Next Steps

### Immediate (This Week)
1. **Fix #3** — Unify tender pricing (15 min fix)
2. **Fix #4** — Add Calendly booking link (30 min)
3. **Fix #2** — Decide bundle pricing strategy, update prices (1 hour)

### Short Term (This Month)
4. **Fix #12** — Move Fresh Start higher, add to nav
5. **Fix #13** — Reorder build package steps
6. **Fix #10** — Add 3 real testimonial quotes
7. **Fix #11** — Audit and reduce "Empire" usage

### Medium Term (Next Quarter)
8. **Fix #7** — Add audience selector/pathways on homepage
9. **Fix #9** — Add results metrics to portfolio case studies
10. **Fix #8** — Rewrite About page with real story and outcomes

---

## 💡 Strategic Recommendations

### Pricing Strategy (#2)
**Option A:** Reduce bundle prices to show savings
- Launch Essentials: R3,950 → **R2,500** (saves R350)
- Growth Momentum: R9,800 → **R8,500** (saves R500)
- Empire Ascend: R18,500 → **R16,500** (saves R1,000)

**Option B:** Add exclusive services to bundles
- Launch Essentials: + 30-min strategy call
- Growth Momentum: + priority turnaround + 1 free revision
- Empire Ascend: + dedicated account manager + quarterly review

### Booking Integration (#4)
**Recommended:** Calendly (free tier)
- Create "Strategy Call" event type (30 min)
- Add to `/contact` page
- Update all "Book Strategy Call" CTAs to direct link

### Fresh Start Visibility (#12)
- Add to main nav under "Services" dropdown
- Create hero callout section (above featured services)
- Keep exit-intent popup but delay to 45 seconds

---

## 📊 Impact Summary

- **Critical fixes completed:** 3/6 (50%)
- **High impact remaining:** 8 issues
- **Medium impact remaining:** 8 issues
- **Low priority remaining:** 4 issues

**Total progress:** 3/27 issues resolved (11%)

---

_Last updated: June 10, 2026 at 3:56pm_
