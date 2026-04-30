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

-- Insert sample blog posts
INSERT INTO blog_posts (slug, title, excerpt, content, author, date, read_time, category, tags, featured_image, og_image, status) VALUES
(
  'how-to-register-company-south-africa',
  'How to Register a Company in South Africa: Complete 2026 Guide',
  'Step-by-step guide to registering your company with CIPC in South Africa.',
  E'Starting a business in South Africa begins with proper company registration.\n\n## Why Register Your Company?\n\n- **Legal Protection**: Separate personal assets from business liabilities\n- **Credibility**: Customers trust registered businesses\n- **Funding Access**: Required for bank loans and investors\n\n## Costs Summary\n\n| Item | Cost |\n|------|------|\n| Name Reservation | R50 |\n| Company Registration | R125 |\n| **Total** | **R175** |',
  'Breed Industries',
  '30 April 2026',
  '8 min read',
  'Business Registration',
  ARRAY['CIPC', 'company registration', 'South Africa'],
  '/assets/images/blog/company-registration.jpg',
  '/assets/images/blog/company-registration-og.jpg',
  'published'
),
(
  'startup-costs-south-africa-2026',
  'Startup Costs in South Africa 2026: Real Budget Breakdown',
  'Real costs to start a business in South Africa in 2026.',
  E'Starting a business requires capital. This guide breaks down actual startup costs.\n\n## Startup Budget\n\n**Service Business**: R15,000-R30,000 (lean) to R50,000-R100,000 (professional)\n\n**Product/E-commerce**: R50,000-R100,000 minimum\n\n## Conclusion\n\nPlan conservatively and have a 6-month runway.',
  'Breed Industries',
  '28 April 2026',
  '10 min read',
  'Startup Guide',
  ARRAY['startup costs', 'business budget', 'South Africa'],
  '/assets/images/blog/startup-costs.jpg',
  '/assets/images/blog/startup-costs-og.jpg',
  'published'
),
(
  'why-your-business-needs-professional-logo',
  'Why Your Business Needs a Professional Logo: 10 Reasons',
  'Discover why a professional logo is crucial for business success.',
  E'Your logo is often the first interaction customers have with your brand.\n\n## Key Benefits\n\n1. First impressions matter\n2. Builds instant credibility\n3. Differentiation in markets\n4. Increases perceived value\n\n## Conclusion\n\nProfessional branding is a necessity, not a luxury.',
  'Breed Industries',
  '25 April 2026',
  '6 min read',
  'Branding',
  ARRAY['logo design', 'branding', 'South Africa'],
  '/assets/images/blog/professional-logo.jpg',
  '/assets/images/blog/professional-logo-og.jpg',
  'published'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, "order") VALUES
('How long does company registration take?', 'With our professional service, registration typically takes 3-7 business days. DIY through CIPC can take 2-4 weeks.', 'Company Registration', 1),
('What documents do I need to register a company?', 'You need certified ID copies of directors (certified within 3 months), proof of address, and director consent forms.', 'Company Registration', 2),
('How long does logo design take?', 'Our logo design process takes 5-10 business days, including initial concepts and revisions.', 'Branding & Design', 1),
('How long does it take to build a website?', 'Basic websites: 1-2 weeks. Professional: 2-4 weeks. E-commerce: 4-8 weeks.', 'Website Development', 1),
('What payment options do you offer?', 'We accept EFT, credit cards via PayFast, and cash deposits. We offer payment plans for larger projects.', 'Pricing & Payment', 1)
ON CONFLICT DO NOTHING;
