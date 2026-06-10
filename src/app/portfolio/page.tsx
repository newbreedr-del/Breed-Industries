"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Code2, Palette, FileText, CheckCircle2, ChevronLeft, ChevronRight, ImageIcon, Zap } from 'lucide-react';

// ─── Digital Products Built for Clients ──────────────────────────────────────
const digitalProjects = [
  {
    id: 'engage-africa',
    title: 'Engage Africa IO',
    client: 'DOJA / Engage Africa',
    category: 'AI Customer Engagement Platform',
    tags: ['Next.js', 'AI Agents', 'WhatsApp API', 'Supabase'],
    summary:
      'A production-grade AI-powered customer engagement platform built for African businesses. Features AI agents, WhatsApp Business integration, visual flow builder, knowledge base management, and real-time analytics. All in one dashboard.',
    highlights: ['AI chat agents with custom knowledge bases', 'WhatsApp Business API integration', 'Visual no-code workflow builder', 'Multi-channel analytics dashboard'],
    result: 'Built in 3 weeks from concept to production. An ongoing platform that continues to grow — currently in active development with new features shipping regularly.',
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
      'A full-featured faith-driven fashion e-commerce store. "Rooted in Faith, Growing in Purpose." Built with multi-payment support (Stripe, Paystack, PayPal), product filtering, wishlist functionality, and analytics including Facebook Pixel, TikTok Pixel, and Pinterest Tag.',
    highlights: ['Stripe, Paystack & PayPal checkout', 'Facebook, TikTok & Pinterest pixel tracking', 'Flash sale & countdown timer system', 'Full admin dashboard'],
    result: 'Designed, built and delivered in 14 days. Full e-commerce store with multi-payment gateway, pixel tracking, and admin dashboard — from brief to live in two weeks.',
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
    result: 'A complex, purpose-built platform currently in active development — over 2 months in the making. Live video, member management, event planning and analytics built specifically for House of Grace International.',
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
      'A professional corporate website for I-Group (Ihlelibanzi Trading Enterprises), a social facilitation, research, and asset tracing firm. Built with a strong "Impact Driven" identity, service showcases, and lead capture. Live at igroupsa.com.',
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
      'A vibrant NPO website for Pinetown Incorporated. "Empowering Growth, Building Tomorrow Together." Includes membership sign-up, donation integration, project showcases, and a full about/services section. Live at pinc.org.za.',
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
      'A complete business management system built for a herbal product company. Manages inventory, clients, bookkeeping, and communications in one place. Features PDF report generation, QR code support, and Google Sheets integration.',
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
    tags: ['Mobile App', 'UI/UX Design', 'Learning Platform', 'Compliance'],
    summary:
      'A structured business learning and training platform designed for South African entrepreneurs. Covers compliance checklists, portfolio building, chat-based lesson delivery, and progress tracking to help business owners grow with confidence.',
    highlights: ['Structured learning modules', 'Compliance checklist feature', 'Chat-based lesson delivery', 'Portfolio tracking dashboard'],
    image: '/assets/images/portfolio/gobizz-1.png',
    screenshots: [
      '/assets/images/portfolio/gobizz-1.png',
      '/assets/images/portfolio/gobizz-2.png',
      '/assets/images/portfolio/gobizz-3.png',
    ],
    link: null,
  },
];

// ─── Branding & Logo Work ──────────────────────────────────────────────────────
const brandingClients = [
  { name: 'GoBizz', logo: '/assets/images/clients/gobizz-logo White-01.png', work: 'Logo Design, Brand Identity' },
  { name: 'I-Group', logo: '/assets/images/clients/I Group Logo White-01-01.png', work: 'Logo Design, Business Cards, Letterhead' },
  { name: 'MC Ways Construction', logo: '/assets/images/clients/MC Ways New-03.png', work: 'Logo Design, Brand Identity, Letterhead' },
  { name: 'NSPIRAXION', logo: '/assets/images/clients/NSPIRAXION IMPULSE PROJECTS LOGO [Recovered]-01.png', work: 'Logo Design, Brand Identity' },
  { name: 'Isambulo Sezulu', logo: '/assets/images/clients/Isambulo Logo-01.png', work: 'Logo Design, Brand Identity' },
  { name: 'Ebodweni', logo: '/assets/images/clients/Ebodweni-01.png', work: 'Logo Design, Brand Materials' },
  { name: 'Ndlunkulu', logo: '/assets/images/clients/Ndlunkulu White text-01.png', work: 'Logo Design, Brand Identity' },
  { name: 'OKuhle', logo: '/assets/images/clients/New OKuhle Logo-01.png', work: 'Logo Design, Brand Materials' },
  { name: 'Pinetown Incorporated', logo: '/assets/images/clients/Pinetown Incorporated-01.png', work: 'Logo Design, NPO Branding' },
  { name: 'Lance Renovations', logo: '/assets/images/clients/lance-logo.png', work: 'Logo Design, Business Cards' },
  { name: 'Gadali Security', logo: '/assets/images/clients/gadali-logo.png', work: 'Logo Design, Brand Identity' },
  { name: 'Spephelo', logo: '/assets/images/clients/spephelo-logo.png', work: 'Logo Design, Brand Materials' },
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
  const [projectsPage, setProjectsPage] = useState(0);
  const [bsPage, setBsPage] = useState(0);

  const engageProject = digitalProjects[0];
  const otherProjects = digitalProjects.slice(1);
  const projectsPerPage = 4;
  const totalProjectPages = Math.ceil(otherProjects.length / projectsPerPage);
  const visibleProjects = otherProjects.slice(projectsPage * projectsPerPage, (projectsPage + 1) * projectsPerPage);

  const bsPerPage = 4;
  const totalBsPages = Math.ceil(businessServicesClients.length / bsPerPage);
  const visibleBsClients = businessServicesClients.slice(bsPage * bsPerPage, (bsPage + 1) * bsPerPage);

  return (
    <>
      <Header />

      <PageHero
        title="Real Work. Real Clients. Real Impact."
        subtitle="Portfolio"
        description="From AI platforms and e-commerce stores to company registrations and brand identities. Here's what we've built for businesses across South Africa."
        breadcrumbs={[{ label: 'Portfolio', href: '/portfolio' }]}
        backgroundImage="/assets/images/portfolio-hero.png"
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
            Custom platforms, e-commerce stores, business management systems, and AI-powered tools. Built from scratch for real clients with real needs.
          </p>

          {/* ── Engage Africa: Full-Width Hero ── */}
          <div className="glass-card overflow-hidden mb-10 border border-accent/20">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto min-h-[340px] bg-white/5 overflow-hidden">
                <Image src={engageProject.image} alt={engageProject.title} fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-accent text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Featured Build</span>
                </div>
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {engageProject.tags.map(tag => (
                    <span key={tag} className="text-xs bg-black/70 text-accent border border-accent/30 rounded px-2 py-0.5 backdrop-blur-sm">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="p-8 flex flex-col gap-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-accent/70">{engageProject.category}</span>
                  <p className="text-white/40 text-xs mt-0.5">Client: {engageProject.client}</p>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">{engageProject.title}</h3>
                <p className="text-white/70 leading-relaxed text-sm">{engageProject.summary}</p>
                {'result' in engageProject && engageProject.result && (
                  <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                    <p className="text-accent text-xs uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Result</p>
                    <p className="text-white/70 text-sm">{engageProject.result}</p>
                  </div>
                )}
                <ul className="grid grid-cols-1 gap-2">
                  {engageProject.highlights.map(h => (
                    <li key={h} className="flex items-start gap-2 text-sm text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                {engageProject.screenshots.length > 1 && (
                  <div className="flex gap-2 mt-2">
                    {engageProject.screenshots.slice(0, 4).map((src, i) => (
                      <div key={i} className="relative flex-shrink-0 w-16 h-10 rounded overflow-hidden border border-white/10">
                        <Image src={src} alt={`Screen ${i + 1}`} fill className="object-cover object-top" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Other Projects: 4-at-a-time Carousel ── */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/50 text-sm uppercase tracking-wider">More Projects</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setProjectsPage(p => Math.max(0, p - 1))} disabled={projectsPage === 0}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-white/40 text-xs tabular-nums">{projectsPage + 1} / {totalProjectPages}</span>
              <button onClick={() => setProjectsPage(p => Math.min(totalProjectPages - 1, p + 1))} disabled={projectsPage === totalProjectPages - 1}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white disabled:opacity-30 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {visibleProjects.map(project => (
              <div key={project.id} className="glass-card overflow-hidden hover:-translate-y-1 transition-transform flex flex-col">
                <div className="relative h-44 bg-white/5 overflow-hidden flex-shrink-0">
                  <Image src={project.image} alt={project.title} fill className="object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                      className="absolute top-2 right-2 text-xs bg-accent text-black font-bold rounded px-2 py-0.5">Live ↗</a>
                  )}
                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                    {project.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-black/70 text-accent border border-accent/30 rounded px-1.5 py-0.5">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-accent/70">{project.category}</span>
                  <h3 className="text-white font-semibold font-heading leading-tight">{project.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-3">{project.summary}</p>
                  {'result' in project && project.result && (
                    <p className="text-accent/80 text-xs leading-relaxed border-l-2 border-accent/40 pl-2 mt-1">{project.result}</p>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer"
                      className="mt-auto flex items-center gap-1 text-accent text-xs pt-2 hover:underline">
                      <ExternalLink className="w-3 h-3" />{project.link.replace('https://', '')}
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
            Every logo here was designed from scratch for a South African business, giving them a professional face to show the world.
          </p>

          {/* Infinite auto-scroll carousel - 4 visible at once on desktop */}
          <div className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
            <div className="flex gap-5 logo-marquee">
              {[...brandingClients, ...brandingClients, ...brandingClients, ...brandingClients].map((client, i) => (
                <div key={`${client.name}-${i}`} className="flex-shrink-0 w-56 md:w-64 flex flex-col items-center justify-center gap-3 group py-3">
                  <div className="h-32 w-full flex items-center justify-center px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                    <Image
                      src={client.logo}
                      alt={`${client.name} logo`}
                      width={220}
                      height={112}
                      className="object-contain max-h-24 w-auto transition-all duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center px-2">
                    <p className="text-white/80 text-sm font-semibold truncate max-w-full">{client.name}</p>
                    <p className="text-accent/60 text-xs mt-0.5 truncate max-w-full">{client.work}</p>
                  </div>
                </div>
              ))}
            </div>
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
            We've helped 23 clients get registered, compliant, funded, and ready to operate. From writing business plans to handling SARS, CIPC, CSD, and B-BBEE.
          </p>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
            {visibleBsClients.map((client, i) => (
              <div key={client.name} className={`glass-card p-6 ${
                i === 0 && bsPage === 0 ? 'border border-accent/30' : ''
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold font-heading">{client.name}</h3>
                    <p className="text-white/40 text-xs mt-1">{client.industry}</p>
                  </div>
                  {i === 0 && bsPage === 0 && (
                    <span className="text-xs bg-accent/20 text-accent border border-accent/30 rounded px-1.5 py-0.5 flex-shrink-0 ml-2">Us</span>
                  )}
                </div>
                <ul className="space-y-2">
                  {client.services.map(s => (
                    <li key={s} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {totalBsPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setBsPage(p => Math.max(0, p - 1))} disabled={bsPage === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-white/40 text-sm">{bsPage + 1} / {totalBsPages}</span>
              <button onClick={() => setBsPage(p => Math.min(totalBsPages - 1, p + 1))} disabled={bsPage === totalBsPages - 1}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm disabled:opacity-30 transition-colors">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── SECTION 4: Posters & Flyers ───────────────────────────────── */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <ImageIcon className="w-6 h-6 text-accent" />
            <span className="text-accent text-sm uppercase tracking-widest font-medium">Print & Digital Design</span>
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-3">
            Posters & Flyers We&apos;ve Created
          </h2>
          <p className="text-white/60 max-w-2xl mb-12">
            Eye-catching promotional materials designed for businesses, events, and community initiatives across South Africa.
          </p>

          {/* Auto-scroll carousel - 4 visible at once on desktop */}
          <div className="relative overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
            <div className="flex gap-5 poster-marquee">
              {[...[
                { title: 'Ebodweni Campaign', image: '/assets/images/portfolio/ebodweni-poster.jpg', client: 'Ebodweni' },
                { title: 'I-Group Corporate Flyer', image: '/assets/images/portfolio/igroup-flyer.png', client: 'I-Group' },
                { title: 'Pinetown NPO Poster', image: '/assets/images/portfolio/pinetown-poster.jpg', client: 'Pinetown Incorporated' },
                { title: 'Brand Campaign 1', image: '/assets/images/portfolio/flyer-1.jpg', client: 'Various Clients' },
                { title: 'Promotional Material 1', image: '/assets/images/portfolio/flyer-2.jpg', client: 'Various Clients' },
                { title: 'Business Promotion', image: '/assets/images/portfolio/flyer-7.jpg', client: 'Various Clients' },
                { title: 'Marketing Campaign', image: '/assets/images/portfolio/flyer-11.jpg', client: 'Various Clients' },
                { title: 'Community Outreach', image: '/assets/images/portfolio/flyer-12.jpg', client: 'Various Clients' },
              ], ...[
                { title: 'Ebodweni Campaign', image: '/assets/images/portfolio/ebodweni-poster.jpg', client: 'Ebodweni' },
                { title: 'I-Group Corporate Flyer', image: '/assets/images/portfolio/igroup-flyer.png', client: 'I-Group' },
                { title: 'Pinetown NPO Poster', image: '/assets/images/portfolio/pinetown-poster.jpg', client: 'Pinetown Incorporated' },
                { title: 'Brand Campaign 1', image: '/assets/images/portfolio/flyer-1.jpg', client: 'Various Clients' },
                { title: 'Promotional Material 1', image: '/assets/images/portfolio/flyer-2.jpg', client: 'Various Clients' },
                { title: 'Business Promotion', image: '/assets/images/portfolio/flyer-7.jpg', client: 'Various Clients' },
                { title: 'Marketing Campaign', image: '/assets/images/portfolio/flyer-11.jpg', client: 'Various Clients' },
                { title: 'Community Outreach', image: '/assets/images/portfolio/flyer-12.jpg', client: 'Various Clients' },
              ]].map((poster, i) => (
                <div key={`${poster.title}-${i}`} className="group flex-shrink-0 w-72 md:w-80">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-800 border border-white/10 hover:border-accent/30 transition-colors">
                    <Image
                      src={poster.image}
                      alt={poster.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-semibold text-sm">{poster.title}</p>
                      <p className="text-accent/80 text-xs">{poster.client}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">Ready to become our next success story?</h2>
          <p className="text-white/70 max-w-3xl mx-auto mb-5 text-sm md:text-base">
            Tell us what you need. Whether it's a custom app, a brand identity, a business plan, or full company registration. We'll come back to you within one business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
