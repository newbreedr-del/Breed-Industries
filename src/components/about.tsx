'use client';

import { motion } from 'framer-motion';
import { Rocket, Shield, Sparkles, Users, Globe2 } from 'lucide-react';

const highlights = [
  {
    id: 'mission',
    icon: <Rocket className="w-8 h-8 text-gold" />,
    title: 'Mission-Driven Growth',
    description:
      'We exist to help South African entrepreneurs launch credible, compliant businesses that scale fast.'
  },
  {
    id: 'compliance',
    icon: <Shield className="w-8 h-8 text-gold" />,
    title: 'Compliance Specialists',
    description:
      'CIDB, CSD, SARS, and CIPC registrations handled end-to-end so you can move from paperwork to progress.'
  },
  {
    id: 'experience',
    icon: <Users className="w-8 h-8 text-gold" />,
    title: 'Seasoned Team',
    description:
      'A cross-disciplinary squad of strategists, designers, developers, and compliance experts.'
  },
  {
    id: 'innovation',
    icon: <Sparkles className="w-8 h-8 text-gold" />,
    title: 'Design-Led Innovation',
    description:
      'We blend modern branding with cutting-edge tech to create unforgettable customer journeys.'
  }
];

const impactMetrics = [
  {
    label: 'Businesses Launched',
    value: '450+',
    detail: 'Across finance, retail, healthcare, and public sectors.'
  },
  {
    label: 'Avg. Launch Timeline',
    value: '21 days',
    detail: 'From onboarding to a compliant, brand-ready venture.'
  },
  {
    label: 'Team Hubs',
    value: 'Johannesburg & Durban',
    detail: 'Serving clients across Africa and beyond.'
  }
];

export const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-navy via-navy/95 to-navy-light/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-gold/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 right-0 w-80 h-80 bg-gold/10 blur-3xl rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-lg"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-gold">
              <Globe2 className="w-4 h-4" /> Breed Industries
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-heading font-bold text-white leading-tight">
              Building compliant, investment-ready brands for the African market.
            </h2>
            <p className="mt-4 text-white/70 text-lg">
              Breed Industries was founded to close the gap between visionary founders and the operational muscle they need to compete. From register-to-market launch programs to premium brand systems and digital products, we deliver outcomes that earn trust, unlock contracts, and accelerate growth.
            </p>
            <p className="mt-4 text-white/70">
              Every engagement is anchored in strategy, stakeholder empathy, and measurable ROI—because credible companies do more than look the part, they outperform it.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {highlights.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/40">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-heading font-semibold text-lg">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-lg"
          >
            <h3 className="text-white font-heading font-semibold text-2xl">
              Our impact in numbers
            </h3>
            <p className="mt-3 text-white/60 text-sm">
              We combine deep compliance expertise with modern design and technology to move founders from idea to impact in record time.
            </p>

            <div className="mt-8 space-y-6">
              {impactMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-5"
                >
                  <p className="text-gold text-sm font-medium uppercase tracking-wide">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-heading font-bold text-white mt-1">
                    {metric.value}
                  </p>
                  <p className="text-white/60 text-sm">
                    {metric.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
