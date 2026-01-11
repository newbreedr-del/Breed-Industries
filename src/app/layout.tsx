import './globals.css';
import { Inter, Montserrat } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Breed Industries – Premium South African Business Agency',
  description: 'Breed Industries is a premium South African business agency providing business registration, branding, and digital solutions for entrepreneurs.',
  keywords: 'business registration, branding, web development, South Africa, Durban, digital marketing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="bg-offWhite min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
