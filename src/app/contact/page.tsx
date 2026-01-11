import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

const contactChannels = [
  {
    icon: <Phone className="w-5 h-5" />,
    title: 'Call Us',
    value: '068 503 7221',
    href: 'tel:+27685037221',
    description: 'Speak directly with our launch specialists Monday – Friday.',
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: 'Partnerships',
    value: '081 307 4708',
    href: 'tel:+27813074708',
    description: 'Collaborations and strategic alliances.',
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: 'Email',
    value: 'info@thebreed.co.za',
    href: 'mailto:info@thebreed.co.za',
    description: 'Send us proposals, procurement briefs, or RFPs.',
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />

      <PageHero
        title="Let’s Talk"
        subtitle="Contact Breed Industries"
        description="Tell us about your launch timeline, compliance needs, and growth ambitions. We’ll respond within one business day."
        breadcrumbs={[{ label: 'Contact', href: '/contact' }]}
        align="left"
      >
        <div className="flex flex-wrap gap-4">
          <Link href="tel:+27685037221" className="btn btn-primary inline-flex items-center gap-2">
            <Phone className="w-4 h-4" /> Call Now
          </Link>
          <Link href="https://wa.me/27685037221" className="btn btn-outline">
            <MessageSquare className="w-4 h-4" /> WhatsApp
          </Link>
        </div>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-xl font-heading font-semibold text-white mb-6">Contact Channels</h2>
              <div className="space-y-6">
                {contactChannels.map((channel) => (
                  <a
                    key={channel.title}
                    href={channel.href}
                    className="group flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-accent transition-colors"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                      {channel.icon}
                    </span>
                    <div>
                      <p className="text-white font-semibold">{channel.title}</p>
                      <p className="text-accent font-heading font-bold text-lg group-hover:text-accent/90">
                        {channel.value}
                      </p>
                      <p className="text-white/60 text-sm">{channel.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-white font-semibold">Studio Locations</p>
                  <p className="text-white/60 text-sm">Durban & Johannesburg · Serving clients across Africa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-white font-semibold">Office Hours</p>
                  <p className="text-white/60 text-sm">Mondays – Fridays · 08:00 – 17:00 SAST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-heading font-semibold text-white mb-6">Send Us a Message</h2>
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="text-white/70 text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ayanda M."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
                />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="text-white/70 text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.co.za"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-white/70 text-sm font-medium">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+27 68 503 7221"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="text-white/70 text-sm font-medium">
                  How can we help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Share your compliance requirements, launch date, and target outcomes."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center gap-2">
                <Send className="w-4 h-4" /> Submit Enquiry
              </button>
              <p className="text-white/50 text-xs text-center">
                We’ll respond within one business day. After-hours? WhatsApp us using the floating button.
              </p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
