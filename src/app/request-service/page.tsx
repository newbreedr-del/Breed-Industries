'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import ServiceRequestForm from '@/components/ServiceRequestForm';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RequestServicePage() {
  const router = useRouter();

  return (
    <>
      <Header />
      
      <PageHero
        title="Request a Service"
        subtitle="Tell us what you need and upload the required documents. We'll review your request and get back to you with a quote within 24 hours."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Request Service', href: '/request-service' }
        ]}
        size="default"
      />

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 mb-8">
              <div className="flex items-start gap-4">
                <FileText size={32} className="text-accent flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
                  <ol className="text-white/70 space-y-2 list-decimal list-inside">
                    <li>Select the service you need from the dropdown</li>
                    <li>Fill in your contact information</li>
                    <li>Upload the required documents for your selected service</li>
                    <li>Submit your request</li>
                    <li>We'll review and send you a detailed quote within 24 hours</li>
                  </ol>
                </div>
              </div>
            </div>

            <ServiceRequestForm
              onSuccess={(requestId) => {
                setTimeout(() => {
                  router.push('/');
                }, 3000);
              }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
