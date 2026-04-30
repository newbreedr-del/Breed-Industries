import fs from 'fs';
import path from 'path';

export interface BlogPost {
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
}

// Path to the JSON data file
const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'blog-posts.json');

interface BlogData {
  posts: BlogPost[];
}

// Read blog posts from JSON file
function readBlogData(): BlogData {
  try {
    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading blog data:', error);
    return { posts: [] };
  }
}

// Write blog posts to JSON file
function writeBlogData(data: BlogData): void {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing blog data:', error);
    throw error;
  }
}

// Convert posts array to Record for easy lookup
function getPostsRecord(): Record<string, BlogPost> {
  const data = readBlogData();
  const record: Record<string, BlogPost> = {};
  data.posts.forEach(post => {
    record[post.slug] = post;
  });
  return record;
}

export function getAllBlogPosts(): BlogPost[] {
  return readBlogData().posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getPostsRecord()[slug];
}

export function getAllSlugs(): string[] {
  return readBlogData().posts.map(post => post.slug);
}

// Admin functions for CRUD operations
export function createBlogPost(post: BlogPost): void {
  const data = readBlogData();
  data.posts.push(post);
  writeBlogData(data);
}

export function updateBlogPost(slug: string, updates: Partial<BlogPost>): void {
  const data = readBlogData();
  const index = data.posts.findIndex(p => p.slug === slug);
  if (index !== -1) {
    data.posts[index] = { ...data.posts[index], ...updates };
    writeBlogData(data);
  }
}

export function deleteBlogPost(slug: string): void {
  const data = readBlogData();
  data.posts = data.posts.filter(p => p.slug !== slug);
  writeBlogData(data);
}
