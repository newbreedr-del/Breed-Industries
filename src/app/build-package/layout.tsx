import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Quote | Interactive Pricing Calculator | Breed Industries',
  description: 'Build your custom business package with our interactive quote builder. Real-time pricing for company registration, branding, web development, and digital services. Instant quotes and downloadable proposals.',
  keywords: ['business quote', 'company registration price', 'branding cost', 'website development quote', 'business services pricing', 'instant quote'],
  openGraph: {
    title: 'Get Instant Quote - Breed Industries',
    description: 'Build your custom business package with real-time pricing. Interactive quote builder for all business services.',
    type: 'website',
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
