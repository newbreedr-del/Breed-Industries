# Breed Industries Website - Complete Documentation

## Executive Summary

**Breed Industries** is a modern Next.js 15 web application providing business setup, branding, and digital solutions in South Africa. The site features a dark-themed design with a comprehensive service catalog, blog system, quote generation, and admin dashboard.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Pages & Routes](#pages--routes)
4. [Components](#components)
5. [Database Schema](#database-schema)
6. [API Routes](#api-routes)
7. [Environment Variables](#environment-variables)
8. [Features](#features)
9. [Third-Party Integrations](#third-party-integrations)
10. [Deployment](#deployment)

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js | 16.1.1 |
| **Language** | TypeScript | 5.6.3 |
| **React** | React | 18.3.1 |
| **Styling** | Tailwind CSS | 3.4.15 |
| **UI Components** | Radix UI | ^1.0.5 |
| **Animation** | Framer Motion | ^11.3.28 |
| **Database** | Supabase | ^2.105.1 |
| **Rich Text** | Tiptap | ^3.22.5 |
| **PDF Generation** | jsPDF | ^4.0.0 |
| **Icons** | Lucide React | ^0.469.0 |
| **Email** | Resend | ^6.8.0 |
| **SMS/WhatsApp** | Twilio | ^5.12.1 |
| **Payment** | Stitch Money | - |

---

## Project Structure

```
Breed Industries Web App/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (routes)/           # Public pages
│   │   ├── admin/              # Admin dashboard
│   │   ├── api/                # API endpoints
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/             # React components
│   │   ├── blog/               # Blog components
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   ├── quote/              # Quote system
│   │   ├── sections/           # Page sections
│   │   └── ui/                 # UI components
│   ├── content/                # Static content
│   │   └── blog/               # Blog markdown files
│   ├── lib/                    # Utility libraries
│   │   ├── blog.ts             # Blog functions
│   │   ├── supabase.ts         # Supabase client
│   │   └── supabase-server.ts  # Server Supabase client
│   └── styles/                 # Additional styles
├── supabase/
│   └── migrations/             # Database migrations
├── public/                     # Static assets
└── package.json               # Dependencies
```

---

## Pages & Routes

### Public Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `page.tsx` | Homepage with hero, services, portfolio |
| `/about` | `about/page.tsx` | Company information, mission, values |
| `/services` | `services/page.tsx` | Service catalog listing |
| `/portfolio` | `portfolio/page.tsx` | Portfolio showcase |
| `/blog` | `blog/page.tsx` | Blog listing page |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | Individual blog post |
| `/faq` | `faq/page.tsx` | Frequently asked questions |
| `/contact` | `contact/page.tsx` | Contact form |
| `/build-package` | `build-package/page.tsx` | Custom service package builder |
| `/request-service` | `request-service/page.tsx` | Service request form |
| `/privacy-policy` | `privacy-policy/page.tsx` | Privacy policy |
| `/terms-of-service` | `terms-of-service/page.tsx` | Terms of service |

### Admin Pages

| Route | File | Description |
|-------|------|-------------|
| `/admin` | `admin/page.tsx` | Admin dashboard home |
| `/admin/blog` | `admin/blog/page.tsx` | Blog post management |
| `/admin/blog/new` | `admin/blog/new/page.tsx` | Create new blog post |
| `/admin/blog/[id]` | `admin/blog/[id]/page.tsx` | Edit blog post |
| `/admin/invoices` | `admin/invoices/page.tsx` | Invoice management |
| `/admin/invoices/[id]` | `admin/invoices/[id]/page.tsx` | View/edit invoice |
| `/admin/quotes` | `admin/quotes/page.tsx` | Quote management |
| `/admin/service-requests` | `admin/service-requests/page.tsx` | Service request management |
| `/admin/settings` | `admin/settings/page.tsx` | Admin settings |

---

## Components

### Blog Components

| Component | File | Description |
|-----------|------|-------------|
| `BlogEditor` | `components/blog/BlogEditor.tsx` | Rich text editor with formatting |
| `BlogImage` | `components/blog/BlogImage.tsx` | Image component with fallback |

### UI Components

| Component | File | Description |
|-----------|------|-------------|
| `ImageUpload` | `components/ui/ImageUpload.tsx` | Drag & drop image upload |
| `WhatsAppButton` | `components/ui/WhatsAppButton.tsx` | Floating WhatsApp button |
| `QuoteGenerator` | `components/QuoteGenerator.tsx` | Quote generation form |
| `ServiceRequestForm` | `components/ServiceRequestForm.tsx` | Service request form |

### Layout Components

| Component | File | Description |
|-----------|------|-------------|
| `ClientComponents` | `components/layout/ClientComponents.tsx` | Client-side layout wrapper |
| `Header` | `components/layout/Header.tsx` | Site navigation header |
| `Footer` | `components/layout/Footer.tsx` | Site footer |
| `MobileMenu` | `components/layout/MobileMenu.tsx` | Mobile navigation menu |

### Quote Components

| Component | File | Description |
|-----------|------|-------------|
| `QuoteSummary` | `components/quote/QuoteSummary.tsx` | Quote summary display |
| `QuotePDFGenerator` | `components/quote/QuotePDFGenerator.tsx` | PDF generation |

---

## Database Schema

### Tables

#### `blog_posts`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | UUID | gen_random_uuid() | Primary key |
| `slug` | TEXT | - | Unique URL identifier |
| `title` | TEXT | - | Post title |
| `excerpt` | TEXT | - | Short description |
| `content` | TEXT | - | Full HTML content |
| `author` | TEXT | 'Breed Industries' | Post author |
| `date` | TEXT | - | Publication date |
| `read_time` | TEXT | '5 min read' | Estimated read time |
| `category` | TEXT | - | Post category |
| `tags` | TEXT[] | '{}' | Array of tags |
| `featured_image` | TEXT | null | Featured image URL |
| `og_image` | TEXT | null | Social share image URL |
| `status` | TEXT | 'draft' | 'published' or 'draft' |
| `created_at` | TIMESTAMP | NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOW() | Last update timestamp |

#### `faqs`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | UUID | gen_random_uuid() | Primary key |
| `question` | TEXT | - | FAQ question |
| `answer` | TEXT | - | FAQ answer |
| `category` | TEXT | - | FAQ category |
| `order` | INTEGER | 0 | Display order |
| `created_at` | TIMESTAMP | NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOW() | Last update timestamp |

### Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `Blog and Site` | Yes | Blog images and site assets |

### Row Level Security (RLS)

- **Blog Posts**: Public can read published posts; authenticated users have full access
- **FAQs**: Public read access for all
- **Storage**: Public read access; public upload/delete/update for admin interface

---

## API Routes

### Blog API

| Route | Method | Description |
|-------|--------|-------------|
| `/api/blog` | GET | Get all blog posts (admin) |
| `/api/blog` | POST | Create new blog post |
| `/api/blog/[slug]` | GET | Get single blog post |
| `/api/blog/[slug]` | PUT | Update blog post |
| `/api/blog/[slug]` | DELETE | Delete blog post |

### Quote API

| Route | Method | Description |
|-------|--------|-------------|
| `/api/generate-quote` | POST | Generate service quote |
| `/api/generate-quote/pdf` | POST | Generate quote PDF |
| `/api/generate-quote/send` | POST | Email quote to customer |

### Invoice API

| Route | Method | Description |
|-------|--------|-------------|
| `/api/invoices` | GET | List all invoices |
| `/api/invoices` | POST | Create new invoice |
| `/api/invoices/[id]` | GET | Get single invoice |
| `/api/invoices/[id]/pdf` | GET | Download invoice PDF |

### Contact & Notifications

| Route | Method | Description |
|-------|--------|-------------|
| `/api/contact` | POST | Send contact form |
| `/api/notifications/whatsapp` | POST | Send WhatsApp notification |
| `/api/whatsapp` | POST | Send WhatsApp message via Twilio |

### Payment (Stitch Money)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/stitch/token` | POST | Get Stitch access token |
| `/api/stitch/payment` | POST | Initiate payment |
| `/api/stitch/callback` | GET/POST | Payment callback handler |

### Admin API

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/login` | POST | Admin authentication |
| `/api/admin/logout` | POST | Admin logout |
| `/api/admin/check` | GET | Check admin session |

### Service Requests

| Route | Method | Description |
|-------|--------|-------------|
| `/api/service-requests` | GET | List service requests |
| `/api/service-requests` | POST | Submit service request |
| `/api/service-requests/[id]` | GET | Get single request |

### Utility

| Route | Method | Description |
|-------|--------|-------------|
| `/api/og` | GET | Generate Open Graph images |
| `/api/test-supabase` | GET | Test Supabase connection |
| `/api/test-twilio` | GET | Test Twilio connection |

---

## Environment Variables

### Required Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side) | Yes |

### Email Configuration

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key for email |
| `COMPANY_EMAIL` | Company email address |
| `SALES_EMAIL_USER` | Sales email username |
| `SALES_EMAIL_PASSWORD` | Sales email password |

### Admin Configuration

| Variable | Description |
|----------|-------------|
| `ADMIN_USERNAME` | Admin dashboard username |
| `ADMIN_PASSWORD` | Admin dashboard password |

### Twilio Configuration

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp number |
| `YOUR_WHATSAPP_NUMBER` | Your WhatsApp number |

### Stitch Money Configuration

| Variable | Description |
|----------|-------------|
| `STITCH_CLIENT_ID` | Stitch client ID |
| `STITCH_CLIENT_SECRET` | Stitch client secret |
| `STITCH_ENVIRONMENT` | 'sandbox' or 'production' |
| `STITCH_REDIRECT_URI` | Payment callback URL |
| `STITCH_WEBHOOK_SECRET` | Webhook verification secret |

### Bank Account

| Variable | Description |
|----------|-------------|
| `COMPANY_ACCOUNT_NUMBER` | Bank account number |
| `COMPANY_BANK_ID` | Bank identifier |
| `COMPANY_BRANCH_CODE` | Branch code |

---

## Features

### Core Features

1. **Service Catalog**
   - Business Registration (CIPC)
   - Branding & Logo Design
   - Website Development
   - Business Plans
   - Digital Marketing
   - Compliance Services

2. **Quote System**
   - Build custom service packages
   - Real-time quote calculation
   - PDF generation
   - Email quotes

3. **Blog System**
   - Rich text editor
   - Image uploads to Supabase Storage
   - Categories and tags
   - SEO optimization
   - Draft/Publish workflow

4. **Admin Dashboard**
   - Blog management
   - Invoice generation
   - Quote management
   - Service request tracking
   - Settings configuration

5. **Payment Integration**
   - Stitch Money payment gateway
   - Secure payment processing
   - Webhook handling

6. **Communication**
   - WhatsApp integration (Twilio)
   - Email notifications (Resend)
   - Contact forms

### Technical Features

- **Server-Side Rendering (SSR)** with Next.js 15
- **Static Site Generation (SSG)** for performance
- **Image Optimization** with Next.js Image
- **API Routes** for backend functionality
- **Database Integration** with Supabase
- **File Storage** with Supabase Storage
- **Rich Text Editing** with Tiptap
- **PDF Generation** with jsPDF
- **Authentication** for admin routes
- **SEO Optimization** with metadata API
- **Open Graph Images** dynamic generation

---

## Third-Party Integrations

| Service | Purpose | Integration Type |
|---------|---------|------------------|
| **Supabase** | Database, Storage, Auth | SDK (@supabase/supabase-js) |
| **Resend** | Email delivery | REST API |
| **Twilio** | WhatsApp/SMS | REST API |
| **Stitch Money** | Payment processing | OAuth + REST API |
| **Vercel** | Hosting & Deployment | Git integration |
| **Hostinger** | Email hosting | SMTP/IMAP |

---

## Deployment

### Platform
- **Primary**: Vercel (https://thebreed.co.za)
- **Branch Deployments**: Auto-deployed for every git push

### Build Process
```bash
npm run build    # Production build
npm run start    # Start production server
```

### Environment Setup
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy from main branch

### Database
- Hosted on Supabase
- PostgreSQL with Row Level Security
- Storage bucket: "Blog and Site"

---

## File Locations

### Key Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `tsconfig.json` | TypeScript configuration |
| `next.config.js` | Next.js configuration |
| `.env.local` | Local environment variables |
| `.env.example` | Environment variable template |

### Important Source Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with fonts and metadata |
| `src/app/page.tsx` | Homepage component |
| `src/lib/blog.ts` | Blog CRUD operations |
| `src/lib/supabase.ts` | Supabase client configuration |
| `supabase/migrations/001_blog_and_faq_tables.sql` | Database schema |

---

## Last Updated

**Date**: May 1, 2026
**Version**: 1.0.0
**Author**: Breed Industries Development Team

---

## Support

For technical support or questions:
- Email: info@thebreed.co.za
- Website: https://thebreed.co.za
- Admin Panel: https://thebreed.co.za/admin
