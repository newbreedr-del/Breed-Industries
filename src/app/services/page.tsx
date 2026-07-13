import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import {
  Wrench, Search, TrendingUp,
  CheckCircle2, ArrowRight, ChevronRight,
} from 'lucide-react';

const CONTACT_HREF = '/contact?subject=Scope%20a%20project';

export const metadata: Metadata = {
  title: 'Services | Systems, Funding Navigation & Ventures | Breed Industries',
  description: 'Breed Industries diagnoses what limits your business and builds the fix — technical systems, compliance, training frameworks. We navigate funding that already exists. And for the right businesses, we invest.',
  keywords: ['business systems South Africa', 'SEDA funding navigation', 'NYDA grants South Africa', 'NEF IDC funding', 'B-BBEE enterprise development', 'web applications Durban', 'compliance CIPC SARS', 'equity partnership South Africa', 'Breed Ventures'],
  alternates: { canonical: 'https://thebreed.co.za/services' },
  openGraph: {
    title: 'Services - Breed Industries',
    description: 'Diagnose. Build. Access. Invest. Three pillars for serious South African businesses.',
    url: 'https://thebreed.co.za/services',
  },
};

const pillars = [
  {
    id: 'systems',
    title: 'Business Systems',
    icon: <Wrench className="w-8 h-8 text-accent" />,
    tagline: 'We find what\'s limiting you. Then we build the fix.',
    description: 'We go into your business, map the constraint — whether it\'s technical, operational, compliance-related, or structural — and build the system to fix it. Not a package. Not a template. The actual thing.',
    deliverables: [
      'Business diagnosis workshop — map the constraint before quoting',
      'Custom web applications & admin platforms',
      'E-commerce with SA payment gateways (Stripe, Paystack)',
      'AI agents, chatbots & WhatsApp automation',
      'Accreditation & compliance stack (CIPC, SARS, B-BBEE, CSD, CIDB)',
      'Operational programmes and training frameworks',
      'Partner-delivered solutions (ISO, safety management, HR systems)',
    ],
    process: [
      'Diagnosis session — we map what\'s limiting growth before quoting',
      'Fixed-scope proposal — clear deliverables, no hidden extras',
      'Build or implementation — sprint-based with weekly check-ins',
      'Handover, training, and ongoing support',
    ],
    examples: [
      { name: 'Engage Africa IO', tag: 'AI customer engagement platform', href: '/portfolio#engage-africa' },
      { name: 'MLK Apparel Store', tag: 'Faith-driven e-commerce', href: '/portfolio#mlk-apparel' },
      { name: 'HOGI Church App', tag: 'Member & event platform', href: '/portfolio#hogi-church' },
    ],
  },
  {
    id: 'funding-navigation',
    title: 'Funding & Programme Navigation',
    icon: <Search className="w-8 h-8 text-accent" />,
    tagline: 'The money exists. We help you find it and qualify for it.',
    description: 'Most businesses don\'t know what government and private funding is available to them — or they don\'t qualify yet because of compliance gaps. We map the landscape, close the gaps, and navigate the application process alongside you. We\'re the navigator. Not the bank.',
    deliverables: [
      'Funding landscape assessment — what you qualify for right now',
      'SEDA — enterprise development grants & business support',
      'NYDA — youth business funding and incubation programmes',
      'NEF — black business equity financing',
      'IDC — industrial development and sector funding',
      'SETA grants — skills development funding for employers',
      'B-BBEE enterprise & supplier development funds',
      'Application preparation and submission support',
    ],
    process: [
      'Eligibility assessment — what you qualify for now vs. post-compliance',
      'Compliance alignment — CIPC, SARS, B-BBEE, CSD closed where needed',
      'Application preparation — business plans, financials, motivation letters',
      'Submission management and follow-up',
    ],
    examples: null,
  },
  {
    id: 'ventures',
    title: 'Breed Ventures',
    icon: <TrendingUp className="w-8 h-8 text-accent" />,
    tagline: 'For the right businesses, we don\'t just build. We invest.',
    description: 'When we see a business with real potential and the right operator behind it, we take an equity stake and grow alongside you. For the right ideas, we build from scratch under the Breed umbrella. Minimum 10% equity. Assessed by Directors and Partners. Deal structures include sweat equity, revenue share, and convertible agreements.',
    deliverables: [
      'Investment Assessment Scorecard — structured evaluation by Directors & Partners',
      'Term Sheet — non-binding equity proposal',
      'Equity Partnership Agreement — formal binding deal',
      'R950/month management retainer (compliance, admin, processing)',
      'Two investment tracks: client equity partnership or Breed-built portfolio company',
      'Ongoing operational support and network access',
      'Access to Breed partner ecosystem (lobbying, ISO, safety, training)',
    ],
    process: [
      'Expression of interest — brief conversation to understand the business',
      'Scorecard evaluation — Directors & Partners assess 6 weighted criteria',
      'Term Sheet presentation — if score qualifies (minimum 50%)',
      'Due diligence and Equity Partnership Agreement signing',
    ],
    examples: null,
    cta: { label: 'Talk to us about a partnership', href: CONTACT_HREF },
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />

      <PageHero
        title="How we work"
        subtitle="Our Services"
        description="Diagnose what's limiting your business. Build the systems to fix it. Find the funding that already exists. And for the right businesses — invest."
        breadcrumbs={[{ label: 'Services', href: '/services' }]}
        backgroundImage="/assets/images/about-hero.jpg"
        align="left"
      >
        <Link href={CONTACT_HREF} className="btn btn-primary">
          Work With Us
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </PageHero>

      {/* Anchor nav */}
      <section className="py-6 bg-color-bg-secondary border-y border-white/5 sticky top-[72px] z-30 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {pillars.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="px-4 py-2 rounded-full border border-white/10 text-white/70 hover:text-accent hover:border-accent/40 transition-colors"
              >
                {p.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      {pillars.map((pillar, idx) => (
        <section
          key={pillar.id}
          id={pillar.id}
          className={`py-20 relative scroll-mt-32 ${idx % 2 === 0 ? '' : 'bg-color-bg-secondary'}`}
        >
          <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">
                {/* Left: intro */}
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-6">
                    {pillar.icon}
                  </div>
                  <p className="text-accent text-xs uppercase tracking-widest font-bold mb-2">
                    0{idx + 1} · {idx === 0 ? 'Diagnose & Build' : idx === 1 ? 'Access' : 'Invest'}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
                    {pillar.title}
                  </h2>
                  <p className="text-accent font-medium mb-5">{pillar.tagline}</p>
                  <p className="text-white/70 leading-relaxed mb-8">{pillar.description}</p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={CONTACT_HREF} className="btn btn-primary">
                      Work With Us
                      <ArrowRight size={14} className="ml-2" />
                    </Link>
                    {pillar.cta && (
                      <Link href={pillar.cta.href} className="btn btn-outline">
                        {pillar.cta.label}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right: deliverables + process */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="glass-card p-6">
                    <h3 className="text-sm uppercase tracking-widest text-accent font-bold mb-4">What&apos;s included</h3>
                    <ul className="space-y-2.5">
                      {pillar.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-white/75">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="text-sm uppercase tracking-widest text-accent font-bold mb-4">How we work</h3>
                    <ol className="space-y-3">
                      {pillar.process.map((step, i) => (
                        <li key={step} className="flex gap-3 text-sm text-white/75">
                          <span className="text-accent font-heading font-bold flex-shrink-0">0{i + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {pillar.examples && (
                    <div className="glass-card p-6 md:col-span-2">
                      <h3 className="text-sm uppercase tracking-widest text-accent font-bold mb-4">Recent builds</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {pillar.examples.map((ex) => (
                          <Link
                            key={ex.name}
                            href={ex.href}
                            className="block p-3 rounded-lg border border-white/10 hover:border-accent/40 transition-colors"
                          >
                            <p className="text-white font-medium text-sm">{ex.name}</p>
                            <p className="text-white/50 text-xs mt-1">{ex.tag}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Final CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card-accent p-8 md:p-12 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
              Not sure where to start?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-6">
              Most engagements begin with a conversation. Tell us where the business is and what it&apos;s running into —
              we&apos;ll tell you what we can actually do about it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={CONTACT_HREF} className="btn btn-primary">
                Start the Conversation
                <ChevronRight size={16} className="ml-1" />
              </Link>
              <Link href="/portfolio" className="btn btn-outline">
                See Our Work
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
