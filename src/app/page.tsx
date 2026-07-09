"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRight, ArrowRight, Users, Coins, Wrench,
  Code2, ShieldCheck, FileSearch, CheckCircle2, Quote
} from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero/lobby.jpg"
            alt="Breed Industries"
            fill
            priority
            className="object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 grid-overlay grid-overlay-animated"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-color-bg-deep/70"></div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 blur-3xl rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              className="text-accent font-medium text-sm uppercase tracking-[0.3em] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Community · Capital · Infrastructure
            </motion.p>

            <motion.h2
              className="font-heading font-bold mb-8 leading-[1.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="block text-2xl md:text-4xl lg:text-5xl text-white uppercase">
                Breed Industries builds the
              </span>
              <span className="block text-2xl md:text-4xl lg:text-5xl text-gradient-gold mt-2 uppercase">
                infrastructure serious businesses run on.
              </span>
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              We are not a marketing agency. We are an ecosystem - community, capital, and infrastructure for serious South African business owners.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/network" className="btn btn-primary">
                Join the Network
                <ChevronRight size={16} className="ml-1" />
              </Link>

              <Link href="/services" className="btn btn-outline">
                See What We Build
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 relative bg-color-bg-secondary">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">Why Most Businesses Fail</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              It's almost never the idea.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              South African businesses don't collapse because their products are bad. They collapse
              because the infrastructure underneath them was never properly built. We see the same
              three problems repeat over and over:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Financial Illiteracy',
                description: 'Owners who don\'t know their margins, can\'t read their cash flow, and can\'t present their numbers to a bank or investor.',
              },
              {
                title: 'Accreditation Gaps',
                description: 'CIPC, SARS, B-BBEE, CSD, CIDB - the compliance maze nobody explains. Contracts and funding pass by the unprepared.',
              },
              {
                title: 'No Succession',
                description: 'Businesses die with their founders because nothing is documented, nothing is structured, nothing has been delegated.',
              },
            ].map((problem, i) => (
              <div key={problem.title} className="glass-card p-6">
                <div className="text-accent font-heading text-3xl font-bold mb-3">0{i + 1}</div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">{problem.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{problem.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Breed Industries exists to solve <span className="text-accent font-semibold">all three</span> - through one connected ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* The Ecosystem - three entry points */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">The Ecosystem</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Three pillars. One outcome: <span className="text-accent">a business that lasts.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Network */}
            <Link href="/network" className="group">
              <div className="glass-card p-8 h-full flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:ring-1 group-hover:ring-accent/40">
                <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mb-5">
                  <Users className="w-7 h-7 text-accent" />
                </div>
                <p className="text-accent text-xs uppercase tracking-widest font-bold mb-2">01 · Community</p>
                <h3 className="text-2xl font-heading font-bold text-white mb-3">The Breed Business Network</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-5 flex-1">
                  Monthly retainer. Access to education, peers, compliance support, and the tools that keep a business running.
                  Pay to grow - not to start. Four tiers from R950 to R3,200 per month.
                </p>
                <div className="flex items-center text-accent font-medium text-sm">
                  Explore the Network
                  <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Isivuno */}
            <Link href="/network#isivuno" className="group">
              <div className="glass-card p-8 h-full flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:ring-1 group-hover:ring-accent/40">
                <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mb-5">
                  <Coins className="w-7 h-7 text-accent" />
                </div>
                <p className="text-accent text-xs uppercase tracking-widest font-bold mb-2">02 · Capital</p>
                <h3 className="text-2xl font-heading font-bold text-white mb-3">The Isivuno Fund</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-5 flex-1">
                  Isivuno - isiZulu for harvest. A community-pooled capital fund. Compliant, trained, contributing members
                  apply for funding banks would never approve. 60% community vote decides who gets funded.
                </p>
                <div className="flex items-center text-accent font-medium text-sm">
                  How the Fund Works
                  <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Build */}
            <Link href="/services" className="group">
              <div className="glass-card p-8 h-full flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:ring-1 group-hover:ring-accent/40">
                <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mb-5">
                  <Wrench className="w-7 h-7 text-accent" />
                </div>
                <p className="text-accent text-xs uppercase tracking-widest font-bold mb-2">03 · Infrastructure</p>
                <h3 className="text-2xl font-heading font-bold text-white mb-3">Build Services</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-5 flex-1">
                  When you're ready, we build the systems your business runs on. Web applications, accreditation, tender strategy.
                  Scoped per project. Not packaged. Not commoditised.
                </p>
                <div className="flex items-center text-accent font-medium text-sm">
                  See Build Services
                  <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* The Three Build Pillars (detail) */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">What We Build</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Three categories of <span className="text-accent">operational infrastructure</span>
            </h2>
            <p className="text-white/65 max-w-2xl mx-auto">
              Not brochure websites. Not commodity branding. The actual systems that run a serious business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Code2 className="w-6 h-6 text-accent" />,
                title: 'Web Applications',
                description: 'Custom platforms, admin systems, e-commerce, AI integrations, WhatsApp agents. The internal tools and customer-facing products that make your business operate.',
                items: ['Custom platforms & admin systems', 'E-commerce with multiple payment gateways', 'AI agents & WhatsApp automation', 'Internal operations dashboards'],
                href: '/services#web-applications',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-accent" />,
                title: 'Accreditation & Compliance',
                description: 'The full compliance stack, end to end. We remove every barrier between you and the contracts, grants, and funding your business should be qualifying for.',
                items: ['CIPC, SARS & tax compliance', 'B-BBEE certification', 'CSD & CIDB registration', 'Tender-ready documentation'],
                href: '/services#accreditation',
              },
              {
                icon: <FileSearch className="w-6 h-6 text-accent" />,
                title: 'Tender Strategy',
                description: 'AI-powered tender matching across 26+ SA government sources. We find, prepare, submit, and manage relationships. From R350/month, or fully managed.',
                items: ['Daily scraping of 26+ portals', 'AI scoring on your profile', 'End-to-end bid preparation', 'Site meeting attendance'],
                href: '/tender-services',
              },
            ].map((pillar) => (
              <Link key={pillar.title} href={pillar.href} className="group">
                <div className="glass-card p-6 h-full flex flex-col transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                      {pillar.icon}
                    </div>
                    <h3 className="text-lg font-heading font-bold text-white leading-tight">{pillar.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{pillar.description}</p>
                  <ul className="space-y-1.5 flex-1 mb-4">
                    {pillar.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-white/55">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center text-accent text-sm font-medium pt-2 border-t border-white/10">
                    <span>Scope your project</span>
                    <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Proof of work */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">Proof Of Work</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Systems we've actually shipped
            </h2>
            <p className="text-white/65 max-w-2xl mx-auto">
              We don't sell what we haven't built. Every member sees real, working examples before they engage us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Engage Africa IO',
                tag: 'AI Platform',
                description: 'AI customer engagement platform with WhatsApp integration, visual flow builder, real-time analytics.',
                image: '/assets/images/portfolio/engage-africa-dashboard.png',
                href: '/portfolio#engage-africa',
              },
              {
                title: 'MLK Apparel Store',
                tag: 'E-Commerce',
                description: 'Faith-driven fashion e-commerce with Stripe, Paystack & PayPal checkout, wishlist, social pixels.',
                image: '/assets/images/portfolio/mlk-apparel-hero.png',
                href: '/portfolio#mlk-apparel',
              },
              {
                title: 'HOGI Church App',
                tag: 'Custom Platform',
                description: 'Church management app with live video meetings, member management, event planning, analytics.',
                image: '/assets/images/portfolio/hogi-church-home.png',
                href: '/portfolio#hogi-church',
              },
            ].map((project) => (
              <Link key={project.title} href={project.href} className="group">
                <div className="relative overflow-hidden glass-card h-full transition-all duration-300 group-hover:-translate-y-2">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={640}
                    height={480}
                    className="absolute inset-0 h-full w-full object-cover object-top opacity-25 transition-opacity group-hover:opacity-40"
                  />
                  <div className="relative p-8">
                    <span className="text-xs bg-accent/20 text-accent border border-accent/30 rounded px-2 py-0.5 mb-4 inline-block">{project.tag}</span>
                    <h3 className="text-xl font-heading font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-white/70 mb-6 text-sm">{project.description}</p>
                    <div className="flex items-center text-accent font-medium text-sm">
                      <span>View project</span>
                      <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/portfolio" className="btn btn-outline">
              View All Our Work
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-14 relative bg-color-bg-secondary">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Quote className="w-4 h-4 text-accent" />
              <p className="text-accent text-sm uppercase tracking-widest font-medium">Trusted By</p>
            </div>
            <p className="text-white/50 text-sm">South African businesses already running on Breed infrastructure</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {[
              { name: 'GoBizz', logo: '/assets/images/clients/gobizz-logo.png' },
              { name: 'I-Group', logo: '/assets/images/clients/igroup-logo.png' },
              { name: 'MC Ways', logo: '/assets/images/clients/mcways-logo.jpg' },
              { name: 'NSPIRAXION', logo: '/assets/images/clients/nspiraxion-logo.jpg' },
              { name: 'Isambulo', logo: '/assets/images/clients/isambulo-logo.jpg' },
              { name: 'Ebodweni', logo: '/assets/images/clients/ebodweni-logo.jpg' },
              { name: 'Lance', logo: '/assets/images/clients/lance-logo.jpg' },
              { name: 'Gadali Security', logo: '/assets/images/clients/gadali-logo.jpg' },
              { name: 'Spephelo', logo: '/assets/images/clients/spephelo-logo.jpg' },
            ].map((c) => (
              <div key={c.name} className="glass-card p-3 flex flex-col items-center justify-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity bg-white/10">
                <Image src={c.logo} alt={c.name} width={80} height={36} className="object-contain max-h-9 w-auto" />
                <span className="text-white/40 text-[10px] text-center leading-tight">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card-accent p-8 md:p-14 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-5">
                You don't need another agency.
                <span className="block text-accent mt-2">You need infrastructure.</span>
              </h2>
              <p className="text-white/75 text-lg mb-8 max-w-2xl mx-auto">
                Join the network. Get the tools, the training, the community, and the compliance support.
                When you're ready to build - we build with you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/network" className="btn btn-primary">
                  Join the Network
                  <ChevronRight size={16} className="ml-1" />
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Scope a Project
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
