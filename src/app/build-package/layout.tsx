import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Build Your Package | Custom Quote Builder | Breed Industries',
  description: 'Build your custom business package with our interactive quote builder. Select CIPC registration, branding, websites, and more. Get an instant estimate and request a formal quote.',
  keywords: ['custom business package', 'build your package', 'business quote builder', 'CIPC registration quote', 'website quote South Africa', 'branding package price', 'business services calculator'],
  alternates: { canonical: 'https://thebreed.co.za/build-package' },
  openGraph: {
    title: 'Build Your Custom Package - Breed Industries',
    description: 'Interactive quote builder. Select services, see pricing in real-time, get a formal quote.',
    url: 'https://thebreed.co.za/build-package',
    images: [{ url: '/assets/images/build-package-og.jpg', width: 1200, height: 630 }],
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
