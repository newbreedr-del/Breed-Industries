'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  Filter
} from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  status: 'published' | 'draft';
  tags: string[];
  featuredImage?: string;
}

export default function BlogManagement() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // In a real implementation, this would fetch from an API or database
      // For now, we'll use the hardcoded posts from the blog page
      const defaultPosts: BlogPost[] = [
        {
          slug: 'how-to-register-company-south-africa',
          title: 'How to Register a Company in South Africa: Complete 2026 Guide',
          excerpt: 'Step-by-step guide to registering your company with CIPC in South Africa.',
          author: 'Breed Industries',
          date: '30 April 2026',
          readTime: '8 min read',
          category: 'Business Registration',
          status: 'published',
          tags: ['CIPC', 'company registration', 'South Africa', 'business startup'],
          featuredImage: '/assets/images/blog/company-registration.jpg',
        },
        {
          slug: 'startup-costs-south-africa-2026',
          title: 'Startup Costs in South Africa 2026: Real Budget Breakdown',
          excerpt: 'Real costs to start a business in South Africa in 2026.',
          author: 'Breed Industries',
          date: '28 April 2026',
          readTime: '10 min read',
          category: 'Startup Guide',
          status: 'published',
          tags: ['startup costs', 'business budget', 'South Africa', 'entrepreneurship'],
          featuredImage: '/assets/images/blog/startup-costs.jpg',
        },
        {
          slug: 'why-your-business-needs-professional-logo',
          title: 'Why Your Business Needs a Professional Logo: 10 Reasons',
          excerpt: 'Discover why a professional logo is crucial for business success.',
          author: 'Breed Industries',
          date: '25 April 2026',
          readTime: '6 min read',
          category: 'Branding',
          status: 'published',
          tags: ['logo design', 'branding', 'business identity', 'South Africa'],
          featuredImage: '/assets/images/blog/professional-logo.jpg',
        },
      ];
      setPosts(defaultPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    try {
      // In production, this would call an API to delete from database
      setPosts(posts.filter(post => post.slug !== slug));
      alert('Blog post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(posts.map(post => post.category))];

  return (
    <div className="min-h-screen bg-color-bg-deep">
      {/* Header */}
      <div className="bg-color-bg-secondary border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-accent" />
                Blog Management
              </h1>
            </div>
            <Link 
              href="/admin/blog/new"
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search posts by title, excerpt, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-white/60" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-color-bg-deep">
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{posts.length}</p>
            <p className="text-white/60 text-sm">Total Posts</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-green-400">
              {posts.filter(p => p.status === 'published').length}
            </p>
            <p className="text-white/60 text-sm">Published</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {posts.filter(p => p.status === 'draft').length}
            </p>
            <p className="text-white/60 text-sm">Drafts</p>
          </div>
        </div>

        {/* Posts Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-2">No posts found</p>
            <p className="text-white/40 text-sm">
              {searchQuery ? 'Try adjusting your search or filters' : 'Create your first blog post to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div 
                key={post.slug} 
                className="glass-card p-6 flex flex-col md:flex-row md:items-center gap-4 hover:border-accent/30 transition-colors"
              >
                {/* Thumbnail */}
                {post.featuredImage && (
                  <div className="relative w-full md:w-32 h-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {post.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                    <span className="px-2 py-1 bg-accent/10 text-accent rounded">
                      {post.category}
                    </span>
                    <span>{post.tags.length} tags</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 text-white/60 hover:text-accent hover:bg-white/5 rounded-lg transition-colors"
                    title="View on site"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/admin/blog/${post.slug}`}
                    className="p-2 text-white/60 hover:text-accent hover:bg-white/5 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
