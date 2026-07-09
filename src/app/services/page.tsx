import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import {
  Code2, ShieldCheck, FileSearch,
  CheckCircle2, ArrowRight, ChevronRight,
} from 'lucide-react';

const CONTACT_HREF = '/contact?subject=Scope%20a%20project';

export const metadata: Metadata = {
  title: 'Build Services | Web Applications, Accreditation & Tender Strategy | Breed Industries',
  description: 'Breed Industries builds three categories of operational infrastructure: custom web applications, full accreditation & compliance, and AI-powered tender strategy. Scoped per project - not packaged.',
  keywords: ['web applications South Africa', 'business compliance South Africa', 'CIPC SARS CIDB', 'tender strategy', 'B-BBEE certification', 'custom platforms Durban'],
  alternates: { canonical: 'https://thebreed.co.za/services' },
  openGraph: {
    title: 'Build Services - Breed Industries',
    description: 'Custom web applications, accreditation & compliance, and tender strategy. The infrastructure serious businesses run on.',
    url: 'https://thebreed.co.za/services',
  },
};

const pillars = [
  {
    id: 'web-applications',
    title: 'Web Applications',
    icon: <Code2 className="w-8 h-8 text-accent" />,
    tagline: 'Operational systems. Not brochure sites.',
    description: 'We build the platforms a serious business actually runs on - internal admin systems, customer-facing products, e-commerce, AI agents, and WhatsApp automations.',
    deliverables: [
      'Custom platforms & admin dashboards',
      'E-commerce with multiple SA payment gateways',
      'AI agents, chatbots & WhatsApp automation',
      'Member portals, booking and CRM systems',
      'Integrations with Xero, Sage, Supabase, Stripe, Paystack',
      'Hosted, monitored and maintained by us',
    ],
    process: [
      'Scoping workshop - we map the system end-to-end before quoting',
      'Fixed-scope quote with banking details and 50% deposit terms',
      'Sprint-based build with weekly demos',
      'Handover, training, and a 30-day defect period',
    ],
    examples: [
      { name: 'Engage Africa IO', tag: 'AI customer engagement platform', href: '/portfolio#engage-africa' },
      { name: 'MLK Apparel Store', tag: 'Faith-driven e-commerce', href: '/portfolio#mlk-apparel' },
      { name: 'HOGI Church App', tag: 'Member & event platform', href: '/portfolio#hogi-church' },
    ],
  },
  {
    id: 'accreditation',
    title: 'Accreditation & Compliance',
    icon: <ShieldCheck className="w-8 h-8 text-accent" />,
    tagline: 'The full compliance stack - end to end.',
    description: 'We remove every barrier between you and the contracts, grants and funding you should be qualifying for. No piecemeal certificates. The whole stack, properly aligned, kept current.',
    deliverables: [
      'CIPC company registration, amendments & annual returns',
      'SARS tax registration, tax clearance & filing support',
      'B-BBEE affidavit & certification (Levels 1–8)',
      'CSD profile registration & maintenance',
      'CIDB grading - Grade 1 through Grade 9',
      'COIDA registration and Letter of Good Standing',
      'Tender-ready documentation pack',
    ],
    process: [
      'Compliance audit - we map what you have, what you\'re missing, and what you actually qualify for',
      'Document collection checklist via member portal',
      'Filings submitted, tracked, and confirmed in writing',
      'Renewal calendar maintained for you (Network members)',
    ],
    examples: null,
  },
  {
    id: 'tender-strategy',
    title: 'Tender Strategy',
    icon: <FileSearch className="w-8 h-8 text-accent" />,
    tagline: 'AI-matched. Bid-ready. Fully managed if needed.',
    description: 'Our tender intelligence engine scrapes 26+ South African government sources twice a day and scores each opportunity against your CIDB grade, BEE level, commodity codes, and operating province. Then we help you actually win.',
    deliverables: [
      'Daily monitoring across 26+ portals (national, SOE, provincial)',
      'AI matching against your business profile',
      'Email alerts for high-score matches, weekly digest',
      'Bid preparation: pricing schedule, returnable docs, technical responses',
      'Submission management, site meeting attendance, queries handled',
      'Post-award contract & relationship support',
    ],
    process: [
      'Profile setup - we capture grade, province, categories, commodity codes',
      'Engine starts matching within 24 hours',
      'Bid-by-bid scope: alerts-only, bid-prep, or fully-managed',
      'Win-rate review every 90 days',
    ],
    examples: null,
    cta: { label: 'See the Tender Services page', href: '/tender-services' },
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />

      <PageHero
        title="What we build"
        subtitle="Build Services"
        description="Three categories of operational infrastructure. Scoped per project - not packaged. Quoted only after we understand what you actually need."
        breadcrumbs={[{ label: 'Services', href: '/services' }]}
        backgroundImage="/assets/images/about-hero.jpg"
        align="left"
      >
        <Link href={CONTACT_HREF} className="btn btn-primary">
          Scope a Project
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
                    0{idx + 1} · Build Pillar
                  </p>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
                    {pillar.title}
                  </h2>
                  <p className="text-accent font-medium mb-5">{pillar.tagline}</p>
                  <p className="text-white/70 leading-relaxed mb-8">{pillar.description}</p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={CONTACT_HREF} className="btn btn-primary">
                      Scope your project
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
                    <h3 className="text-sm uppercase tracking-widest text-accent font-bold mb-4">What's included</h3>
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

      {/* Network reminder */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card-accent p-8 md:p-12 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
              Network members get preferential rates on every Build Service.
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-6">
              If you're going to invest in infrastructure, do it inside the ecosystem that supports you afterwards.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/network" className="btn btn-primary">
                Join the Network
                <ChevronRight size={16} className="ml-1" />
              </Link>
              <Link href={CONTACT_HREF} className="btn btn-outline">
                Scope a Project
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
