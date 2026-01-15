import './globals.css';
import '../styles/tokens.css';
import '../styles/animations.css';
import '../styles/mixins.css';
import { Inter, Montserrat, JetBrains_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
  title: 'Breed Industries – Premium South African Business Agency',
  description: 'Breed Industries is a premium South African business agency providing business registration, branding, and digital solutions for entrepreneurs.',
  keywords: 'business registration, branding, web development, South Africa, Durban, digital marketing',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-color-bg-deep min-h-screen font-sans text-white">
        <div className="blueprint-bg min-h-screen flex flex-col">
          {children}
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
