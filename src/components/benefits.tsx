'use client';

import { motion } from 'framer-motion';
import { Zap, Crown, Users, Gem, Headset } from 'lucide-react';

const benefitsData = [
  {
    id: 'fast-turnaround',
    icon: <Zap className="w-8 h-8" />,
    title: 'Fast Turnaround',
    description: 'Launch in weeks, not months, with streamlined processes and dedicated project leads.'
  },
  {
    id: 'big-league',
    icon: <Crown className="w-8 h-8" />,
    title: 'Big League Look',
    description: 'Premium visuals and technology that rival major agencies without the inflated price tags.'
  },
  {
    id: 'local-expertise',
    icon: <Users className="w-8 h-8" />,
    title: 'Tailored for SA Entrepreneurs',
    description: 'Local expertise in Durban with a nationwide footprint and compliance insight.'
  },
  {
    id: 'professional-results',
    icon: <Gem className="w-8 h-8" />,
    title: 'Professional Results',
    description: 'Every deliverable is crafted to inspire trust and win clients from day one.'
  },
  {
    id: 'easy-support',
    icon: <Headset className="w-8 h-8" />,
    title: 'Easy Quotes & Support',
    description: 'Speak to us directly on WhatsApp for quick answers, clear pricing, and ongoing support.'
  }
];

export const Benefits = () => {
  return (
    <section className="py-20 bg-offWhite" id="benefits">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">Why Breed Industries</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy mt-2 mb-4">
            Everything you need. One powerful partner.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefitsData.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center text-gold mb-6">
                {benefit.icon}
              </div>
              
              <h3 className="text-xl font-heading font-bold text-navy mb-3">{benefit.title}</h3>
              <p className="text-charcoal/80">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a
            href="/about"
            className="inline-flex items-center text-gold hover:text-navy transition-colors font-medium"
          >
            Learn more about our approach
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
