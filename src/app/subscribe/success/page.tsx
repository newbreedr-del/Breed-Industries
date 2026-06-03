import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SubscribeSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-color-bg-primary flex items-center justify-center py-24 relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative z-10 text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white mb-3">You're subscribed!</h1>
          <p className="text-white/60 mb-2 leading-relaxed">
            Welcome to Business Growth Essentials. Your first month is active and your subscription will renew automatically each month.
          </p>
          <p className="text-white/40 text-sm mb-8">
            You'll receive a confirmation email shortly. Our team will reach out within 24 hours to get you onboarded.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-accent font-medium hover:underline">
            Back to Home <ArrowRight size={16} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
