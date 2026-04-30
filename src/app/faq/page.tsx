import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { FAQSection } from '@/components/sections/FAQSection';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ | Frequently Asked Questions | Breed Industries',
  description: 'Find answers to common questions about business registration, branding, website development, and our services in South Africa.',
  keywords: ['business registration FAQ', 'company registration questions', 'branding FAQ', 'website development FAQ', 'South Africa business help'],
  alternates: { canonical: 'https://thebreed.co.za/faq' },
  openGraph: {
    title: 'Frequently Asked Questions - Breed Industries',
    description: 'Get answers to your business setup questions.',
    url: 'https://thebreed.co.za/faq',
    images: [{ url: '/api/og?title=FAQ&subtitle=Questions%20%26%20Answers', width: 1200, height: 630 }],
  },
};

const faqCategories = [
  {
    category: 'Company Registration',
    questions: [
      {
        question: 'How long does company registration take in South Africa?',
        answer: 'With our professional service, company registration typically takes 3-7 business days. DIY registration through CIPC can take 2-4 weeks depending on their workload and any issues with name approval or documentation.',
      },
      {
        question: 'What documents do I need to register a company?',
        answer: 'You will need certified ID copies of all directors and shareholders (certified within the last 3 months), proof of address (utility bill or bank statement not older than 3 months), and director consent forms. We handle all document preparation and certification guidance.',
      },
      {
        question: 'Can I register a company if I am not a South African citizen?',
        answer: 'Yes, foreigners can register companies in South Africa. However, at least one director must be a South African resident. Non-residents can own shares and be directors, but the resident director requirement applies for most business types.',
      },
      {
        question: 'What is the difference between a company name and a trading name?',
        answer: 'Your company name is the registered legal name (e.g., "ABC Solutions Pty Ltd"). Your trading name is what customers see and can be different. You can have multiple trading names under one registered company.',
      },
      {
        question: 'How much does company registration cost?',
        answer: 'DIY costs are R175 (R50 name reservation + R125 registration). Our professional packages start from R1,450 and include name reservation, CIPC registration, tax registration, B-BBEE affidavit, and CSD registration.',
      },
    ],
  },
  {
    category: 'Branding & Design',
    questions: [
      {
        question: 'How long does logo design take?',
        answer: 'Our logo design process typically takes 5-10 business days. This includes initial concepts (3-5 options), revision rounds based on your feedback, and final file delivery in all formats. Rush services are available for urgent projects.',
      },
      {
        question: 'What files will I receive with my logo?',
        answer: 'You will receive your logo in all essential formats: Vector files (AI, EPS, SVG) for scaling to any size, high-resolution PNG with transparent background for digital use, JPG for general use, PDF for print, and social media optimized versions for each platform.',
      },
      {
        question: 'Can I trademark my logo?',
        answer: 'Yes, we can assist with trademark registration through CIPC. This protects your brand identity and prevents others from using similar marks. Trademark registration costs R2,500-R5,000 and takes 6-12 months for approval.',
      },
      {
        question: 'What if I do not like the initial logo concepts?',
        answer: 'Our design process includes revision rounds to refine the direction. If the initial concepts miss the mark, we will discuss your feedback in detail and create new concepts that better align with your vision at no additional cost.',
      },
    ],
  },
  {
    category: 'Website Development',
    questions: [
      {
        question: 'How long does it take to build a website?',
        answer: 'Timeline depends on complexity: Basic business websites take 1-2 weeks, professional websites with custom features take 2-4 weeks, and e-commerce websites take 4-8 weeks. We provide detailed timelines during consultation.',
      },
      {
        question: 'Will my website work on mobile phones?',
        answer: 'Absolutely. All our websites are fully responsive, meaning they automatically adapt to look great on desktops, tablets, and mobile phones. Mobile optimization is essential as over 70% of South African web traffic comes from mobile devices.',
      },
      {
        question: 'Do you provide website hosting?',
        answer: 'We offer hosting packages starting from R150/month for basic websites. Premium hosting with faster speeds and enhanced security is available for R500-R2,000/month depending on your website size and traffic needs.',
      },
      {
        question: 'Can I update my website myself?',
        answer: 'Yes, we build websites with user-friendly content management systems (CMS) that allow you to update text, images, and blog posts without technical knowledge. We also provide training videos and documentation.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    questions: [
      {
        question: 'What payment options do you offer?',
        answer: 'We accept EFT, credit card payments (via PayFast), and cash deposits. For larger projects, we offer payment plans with 50% deposit to commence work and balance on completion.',
      },
      {
        question: 'Do you offer refunds?',
        answer: 'Deposits are refundable if work has not commenced. Once work has started, refunds are prorated based on work completed. Final deliverables are not refundable once approved and delivered.',
      },
      {
        question: 'Are there any hidden costs?',
        answer: 'No hidden costs. We provide detailed quotes upfront that include all anticipated expenses. Any additional work outside the agreed scope is quoted and approved before proceeding.',
      },
      {
        question: 'Do you offer discounts for multiple services?',
        answer: 'Yes, our bundled packages offer significant savings compared to individual services. The more services you bundle (registration + branding + website), the greater your savings. Check our Build Your Package page for custom quotes.',
      },
    ],
  },
  {
    category: 'Support & Revisions',
    questions: [
      {
        question: 'How many revisions are included?',
        answer: 'Our standard packages include 2-3 revision rounds depending on the service. Additional revisions beyond this are charged at an hourly rate or can be purchased as a revision package.',
      },
      {
        question: 'What if I need urgent work completed?',
        answer: 'Rush services are available for most projects at a 25-50% premium depending on the timeline. Contact us with your deadline and we will advise feasibility and pricing.',
      },
      {
        question: 'Do you provide ongoing support?',
        answer: 'Yes, we offer maintenance packages for websites and ongoing design support retainers. Support packages include priority response times, regular updates, and technical assistance.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Header />

      <PageHero
        title="Frequently Asked Questions"
        subtitle="Get Answers"
        description="Find answers to common questions about business registration, branding, website development, and our services in South Africa."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'FAQ', href: '/faq' },
        ]}
        backgroundImage="/assets/images/portfolio-hero.png"
        size="default"
      />

      <FAQSection faqCategories={faqCategories} />

      {/* Still Have Questions CTA */}
      <section className="py-16 bg-color-bg-deep">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-white/70 mb-8">
            Cannot find the answer you are looking for? Our team is here to help. Reach out and we will get back to you within one business day.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary flex items-center gap-2">
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/27604964105"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
