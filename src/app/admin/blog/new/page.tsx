'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function NewBlogPost() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Breed Industries',
    category: 'Business Registration',
    readTime: '5 min read',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    featuredImage: '',
    ogImage: '',
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSave = async (publish = false) => {
    setIsSaving(true);
    try {
      console.log('=== CREATE POST ===');
      console.log('formData.featuredImage:', formData.featuredImage);

      const postData = {
        slug: formData.slug,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }),
        readTime: formData.readTime,
        category: formData.category,
        status: publish ? 'published' : 'draft',
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        featuredImage: formData.featuredImage || '',
        ogImage: formData.ogImage || '',
      };

      console.log('Sending postData to /api/blog:', JSON.stringify(postData, null, 2));

      // Save to Supabase via API
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      console.log('Create response status:', response.status);
      if (!response.ok) {
        const error = await response.json();
        console.error('Create error:', error);
        throw new Error(error.error || 'Failed to save');
      }
      
      alert(publish ? 'Post published successfully!' : 'Draft saved successfully!');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
            <h1 className="text-xl font-bold text-white">New Blog Post</h1>
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
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving || !formData.title || !formData.content}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-color-bg-deep rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 font-medium"
              >
                Publish
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
              <h1 className="text-3xl font-bold text-white mb-4">{formData.title || 'Untitled Post'}</h1>
              <p className="text-xl text-white/70 mb-6">{formData.excerpt}</p>
              {formData.featuredImage && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
                  <img 
                    src={formData.featuredImage} 
                    alt="Featured" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-4 text-white/50 text-sm mb-8 pb-8 border-b border-white/10">
                <span>{formData.author}</span>
                <span>{new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>{formData.readTime}</span>
              </div>
              <div className="prose prose-invert max-w-none">
                {formData.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-white/80 mb-4">{paragraph}</p>
                ))}
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
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-accent"
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
                placeholder="Brief summary for SEO and previews..."
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
                  placeholder="e.g., 5 min read"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent"
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
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., CIPC, company registration, South Africa"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Images */}
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUpload
                label="Featured Image"
                description="Main image shown on blog post and listing (recommended: 1200x800px)"
                value={formData.featuredImage}
                onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                folder="blog"
              />
              <ImageUpload
                label="Social Share Image (OG Image)"
                description="Image for Facebook/Twitter sharing (recommended: 1200x630px)"
                value={formData.ogImage}
                onChange={(url) => setFormData(prev => ({ ...prev, ogImage: url }))}
                folder="blog"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog post content here... Use markdown formatting: # for headings, ## for subheadings, etc."
                rows={20}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent font-mono text-sm"
              />
            </div>

            {/* Tips */}
            <div className="glass-card p-4 bg-yellow-500/10 border-yellow-500/30">
              <p className="text-yellow-200 text-sm">
                <strong>Markdown Tips:</strong> Use # for main title, ## for sections, ### for subsections. 
                Leave blank lines between paragraphs. The preview will show formatted output.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
