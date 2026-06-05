'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import QuoteGenerator from '@/components/QuoteGenerator';
import { ArrowLeft } from 'lucide-react';

function NewQuoteContent() {
  const router = useRouter();

  return (
    <>
      <Header />

      <PageHero
        title="Create New Quote"
        subtitle="Admin Dashboard"
        description="Generate a professional PDF quote for a client. Fill in client details, add services, set payment terms, and send directly."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Quotes', href: '/admin/quotes' },
          { label: 'New Quote', href: '/admin/quotes/new' }
        ]}
        size="default"
      >
        <Link href="/admin/quotes" className="btn btn-outline">
          <ArrowLeft size={16} />
          Back to Quotes
        </Link>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <QuoteGenerator
            selectedItems={[]}
            onSuccess={(details) => {
              router.push('/admin/quotes');
            }}
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/60 text-sm">Loading...</div>
      </div>
    }>
      <NewQuoteContent />
    </Suspense>
  );
}
