"use client";

import React, { use } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, Clock, Users, Target, Layers, BarChart3, Globe, Palette, Shield, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import { notFound } from 'next/navigation';

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  heroDescription: string;
  heroImage: string;
  client: string;
  industry: string;
  duration: string;
  year: string;
  challenge: string;
  approach: string;
  solution: string;
  deliverables: { title: string; description: string }[];
  results: { metric: string; value: string; description: string }[];
  testimonial?: { quote: string; author: string; role: string };
  techStack?: string[];
}

const caseStudies: Record<string, CaseStudy> = {
  'cvs-health': {
    id: 'cvs-health',
    title: 'CVS Health Compliance Portal',
    subtitle: 'Web Portal',
    category: 'Web Portal',
    heroDescription: 'A fully integrated compliance management hub built for a healthcare logistics partner, automating reporting workflows and contract lifecycle management.',
    heroImage: '/assets/images/portfolio/enterprise-success.jpg',
    client: 'CVS Health Logistics (SA Division)',
    industry: 'Healthcare & Logistics',
    duration: '8 Weeks',
    year: '2024',
    challenge: 'The client operated across multiple provinces with fragmented compliance documentation. Manual tracking of COID certificates, BEE scorecards, and supplier contracts led to missed deadlines, audit failures, and lost tender opportunities. Their existing spreadsheet system could not scale with their growing fleet of 40+ vehicles and 120 employees.',
    approach: 'We conducted a 2-day discovery workshop to map every compliance touchpoint. From there, we designed a centralised portal with role-based access for operations managers, compliance officers, and executive leadership. The system was built iteratively with weekly demos to ensure alignment.',
    solution: 'A custom-built Next.js web portal with automated document expiry alerts, a contract approval pipeline, real-time compliance dashboards, and integrated PDF generation for audit-ready reports. The portal connects to their existing accounting software via API for seamless invoice reconciliation.',
    deliverables: [
      { title: 'Compliance Dashboard', description: 'Real-time overview of all active certificates, expiry dates, and renewal statuses across all branches.' },
      { title: 'Contract Workflow Engine', description: 'Multi-step approval pipeline with digital signatures, version control, and audit trail logging.' },
      { title: 'Automated Alerts System', description: 'Email and SMS notifications triggered 60, 30, and 7 days before document expiry.' },
      { title: 'Audit Report Generator', description: 'One-click PDF export of compliance status for BEE verification, COID, and SARS submissions.' },
    ],
    results: [
      { metric: 'Compliance Rate', value: '98%', description: 'Up from 72% before the portal was implemented.' },
      { metric: 'Time Saved', value: '15hrs/week', description: 'Eliminated manual tracking and document chasing.' },
      { metric: 'Audit Pass Rate', value: '100%', description: 'Zero findings in the first external audit post-launch.' },
      { metric: 'Contract Turnaround', value: '3 Days', description: 'Reduced from an average of 12 business days.' },
    ],
    testimonial: {
      quote: 'Breed Industries transformed our compliance operations. What used to take our team days now happens automatically. We passed our first audit with zero findings — that alone justified the investment.',
      author: 'Thabo Mkhize',
      role: 'Operations Director, CVS Health Logistics SA',
    },
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'SendGrid', 'Vercel', 'Tailwind CSS'],
  },
  'att-digital': {
    id: 'att-digital',
    title: 'AT&T Digital Rollout',
    subtitle: 'Digital Strategy',
    category: 'Digital Strategy',
    heroDescription: 'An end-to-end digital launch campaign for a telecommunications reseller, combining progressive web experiences with a data-driven analytics stack.',
    heroImage: '/assets/images/portfolio/digital-experience.jpg',
    client: 'AT&T Reseller Network (KZN)',
    industry: 'Telecommunications',
    duration: '6 Weeks',
    year: '2024',
    challenge: 'The client was launching a new fibre and mobile bundle product across KwaZulu-Natal but had zero digital presence. They needed a complete go-to-market digital strategy — from landing pages to social media funnels — within 6 weeks to coincide with their physical launch event.',
    approach: 'We assembled a cross-functional team covering UX design, copywriting, paid media, and analytics. A rapid sprint methodology was used: Week 1 for strategy and wireframes, Weeks 2-3 for design and development, Weeks 4-5 for content creation and ad setup, and Week 6 for QA, launch, and optimisation.',
    solution: 'A progressive web app (PWA) serving as the primary landing experience, integrated with Meta and Google ad campaigns. The PWA featured a coverage checker, plan comparison tool, and instant callback request system. All touchpoints fed into a unified analytics dashboard for real-time campaign performance monitoring.',
    deliverables: [
      { title: 'Progressive Web App', description: 'Mobile-first PWA with coverage checker, plan comparisons, and lead capture forms.' },
      { title: 'Paid Media Campaigns', description: 'Meta Ads and Google Ads campaigns with A/B tested creatives targeting KZN demographics.' },
      { title: 'Analytics Dashboard', description: 'Custom Google Analytics 4 + Looker Studio dashboard tracking leads, conversions, and ROAS.' },
      { title: 'Social Media Launch Kit', description: '30-day content calendar with designed posts, stories, and video snippets for launch.' },
    ],
    results: [
      { metric: 'Leads Generated', value: '2,400+', description: 'In the first 30 days post-launch across all channels.' },
      { metric: 'Cost Per Lead', value: 'R18', description: 'Well below the industry average of R45 for telecom.' },
      { metric: 'Page Load Speed', value: '1.2s', description: 'PWA achieved near-instant load times on 3G networks.' },
      { metric: 'Conversion Rate', value: '8.3%', description: 'Landing page conversion rate, 3x industry benchmark.' },
    ],
    testimonial: {
      quote: 'We went from nothing to 2,400 leads in a month. Breed Industries didn\'t just build us a website — they built us a revenue engine.',
      author: 'Sipho Dlamini',
      role: 'Regional Manager, AT&T Reseller Network KZN',
    },
    techStack: ['Next.js PWA', 'Tailwind CSS', 'Google Analytics 4', 'Meta Ads', 'Google Ads', 'Looker Studio'],
  },
  'launchpad': {
    id: 'launchpad',
    title: 'LaunchPad Branding System',
    subtitle: 'Brand Identity',
    category: 'Brand Identity',
    heroDescription: 'A complete brand identity system for a startup accelerator, including investor-ready pitch decks, multi-touchpoint collateral, and a cohesive visual language.',
    heroImage: '/assets/images/portfolio/branding-suite.jpg',
    client: 'LaunchPad Accelerator',
    industry: 'Startup & Venture Capital',
    duration: '4 Weeks',
    year: '2025',
    challenge: 'LaunchPad was a new startup accelerator programme targeting township entrepreneurs in eThekwini. They needed a brand that communicated credibility to corporate sponsors while remaining approachable and aspirational for emerging founders. Their existing identity was a basic Canva logo with no brand guidelines.',
    approach: 'We started with a brand strategy workshop to define their positioning, voice, and visual direction. Three distinct creative routes were presented, with the winning direction refined through two rounds of stakeholder feedback. The full brand system was then rolled out across all touchpoints simultaneously.',
    solution: 'A bold, modern brand identity built around the concept of "Launch Velocity" — using dynamic angular shapes and a vibrant colour palette that bridges corporate professionalism with entrepreneurial energy. The system included everything from business cards to a 40-slide investor deck.',
    deliverables: [
      { title: 'Brand Identity System', description: 'Logo suite (primary, secondary, icon), colour palette, typography system, and comprehensive brand guidelines.' },
      { title: 'Investor Pitch Deck', description: '40-slide presentation template with data visualisation components, designed for both screen and print.' },
      { title: 'Stationery Suite', description: 'Business cards, letterhead, email signatures, and branded document templates.' },
      { title: 'Environmental Design', description: 'Co-working space signage, banner designs, and event backdrop templates.' },
    ],
    results: [
      { metric: 'Sponsor Interest', value: '340%', description: 'Increase in corporate sponsor enquiries after rebrand.' },
      { metric: 'Applications', value: '500+', description: 'Founder applications received in the first cohort intake.' },
      { metric: 'Brand Recall', value: '89%', description: 'Unaided brand recall among target demographic in survey.' },
      { metric: 'Media Coverage', value: '12 Features', description: 'Press mentions within 60 days of brand launch.' },
    ],
    testimonial: {
      quote: 'The brand Breed Industries created for us opened doors we didn\'t even know existed. Corporate sponsors started approaching us. That\'s the power of a professional identity.',
      author: 'Nomvula Khumalo',
      role: 'Founder & CEO, LaunchPad Accelerator',
    },
    techStack: ['Adobe Illustrator', 'Adobe InDesign', 'Figma', 'After Effects'],
  },
  'urbanbank': {
    id: 'urbanbank',
    title: 'UrbanBank Mobile',
    subtitle: 'App Development',
    category: 'App Development',
    heroDescription: 'A secure mobile banking MVP with streamlined onboarding flows, biometric authentication, and integrated customer support tooling for an emerging fintech.',
    heroImage: '/assets/images/portfolio/client-showcase.jpg',
    client: 'UrbanBank Financial Services',
    industry: 'Fintech & Banking',
    duration: '12 Weeks',
    year: '2024',
    challenge: 'UrbanBank needed to launch a mobile banking product targeting the unbanked and underbanked population in South Africa. The app had to work reliably on low-end Android devices, support USSD fallback for areas with poor connectivity, and meet all SARB regulatory requirements for a Section 12 licence application.',
    approach: 'We followed a lean MVP methodology — identifying the 8 core features needed for launch and deferring nice-to-haves to Phase 2. Weekly compliance reviews with their legal team ensured every feature met regulatory standards. Usability testing was conducted with 50 target users in Umlazi and KwaMashu.',
    solution: 'A React Native mobile app with a Node.js backend, featuring biometric login, instant peer-to-peer transfers, airtime purchases, and a built-in savings goal tracker. The app was optimised for devices with as little as 1GB RAM and included offline transaction queuing for areas with intermittent connectivity.',
    deliverables: [
      { title: 'Mobile App (iOS & Android)', description: 'React Native app with biometric auth, P2P transfers, airtime, and savings goals.' },
      { title: 'Admin Dashboard', description: 'Internal operations portal for KYC verification, transaction monitoring, and customer support.' },
      { title: 'API Gateway', description: 'Secure REST API layer connecting the app to banking infrastructure with rate limiting and encryption.' },
      { title: 'Compliance Documentation', description: 'Technical architecture documents and security audit reports for SARB licence application.' },
    ],
    results: [
      { metric: 'Beta Users', value: '3,200', description: 'Signed up within the first 2 weeks of soft launch.' },
      { metric: 'App Rating', value: '4.6/5', description: 'Average rating on Google Play Store after 500+ reviews.' },
      { metric: 'Transaction Success', value: '99.7%', description: 'Transaction completion rate across all network conditions.' },
      { metric: 'Onboarding Time', value: '< 3 min', description: 'Average time from download to first transaction.' },
    ],
    testimonial: {
      quote: 'Breed Industries understood that we weren\'t just building an app — we were building financial access. They delivered a product that works for real people in real conditions.',
      author: 'Andile Ngcobo',
      role: 'CTO, UrbanBank Financial Services',
    },
    techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Firebase'],
  },
  'heritage': {
    id: 'heritage',
    title: 'Heritage Restoration Guild',
    subtitle: 'Storytelling',
    category: 'Storytelling',
    heroDescription: 'An immersive digital microsite preserving South African heritage stories through archival content, interactive timelines, and a donation infrastructure for restoration projects.',
    heroImage: '/assets/images/portfolio/case-study-grid.jpg',
    client: 'Heritage Restoration Guild of KZN',
    industry: 'Non-Profit & Cultural Heritage',
    duration: '5 Weeks',
    year: '2025',
    challenge: 'The Heritage Restoration Guild had decades of archival photographs, oral histories, and restoration project documentation locked in physical filing cabinets. They needed a digital platform to preserve these stories, attract donors, and coordinate volunteer restoration efforts across 15 heritage sites in KwaZulu-Natal.',
    approach: 'We partnered with local historians and the Guild\'s archival team to digitise and curate content. The design approach prioritised storytelling — using full-bleed imagery, ambient audio, and scroll-triggered animations to create an emotional connection with visitors. The donation system was designed to be frictionless with multiple payment options.',
    solution: 'A visually stunning microsite built with Next.js featuring interactive heritage timelines, 360-degree virtual tours of restoration sites, an oral history audio player, and a Stripe-powered donation system with project-specific giving options. The site also includes a volunteer coordination portal.',
    deliverables: [
      { title: 'Heritage Microsite', description: 'Immersive storytelling platform with parallax scrolling, ambient audio, and interactive timelines.' },
      { title: 'Digital Archive', description: 'Searchable database of 2,000+ photographs, documents, and oral history recordings.' },
      { title: 'Donation Platform', description: 'Stripe-integrated giving system with project-specific campaigns, recurring donations, and tax certificates.' },
      { title: 'Volunteer Portal', description: 'Event calendar, skill-matching system, and project sign-up for restoration volunteers.' },
    ],
    results: [
      { metric: 'Donations', value: 'R180K', description: 'Raised in the first 90 days through the online platform.' },
      { metric: 'Archive Views', value: '45,000+', description: 'Unique page views of archival content in the first quarter.' },
      { metric: 'Volunteers', value: '280', description: 'New volunteers registered through the coordination portal.' },
      { metric: 'Media Features', value: '8', description: 'National media features including SABC and Daily Maverick.' },
    ],
    testimonial: {
      quote: 'Our stories were disappearing. Breed Industries gave them a permanent digital home. The donations that followed proved that people care — they just needed a way to connect.',
      author: 'Dr. Zanele Mthembu',
      role: 'Director, Heritage Restoration Guild of KZN',
    },
    techStack: ['Next.js', 'Three.js', 'Stripe', 'Cloudinary', 'Tailwind CSS', 'Vercel'],
  },
};

const categoryIcons: Record<string, any> = {
  'Web Portal': Globe,
  'Digital Strategy': BarChart3,
  'Brand Identity': Palette,
  'App Development': Layers,
  'Storytelling': Film,
  'Video & Media': Film,
};

export default function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const study = caseStudies[id];

  if (!study) {
    notFound();
  }

  const CategoryIcon = categoryIcons[study.category] || Target;

  return (
    <>
      <Header />

      <PageHero
        title={study.title}
        subtitle={study.subtitle}
        description={study.heroDescription}
        breadcrumbs={[
          { label: 'Portfolio', href: '/portfolio' },
          { label: study.title, href: `/portfolio/${study.id}` },
        ]}
      >
        <Link href="/portfolio" className="btn btn-outline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
      </PageHero>

      {/* Project Overview Bar */}
      <section className="py-8 bg-color-bg-secondary border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Client</p>
              <p className="text-white font-medium text-sm">{study.client}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Industry</p>
              <p className="text-white font-medium text-sm">{study.industry}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Duration</p>
              <p className="text-white font-medium text-sm">{study.duration}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">Year</p>
              <p className="text-white font-medium text-sm">{study.year}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-64 md:h-96 rounded-2xl overflow-hidden glass-card"
          >
            <Image src={study.heroImage} alt={study.title} fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-color-bg-deep/80 to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <CategoryIcon className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent font-medium">{study.category}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Challenge / Approach / Solution */}
      <section className="py-16 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">The Challenge</p>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">What they were facing</h2>
              <p className="text-white/70 leading-relaxed">{study.challenge}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">Our Approach</p>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">How we tackled it</h2>
              <p className="text-white/70 leading-relaxed">{study.approach}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">The Solution</p>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">What we delivered</h2>
              <p className="text-white/70 leading-relaxed">{study.solution}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="py-16 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">Deliverables</p>
              <h2 className="text-3xl font-heading font-bold text-white">Key Outputs</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {study.deliverables.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 flex gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-white font-heading font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">Impact</p>
              <h2 className="text-3xl font-heading font-bold text-white">Measurable Results</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {study.results.map((result, index) => (
                <motion.div
                  key={result.metric}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 text-center"
                >
                  <p className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">{result.value}</p>
                  <p className="text-white font-medium text-sm mb-1">{result.metric}</p>
                  <p className="text-white/50 text-xs">{result.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {study.testimonial && (
        <section className="py-16 bg-color-bg-secondary relative">
          <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-accent text-5xl font-heading mb-6">&ldquo;</div>
                <blockquote className="text-white/90 text-lg md:text-xl leading-relaxed mb-6 italic">
                  {study.testimonial.quote}
                </blockquote>
                <div>
                  <p className="text-white font-heading font-semibold">{study.testimonial.author}</p>
                  <p className="text-white/50 text-sm">{study.testimonial.role}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {study.techStack && (
        <section className="py-12 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4 text-center">Technology Stack</p>
              <div className="flex flex-wrap justify-center gap-3">
                {study.techStack.map((tech) => (
                  <span key={tech} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-6">Want results like these?</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Every project starts with a conversation. Tell us your challenge and we&apos;ll show you what&apos;s possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary">Talk to Our Team</Link>
            <Link href="/lab" className="btn btn-outline">Build Custom Package</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
