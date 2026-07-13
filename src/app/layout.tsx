import './globals.css';
import '../styles/tokens.css';
import '../styles/animations.css';
import '../styles/mixins.css';
import { Inter, Montserrat, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClientComponents } from '@/components/layout/ClientComponents';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Breed Industries | Business Infrastructure for Serious South African Businesses',
  description: 'Breed Industries diagnoses what limits your business, builds the systems to fix it, and navigates the funding that already exists. Web applications, compliance, funding access, and equity partnerships for serious SA businesses.',
  keywords: ['business systems South Africa', 'business infrastructure Durban', 'SEDA funding South Africa', 'NYDA grants', 'NEF funding South Africa', 'B-BBEE enterprise development', 'web application development South Africa', 'CIPC SARS compliance', 'CIDB registration', 'business equity partnership', 'Breed Ventures', 'business investment South Africa'],
  authors: [{ name: 'Breed Industries' }],
  creator: 'Breed Industries',
  publisher: 'Breed Industries',
  metadataBase: new URL('https://thebreed.co.za'),
  alternates: { canonical: 'https://thebreed.co.za' },
  openGraph: {
    title: 'Breed Industries | Infrastructure for Serious Businesses',
    description: 'We diagnose what limits your business, build the systems to fix it, and find the funding that already exists. Durban-based. Serving SA.',
    url: 'https://thebreed.co.za',
    siteName: 'Breed Industries',
    images: [{ url: '/api/og?title=Breed%20Industries&subtitle=Build%20Your%20Business%20Empire', width: 1200, height: 630, alt: 'Breed Industries - Business Solutions South Africa' }],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Breed Industries | Business Solutions South Africa',
    description: 'Complete business launch services: registration, branding, websites, and compliance.',
    images: ['/api/og?title=Breed%20Industries&subtitle=Build%20Your%20Business%20Empire'],
    creator: '@breedindustries',
  },
  robots: { index: true, follow: true, nocache: false, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: { google: 'your-google-verification-code' },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Breed Industries',
  image: 'https://thebreed.co.za/assets/images/logos/breed-logo.png',
  '@id': 'https://thebreed.co.za',
  url: 'https://thebreed.co.za',
  telephone: '+27314590080 / +27604964105',
  email: 'info@thebreed.co.za',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '12 Kings Road',
    addressLocality: 'Pinetown',
    addressRegion: 'Durban',
    addressCountry: 'ZA',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -29.8233, longitude: 30.8586 },
  openingHours: 'Mo-Fr 08:00-17:00',
  areaServed: {
    '@type': 'Country',
    name: 'South Africa',
  },
  serviceType: ['Business Registration', 'Company Branding', 'Website Development', 'Mobile App Development', 'Digital Marketing', 'Business Plan Writing', 'Compliance Services'],
  sameAs: ['https://www.linkedin.com/company/breed-industries', 'https://www.instagram.com/breedindustries'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-ZA" className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className="bg-color-bg-deep min-h-screen font-sans text-white">
        <div className="blueprint-bg min-h-screen flex flex-col">
          {children}
        </div>
        <ClientComponents />
        <SpeedInsights />
      </body>
    </html>
  );
}
