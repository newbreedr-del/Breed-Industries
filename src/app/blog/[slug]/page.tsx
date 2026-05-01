import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';
import { getAllSlugs, getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog';
import { BlogImage } from '@/components/blog/BlogImage';

// Force dynamic rendering - fetch fresh data from Supabase on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: `${post.title} | Breed Industries Blog`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `https://thebreed.co.za/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://thebreed.co.za/blog/${slug}`,
      images: [{ url: `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.category)}`, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getAllBlogPosts()
  ]);

  if (!post) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-color-bg-deep">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Blog Post Not Found</h1>
            <p className="text-white/60 mb-4">The blog post you are looking for does not exist.</p>
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

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
                <BlogImage
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

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
          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

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
              {allPosts
                .filter((p) => p.slug !== slug)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
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
