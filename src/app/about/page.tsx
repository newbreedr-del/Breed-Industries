import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { Award, Users2, Target, Lightbulb, Briefcase } from 'lucide-react';

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
              Breed Industries was founded in Durban with one mission: eliminate the friction between idea and execution for ambition-fueled founders. Our lobby’s blueprint aesthetic is more than a design cue—it is a promise that every project starts with solid architecture.
            </p>
            <p className="text-white/60">
              Today, our team spans Durban and Johannesburg, serving clients across sectors like fintech, telecom, healthcare, and public procurement. We combine compliance expertise, branded storytelling, and digital engineering under one roof so you can launch faster.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60 uppercase">Businesses launched</p>
                <p className="text-2xl font-heading font-bold text-accent">450+</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/60 uppercase">Average launch timeline</p>
                <p className="text-2xl font-heading font-bold text-accent">21 days</p>
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
