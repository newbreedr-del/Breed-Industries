import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { BOOKING_URL } from '@/lib/booking';
import {
  Shield, Briefcase, Layers,
  Check, ChevronRight, ArrowRight, TrendingUp, Bot,
  FileText, GraduationCap
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Business Services | CIPC Registration, Branding, Websites | Breed Industries',
  description: 'Professional business services in South Africa: CIPC registration from R550, logo design from R1500, website development from R5000, business plans, and compliance. Serving Durban and nationwide.',
  keywords: ['CIPC registration', 'company registration South Africa', 'business branding', 'logo design Durban', 'website development', 'business plan writing', 'SARS tax registration', 'B-BBEE certificate'],
  alternates: { canonical: 'https://thebreed.co.za/services' },
  openGraph: {
    title: 'Business Services - Breed Industries',
    description: 'Complete business launch packages from R2,500. Registration, branding, websites, and compliance.',
    url: 'https://thebreed.co.za/services',
    images: [{ url: '/assets/images/services-og.jpg', width: 1200, height: 630 }],
  },
};

// Service categories data
const serviceCategories = [
  {
    id: 'business-setup',
    title: 'Business Setup & Compliance',
    icon: <Shield className="w-8 h-8" />,
    description: 'Complete registration and compliance services to establish your business on solid legal ground.',
    services: [
      { name: 'Company Registration (CIPC)', price: 'R550' },
      { name: 'Tax Compliance (SARS)', price: 'R850' },
      { name: 'BEE Certification', price: 'R250' },
      { name: 'CSD Registration', price: 'R450' },
      { name: 'COIDA Registration & Assessment', price: 'R2,490' },
      { name: 'CIDB Registration — Grade 1', price: 'R950' },
      { name: 'CIDB Registration — Grade 2–4', price: 'From R2,000' },
      { name: 'CIDB Registration — Grade 5–7', price: 'From R4,500' },
      { name: 'CIDB Registration — Grade 8–9', price: 'From R15,000' }
    ]
  },
  {
    id: 'branding',
    title: 'Branding & Identity',
    icon: <Briefcase className="w-8 h-8" />,
    description: 'Strategic brand development that positions your business for recognition and trust in your market.',
    services: [
      { name: 'Logo Design', price: 'From R1,500' },
      { name: 'Business Branding Package', price: 'R2,500' },
      { name: 'Business Cards (250)', price: 'R800' },
      { name: 'Simple Social Media Flyer', price: 'R650' },
      { name: 'Standard Digital Flyer', price: 'R950' },
      { name: 'Premium Event/Brand Flyer', price: 'R1,250' },
      { name: 'Digital Artwork / Graphic Design', price: 'R750' },
      { name: 'Marketing Materials', price: 'R1,500' }
    ]
  },
  {
    id: 'business-documents',
    title: 'Business Documents',
    icon: <FileText className="w-8 h-8" />,
    description: 'Professional business profiles and plans designed for tenders, funding applications, and stakeholders.',
    services: [
      { name: 'Business Profile – Starter (1–4 Pages)', price: 'R850' },
      { name: 'Business Profile – Standard (5–10 Pages)', price: 'R2,500' },
      { name: 'Business Plan – Basic', price: 'R1,190' },
      { name: 'Business Plan – Comprehensive', price: 'R3,000' }
    ]
  },
  {
    id: 'training-materials',
    title: 'Training & Learning Materials',
    icon: <GraduationCap className="w-8 h-8" />,
    description: 'Accredited-style learning materials for training providers, SETAs, and HR teams: workbooks, facilitator guides, and presentations.',
    services: [
      { name: 'Training Workbook / Study Guide', price: 'R2,800' },
      { name: "Facilitator's / Lecturer's Guide", price: 'R2,500' },
      { name: 'Training PowerPoint Presentation', price: 'R1,800' },
      { name: 'Full Training Package (All Three)', price: 'R6,500' }
    ]
  },
  {
    id: 'digital',
    title: 'Digital Solutions',
    icon: <Layers className="w-8 h-8" />,
    description: 'Custom websites, apps, and digital marketing strategies that drive growth and engagement.',
    services: [
      { name: 'Website Development', price: 'From R5,000' },
      { name: 'Mobile App Development', price: 'From R15,000' },
      { name: 'E-commerce Solutions', price: 'From R8,000' },
      { name: 'SEO & Digital Marketing', price: 'From R2,500/mo' },
      { name: 'Social Media Management', price: 'From R3,500/mo' }
    ]
  },
  {
    id: 'ai-platforms',
    title: 'AI Platforms & Automation',
    icon: <Bot className="w-8 h-8" />,
    description: 'White-label AI-powered WhatsApp engagement platforms with automated workflows, AI agents, and optional mobile apps for iOS and Android.',
    services: [
      { name: 'AI Platform — Starter', price: 'R9,500 once-off' },
      { name: 'AI Platform — Pro', price: 'R18,500 once-off' },
      { name: 'Mobile App (iOS & Android)', price: 'From R15,000' },
      { name: 'App Store Submission (Both Stores)', price: 'R2,500 once-off' },
      { name: 'Platform Hosting', price: 'R1,500/mo' },
      { name: 'Platform Support & Updates', price: 'R2,500/mo' },
      { name: 'Platform Fully Managed', price: 'R4,500/mo' }
    ]
  }
];

// Service packages data
const servicePackages = [
  {
    id: 'launch-starter',
    name: 'Launch Essentials',
    price: 'From R2,500',
    description: 'Perfect for new businesses looking to establish a professional foundation fast.',
    features: [
      'CIPC Company Registration',
      'Basic Logo Design',
      'Business Cards (250 printed)'
    ],
    popular: false,
    ctaLink: '/build-package'
  },
  {
    id: 'growth-professional',
    name: 'Growth Momentum',
    price: 'From R8,500',
    description: 'For businesses ready to expand their market presence and digital footprint.',
    features: [
      'Business Branding Package',
      '5-Page Website',
      'Marketing Materials',
      'Business Plan'
    ],
    popular: true,
    ctaLink: '/build-package'
  },
  {
    id: 'empire-premium',
    name: 'Empire Ascend',
    price: 'From R16,500',
    description: 'The complete digital presence package for serious growth and market dominance.',
    features: [
      'Premium Logo + Full Branding',
      'E-commerce Web Portal',
      'Media Kit',
      '3 Months Social Media Management'
    ],
    popular: false,
    ctaLink: '/build-package'
  }
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      
      <PageHero
        title="Our Services"
        subtitle="What We Offer"
        description="Strategic combinations of compliance, branding, and digital tools designed to meet you where you are and propel you forward fast."
        breadcrumbs={[{ label: 'Services', href: '/services' }]}
        size="default"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="#business-setup"
            className="btn btn-outline"
          >
            Business Setup
          </Link>
          <Link 
            href="#branding"
            className="btn btn-outline"
          >
            Branding
          </Link>
          <Link 
            href="#digital"
            className="btn btn-outline"
          >
            Digital
          </Link>
        </div>
      </PageHero>
      
      {/* Service Categories */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="space-y-32">
            {serviceCategories.map((category, index) => (
              <div 
                key={category.id} 
                id={category.id}
                className="scroll-mt-24"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Category Info */}
                  <div className="lg:col-span-4">
                    <div className="sticky top-24">
                      <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center mb-6 text-accent">
                        {category.icon}
                      </div>
                      <h2 className="text-3xl font-heading font-bold text-white mb-4">
                        {category.title}
                      </h2>
                      <p className="text-white/70 mb-6">
                        {category.description}
                      </p>
                      <Link 
                        href="/build-package"
                        className="btn btn-primary"
                      >
                        Build Custom Package
                        <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Services List */}
                  <div className="lg:col-span-8">
                    <div className="glass-card p-8">
                      <div className="space-y-6">
                        {category.services.map((service, idx) => (
                          <div 
                            key={`${category.id}-service-${idx}`}
                            className="flex justify-between items-center p-4 border-b border-white/10 last:border-0"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-4 text-accent">
                                <Check size={16} />
                              </div>
                              <span className="text-white font-medium">{service.name}</span>
                            </div>
                            <div className="text-accent font-heading font-bold">
                              {service.price}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-white/70 text-sm mb-4">
                          Need a custom solution? Contact us for a personalized quote.
                        </p>
                        <Link 
                          href="/contact"
                          className="btn btn-outline"
                        >
                          Get Custom Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Service Packages */}
      <section className="py-20 relative" id="packages">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Signature Bundles</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-2 mb-4">
              Packages engineered for every growth stage
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              Strategic combinations of compliance, branding, and digital tools designed to meet you where you are and propel you forward fast.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicePackages.map((pkg) => (
              <div
                key={pkg.id}
                id={pkg.id}
                className={`relative glass-card transition-all duration-300 ${
                  pkg.popular ? 'ring-2 ring-accent' : ''
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-color-bg-deep text-sm font-medium py-1 px-4 rounded-full">
                    Most Popular
                  </span>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-accent text-3xl font-bold mb-4">{pkg.price}</p>
                  <p className="text-white/70 mb-6">{pkg.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1 text-accent">
                          <Check size={16} />
                        </span>
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={pkg.ctaLink}
                    className={`w-full flex items-center justify-center py-3 px-6 rounded-md font-medium transition-all duration-300 ${
                      pkg.popular
                        ? 'bg-accent text-color-bg-deep'
                        : 'bg-white/10 text-white hover:bg-accent hover:text-color-bg-deep'
                    }`}
                  >
                    <span>Get {pkg.name}</span>
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              href="/build-package"
              className="btn btn-primary"
            >
              Build Your Custom Package
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* ── Tender Services ──────────────────────────────────── */}
      <section className="py-20 bg-color-bg-secondary relative" id="tender-services">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">

          <div className="text-center mb-16">
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Government &amp; Corporate Tenders</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-2 mb-4">
              Tender Services - Get Into the Procurement Space
            </h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              From getting your business tender-ready, to having us search, apply, and attend site meetings on your behalf.
              We handle the full tender lifecycle so you can focus on delivering the work.
            </p>
          </div>

          {/* Tender Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">

            {/* Tier 1 - Tender Ready */}
            <div className="glass-card p-7 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5">
                <Shield className="text-accent w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-1">Tender Ready</h3>
              <p className="text-accent text-2xl font-bold mb-3">From R3,500 <span className="text-sm font-normal text-white/50">once-off</span></p>
              <p className="text-white/60 text-sm mb-5 flex-1">
                We register your business for all the credentials needed to bid on government tenders.
              </p>
              <ul className="space-y-2 mb-6">
                {['CSD Registration', 'CIDB Registration', 'BBBEE Affidavit / Certificate', 'Tax Clearance Pin', 'Company Profile Document'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <Check size={14} className="text-accent mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-outline w-full text-center text-sm">Get Started</Link>
            </div>

            {/* Tier 2 - Tender Watch */}
            <div className="glass-card p-7 flex flex-col ring-2 ring-accent/30 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent/20 text-accent text-xs font-medium py-1 px-3 rounded-full border border-accent/30">
                Most Popular
              </span>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <Briefcase className="text-accent w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-1">Tender Watch</h3>
              <p className="text-accent text-2xl font-bold mb-3">R350 <span className="text-sm font-normal text-white/50">/month</span></p>
              <p className="text-white/60 text-sm mb-5 flex-1">
                We continuously scrape government portals and match tenders to your business profile. You get notified every time there's a fit.
              </p>
              <ul className="space-y-2 mb-6">
                {['Automated daily tender scraping', 'Profile-matched tender alerts', 'Email notifications per match', 'Closing-date reminders', 'Monthly tender digest report'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <Check size={14} className="text-accent mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-primary w-full text-center text-sm">Start Watch</Link>
            </div>

            {/* Tier 3 - Tender Apply */}
            <div className="glass-card p-7 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-5">
                <Layers className="text-blue-400 w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-1">Tender Apply</h3>
              <p className="text-accent text-2xl font-bold mb-3">R950 <span className="text-sm font-normal text-white/50">/month</span></p>
              <p className="text-white/60 text-sm mb-5 flex-1">
                We don't just find the tenders, we compile and submit the full application on your behalf. Everything in Watch, plus we do the paperwork.
              </p>
              <ul className="space-y-2 mb-6">
                {['Everything in Tender Watch', 'Full tender document compilation', 'Application submission on your behalf', 'Application tracking + updates', '+ From R1,200 per document set (tiered by tender value)'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <Check size={14} className="text-accent mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-outline w-full text-center text-sm">Start Applying</Link>
            </div>

            {/* Tier 4 - Tender Full */}
            <div className="glass-card p-7 flex flex-col bg-gradient-to-b from-accent/5 to-transparent">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-5">
                <TrendingUp className="text-accent w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-1">Tender Full Service</h3>
              <p className="text-accent text-2xl font-bold mb-3">R2,550 <span className="text-sm font-normal text-white/50">/month</span></p>
              <p className="text-white/60 text-sm mb-5 flex-1">
                The complete managed service. We search, apply, attend compulsory site meetings, and follow up on awarded tenders, all on your behalf.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Everything in Tender Apply',
                  'Site / briefing meeting attendance',
                  'Tender clarification responses',
                  'Award follow-up & negotiations',
                  '+ From R3,000 per tender fully managed (tiered by value)',
                  'Site / briefing meeting attendance included',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <Check size={14} className="text-accent mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-primary w-full text-center text-sm">Go Full Service</Link>
            </div>
          </div>

          {/* Tender add-ons callout */}
          <div className="glass-card p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">Add-on Services</h3>
                <p className="text-white/60 text-sm">Additional charges apply for the following services outside of your monthly package.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Per Tender (from, tiered by value)', price: 'R1,200' },
                  { name: 'Site Meeting Attendance',  price: 'R1,500' },
                  { name: 'Tender Compliance Audit',  price: 'R1,200' },
                  { name: 'Company Profile Update',   price: 'R450' },
                ].map(addon => (
                  <div key={addon.name} className="flex items-center justify-between p-3 bg-white/3 rounded-lg">
                    <span className="text-white/70 text-sm">{addon.name}</span>
                    <span className="text-accent font-bold text-sm">{addon.price}</span>
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
                Ready to Level Up?
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Let's build the compliant, credible, and captivating brand your business deserves.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Book Strategy Call
                </a>
                <Link 
                  href="/portfolio"
                  className="btn btn-outline"
                >
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
