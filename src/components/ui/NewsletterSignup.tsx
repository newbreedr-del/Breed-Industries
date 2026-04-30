'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react';

export function NewsletterSignup({ variant = 'inline' }: { variant?: 'inline' | 'card' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    // Simulate API call - replace with actual newsletter signup endpoint
    try {
      // In production, replace with: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setMessage('Thanks for subscribing! Check your inbox for a welcome email.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const content = {
    headline: 'Get Business Growth Tips',
    subheadline: 'Subscribe for weekly insights on starting and growing your South African business.',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe',
  };

  if (variant === 'card') {
    return (
      <div className="glass-card p-8 max-w-md mx-auto">
        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{content.headline}</h3>
        <p className="text-white/70 mb-6">{content.subheadline}</p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={content.placeholder}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === 'success' ? (
              <>
                <Check className="w-5 h-5" />
                Subscribed!
              </>
            ) : (
              <>
                {content.buttonText}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {status !== 'idle' && status !== 'loading' && (
          <p className={`mt-4 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
        <p className="mt-4 text-xs text-white/50">We respect your privacy. Unsubscribe anytime.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.placeholder}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : status === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <>
                  {content.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      {status !== 'idle' && status !== 'loading' && (
        <p className={`mt-3 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
