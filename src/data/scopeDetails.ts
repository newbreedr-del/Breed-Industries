/**
 * Scope details per service — timelines and client requirements.
 * Used by the quote PDF generator (server-side) and anywhere else that needs this data.
 */

export interface ScopeDetail {
  timeline: string;
  clientRequirements: string[];
}

export const scopeDetails: Record<string, ScopeDetail> = {
  // ── Compliance ─────────────────────────────────────────────────────────────
  'CIPC Registration': {
    timeline: '2 – 5 Business Days',
    clientRequirements: [
      'Certified copy of ID document (all directors)',
      'Proof of residential address (not older than 3 months)',
      'Three proposed company name options',
      'Signed CIPC forms (provided by Breed Industries)',
    ],
  },
  'Company Registration (CIPC)': {
    timeline: '2 – 5 Business Days',
    clientRequirements: [
      'Certified copy of ID document (all directors)',
      'Proof of residential address (not older than 3 months)',
      'Three proposed company name options',
      'Signed CIPC forms (provided by Breed Industries)',
    ],
  },
  'Tax Compliance': {
    timeline: '3 – 7 Business Days',
    clientRequirements: [
      'CIPC registration certificate (COR 14.3 / COR 15.3)',
      'Certified ID copies of all directors',
      'Proof of business address',
      'Banking details confirmation letter',
    ],
  },
  'SARS Tax Returns': {
    timeline: '3 – 7 Business Days',
    clientRequirements: [
      'IRP5/IT3(a) income tax certificates from employers',
      'Investment income certificates',
      'Medical aid certificates',
      'Retirement annuity certificates',
      'CIPC registration certificate (for company returns)',
      'Certified ID copies of all directors',
    ],
  },
  'Tax Clearance Certificate': {
    timeline: '2 – 5 Business Days',
    clientRequirements: [
      'Tax reference number (company or individual)',
      'Certified ID copy',
      'Reason for tax clearance (tender, emigration, foreign investment)',
      'Proof of all outstanding tax submissions',
    ],
  },
  'BEE Certification': {
    timeline: '5 – 10 Business Days',
    clientRequirements: [
      'Latest financial statements or management accounts',
      'Signed BEE declaration (EME/QSE affidavit)',
      'Payroll records (if applicable)',
      'Skills development records',
    ],
  },
  'CSD Registration': {
    timeline: '3 – 7 Business Days',
    clientRequirements: [
      'CIPC registration certificate (COR 14.3 / COR 15.3)',
      'Tax clearance certificate',
      'BEE certificate or affidavit',
      'Banking details and bank letter',
      'Certified ID copies of all directors',
      'Proof of business address',
    ],
  },
  'COIDA Registration & Assessment': {
    timeline: '5 – 10 Business Days',
    clientRequirements: [
      'CIPC registration documents (COR 14.3 or COR 15.3)',
      'Annual payroll / wage bill (total gross earnings including overtime, bonuses, allowances)',
      'Employee schedule (names, ID numbers, job titles, monthly earnings)',
      'Nature of business / industry classification (SIC code if known)',
      'Number of employees (permanent, temporary, and contract workers)',
      'Director / owner ID copies',
      'Previous COIDA documentation (if renewing or updating)',
    ],
  },
  'CIDB Registration — Grade 1': {
    timeline: '3 – 5 Business Days',
    clientRequirements: [
      'CIPC / CK documents',
      'Director / owner certified ID copies',
      'CSD registration number',
      'Tax clearance certificate or tax compliance pin',
    ],
  },
  'CIDB Registration — Grade 2 to 4': {
    timeline: '7 – 14 Business Days',
    clientRequirements: [
      'CIPC / CK documents',
      'Director / owner certified ID copies',
      'CSD number',
      'Tax clearance certificate',
      'Track record / completed project invoices and completion certificates',
      'Simple financial statements (signed by accountant)',
      'COIDA Letter of Good Standing',
    ],
  },
  'CIDB Registration — Grade 5 to 7': {
    timeline: '14 – 21 Business Days',
    clientRequirements: [
      'CIPC / CK documents',
      'Director / owner certified ID copies',
      'CSD number',
      'Tax clearance certificate',
      'Audited financial statements (showing net asset value and turnover)',
      'Project completion certificates (multi-million Rand value)',
      'COIDA Letter of Good Standing',
      'SARS tax compliance status (all returns up to date)',
    ],
  },
  'CIDB Registration — Grade 8 to 9': {
    timeline: '21 – 30+ Business Days',
    clientRequirements: [
      'CIPC / CK documents and shareholding structure',
      'Director certified ID copies',
      'CSD number',
      'Full audited financial statements (past 2–3 years)',
      'Major project completion certificates at target grade level',
      'COIDA Letter of Good Standing',
      'Full SARS tax compliance',
      'Net asset value and financial capacity analysis',
      'BEE verification certificate',
      'Organogram and key personnel CVs (optional)',
    ],
  },
  'UIF Registration & Compliance Letter': {
    timeline: '3 – 7 Business Days',
    clientRequirements: [
      'CIPC registration documents',
      'Employee details (ID numbers, start dates)',
      'Monthly payroll figures',
      'Employer banking details',
    ],
  },
  'CIPC Annual Return': {
    timeline: '1 – 3 Business Days',
    clientRequirements: [
      'CIPC customer code and password',
      'Current registered office address confirmation',
      'Director changes (if any)',
      'Annual return fee (paid to CIPC)',
    ],
  },

  // ── Branding & Design ──────────────────────────────────────────────────────
  'Basic Logo Design': {
    timeline: '3 – 5 Business Days',
    clientRequirements: [
      'Brand name and tagline (if applicable)',
      'Preferred colours and style references',
      'Industry and target audience description',
      'Any existing brand assets',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Premium Logo Design': {
    timeline: '7 – 10 Business Days',
    clientRequirements: [
      'Detailed brand brief (provided by Breed Industries)',
      'Competitor references and positioning notes',
      'Vision, mission, and values statement',
      'Stakeholder availability for feedback sessions',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Logo Design': {
    timeline: '3 – 5 Business Days',
    clientRequirements: [
      'Brand name and tagline (if applicable)',
      'Preferred colours and style references',
      'Industry and target audience description',
      'Any existing brand assets',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Business Branding': {
    timeline: '5 – 8 Business Days',
    clientRequirements: [
      'Approved logo files',
      'Brand story and company background',
      'Target market demographics',
      'Preferred tone of voice and messaging',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Full Brand Identity': {
    timeline: '7 – 10 Business Days',
    clientRequirements: [
      'Detailed brand brief covering business overview, mission, vision, values',
      'Competitor references and positioning notes',
      'Target market demographics',
      'Style preferences or mood board',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Brand Guidelines': {
    timeline: '5 – 8 Business Days',
    clientRequirements: [
      'Approved logo files in vector format (AI, EPS, or SVG)',
      'Existing brand materials and assets',
      'Brand story and messaging guidelines',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Business Cards (250)': {
    timeline: '5 – 7 Business Days (incl. print)',
    clientRequirements: [
      'Approved logo and brand colours',
      'Contact details for each cardholder',
      'Preferred card stock and finish',
      'Delivery address for printed cards',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Business Cards': {
    timeline: '5 – 7 Business Days (incl. print)',
    clientRequirements: [
      'Approved logo and brand colours',
      'Contact details for each cardholder',
      'Preferred card stock and finish',
      'Delivery address for printed cards',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },

  // ── Flyers & Digital Art ───────────────────────────────────────────────────
  'Simple Social Media Flyer': {
    timeline: '2 – 3 Business Days',
    clientRequirements: [
      'Text content for the flyer (headline, body text, call-to-action)',
      'Logo and brand colors (if available)',
      'High-resolution images to be used in the design (optional)',
      'Preferred social platform size (Instagram, Facebook, etc.)',
      'Style references or examples of designs you like (optional)',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Standard Digital Flyer': {
    timeline: '3 – 5 Business Days',
    clientRequirements: [
      'Complete text content including headline, body, call-to-action, contact details',
      'Logo, brand colors, fonts, and brand guidelines',
      'High-resolution images to be used in the design',
      'Design brief: target audience, design style, tone, and any specific requirements',
      'Examples or inspiration of designs you like (optional)',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Premium Event/Brand Flyer': {
    timeline: '5 – 7 Business Days',
    clientRequirements: [
      'Complete text content for all flyer variations',
      'Complete brand package: logo, colors, fonts, brand guidelines',
      'High-resolution images and graphics to be used',
      'Detailed brief including target audience, event details, design requirements',
      'List of all required sizes (social media, print, web banners, etc.)',
      'Examples, mood boards, or inspiration references (optional)',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Digital Artwork / Graphic Design': {
    timeline: '2 – 4 Business Days',
    clientRequirements: [
      'Description of the artwork or design required',
      'Intended use and platform (social media, print, website, etc.)',
      'Logo and brand guidelines (if applicable)',
      'Any images, icons, or elements to be incorporated',
      'Preferred dimensions or size specifications',
      'Style references or examples of similar work (optional)',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Marketing Materials': {
    timeline: '5 – 10 Business Days',
    clientRequirements: [
      'List of all materials required (e.g. brochure, pull-up banner, poster, product sheet)',
      'Approved brand guidelines (logo, colors, fonts)',
      'All text content and copy for each material',
      'High-resolution images and product photography (if applicable)',
      'Preferred paper stock, finish, and print quantity (for print-ready files)',
      'Distribution format: print, digital, or both',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Album Art Design': {
    timeline: '2 – 4 Business Days',
    clientRequirements: [
      'Album/single title, artist name, genre, mood, and theme of the music',
      'High-resolution artist photo(s) or images to incorporate (optional)',
      'Artist logo, brand colours, or fonts (if applicable)',
      'Examples of album artwork or visual styles you like',
      'Track listing and credits text (for full album packaging)',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Album Art': {
    timeline: '2 – 4 Business Days',
    clientRequirements: [
      'Album/single title, artist name, genre, mood, and theme of the music',
      'High-resolution artist photo(s) or images to incorporate (optional)',
      'Artist logo, brand colours, or fonts (if applicable)',
      'Examples of album artwork or visual styles you like',
      'Track listing and credits text (for full album packaging)',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },

  // ── Digital / Web ──────────────────────────────────────────────────────────
  'Website Development': {
    timeline: '10 – 15 Business Days',
    clientRequirements: [
      'Sitemap and page structure preferences',
      'All text content for each page',
      'High-resolution images and media',
      'Domain name and hosting credentials (or purchase authorisation)',
      'Logo and brand guidelines',
    ],
  },
  'Mobile App Development': {
    timeline: '8 – 12 Weeks',
    clientRequirements: [
      'Detailed feature requirements document',
      'User flow diagrams or wireframes (if available)',
      'API documentation for third-party integrations',
      'App Store / Play Store developer account credentials',
      'Test device availability',
    ],
  },
  'E-commerce Solutions': {
    timeline: '15 – 25 Business Days',
    clientRequirements: [
      'Product catalogue with descriptions, images, and pricing',
      'Payment gateway preferences (PayFast, Stripe, etc.)',
      'Shipping and delivery policies',
      'Domain and hosting details',
      'Business registration for payment gateway setup',
    ],
  },
  'SEO & Digital Marketing': {
    timeline: '7 – 14 Business Days (setup)',
    clientRequirements: [
      'Website access (CMS admin credentials)',
      'Google Analytics and Search Console access',
      'Target keywords and competitor list',
      'Business goals and KPIs',
      'Monthly budget for paid campaigns (if applicable)',
    ],
  },
  'SEO & Digital Marketing (Setup)': {
    timeline: '7 – 14 Business Days',
    clientRequirements: [
      'Website access (CMS admin credentials)',
      'Google Analytics and Search Console access',
      'Target keywords and competitor list',
      'Business goals and KPIs',
    ],
  },
  'SEO & Digital Marketing (Monthly)': {
    timeline: 'Ongoing Monthly',
    clientRequirements: [
      'Website access (CMS admin credentials)',
      'Google Analytics and Search Console access',
      'Target keywords and competitor list',
      'Monthly budget for paid campaigns (if applicable)',
      'Approval workflow and reporting preferences',
    ],
  },
  'Social Media Management': {
    timeline: '3-Month Engagement',
    clientRequirements: [
      'Social media account credentials',
      'Brand guidelines and tone of voice',
      'Product/service images and descriptions',
      'Monthly promotional calendar or events',
      'Approval workflow and turnaround expectations',
    ],
  },
  'Social Media Management (Monthly)': {
    timeline: 'Ongoing Monthly',
    clientRequirements: [
      'Social media account credentials',
      'Brand guidelines and tone of voice',
      'Product/service images and descriptions',
      'Monthly promotional calendar or events',
      'Approval workflow and turnaround expectations',
    ],
  },

  // ── Business Docs ──────────────────────────────────────────────────────────
  'Business Profile - Starter (1–4 Pages)': {
    timeline: '3 – 5 Business Days',
    clientRequirements: [
      'Company overview and history',
      'Services or products offered',
      'Director/owner profiles',
      'Contact details and logo',
    ],
  },
  'Business Profile - Standard (5–10 Pages)': {
    timeline: '5 – 8 Business Days',
    clientRequirements: [
      'Detailed company background and milestones',
      'Full service/product catalogue',
      'Team profiles with photographs',
      'Client references or testimonials',
      'Certifications and compliance documents',
    ],
  },
  'Business Plan - Basic/Entry-Level': {
    timeline: '4 – 7 Business Days',
    clientRequirements: [
      'Business concept and model description',
      'Target market information',
      'Revenue model and pricing strategy',
      'Startup costs estimate',
    ],
  },
  'Business Plan - Standard/Comprehensive': {
    timeline: '8 – 15 Business Days',
    clientRequirements: [
      'Detailed business model and value proposition',
      'Market research data and competitor analysis',
      'Financial records (existing business) or projections',
      '3-year revenue and expense forecasts',
      'Funding requirements and use of funds breakdown',
    ],
  },

  // ── Training Materials ─────────────────────────────────────────────────────
  'Training Workbook / Study Guide': {
    timeline: '7 – 10 Business Days',
    clientRequirements: [
      'Training content outline or existing material',
      'Target learners and qualification level',
      'Number of modules or units',
      'Logo and brand guidelines',
      'Preferred page count or layout style',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  "Facilitator's / Lecturer's Guide": {
    timeline: '5 – 8 Business Days',
    clientRequirements: [
      'Aligned study guide or content outline',
      'Session time allocations per module',
      'Assessment activities and questions per module',
      'Learning outcomes per module',
      'Any specific facilitation notes or instructions',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Training PowerPoint Presentation': {
    timeline: '4 – 6 Business Days',
    clientRequirements: [
      'Training content or speaker notes/script',
      'Logo and brand colors/fonts',
      'Number of slides required (approximate)',
      'Preferred design style or theme',
      'Any existing slides to incorporate (optional)',
      'NOTE: Maximum 3 revision rounds included. Additional revisions billed at R350/hour.',
    ],
  },
  'Full Training Package (All Three)': {
    timeline: '10 – 15 Business Days',
    clientRequirements: [
      'Complete training content outline',
      'Target audience and qualification level',
      'Number of modules',
      'Logo and brand guidelines',
      'Session time allocations per module',
      'Learning outcomes per module',
      'NOTE: Maximum 3 revision rounds included per deliverable. Additional revisions billed at R350/hour.',
    ],
  },

  // ── Tender Services ────────────────────────────────────────────────────────
  'Tender Ready': {
    timeline: '5 – 10 Business Days',
    clientRequirements: [
      'Certified ID copies of all directors',
      'Proof of business address (not older than 3 months)',
      'CIPC registration certificate (if already registered)',
      'Banking confirmation letter / bank statement',
      'Tax reference number (if already registered with SARS)',
      'CIDB discipline(s) your business operates in',
      'BBBEE ownership breakdown percentage',
    ],
  },
  'Tender Watch': {
    timeline: 'Ongoing Monthly — alerts within 24 hours of publication',
    clientRequirements: [
      'Short company profile (industry, services, target market)',
      'Province(s) your business operates in',
      'Industry/commodity categories (construction, IT, cleaning, catering, etc.)',
      'CIDB grade (if applicable)',
      'Maximum contract value your business can handle',
    ],
  },
  'Tender Apply': {
    timeline: 'Ongoing Monthly — submissions before each closing date',
    clientRequirements: [
      'All Tender Watch requirements (above)',
      'CSD registration confirmation number',
      'Current tax clearance certificate / PIN',
      'Valid BEE certificate or sworn affidavit',
      'Certified ID copies of all directors',
      'Signed mandate letter authorising Breed Industries to submit bids on your behalf',
    ],
  },
  'Tender Full Service': {
    timeline: 'Ongoing Monthly — end-to-end from alert to award',
    clientRequirements: [
      'All Tender Apply requirements (above)',
      'Signed Power of Attorney / mandate for site briefing attendance',
      'Representative available for urgent clarifications',
      'Any previous tender submissions or experience references',
      'Company bank statements (3 months)',
    ],
  },
};

/** Fallback scope detail for services not in the map */
export const defaultScopeDetail: ScopeDetail = {
  timeline: '3 – 7 Business Days',
  clientRequirements: [
    'Content and materials as discussed',
    'Timely feedback on deliverables',
  ],
};

export function getScopeDetail(serviceName: string): ScopeDetail {
  return scopeDetails[serviceName] ?? defaultScopeDetail;
}
