"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Zap, Rocket, Shield, CheckCircle2, Code2, Palette, FileText, Users } from 'lucide-react';

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
            className="object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 grid-overlay grid-overlay-animated"></div>
        <div className="absolute inset-0 bg-color-bg-deep/50"></div>
        
        {/* Accent Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 blur-3xl rounded-full"></div>
        </div>
        
        {/* Floating Tech Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="hidden sm:block absolute top-[12%] left-[4%] md:left-[6%] text-accent/20"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Shield size={60} />
          </motion.div>
          
          <motion.div 
            className="hidden sm:block absolute bottom-[10%] right-[4%] md:right-[6%] text-accent/20"
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Rocket size={80} />
          </motion.div>
          
          <motion.div 
            className="hidden sm:block absolute top-[35%] left-[75%] md:left-[78%] text-accent/20"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap size={70} />
          </motion.div>
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
                <span className="text-gradient-gold">Creative & Innovative</span> Ideas for Your Business
              </motion.h1>
              
              <motion.p 
                className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                From registration to unstoppable branding & tech – we get you seen, trusted, and profitable.
                Work with the team built for ambitious South African entrepreneurs.
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
      
      {/* What We Do — Clarity Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              We Build Businesses — <span className="text-accent">From Idea to Empire</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Whether you need to register your company, create your brand, write your business plan, or build a custom digital product — we do it all under one roof. Here&apos;s exactly how we help:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
            ].map((service) => (
              <Link key={service.title} href={service.href} className="group">
                <div className="glass-card p-7 h-full flex flex-col gap-4 transition-all duration-300 group-hover:-translate-y-2">
                  <div className="w-11 h-11 rounded-full bg-accent/15 flex items-center justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-heading font-bold text-white">{service.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
                  <ul className="mt-auto space-y-1.5">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-white/50">
                        <CheckCircle2 className="w-3 h-3 text-accent flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center text-accent text-sm font-medium pt-2">
                    <span>See pricing</span>
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
              Real Products We&apos;ve Built for <span className="text-accent">Real Clients</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We don&apos;t just consult — we build. From AI platforms to fashion stores, here are some of the digital products we&apos;ve shipped.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Engage Africa IO',
                tag: 'AI Platform',
                description: 'AI-powered customer engagement platform with WhatsApp integration, visual flow builder, and real-time analytics.',
                image: '/assets/images/portfolio/digital-experience.jpg',
                href: '/portfolio#engage-africa',
              },
              {
                title: 'MLK Apparel Store',
                tag: 'E-Commerce',
                description: 'Full fashion e-commerce store with Stripe, Paystack & PayPal checkout, wishlist, and social media pixel tracking.',
                image: '/assets/images/portfolio/client-showcase.jpg',
                href: '/portfolio#mlk-apparel',
              },
              {
                title: 'HOHI Church App',
                tag: 'Custom Platform',
                description: 'Church management app with live service streaming, member management, giving tracking, and attendance.',
                image: '/assets/images/portfolio/case-study-grid.jpg',
                href: '/portfolio#hohi-church',
              },
            ].map((project) => (
              <Link key={project.title} href={project.href} className="group">
                <div className="relative overflow-hidden glass-card h-full transition-all duration-300 group-hover:-translate-y-2">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={640}
                    height={480}
                    className="absolute inset-0 h-full w-full object-cover opacity-20 transition-opacity group-hover:opacity-30"
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
            <p className="text-white/50 text-sm">South African businesses we&apos;ve worked with</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {[
              { name: 'GoBizz', logo: '/assets/images/clients/gobizz-logo White-01.png' },
              { name: 'Pinetown Inc', logo: '/assets/images/clients/Pinetown Incorporated-01.png' },
              { name: 'MC Ways', logo: '/assets/images/clients/MC Ways New-03.png' },
              { name: 'I-Group', logo: '/assets/images/clients/I Group Logo White-01-01.png' },
              { name: 'NSPIRAXION', logo: '/assets/images/clients/NSPIRAXION IMPULSE PROJECTS LOGO [Recovered]-01.png' },
              { name: 'Ndlunkulu', logo: '/assets/images/clients/Ndlunkulu White text-01.png' },
              { name: 'Isambulo', logo: '/assets/images/clients/Isambulo Logo-01.png' },
              { name: 'Ebodweni', logo: '/assets/images/clients/Ebodweni-01.png' },
            ].map((c) => (
              <div key={c.name} className="glass-card p-4 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                <Image src={c.logo} alt={c.name} width={100} height={44} className="object-contain max-h-10" />
              </div>
            ))}
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
                Ready to Build Your Empire?
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Whether you&apos;re starting from scratch or scaling up — book a strategy call and we&apos;ll map out exactly what you need and how much it&apos;ll cost.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact" className="btn btn-primary">
                  Book Strategy Call
                </Link>
                <Link href="/portfolio" className="btn btn-outline">
                  View Our Work
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
