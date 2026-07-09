'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  GraduationCap, CheckCircle2, ChevronRight, ArrowRight,
  Target, BookOpen, TrendingUp, MapPin, Clock, Award,
  Users, Briefcase, Lightbulb, Star, Shield, Zap
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function LearnersToLeaders() {
  return (
    <>
      <Header />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero/lobby.jpg"
            alt="ICDT Complex, Ntuzuma"
            fill
            priority
            className="object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-color-bg-deep/90" />
        <div className="absolute inset-0 grid-overlay grid-overlay-animated" />

        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/8 blur-3xl rounded-full" />
        </div>

        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <motion.div
            className="absolute top-[18%] left-[6%] text-accent/15"
            animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GraduationCap size={72} />
          </motion.div>
          <motion.div
            className="absolute bottom-[16%] right-[6%] text-accent/15"
            animate={{ y: [0, 14, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TrendingUp size={64} />
          </motion.div>
          <motion.div
            className="absolute top-[38%] right-[9%] text-accent/10"
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Star size={50} />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 rounded-full px-5 py-2 mb-6"
              {...fadeUp(0)}
            >
              <GraduationCap className="w-4 h-4 text-accent" />
              <span className="text-accent text-xs uppercase tracking-widest font-medium">
                QCTO-Accredited · Community Initiative · Ntuzuma, Durban
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight"
              {...fadeUp(0.1)}
            >
              Learners to{' '}
              <span className="text-gradient-gold">Leaders</span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
              {...fadeUp(0.2)}
            >
              A 6-month Business Development Programme that transforms emerging entrepreneurs from
              Ntuzuma and surrounding communities into fundable, market-ready business owners,
              backed by accredited training and real procurement pathways.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              {...fadeUp(0.3)}
            >
              <Link href="/contact" className="btn btn-primary">
                Apply for Next Cohort
                <ChevronRight size={16} className="ml-1" />
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Partnership Enquiry
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </motion.div>
          </div>

          {/* Stat Strip */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            {...fadeUp(0.4)}
          >
            {[
              { value: '32', label: 'NQF Credits', icon: <Award className="w-5 h-5 text-accent" /> },
              { value: '6', label: 'Month Programme', icon: <Clock className="w-5 h-5 text-accent" /> },
              { value: 'QCTO', label: 'Accredited', icon: <Shield className="w-5 h-5 text-accent" /> },
              { value: '3', label: 'Lead Partners', icon: <Users className="w-5 h-5 text-accent" /> },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-5 text-center flex flex-col items-center gap-2"
              >
                {stat.icon}
                <span className="text-3xl font-heading font-bold text-white">{stat.value}</span>
                <span className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── WHAT IS L2L ─────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div className="relative" {...fadeUp(0)}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/assets/images/l2l/community-classroom.png"
                  alt="Learners to Leaders classroom session at ICDT Complex, Ntuzuma"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 glass-card-accent p-5 rounded-xl max-w-[200px]">
                <p className="text-accent font-heading font-bold text-2xl mb-0.5">100%</p>
                <p className="text-white/70 text-xs leading-tight">Community-focused delivery at ICDT Complex</p>
              </div>

            </motion.div>

            {/* Text */}
            <motion.div {...fadeUp(0.1)}>
              <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">
                About the Programme
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                Built for the Ntuzuma Community.{' '}
                <span className="text-accent">Backed by Accreditation.</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                The Learners to Leaders Business Development Programme (L2L) was designed to close
                the gap between entrepreneurial potential and business reality in the Ntuzuma
                community and greater eThekwini region. Many aspiring entrepreneurs have the ideas
                and drive, what they lack is structure, skills, and a credible pathway to funding
                and procurement.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                L2L provides that pathway through a QCTO-accredited New Venture Creation curriculum
                (32 NQF credits), delivered at the ICDT Complex, 20 Ntuzuma Accent Road, in
                partnership with Kuenta Solutions and the GoBizz Platform.
              </p>
              <ul className="space-y-3">
                {[
                  'QCTO-accredited New Venture Creation qualification',
                  'Delivered at ICDT Complex, Ntuzuma, accessible to the community',
                  'Real procurement and investor connections at graduation',
                  'GoBizz digital platform access throughout the programme',
                  'Post-programme incubation and business support',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-white/70 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PROGRAMME JOURNEY ────────────────────────────────── */}
      <section className="py-24 bg-color-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay grid-overlay-half" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/4 blur-3xl rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="text-center mb-16" {...fadeUp(0)}>
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">The Journey</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Three Stages. One Transformation.
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              From your first assessment to standing in front of investors, every step is
              structured, supported, and accredited.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Target className="w-7 h-7 text-accent" />,
                title: 'Assess & Enroll',
                color: 'from-accent/10 to-transparent',
                description:
                  'Every learner begins with a business readiness assessment to match them to the right cohort. Once confirmed, enrolment into the QCTO-accredited New Venture Creation curriculum begins.',
                items: [
                  'Business Readiness Assessment',
                  'Needs & Skills Evaluation',
                  'QCTO Curriculum Intake',
                  '32 NQF Credit Registration',
                  'Cohort Placement & Onboarding',
                ],
              },
              {
                step: '02',
                icon: <BookOpen className="w-7 h-7 text-accent" />,
                title: 'Train & Build',
                color: 'from-blue-500/8 to-transparent',
                description:
                  'A 6-month intensive programme delivering business fundamentals, financial literacy, digital business tools, and weekly mentorship sessions from industry practitioners.',
                items: [
                  'Business Management Fundamentals',
                  'Financial Literacy & Projections',
                  'Marketing & Customer Acquisition',
                  'GoBizz Platform Setup & Training',
                  'Industry Mentorship Sessions',
                ],
              },
              {
                step: '03',
                icon: <TrendingUp className="w-7 h-7 text-accent" />,
                title: 'Pitch & Launch',
                color: 'from-green-500/8 to-transparent',
                description:
                  'Graduates pitch their businesses to a panel of investors, procurement officers, and corporate buyers at the L2L Grand Pitch Event, before entering post-programme incubation.',
                items: [
                  'L2L Grand Pitch Event',
                  'Investor & Procurement Exposure',
                  'QCTO Certificate Awarded',
                  'GoBizz Vendor Listing',
                  'Post-Programme Incubation Support',
                ],
              },
            ].map((stage, i) => (
              <motion.div key={stage.step} {...fadeUp(i * 0.12)}>
                <div
                  className={`glass-card p-8 h-full flex flex-col gap-5 relative overflow-hidden bg-gradient-to-br ${stage.color}`}
                >
                  {/* Ghost number */}
                  <span className="absolute top-4 right-5 font-heading font-bold text-6xl text-white/5 leading-none select-none pointer-events-none">
                    {stage.step}
                  </span>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                      {stage.icon}
                    </div>
                    <div>
                      <p className="text-accent text-xs font-medium tracking-widest uppercase">Stage {stage.step}</p>
                      <h3 className="text-xl font-heading font-bold text-white">{stage.title}</h3>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed">{stage.description}</p>

                  <ul className="mt-auto space-y-2">
                    {stage.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-xs text-white/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CURRICULUM HIGHLIGHTS ────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text side */}
            <motion.div {...fadeUp(0)}>
              <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">Curriculum</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                What You'll Learn
              </h2>
              <p className="text-white/60 leading-relaxed mb-10">
                The New Venture Creation qualification (SAQA ID 49648, 32 credits) is designed to
                equip participants with the practical knowledge and skills to launch and sustain a
                viable business in the South African economy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Briefcase className="w-5 h-5 text-accent" />, title: 'Business Management', desc: 'Planning, operations, and day-to-day management of a business' },
                  { icon: <Lightbulb className="w-5 h-5 text-accent" />, title: 'Entrepreneurship', desc: 'Identifying opportunities, innovation, and problem-solving' },
                  { icon: <Award className="w-5 h-5 text-accent" />, title: 'Financial Management', desc: 'Budgeting, cash flow, costing, and financial planning' },
                  { icon: <Users className="w-5 h-5 text-accent" />, title: 'Human Resources', desc: 'Building and managing a team as your business grows' },
                  { icon: <Zap className="w-5 h-5 text-accent" />, title: 'Digital Business Tools', desc: 'GoBizz platform, digital marketing, and online presence' },
                  { icon: <Shield className="w-5 h-5 text-accent" />, title: 'Legal & Compliance', desc: 'CIPC registration, B-BBEE, tax, and business regulations' },
                ].map((item) => (
                  <div key={item.title} className="glass-card p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-bold mb-0.5">{item.title}</h4>
                      <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image side */}
            <motion.div className="relative" {...fadeUp(0.15)}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10">
                <Image
                  src="/assets/images/l2l/nvc-qualification.svg"
                  alt="New Venture Creation Qualification - NQF Level 2, 32 Credits"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WHO SHOULD APPLY ─────────────────────────────────── */}
      <section className="py-24 bg-color-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay grid-overlay-half" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="text-center mb-14" {...fadeUp(0)}>
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">Eligibility</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Who Should Apply?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              L2L is designed for emerging entrepreneurs in the Ntuzuma and surrounding eThekwini
              communities who are ready to take their business idea seriously.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Lightbulb className="w-6 h-6 text-accent" />,
                title: 'Early-Stage Entrepreneurs',
                desc: "You have a business idea or you've started trading but haven't formalised yet.",
              },
              {
                icon: <Users className="w-6 h-6 text-accent" />,
                title: 'Community Members',
                desc: 'Residents of Ntuzuma, KwaMashu, Inanda and surrounding areas are prioritised.',
              },
              {
                icon: <BookOpen className="w-6 h-6 text-accent" />,
                title: 'Matric or Equivalent',
                desc: 'A Grade 12 certificate or equivalent NQF Level 4 qualification is required for enrolment.',
              },
              {
                icon: <Target className="w-6 h-6 text-accent" />,
                title: 'Growth Mindset',
                desc: "You're committed to attending sessions, completing assignments, and growing your business.",
              },
              {
                icon: <Briefcase className="w-6 h-6 text-accent" />,
                title: 'Any Industry',
                desc: 'Construction, retail, food, tech, creative services - all sectors are welcome.',
              },
              {
                icon: <Award className="w-6 h-6 text-accent" />,
                title: 'Funding Aspirations',
                desc: "You want to be government-funding ready, procurement-listed, and investor-presentable.",
              },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp(i * 0.08)}>
                <div className="glass-card p-6 h-full flex flex-col gap-3 transition-all hover:-translate-y-1 duration-300">
                  <div className="w-11 h-11 rounded-full bg-accent/15 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-heading font-bold">{item.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROGRAMME PARTNERS ───────────────────────────────── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="text-center mb-14" {...fadeUp(0)}>
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">
              Programme Partners
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Built by Three Organisations. <span className="text-accent">One Mission.</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Each partner brings a specific, critical role to ensure learners receive accredited
              training, real business tools, and genuine market access.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                tag: 'Programme Lead & Operator',
                name: 'Breed Industries',
                website: 'www.thebreed.co.za',
                email: 'info@thebreed.co.za',
                description:
                  'Breed Industries is the lead operator of the Learners to Leaders programme. We manage the end-to-end delivery including learner recruitment, community engagement, partner coordination, and the Grand Pitch Event at ICDT Complex, Ntuzuma.',
                role: 'Operations · Recruitment · Events',
                accent: true,
                logo: '/assets/images/logos/breed-logo-just.png',
              },
              {
                tag: 'QCTO-Accredited Training Partner',
                name: 'Kuenta Solutions',
                website: 'www.kuenta.co.za',
                email: 'info@kuenta.co.za',
                description:
                  'Kuenta Solutions holds QCTO accreditation for the New Venture Creation qualification. They deliver the 32-credit curriculum, facilitate assessments, and issue nationally recognised certificates to all graduates.',
                role: 'Training · Assessment · Certification',
                accent: false,
                logo: null,
              },
              {
                tag: 'Business Technology Platform',
                name: 'GoBizz Platform',
                website: 'www.gobizzhub.co.za',
                email: 'info@gobizzhub.co.za',
                description:
                  'GoBizz provides learners with access to a digital business marketplace, vendor tools, and procurement connection features throughout the programme. Graduates are listed as verified vendors on the platform.',
                role: 'Digital Tools · Marketplace · Procurement',
                accent: false,
                logo: '/assets/images/clients/gobizz-logo.png',
              },
            ].map((partner, i) => (
              <motion.div key={partner.name} {...fadeUp(i * 0.12)}>
                <div
                  className={`glass-card p-8 h-full flex flex-col gap-5 ${
                    partner.accent ? 'border border-accent/30' : ''
                  }`}
                >
                  {partner.accent && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                      <span className="text-accent text-xs font-medium">Lead Partner</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    {partner.logo ? (
                      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 p-2">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={56}
                          height={56}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                        <Award className="w-7 h-7 text-accent" />
                      </div>
                    )}
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-widest mb-0.5 ${partner.accent ? 'text-accent' : 'text-white/40'}`}>
                        {partner.tag}
                      </p>
                      <h3 className="text-white font-heading font-bold text-lg">{partner.name}</h3>
                    </div>
                  </div>

                  <p className="text-white/55 text-sm leading-relaxed flex-1">{partner.description}</p>

                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <p className="text-accent text-xs font-medium uppercase tracking-wider">{partner.role}</p>
                    <p className="text-white/40 text-xs">{partner.email}</p>
                    <p className="text-white/40 text-xs">{partner.website}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCATION ─────────────────────────────────────────── */}
      <section className="py-16 bg-color-bg-secondary relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="glass-card-accent p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 max-w-3xl mx-auto"
            {...fadeUp(0)}
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-8 h-8 text-accent" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-accent text-xs uppercase tracking-widest font-medium mb-1">
                Programme Venue
              </p>
              <h3 className="text-white font-heading font-bold text-xl mb-1">
                ICDT Complex - Inanda Community Dev. Trust
              </h3>
              <p className="text-white/60 text-sm">
                20 Ntuzuma Accent Road, Ntuzuma, Durban, KwaZulu-Natal
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── APPLY CTA ────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero/lobby-alt.jpg"
            alt=""
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-color-bg-deep/80 to-color-bg-deep/95" />
        <div className="absolute inset-0 grid-overlay" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/8 blur-3xl rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
              <GraduationCap className="w-4 h-4 text-accent" />
              <span className="text-accent text-xs uppercase tracking-widest font-medium">Next Cohort Opening Soon</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Ready to Start Your{' '}
              <span className="text-gradient-gold">Leadership Journey?</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Whether you're applying as a learner or enquiring as a corporate or government partner,
              reach out and we'll map out next steps with you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/learners-to-leaders/register" className="btn btn-primary">
                Apply for Next Cohort
                <ChevronRight size={16} className="ml-1" />
              </Link>
              <Link href="/learners-to-leaders/register" className="btn btn-outline">
                Partner With Us
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <p className="text-white/40 text-sm mt-8">
              Direct enquiries:{' '}
              <a href="mailto:info@thebreed.co.za" className="text-accent hover:underline">
                info@thebreed.co.za
              </a>{' '}
              · 060 496 4105
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
