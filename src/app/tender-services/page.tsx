import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import {
  Shield, Award, Search, TrendingUp, FileText, Users,
  Check, ChevronRight, ArrowRight, AlertCircle, Clock,
  MapPin, Briefcase, CheckCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tender Services | Government Procurement | Breed Industries',
  description:
    'Get tender-ready and win government contracts in South Africa. Breed Industries offers full tender registration, daily tender searching, application submissions, and site meeting attendance from R350/month.',
  keywords: [
    'government tenders South Africa', 'tender registration Durban', 'CSD registration',
    'CIDB registration', 'tender search service', 'tender application South Africa',
    'B-BBEE tender', 'eTenders South Africa', 'procurement services KZN',
  ],
  alternates: { canonical: 'https://thebreed.co.za/tender-services' },
  openGraph: {
    title: 'Tender Services - Breed Industries',
    description: 'Win government tenders. We register, search, apply, and attend on your behalf.',
    url: 'https://thebreed.co.za/tender-services',
  },
};

const packages = [
  {
    id: 'tender-ready',
    name: 'Tender Ready',
    tagline: 'Get your business qualified to bid',
    price: 'From R3,500',
    billing: 'once-off',
    color: 'border-white/15',
    accent: false,
    features: [
      'CSD (Central Supplier Database) Registration',
      'CIDB Registration (where applicable)',
      'BBBEE Affidavit / EME Certificate',
      'SARS Tax Clearance Pin',
      'Company Profile document (bid-ready)',
      'Compliance checklist & guidance',
    ],
    addons: [],
    cta: 'Get Tender-Ready',
  },
  {
    id: 'tender-watch',
    name: 'Tender Watch',
    tagline: 'Never miss a matching opportunity',
    price: 'R350',
    billing: '/month',
    color: 'border-accent/40',
    accent: true,
    badge: 'Most Popular',
    features: [
      'Daily tender searches matched to your business profile',
      'Business-profile matching (CIDB grade, BEE, province, category)',
      'Instant email alert per new tender match',
      'Closing-date reminders (72 hours before deadline)',
      'Monthly tender digest report',
      'Access to Breed Tender Portal (tenders.thebreed.co.za)',
    ],
    addons: [],
    cta: 'Start Watching',
  },
  {
    id: 'tender-apply',
    name: 'Tender Apply',
    tagline: 'We do the paperwork, you deliver the work',
    price: 'R950',
    billing: '/month',
    color: 'border-blue-500/30',
    accent: false,
    features: [
      'Everything in Tender Watch',
      'Full tender document compilation per approved bid',
      'Submission on your behalf',
      'Application status tracking & updates',
      'Clarification queries handled by our team',
    ],
    addons: ['+ R750 per tender document set compiled & submitted'],
    cta: 'Start Applying',
  },
  {
    id: 'tender-full',
    name: 'Tender Full Service',
    tagline: 'End-to-end managed procurement',
    price: 'R2,550',
    billing: '/month',
    color: 'border-white/15',
    accent: false,
    features: [
      'Everything in Tender Apply',
      'Compulsory site / briefing meeting attendance',
      'Tender clarification responses & negotiations',
      'Award follow-up and outcome reporting',
      'Dedicated account manager',
    ],
    addons: [
      '+ R2,000 per tender fully managed end-to-end',
      '+ R1,500 per site meeting attended',
      'Complex submissions quoted separately',
    ],
    cta: 'Go Full Service',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Get Registered',
    body: "We ensure your business is compliant and registered on all required portals (CSD, CIDB, SARS) so you're legally eligible to bid.",
    icon: Shield,
  },
  {
    step: '02',
    title: 'Build Your Profile',
    body: 'We capture your CIDB grade, BEE level, service categories, and target provinces. This becomes your matching fingerprint in our tender engine.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Engine Runs Daily',
    body: 'Our scraper hits eTenders, KZN, Gauteng, Western Cape, and other provincial procurement portals twice a day and scores every new tender against your profile.',
    icon: Search,
  },
  {
    step: '04',
    title: 'You Get Notified',
    body: 'When a tender scores above threshold for your profile, you receive an email with the tender details, closing date, and match reasons within hours of it being published.',
    icon: AlertCircle,
  },
  {
    step: '05',
    title: 'We Apply (if on Apply / Full)',
    body: 'On Apply and Full packages, our team compiles the full bid document, attaches your compliance certificates, and submits before the deadline.',
    icon: FileText,
  },
  {
    step: '06',
    title: 'We Attend (if on Full)',
    body: 'Many tenders require compulsory briefing sessions. On the Full package, a Breed rep attends the site meeting on your behalf and reports back.',
    icon: MapPin,
  },
];

const sources = [
  'eTenders (National Treasury)', 'KwaZulu-Natal Provincial Treasury',
  'Gauteng Department of Infrastructure', 'Western Cape Government Tenders',
  'Eastern Cape Provincial Tenders', 'CIDB Procurement Portal',
  'eThekwini Municipality', 'City of Tshwane', 'Transnet SOC',
  'SANRAL', 'ESKOM Supplier Development', 'Various SOEs',
];

const faqs = [
  {
    q: 'Do I need to already be registered to start Tender Watch?',
    a: 'Not immediately. You can sign up for Tender Watch while we process your Tender Ready registration in parallel. Most registrations are complete within 5–10 business days.',
  },
  {
    q: 'How many tenders will I receive per month?',
    a: 'It depends entirely on your profile — province, CIDB grade, and service categories. Clients in construction with KZN + GP typically see 15–40 matches per month. Niche service providers may see fewer but more targeted results.',
  },
  {
    q: 'Can I upgrade or downgrade my package?',
    a: 'Yes. Packages are month-to-month. Notify us 30 days before your billing date and we\'ll adjust your service level accordingly.',
  },
  {
    q: 'What happens if we win a tender?',
    a: 'We celebrate with you. On the Full Service package, we assist with the award letter response and contract signing preparation. Any consulting beyond that is quoted separately.',
  },
  {
    q: 'Does the R800 per-application charge apply to all tenders or just selected ones?',
    a: 'It applies per tender where we compile and submit the full bid document. On the Tender Watch package, we only notify — no application charge. On Apply and Full, you choose which matched tenders to apply for, and each application carries the R800 fee.',
  },
  {
    q: 'Do you guarantee tender wins?',
    a: 'No. No one can ethically guarantee that. What we guarantee is that your business is compliant, your bids are complete and on time, and that you\'re in front of every relevant opportunity — which is what most businesses miss out on.',
  },
];

export default function TenderServicesPage() {
  return (
    <>
      <Header />

      <PageHero
        title="Tender Services"
        subtitle="Government Procurement"
        description="South African businesses leave billions on the table every year by missing tenders they qualify for. We fix that with automation, expertise, and a team that handles the entire process on your behalf."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Tender Services', href: '/tender-services' },
        ]}
        size="default"
        align="left"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="#packages" className="btn btn-primary">
            See Packages <ChevronRight size={16} className="ml-1" />
          </Link>
          <a href="https://tenders.thebreed.co.za" target="_blank" rel="noopener noreferrer"
             className="btn btn-outline">
            Launch Tender Portal <ArrowRight size={16} className="ml-1" />
          </a>
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
                Most businesses qualify for tenders they never even know exist
              </h2>
              <div className="space-y-4 text-white/65 leading-relaxed">
                <p>
                  The South African government spends over <strong className="text-white">R800 billion</strong> annually through public procurement.
                  A significant portion is reserved for SMMEs, cooperatives, and BEE-compliant businesses, yet most eligible companies never participate because they don't know where to look,
                  don't have time to monitor portals daily, or don't understand the compliance requirements.
                </p>
                <p>
                  eTenders alone publishes hundreds of new opportunities every week across 9 provinces and
                  dozens of departments. Missing even one closing deadline means waiting months for the next cycle.
                </p>
                <p className="text-white font-medium">
                  We built a system that watches every portal, every day, and brings the right opportunities directly to you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'R800bn+', label: 'Annual government procurement spend', color: 'text-accent' },
                { value: '30%',     label: 'Reserved for SMMEs under PPPFA',      color: 'text-blue-400' },
                { value: '100s',    label: 'New tenders published weekly',         color: 'text-green-400' },
                { value: '9',       label: 'Provinces with active procurement portals', color: 'text-purple-400' },
              ].map(stat => (
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
              How Tender Services Works
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              From zero compliance to active bidder, here's the full lifecycle we manage for you.
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
              Choose Your Tender Package
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Start with registration, or jump straight into daily monitoring. Scale up to full managed procurement when you're ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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

                {pkg.addons.length > 0 && (
                  <div className="mb-6 pt-4 border-t border-white/8">
                    {pkg.addons.map(a => (
                      <p key={a} className="text-xs text-white/40 mb-1">{a}</p>
                    ))}
                  </div>
                )}

                <Link
                  href="/contact"
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

          {/* Add-ons summary */}
          <div className="mt-10 glass-card p-6 border border-white/8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
              <div className="md:col-span-1">
                <h4 className="text-white font-bold mb-1">Add-on Charges</h4>
                <p className="text-white/45 text-sm">Applied on top of your monthly package where relevant.</p>
              </div>
              <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'Per Tender Applied',       price: 'R800' },
                  { name: 'Site Meeting Attendance',  price: 'R1,500' },
                  { name: 'Compliance Audit',         price: 'R1,200' },
                  { name: 'Company Profile Update',   price: 'R450' },
                ].map(a => (
                  <div key={a.name} className="flex items-center justify-between p-3 bg-white/4 rounded-lg">
                    <span className="text-white/60 text-xs">{a.name}</span>
                    <span className="text-accent font-bold text-sm ml-2">{a.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sources We Monitor ────────────────────────────── */}
      <section className="py-16 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <span className="text-accent text-sm uppercase tracking-widest font-medium mb-3 block">Coverage</span>
            <h3 className="text-2xl font-heading font-bold text-white mb-3">Portals We Monitor Daily</h3>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              Our system runs across all major national and provincial government procurement platforms so you never need to check them yourself.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {sources.map(s => (
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
            <Award className="mx-auto text-accent mb-5" size={44} />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Start Winning Government Contracts
            </h2>
            <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto">
              Book a strategy call and we'll assess your current compliance status, recommend the right package,
              and have you live in the tender engine within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn btn-primary">
                Book Strategy Call <ChevronRight size={16} className="ml-1" />
              </Link>
              <a href="https://tenders.thebreed.co.za" target="_blank" rel="noopener noreferrer"
                 className="btn btn-outline">
                Launch Tender Portal <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
