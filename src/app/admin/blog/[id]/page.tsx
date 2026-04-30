'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  status: 'published' | 'draft';
  tags: string[];
}

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState<BlogPost & { tagsString: string }>({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    author: 'Breed Industries',
    date: '',
    readTime: '5 min read',
    category: 'Business Registration',
    status: 'draft',
    tags: [],
    tagsString: '',
  });

  const categories = [
    'Business Registration',
    'Startup Guide', 
    'Branding',
    'Digital Marketing',
    'Compliance',
    'Entrepreneurship',
    'Website Development'
  ];

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      // In production, this would fetch from API/database
      const defaultPosts: Record<string, BlogPost> = {
        'how-to-register-company-south-africa': {
          slug: 'how-to-register-company-south-africa',
          title: 'How to Register a Company in South Africa: Complete 2026 Guide',
          excerpt: 'Step-by-step guide to registering your company with CIPC in South Africa. Learn about costs, requirements, timelines, and common mistakes to avoid.',
          content: `Starting a business in South Africa begins with proper company registration. This comprehensive guide walks you through the entire process, from choosing your business structure to receiving your registration certificate.

## Why Register Your Company?

Before diving into the how, let's understand the why:

- **Legal Protection**: Separate your personal assets from business liabilities
- **Credibility**: Customers, suppliers, and investors trust registered businesses
- **Funding Access**: Banks and investors require registration for financing
- **Tax Benefits**: Access to business tax deductions and incentives
- **Bidding Opportunities**: Required for government and corporate tenders

## Types of Business Structures in South Africa

### 1. Private Company (Pty) Ltd - Most Popular
- **Best for**: Most businesses, startups, SMEs
- **Owners**: 1-50 shareholders
- **Liability**: Limited to investment amount
- **Tax**: 27% corporate tax rate

## Conclusion

Company registration is your foundation for business success in South Africa.`,
          author: 'Breed Industries',
          date: '30 April 2026',
          readTime: '8 min read',
          category: 'Business Registration',
          status: 'published',
          tags: ['CIPC', 'company registration', 'South Africa', 'business startup'],
        },
        'startup-costs-south-africa-2026': {
          slug: 'startup-costs-south-africa-2026',
          title: 'Startup Costs in South Africa 2026: Real Budget Breakdown',
          excerpt: 'Real costs to start a business in South Africa in 2026. Budget breakdown for registration, branding, website, and first-year operations.',
          content: 'Starting a business requires capital, but how much do you really need? This guide breaks down actual startup costs for South African businesses in 2026.',
          author: 'Breed Industries',
          date: '28 April 2026',
          readTime: '10 min read',
          category: 'Startup Guide',
          status: 'published',
          tags: ['startup costs', 'business budget', 'South Africa', 'entrepreneurship'],
        },
        'why-your-business-needs-professional-logo': {
          slug: 'why-your-business-needs-professional-logo',
          title: 'Why Your Business Needs a Professional Logo: 10 Reasons',
          excerpt: 'Discover why a professional logo is crucial for business success. Learn how quality branding impacts credibility, customer trust, and revenue.',
          content: 'First impressions last 50 milliseconds. Your logo is often the first interaction potential customers have with your brand.',
          author: 'Breed Industries',
          date: '25 April 2026',
          readTime: '6 min read',
          category: 'Branding',
          status: 'published',
          tags: ['logo design', 'branding', 'business identity', 'South Africa'],
        },
      };

      const post = defaultPosts[id];
      if (post) {
        setFormData({
          ...post,
          tagsString: post.tags.join(', '),
        });
      } else {
        alert('Post not found');
        router.push('/admin/blog');
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (publish = false) => {
    setIsSaving(true);
    try {
      const postData = {
        ...formData,
        status: publish ? 'published' : 'draft',
        tags: formData.tagsString.split(',').map(t => t.trim()).filter(Boolean),
      };

      // In production, this would save to database via API
      console.log('Saving post:', postData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(publish ? 'Post published successfully!' : 'Changes saved successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      // In production, this would delete from database
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Post deleted successfully');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-color-bg-deep flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-color-bg-deep">
      {/* Header */}
      <div className="bg-color-bg-secondary border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/blog" 
                className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Posts
              </Link>
            </div>
            <h1 className="text-xl font-bold text-white">Edit Blog Post</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-color-bg-deep rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 font-medium"
              >
                {formData.status === 'published' ? 'Update' : 'Publish'}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {previewMode ? (
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8">
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
                {formData.category}
              </span>
              <h1 className="text-3xl font-bold text-white mb-4">{formData.title}</h1>
              <p className="text-xl text-white/70 mb-6">{formData.excerpt}</p>
              <div className="flex items-center gap-4 text-white/50 text-sm mb-8 pb-8 border-b border-white/10">
                <span>{formData.author}</span>
                <span>{formData.date}</span>
                <span>{formData.readTime}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  formData.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {formData.status}
                </span>
              </div>
              <div className="prose prose-invert max-w-none">
                {formData.content.split('\n').map((paragraph, i) => {
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={i} className="list-disc list-inside mb-4">
                        <li className="text-white/80">{paragraph.replace('- ', '')}</li>
                      </ul>
                    );
                  }
                  return paragraph ? <p key={i} className="text-white/80 mb-4">{paragraph}</p> : null;
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:border-accent"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-white/70 text-sm mb-2">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-sm">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Excerpt *</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent resize-none"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-color-bg-deep">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Read Time</label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tagsString}
                onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={20}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent font-mono text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
