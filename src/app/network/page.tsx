import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import {
  Users, Coins, BookOpen, Calendar, MessagesSquare, Library,
  CheckCircle2, ChevronRight, ArrowRight, Sprout, Hammer,
  TrendingUp, Crown, Vote, ShieldCheck, ScrollText,
} from 'lucide-react';

const WHATSAPP_JOIN = 'https://wa.me/27604964105?text=Hi%20Breed%20Industries!%20I%27d%20like%20to%20join%20the%20Breed%20Business%20Network.';

export const metadata: Metadata = {
  title: 'The Breed Business Network | Membership, Community & Funding | Breed Industries',
  description: 'The Breed Business Network is a membership ecosystem for South African business owners - education, peer community, compliance support, and access to the Isivuno community-pooled funding mechanism.',
  keywords: ['Breed Business Network', 'BBN', 'Isivuno Fund', 'business community South Africa', 'SME membership', 'business funding network'],
  alternates: { canonical: 'https://thebreed.co.za/network' },
  openGraph: {
    title: 'The Breed Business Network - Community, Capital, Infrastructure',
    description: 'A pay-to-grow membership ecosystem. Education, peer community, compliance support, and a community-pooled funding mechanism.',
    url: 'https://thebreed.co.za/network',
  },
};

const tiers = [
  {
    id: 'seed',
    name: 'Seed',
    price: 'R950',
    icon: <Sprout className="w-6 h-6 text-accent" />,
    tagline: 'For owners building their foundation.',
    features: [
      'All monthly education events',
      'Access to the member resource hub',
      'Peer community channels',
      'Member rates on all Build Services',
    ],
    isivuno: null,
  },
  {
    id: 'build',
    name: 'Build',
    price: 'R1,500',
    icon: <Hammer className="w-6 h-6 text-accent" />,
    tagline: 'For owners ready to access community capital.',
    features: [
      'Everything in Seed',
      'R550/month contribution to the Isivuno Fund',
      'Funding access up to R5,000 after 6 months',
      'Quarterly compliance check-ins',
    ],
    isivuno: 'R5,000',
    featured: false,
  },
  {
    id: 'grow',
    name: 'Grow',
    price: 'R2,200',
    icon: <TrendingUp className="w-6 h-6 text-accent" />,
    tagline: 'For owners scaling teams and contracts.',
    features: [
      'Everything in Build',
      'Larger Isivuno pool contribution',
      'Funding access up to R15,000',
      'Speaker opportunities at events',
      'Monthly compliance check-ins',
    ],
    isivuno: 'R15,000',
    featured: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 'R3,200',
    icon: <Crown className="w-6 h-6 text-accent" />,
    tagline: 'For owners running multi-stream businesses.',
    features: [
      'Everything in Grow',
      'Maximum Isivuno funding access',
      'Priority project slots for Build Services',
      'Advisory access - direct line to Sabelo',
      'Quarterly strategy sessions',
    ],
    isivuno: 'Max access',
  },
];

const isivunoMechanics = [
  {
    icon: <Coins className="w-5 h-5 text-accent" />,
    title: 'Members contribute monthly',
    description: 'Build, Grow and Scale members pay a portion of their retainer into the Isivuno Fund. Contributions are tracked publicly to all members.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-accent" />,
    title: 'You qualify by being credible',
    description: 'Members must be compliant, attend training, and have contributed for 6+ months before applying. No exceptions, no favouritism.',
  },
  {
    icon: <Vote className="w-5 h-5 text-accent" />,
    title: '60% community vote decides',
    description: 'Funding decisions are made by the members themselves. Not a committee. Not a bank. Transparent. Accountable. Fair.',
  },
  {
    icon: <ScrollText className="w-5 h-5 text-accent" />,
    title: 'The fund grows with the community',
    description: 'Funded members repay into the pool, the pool grows, more members get funded. It compounds - by design.',
  },
];

const pillars = [
  {
    icon: <Calendar className="w-6 h-6 text-accent" />,
    title: 'Monthly Education Events',
    description: 'Practical sessions on compliance, finance, tenders, marketing, and operations - taught by people who have actually done it, not theorists.',
  },
  {
    icon: <Library className="w-6 h-6 text-accent" />,
    title: 'Resource Hub',
    description: 'Templates, frameworks, checklists, and recorded sessions. Everything a member needs to operate, all in one place.',
  },
  {
    icon: <MessagesSquare className="w-6 h-6 text-accent" />,
    title: 'Peer Community',
    description: 'Direct channels with other serious owners. Ask, share, refer, partner. The network you couldn\'t buy your way into.',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-accent" />,
    title: 'Compliance Support',
    description: 'CIPC, SARS, B-BBEE, CSD, CIDB - guidance and reminders so nothing slips. Full execution is available through Build Services.',
  },
];

export default function NetworkPage() {
  return (
    <>
      <Header />

      <PageHero
        title="The Breed Business Network"
        subtitle="Community · Capital · Infrastructure"
        description="A membership ecosystem for serious South African business owners. Pay to grow - not to start."
        breadcrumbs={[{ label: 'Network', href: '/network' }]}
        backgroundImage="/assets/images/about-hero.jpg"
        align="left"
      >
        <a href={WHATSAPP_JOIN} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Join the Network
          <ChevronRight size={16} className="ml-1" />
        </a>
      </PageHero>

      {/* What it is */}
      <section className="py-20 relative bg-color-bg-secondary">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">What This Is</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              This is not a pay-to-start model.
              <span className="block text-accent mt-2">It is a pay-to-grow model.</span>
            </h2>
            <div className="space-y-4 text-white/70 text-lg leading-relaxed">
              <p>
                The Breed Business Network is the community layer of the Breed Industries ecosystem. Members pay a
                monthly retainer to access the infrastructure that keeps a business alive: education, peers, tools, and
                a compliance support system that actually responds.
              </p>
              <p>
                Members don't pay for CIPC registration or a logo. They pay for sustained access to the knowledge,
                community and structure that makes their business survive and scale. Project work - web applications,
                accreditation, tender strategy - is scoped and quoted separately, and members get preferential rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four pillars of membership */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">What Membership Includes</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Four pillars. One operating system.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pillars.map((p) => (
              <div key={p.title} className="glass-card p-6">
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="text-lg font-heading font-bold text-white mb-2">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">Membership Tiers</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Pick the level you're actually at.
            </h2>
            <p className="text-white/65 max-w-2xl mx-auto">
              All tiers include the four pillars above. The differences are funding access and depth of advisory contact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`glass-card p-6 flex flex-col h-full relative ${
                  tier.featured ? 'ring-2 ring-accent' : ''
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most popular
                  </span>
                )}
                <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mb-4">
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-heading font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-white/50 text-xs mb-4">{tier.tagline}</p>
                <div className="mb-5">
                  <span className="text-3xl font-heading font-bold text-accent">{tier.price}</span>
                  <span className="text-white/50 text-sm"> / month</span>
                </div>
                {tier.isivuno && (
                  <div className="mb-4 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-[10px] uppercase tracking-wider text-accent font-bold">Isivuno funding access</p>
                    <p className="text-white text-sm font-medium">{tier.isivuno}</p>
                  </div>
                )}
                <ul className="space-y-2 flex-1 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={WHATSAPP_JOIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={tier.featured ? 'btn btn-primary w-full justify-center' : 'btn btn-outline w-full justify-center'}
                >
                  Choose {tier.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Isivuno Fund */}
      <section id="isivuno" className="py-20 relative scroll-mt-24">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="absolute left-1/3 top-1/4 w-96 h-96 bg-accent/8 blur-3xl rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">02 · Capital</p>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
                The <span className="text-gradient-gold">Isivuno Fund</span>
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
                <span className="text-accent font-semibold">Isivuno</span> - isiZulu for <em>harvest</em>. A community-pooled capital fund
                that turns the network into a financial institution for its own members.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
              {isivunoMechanics.map((m) => (
                <div key={m.title} className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                      {m.icon}
                    </div>
                    <h3 className="text-lg font-heading font-bold text-white">{m.title}</h3>
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>

            <div className="glass-card-accent p-8 md:p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                Banks won't fund what they can't underwrite.
                <span className="block text-accent mt-1">The community can.</span>
              </h3>
              <p className="text-white/70 max-w-2xl mx-auto mb-6">
                Build, Grow and Scale members start accessing the fund after six months of consistent contribution and
                compliance. The pool exists to back members who are doing the work - not to subsidise those who aren't.
              </p>
              <a href={WHATSAPP_JOIN} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Talk to Us About the Fund
                <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">How To Join</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-10">
              Three steps. No application maze.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { step: '01', title: 'Reach out on WhatsApp', body: 'Send a message and tell us where your business is right now.' },
                { step: '02', title: 'Quick orientation call', body: 'We confirm the right tier for you and answer questions on the Fund.' },
                { step: '03', title: 'Start the month strong', body: 'Onboard, meet members, attend the next education event.' },
              ].map((s) => (
                <div key={s.step} className="glass-card p-6 text-left">
                  <p className="text-accent font-heading text-3xl font-bold mb-2">{s.step}</p>
                  <h3 className="text-lg font-heading font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-white/60 text-sm">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={WHATSAPP_JOIN} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Users size={16} className="mr-2" />
                Join the Network
              </a>
              <Link href="/contact" className="btn btn-outline">
                Ask a Question First
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
