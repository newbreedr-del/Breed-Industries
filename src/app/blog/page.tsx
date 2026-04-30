import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | Business Tips & Guides | Breed Industries',
  description: 'Expert advice on starting and growing your South African business. Guides on company registration, branding, marketing, and entrepreneurship.',
  keywords: ['business blog South Africa', 'startup tips', 'company registration guide', 'branding advice', 'entrepreneurship South Africa'],
  alternates: { canonical: 'https://thebreed.co.za/blog' },
  openGraph: {
    title: 'Breed Industries Blog - Business Growth Tips',
    description: 'Expert guides on starting and scaling your South African business.',
    url: 'https://thebreed.co.za/blog',
    images: [{ url: '/api/og?title=Business%20Growth%20Blog&subtitle=Tips%20%26%20Guides%20for%20SA%20Entrepreneurs', width: 1200, height: 630 }],
  },
};

// Blog posts data - in production this would come from a CMS or file system
const blogPosts = [
  {
    slug: 'how-to-register-company-south-africa',
    title: 'How to Register a Company in South Africa: Complete 2026 Guide',
    excerpt: 'Step-by-step guide to registering your company with CIPC in South Africa. Learn about costs, requirements, timelines, and common mistakes to avoid.',
    author: 'Breed Industries',
    date: '30 April 2026',
    readTime: '8 min read',
    category: 'Business Registration',
    image: '/assets/images/blog/company-registration.jpg',
    tags: ['CIPC', 'company registration', 'South Africa', 'business startup'],
  },
  {
    slug: 'startup-costs-south-africa-2026',
    title: 'Startup Costs in South Africa 2026: Real Budget Breakdown',
    excerpt: 'Real costs to start a business in South Africa in 2026. Budget breakdown for registration, branding, website, and first-year operations. Plan your startup finances.',
    author: 'Breed Industries',
    date: '28 April 2026',
    readTime: '10 min read',
    category: 'Startup Guide',
    image: '/assets/images/blog/startup-costs.jpg',
    tags: ['startup costs', 'business budget', 'South Africa', 'entrepreneurship'],
  },
  {
    slug: 'why-your-business-needs-professional-logo',
    title: 'Why Your Business Needs a Professional Logo: 10 Reasons',
    excerpt: 'Discover why a professional logo is crucial for business success. Learn how quality branding impacts credibility, customer trust, and revenue in the South African market.',
    author: 'Breed Industries',
    date: '25 April 2026',
    readTime: '6 min read',
    category: 'Branding',
    image: '/assets/images/blog/professional-logo.jpg',
    tags: ['logo design', 'branding', 'business identity', 'South Africa'],
  },
];

const categories = ['All', 'Business Registration', 'Startup Guide', 'Branding', 'Digital Marketing', 'Compliance'];

export default function BlogPage() {
  return (
    <>
      <Header />

      <PageHero
        title="Business Growth Blog"
        subtitle="Expert Tips & Guides"
        description="Practical advice for starting and scaling your South African business. From registration to marketing, we've got you covered."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
        ]}
        backgroundImage="/assets/images/portfolio-hero.png"
        size="default"
      />

      <section className="py-20 bg-color-bg-secondary">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-white/70 hover:bg-accent/20 hover:text-accent transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="glass-card overflow-hidden group hover:border-accent/30 transition-all duration-300"
              >
                {/* Image */}
                <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-color-bg-deep/50 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center text-white/30">
                    <span className="text-6xl font-bold uppercase tracking-wider">{post.category}</span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-3">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-white/60 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-white/40 text-xs mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Author & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="flex items-center gap-2 text-white/60 text-sm">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-accent text-sm font-medium hover:gap-2 transition-all"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-20 glass-card p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Get Business Tips Delivered
            </h3>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for weekly insights on starting and growing your South African business. No spam, unsubscribe anytime.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent"
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
