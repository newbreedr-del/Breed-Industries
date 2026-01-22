'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { Calculator, Check, ClipboardList, Sparkles, Plus, Minus, FileText, Briefcase, Layers, Shield, X, CheckCircle2 } from 'lucide-react';
import QuoteGenerator from '@/components/QuoteGenerator';

const complianceOptions = [
  { id: 'cipc', name: 'CIPC Registration', price: 550, icon: <Shield size={16} />, description: 'Complete company registration with CIPC including name reservation and registration certificate' },
  { id: 'tax', name: 'Tax Compliance', price: 850, icon: <FileText size={16} />, description: 'SARS tax registration, income tax number, and initial tax compliance setup' },
  { id: 'bee', name: 'BEE Certification', price: 250, icon: <FileText size={16} />, description: 'Basic BEE verification certificate and scorecard for procurement opportunities' },
  { id: 'coid', name: 'COID Registration / Letter of Good Standing', price: 850, icon: <FileText size={16} />, description: 'Workplace Compensation Fund registration and annual letter of good standing' },
  { id: 'uif', name: 'UIF Registration & Compliance Letter', price: 650, icon: <FileText size={16} />, description: 'Unemployment Insurance Fund registration and compliance documentation' },
  { id: 'annual', name: 'CIPC Annual Return', price: 450, icon: <FileText size={16} />, description: 'Annual CIPC return filing to maintain company compliance and good standing' },
];

const brandingOptions = [
  { id: 'logo-basic', name: 'Basic Logo Design', price: 1500, icon: <Briefcase size={16} />, description: 'Professional logo design with 2 initial concepts and 2 revisions, delivered in multiple formats' },
  { id: 'logo-premium', name: 'Premium Logo Design', price: 3500, icon: <Briefcase size={16} />, description: 'Advanced logo design with 5 concepts, unlimited revisions, brand guidelines, and complete brand kit' },
  { id: 'brand-guide', name: 'Business Branding', price: 2500, icon: <Briefcase size={16} />, description: 'Comprehensive brand identity guide including color palette, typography, and brand usage guidelines' },
  { id: 'business-cards', name: 'Business Cards (250)', price: 800, icon: <Briefcase size={16} />, description: 'Professional business card design and printing of 250 high-quality cards with premium finish' },
  { id: 'marketing-materials', name: 'Marketing Materials', price: 1200, icon: <Briefcase size={16} />, description: 'Custom marketing collateral including brochures, flyers, and promotional materials design' },
];

const digitalOptions = [
  { id: 'website', name: 'Website Development', price: 5000, icon: <Layers size={16} />, description: 'Custom responsive website development with up to 5 pages, CMS integration, and mobile optimization' },
  { id: 'app', name: 'Mobile App Development', price: 15000, icon: <Layers size={16} />, description: 'Native mobile app development for iOS and Android with backend integration and deployment' },
  { id: 'ecommerce', name: 'E-commerce Solutions', price: 8000, icon: <Layers size={16} />, description: 'Full e-commerce platform with product catalog, shopping cart, payment gateway, and order management' },
  { id: 'seo', name: 'SEO & Digital Marketing', price: 2500, icon: <Layers size={16} />, description: 'Search engine optimization, keyword research, and digital marketing strategy setup' },
  { id: 'social', name: 'Social Media Management', price: 3500, icon: <Layers size={16} />, description: '3-month social media management including content creation, posting, and analytics reporting' },
];

const businessProfileOptions = [
  { id: 'profile-starter', name: 'Business Profile - Starter (1–4 Pages)', price: 850, icon: <FileText size={16} />, description: 'Best for startups, small businesses, or basic tender submissions. Simple layout, design-only, 2–3 revision rounds, print-ready PDF.' },
  { id: 'profile-standard', name: 'Business Profile - Standard (5–10 Pages)', price: 2500, icon: <FileText size={16} />, description: 'Best for small to medium businesses. Professional formatting, digital flipbook formats, higher quality graphics.' },
  { id: 'plan-basic', name: 'Business Plan - Basic/Entry-Level', price: 1190, icon: <FileText size={16} />, description: 'Template-based solution suitable for internal strategy or simple needs, using generic data.' },
  { id: 'plan-comprehensive', name: 'Business Plan - Standard/Comprehensive', price: 3000, icon: <FileText size={16} />, description: 'Includes more detail, customized content, and often 3-year financial projections, ideal for funding applications.' },
];

const builderSteps = [
  {
    id: 'compliance',
    title: 'Pick your foundation',
    description: 'Choose the compliance essentials your business needs to go from idea to operational.',
    options: complianceOptions,
    icon: <Shield className="w-5 h-5" />,
    shortLabel: 'Compliance',
  },
  {
    id: 'branding',
    title: 'Design your brand system',
    description: 'Select visual identity, collateral, and storytelling assets to match your launch plan.',
    options: brandingOptions,
    icon: <Briefcase className="w-5 h-5" />,
    shortLabel: 'Design',
  },
  {
    id: 'digital',
    title: 'Activate digital channels',
    description: 'Add web, app, and marketing touchpoints to unlock visibility and sales momentum.',
    options: digitalOptions,
    icon: <Layers className="w-5 h-5" />,
    shortLabel: 'Activate',
  },
  {
    id: 'business-profile',
    title: 'Build your business profile',
    description: 'Create professional business profiles and documents for tenders, stakeholders, and growth opportunities.',
    options: businessProfileOptions,
    icon: <FileText className="w-5 h-5" />,
    shortLabel: 'Profile',
  },
];

const quickBundles = [
  {
    id: 'launch',
    name: 'Launch Essentials',
    price: 'R3,950',
    numericPrice: 3950,
    items: ['CIPC Registration', 'Basic Logo Suite', 'Business Cards x250'],
    components: ['cipc', 'logo-basic', 'business-cards']
  },
  {
    id: 'growth',
    name: 'Growth Momentum',
    price: 'R9,800',
    numericPrice: 9800,
    items: ['Premium Branding', '5-Page Website', 'Business Plan'],
    components: ['brand-guide', 'website', 'marketing-materials']
  },
  {
    id: 'empire',
    name: 'Empire Ascend',
    price: 'R18,500',
    numericPrice: 18500,
    items: ['Custom Web Portal', 'Media Kit', '3 Months Social Management'],
    components: ['logo-premium', 'brand-guide', 'ecommerce', 'social']
  },
];

const allOptions = [...complianceOptions, ...brandingOptions, ...digitalOptions, ...businessProfileOptions];

export default function LabPage() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState('compliance');
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState<{ quoteNumber: string; customerEmail: string } | null>(null);

  const handleOptionToggle = (optionId: string) => {
    setSelectedBundle(null);
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const selectedQuoteItems = useMemo(() => {
    return selectedOptions.map((optionId, index) => {
      const option = allOptions.find((item) => item.id === optionId);
      return {
        id: `${index + 1}-${optionId}`,
        name: option?.name ?? 'Custom Item',
        description: (option as any)?.description ?? '',
        price: option?.price ?? 0,
      };
    });
  }, [selectedOptions]);

  useEffect(() => {
    if (!quoteSuccess) {
      return;
    }

    const timer = window.setTimeout(() => {
      setQuoteSuccess(null);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [quoteSuccess]);

  const handleBundleSelect = (bundleId: string) => {
    const bundle = quickBundles.find(b => b.id === bundleId);
    if (bundle) {
      setSelectedBundle(bundleId);
      setSelectedOptions(bundle.components);
    }
  };

  const calculateTotal = () => {
    let total = 0;

    // Calculate from compliance options
    complianceOptions.forEach(option => {
      if (selectedOptions.includes(option.id)) {
        total += option.price;
      }
    });

    // Calculate from branding options
    brandingOptions.forEach(option => {
      if (selectedOptions.includes(option.id)) {
        total += option.price;
      }
    });

    // Calculate from digital options
    digitalOptions.forEach(option => {
      if (selectedOptions.includes(option.id)) {
        total += option.price;
      }
    });

    // Calculate from business profile options
    businessProfileOptions.forEach(option => {
      if (selectedOptions.includes(option.id)) {
        total += option.price;
      }
    });

    return total;
  };

  const estimatedTotal = calculateTotal();
  const formattedTotal = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(estimatedTotal).replace('ZAR', 'R');

  const getEstimatedTimeframe = () => {
    const hasComplexItems = selectedOptions.includes('app') || 
                          selectedOptions.includes('ecommerce') || 
                          selectedOptions.includes('logo-premium');
    const itemCount = selectedOptions.length;

    if (hasComplexItems && itemCount > 3) {
      return '4 – 8 Weeks';
    } else if (hasComplexItems || itemCount > 5) {
      return '3 – 6 Weeks';
    } else {
      return '2 – 4 Weeks';
    }
  };

  return (
    <>
      <Header />

      <PageHero
        title="The Lab"
        subtitle="Build Your Own Package"
        description="Use our interactive Lab to architect a package that fits your launch or scale sprint. Real-time budget visibility, curated recommendations, and exportable proposals."
        breadcrumbs={[{ label: 'The Lab', href: '/lab' }]}
        backgroundPattern="blueprint"
        align="left"
      >
        <div className="flex flex-wrap gap-4">
          <Link href="/services" className="btn btn-outline">
            View Service Catalogue
          </Link>
          <Link href="/contact" className="btn btn-primary">
            Book Strategy Call
          </Link>
        </div>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>

        <div className="container mx-auto px-4 relative z-10 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* Builder Component Selection */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-white">Interactive Builder</h2>
                  <p className="text-white/60 text-sm">Select components to build your custom package</p>
                </div>
              </div>
              
              <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                {builderSteps.map((step) => (
                  <button
                    key={step.id}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeStep === step.id ? 'bg-accent text-color-bg-deep' : 'bg-white/5 text-white hover:bg-white/10'}`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <span>{step.icon}</span>
                    <span>{step.shortLabel}</span>
                  </button>
                ))}
              </div>
              
              {/* Active Step Options */}
              <div className="space-y-4">
                {builderSteps.find(step => step.id === activeStep)?.options.map((option) => (
                  <div 
                    key={option.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedOptions.includes(option.id) ? 'border-accent bg-accent/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    onClick={() => handleOptionToggle(option.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedOptions.includes(option.id) ? 'bg-accent text-color-bg-deep' : 'bg-white/10 text-white'}`}>
                          {selectedOptions.includes(option.id) ? <Check size={16} /> : option.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{option.name}</h3>
                        </div>
                      </div>
                      <div className="text-accent font-heading font-bold">
                        R{option.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Builder Summary */}
          <div className="glass-card p-8 h-fit sticky top-24">
            <h2 className="text-xl font-heading font-semibold text-white mb-6">Your Custom Package</h2>
            
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div className="rounded-lg bg-white/5 p-4">
                  <h3 className="text-sm font-medium text-white/70 uppercase tracking-wide mb-2">Estimated Total</h3>
                  <p className="text-3xl font-heading font-bold text-accent">{formattedTotal}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <h3 className="text-sm font-medium text-white/70 uppercase tracking-wide mb-2">Timeline</h3>
                  <p className="text-xl font-heading font-bold text-white">{getEstimatedTimeframe()}</p>
                </div>
              </div>
              
              {selectedOptions.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white/70 uppercase tracking-wide">Selected Components</h3>
                  <div className="space-y-2">
                    {/* Compliance Items */}
                    {complianceOptions.filter(option => selectedOptions.includes(option.id)).length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield size={14} className="text-accent" />
                          <span className="text-sm font-medium text-white">Compliance</span>
                        </div>
                        {complianceOptions
                          .filter(option => selectedOptions.includes(option.id))
                          .map(option => (
                            <div key={option.id} className="flex items-center justify-between py-1 pl-6 text-sm">
                              <span className="text-white/70">{option.name}</span>
                              <span className="text-accent">R{option.price.toLocaleString()}</span>
                            </div>
                          ))
                        }
                      </div>
                    )}
                    
                    {/* Branding Items */}
                    {brandingOptions.filter(option => selectedOptions.includes(option.id)).length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase size={14} className="text-accent" />
                          <span className="text-sm font-medium text-white">Branding</span>
                        </div>
                        {brandingOptions
                          .filter(option => selectedOptions.includes(option.id))
                          .map(option => (
                            <div key={option.id} className="flex items-center justify-between py-1 pl-6 text-sm">
                              <span className="text-white/70">{option.name}</span>
                              <span className="text-accent">R{option.price.toLocaleString()}</span>
                            </div>
                          ))
                        }
                      </div>
                    )}
                    
                    {/* Digital Items */}
                    {digitalOptions.filter(option => selectedOptions.includes(option.id)).length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Layers size={14} className="text-accent" />
                          <span className="text-sm font-medium text-white">Digital</span>
                        </div>
                        {digitalOptions
                          .filter(option => selectedOptions.includes(option.id))
                          .map(option => (
                            <div key={option.id} className="flex items-center justify-between py-1 pl-6 text-sm">
                              <span className="text-white/70">{option.name}</span>
                              <span className="text-accent">R{option.price.toLocaleString()}</span>
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/60">Select components to build your package</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <button 
                className="btn btn-primary flex items-center gap-2"
                onClick={() => setShowQuoteModal(true)}
              >
                <ClipboardList className="w-4 h-4" /> Generate Auto Quote
              </button>
            </div>
          </div>

          {/* Builder Guidance */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-xl font-heading font-semibold text-white mb-6">How the Lab Works</h2>
              <div className="space-y-6">
                {builderSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center font-heading font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{step.title}</h3>
                      <p className="text-white/60 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-xl font-heading font-semibold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" /> Quick Bundles
              </h2>
              <div className="grid gap-6">
                {quickBundles.map((bundle) => (
                  <div 
                    key={bundle.id} 
                    className={`rounded-xl border ${selectedBundle === bundle.id ? 'border-accent bg-accent/10' : 'border-white/10 bg-white/5'} p-6 cursor-pointer transition-all hover:bg-white/10`}
                    onClick={() => handleBundleSelect(bundle.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedBundle === bundle.id ? 'bg-accent text-color-bg-deep' : 'bg-white/10 text-white'}`}>
                          {selectedBundle === bundle.id ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        </div>
                        <h3 className="text-white font-semibold">{bundle.name}</h3>
                      </div>
                      <span className="text-accent font-heading font-bold">{bundle.price}</span>
                    </div>
                    <ul className="space-y-2 text-white/60 text-sm">
                      {bundle.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-xl font-heading font-semibold text-white mb-3">Need a guided build?</h2>
              <p className="text-white/60 text-sm mb-4">
                Book a call with our launch architects and we’ll co-create the perfect package in 30 minutes.
              </p>
              <Link href="/contact" className="btn btn-primary inline-flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Schedule Workshop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Quote Generator Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 text-white hover:text-accent z-10"
            >
              <X size={24} />
            </button>
            
            <div className="max-h-[90vh] overflow-y-auto">
              <QuoteGenerator
                selectedItems={selectedQuoteItems}
                onSuccess={(details) => {
                  setShowQuoteModal(false);
                  setQuoteSuccess(details);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {quoteSuccess && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-5 py-4 text-emerald-100 shadow-xl backdrop-blur">
            <CheckCircle2 className="h-6 w-6 text-emerald-300" />
            <div className="space-y-1">
              <p className="font-heading text-sm font-semibold uppercase tracking-wide text-emerald-200">Quote Sent</p>
              <p className="text-sm text-emerald-100/80">Quote #{quoteSuccess.quoteNumber} has been emailed to {quoteSuccess.customerEmail}.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
