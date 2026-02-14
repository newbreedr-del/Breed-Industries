"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { ArrowLeft, Play, Film, Megaphone, Palette, Globe, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const deliverables = [
  {
    icon: Film,
    title: 'Brand Video Production',
    description: 'A cinematic ad showcasing Breed Industries\u2019 full production capability, from concept to final cut.',
  },
  {
    icon: Megaphone,
    title: 'Marketing & Campaigns',
    description: 'Strategic digital campaigns, social media content, and promotional material that drives engagement.',
  },
  {
    icon: Palette,
    title: 'Brand Identity & Design',
    description: 'Complete visual identity systems including logos, corporate profiles, stationery, and brand guidelines.',
  },
  {
    icon: Globe,
    title: 'Web & Digital Solutions',
    description: 'Modern, responsive websites and web applications built to convert visitors into clients.',
  },
];

const highlights = [
  'Full-service creative production house based in South Africa',
  'End-to-end brand building \u2014 from strategy to execution',
  'Video production, motion graphics & media content',
  'Corporate compliance documentation & tender-ready profiles',
  'Web development, app design & digital transformation',
  'Trusted by businesses across logistics, construction, tech & energy',
];

export default function StellarCaseStudyPage() {
  return (
    <>
      <Header />

      <PageHero
        title="Breed Industries — What We Do"
        subtitle="Case Study"
        description="An inside look at how Breed Industries empowers businesses through production, branding, digital solutions, and compliance — all under one roof."
        breadcrumbs={[
          { label: 'Portfolio', href: '/portfolio' },
          { label: 'Breed Industries Production', href: '/portfolio/stellar' },
        ]}
      >
        <Link
          href="/portfolio"
          className="btn btn-outline inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
      </PageHero>

      {/* Video Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="glass-card overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  playsInline
                  poster="/assets/images/portfolio/enterprise-success.jpg"
                >
                  <source src="/assets/videos/the-breed-ad.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Play className="w-5 h-5 text-accent" />
                  <span className="text-xs uppercase tracking-[0.3em] text-accent">Video & Media</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
                  The Breed Industries Ad
                </h2>
                <p className="text-white/70 text-base md:text-lg">
                  This video showcases Breed Industries in action \u2014 our production process, creative capabilities, and the results we deliver for our clients. From brand identity to digital solutions, this is what we do.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">Our Capabilities</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Everything Your Business Needs to Compete
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Breed Industries is a full-service creative and compliance agency. We handle production, branding, web development, and business documentation so you can focus on growth.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {deliverables.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-card p-6 md:p-8 flex gap-5"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-accent font-medium text-sm uppercase tracking-wider mb-3">At a Glance</p>
              <h2 className="text-3xl font-heading font-bold text-white mb-8">
                Why Breed Industries
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {highlights.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-6">
            Ready to Build Something Great?
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto mb-8">
            Whether you need a brand video, a new website, compliance documentation, or a full creative overhaul \u2014 Breed Industries has you covered. Let&apos;s talk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary">
              Get in Touch
            </Link>
            <Link href="/lab" className="btn btn-outline">
              Build Custom Package
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
