# Breed Industries Website

A modern, state-of-the-art website for Breed Industries, a premium South African business agency specializing in business registration, branding, and digital solutions.

## Features

- **Modern UI/UX Design**: Clean, professional interface with deep navy, gold, and tech blue color scheme
- **Interactive Package Builder**: Custom tool for clients to build and price their own service packages
- **Client Gallery/Portfolio**: Showcase of previous work and client testimonials
- **Team Section**: Professional display of team members using Astra components
- **Mobile-First Responsive Design**: Optimized for all device sizes
- **Premium Animations**: Smooth scroll effects, fade-in animations, and parallax effects
- **WhatsApp Integration**: Direct contact via WhatsApp buttons throughout the site
- **SEO Optimized**: Built with best practices for search engine visibility

## Technology Stack

- **Framework**: Next.js 13 with App Router
- **Styling**: TailwindCSS with custom configuration
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Custom components with Astra-based layouts

## Project Structure

```
breed-industries-website/
├── public/                # Static assets
│   └── assets/
│       ├── images/        # Images for the website
│       │   ├── clients/   # Client logos
│       │   ├── portfolio/ # Portfolio images
│       │   └── team/      # Team member photos
├── src/                   # Source code
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   └── components/        # React components
│       ├── header.tsx     # Site header
│       ├── hero.tsx       # Hero section
│       ├── stats.tsx      # Statistics section
│       ├── services.tsx   # Services section
│       ├── packages.tsx   # Service packages
│       ├── package-builder.tsx # Interactive package builder
│       ├── client-gallery.tsx  # Client portfolio
│       ├── team.tsx       # Team section
│       ├── benefits.tsx   # Benefits section
│       ├── cta.tsx        # Call to action section
│       ├── footer.tsx     # Site footer
│       └── floating-whatsapp.tsx # Floating WhatsApp button
├── package.json           # Project dependencies
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Service Packages

The website showcases three main service packages:

1. **Launch Starter** (R2,500 - R4,500)
   - Business Registration (Gold level)
   - Basic branding essentials
   - Marketing materials (cards or posters)

2. **Growth Professional** (R6,000 - R10,000)
   - All Launch Starter inclusions
   - Enhanced branding (Standard/Premium logo)
   - Web presence (5-10 page website)
   - App development: Custom build
   - Digital marketing: Social setup
   - Strategic documents (business plan or portfolio)

3. **Empire Premium** (R12,000 - R25,000+)
   - All Growth Professional inclusions
   - Advanced tech (web portal or app)
   - Video marketing (1-minute ad)
   - Comprehensive branding (full media kit)
   - Ongoing support (3 months social)
   - Compliance add-ons included

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/breed-industries-website.git
   cd breed-industries-website
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
```

## Design System

### Color Palette
- Deep Navy: #001F3F (primary dark color)
- Gold: #D4AF37 (accent color)
- Tech Blue: #0070F3 (secondary accent)
- White: #FFFFFF
- Charcoal: #333333
- Warm Off-White: #F8F5F0

### Typography
- Headings: Montserrat (600, 700, 800)
- Body: Inter (400, 500, 600, 700)

### Animation Elements
- Fade-in-up animations for content blocks
- Parallax hero section for desktop
- Smooth anchor scrolling
- Progress bar on Services/Pricing pages
- Hover states for all interactive elements

## Contact

For any inquiries, please contact:
- WhatsApp: 068 503 7221
- Email: info@thebreed.co.za
