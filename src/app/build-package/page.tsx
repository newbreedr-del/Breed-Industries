'use client';

import { useState, FormEvent } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { Calculator, Check, ClipboardList, Sparkles, Plus, Minus, FileText, Briefcase, Layers, Shield, CheckCircle2, Download, ArrowRight, Loader2, Send, Award } from 'lucide-react';

const complianceOptions = [
  { id: 'cipc', name: 'CIPC Registration', price: 550, pricingType: 'one-time', icon: <Shield size={16} />, description: 'Complete company registration with CIPC including name reservation and registration certificate' },
  { id: 'tax', name: 'Tax Compliance', price: 850, pricingType: 'one-time', icon: <FileText size={16} />, description: 'SARS tax registration, income tax number, and initial tax compliance setup' },
  { id: 'bee', name: 'BEE Certification', price: 250, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Basic BEE verification certificate and scorecard for procurement opportunities' },
  { id: 'csd', name: 'CSD Registration', price: 450, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Central Supplier Database registration for government tender opportunities. Required documents: CIPC registration certificate, tax clearance, BEE certificate, banking details, and director ID copies' },
  { id: 'coid', name: 'COID Registration / Letter of Good Standing', price: 850, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Workplace Compensation Fund registration and annual letter of good standing' },
  { id: 'uif', name: 'UIF Registration & Compliance Letter', price: 650, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Unemployment Insurance Fund registration and compliance documentation' },
  { id: 'annual', name: 'CIPC Annual Return', price: 450, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Annual CIPC return filing to maintain company compliance and good standing' },
];

const brandingOptions = [
  { id: 'logo-basic', name: 'Basic Logo Design', price: 1500, pricingType: 'one-time', icon: <Briefcase size={16} />, description: 'Professional logo design with 2 initial concepts and 2 revisions, delivered in multiple formats' },
  { id: 'logo-premium', name: 'Premium Logo Design', price: 3500, pricingType: 'one-time', icon: <Briefcase size={16} />, description: 'Advanced logo design with 5 concepts, unlimited revisions, brand guidelines, and complete brand kit' },
  { id: 'brand-guide', name: 'Business Branding', price: 2500, pricingType: 'one-time', icon: <Briefcase size={16} />, description: 'Comprehensive brand identity guide including color palette, typography, and brand usage guidelines' },
  { id: 'business-cards', name: 'Business Cards (250)', price: 800, pricingType: 'one-time', icon: <Briefcase size={16} />, description: 'Professional business card design and printing of 250 high-quality cards with premium finish' },
  { id: 'flyer-simple', name: 'Simple Social Media Flyer', price: 650, pricingType: 'one-time', icon: <Briefcase size={16} />, description: 'Single size, single concept digital flyer optimised for Instagram/Facebook. Includes 1 concept and up to 3 revisions.' },
  { id: 'flyer-standard', name: 'Standard Digital Flyer', price: 950, pricingType: 'one-time', icon: <Briefcase size={16} />, description: 'Professional digital flyer with 2 concepts, 3 revision rounds, delivered in JPG, PNG, and PDF formats.' },
  { id: 'flyer-premium', name: 'Premium Event/Brand Flyer', price: 1250, pricingType: 'one-time', icon: <Briefcase size={16} />, description: 'High-end flyer design for events and campaigns. Multiple sizes, 3 revision rounds, all formats including source files.' },
  { id: 'digital-artwork', name: 'Digital Artwork / Graphic Design', price: 750, pricingType: 'one-time', icon: <Briefcase size={16} />, description: 'Custom digital artwork and graphic design for any purpose: social media posts, banners, thumbnails, event graphics, or branded visuals.' },
  { id: 'marketing-materials', name: 'Marketing Materials', price: 1500, pricingType: 'one-time', icon: <Briefcase size={16} />, description: 'Full suite of marketing collateral: brochures, product sheets, pull-up banners, posters, and promotional materials. Designed and print-ready.' },
];

const digitalOptions = [
  { id: 'website', name: 'Website Development', price: 5000, pricingType: 'one-time', icon: <Layers size={16} />, description: 'Custom responsive website development with up to 5 pages, CMS integration, and mobile optimization' },
  { id: 'app', name: 'Mobile App Development', price: 15000, pricingType: 'one-time', icon: <Layers size={16} />, description: 'Native mobile app development for iOS and Android with backend integration and deployment' },
  { id: 'ecommerce', name: 'E-commerce Solutions', price: 8000, pricingType: 'one-time', icon: <Layers size={16} />, description: 'Full e-commerce platform with product catalog, shopping cart, payment gateway, and order management' },
  { id: 'seo', name: 'SEO & Digital Marketing (Setup)', price: 2500, pricingType: 'one-time', icon: <Layers size={16} />, description: 'One-time SEO setup: keyword research, on-page optimization, and digital marketing strategy' },
  { id: 'seo-monthly', name: 'SEO & Digital Marketing (Monthly)', price: 2500, pricingType: 'monthly', icon: <Layers size={16} />, description: 'Ongoing monthly SEO and digital marketing management with reporting and optimization' },
  { id: 'social', name: 'Social Media Management (Monthly)', price: 3500, pricingType: 'monthly', icon: <Layers size={16} />, description: 'Monthly social media management including content creation, posting, and analytics reporting' },
];

const businessProfileOptions = [
  { id: 'profile-starter', name: 'Business Profile - Starter (1–4 Pages)', price: 850, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Best for startups, small businesses, or basic tender submissions. Simple layout, design-only, 2–3 revision rounds, print-ready PDF.' },
  { id: 'profile-standard', name: 'Business Profile - Standard (5–10 Pages)', price: 2500, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Best for small to medium businesses. Professional formatting, digital flipbook formats, higher quality graphics.' },
  { id: 'plan-basic', name: 'Business Plan - Basic/Entry-Level', price: 1190, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Template-based solution suitable for internal strategy or simple needs, using generic data.' },
  { id: 'plan-comprehensive', name: 'Business Plan - Standard/Comprehensive', price: 3000, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Includes more detail, customized content, and often 3-year financial projections, ideal for funding applications.' },
  { id: 'training-workbook', name: 'Training Workbook / Study Guide', price: 2800, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Professionally designed learner workbook or study guide (15–30 pages). Content layout, branded design, and print-ready PDF.' },
  { id: 'training-facilitator', name: "Facilitator's / Lecturer's Guide", price: 2500, pricingType: 'one-time', icon: <FileText size={16} />, description: "Matching facilitator guide with session notes, instructions, assessment tools, and facilitation tips aligned with the study guide." },
  { id: 'training-ppt', name: 'Training PowerPoint Presentation', price: 1800, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Branded, professional PowerPoint presentation (20–30 slides) aligned to your training programme with custom graphics and layouts.' },
  { id: 'training-full', name: 'Full Training Package (All Three)', price: 6500, pricingType: 'one-time', icon: <FileText size={16} />, description: 'Best value: Study Guide + Facilitator Guide + PowerPoint Presentation. Complete package for full training programme delivery.' },
];

const tenderOptions = [
  { id: 'tender-ready', name: 'Tender Ready', price: 3500, pricingType: 'one-time', icon: <Award size={16} />, description: 'Get your business fully registered and compliant for government tenders: CSD, CIDB, BBBEE, Tax Pin, and a professional Company Profile. Once-off setup.' },
  { id: 'tender-watch', name: 'Tender Watch', price: 350, pricingType: 'monthly', icon: <Award size={16} />, description: 'We scrape government portals daily and send you matching tenders by email. Smart matching based on your industry, province, and CIDB grade. Includes monthly digest.' },
  { id: 'tender-apply', name: 'Tender Apply', price: 950, pricingType: 'monthly', icon: <Award size={16} />, description: 'Everything in Tender Watch plus we compile all bid documents and submit on your behalf. Per-document-set fee tiered by tender value: R1,200 (under R500k), R2,000 (R500k–R2M), quote-based above R2M. You focus on running your business, we handle the paperwork.' },
  { id: 'tender-full', name: 'Tender Full Service', price: 2550, pricingType: 'monthly', icon: <Award size={16} />, description: 'Our most comprehensive package: Watch + full bid compilation + submission + site meeting attendance + award follow-up. Per-tender managed fee tiered by value: R3,000 (under R500k), R5,000 (R500k–R2M), quote-based above R2M. Maximum chances of winning.' },
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
    title: 'Build your digital presence',
    description: 'Add websites, apps, and digital marketing to grow your online visibility and drive sales.',
    options: digitalOptions,
    icon: <Layers className="w-5 h-5" />,
    shortLabel: 'Digital',
  },
  {
    id: 'business-profile',
    title: 'Business documents & training',
    description: 'Craft professional documents and training materials for tenders, stakeholders, and learning programmes.',
    options: businessProfileOptions,
    icon: <FileText className="w-5 h-5" />,
    shortLabel: 'Documents',
  },
  {
    id: 'tender',
    title: 'Government tender services',
    description: 'Let Breed find, compile, and submit government tenders on your behalf. Pick your level of involvement.',
    options: tenderOptions,
    icon: <Award className="w-5 h-5" />,
    shortLabel: 'Tenders',
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
  {
    id: 'tender-starter',
    name: 'Tender Starter Pack',
    price: 'R4,450',
    numericPrice: 4450,
    items: ['CSD + CIDB + BBBEE + Tax Pin', 'Company Profile', 'Tender Watch (1st month)'],
    components: ['tender-ready', 'tender-watch']
  },
];

const allOptions = [...complianceOptions, ...brandingOptions, ...digitalOptions, ...businessProfileOptions, ...tenderOptions];

const clientRequirementsMap: Record<string, string[]> = {
  'CIPC Registration': ['Certified copy of ID document (all directors)', 'Proof of residential address (not older than 3 months)', 'Three proposed company name options', 'Signed CIPC forms (provided by Breed Industries)'],
  'Tax Compliance': ['CIPC registration certificate', 'Certified ID copies of all directors', 'Proof of business address', 'Banking details confirmation letter'],
  'BEE Certification': ['Latest financial statements or management accounts', 'Signed BEE declaration (EME/QSE affidavit)', 'Payroll records (if applicable)', 'Skills development records'],
  'CSD Registration': ['CIPC registration certificate', 'Tax clearance certificate', 'BEE certificate or affidavit', 'Banking details and bank letter', 'Certified ID copies of all directors', 'Proof of business address'],
  'COID Registration / Letter of Good Standing': ['CIPC registration documents', 'Estimated annual payroll amount', 'Nature of business activities', 'Number of employees'],
  'UIF Registration & Compliance Letter': ['CIPC registration documents', 'Employee details (ID numbers, start dates)', 'Monthly payroll figures', 'Employer banking details'],
  'CIPC Annual Return': ['CIPC customer code and password', 'Current registered office address confirmation', 'Director changes (if any)', 'Annual return fee (paid to CIPC)'],
  'Basic Logo Design': ['Brand name and tagline (if applicable)', 'Preferred colours and style references', 'Industry and target audience description', 'Any existing brand assets'],
  'Premium Logo Design': ['Detailed brand brief (provided by Breed Industries)', 'Competitor references and positioning notes', 'Vision, mission, and values statement', 'Stakeholder availability for feedback sessions'],
  'Business Branding': ['Approved logo files', 'Brand story and company background', 'Target market demographics', 'Preferred tone of voice and messaging'],
  'Business Cards (250)': ['Approved logo and brand colours', 'Contact details for each cardholder', 'Preferred card stock and finish', 'Delivery address for printed cards'],
  'Simple Social Media Flyer': ['Text content (headline, body, call-to-action)', 'Logo and brand colors (if available)', 'High-resolution images (optional)', 'Style references or design examples (optional)', 'Preferred social platform size (Instagram, Facebook, etc.)'],
  'Standard Digital Flyer': ['Complete text content including headline, body, call-to-action, contact details', 'Logo, brand colors, fonts, and brand guidelines', 'High-resolution images to be used in the design', 'Design brief: target audience, style, tone, purpose', 'Examples or inspiration references (optional)'],
  'Premium Event/Brand Flyer': ['Complete text content for all flyer variations', 'Full brand package: logo, colors, fonts, brand guidelines', 'High-resolution images and graphics', 'Detailed brief: target audience, event details, requirements', 'List of all required sizes (social media, print, web banners)', 'Mood board or inspiration references (optional)'],
  'Digital Artwork / Graphic Design': ['Description of the artwork or design required', 'Intended use and platform (social media, print, website, etc.)', 'Logo and brand guidelines (if applicable)', 'Any images, icons, or elements to be incorporated', 'Preferred dimensions or size specifications', 'Style references or examples of similar work (optional)'],
  'Marketing Materials': ['List of all materials required (e.g. brochure, pull-up banner, poster, product sheet)', 'Approved brand guidelines (logo, colors, fonts)', 'All text content and copy for each material', 'High-resolution images and product photography (if applicable)', 'Preferred paper stock, finish, and print quantity (for print-ready files)', 'Distribution format: print, digital, or both'],
  'Website Development': ['Sitemap and page structure preferences', 'All text content for each page', 'High-resolution images and media', 'Domain name and hosting credentials', 'Logo and brand guidelines'],
  'Mobile App Development': ['Detailed feature requirements document', 'User flow diagrams or wireframes (if available)', 'API documentation for third-party integrations', 'App Store / Play Store developer account credentials'],
  'E-commerce Solutions': ['Product catalogue with descriptions, images, and pricing', 'Payment gateway preferences (PayFast, Stripe, etc.)', 'Shipping and delivery policies', 'Domain and hosting details', 'Business registration for payment gateway setup'],
  'SEO & Digital Marketing (Setup)': ['Website access (CMS admin credentials)', 'Google Analytics and Search Console access', 'Target keywords and competitor list', 'Business goals and KPIs'],
  'SEO & Digital Marketing (Monthly)': ['Website access (CMS admin credentials)', 'Google Analytics and Search Console access', 'Target keywords and competitor list', 'Monthly budget for paid campaigns (if applicable)'],
  'Social Media Management (Monthly)': ['Social media account credentials', 'Brand guidelines and tone of voice', 'Product/service images and descriptions', 'Monthly promotional calendar or events', 'Approval workflow and turnaround expectations'],
  'Business Profile - Starter (1–4 Pages)': ['Company overview and history', 'Services or products offered', 'Director/owner profiles', 'Contact details and logo'],
  'Business Profile - Standard (5–10 Pages)': ['Detailed company background and milestones', 'Full service/product catalogue', 'Team profiles with photographs', 'Client references or testimonials', 'Certifications and compliance documents'],
  'Business Plan - Basic/Entry-Level': ['Business concept and model description', 'Target market information', 'Revenue model and pricing strategy', 'Startup costs estimate'],
  'Business Plan - Standard/Comprehensive': ['Detailed business model and value proposition', 'Market research data and competitor analysis', 'Financial records (existing business) or projections', '3-year revenue and expense forecasts', 'Funding requirements and use of funds breakdown'],
  'Training Workbook / Study Guide': ['Training content outline or existing material', 'Target learners and qualification level', 'Number of modules or units', 'Logo and brand guidelines', 'Preferred page count or layout style'],
  "Facilitator's / Lecturer's Guide": ['Aligned study guide or content outline', 'Session time allocations per module', 'Assessment activities and questions per module', 'Learning outcomes per module', 'Any specific facilitation notes or instructions'],
  'Training PowerPoint Presentation': ['Training content or speaker notes/script', 'Logo and brand colors/fonts', 'Number of slides required (approximate)', 'Preferred design style or theme', 'Any existing slides to incorporate (optional)'],
  'Full Training Package (All Three)': ['Complete training content outline', 'Target audience and qualification level', 'Number of modules', 'Logo and brand guidelines', 'Session time allocations per module', 'Learning outcomes per module'],
  'Tender Ready': ['Certified ID copies of all directors', 'Proof of business address (not older than 3 months)', 'CIPC registration certificate (if already registered)', 'Banking confirmation letter / bank statement', 'Tax reference number (if already registered)', 'CIDB discipline(s) your business operates in', 'BBBEE ownership breakdown'],
  'Tender Watch': ['Short company profile (1 page or a few bullet points)', 'Province(s) you operate in', 'Industry categories (construction, IT, catering, cleaning, etc.)', 'CIDB grade (if applicable)', 'Maximum contract value you can handle'],
  'Tender Apply': ['All documents listed under Tender Watch', 'CSD registration confirmation', 'Current tax clearance / PIN', 'BEE certificate or affidavit', 'Director ID copies', 'Signed mandate letter allowing Breed to submit on your behalf'],
  'Tender Full Service': ['All documents listed under Tender Apply', 'Signed Power of Attorney / mandate for site meetings', 'Representative availability for site briefings', 'Any previous tender submissions for reference', 'Company bank statement (3 months)'],
};

export default function LabPage() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState('compliance');
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteRef, setQuoteRef] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
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

  const handleBundleSelect = (bundleId: string) => {
    const bundle = quickBundles.find(b => b.id === bundleId);
    if (bundle) {
      setSelectedBundle(bundleId);
      setSelectedOptions(bundle.components);
    }
  };

  const calculateTotal = () => {
    let oneTimeTotal = 0;
    let monthlyTotal = 0;

    // Calculate from compliance options
    complianceOptions.forEach(option => {
      if (selectedOptions.includes(option.id)) {
        if (option.pricingType === 'monthly') {
          monthlyTotal += option.price;
        } else {
          oneTimeTotal += option.price;
        }
      }
    });

    // Calculate from branding options
    brandingOptions.forEach(option => {
      if (selectedOptions.includes(option.id)) {
        if (option.pricingType === 'monthly') {
          monthlyTotal += option.price;
        } else {
          oneTimeTotal += option.price;
        }
      }
    });

    // Calculate from digital options
    digitalOptions.forEach(option => {
      if (selectedOptions.includes(option.id)) {
        if (option.pricingType === 'monthly') {
          monthlyTotal += option.price;
        } else {
          oneTimeTotal += option.price;
        }
      }
    });

    // Calculate from business profile options
    businessProfileOptions.forEach(option => {
      if (selectedOptions.includes(option.id)) {
        if (option.pricingType === 'monthly') {
          monthlyTotal += option.price;
        } else {
          oneTimeTotal += option.price;
        }
      }
    });

    return { oneTime: oneTimeTotal, monthly: monthlyTotal };
  };

  const { oneTime: oneTimeTotal, monthly: monthlyTotal } = calculateTotal();
  const formattedOneTimeTotal = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(oneTimeTotal).replace('ZAR', 'R');
  
  const formattedMonthlyTotal = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monthlyTotal).replace('ZAR', 'R');

  const getEstimatedTimeframe = () => {
    // Define realistic timeframes for each service (in business days)
    const serviceTimeframes: Record<string, number> = {
      // Compliance services (quicker)
      'cipc': 2,        // CIPC Annual Return
      'tax': 3,         // Tax Registration
      'beee': 5,        // B-BBEE Certificate
      'cofa': 2,        // CIPC CoR
      'sars': 3,        // Tax Clearance
      
      // Branding services (medium)
      'logo-basic': 3,  // Basic Logo
      'logo-premium': 7, // Premium Logo
      'brand-guide': 5, // Brand Guidelines
      'social': 3,      // Social Media Kit
      
      // Digital services (longer)
      'website-basic': 5,   // Basic Website
      'website-advanced': 10, // Advanced Website
      'ecommerce': 14,       // E-commerce
      'app': 21,             // Mobile App
      'seo': 7,              // SEO Setup
      'maintenance': 2,      // Maintenance Plan
      
      // Business Profile services (medium)
      'profile-starter': 3,   // Business Profile Starter
      'profile-standard': 5,  // Business Profile Standard
      'plan-basic': 4,        // Business Plan Basic
      'plan-comprehensive': 8, // Business Plan Comprehensive
      'training-workbook': 7,
      'training-facilitator': 5,
      'training-ppt': 4,
      'training-full': 12,
    };

    // Calculate total days based on selected services
    let totalDays = 0;
    selectedOptions.forEach(optionId => {
      totalDays += serviceTimeframes[optionId] || 3; // Default 3 days for unknown services
    });

    // Add buffer for project management and coordination
    const coordinationDays = Math.max(2, Math.ceil(selectedOptions.length * 0.5));
    totalDays += coordinationDays;

    // Convert to weeks and create realistic ranges
    const weeks = Math.ceil(totalDays / 5); // 5 business days per week
    
    if (weeks <= 1) {
      return '3 – 5 Business Days';
    } else if (weeks <= 2) {
      return '1 – 2 Weeks';
    } else if (weeks <= 3) {
      return '2 – 3 Weeks';
    } else if (weeks <= 4) {
      return '3 – 4 Weeks';
    } else if (weeks <= 6) {
      return '4 – 6 Weeks';
    } else if (weeks <= 8) {
      return '6 – 8 Weeks';
    } else {
      return '8 – 12 Weeks';
    }
  };

  const handleQuoteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    try {
      const selectedServiceItems = selectedOptions
        .map(optionId => {
          const option = allOptions.find(o => o.id === optionId);
          return { name: option?.name || '', description: option?.description || '', quantity: 1, rate: option?.price || 0, pricingType: option?.pricingType || 'one-time' };
        })
        .filter(item => item.name);
      if (!selectedServiceItems.length) throw new Error('No services selected.');
      const projectTitle = selectedServiceItems.slice(0, 2).map(i => i.name).join(', ')
        + (selectedServiceItems.length > 2 ? ` +${selectedServiceItems.length - 2} more` : '');
      const res = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formName.trim(),
          customerEmail: formEmail.trim(),
          customerPhone: formPhone.trim(),
          customerCompany: formCompany.trim(),
          projectName: `Package: ${projectTitle}`,
          contactPerson: formName.trim(),
          items: selectedServiceItems,
          notes: formNotes.trim(),
          estimatedTimeline: getEstimatedTimeframe()
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit. Please try again.');
      setQuoteRef(result.quoteNumber);
      setQuoteSuccess(true);
      setShowQuoteForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <PageHero
        title="Build Your Package"
        subtitle="Custom Quote Builder"
        description="Use our interactive builder to explore pricing for the services you need. Select components, see your estimate in real-time, then contact us for a formal quote."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Build Package', href: '/build-package' }
        ]}
        backgroundImage="/assets/images/build-package-hero.jpg"
        size="large"
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

        <div className="container mx-auto px-4 relative z-10 grid gap-10 grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
          {/* Builder Component Selection */}
          <div className="space-y-8">
            <div className="glass-card p-4 md:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                  <Calculator className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-white">Interactive Builder</h2>
                  <p className="text-white/60 text-xs md:text-sm">Select components to build your custom package</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 md:gap-4 mb-6 border-b border-white/10 pb-4">
                {builderSteps.map((step) => (
                  <button
                    key={step.id}
                    className={`px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base transition-colors ${activeStep === step.id ? 'bg-accent text-color-bg-deep' : 'bg-white/5 text-white hover:bg-white/10'}`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <span>{step.icon}</span>
                    <span>{step.shortLabel}</span>
                  </button>
                ))}
              </div>
              
              {/* Active Step Options */}
              <div className="space-y-3">
                {builderSteps.find(step => step.id === activeStep)?.options.map((option) => (
                  <div 
                    key={option.id}
                    className={`rounded-lg border cursor-pointer transition-all ${selectedOptions.includes(option.id) ? 'border-accent bg-accent/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    onClick={() => handleOptionToggle(option.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 sm:gap-0">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0 ${selectedOptions.includes(option.id) ? 'bg-accent text-color-bg-deep' : 'bg-white/10 text-white'}`}>
                          {selectedOptions.includes(option.id) ? <Check size={16} /> : option.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium leading-tight text-sm sm:text-base">{option.name}</h3>
                          <p className="text-white/50 text-xs mt-0.5 leading-snug">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-accent font-heading font-bold text-left sm:text-right flex-shrink-0 sm:ml-4">
                        <span className="text-sm sm:text-base">R{option.price.toLocaleString()}</span>
                        {option.pricingType === 'monthly' && <span className="text-xs sm:text-sm text-white/70">/mo</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Builder Summary */}
          <div className="glass-card p-4 md:p-6 lg:p-8 h-fit lg:sticky lg:top-24">
            <h2 className="text-lg md:text-xl font-heading font-semibold text-white mb-4 md:mb-6">Your Custom Package</h2>
            
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 mb-4 md:mb-6">
              <div className="grid gap-4 mb-4 md:mb-6">
                <div className="rounded-lg bg-white/5 p-3 md:p-4">
                  <h3 className="text-xs md:text-sm font-medium text-white/70 uppercase tracking-wide mb-2">One-Time Fees</h3>
                  <p className="text-2xl md:text-3xl font-heading font-bold text-accent">{formattedOneTimeTotal}</p>
                </div>
                {monthlyTotal > 0 && (
                  <div className="rounded-lg bg-white/5 p-3 md:p-4">
                    <h3 className="text-xs md:text-sm font-medium text-white/70 uppercase tracking-wide mb-2">Monthly Subscription</h3>
                    <p className="text-2xl md:text-3xl font-heading font-bold text-accent">{formattedMonthlyTotal}<span className="text-base md:text-lg text-white/70">/mo</span></p>
                    <p className="text-xs text-white/50 mt-2">Invoiced separately after initial payment</p>
                  </div>
                )}
                <div className="rounded-lg bg-white/5 p-3 md:p-4">
                  <h3 className="text-xs md:text-sm font-medium text-white/70 uppercase tracking-wide mb-2">Timeline</h3>
                  <p className="text-lg md:text-xl font-heading font-bold text-white">{getEstimatedTimeframe()}</p>
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
                              <span className="text-accent">R{option.price.toLocaleString()}{option.pricingType === 'monthly' && <span className="text-xs">/mo</span>}</span>
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
                              <span className="text-accent">R{option.price.toLocaleString()}{option.pricingType === 'monthly' && <span className="text-xs">/mo</span>}</span>
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
                              <span className="text-accent">R{option.price.toLocaleString()}{option.pricingType === 'monthly' && <span className="text-xs">/mo</span>}</span>
                            </div>
                          ))
                        }
                      </div>
                    )}
                    {/* Documents & Training Items */}
                    {businessProfileOptions.filter(option => selectedOptions.includes(option.id)).length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText size={14} className="text-accent" />
                          <span className="text-sm font-medium text-white">Documents</span>
                        </div>
                        {businessProfileOptions
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
            
            {selectedOptions.length > 0 && (
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList size={16} className="text-accent" />
                  <h3 className="text-sm font-semibold text-accent uppercase tracking-wide">What you'll need to provide</h3>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {selectedOptions.map(optionId => {
                    const option = allOptions.find(o => o.id === optionId);
                    const details = clientRequirementsMap[option?.name ?? ''];
                    if (!details) return null;
                    return (
                      <div key={optionId}>
                        <p className="text-xs font-semibold text-white/80 mb-1">{option?.name}</p>
                        <ul className="space-y-0.5">
                          {details.map((req, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-white/55">
                              <CheckCircle2 size={10} className="text-accent mt-0.5 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {selectedOptions.length > 0 ? (
                quoteSuccess ? (
                  <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center">
                    <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                    <h3 className="text-white font-bold text-base mb-1">Quote Request Sent!</h3>
                    <p className="text-white/70 text-sm mb-1">Ref: <span className="text-accent font-mono font-bold">{quoteRef}</span></p>
                    <p className="text-white/55 text-xs mb-4">Check your email for a confirmation. We'll be in touch within 24 hours.</p>
                    <button
                      onClick={() => { setQuoteSuccess(false); setShowQuoteForm(false); setSelectedOptions([]); setSelectedBundle(null); setFormName(''); setFormEmail(''); setFormPhone(''); setFormCompany(''); setFormNotes(''); }}
                      className="text-accent text-sm hover:underline"
                    >
                      Build another package →
                    </button>
                  </div>
                ) : showQuoteForm ? (
                  <form onSubmit={handleQuoteSubmit} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-sm">Your Details</h3>
                      <button type="button" onClick={() => setShowQuoteForm(false)} className="text-white/40 hover:text-white/70 text-xs">← Back</button>
                    </div>
                    <input
                      required type="text" placeholder="Full Name *"
                      value={formName} onChange={e => setFormName(e.target.value)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-accent/50"
                    />
                    <input
                      required type="email" placeholder="Email Address *"
                      value={formEmail} onChange={e => setFormEmail(e.target.value)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-accent/50"
                    />
                    <input
                      required type="tel" placeholder="Phone Number *"
                      value={formPhone} onChange={e => setFormPhone(e.target.value)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-accent/50"
                    />
                    <input
                      type="text" placeholder="Company Name (optional)"
                      value={formCompany} onChange={e => setFormCompany(e.target.value)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-accent/50"
                    />
                    <textarea
                      placeholder="Additional notes or requirements..."
                      value={formNotes} onChange={e => setFormNotes(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-accent/50 resize-none"
                    />
                    {formError && <p className="text-red-400 text-xs">{formError}</p>}
                    <button
                      type="submit" disabled={formSubmitting}
                      className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {formSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {formSubmitting ? 'Sending Request…' : 'Submit Quote Request'}
                    </button>
                    <p className="text-white/40 text-xs text-center">We'll respond within 24 hours</p>
                  </form>
                ) : (
                  <>
                    <p className="text-white/55 text-xs text-center leading-relaxed">
                      Ready to proceed? We'll prepare a formal proposal for this package within 24 hours.
                    </p>
                    <button
                      onClick={() => setShowQuoteForm(true)}
                      className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <ClipboardList className="w-4 h-4" /> Request a Formal Quote
                    </button>
                    <Link href="/request-service" className="btn btn-outline w-full flex items-center justify-center gap-2">
                      <ArrowRight className="w-4 h-4" /> Request Service Directly
                    </Link>
                  </>
                )
              ) : (
                <p className="text-white/40 text-xs text-center">Select services above to build your estimate</p>
              )}
            </div>
          </div>

          {/* Builder Guidance */}
          <div className="space-y-6 md:space-y-8">
            <div className="glass-card p-4 md:p-6 lg:p-8">
              <h2 className="text-lg md:text-xl font-heading font-semibold text-white mb-4 md:mb-6">How the Lab Works</h2>
              <div className="space-y-4 md:space-y-6">
                {builderSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center font-heading font-bold text-sm md:text-base flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold text-sm md:text-base">{step.title}</h3>
                      <p className="text-white/60 text-xs md:text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 md:p-6 lg:p-8">
              <h2 className="text-lg md:text-xl font-heading font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-accent" /> Quick Bundles
              </h2>
              <div className="grid gap-4 md:gap-6">
                {quickBundles.map((bundle) => (
                  <div 
                    key={bundle.id} 
                    className={`rounded-xl border ${selectedBundle === bundle.id ? 'border-accent bg-accent/10' : 'border-white/10 bg-white/5'} p-4 md:p-6 cursor-pointer transition-all hover:bg-white/10`}
                    onClick={() => handleBundleSelect(bundle.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2 sm:gap-0">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${selectedBundle === bundle.id ? 'bg-accent text-color-bg-deep' : 'bg-white/10 text-white'}`}>
                          {selectedBundle === bundle.id ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                        </div>
                        <h3 className="text-white font-semibold text-sm md:text-base">{bundle.name}</h3>
                      </div>
                      <span className="text-accent font-heading font-bold text-sm md:text-base">{bundle.price}</span>
                    </div>
                    <ul className="space-y-1.5 md:space-y-2 text-white/60 text-xs md:text-sm">
                      {bundle.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 md:p-6 lg:p-8">
              <h2 className="text-lg md:text-xl font-heading font-semibold text-white mb-2 md:mb-3">Need a guided build?</h2>
              <p className="text-white/60 text-xs md:text-sm mb-3 md:mb-4">
                Book a call with our launch architects and we'll co-create the perfect package in 30 minutes.
              </p>
              <Link href="/contact" className="btn btn-primary inline-flex items-center gap-2 text-sm md:text-base">
                <ClipboardList className="w-4 h-4" /> Schedule Workshop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
    </>
  );
}
