"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, Filter, ExternalLink } from 'lucide-react';

const portfolioProjects = [
  {
    id: 'stellar',
    title: 'Breed Industries Production',
    category: 'Video & Media',
    summary: 'Brand video ad emphasising our full production capability — from creative direction to final delivery.',
    image: '/assets/images/portfolio/enterprise-success.jpg',
  },
  {
    id: 'att-digital',
    title: 'AT&T Digital Rollout',
    category: 'Digital Strategy',
    summary: 'End-to-end launch campaign with progressive web experience and analytics stack.',
    image: '/assets/images/portfolio/digital-experience.jpg',
  },
  {
    id: 'launchpad',
    title: 'LaunchPad Branding System',
    category: 'Brand Identity',
    summary: 'Complete identity system, investor deck, and multi-touchpoint collateral.',
    image: '/assets/images/portfolio/branding-suite.jpg',
  },
  {
    id: 'urbanbank',
    title: 'UrbanBank Mobile',
    category: 'App Development',
    summary: 'Secure mobile banking MVP with onboarding flows and customer support tooling.',
    image: '/assets/images/portfolio/client-showcase.jpg',
  },
  {
    id: 'heritage',
    title: 'Heritage Restoration Guild',
    category: 'Storytelling',
    summary: 'Immersive microsite with archival content and donation infrastructure.',
    image: '/assets/images/portfolio/case-study-grid.jpg',
  },
  {
    id: 'cvs-health',
    title: 'CVS Health Compliance Portal',
    category: 'Web Portal',
    summary: 'Enterprise-grade compliance hub with automated reporting and contract workflows.',
    image: '/assets/images/portfolio/enterprise-success.jpg',
  },
];

const partnerLogos = [
  { id: 'partner-1', name: 'Ebodweni', logo: '/assets/images/clients/Ebodweni-01.png' },
  { id: 'partner-2', name: 'I Group', logo: '/assets/images/clients/I Group Logo White-01-01.png' },
  { id: 'partner-3', name: 'Isambulo', logo: '/assets/images/clients/Isambulo Logo-01.png' },
  { id: 'partner-4', name: 'MC Ways', logo: '/assets/images/clients/MC Ways New-03.png' },
  { id: 'partner-5', name: 'NSPIRAXION', logo: '/assets/images/clients/NSPIRAXION IMPULSE PROJECTS LOGO [Recovered]-01.png' },
  { id: 'partner-6', name: 'GoBizz', logo: '/assets/images/clients/gobizz-logo White-01.png' },
  { id: 'partner-7', name: 'Ndlunkulu', logo: '/assets/images/clients/Ndlunkulu White text-01.png' },
  { id: 'partner-8', name: 'Pinetown Incorporated', logo: '/assets/images/clients/Pinetown Incorporated-01.png' },
];

export default function PortfolioPage() {
  return (
    <>
      <Header />

      <PageHero
        title="Connecting Clients, Building Empires"
        subtitle="Portfolio"
        description="A curated look at the compliance builds, brand systems, and digital products engineered for Breed Industries partners across Africa and beyond."
        breadcrumbs={[{ label: 'Portfolio', href: '/portfolio' }]}
      >
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn btn-outline inline-flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter Categories
          </button>
          <Link href="/lab" className="btn btn-primary">
            Start Your Project
          </Link>
        </div>
      </PageHero>

      <section className="py-16 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partnerLogos.map((partner) => (
              <div key={partner.id} className="glass-card p-6 flex items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={160}
                  height={80}
                  className="opacity-80"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white">Bento Gallery</h2>
              <p className="text-white/60 mt-2 max-w-xl">
                Modular case studies structured in a bento grid so procurement teams and founders can quickly assess scope, deliverables, and results.
              </p>
            </div>
            <button className="btn btn-outline inline-flex items-center gap-2">
              <Grid className="w-4 h-4" /> Toggle Layout
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {portfolioProjects.map((project, index) => (
              <div
                key={project.id}
                className={`glass-card overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${
                  index % 5 === 0 ? 'xl:col-span-2' : ''
                }`}
              >
                <div className="relative h-48 bg-white/5">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover mix-blend-screen opacity-80"
                  />
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-accent">{project.category}</span>
                  <h3 className="text-xl font-heading font-semibold text-white">{project.title}</h3>
                  <p className="text-white/60 text-sm">{project.summary}</p>
                  <Link
                    href={`/portfolio/${project.id}`}
                    className="inline-flex items-center text-accent text-sm font-medium mt-2"
                  >
                    View Case Study <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Ready to become our next success story?</h2>
          <p className="text-white/70 max-w-3xl mx-auto mb-8">
            Share your current challenge, timeline, and desired impact. Our team will respond within one business day with tailored next steps and indicative pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary">
              Talk to Our Team
            </Link>
            <Link href="/lab" className="btn btn-outline">
              Build Custom Package
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
