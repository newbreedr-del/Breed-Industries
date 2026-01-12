'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';

const packageData = [
  {
    id: 'launch',
    name: 'Launch Starter',
    price: 'R2,500 - R4,500',
    description: 'Perfect for new businesses looking to establish a professional foundation.',
    features: [
      'Business Registration (Gold level)',
      'Basic branding essentials',
      'Marketing materials (cards or posters)',
    ],
    popular: false,
    ctaText: 'Get Launch Starter',
    ctaLink: 'https://wa.me/27604964105?text=Hi!%20I\'m%20interested%20in%20the%20Launch%20Starter%20package'
  },
  {
    id: 'growth',
    name: 'Growth Professional',
    price: 'R6,000 - R10,000',
    description: 'For businesses ready to expand their market presence and digital footprint.',
    features: [
      'All Launch Starter inclusions',
      'Enhanced branding (Standard/Premium logo)',
      'Web presence (5-10 page website)',
      'App development: Custom build',
      'Digital marketing: Social setup',
      'Strategic documents (business plan or portfolio)',
    ],
    popular: true,
    ctaText: 'Get Growth Professional',
    ctaLink: 'https://wa.me/27604964105?text=Hi!%20I\'m%20interested%20in%20the%20Growth%20Professional%20package'
  },
  {
    id: 'empire',
    name: 'Empire Premium',
    price: 'R12,000 - R25,000+',
    description: 'The complete solution for established businesses aiming for market dominance.',
    features: [
      'All Growth Professional inclusions',
      'Advanced tech (web portal or app)',
      'Video marketing (1-minute ad)',
      'Comprehensive branding (full media kit)',
      'Ongoing support (3 months social)',
      'Compliance add-ons included',
    ],
    popular: false,
    ctaText: 'Get Empire Premium',
    ctaLink: 'https://wa.me/27604964105?text=Hi!%20I\'m%20interested%20in%20the%20Empire%20Premium%20package'
  }
];

export const Packages = () => {
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);
  
  return (
    <section className="py-20 bg-navy relative overflow-hidden" id="packages">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,var(--color-gold)_0%,transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,var(--color-gold)_0%,transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">Signature Bundles</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-2 mb-4">
            Packages engineered for every growth stage
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            Strategic combinations of compliance, branding, and digital tools designed to meet you where you are and propel you forward fast.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packageData.map((pkg) => (
            <motion.div
              key={pkg.id}
              className={`relative bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-8 transition-all duration-300 ${
                pkg.popular ? 'md:-mt-4 md:mb-4' : ''
              }`}
              onMouseEnter={() => setHoveredPackage(pkg.id)}
              onMouseLeave={() => setHoveredPackage(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              {pkg.popular && (
                <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold text-navy text-sm font-medium py-1 px-4 rounded-full">
                  Most Popular
                </span>
              )}
              
              <h3 className="text-2xl font-heading font-bold text-white mb-2">{pkg.name}</h3>
              <p className="text-gold text-3xl font-bold mb-4">{pkg.price}</p>
              <p className="text-white/70 mb-6">{pkg.description}</p>
              
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-gold">
                      <Check size={16} />
                    </span>
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a
                href={pkg.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center py-3 px-6 rounded-md font-medium transition-all duration-300 ${
                  pkg.popular || hoveredPackage === pkg.id
                    ? 'bg-gold text-navy'
                    : 'bg-white/10 text-white hover:bg-gold hover:text-navy'
                }`}
              >
                <span>{pkg.ctaText}</span>
                <ChevronRight size={16} className="ml-1" />
              </a>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a
            href="/pricing"
            className="inline-flex items-center text-gold hover:text-white transition-colors"
          >
            <span>View detailed pricing</span>
            <ChevronRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
};
