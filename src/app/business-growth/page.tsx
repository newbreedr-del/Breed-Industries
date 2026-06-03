import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import {
  TrendingUp, Check, ChevronRight, ArrowRight, CheckCircle,
  Shield, BarChart3, Megaphone, Users, Target, Lightbulb,
  Rocket, Award, Eye, Calendar, MessageSquare, Star
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Business Growth Services | Monthly Retainer | Breed Industries',
  description:
    'Keep your business compliant, visible, and growing with Breed Industries monthly retainer packages. From R950/month — compliance monitoring, social media, strategy, and funding alerts.',
  keywords: [
    'business growth South Africa', 'monthly business retainer', 'compliance monitoring',
    'social media management Durban', 'BEE compliance', 'business strategy KZN',
    'CIPC compliance', 'business development South Africa', 'SMME support',
  ],
  alternates: { canonical: 'https://thebreed.co.za/business-growth' },
  openGraph: {
    title: 'Business Growth Services - Breed Industries',
    description: 'Compliance, social media, strategy and funding monitoring — all in one monthly retainer from R950.',
    url: 'https://thebreed.co.za/business-growth',
  },
};

const packages = [
  {
    id: 'business-watch',
    name: 'Business Watch',
    tagline: 'Never miss a deadline or opportunity',
    price: 'R950',
    billing: '/month',
    color: 'border-accent/40',
    accent: true,
    badge: 'Most Popular',
    features: [
      'Monthly compliance deadline monitoring (CIPC, SARS, BEE)',
      'Funding & grant opportunity alerts',
      'Accreditation renewal reminders',
      'Business health check-in report',
      'WhatsApp alert notifications',
      'Cancel anytime — no lock-in',
    ],
    cta: 'Start Watching',
    ctaHref: '/subscribe/business-growth',
  },
  {
    id: 'business-growth-essentials',
    name: 'Business Growth Essentials',
    tagline: 'Your outsourced growth department',
    price: 'R950',
    billing: '/month',
    color: 'border-white/15',
    accent: false,
    features: [
      'Everything in Business Watch',
      'Monthly social media content (4 posts)',
      'Monthly strategy check-in call',
      'Brand consistency monitoring',
      'Growth roadmap document (quarterly)',
      'Priority WhatsApp support',
    ],
    cta: 'Start Growing',
    ctaHref: '/subscribe/business-growth',
  },
  {
    id: 'tender-growth-package',
    name: 'Tender Growth Bundle',
    tagline: 'Growth support + government contract opportunities',
    price: 'R1,950',
    billing: '/month',
    color: 'border-blue-500/30',
    accent: false,
    badge: 'Best Value',
    features: [
      'Everything in Business Growth Essentials',
      'Daily tender monitoring (matched to your profile)',
      'Tender alert emails & closing-date reminders',
      'Monthly tender digest report',
      'Compliance setup in month 1',
      'Access to Breed Tender Portal',
    ],
    cta: 'Get the Bundle',
    ctaHref: '/contact',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Onboarding',
    body: "We map your business — CIPC registration status, BEE level, tax compliance, and any upcoming deadlines. This becomes your compliance fingerprint.",
    icon: Target,
  },
  {
    step: '02',
    title: 'Monitoring Starts',
    body: 'We track CIPC annual returns, BEE renewal dates, SARS compliance status, and funding portals daily. You get notified before anything expires.',
    icon: Eye,
  },
  {
    step: '03',
    title: 'Monthly Check-In',
    body: 'Every month we review your growth progress, flag new opportunities (grants, funding, accreditations), and update your roadmap.',
    icon: Calendar,
  },
  {
    step: '04',
    title: 'Social Presence',
    body: "On the Essentials package, our team produces content for your business each month — consistent branding and messaging without you lifting a finger.",
    icon: Megaphone,
  },
  {
    step: '05',
    title: 'Alerts & Reports',
    body: 'Compliance deadlines, funding windows, and growth milestones are sent directly to your WhatsApp and email. Nothing slips through the cracks.',
    icon: MessageSquare,
  },
  {
    step: '06',
    title: 'Scale When Ready',
    body: 'Add tender monitoring, upgrade to Full Service, or bring in our team for a specific project — all on your terms, no long-term commitment required.',
    icon: Rocket,
  },
];

const stats = [
  { value: 'R4.2bn+', label: 'Available in annual SMME funding & grants', color: 'text-accent' },
  { value: '60%',     label: 'Of SMMEs lapse compliance unintentionally',  color: 'text-red-400' },
  { value: '12+',     label: 'Compliance deadlines tracked per client',     color: 'text-blue-400' },
  { value: '48hr',    label: 'Average alert lead time before deadlines',    color: 'text-green-400' },
];

const faqs = [
  {
    q: 'What is the difference between Business Watch and Business Growth Essentials?',
    a: 'Business Watch is pure monitoring — we track compliance deadlines, funding windows, and accreditation renewals and alert you. Business Growth Essentials adds active support: social media content, a monthly strategy call, and a growth roadmap. Both are R950/month.',
  },
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. All packages are month-to-month with a 30-day cancellation notice. No penalties, no lock-in. Your compliance data and reports remain yours.',
  },
  {
    q: 'What compliance deadlines do you track?',
    a: 'CIPC Annual Returns, SARS tax compliance status, BEE certificate renewal dates, COIDA Letter of Good Standing, CIDB grading renewals, and any other registrations we have on file for your business.',
  },
  {
    q: 'Do you handle the compliance renewals for us?',
    a: 'Business Watch and Essentials alert you to upcoming deadlines. Actual renewals and filings can be done by our team as add-on services (quoted separately). The Tender Growth Bundle includes compliance management in month 1.',
  },
  {
    q: 'What kind of social media content do you produce?',
    a: 'We create 4 branded posts per month tailored to your industry and audience — designed to position you as credible and professional on platforms like Facebook, LinkedIn, and Instagram.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'No setup fee. Your first month is billed immediately when you subscribe. We complete your onboarding within 5 business days.',
  },
];

const addons = [
  { name: 'Extra Social Media Posts', price: 'R250/post' },
  { name: 'Compliance Filing (per item)', price: 'From R450' },
  { name: 'Business Profile Design/Update', price: 'R450' },
  { name: 'Funding Application Assistance', price: 'From R1,200' },
];

export default function BusinessGrowthPage() {
  return (
    <>
      <Header />

      <PageHero
        title="Business Growth Services"
        subtitle="Monthly Retainer"
        description="Most South African SMMEs lose compliance status, miss funding windows, and fade from view — not because they don't care, but because no one is watching. We watch so you can focus on running your business."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Business Growth', href: '/business-growth' },
        ]}
        size="default"
        align="left"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="#packages" className="btn btn-primary">
            See Packages <ChevronRight size={16} className="ml-1" />
          </Link>
          <Link href="/subscribe/business-growth" className="btn btn-outline">
            Subscribe Now <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </PageHero>

      {/* ── Problem Statement ──────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-accent text-sm uppercase tracking-widest font-medium mb-4 block">The Problem</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6 leading-tight">
                Your business is bleeding opportunity while you're focused on operations
              </h2>
              <div className="space-y-4 text-white/65 leading-relaxed">
                <p>
                  South Africa has <strong className="text-white">over R4 billion</strong> in annual SMME funding, grants, and
                  government incentives — but most small businesses never access a cent because they don't know
                  it exists, or they miss the application window.
                </p>
                <p>
                  At the same time, one lapsed BEE certificate or missed CIPC return can disqualify you from
                  contracts worth multiples of what compliance costs to maintain.
                </p>
                <p className="text-white font-medium">
                  We built a system that watches your compliance, alerts you to funding windows, and keeps your
                  brand visible — so none of that is ever your problem again.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map(stat => (
                <div key={stat.label} className="glass-card p-6">
                  <p className={`text-3xl font-heading font-bold mb-2 ${stat.color}`}>{stat.value}</p>
                  <p className="text-white/55 text-sm leading-relaxed">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-accent text-sm uppercase tracking-widest font-medium mb-3 block">The Process</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              How Business Growth Works
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              From onboarding to ongoing support — here's how we keep your business ahead.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map(step => (
              <div key={step.step} className="glass-card p-7 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <span className="absolute top-5 right-6 text-5xl font-heading font-bold text-white/4 select-none">{step.step}</span>
                <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center mb-5">
                  <step.icon className="text-accent" size={22} />
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ──────────────────────────────────────── */}
      <section className="py-20 relative" id="packages">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-accent text-sm uppercase tracking-widest font-medium mb-3 block">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Choose Your Growth Package
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              All packages are month-to-month. Start with monitoring, add growth support, or bundle with tender services when you're ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map(pkg => (
              <div
                key={pkg.id}
                className={`glass-card p-8 flex flex-col border ${pkg.color} relative ${pkg.accent ? 'shadow-lg shadow-accent/10' : ''}`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-black text-xs font-bold px-3 py-0.5 rounded-full">
                    {pkg.badge}
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-heading font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-white/50 text-sm">{pkg.tagline}</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-heading font-bold text-accent">{pkg.price}</span>
                  <span className="text-white/40 text-sm ml-1">{pkg.billing}</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                      <Check size={14} className="text-accent mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={pkg.ctaHref}
                  className={`w-full text-center py-3 px-5 rounded-lg font-bold text-sm transition-all ${
                    pkg.accent
                      ? 'bg-accent text-black hover:bg-accent/90'
                      : 'bg-white/8 text-white border border-white/15 hover:bg-accent hover:text-black hover:border-accent'
                  }`}
                >
                  {pkg.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="mt-10 max-w-5xl mx-auto glass-card p-6 border border-white/8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
              <div className="md:col-span-1">
                <h4 className="text-white font-bold mb-1">Add-on Services</h4>
                <p className="text-white/45 text-sm">Available on top of any monthly package.</p>
              </div>
              <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                {addons.map(a => (
                  <div key={a.name} className="flex flex-col p-3 bg-white/4 rounded-lg">
                    <span className="text-white/60 text-xs mb-1">{a.name}</span>
                    <span className="text-accent font-bold text-sm">{a.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Monitor ───────────────────────────────── */}
      <section className="py-16 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <span className="text-accent text-sm uppercase tracking-widest font-medium mb-3 block">Coverage</span>
            <h3 className="text-2xl font-heading font-bold text-white mb-3">What We Monitor For You</h3>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              Every compliance item that could disqualify your business from contracts or attract penalties.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              'CIPC Annual Returns', 'SARS Tax Compliance', 'BEE Certificate Renewal',
              'COIDA Letter of Good Standing', 'CIDB Grade Renewal', 'UIF Compliance',
              'SMME Funding Windows', 'DTI & IDC Grant Alerts', 'Municipal Supplier Updates',
              'SEDA Programme Openings', 'Business Accreditation', 'CSD Profile Updates',
            ].map(s => (
              <span key={s} className="px-4 py-2 glass-card text-white/60 text-sm rounded-full border border-white/8 hover:border-accent/30 hover:text-white transition-colors">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <span className="text-accent text-sm uppercase tracking-widest font-medium mb-3 block">FAQ</span>
            <h2 className="text-3xl font-heading font-bold text-white mb-4">Common Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map(faq => (
              <div key={faq.q} className="glass-card p-7 border border-white/8">
                <h4 className="text-white font-bold mb-3 flex items-start gap-3">
                  <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" />
                  {faq.q}
                </h4>
                <p className="text-white/60 text-sm leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card-accent p-10 md:p-14 text-center">
            <TrendingUp className="mx-auto text-accent mb-5" size={44} />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Keep Your Business Growing
            </h2>
            <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto">
              Start with Business Watch at R950/month. Onboarding takes 5 days.
              No lock-in, no setup fee — just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscribe/business-growth" className="btn btn-primary">
                Subscribe Now <ChevronRight size={16} className="ml-1" />
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Book a Strategy Call <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
