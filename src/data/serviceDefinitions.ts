export interface ServiceDocument {
  name: string;
  description: string;
  required: boolean;
  acceptedFormats?: string[];
}

export interface ServiceDefinition {
  id: string;
  category: string;
  name: string;
  description: string;
  basePrice?: string;
  requiredDocuments: ServiceDocument[];
  additionalInfo?: string;
}

export const serviceDefinitions: ServiceDefinition[] = [
  // Business Setup & Compliance
  {
    id: 'company-registration',
    category: 'Business Setup & Compliance',
    name: 'Company Registration (CIPC)',
    description: 'Complete company registration with CIPC including all required documentation',
    basePrice: 'From R550',
    requiredDocuments: [
      {
        name: 'ID Copies',
        description: 'Certified copies of all directors and shareholders IDs',
        required: true,
        acceptedFormats: ['.pdf', '.jpg', '.png']
      },
      {
        name: 'Proof of Address',
        description: 'Recent utility bill or bank statement (not older than 3 months)',
        required: true,
        acceptedFormats: ['.pdf', '.jpg', '.png']
      },
      {
        name: 'Company Name Options',
        description: 'List of 3 preferred company names in order of preference',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Business Description',
        description: 'Brief description of business activities',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      }
    ],
    additionalInfo: 'Processing time: 5-10 business days'
  },
  {
    id: 'cipc-amendments',
    category: 'Business Setup & Compliance',
    name: 'CIPC Amendments & Updates',
    description: 'Update company details, add/remove directors, change registered address, etc.',
    basePrice: 'From R1,500',
    requiredDocuments: [
      {
        name: 'Current CIPC Certificate',
        description: 'Latest company registration certificate',
        required: true,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'CoR14.3 (if applicable)',
        description: 'Current list of directors and shareholders',
        required: false,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'ID Copies',
        description: 'Certified ID copies of new directors/shareholders (if applicable)',
        required: false,
        acceptedFormats: ['.pdf', '.jpg', '.png']
      },
      {
        name: 'Resolution Document',
        description: 'Board resolution authorizing the changes',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx']
      },
      {
        name: 'Amendment Details',
        description: 'Document outlining all requested changes',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      }
    ],
    additionalInfo: 'Processing time: 3-7 business days depending on amendment type'
  },
  {
    id: 'sars-returns',
    category: 'Business Setup & Compliance',
    name: 'SARS Tax Returns',
    description: 'Individual and company tax return preparation and submission',
    basePrice: 'From R850',
    requiredDocuments: [
      {
        name: 'IRP5/IT3(a)',
        description: 'Income tax certificates from employers',
        required: true,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'Bank Statements',
        description: 'Full year bank statements for all accounts',
        required: true,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'Previous Tax Return',
        description: 'Last year\'s tax assessment (ITA34)',
        required: false,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'Medical Aid Certificate',
        description: 'Medical aid tax certificate if applicable',
        required: false,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'Retirement Annuity Certificates',
        description: 'RA contribution certificates if applicable',
        required: false,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'Rental Income/Expenses',
        description: 'Documentation for rental properties if applicable',
        required: false,
        acceptedFormats: ['.pdf', '.xlsx', '.xls']
      },
      {
        name: 'Business Financial Statements',
        description: 'For companies: full financial statements and trial balance',
        required: false,
        acceptedFormats: ['.pdf', '.xlsx', '.xls']
      }
    ],
    additionalInfo: 'Deadline dependent on tax year. Individual returns due by November, company returns vary by year-end.'
  },
  {
    id: 'tax-clearance',
    category: 'Business Setup & Compliance',
    name: 'Tax Clearance Certificate',
    description: 'Obtain tax clearance certificate for tenders and contracts',
    basePrice: 'From R800',
    requiredDocuments: [
      {
        name: 'Tax Number',
        description: 'Company or individual tax reference number',
        required: true,
        acceptedFormats: ['.pdf', '.txt']
      },
      {
        name: 'ID/Registration Certificate',
        description: 'ID copy or company registration certificate',
        required: true,
        acceptedFormats: ['.pdf', '.jpg', '.png']
      },
      {
        name: 'Tax Compliance Status',
        description: 'Latest tax return or SARS correspondence',
        required: true,
        acceptedFormats: ['.pdf']
      }
    ],
    additionalInfo: 'Processing time: 3-5 business days if tax affairs are in order'
  },
  {
    id: 'bee-certification',
    category: 'Business Setup & Compliance',
    name: 'BEE Certification',
    description: 'B-BBEE verification and certification',
    basePrice: 'From R250',
    requiredDocuments: [
      {
        name: 'Company Registration',
        description: 'CIPC registration certificate',
        required: true,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'Shareholder Information',
        description: 'Details of all shareholders with ownership percentages',
        required: true,
        acceptedFormats: ['.pdf', '.xlsx', '.xls']
      },
      {
        name: 'ID Copies',
        description: 'ID copies of all shareholders',
        required: true,
        acceptedFormats: ['.pdf', '.jpg', '.png']
      },
      {
        name: 'Financial Statements',
        description: 'Latest annual financial statements',
        required: false,
        acceptedFormats: ['.pdf']
      }
    ],
    additionalInfo: 'Affidavit or full verification depending on turnover'
  },
  {
    id: 'csd-registration',
    category: 'Business Setup & Compliance',
    name: 'CSD Registration',
    description: 'Central Supplier Database registration for government tenders',
    basePrice: 'R450',
    requiredDocuments: [
      {
        name: 'Company Registration',
        description: 'CIPC certificate',
        required: true,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'Tax Clearance',
        description: 'Valid tax clearance certificate',
        required: true,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'BEE Certificate',
        description: 'B-BBEE certificate or affidavit',
        required: true,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'Bank Confirmation Letter',
        description: 'Letter from bank confirming account details',
        required: true,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'Director ID Copies',
        description: 'Certified ID copies of all directors',
        required: true,
        acceptedFormats: ['.pdf', '.jpg', '.png']
      }
    ],
    additionalInfo: 'Registration valid for 1 year, must be renewed annually'
  },
  {
    id: 'business-bank-account',
    category: 'Business Setup & Compliance',
    name: 'Business Bank Account Setup',
    description: 'Assistance with business bank account application',
    basePrice: 'From R600',
    requiredDocuments: [
      {
        name: 'Company Registration',
        description: 'CIPC certificate',
        required: true,
        acceptedFormats: ['.pdf']
      },
      {
        name: 'Director IDs',
        description: 'Certified ID copies of all directors',
        required: true,
        acceptedFormats: ['.pdf', '.jpg', '.png']
      },
      {
        name: 'Proof of Address',
        description: 'Proof of business and residential address',
        required: true,
        acceptedFormats: ['.pdf', '.jpg', '.png']
      },
      {
        name: 'CoR14.3',
        description: 'List of directors and shareholders',
        required: true,
        acceptedFormats: ['.pdf']
      }
    ],
    additionalInfo: 'We assist with application preparation and booking'
  },
  {
    id: 'coid-registration',
    category: 'Business Setup & Compliance',
    name: 'COID Registration / Letter of Good Standing',
    description: 'Workplace Compensation Fund registration and annual letter of good standing for compliance',
    basePrice: 'From R850',
    requiredDocuments: [
      { name: 'CIPC Registration Documents', description: 'Company registration certificate (COR 14.3 or COR 15.3)', required: true, acceptedFormats: ['.pdf'] },
      { name: 'Payroll Estimate', description: 'Estimated annual payroll amount or current payroll records', required: true, acceptedFormats: ['.pdf', '.xlsx', '.xls', '.doc', '.docx'] },
      { name: 'Business Activities Description', description: 'Nature of business activities and job descriptions of employees', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Employee Count', description: 'Number of employees and their roles', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] }
    ],
    additionalInfo: 'Letter of Good Standing must be renewed annually'
  },
  {
    id: 'uif-registration',
    category: 'Business Setup & Compliance',
    name: 'UIF Registration & Compliance Letter',
    description: 'Unemployment Insurance Fund registration and compliance documentation for employers',
    basePrice: 'From R650',
    requiredDocuments: [
      { name: 'CIPC Registration Documents', description: 'Company registration certificate', required: true, acceptedFormats: ['.pdf'] },
      { name: 'Employee Details', description: 'Full names, ID numbers, and start dates of all employees', required: true, acceptedFormats: ['.pdf', '.xlsx', '.xls', '.doc', '.docx'] },
      { name: 'Monthly Payroll Figures', description: 'Monthly salary breakdown per employee', required: true, acceptedFormats: ['.pdf', '.xlsx', '.xls'] },
      { name: 'Employer Banking Details', description: 'Business bank account details for UIF contributions', required: true, acceptedFormats: ['.pdf', '.jpg', '.png'] }
    ],
    additionalInfo: 'UIF contributions are 2% of gross remuneration (1% employer + 1% employee)'
  },
  {
    id: 'cipc-annual-return',
    category: 'Business Setup & Compliance',
    name: 'CIPC Annual Return',
    description: 'Annual CIPC return filing to maintain company compliance and good standing',
    basePrice: 'From R450',
    requiredDocuments: [
      { name: 'CIPC Customer Code & Password', description: 'Login credentials for CIPC online portal', required: true, acceptedFormats: ['.pdf', '.txt', '.doc', '.docx'] },
      { name: 'Registered Office Address', description: 'Confirmation of current registered business address', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Director Changes (if any)', description: 'Details of any director appointments or resignations since last return', required: false, acceptedFormats: ['.pdf', '.doc', '.docx'] }
    ],
    additionalInfo: 'Annual return fee paid directly to CIPC. Late submissions incur penalties.'
  },

  // Branding & Identity
  {
    id: 'logo-design',
    category: 'Branding & Identity',
    name: 'Logo Design',
    description: 'Professional logo design with multiple concepts',
    basePrice: 'From R1,500',
    requiredDocuments: [
      {
        name: 'Brand Brief',
        description: 'Company information, target audience, style preferences',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Inspiration/Examples',
        description: 'Examples of logos you like (optional)',
        required: false,
        acceptedFormats: ['.pdf', '.jpg', '.png', '.doc', '.docx']
      },
      {
        name: 'Color Preferences',
        description: 'Preferred colors or existing brand colors',
        required: false,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      }
    ],
    additionalInfo: '3 initial concepts, 2 rounds of revisions included'
  },
  {
    id: 'brand-identity',
    category: 'Branding & Identity',
    name: 'Full Brand Identity',
    description: 'Complete brand identity package including logo, colors, typography',
    basePrice: 'From R2,500',
    requiredDocuments: [
      {
        name: 'Brand Strategy Document',
        description: 'Business overview, mission, vision, values, target market',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx']
      },
      {
        name: 'Competitor Analysis',
        description: 'Information about main competitors',
        required: false,
        acceptedFormats: ['.pdf', '.doc', '.docx']
      },
      {
        name: 'Existing Materials',
        description: 'Any existing branding materials if rebranding',
        required: false,
        acceptedFormats: ['.pdf', '.jpg', '.png', '.ai', '.psd']
      }
    ],
    additionalInfo: 'Includes logo, color palette, typography, brand guidelines'
  },
  {
    id: 'brand-guidelines',
    category: 'Branding & Identity',
    name: 'Brand Guidelines',
    description: 'Comprehensive brand guidelines document',
    basePrice: 'From R3,000',
    requiredDocuments: [
      {
        name: 'Logo Files',
        description: 'All logo variations in vector format',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf']
      },
      {
        name: 'Brand Assets',
        description: 'Any existing brand materials and assets',
        required: true,
        acceptedFormats: ['.pdf', '.jpg', '.png', '.ai', '.psd']
      }
    ],
    additionalInfo: 'Detailed usage guidelines for consistent brand application'
  },
  {
    id: 'basic-logo-design',
    category: 'Branding & Identity',
    name: 'Basic Logo Design',
    description: 'Professional logo design with 2 initial concepts and up to 3 revision rounds, delivered in all standard formats',
    basePrice: 'From R1,500',
    requiredDocuments: [
      { name: 'Brand Brief', description: 'Brand name, tagline (if any), industry, and target audience description', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Colour Preferences', description: 'Preferred colours or colour palette references', required: false, acceptedFormats: ['.pdf', '.jpg', '.png', '.txt'] },
      { name: 'Style References', description: 'Examples of logos or styles you like for inspiration', required: false, acceptedFormats: ['.pdf', '.jpg', '.png'] },
      { name: 'Existing Brand Assets', description: 'Any existing logo or brand materials (if rebranding)', required: false, acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png', '.jpg'] }
    ],
    additionalInfo: 'Includes 2 initial concepts and up to 3 revision rounds. Additional revisions billed at R350/hour.'
  },
  {
    id: 'premium-logo-design',
    category: 'Branding & Identity',
    name: 'Premium Logo Design',
    description: 'Advanced logo design with 5 concepts, unlimited revisions, full brand kit including colour palette, typography, and usage guidelines',
    basePrice: 'From R3,500',
    requiredDocuments: [
      { name: 'Brand Brief', description: 'Detailed brand brief covering business overview, mission, vision, values, and target market', required: true, acceptedFormats: ['.pdf', '.doc', '.docx'] },
      { name: 'Competitor References', description: 'Competitor logos and brand positioning notes', required: false, acceptedFormats: ['.pdf', '.doc', '.docx', '.jpg', '.png'] },
      { name: 'Vision & Values Statement', description: 'Company vision, mission, and core values', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Style Preferences', description: 'Mood board, inspiration references, or style guide preferences', required: false, acceptedFormats: ['.pdf', '.jpg', '.png'] }
    ],
    additionalInfo: 'Includes 5 concepts, unlimited revisions, and complete brand kit delivery.'
  },
  {
    id: 'business-branding',
    category: 'Branding & Identity',
    name: 'Business Branding',
    description: 'Comprehensive brand identity package including visual identity, colour palette, typography, and brand usage guidelines',
    basePrice: 'From R2,500',
    requiredDocuments: [
      { name: 'Approved Logo Files', description: 'Final approved logo in vector format (AI, EPS, or SVG)', required: true, acceptedFormats: ['.ai', '.eps', '.svg', '.pdf'] },
      { name: 'Brand Story', description: 'Company background, brand story, and core messaging', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Target Market Profile', description: 'Target market demographics and customer persona details', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Tone of Voice Guidelines', description: 'Preferred tone, language style, and messaging direction', required: false, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] }
    ],
    additionalInfo: 'Deliverables include colour palette, typography guide, brand usage rules, and social media templates.'
  },
  {
    id: 'album-art-design',
    category: 'Branding & Identity',
    name: 'Album Art Design',
    description: 'Custom album cover and artwork design for musicians, DJs, and content creators — including single covers, EP artwork, and full album packaging',
    basePrice: 'From R750',
    requiredDocuments: [
      { name: 'Project Brief', description: 'Album/single title, artist name, genre, mood, and theme of the music', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Artist Photo or Images', description: 'High-resolution artist photo(s) or images to be incorporated (optional)', required: false, acceptedFormats: ['.jpg', '.jpeg', '.png', '.tiff', '.raw'] },
      { name: 'Brand Assets', description: 'Artist logo, existing brand colours, or fonts (if applicable)', required: false, acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png', '.jpg'] },
      { name: 'Style References', description: 'Examples of album artwork or visual styles you like for inspiration', required: false, acceptedFormats: ['.pdf', '.jpg', '.png'] },
      { name: 'Track Listing', description: 'Track listing and credits text to appear on artwork (for full album packaging)', required: false, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] }
    ],
    additionalInfo: 'Delivered in high-res print-ready format (3000x3000px) and digital formats. Includes up to 3 revision rounds.'
  },
  {
    id: 'business-cards',
    category: 'Branding & Identity',
    name: 'Business Cards',
    description: 'Professional business card design and printing',
    basePrice: 'From R800',
    requiredDocuments: [
      {
        name: 'Logo Files',
        description: 'Company logo in high resolution',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png']
      },
      {
        name: 'Contact Information',
        description: 'All details to appear on cards',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Brand Colors',
        description: 'Brand color codes if available',
        required: false,
        acceptedFormats: ['.pdf', '.txt']
      }
    ],
    additionalInfo: 'Includes design and printing of 250 cards'
  },
  {
    id: 'flyer-simple',
    category: 'Branding & Identity',
    name: 'Simple Social Media Flyer',
    description: 'Single size, single concept digital flyer for social media',
    basePrice: 'From R650',
    requiredDocuments: [
      {
        name: 'Content/Copy',
        description: 'Text content for the flyer (headline, body text, call-to-action)',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Brand Assets',
        description: 'Logo and brand colors (if available)',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png', '.jpg']
      },
      {
        name: 'Images/Photos',
        description: 'High-resolution images to be used in the design',
        required: false,
        acceptedFormats: ['.jpg', '.png', '.tiff']
      },
      {
        name: 'Design Preferences',
        description: 'Style references or examples of designs you like',
        required: false,
        acceptedFormats: ['.pdf', '.jpg', '.png', '.doc', '.docx']
      }
    ],
    additionalInfo: '1 concept, 1 size (optimized for Instagram/Facebook), delivered in JPG/PNG format'
  },
  {
    id: 'flyer-standard',
    category: 'Branding & Identity',
    name: 'Standard Digital Flyer',
    description: 'Professional digital flyer with multiple concepts and revisions',
    basePrice: 'From R950',
    requiredDocuments: [
      {
        name: 'Content/Copy',
        description: 'Complete text content including headline, body, call-to-action, contact details',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Brand Assets',
        description: 'Logo, brand colors, fonts, and brand guidelines',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png', '.jpg']
      },
      {
        name: 'Images/Photos',
        description: 'High-resolution images to be used in the design',
        required: true,
        acceptedFormats: ['.jpg', '.png', '.tiff']
      },
      {
        name: 'Design Brief',
        description: 'Target audience, design style, tone, and any specific requirements',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Design Preferences',
        description: 'Examples or inspiration of designs you like',
        required: false,
        acceptedFormats: ['.pdf', '.jpg', '.png', '.doc', '.docx']
      }
    ],
    additionalInfo: '2 initial concepts, 2 revision rounds, delivered in multiple formats (JPG, PNG, PDF)'
  },
  {
    id: 'flyer-premium',
    category: 'Branding & Identity',
    name: 'Premium Event/Brand Flyer',
    description: 'High-end flyer design with multiple sizes and comprehensive brand work',
    basePrice: 'From R1,250',
    requiredDocuments: [
      {
        name: 'Content/Copy',
        description: 'Complete text content for all flyer variations',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Brand Assets',
        description: 'Complete brand package: logo, colors, fonts, brand guidelines',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png', '.jpg']
      },
      {
        name: 'Images/Photos',
        description: 'High-resolution images and graphics to be used',
        required: true,
        acceptedFormats: ['.jpg', '.png', '.tiff', '.psd']
      },
      {
        name: 'Design Brief',
        description: 'Detailed brief including target audience, event details, design requirements',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx']
      },
      {
        name: 'Size Requirements',
        description: 'List of all required sizes (social media, print, web banners, etc.)',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Design Preferences',
        description: 'Examples, mood boards, or inspiration references',
        required: false,
        acceptedFormats: ['.pdf', '.jpg', '.png', '.doc', '.docx']
      }
    ],
    additionalInfo: 'Multiple concepts, unlimited revisions, multiple sizes (social media, print, web), delivered in all formats including source files'
  },
  {
    id: 'digital-artwork',
    category: 'Branding & Identity',
    name: 'Digital Artwork / Graphic Design',
    description: 'Custom digital artwork and graphic design for social media, banners, thumbnails, event graphics, or branded visuals',
    basePrice: 'From R750',
    requiredDocuments: [
      {
        name: 'Design Brief',
        description: 'Description of the artwork or design required and its intended use',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Brand Assets',
        description: 'Logo and brand guidelines (colors, fonts) if applicable',
        required: false,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png', '.jpg']
      },
      {
        name: 'Reference Images / Elements',
        description: 'Any images, icons, or graphic elements to be incorporated into the design',
        required: false,
        acceptedFormats: ['.jpg', '.png', '.svg', '.pdf']
      },
      {
        name: 'Size Specifications',
        description: 'Preferred dimensions or platform specifications (e.g. 1080x1080 for Instagram)',
        required: false,
        acceptedFormats: ['.pdf', '.txt', '.doc', '.docx']
      },
      {
        name: 'Style References',
        description: 'Examples or references of similar work you like (optional)',
        required: false,
        acceptedFormats: ['.jpg', '.png', '.pdf', '.url']
      }
    ],
    additionalInfo: 'Price varies based on complexity. Includes up to 3 revision rounds. Delivered in JPG, PNG, and PDF formats. Source files available on request.'
  },
  {
    id: 'marketing-materials',
    category: 'Branding & Identity',
    name: 'Marketing Materials',
    description: 'Brochures, flyers, posters, and other marketing collateral',
    basePrice: 'From R1,500',
    requiredDocuments: [
      {
        name: 'Materials List',
        description: 'List of all materials required (e.g. brochure, pull-up banner, poster, product sheet)',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Content/Copy',
        description: 'All text content and copy for each material',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Brand Assets',
        description: 'Approved brand guidelines: logo, colors, fonts',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png', '.jpg']
      },
      {
        name: 'Images/Photos',
        description: 'High-resolution images to be used',
        required: false,
        acceptedFormats: ['.jpg', '.png', '.tiff']
      }
    ],
    additionalInfo: 'Price varies based on complexity and quantity'
  },

  // Business Profile
  {
    id: 'business-profile-starter',
    category: 'Business Profile',
    name: 'Business Profile - Starter (1-4 Pages)',
    description: 'Professional business profile for tenders and presentations',
    basePrice: 'From R850',
    requiredDocuments: [
      {
        name: 'Company Information',
        description: 'Company overview, history, services/products',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Logo and Branding',
        description: 'Company logo and brand assets',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png']
      },
      {
        name: 'Team Information',
        description: 'Key team members, qualifications, photos',
        required: false,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.jpg', '.png']
      },
      {
        name: 'Previous Work',
        description: 'Portfolio items, case studies, testimonials',
        required: false,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.jpg', '.png']
      }
    ],
    additionalInfo: 'Ideal for small businesses and startups'
  },
  {
    id: 'business-profile-standard',
    category: 'Business Profile',
    name: 'Business Profile - Standard (5-10 Pages)',
    description: 'Comprehensive business profile with detailed information',
    basePrice: 'From R2,500',
    requiredDocuments: [
      {
        name: 'Company Information',
        description: 'Detailed company overview, history, mission, vision',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx']
      },
      {
        name: 'Logo and Branding',
        description: 'All brand assets and guidelines',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png']
      },
      {
        name: 'Team Profiles',
        description: 'Detailed profiles of key team members',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.jpg', '.png']
      },
      {
        name: 'Portfolio/Case Studies',
        description: 'Detailed project examples and success stories',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.jpg', '.png']
      },
      {
        name: 'Certifications',
        description: 'Company certifications, accreditations, awards',
        required: false,
        acceptedFormats: ['.pdf', '.jpg', '.png']
      }
    ],
    additionalInfo: 'Perfect for tender submissions and corporate presentations'
  },

  // Digital Solutions
  {
    id: 'website-development',
    category: 'Digital Solutions',
    name: 'Website Development',
    description: 'Custom website design and development',
    basePrice: 'From R5,000',
    requiredDocuments: [
      {
        name: 'Website Brief',
        description: 'Purpose, target audience, features required, examples',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx']
      },
      {
        name: 'Content',
        description: 'Text content for all pages',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Brand Assets',
        description: 'Logo, colors, fonts, images',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png', '.jpg']
      },
      {
        name: 'Domain Information',
        description: 'Existing domain or preferred domain name',
        required: false,
        acceptedFormats: ['.pdf', '.txt']
      },
      {
        name: 'Inspiration Sites',
        description: 'Examples of websites you like',
        required: false,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      }
    ],
    additionalInfo: 'Includes responsive design, hosting setup, and basic SEO'
  },
  {
    id: 'mobile-app-development',
    category: 'Digital Solutions',
    name: 'Mobile App Development',
    description: 'iOS and Android mobile application development',
    basePrice: 'From R15,000',
    requiredDocuments: [
      {
        name: 'App Specification',
        description: 'Detailed app requirements, features, user flows',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx']
      },
      {
        name: 'Design Mockups',
        description: 'UI/UX designs if available',
        required: false,
        acceptedFormats: ['.pdf', '.fig', '.xd', '.sketch', '.png']
      },
      {
        name: 'Brand Assets',
        description: 'Logo, colors, brand guidelines',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png']
      },
      {
        name: 'API Documentation',
        description: 'If integrating with existing systems',
        required: false,
        acceptedFormats: ['.pdf', '.doc', '.docx']
      }
    ],
    additionalInfo: 'Price varies based on complexity. Includes both iOS and Android'
  },
  {
    id: 'ecommerce-solutions',
    category: 'Digital Solutions',
    name: 'E-commerce Solutions',
    description: 'Online store setup and development',
    basePrice: 'From R8,000',
    requiredDocuments: [
      {
        name: 'Product Information',
        description: 'Product catalog, descriptions, pricing',
        required: true,
        acceptedFormats: ['.pdf', '.xlsx', '.xls', '.csv']
      },
      {
        name: 'Product Images',
        description: 'High-quality product photos',
        required: true,
        acceptedFormats: ['.jpg', '.png']
      },
      {
        name: 'Brand Assets',
        description: 'Logo, colors, brand guidelines',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png']
      },
      {
        name: 'Payment Gateway Info',
        description: 'Preferred payment methods and gateway details',
        required: false,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Shipping Information',
        description: 'Shipping zones, rates, and policies',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.xlsx']
      }
    ],
    additionalInfo: 'Includes payment gateway integration and inventory management'
  },
  {
    id: 'seo-digital-marketing',
    category: 'Digital Solutions',
    name: 'SEO & Digital Marketing',
    description: 'Search engine optimization and digital marketing services',
    basePrice: 'From R2,500/mo',
    requiredDocuments: [
      {
        name: 'Website Access',
        description: 'Login credentials for website and analytics',
        required: true,
        acceptedFormats: ['.pdf', '.txt']
      },
      {
        name: 'Target Keywords',
        description: 'Keywords and phrases you want to rank for',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.xlsx', '.txt']
      },
      {
        name: 'Competitor Information',
        description: 'Main competitors and their websites',
        required: false,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Brand Assets',
        description: 'Logo and brand materials for content creation',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png']
      }
    ],
    additionalInfo: 'Monthly service includes SEO optimization, content creation, and reporting'
  },
  {
    id: 'social-media-management',
    category: 'Digital Solutions',
    name: 'Social Media Management',
    description: 'Professional social media management and content creation',
    basePrice: 'From R3,500/mo',
    requiredDocuments: [
      {
        name: 'Social Media Access',
        description: 'Login credentials for all social media accounts',
        required: true,
        acceptedFormats: ['.pdf', '.txt']
      },
      {
        name: 'Brand Guidelines',
        description: 'Brand voice, tone, and visual guidelines',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx']
      },
      {
        name: 'Content Calendar',
        description: 'Important dates, events, promotions',
        required: false,
        acceptedFormats: ['.pdf', '.xlsx', '.xls']
      },
      {
        name: 'Brand Assets',
        description: 'Logo, images, videos for content creation',
        required: true,
        acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png', '.jpg', '.mp4']
      }
    ],
    additionalInfo: 'Includes content creation, posting, engagement, and monthly reporting'
  },

  // Training & Learning Materials
  {
    id: 'training-workbook',
    category: 'Business Documents & Training',
    name: 'Training Workbook / Study Guide',
    description: 'Professionally designed learner workbook or study guide (15–30 pages) with content layout, branded design, and print-ready PDF',
    basePrice: 'From R2,800',
    requiredDocuments: [
      { name: 'Content Outline', description: 'Training content outline or existing raw material', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Brand Assets', description: 'Logo and brand guidelines (colors, fonts)', required: false, acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png'] },
      { name: 'Learner Profile', description: 'Target learners, qualification level, and number of modules', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] }
    ],
    additionalInfo: 'Includes up to 3 revision rounds. Delivered as print-ready PDF and editable source file.'
  },
  {
    id: 'training-facilitator',
    category: 'Business Documents & Training',
    name: "Facilitator's / Lecturer's Guide",
    description: "Matching facilitator guide with session notes, instructions, assessment tools, and facilitation tips aligned with the study guide",
    basePrice: 'From R2,500',
    requiredDocuments: [
      { name: 'Study Guide / Content Outline', description: 'Aligned study guide or detailed content outline', required: true, acceptedFormats: ['.pdf', '.doc', '.docx'] },
      { name: 'Session Plan', description: 'Session time allocations and learning outcomes per module', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Assessment Activities', description: 'Questions, activities, and assessment criteria', required: false, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] }
    ],
    additionalInfo: 'Includes up to 3 revision rounds. Best paired with the Training Workbook.'
  },
  {
    id: 'training-ppt',
    category: 'Business Documents & Training',
    name: 'Training PowerPoint Presentation',
    description: 'Branded, professional PowerPoint presentation (20–30 slides) aligned to your training programme with custom graphics and layouts',
    basePrice: 'From R1,800',
    requiredDocuments: [
      { name: 'Content / Script', description: 'Training content, speaker notes, or script per slide', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt', '.pptx'] },
      { name: 'Brand Assets', description: 'Logo, brand colors, and fonts', required: true, acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png'] },
      { name: 'Existing Slides', description: 'Any existing slides to incorporate or use as reference', required: false, acceptedFormats: ['.pptx', '.ppt', '.pdf'] }
    ],
    additionalInfo: 'Includes up to 3 revision rounds. Delivered as editable .pptx and PDF export.'
  },
  {
    id: 'training-full',
    category: 'Business Documents & Training',
    name: 'Full Training Package (All Three)',
    description: 'Complete training package: Study Guide + Facilitator Guide + PowerPoint Presentation. Best value for full programme delivery.',
    basePrice: 'From R6,500',
    requiredDocuments: [
      { name: 'Training Content Outline', description: 'Complete training content outline for all modules', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Brand Assets', description: 'Logo and brand guidelines', required: true, acceptedFormats: ['.ai', '.eps', '.svg', '.pdf', '.png'] },
      { name: 'Session Plan', description: 'Session time allocations and learning outcomes per module', required: true, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] },
      { name: 'Assessment Materials', description: 'Assessment questions, activities, and criteria', required: false, acceptedFormats: ['.pdf', '.doc', '.docx', '.txt'] }
    ],
    additionalInfo: 'Saves R600 vs purchasing separately. Up to 3 revision rounds per deliverable. All files delivered print-ready and editable.'
  }
];

export const getServiceById = (id: string): ServiceDefinition | undefined => {
  return serviceDefinitions.find(service => service.id === id);
};

export const getServicesByCategory = (category: string): ServiceDefinition[] => {
  return serviceDefinitions.filter(service => service.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(serviceDefinitions.map(service => service.category)));
};
