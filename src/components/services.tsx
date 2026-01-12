'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, PenTool, Code, Rocket, ChevronRight } from 'lucide-react';

const servicesData = [
  {
    id: 'compliance',
    icon: <Shield className="w-6 h-6" />,
    name: 'Business Setup & Compliance',
    description: 'Get legally compliant and operational fast with end-to-end registrations, certificates, and banking support.',
    tiers: [
      { name: 'Starter', price: 'R550' },
      { name: 'Silver', price: 'R850' },
      { name: 'Gold', price: 'R1,600' },
      { name: 'Platinum', price: 'R2,000' },
      { name: 'Premium', price: 'R2,500' }
    ],
    features: [
      { name: 'CIPC registration & share certificates', description: 'Company name reservation, COR docs, MOI' },
      { name: 'BEE certificate & tax clearance', description: 'SARS profile, pin, and ongoing compliance' },
      { name: 'CSD & CIDB registration', description: 'Grade 1 tenders, supplier onboarding & renewals' },
      { name: 'Professional profiles & business email', description: 'Bank-ready business profile, signature, setup' },
      { name: 'Bank account & funding support', description: 'Letters, documents, and pitch-ready assets' }
    ],
    ctaLink: 'https://wa.me/message/4FOGIOMM2A35L1'
  },
  {
    id: 'branding',
    icon: <PenTool className="w-6 h-6" />,
    name: 'Logo & Branding',
    description: 'Create a magnetic, trustworthy brand identity that stands out in meetings, online, and on the street.',
    tiers: [
      { name: 'Basic', price: 'R750' },
      { name: 'Standard', price: 'R1,150' },
      { name: 'Premium', price: 'R1,650' }
    ],
    features: [
      { name: 'Strategic discovery session', description: 'Industry positioning, tone, and audience insights' },
      { name: 'Custom logo suite', description: 'Primary, secondary, icon mark & colourways' },
      { name: 'Revision rounds', description: 'Guided refinements to nail the final concept' },
      { name: 'Brand roll-out toolkit', description: 'Letterhead, 500 business cards, email signature' },
      { name: 'Launch-ready mockups', description: 'Social, signage, pitch decks & apparel visuals' }
    ],
    ctaLink: 'https://wa.me/message/4FOGIOMM2A35L1'
  },
  {
    id: 'digital',
    icon: <Code className="w-6 h-6" />,
    name: 'Digital & Marketing',
    description: 'Own your digital footprint with tailored websites, portals, video, and monthly marketing that keeps you top of mind.',
    features: [
      { name: 'Video Ad / Pitch (1 min)', description: 'R1,259 – R8,000 · Script, shoot, edit, and sound' },
      { name: 'Basic Website', description: 'R3,000 – R8,000 · Responsive 5-page sites with SEO' },
      { name: 'Custom Web Portal', description: 'R5,000 – R15,000 · Bookings, payments, dashboards' },
      { name: 'Social Media Setup', description: 'R1,500 · Branded profiles, bio, launch content' },
      { name: 'Social Media Management', description: 'R2,000 – R5,000/m · Strategy, design, reporting' },
      { name: 'Business Plan & Portfolio', description: 'R1,190+ · Investor-grade decks & documents' },
      { name: 'Posters & Business Cards', description: 'R550 – R559+ · Print-ready marketing collateral' },
      { name: 'Full Media Kit', description: 'R2,500 · Photography, video, press-ready assets' }
    ],
    ctaLink: 'https://wa.me/message/4FOGIOMM2A35L1'
  },
  {
    id: 'bundles',
    icon: <Rocket className="w-6 h-6" />,
    name: 'All-in-One Bundles',
    description: 'Save time and money with end-to-end packages engineered to launch, scale, and dominate.',
    bundles: [
      {
        name: 'Launch Starter',
        price: 'R2,500 – R4,500',
        features: [
          'Gold compliance setup',
          'Basic logo suite',
          'Posters + business cards'
        ]
      },
      {
        name: 'Growth Professional',
        price: 'R6,000 – R10,000',
        features: [
          'Launch Starter inclusions',
          'Premium logo system',
          'Website + social media setup',
          'Investor-ready business plan'
        ]
      },
      {
        name: 'Empire Premium',
        price: 'R12,000 – R25,000+',
        features: [
          'Growth Professional inclusions',
          'Custom portal + video ad',
          'Full media kit',
          '3 months social management'
        ]
      }
    ],
    ctaLink: 'https://wa.me/message/4FOGIOMM2A35L1'
  }
];

export const Services = () => {
  const [activeTab, setActiveTab] = useState('compliance');
  
  return (
    <section className="py-20 bg-navy relative overflow-hidden" id="services">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,var(--color-gold)_0%,transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,var(--color-gold)_0%,transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">What We Deliver</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-2 mb-4">
            Tap into the category that matches your ambition
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            Explore compliance, branding, digital builds, and bundled offers – each engineered to move you from idea to launch.
          </p>
        </div>
        
        {/* Service Tabs */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-white/10">
            {servicesData.map((service) => (
              <button
                key={service.id}
                className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                  activeTab === service.id 
                    ? 'text-gold border-b-2 border-gold bg-white/5' 
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setActiveTab(service.id)}
              >
                {service.icon}
                <span className="hidden md:inline">{service.name}</span>
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          {servicesData.map((service) => (
            <div
              key={service.id}
              className={`p-6 md:p-8 ${activeTab === service.id ? 'block' : 'hidden'}`}
            >
              <div className="md:flex md:gap-8">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <h3 className="text-2xl font-heading font-bold text-white mb-3">{service.name}</h3>
                  <p className="text-white/70 mb-6">{service.description}</p>
                  
                  {service.tiers && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {service.tiers.map((tier, index) => (
                        <div key={index} className="bg-white/10 px-3 py-2 rounded-lg">
                          <span className="text-white text-sm block">{tier.name}</span>
                          <span className="text-gold font-bold">{tier.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="md:w-2/3">
                  {service.features && (
                    <ul className="space-y-4 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex">
                          <div className="mr-3 mt-1 text-gold">
                            <ChevronRight size={16} />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{feature.name}</h4>
                            <p className="text-sm text-white/70">{feature.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {service.bundles && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {service.bundles.map((bundle, index) => (
                        <div key={index} className="bg-white/10 p-4 rounded-lg">
                          <h4 className="font-bold text-white mb-1">{bundle.name}</h4>
                          <p className="text-gold font-bold mb-3">{bundle.price}</p>
                          <ul className="space-y-2">
                            {bundle.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <div className="mr-2 mt-1 text-gold">
                                  <ChevronRight size={12} />
                                </div>
                                <span className="text-sm text-white/80">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <a 
                  href="#packages" 
                  className="btn btn-outline-light"
                >
                  View Full Details
                </a>
                <a 
                  href={service.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <i className="fab fa-whatsapp mr-2"></i>
                  Request Quote
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
