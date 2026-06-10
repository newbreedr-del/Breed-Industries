"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Zap, Rocket, Shield, CheckCircle2, Code2, Palette, FileText, Users, Sprout, Award, TrendingUp, Search } from 'lucide-react';
import { FreshStartPopup } from '@/components/ui/FreshStartPopup';

export default function Home() {
  const featuredServices = [
    {
      id: 'business-setup',
      title: 'Business Setup',
      description:
        'Complete registration and compliance services to establish your business on solid legal ground.',
      href: '/services#business-setup',
      icon: <Shield className="w-6 h-6 text-accent" />,
      image: '/assets/images/services/business-setup.jpg',
    },
    {
      id: 'branding',
      title: 'Branding & Identity',
      description:
        'Strategic brand development that positions your business for recognition and trust in your market.',
      href: '/services#branding',
      icon: <Rocket className="w-6 h-6 text-accent" />,
      image: '/assets/images/services/branding.jpg',
    },
    {
      id: 'digital',
      title: 'Digital Solutions',
      description:
        'Custom websites, apps, and digital marketing strategies that drive growth and engagement.',
      href: '/services#digital',
      icon: <Zap className="w-6 h-6 text-accent" />,
      image: '/assets/images/services/digital.jpg',
    },
  ];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero/lobby.jpg"
            alt="Breed Industries lobby"
            fill
            priority
            className="object-cover opacity-65"
          />
        </div>
        <div className="absolute inset-0 grid-overlay grid-overlay-animated"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-color-bg-deep/60"></div>
        
        {/* Accent Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 blur-3xl rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p 
                className="text-accent font-medium text-sm uppercase tracking-wider mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Premium Growth Agency · Durban
              </motion.p>
              
              <motion.h1 
                className="text-4xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                From <span className="text-gradient-gold">CIPC to Digital Empire</span> — We Launch South African Businesses End to End
              </motion.h1>
              
              <motion.p 
                className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Registration, compliance, branding, websites, and tenders — all under one roof. 
                Built for ambitious South African entrepreneurs who refuse to stay small.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link 
                  href="/services"
                  className="btn btn-primary"
                >
                  Explore Services
                  <ChevronRight size={16} className="ml-1" />
                </Link>
                
                <Link 
                  href="/build-package"
                  className="btn btn-outline"
                >
                  Build Your Package
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* What We Do: Clarity Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              We Build Businesses: <span className="text-accent">From Idea to Industry Leader</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Whether you need to register your company, create your brand, write your business plan, or build a custom digital product, we do it all under one roof. Here's exactly how we help:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6 text-accent" />,
                title: 'Business Setup & Compliance',
                description: 'Company registration (CIPC), SARS returns, tax clearance, B-BBEE certificates, CSD registration, and business bank accounts.',
                items: ['CIPC Company Registration', 'SARS & Tax Clearance', 'B-BBEE Certification', 'CSD & Bank Account Setup'],
                href: '/services#business-setup',
              },
              {
                icon: <Palette className="w-6 h-6 text-accent" />,
                title: 'Branding & Identity',
                description: 'Professional logos, full brand identity systems, business cards, letterheads, flyers, and marketing materials.',
                items: ['Logo Design', 'Full Brand Identity', 'Business Cards & Letterheads', 'Flyers & Marketing Material'],
                href: '/services#branding',
              },
              {
                icon: <FileText className="w-6 h-6 text-accent" />,
                title: 'Business Plans & Profiles',
                description: 'Investor-ready business plans, company profiles, financial projections, and funding proposal documents.',
                items: ['Business Plan Writing', 'Financial Projections', 'Company Profiles', 'Funding Proposals'],
                href: '/services#profile',
              },
              {
                icon: <Code2 className="w-6 h-6 text-accent" />,
                title: 'Digital Solutions',
                description: 'Custom websites, mobile apps, e-commerce stores, AI platforms, and full digital transformation for your business.',
                items: ['Websites & Web Apps', 'Mobile Applications', 'E-Commerce Stores', 'AI & Custom Platforms'],
                href: '/services#digital',
              },
              {
                icon: <Award className="w-6 h-6 text-accent" />,
                title: 'Tender Services',
                description: 'Get tender-ready and tap into government procurement. We search, match, apply, and attend meetings on your behalf.',
                items: ['Tender Registration', 'Daily Tender Watch', 'Application Submissions', 'Site Meeting Attendance'],
                href: '/tender-services',
                badge: 'New',
              },
            ].map((service: any) => (
              <Link key={service.title} href={service.href} className="group">
                <div className={`glass-card p-5 h-[280px] flex flex-col gap-3 transition-all duration-300 group-hover:-translate-y-2 relative ${service.badge ? 'ring-1 ring-accent/40' : ''}`}>
                  {service.badge && (
                    <span className="absolute -top-3 left-4 bg-accent text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {service.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                      {service.icon}
                    </div>
                    <h3 className="text-base font-heading font-bold text-white leading-tight">{service.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-snug line-clamp-2">{service.description}</p>
                  <ul className="flex-1 space-y-1">
                    {service.items.slice(0, 3).map((item: string) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-white/50">
                        <CheckCircle2 className="w-3 h-3 text-accent flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center text-accent text-sm font-medium pt-1">
                    <span>{service.badge ? 'Explore now' : 'See pricing'}</span>
                    <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Preview */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">Our Work</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Real Products We've Built for <span className="text-accent">Real Clients</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We don't just consult, we build. From AI platforms to fashion stores, here are some of the digital products we've shipped.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Engage Africa IO',
                tag: 'AI Platform',
                description: 'AI-powered customer engagement platform with WhatsApp integration, visual flow builder, and real-time analytics.',
                image: '/assets/images/portfolio/engage-africa-dashboard.png',
                href: '/portfolio#engage-africa',
              },
              {
                title: 'MLK Apparel Store',
                tag: 'E-Commerce',
                description: 'Full faith-driven fashion e-commerce store with Stripe, Paystack & PayPal checkout, wishlist, and social media pixel tracking.',
                image: '/assets/images/portfolio/mlk-apparel-hero.png',
                href: '/portfolio#mlk-apparel',
              },
              {
                title: 'HOGI Church App',
                tag: 'Custom Platform',
                description: 'Church management app with live video meetings, member management, event planning, and analytics for House of Grace International.',
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

      {/* Social Proof / Client Logos */}
      <section className="py-14 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-4 h-4 text-accent" />
              <p className="text-accent text-sm uppercase tracking-widest font-medium">Trusted By</p>
            </div>
            <p className="text-white/50 text-sm">South African businesses we've worked with</p>
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

      {/* ── Tender Services Banner ─────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay" />
        {/* Warm glow behind the card */}
        <div className="absolute left-1/3 top-1/4 w-96 h-96 bg-accent/8 blur-3xl rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="rounded-2xl border border-accent/25 overflow-hidden"
               style={{ background: 'linear-gradient(135deg, rgba(200,169,110,0.07) 0%, rgba(0,0,0,0) 60%)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Left - copy */}
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <span className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-5">
                  <Award size={14} /> New Service - Now Live
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 leading-tight">
                  Win Government <br className="hidden md:block" />
                  <span className="text-gradient-gold">Tenders &amp; Contracts</span>
                </h2>
                <p className="text-white/65 text-base mb-8 leading-relaxed max-w-md">
                  We built a dedicated tender intelligence engine that scrapes South African procurement portals daily,
                  matches opportunities to your business profile, and notifies you instantly.
                  From R350/month, or let us handle the whole application for you.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/tender-services" className="btn btn-primary">
                    See Tender Packages
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                  <a href="https://tenders.thebreed.co.za" target="_blank" rel="noopener noreferrer"
                     className="btn btn-outline">
                    Launch Tender Portal
                    <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>

              {/* Right - feature tiles */}
              <div className="p-10 md:p-14 grid grid-cols-2 gap-4 content-center border-t lg:border-t-0 lg:border-l border-white/8">
                {[
                  { icon: Search,      title: 'Daily Scraping',      desc: 'eTenders + provincial portals scraped twice daily' },
                  { icon: TrendingUp,  title: 'Smart Matching',       desc: 'AI scoring against your CIDB grade, BEE level & categories' },
                  { icon: FileText,    title: 'We Apply For You',     desc: 'Full document compilation and submission on your behalf' },
                  { icon: Award,       title: 'Site Meetings',        desc: 'We attend compulsory briefing sessions where required' },
                ].map(f => (
                  <div key={f.title} className="flex flex-col gap-2 p-4 rounded-xl bg-white/4 border border-white/6">
                    <f.icon className="text-accent" size={20} />
                    <p className="text-white text-sm font-bold">{f.title}</p>
                    <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card-accent p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                Ready to Build Your Business?
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Whether you're starting from scratch or scaling up, book a strategy call and we'll map out exactly what you need and how much it'll cost.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://wa.me/27604964105?text=Hi%20Breed%20Industries!%20I'd%20like%20to%20book%20a%20strategy%20call."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Book Strategy Call
                </a>
                <Link href="/portfolio" className="btn btn-outline">
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Fresh Start - Minimal Callout */}
      <section className="py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,159,0,0.04) 0%, transparent 60%)' }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div
            className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-7"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,159,0,0.2)' }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(255,159,0,0.12)' }}
              >
                <Sprout size={18} style={{ color: '#FF9F00' }} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white font-bold text-base mb-1">
                  Not ready for a full package yet?
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  <span style={{ color: '#FF9F00' }} className="font-semibold">Fresh Start</span> helps entrepreneurs access government and private funding first, then we build together.
                </p>
              </div>
            </div>
            <Link
              href="/fresh-start"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ background: '#FF9F00', color: '#0B1118' }}
            >
              Learn about Fresh Start
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Fresh Start Popup - slides in from bottom-left on scroll */}
      <FreshStartPopup />
    </>
  );
}
