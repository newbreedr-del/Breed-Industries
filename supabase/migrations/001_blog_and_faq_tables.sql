-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Breed Industries',
  date TEXT NOT NULL,
  read_time TEXT DEFAULT '5 min read',
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  og_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public read access to faqs" ON faqs;
DROP POLICY IF EXISTS "Allow admin full access to blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow admin full access to faqs" ON faqs;

-- Create policies for public read access
CREATE POLICY "Allow public read access to blog posts" 
  ON blog_posts FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Allow public read access to faqs" 
  ON faqs FOR SELECT 
  TO PUBLIC 
  USING (true);

-- Create policies for admin full access (you'll need to set up admin authentication)
CREATE POLICY "Allow admin full access to blog posts" 
  ON blog_posts FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to faqs" 
  ON faqs FOR ALL 
  USING (auth.role() = 'authenticated');

-- Note: Blog posts and FAQs should be created via the admin interface
-- This keeps the database clean and ensures all content is managed through the CMS

-- ============================================
-- STORAGE BUCKET SETUP FOR IMAGES
-- ============================================

-- Create the storage bucket for blog and site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('Blog and Site', 'Blog and Site', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow public read access to Blog and Site bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to Blog and Site bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete from Blog and Site bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update to Blog and Site bucket" ON storage.objects;

-- Policy: Allow public read access to all objects in the bucket
CREATE POLICY "Allow public read access to Blog and Site bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'Blog and Site');

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads to Blog and Site bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'Blog and Site' AND auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete files
CREATE POLICY "Allow authenticated delete from Blog and Site bucket"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'Blog and Site' AND auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update files
CREATE POLICY "Allow authenticated update to Blog and Site bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'Blog and Site' AND auth.role() = 'authenticated');
