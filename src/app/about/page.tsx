import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { Award, Users2, Target, Lightbulb, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | Breed Industries - From PINC to a Business Ecosystem',
  description: 'Breed Industries grew out of PINC Community NPC - a community infrastructure model applied to business. A network, a community-pooled funding mechanism, and a digital build team for serious South African owners.',
  keywords: ['about Breed Industries', 'business agency Durban', 'startup launch South Africa', 'business consultancy Durban', 'entrepreneur support South Africa'],
  alternates: { canonical: 'https://thebreed.co.za/about' },
  openGraph: {
    title: 'About Breed Industries - The Empire Behind the Blueprint',
    description: 'Founded in Durban with a mission: eliminate the friction between idea and execution for ambition-fueled founders.',
    url: 'https://thebreed.co.za/about',
    images: [{ url: '/assets/images/about-og.jpg', width: 1200, height: 630 }],
  },
};

const values = [
  {
    title: 'Build, don\'t talk',
    description: 'We don\'t lecture about entrepreneurship. We register, file, deploy, and ship - and we expect members to do the same.',
    icon: <Award className="w-5 h-5 text-accent" />,
  },
  {
    title: 'Community over committee',
    description: 'The Isivuno Fund is run by members, not a panel. Decisions are public, votes are transparent, accountability is shared.',
    icon: <Target className="w-5 h-5 text-accent" />,
  },
  {
    title: 'Infrastructure, not theatre',
    description: 'A real business needs compliance, capital, and systems that don\'t collapse under pressure. That\'s what we build.',
    icon: <Lightbulb className="w-5 h-5 text-accent" />,
  },
];

const leadership = [
  {
    name: 'Sabelo Mandubu',
    role: 'Chief Executive Officer',
    bio: 'Sabelo leads Breed Industries with a strong background in IT and graphic design, combining technical expertise, system-building skills, and creative vision to deliver powerful, polished solutions for entrepreneurs.',
  },
  {
    name: 'Nono Msimang',
    role: 'Head of Marketing',
    bio: 'Nono drives our marketing strategy with sharp insight into digital trends, audience engagement, and brand storytelling, helping clients connect and grow effectively.',
  },
  {
    name: 'Malaikaa Hlombe',
    role: 'Media and Public Relations',
    bio: 'Malaikaa handles media and PR with creativity and strategic focus, crafting compelling narratives and building strong public presence for Breed Industries and our clients.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <PageHero
        title="From fixing streets to building businesses"
        subtitle="About Breed Industries"
        description="We started by organising communities to fix infrastructure. We apply the same model to business - because most South African businesses don't fail because of bad ideas. They fail because the infrastructure underneath them was never properly built."
        breadcrumbs={[{ label: 'About', href: '/about' }]}
        backgroundImage="/assets/images/about-hero.jpg"
        align="left"
      >
        <Link href="/network" className="btn btn-primary">
          Join the Network
        </Link>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="glass-card p-8 space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">From PINC to Breed</h2>
            <p className="text-white/70 text-lg">
              Breed Industries grew out of <span className="text-accent font-semibold">PINC Community NPC</span> - an organisation that fixed real infrastructure: streets, lights, public spaces. The method was simple. Organise the community, agree on the problem, fix the problem, document the work.
            </p>
            <p className="text-white/60">
              We took the same model and applied it to business. Most South African businesses don't fail because of bad ideas. They fail because of three systemic problems: financial illiteracy, accreditation gaps, and the absence of any succession plan. Owners don't know their numbers. They miss tenders because of one missing certificate. And when the founder steps back, the whole thing collapses because nothing was ever documented.
            </p>
            <p className="text-white/60">
              Breed Industries was registered in 2021 (Reg: 2021/963126/07) to solve all three - not by selling courses or templates, but by building a community, a funding mechanism, and a digital infrastructure team that members can actually use.
            </p>
            <p className="text-white/60">
              Five years in: 250+ registrations and accreditations processed, ~45 active clients, two hubs (Durban &amp; Johannesburg), and a partner network that now includes <span className="text-white">Peter William Mather</span> - bringing lobbying, safety management, ISO quality standards, and formal training frameworks into the ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60 uppercase">Founded</p>
                <p className="text-2xl font-heading font-bold text-accent">2021</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60 uppercase">Registrations &amp; accreditations</p>
                <p className="text-2xl font-heading font-bold text-accent">250+</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60 uppercase">Active clients</p>
                <p className="text-2xl font-heading font-bold text-accent">45</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60 uppercase">Team hubs</p>
                <p className="text-2xl font-heading font-bold text-accent">DBN · JHB</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 space-y-6">
            <h2 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
              <Users2 className="w-5 h-5 text-accent" /> Core Leadership Team
            </h2>
            <div className="space-y-4">
              {leadership.map((leader) => (
                <div key={leader.name} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <h3 className="text-white font-semibold">{leader.name}</h3>
                  <p className="text-accent text-sm uppercase tracking-wide">{leader.role}</p>
                  <p className="text-white/60 text-sm mt-2">{leader.bio}</p>
                </div>
              ))}
            </div>
            <Link href="/portfolio" className="btn btn-outline inline-flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> View Case Studies
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-heading font-bold text-white text-center mb-12">What grounds our decisions</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  {value.icon}
                  <h3 className="text-lg font-heading font-semibold text-white">{value.title}</h3>
                </div>
                <p className="text-white/60 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
