import { createServerClient } from './supabase-server';

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  ogImage?: string;
  status: 'published' | 'draft';
  created_at?: string;
  updated_at?: string;
}

// Transform database row to BlogPost interface
function transformRow(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    date: row.date,
    readTime: row.read_time,
    category: row.category,
    tags: row.tags || [],
    featuredImage: row.featured_image || undefined,
    ogImage: row.og_image || undefined,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Transform BlogPost to database row
function transformToRow(post: Partial<BlogPost>): any {
  const row: any = {};
  if (post.slug !== undefined) row.slug = post.slug;
  if (post.title !== undefined) row.title = post.title;
  if (post.excerpt !== undefined) row.excerpt = post.excerpt;
  if (post.content !== undefined) row.content = post.content;
  if (post.author !== undefined) row.author = post.author;
  if (post.date !== undefined) row.date = post.date;
  if (post.readTime !== undefined) row.read_time = post.readTime;
  if (post.category !== undefined) row.category = post.category;
  if (post.tags !== undefined) row.tags = post.tags;
  if (post.featuredImage !== undefined) row.featured_image = post.featuredImage || null;
  if (post.ogImage !== undefined) row.og_image = post.ogImage || null;
  if (post.status !== undefined) row.status = post.status;
  return row;
}

// Get all published blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    console.log('Creating Supabase client...');
    const supabase = createServerClient();
    console.log('Supabase client created, fetching posts...');
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching blog posts:', error.message, error.details);
      return [];
    }

    console.log('Fetched', data?.length || 0, 'blog posts');
    return (data || []).map(transformRow);
  } catch (err: any) {
    console.error('Exception fetching blog posts:', err?.message || err);
    return [];
  }
}

// Get all blog posts including drafts (for admin)
export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return (data || []).map(transformRow);
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return data ? transformRow(data) : null;
}

// Get blog post by slug for admin (includes drafts)
export async function getBlogPostBySlugAdmin(slug: string): Promise<BlogPost | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }

  return data ? transformRow(data) : null;
}

// Get all slugs for static generation
export async function getAllSlugs(): Promise<string[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }

  return (data || []).map(row => row.slug);
}

// Admin: Create a new blog post
export async function createBlogPost(post: BlogPost): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient();
    
    // Transform CamelCase to snake_case for the database
    const row = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      read_time: post.readTime,
      category: post.category,
      tags: post.tags,
      featured_image: post.featuredImage, // Crucial fix
      og_image: post.ogImage,
      status: post.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating blog post in Supabase:', row);

    const { error } = await supabase
      .from('blog_posts')
      .insert([row]);

    if (error) {
      console.error('Supabase insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception in createBlogPost:', err);
    return { success: false, error: err.message };
  }
}

// Admin: Update a blog post
export async function updateBlogPost(slug: string, updates: Partial<BlogPost>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient();
    
    // Transform CamelCase (Frontend) to snake_case (Database)
    const row: any = {
      updated_at: new Date().toISOString()
    };
    
    if (updates.title !== undefined) row.title = updates.title;
    if (updates.excerpt !== undefined) row.excerpt = updates.excerpt;
    if (updates.content !== undefined) row.content = updates.content;
    if (updates.author !== undefined) row.author = updates.author;
    if (updates.date !== undefined) row.date = updates.date;
    if (updates.readTime !== undefined) row.read_time = updates.readTime;
    if (updates.category !== undefined) row.category = updates.category;
    if (updates.tags !== undefined) row.tags = updates.tags;
    if (updates.featuredImage !== undefined) row.featured_image = updates.featuredImage;
    if (updates.ogImage !== undefined) row.og_image = updates.ogImage;
    if (updates.status !== undefined) row.status = updates.status;

    console.log('Sending update to Supabase for slug:', slug, row);

    const { error } = await supabase
      .from('blog_posts')
      .update(row)
      .eq('slug', slug);

    if (error) {
      console.error('Supabase update error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception in updateBlogPost:', err);
    return { success: false, error: err.message || 'An unknown error occurred' };
  }
}

// Admin: Delete a blog post
export async function deleteBlogPost(slug: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('slug', slug);

  if (error) {
    console.error('Error deleting blog post:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
