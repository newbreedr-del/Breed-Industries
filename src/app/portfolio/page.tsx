"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Code2, Palette, FileText, CheckCircle2 } from 'lucide-react';

// ─── Digital Products Built for Clients ──────────────────────────────────────
const digitalProjects = [
  {
    id: 'engage-africa',
    title: 'Engage Africa IO',
    client: 'DOJA / Engage Africa',
    category: 'AI Customer Engagement Platform',
    tags: ['Next.js', 'AI Agents', 'WhatsApp API', 'Supabase'],
    summary:
      'A production-grade AI-powered customer engagement platform built for African businesses. Features AI agents, WhatsApp Business integration, visual flow builder, knowledge base management, and real-time analytics — all in one dashboard.',
    highlights: ['AI chat agents with custom knowledge bases', 'WhatsApp Business API integration', 'Visual no-code workflow builder', 'Multi-channel analytics dashboard'],
    image: '/assets/images/portfolio/engage-africa-dashboard.png',
    screenshots: [
      '/assets/images/portfolio/engage-africa-dashboard.png',
      '/assets/images/portfolio/engage-africa-agents.png',
      '/assets/images/portfolio/engage-africa-identity.png',
      '/assets/images/portfolio/engage-africa-chat.png',
    ],
    link: null,
  },
  {
    id: 'mlk-apparel',
    title: 'MLK Apparel Online Store',
    client: 'MLK Apparel',
    category: 'E-Commerce Platform',
    tags: ['React', 'Stripe', 'Paystack', 'PayPal', 'Tailwind CSS'],
    summary:
      'A full-featured faith-driven fashion e-commerce store — "Rooted in Faith, Growing in Purpose." Built with multi-payment support (Stripe, Paystack, PayPal), product filtering, wishlist functionality, and analytics including Facebook Pixel, TikTok Pixel, and Pinterest Tag.',
    highlights: ['Stripe, Paystack & PayPal checkout', 'Facebook, TikTok & Pinterest pixel tracking', 'Flash sale & countdown timer system', 'Full admin dashboard'],
    image: '/assets/images/portfolio/mlk-apparel-hero.png',
    screenshots: [
      '/assets/images/portfolio/mlk-apparel-hero.png',
      '/assets/images/portfolio/mlk-apparel-products.png',
    ],
    link: null,
  },
  {
    id: 'hogi-church',
    title: 'HOGI Church Management App',
    client: 'House of Grace International',
    category: 'Church & Community Platform',
    tags: ['React', 'Supabase', 'Recharts', 'Real-time', 'Video'],
    summary:
      'A purpose-built church management platform for House of Grace International. Features member management, event planning, task management, live video meetings with prayer requests, analytics & reports, and enterprise-grade security.',
    highlights: ['Live video meetings with chat & prayer requests', 'Member & attendance tracking', 'Event planning & volunteer management', 'Analytics, reports & task management'],
    image: '/assets/images/portfolio/hogi-church-home.png',
    screenshots: ['/assets/images/portfolio/hogi-church-home.png'],
    link: null,
  },
  {
    id: 'igroup-website',
    title: 'I-Group Corporate Website',
    client: 'Ihlelibanzi Trading Enterprises (I-Group)',
    category: 'Corporate Website',
    tags: ['React', 'Tailwind CSS', 'Responsive', 'SEO'],
    summary:
      'A professional corporate website for I-Group (Ihlelibanzi Trading Enterprises) — a social facilitation, research, and asset tracing firm. Built with a strong "Impact Driven" identity, service showcases, and lead capture — live at igroupsa.com.',
    highlights: ['Full responsive corporate site', 'Service & project showcases', 'Contact & lead capture forms', 'Live at igroupsa.com'],
    image: '/assets/images/portfolio/igroup-hero.png',
    screenshots: [
      '/assets/images/portfolio/igroup-hero.png',
      '/assets/images/portfolio/igroup-services.png',
      '/assets/images/portfolio/igroup-about.png',
    ],
    link: 'https://igroupsa.com',
  },
  {
    id: 'pinetown-inc',
    title: 'Pinetown Incorporated Website',
    client: 'Pinetown Incorporated (PINC)',
    category: 'NPO Community Website',
    tags: ['React', 'Tailwind CSS', 'Donations', 'Membership'],
    summary:
      'A vibrant NPO website for Pinetown Incorporated — "Empowering Growth, Building Tomorrow Together." Includes membership sign-up, donation integration, project showcases, and a full about/services section. Live at pinc.org.za.',
    highlights: ['Donation & membership integration', 'Project & services showcase', 'Community-first UI with bold brand identity', 'Live at pinc.org.za'],
    image: '/assets/images/portfolio/pinetown-hero.png',
    screenshots: [
      '/assets/images/portfolio/pinetown-hero.png',
      '/assets/images/portfolio/pinetown-about.png',
      '/assets/images/portfolio/pinetown-services.png',
    ],
    link: 'https://pinc.org.za',
  },
  {
    id: 'ntandokazi-herbal',
    title: 'Ntandokazi Herbal Products',
    client: 'Ntandokazi / Sontos Organics',
    category: 'Business Management System',
    tags: ['Next.js', 'Supabase', 'PDF Export', 'Inventory Management'],
    summary:
      'A complete business management system built for a herbal product company. Manages inventory, clients, bookkeeping, and communications in one place — with PDF report generation, QR code support, and Google Sheets integration.',
    highlights: ['Inventory & product catalogue management', 'Client CRM & communications', 'Bookkeeping & financial reports', 'QR code & PDF export tools'],
    image: '/assets/images/portfolio/engage-africa-agents.png',
    screenshots: [],
    link: null,
  },
  {
    id: 'gobizz-learning',
    title: 'GoBizz Business Learning App',
    client: 'GoBizz',
    category: 'Business Training Platform',
    tags: ['Mobile App', 'UI/UX Design', 'Figma', 'Learning Platform'],
    summary:
      'A structured business learning and training platform designed for South African entrepreneurs. Covers compliance checklists, portfolio building, chat-based lesson delivery, and progress tracking — helping business owners grow with confidence.',
    highlights: ['Structured learning modules', 'Compliance checklist feature', 'Chat-based lesson delivery', 'Portfolio tracking dashboard'],
    image: '/assets/images/portfolio/engage-africa-chat.png',
    screenshots: [],
    link: null,
  },
];

// ─── Branding & Logo Work ──────────────────────────────────────────────────────
const brandingClients = [
  { name: 'GoBizz', logo: '/assets/images/clients/gobizz-logo.png', work: 'Logo Design, Brand Identity' },
  { name: 'I-Group', logo: '/assets/images/clients/igroup-logo.png', work: 'Logo Design, Business Cards, Letterhead' },
  { name: 'MC Ways Construction', logo: '/assets/images/clients/mcways-logo.jpg', work: 'Logo Design, Brand Identity, Letterhead' },
  { name: 'NSPIRAXION', logo: '/assets/images/clients/nspiraxion-logo.jpg', work: 'Logo Design, Brand Identity' },
  { name: 'Isambulo Sezulu', logo: '/assets/images/clients/isambulo-logo.jpg', work: 'Logo Design, Brand Identity' },
  { name: 'Ebodweni', logo: '/assets/images/clients/ebodweni-logo.jpg', work: 'Logo Design, Brand Materials' },
  { name: 'Lance Renovations', logo: '/assets/images/clients/lance-logo.jpg', work: 'Logo Design, Business Cards' },
  { name: 'Gadali Security', logo: '/assets/images/clients/gadali-logo.jpg', work: 'Logo Design, Brand Identity' },
  { name: 'Spephelo', logo: '/assets/images/clients/spephelo-logo.jpg', work: 'Logo Design, Brand Materials' },
];

// ─── Business Services Delivered ─────────────────────────────────────────────
const businessServicesClients = [
  { name: 'The Breed Industries', services: ['Business Plan', 'Company Registration', 'Financial Projections', 'B-BBEE Certificate', 'Tax Clearance', 'CSD Registration'], industry: 'Retail / Clothing' },
  { name: 'Pinetown Incorporated', services: ['Company Registration', 'SARS Documents', 'Meeting Minutes', 'Letters & Correspondence', 'Funding Proposals'], industry: 'NPO / Community' },
  { name: 'Taro Tech', services: ['Business Plan', 'Concept Note', 'Strategic Document Review'], industry: 'AgriTech / Innovation' },
  { name: 'I-Group', services: ['Business Plan', 'Company Profile', 'Letterhead & Invoice Templates', 'Business Cards'], industry: 'Consulting' },
  { name: 'Simeli Projects', services: ['Company Registration', 'Securities Register', 'Mandate Document'], industry: 'Project Management' },
  { name: 'Bhatini', services: ['Cooperative Constitution', 'Company Registration'], industry: 'Agriculture / Cooperative' },
  { name: 'Mjabuliswa Construction', services: ['Company Profile', 'Marketing Materials'], industry: 'Construction' },
  { name: 'Lance Renuvations', services: ['Quotation Templates', 'Business Documentation'], industry: 'Construction / Renovation' },
  { name: 'African Alabaster', services: ['Financial Cost Breakdown', 'Product Costing Model'], industry: 'Lifestyle / Fragrance' },
  { name: 'Ispaan', services: ['Financial Projections', 'Investor Worksheets', 'GoBizz Partnership Model'], industry: 'Finance / Tech' },
  { name: 'Kuenta', services: ['Implementation Plan', 'Gantt Chart', 'Financial Projections'], industry: 'FinTech / Payments' },
  { name: 'House Of Grace International', services: ['Cost Estimates', 'Clothing Budget'], industry: 'Religious Organisation' },
];

export default function PortfolioPage() {
  return (
    <>
      <Header />

      <PageHero
        title="Real Work. Real Clients. Real Impact."
        subtitle="Portfolio"
        description="From AI platforms and e-commerce stores to company registrations and brand identities — here's what we've built for businesses across South Africa."
        breadcrumbs={[{ label: 'Portfolio', href: '/portfolio' }]}
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/build-package" className="btn btn-primary">
            Start Your Project
          </Link>
          <Link href="/contact" className="btn btn-outline">
            Talk to Our Team
          </Link>
        </div>
      </PageHero>

      {/* Stats Bar */}
      <section className="py-10 bg-color-bg-secondary border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '23+', label: 'Clients Served' },
              { value: '5', label: 'Digital Products Built' },
              { value: '8+', label: 'Brand Identities Created' },
              { value: '45+', label: 'Businesses Launched' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-heading font-bold text-accent">{stat.value}</p>
                <p className="text-white/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 1: Digital Products ─────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Code2 className="w-6 h-6 text-accent" />
            <span className="text-accent text-sm uppercase tracking-widest font-medium">Digital Products</span>
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-3">
            Software & Apps We&apos;ve Built
          </h2>
          <p className="text-white/60 max-w-2xl mb-12">
            Custom platforms, e-commerce stores, business management systems, and AI-powered tools — built from scratch for real clients with real needs.
          </p>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {digitalProjects.map((project, index) => (
              <div
                key={project.id}
                className={`glass-card overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col ${
                  index === 0 ? 'xl:col-span-2' : ''
                }`}
              >
                {/* Main screenshot */}
                <div className="relative h-56 bg-white/5 flex-shrink-0 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 flex items-center gap-1.5 text-xs bg-accent text-black font-semibold rounded px-2.5 py-1 hover:bg-accent/90 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Live Site
                    </a>
                  )}
                  <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-black/60 text-accent border border-accent/30 rounded px-2 py-0.5 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thumbnail strip for multi-screenshot projects */}
                {project.screenshots.length > 1 && (
                  <div className="flex gap-1.5 px-3 py-2 bg-white/5 border-b border-white/10 overflow-x-auto">
                    {project.screenshots.slice(0, 4).map((src, i) => (
                      <div key={i} className="relative flex-shrink-0 w-16 h-10 rounded overflow-hidden border border-white/10">
                        <Image src={src} alt={`${project.title} screen ${i + 1}`} fill className="object-cover object-top" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-accent/70">{project.category}</span>
                    <p className="text-white/40 text-xs mt-0.5">Client: {project.client}</p>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-white">{project.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{project.summary}</p>
                  <ul className="mt-2 space-y-1">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-white/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center gap-2 text-accent text-sm font-medium pt-3 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit {project.link.replace('https://', '')}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: Branding & Logos ─────────────────────────────────── */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Palette className="w-6 h-6 text-accent" />
            <span className="text-accent text-sm uppercase tracking-widest font-medium">Branding & Identity</span>
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-3">
            Logos & Brand Identities We&apos;ve Created
          </h2>
          <p className="text-white/60 max-w-2xl mb-12">
            Every logo here was designed from scratch for a South African business — giving them a professional face to show the world.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {brandingClients.map((client) => (
              <div key={client.name} className="glass-card p-6 flex flex-col items-center gap-3 group hover:-translate-y-1 transition-transform bg-white/5">
                <div className="h-20 w-full flex items-center justify-center bg-white/10 rounded-lg overflow-hidden px-3">
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={180}
                    height={80}
                    className="object-contain group-hover:scale-105 transition-transform max-h-16 w-auto"
                  />
                </div>
                <div className="text-center">
                  <p className="text-white/90 text-sm font-semibold">{client.name}</p>
                  <p className="text-accent/70 text-xs mt-0.5">{client.work}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: Business Services ───────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-accent" />
            <span className="text-accent text-sm uppercase tracking-widest font-medium">Business Services</span>
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-3">
            Business Plans, Registrations & Compliance
          </h2>
          <p className="text-white/60 max-w-2xl mb-12">
            We&apos;ve helped 23 clients get registered, compliant, funded, and ready to operate — from writing business plans to handling SARS, CIPC, CSD, and B-BBEE.
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {businessServicesClients.map((client, i) => (
              <div key={client.name} className={`glass-card p-6 hover:-translate-y-1 transition-transform ${i === 0 ? 'border border-accent/30' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold font-heading">{client.name}</h3>
                    <p className="text-white/40 text-xs mt-0.5">{client.industry}</p>
                  </div>
                  {i === 0 && <span className="text-xs bg-accent/20 text-accent border border-accent/30 rounded px-2 py-0.5">Our Own Co.</span>}
                </div>
                <ul className="space-y-1.5">
                  {client.services.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-xs text-white/60">
                      <CheckCircle2 className="w-3 h-3 text-accent flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Ready to become our next success story?</h2>
          <p className="text-white/70 max-w-3xl mx-auto mb-8">
            Tell us what you need — whether it&apos;s a custom app, a brand identity, a business plan, or full company registration. We&apos;ll come back to you within one business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary">
              Talk to Our Team
            </Link>
            <Link href="/build-package" className="btn btn-outline">
              Build Custom Package
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
