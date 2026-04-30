'use client';

import Image from 'next/image';

const ogTemplates = [
  { name: 'Home', title: 'Breed Industries', subtitle: 'Build Your Business Empire', image: '/assets/images/portfolio-hero.png', filename: 'og-image' },
  { name: 'Services', title: 'Business Services', subtitle: 'Registration • Branding • Digital', image: '/assets/images/build-package-hero.jpg', filename: 'services-og' },
  { name: 'Portfolio', title: 'Our Portfolio', subtitle: 'Real Work. Real Clients. Real Impact.', image: '/assets/images/portfolio-hero.png', filename: 'portfolio-og' },
  { name: 'About', title: 'About Us', subtitle: 'The Empire Behind the Blueprint', image: '/assets/images/about-hero.jpg', filename: 'about-og' },
  { name: 'Contact', title: 'Get In Touch', subtitle: 'Let\'s Build Something Great', image: '/assets/images/contact-hero.jpg', filename: 'contact-og' },
  { name: 'Build Package', title: 'Build Your Package', subtitle: 'Custom Quote Builder', image: '/assets/images/build-package-hero.jpg', filename: 'build-package-og' },
];

export default function OGGenerator() {
  const downloadInstructions = `
To download OG images:
1. Right-click on each image below
2. Select "Save image as..."
3. Save to: public/assets/images/[filename].jpg
4. Or use browser dev tools to capture at exactly 1200x630
  `;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-4">OG Image Generator</h1>
      <p className="text-gray-400 mb-2">1200 × 630 pixels for social sharing (Facebook, LinkedIn, Twitter)</p>
      <pre className="text-xs text-gray-500 mb-8 bg-gray-800 p-4 rounded">{downloadInstructions}</pre>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ogTemplates.map((template) => (
          <div key={template.name} className="space-y-2">
            <p className="text-white font-medium">{template.name} → {template.filename}.jpg</p>
            <div 
              className="relative w-[600px] h-[315px] overflow-hidden rounded-lg border-2 border-accent"
              style={{ aspectRatio: '1200/630' }}
            >
              {/* Background Image */}
              <Image
                src={template.image}
                alt={template.name}
                fill
                className="object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <p className="text-accent text-sm font-medium tracking-wider uppercase mb-2">
                  Breed Industries
                </p>
                <h2 className="text-white text-4xl font-bold leading-tight mb-2">
                  {template.title}
                </h2>
                <p className="text-white/80 text-xl">
                  {template.subtitle}
                </p>
              </div>

              {/* Logo Mark */}
              <div className="absolute top-4 right-4">
                <Image
                  src="/assets/images/logos/breed-logo-just.png"
                  alt="Breed"
                  width={48}
                  height={48}
                  className="opacity-80"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
