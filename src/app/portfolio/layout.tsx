import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Our Work - Apps, Branding, Business Plans | Breed Industries',
  description: 'See our portfolio of work: Engage Africa AI platform, brand identities for South African businesses, business plans, and compliance projects. Real work, real clients, real impact.',
  keywords: ['Breed Industries portfolio', 'business portfolio South Africa', 'branding portfolio', 'app development portfolio', 'business plan examples', 'website portfolio Durban', 'company registration projects'],
  alternates: { canonical: 'https://thebreed.co.za/portfolio' },
  openGraph: {
    title: 'Our Portfolio - Breed Industries',
    description: 'Real work, real clients, real impact. See the businesses we have helped launch across South Africa.',
    url: 'https://thebreed.co.za/portfolio',
    images: [{ url: '/assets/images/portfolio-og.jpg', width: 1200, height: 630 }],
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
