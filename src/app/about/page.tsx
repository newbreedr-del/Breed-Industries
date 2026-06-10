import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { Award, Users2, Target, Lightbulb, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Breed Industries - Business Agency Durban & Johannesburg',
  description: 'Meet the team behind Breed Industries. Founded in Durban, we help entrepreneurs launch investment-ready businesses across South Africa with registration, branding, and digital solutions.',
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
    title: 'Credibility First',
    description: 'We build businesses that pass due diligence, impress investors, and win procurement bids.',
    icon: <Award className="w-5 h-5 text-accent" />,
  },
  {
    title: 'Velocity & Clarity',
    description: 'Every engagement has clear milestones, documented deliverables, and rapid iteration cycles.',
    icon: <Target className="w-5 h-5 text-accent" />,
  },
  {
    title: 'Design-Led Innovation',
    description: 'Our creatives and engineers co-design solutions so form and function are perfectly aligned.',
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
        title="The Empire Behind the Blueprint"
        subtitle="About Breed Industries"
        description="We translate visionary ideas into compliant, investment-ready brands built for the African market and beyond."
        breadcrumbs={[{ label: 'About', href: '/about' }]}
        backgroundImage="/assets/images/about-hero.jpg"
        align="left"
      >
        <Link href="/contact" className="btn btn-primary">
          Let’s Talk
        </Link>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="glass-card p-8 space-y-6">
            <h2 className="text-3xl font-heading font-bold text-white">Our Origin Story</h2>
            <p className="text-white/70 text-lg">
              Breed Industries was registered in 2021 (Reg: 2021/963126/07) with a simple but contrarian observation: everyone was talking about unemployment, but very few people were building the businesses that actually create jobs.
            </p>
            <p className="text-white/60">
              Founder Sabelo Mandubu chose a different path. Working alongside private organisations, NPOs, NGOs, and municipal structures connected to community development across KwaZulu-Natal, he set out to remove every barrier between a South African entrepreneur and a fully operational, compliant, market-ready business — not by talking about it, by building it.
            </p>
            <p className="text-white/60">
              Five years later, Breed Industries has processed over 250 registrations and accreditations, serves approximately 45 active clients, and operates across Durban and Johannesburg — supporting everyone from first-time entrepreneurs registering their first company to established SMEs upgrading their CIDB grade and winning government contracts.
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
