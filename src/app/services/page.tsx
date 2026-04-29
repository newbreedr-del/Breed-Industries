import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { 
  Shield, Briefcase, Layers, 
  Check, ChevronRight, ArrowRight 
} from 'lucide-react';

// Service categories data
const serviceCategories = [
  {
    id: 'business-setup',
    title: 'Business Setup & Compliance',
    icon: <Shield className="w-8 h-8" />,
    description: 'Complete registration and compliance services to establish your business on solid legal ground.',
    services: [
      { name: 'Company Registration (CIPC)', price: 'From R550' },
      { name: 'Tax Compliance (SARS)', price: 'From R850' },
      { name: 'BEE Certification', price: 'From R250' },
      { name: 'CSD Registration', price: 'R450' },
      { name: 'COID / Letter of Good Standing', price: 'From R850' }
    ]
  },
  {
    id: 'branding',
    title: 'Branding & Identity',
    icon: <Briefcase className="w-8 h-8" />,
    description: 'Strategic brand development that positions your business for recognition and trust in your market.',
    services: [
      { name: 'Logo Design', price: 'From R1,500' },
      { name: 'Business Branding Package', price: 'From R2,500' },
      { name: 'Business Cards (250)', price: 'From R800' },
      { name: 'Simple Social Media Flyer', price: 'From R650' },
      { name: 'Standard Digital Flyer', price: 'From R950' },
      { name: 'Premium Event/Brand Flyer', price: 'From R1,250' },
      { name: 'Digital Artwork / Graphic Design', price: 'From R750' },
      { name: 'Marketing Materials', price: 'From R1,500' }
    ]
  },
  {
    id: 'business-profile',
    title: 'Business Profile & Plans',
    icon: <Shield className="w-8 h-8" />,
    description: 'Professional business profiles and company documents designed to impress stakeholders and support tender submissions.',
    services: [
      { name: 'Business Profile – Starter (1–4 Pages)', price: 'From R850' },
      { name: 'Business Profile – Standard (5–10 Pages)', price: 'From R2,500' },
      { name: 'Business Plan – Basic', price: 'From R1,190' },
      { name: 'Business Plan – Comprehensive', price: 'From R3,000' }
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
  }
];

// Service packages data
const servicePackages = [
  {
    id: 'launch-starter',
    name: 'Launch Essentials',
    price: 'From R3,950',
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
    price: 'From R9,800',
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
    price: 'From R18,500',
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
                <Link 
                  href="/contact"
                  className="btn btn-primary"
                >
                  Book Strategy Call
                </Link>
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
