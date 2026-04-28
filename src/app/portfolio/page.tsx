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
    image: '/assets/images/portfolio/digital-experience.jpg',
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
    image: '/assets/images/portfolio/enterprise-success.jpg',
  },
  {
    id: 'mlk-apparel',
    title: 'MLK Apparel Online Store',
    client: 'MLK Apparel',
    category: 'E-Commerce Platform',
    tags: ['React', 'Stripe', 'Paystack', 'PayPal', 'Tailwind CSS'],
    summary:
      'A full-featured fashion e-commerce platform with multi-payment support (Stripe, Paystack, PayPal), product filtering, wishlist functionality, and full analytics integration including Facebook Pixel, TikTok Pixel, and Pinterest Tag.',
    highlights: ['Stripe, Paystack & PayPal checkout', 'Facebook, TikTok & Pinterest pixel tracking', 'Product wishlist & cart system', 'Full admin dashboard'],
    image: '/assets/images/portfolio/client-showcase.jpg',
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
    image: '/assets/images/portfolio/branding-suite.jpg',
  },
  {
    id: 'hohi-church',
    title: 'HOHI Church Management App',
    client: 'House of Grace International',
    category: 'Church & Community App',
    tags: ['React', 'Supabase', 'Recharts', 'Real-time'],
    summary:
      'A purpose-built church management platform that functions like Zoom Meetings for congregations. Features member management, service scheduling, attendance tracking, giving/donations management, and live analytics — all built for House of Grace International.',
    highlights: ['Live virtual service management', 'Member & attendance tracking', 'Giving & donations dashboard', 'Real-time analytics & reports'],
    image: '/assets/images/portfolio/case-study-grid.jpg',
  },
];

// ─── Branding & Logo Work ──────────────────────────────────────────────────────
const brandingClients = [
  { name: 'GoBizz', logo: '/assets/images/clients/gobizz-logo White-01.png', work: 'Logo Design, Brand Identity' },
  { name: 'Pinetown Incorporated', logo: '/assets/images/clients/Pinetown Incorporated-01.png', work: 'Logo Design, Letterhead, Business Cards' },
  { name: 'MC Ways', logo: '/assets/images/clients/MC Ways New-03.png', work: 'Logo Design, Brand Identity, Letterhead' },
  { name: 'I-Group', logo: '/assets/images/clients/I Group Logo White-01-01.png', work: 'Logo Design, Business Cards, Letterhead' },
  { name: 'NSPIRAXION', logo: '/assets/images/clients/NSPIRAXION IMPULSE PROJECTS LOGO [Recovered]-01.png', work: 'Logo Design, Brand Identity' },
  { name: 'Ndlunkulu', logo: '/assets/images/clients/Ndlunkulu White text-01.png', work: 'Logo Design, Marketing Materials' },
  { name: 'Isambulo', logo: '/assets/images/clients/Isambulo Logo-01.png', work: 'Logo Design, Brand Identity' },
  { name: 'Ebodweni', logo: '/assets/images/clients/Ebodweni-01.png', work: 'Logo Design, Brand Materials' },
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
                <div className="relative h-52 bg-white/5 flex-shrink-0">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover mix-blend-screen opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-accent/20 text-accent border border-accent/30 rounded px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brandingClients.map((client) => (
              <div key={client.name} className="glass-card p-6 flex flex-col items-center gap-3 group hover:-translate-y-1 transition-transform">
                <div className="h-16 flex items-center justify-center">
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={160}
                    height={64}
                    className="object-contain opacity-80 group-hover:opacity-100 transition-opacity max-h-16"
                  />
                </div>
                <div className="text-center">
                  <p className="text-white/80 text-xs font-medium">{client.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{client.work}</p>
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
