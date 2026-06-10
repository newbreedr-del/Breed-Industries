# Breed Industries — Full Site Audit
_Last updated: June 2026_

This document is a living record of every issue found across the site — strategic, structural, copy, UX, and code. Issues are ranked by impact. Add notes as fixes are made.

---

## 🔴 CRITICAL — Fix these first. They cost you clients.

---

### 1. The hero headline is generic and could belong to any agency on earth

**Page:** `/` (Home)

**Current:** _"Creative & Innovative Ideas for Your Business"_

This says nothing. A visitor from a Google search can't tell what you do, who you serve, or why you're different from a Joburg design agency or a Cape Town startup studio. The subheading does more work ("From registration to unstoppable branding & tech") but it's buried below a weak H1.

**Fix:** Rewrite the H1 around your actual differentiator — you handle the full arc from compliance to digital for South African entrepreneurs, under one roof, fast. Something like:
> _"From CIPC to Digital Empire — We Launch South African Businesses End to End"_

Or anchor it to the pain: registration confusion, failed tender bids, unbranded businesses.

---

### 2. All four quick bundles cost MORE than their individual components

**Page:** `/build-package` and `/services`

Every bundle is priced higher than the sum of its parts. Clients who price-check will feel deceived.

| Bundle | Parts add up to | Bundle price | Client pays extra |
|---|---|---|---|
| Launch Essentials | R2,850 | R3,950 | +R1,100 |
| Growth Momentum | R9,000 | R9,800 | +R800 |
| Empire Ascend | R17,500 | R18,500 | +R1,000 |
| Tender Starter Pack | R3,850 | R4,450 | +R600 |

**Fix:** Either reduce bundle prices so there's a visible saving (e.g. Launch Essentials at R2,500 saves R350), or add a service to each bundle that isn't sold individually (e.g. a strategy call, a free revision, priority turnaround) to justify the premium.

---

### 3. Tender per-application fee is three different numbers across the site

**Pages:** `/tender-services`, `/build-package`

- Add-on price table on `/tender-services` shows: **R800**
- Body text on `/tender-services` says: **R1,200** (under R500k)
- Description on `/build-package` (Tender Apply) says: **R1,200** (under R500k)

A prospect comparing packages will notice the R800 figure doesn't match anywhere else. It looks like an error, which undermines trust in your pricing across the board.

**Fix:** Remove the R800 figure. Unify all references to the tiered structure: R1,200 / R2,000 / custom.

---

### 4. "Book a Strategy Call" goes nowhere

**Pages:** Every page has this CTA

Every CTA button on the site says "Book Strategy Call" or "Book a Strategy Call" — but clicking it goes to `/contact`, which is a generic contact form. There is no calendar booking, no time slot selection, no confirmation, no expectation setting.

A prospect ready to pay R9,500 for an AI platform expects to book a real meeting, not fill in a form and hope someone calls back.

**Fix:** Integrate Calendly (free tier works), Cal.com, or even a simple WhatsApp booking link. Add it to the contact page AND as a direct link in the CTAs. The current setup loses warm leads.

---

### 5. No WhatsApp CTA anywhere on the site — despite having a live AI agent

**Pages:** All

You built and deployed a WhatsApp AI agent. Not a single page has a "Chat on WhatsApp" button. This is a free, high-conversion channel sitting idle.

**Fix:** Add a floating WhatsApp button (bottom-right) across the entire site linking to `https://wa.me/27604964105`. This alone could double your lead capture.

---

### 6. The Build Package page component is still named `LabPage` in the code

**File:** `src/app/build-package/page.tsx`

```ts
export default function LabPage() {
```

This is a leftover from when the feature was in a lab/experimental state. It has no user-facing impact but makes the codebase confusing and signals the page was never fully productionised.

**Fix:** Rename to `BuildPackagePage`.

---

## 🟡 HIGH IMPACT — These directly affect how clients perceive and trust you.

---

### 7. No clear primary audience — the site tries to speak to everyone simultaneously

**Pages:** All

Right now the site addresses at least four very different audiences:
1. **New startups** who need registration and compliance (CIPC, SARS, BEE)
2. **Established SMEs** who need branding, websites, digital marketing
3. **Contractors** who need CIDB grading and want to win government tenders
4. **Enterprises** who want to buy a white-label AI platform for R9,500+

These buyers have completely different pain points, budgets, and vocabulary. A first-year entrepreneur researching CIPC registration and a procurement officer evaluating AI platforms should not be reading the same homepage.

**Fix:** The homepage needs a simple audience selector or clear pathways in the hero: "I want to ___ [register my business / build my brand / win tenders / build a platform]" that routes each person to the relevant journey. The current "From Idea to Empire" narrative is inspiring but it doesn't help anyone self-qualify.

---

### 8. The About page has no real story and the stats are thin

**Page:** `/about`

**Issues:**
- "Founded in Durban with one mission..." is a template sentence every agency uses. No founding date, no reason _why_ it was started, no specific gap in the market it fills.
- "Our lobby's blueprint aesthetic is more than a design cue" — this is vague and tries too hard.
- Stats: **45 businesses launched**, **3–14 day timeline**, **DBN · JHB** — these are weak social proof numbers. 45 is not a lot. No revenue generated for clients, no tenders won, no uptime stats.
- Values ("Credibility First", "Velocity & Clarity", "Design-Led Innovation") are things every agency claims. Nothing specific to Breed.

**Fix:**
- Add the actual founding year and a real reason it was started (the founder's specific experience or frustration)
- Replace stats with outcomes: "R__M in tenders won for clients", "__ successful CIDB upgrades", "__ government suppliers registered"
- Rewrite values around specific, verifiable commitments rather than aspirational labels

---

### 9. Portfolio shows no results — only aesthetics

**Page:** `/portfolio`

Three case studies are shown (Engage Africa IO, MLK Apparel, HOGI Church App) but none include:
- Client outcome (traffic, sales, users, revenue)
- Timeline (how long did it take?)
- Client quote or testimonial
- Before/after context

It reads as a design portfolio, not a business results portfolio. A client deciding to spend R18,500 on an AI platform needs to see ROI evidence, not just screenshots.

**Fix:** Add a "Results" section to each case study with 2–3 specific numbers. Even "Launched in 3 weeks" or "500 members onboarded in month one" is powerful. Request a short quote from each client.

---

### 10. Testimonials section is a logo wall with no actual testimonials

**Page:** `/` (Home — "Trusted By" section)

Nine client logos are shown but there are no quotes, no names, no outcomes. Anyone can put logos on a website. Actual testimonials with a name and a result are 10x more persuasive.

**Fix:** Replace at least 3 of the logo slots with a quote card: name, company, what service they got, what result they achieved. Keep the logos smaller and secondary.

---

### 11. "Empire" language is used on 6+ pages and has lost all meaning

**Pages:** Home, Services, Build Package, About, Tender Services, more

- "Build Your Empire"
- "Empire Ascend" (package name)
- "From Idea to Empire"
- "The Empire Behind the Blueprint"
- "Ready to Build Your Empire?"
- "Empire-Class" references in copy

The repetition makes it feel like a brand cliché rather than a genuine aspiration. It also risks sounding grandiose to a small business owner who just wants to register their company.

**Fix:** Reserve "Empire" for one signature moment — ideally the premium package tier name and one homepage headline. Retire it everywhere else and replace with more specific, outcome-driven language.

---

### 12. The Fresh Start offer is hidden at the bottom and framed weakly

**Page:** `/` (Home — bottom callout), `/fresh-start`

Fresh Start (pay R1,000, we research and apply for funding, fee is credited back when you use a package) is actually a **brilliant and unique offer**. Almost no agency in SA does this. But:
- It appears at the very bottom of the home page in a small callout
- It also appears as a slide-in popup, which is intrusive and easy to dismiss
- The fresh-start page itself buries the offer behind a lot of explanatory text
- It's not in the main nav

A client who can't afford your services upfront but qualifies for SEDFA or NYDA funding is a **high-value long-term client**. They need to find Fresh Start immediately, not scroll to the footer.

**Fix:** Add Fresh Start to the main nav. Move it higher on the homepage — it should sit just below the hero or in the services grid. The popup is fine but should trigger at exit-intent or after 30 seconds, not on scroll.

---

### 13. The retainer section appears first in the Build Package builder — wrong order

**Page:** `/build-package`

The first step a visitor sees is "Retainer Packages." But a first-time visitor doesn't know what a retainer is or whether they need one. The natural journey for a new business owner is:

1. Register company (Compliance)
2. Build brand (Branding)
3. Get online (Digital)
4. Grow (Retainer / ongoing)

Leading with retainers is like showing a dessert menu before the starter.

**Fix:** Move the Retainer step to last. Start with Compliance as step 1 — it's the most logical entry point for the target audience.

---

### 14. Training materials are buried inside "Business Documents" — wrong category, wrong buyer

**Page:** `/services`, `/build-package`

Training Workbooks, Facilitator Guides, and PowerPoint Presentations are listed under "Business Documents & Training." But their buyers are completely different:
- Business profiles/plans → entrepreneurs, tender applicants
- Training materials → HR departments, training providers, ETQAs, SETA-registered companies

A training provider looking to commission a workbook will never think to look under "Business Documents."

**Fix:** Give training materials their own service category: "Training & Learning Materials." Separate SEO keyword targeting. Consider a dedicated landing page.

---

## 🟠 MEDIUM — These reduce quality and consistency but aren't urgent.

---

### 15. Services page uses the Shield icon for two different categories

**File:** `src/app/services/page.tsx`

"Business Setup & Compliance" and "Business Documents & Training" both use `<Shield className="w-8 h-8" />`. Visual inconsistency signals carelessness.

**Fix:** Give Business Documents the `FileText` icon (already used in other parts of the site for documents).

---

### 16. Blog hero uses the portfolio hero image

**File:** `src/app/blog/page.tsx`

```ts
backgroundImage="/assets/images/portfolio-hero.png"
```

The blog page is using the portfolio page's hero image. Clients who visit both pages will notice.

**Fix:** Either use a distinct image for the blog hero, or use a solid dark background with the grid-overlay pattern.

---

### 17. Business Watch and Business Growth Essentials are both R950/month with overlapping scope

**Page:** `/build-package` (Retainer step), `/business-growth`

- **Business Watch** (R950/month): funding & accreditation monitoring
- **Business Growth Essentials** (R950/month): compliance monitoring + social media content + monthly strategy check-in

Both cost the same. Business Watch is described as monitoring-only but Business Growth Essentials also includes "compliance monitoring." A client can't tell why they'd choose one over the other.

**Fix:** Drop Business Watch to R550–R650/month and position it clearly as "monitoring only, no implementation." Business Growth Essentials at R950 then makes sense as the active-service tier.

---

### 18. SEO setup (one-time) and SEO monthly are the same price

**Page:** `/build-package` (Digital step)

Both "SEO & Digital Marketing (Setup)" and "SEO & Digital Marketing (Monthly)" are listed at **R2,500**. Clients will assume the setup is either included in the monthly price, or feel there's no distinction.

**Fix:** Price setup at R1,500 (or fold it into the first month) and monthly at R2,500. Or rename and clarify: "SEO Audit & Setup (once-off)" vs "Monthly SEO & Content Management."

---

### 19. "From R" label on fixed-price services creates false impression of negotiability

**Page:** `/services`

Items like CSD Registration (R450), App Store Submission (R2,500), and Business Cards (R800) are labeled "From R450", "From R800" etc. These are fixed prices, not starting prices. Clients will arrive expecting to negotiate downward.

**Fix:** Remove "From" on any service that has a fixed price. Only use "From" where a range genuinely exists (e.g. CIDB Grade 2–4 which spans R2,000–R4,500).

---

### 20. The Brand Launch Package (retainer) and Launch Essentials (bundle) serve the same need at similar prices

**Page:** `/build-package`

- **Brand Launch Package** (retainer tab): R4,500 — Registration + Logo + Business Profile + Business Cards
- **Launch Essentials** (quick bundle): R3,950 — Registration + Logo + Business Cards (no profile)

These are nearly identical and shown on the same page. A client choosing between them will be confused. The retainer version includes more (business profile) but costs more — but it's presented alongside monthly retainers as if it has an ongoing commitment.

**Fix:** Remove Brand Launch Package from the retainer tab and fold it into the quick bundles section as a distinct tier. Or clearly differentiate: one is "launch + ongoing support", one is "launch only."

---

### 21. The Learners to Leaders page uses the same lobby hero image as the homepage

**Files:** `src/app/page.tsx`, `src/app/learners-to-leaders/page.tsx`

Both use `/assets/images/hero/lobby.jpg`. When a client visits both pages, the visual repetition makes the site feel like it was built on a template.

**Fix:** Source or commission a distinct hero image for the Learners to Leaders page — a training/education context image would better set expectations for that audience.

---

### 22. No FAQ on the main Services page

**Page:** `/services`

The Tender Services page and Fresh Start page both have detailed FAQs. The main services page — which covers compliance, branding, and digital — has none. These are higher-consideration purchases where clients have lots of questions (What documents do I need? How long does it take? Do I need CIPC before BEE?).

**Fix:** Add a FAQ section to the services page, or link to a dedicated FAQ page (`/faq` already exists but may not cover services in depth).

---

## 🔵 LOW — Code quality, naming, and minor consistency.

---

### 23. `build-package/page.tsx` exports as `LabPage` not `BuildPackagePage`

Already covered in Critical #6 but worth repeating as a code hygiene issue. All page components should be named after their route.

---

### 24. `business-growth` page exists but is not in the main nav

**File:** `src/app/business-growth/page.tsx`

There's a dedicated `/business-growth` page with its own content and packages, but it isn't linked from the main navigation. Clients can only reach it if they know the URL or find it via SEO.

**Fix:** Add it under a "Services" dropdown item or at minimum link to it from the retainers section of the build-package page.

---

### 25. `learners-to-leaders` page exists but has no nav entry or home page mention

**File:** `src/app/learners-to-leaders/page.tsx`

Same problem as above. This is an entire service offering that is invisible unless you know the URL.

**Fix:** Decide if this is a core service (add it to nav and services page) or a niche product (give it its own targeted campaign/landing page with a unique entry point).

---

### 26. Floating animation icons on the homepage (Shield, Rocket, Zap) add no meaning

**Page:** `/` (Home — Hero section)

Three large floating icons (Shield at 60px, Rocket at 80px, Zap at 70px) animate up-and-down in the hero background. They are set to 20% opacity and don't correspond to anything in the headline text or CTAs.

**Fix:** Either tie them to the service categories they represent (with labels on hover), or remove them and let the background image breathe. Motion for motion's sake adds noise.

---

### 27. `FreshStartPopup` fires on scroll — should be exit-intent

**Component:** `src/components/ui/FreshStartPopup.tsx`

A slide-in popup appearing while the user is still exploring the homepage is disruptive. Exit-intent popups (trigger when mouse moves toward browser close button) convert better and feel less aggressive.

**Fix:** Change the trigger to exit-intent or a 45-second time delay.

---

## 📋 TRACKING

| # | Issue | Priority | Status | Fixed by |
|---|---|---|---|---|
| 1 | Hero headline generic | 🔴 Critical | Open | |
| 2 | Bundles cost more than components | 🔴 Critical | Open | |
| 3 | Tender fee 3 different numbers | 🔴 Critical | Open | |
| 4 | Strategy call CTA goes to plain form | 🔴 Critical | Open | |
| 5 | No WhatsApp button on site | 🔴 Critical | Open | |
| 6 | BuildPackage component named LabPage | 🔴 Critical | Open | |
| 7 | No clear primary audience | 🟡 High | Open | |
| 8 | About page — no real story, weak stats | 🟡 High | Open | |
| 9 | Portfolio — no client outcomes | 🟡 High | Open | |
| 10 | Testimonials — logo wall, no quotes | 🟡 High | Open | |
| 11 | "Empire" overused across site | 🟡 High | Open | |
| 12 | Fresh Start hidden at bottom | 🟡 High | Open | |
| 13 | Builder starts with Retainers, not Compliance | 🟡 High | Open | |
| 14 | Training materials in wrong category | 🟡 High | Open | |
| 15 | Services page — duplicate Shield icon | 🟠 Medium | Open | |
| 16 | Blog uses portfolio hero image | 🟠 Medium | Open | |
| 17 | Business Watch vs Growth Essentials — same price | 🟠 Medium | Open | |
| 18 | SEO setup and monthly — same price | 🟠 Medium | Open | |
| 19 | "From R" on fixed-price services | 🟠 Medium | Open | |
| 20 | Brand Launch Package duplicates Launch Essentials | 🟠 Medium | Open | |
| 21 | Learners to Leaders uses same hero as homepage | 🟠 Medium | Open | |
| 22 | No FAQ on main services page | 🟠 Medium | Open | |
| 23 | LabPage naming | 🔵 Low | Open | |
| 24 | business-growth page not in nav | 🔵 Low | Open | |
| 25 | learners-to-leaders page not in nav | 🔵 Low | Open | |
| 26 | Floating hero icons add no meaning | 🔵 Low | Open | |
| 27 | FreshStartPopup fires on scroll, not exit-intent | 🔵 Low | Open | |
