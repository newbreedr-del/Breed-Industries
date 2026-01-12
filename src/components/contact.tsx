'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';

const contactDetails = [
  {
    id: 'phone-primary',
    icon: <Phone className="w-5 h-5" />,
    label: 'Call Us',
    value: '+27 60 496 4105',
    href: 'tel:+27604964105',
    description: 'Speak directly with our launch specialists.'
  },
  {
    id: 'email',
    icon: <Mail className="w-5 h-5" />,
    label: 'Email',
    value: 'info@thebreed.co.za',
    href: 'mailto:info@thebreed.co.za',
    description: 'Send us project briefs or procurement documents.'
  }
];

const officeInfo = [
  {
    id: 'location',
    icon: <MapPin className="w-5 h-5" />,
    title: 'Visit Our Studio',
    subtitle: 'Durban & Johannesburg',
    description: 'Hybrid team supporting founders across South Africa and beyond.'
  },
  {
    id: 'hours',
    icon: <Clock className="w-5 h-5" />,
    title: 'Office Hours',
    subtitle: 'Monday – Friday',
    description: '08:00 – 17:00 SAST · After hours support for retainers.'
  }
];

export const Contact = () => {
  return (
    <section
      id="contact"
      className="relative py-20 bg-gradient-to-br from-offWhite via-white to-offWhite"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-12 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-0 right-24 h-48 w-48 rounded-full bg-navy/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-gold">
                <MessageSquare className="w-4 h-4" /> Contact
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-heading font-bold text-navy">
                Let’s map out your next launch or scale sprint.
              </h2>
              <p className="mt-4 text-lg text-charcoal/80">
                Drop us a message or schedule a strategy session. We’ll respond within one business day with tailored next steps and pricing clarity.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {contactDetails.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  className="group flex flex-col gap-2 rounded-2xl border border-navy/10 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-3 text-navy">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-gold">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wide text-charcoal/60">
                        {item.label}
                      </p>
                      <p className="text-xl font-heading font-semibold group-hover:text-gold">
                        {item.value}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-charcoal/70">{item.description}</p>
                </motion.a>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {officeInfo.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-2xl border border-navy/10 bg-white/80 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 text-navy">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10 text-navy">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wide text-charcoal/60">
                        {item.title}
                      </p>
                      <p className="text-lg font-heading font-semibold text-navy">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-charcoal/70">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gold/40 via-navy/20 to-gold/40 blur-2xl opacity-40" />
            <div className="relative rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl">
              <h3 className="text-2xlhã font-heading font-semibold text-navy">Book a discovery call</h3>
              <p className="mt-2 text-sm text-charcoal/70">
                Tell us about your goals and we’ll prepare a custom roadmap.
              </p>

              <div className="mt-6">
                <ContactForm
                  variant="light"
                  helperText="We’ll follow up within 24 hours. Prefer WhatsApp? Reply directly to our floating chat button."
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
