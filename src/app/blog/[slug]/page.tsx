import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';

// This would typically fetch from a CMS or markdown files
const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}> = {
  'how-to-register-company-south-africa': {
    title: 'How to Register a Company in South Africa: Complete 2026 Guide',
    excerpt: 'Step-by-step guide to registering your company with CIPC in South Africa.',
    author: 'Breed Industries',
    date: '30 April 2026',
    readTime: '8 min read',
    category: 'Business Registration',
    tags: ['CIPC', 'company registration', 'South Africa', 'business startup'],
    content: [
      'Starting a business in South Africa begins with proper company registration. This comprehensive guide walks you through the entire process.',
      '## Why Register Your Company?',
      'Before diving into the how, let\'s understand the why: Legal protection, credibility with customers, access to funding, tax benefits, and bidding opportunities.',
      '## Types of Business Structures',
      'Private Company (Pty) Ltd is the most popular choice for most businesses, offering limited liability and professional credibility.',
      '## Step-by-Step Registration Process',
      '1. Reserve your company name with CIPC (R50)\n2. Prepare required documents (ID copies, proof of address)\n3. Register online with CIPC (R125)\n4. Receive your registration certificate',
      '## Post-Registration Requirements',
      'After registration, you\'ll need SARS tax registration, a business bank account, B-BBEE certificate, and potentially industry-specific licenses.',
      '## Costs Summary',
      'DIY Total: R175-R300 | Professional Package: R1,450-R3,500',
    ],
  },
  'startup-costs-south-africa-2026': {
    title: 'Startup Costs in South Africa 2026: Real Budget Breakdown',
    excerpt: 'Real costs to start a business in South Africa in 2026.',
    author: 'Breed Industries',
    date: '28 April 2026',
    readTime: '10 min read',
    category: 'Startup Guide',
    tags: ['startup costs', 'business budget', 'South Africa'],
    content: [
      'Starting a business requires capital, but how much do you really need?',
      '## Essential Startup Costs',
      'Company registration: R175-R300 | Branding: R2,300-R6,800 | Website: R5,000-R15,000',
      '## Monthly Operating Costs',
      'Plan for rent, salaries, software, marketing, and professional services.',
      '## Funding Options',
      'Self-funding, small business loans, government funding (SEFA, IDC, NYDA), and angel investors.',
    ],
  },
  'why-your-business-needs-professional-logo': {
    title: 'Why Your Business Needs a Professional Logo: 10 Reasons',
    excerpt: 'Discover why a professional logo is crucial for business success.',
    author: 'Breed Industries',
    date: '25 April 2026',
    readTime: '6 min read',
    category: 'Branding',
    tags: ['logo design', 'branding', 'business identity'],
    content: [
      'First impressions last 50 milliseconds. Your logo is often the first interaction potential customers have with your brand.',
      '## 10 Key Benefits',
      '1. First impressions matter\n2. Builds instant credibility\n3. Differentiation in saturated markets\n4. Increases perceived value\n5. Drives brand recognition',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug];
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: `${post.title} | Breed Industries Blog`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `https://thebreed.co.za/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://thebreed.co.za/blog/${params.slug}`,
      images: [{ url: `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.category)}`, width: 1200, height: 630 }],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-color-bg-deep">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Blog Post Not Found</h1>
            <Link href="/blog" className="text-accent hover:underline">
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <article className="min-h-screen bg-color-bg-secondary">
        {/* Hero Section */}
        <div className="relative py-20 bg-color-bg-deep">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-accent mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category */}
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-white/70 mb-8">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-white/50 text-sm pb-8 border-b border-white/10">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
              <button className="flex items-center gap-2 hover:text-accent transition-colors ml-auto">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="prose prose-invert prose-lg max-w-none">
            {post.content.map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-white mt-12 mb-6">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.includes('\n')) {
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 text-white/80 mb-6">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-white/80 mb-6 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/10">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/5 text-white/60 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 glass-card p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Start Your Business?
                </h3>
                <p className="text-white/70 mb-6">
                  Get a complete business launch package including registration, branding, and website. From just R3,950.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/build-package" className="btn btn-primary flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/contact" className="btn btn-outline">
                    Talk to an Expert
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <NewsletterSignup variant="card" />
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-white mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(blogPosts)
                .filter(([slug]) => slug !== params.slug)
                .slice(0, 2)
                .map(([slug, relatedPost]) => (
                  <Link
                    key={slug}
                    href={`/blog/${slug}`}
                    className="glass-card p-6 hover:border-accent/30 transition-colors"
                  >
                    <span className="text-accent text-sm font-medium">{relatedPost.category}</span>
                    <h4 className="text-lg font-semibold text-white mt-2 mb-3">{relatedPost.title}</h4>
                    <span className="text-white/50 text-sm flex items-center gap-2">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
