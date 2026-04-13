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
    basePrice: 'From R3,500',
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
    basePrice: 'From R1,200',
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
    basePrice: 'From R1,200',
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

  // Branding & Identity
  {
    id: 'logo-design',
    category: 'Branding & Identity',
    name: 'Logo Design',
    description: 'Professional logo design with multiple concepts',
    basePrice: 'From R2,500',
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
    basePrice: 'From R5,000',
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
    id: 'business-cards',
    category: 'Branding & Identity',
    name: 'Business Cards',
    description: 'Professional business card design and printing',
    basePrice: 'From R1,200',
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
    id: 'marketing-materials',
    category: 'Branding & Identity',
    name: 'Marketing Materials',
    description: 'Brochures, flyers, posters, and other marketing collateral',
    basePrice: 'From R2,000',
    requiredDocuments: [
      {
        name: 'Content/Copy',
        description: 'Text content for the materials',
        required: true,
        acceptedFormats: ['.pdf', '.doc', '.docx', '.txt']
      },
      {
        name: 'Brand Assets',
        description: 'Logo, images, and brand guidelines',
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
    basePrice: 'R850 - R2,160',
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
    basePrice: 'R2,500 - R4,320',
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
    basePrice: 'From R10,000',
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
    basePrice: 'From R25,000',
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
    basePrice: 'From R15,000',
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
    basePrice: 'From R4,000/mo',
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
    basePrice: 'From R5,000/mo',
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
