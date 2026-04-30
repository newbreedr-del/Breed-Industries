import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { getAllBlogPosts, BlogPost } from '@/lib/blog';
import { BlogImage } from '@/components/blog/BlogImage';

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

const categories = ['All', 'Business Registration', 'Startup Guide', 'Branding', 'Digital Marketing', 'Compliance'];

// Force dynamic rendering to fetch fresh data from Supabase
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  let blogPosts: BlogPost[] = [];
  let error: string | null = null;
  
  try {
    blogPosts = await getAllBlogPosts();
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    error = err instanceof Error ? err.message : 'Failed to load blog posts';
  }
  
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
          {/* Error Display */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">Error loading blog posts: {error}</p>
              <p className="text-white/50 text-sm">Check console for details</p>
            </div>
          )}

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
                  <BlogImage
                    src={post.featuredImage || ''}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-color-bg-deep/80 via-transparent to-transparent" />
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
