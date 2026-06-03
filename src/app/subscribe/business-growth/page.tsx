'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Check, Loader2, TrendingUp, QrCode, ArrowRight, CreditCard } from 'lucide-react';
import Image from 'next/image';

const FEATURES = [
  'Monthly compliance monitoring & alerts',
  'Social media content support',
  'Monthly growth strategy check-in',
  'Business accreditation & funding monitoring',
  'Priority support via WhatsApp',
  'Cancel anytime — no lock-in contract',
];

export default function BusinessGrowthSubscribePage() {
  const [form, setForm] = useState({ name_first: '', name_last: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payments/payfast/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          plan: 'business-growth-essentials',
          name_first: form.name_first,
          name_last: form.name_last,
          email: form.email,
          amount: 950,
          item_name: 'Business Growth Essentials',
          item_description: 'Monthly business growth retainer — compliance, social media, strategy',
          subscription_type: 1,
          frequency: 3,
          cycles: 0,
          returnUrl: `${window.location.origin}/subscribe/success`,
          cancelUrl: `${window.location.origin}/subscribe/business-growth`,
        }),
      });

      const data = await res.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error || 'Failed to initiate payment. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-color-bg-primary pt-24 pb-20 relative">
        <div className="absolute inset-0 grid-overlay" />

        <div className="container mx-auto px-4 relative z-10">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-accent text-sm uppercase tracking-widest font-medium mb-3 block">Monthly Subscription</span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Business Growth Essentials
            </h1>
            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span className="text-5xl font-heading font-bold text-accent">R950</span>
              <span className="text-white/50 text-lg">/month</span>
            </div>
            <p className="text-white/60 max-w-xl mx-auto">
              Everything you need to keep your business compliant, visible, and growing — all in one monthly retainer.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Features */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <TrendingUp className="text-accent" size={20} />
                </div>
                <h2 className="text-xl font-heading font-bold text-white">What's Included</h2>
              </div>

              <ul className="space-y-4 mb-8">
                {FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-3 text-white/75">
                    <Check size={16} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="p-4 rounded-xl bg-accent/8 border border-accent/20">
                <p className="text-accent text-sm font-semibold mb-1">No lock-in contract</p>
                <p className="text-white/55 text-xs leading-relaxed">
                  Month-to-month. Cancel with 30 days notice, no penalties.
                  First month billed immediately, then on the same date each month.
                </p>
              </div>

              {/* QR Code section */}
              <div className="mt-8 pt-6 border-t border-white/8">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode size={16} className="text-white/50" />
                  <span className="text-white/50 text-xs uppercase tracking-wider font-medium">Scan to subscribe</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center p-1.5 shrink-0">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent('https://www.thebreed.co.za/subscribe/business-growth')}`}
                      alt="QR code to subscribe to Business Growth Essentials"
                      width={110}
                      height={110}
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium mb-1">Share this page</p>
                    <p className="text-white/40 text-xs leading-relaxed">
                      Scan with any phone camera to open this subscription page. Perfect for business cards, flyers, and in-person sign-ups.
                    </p>
                    <p className="text-accent text-xs mt-2 font-mono">thebreed.co.za/subscribe/business-growth</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign-up Form */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <CreditCard className="text-accent" size={20} />
                </div>
                <h2 className="text-xl font-heading font-bold text-white">Start Your Subscription</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs font-medium mb-1.5">First Name *</label>
                    <input
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 placeholder:text-white/25"
                      placeholder="John"
                      value={form.name_first}
                      onChange={e => setForm(f => ({ ...f, name_first: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-medium mb-1.5">Last Name *</label>
                    <input
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 placeholder:text-white/25"
                      placeholder="Smith"
                      value={form.name_last}
                      onChange={e => setForm(f => ({ ...f, name_last: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Email Address *</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 placeholder:text-white/25"
                    placeholder="you@company.co.za"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-black text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90"
                    style={{ background: '#FF9F00' }}
                  >
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> Redirecting to PayFast...</>
                      : <><CreditCard size={16} /> Subscribe — R950/month <ArrowRight size={14} /></>
                    }
                  </button>
                </div>

                <p className="text-white/35 text-xs text-center leading-relaxed">
                  Secured by PayFast. Your card details are never stored on our servers.
                  You will be redirected to PayFast to complete your subscription.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
