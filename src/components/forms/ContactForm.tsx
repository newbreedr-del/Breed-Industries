'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

type ContactFormProps = {
  variant?: 'dark' | 'light';
  helperText?: string;
  className?: string;
};

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const styles = {
  dark: {
    label: 'text-white/70 text-sm font-medium',
    input:
      'mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-accent focus:outline-none',
    textarea:
      'mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-accent focus:outline-none',
    button: 'btn btn-primary w-full justify-center gap-2',
    helper: 'text-white/50 text-xs text-center',
    success:
      'rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100',
    error:
      'rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100',
  },
  light: {
    label: 'text-sm font-medium text-charcoal/80',
    input:
      'mt-2 w-full rounded-xl border border-navy/10 bg-white/70 px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40',
    textarea:
      'mt-2 w-full rounded-xl border border-navy/10 bg-white/70 px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40',
    button:
      'flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 text-white transition-colors hover:bg-gold hover:text-navy disabled:opacity-60 disabled:hover:bg-navy disabled:hover:text-white',
    helper: 'text-xs text-charcoal/60',
    success:
      'rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700',
    error:
      'rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700',
  },
};

const initialFormState: FormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export const ContactForm = ({ variant = 'dark', helperText, className }: ContactFormProps) => {
  const style = styles[variant];
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please complete your name, email, and message before submitting.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'We could not send your message. Please try again.');
      }

      setStatus('success');
      setFormData(initialFormState);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'We could not send your message. Please try again.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';

  return (
    <form className={`space-y-5 ${className ?? ''}`} onSubmit={handleSubmit}>
      <div aria-live="polite" className="space-y-3">
        {status === 'success' && (
          <div className={style.success}>
            Thank you for reaching out. We have received your message and will respond within one business day.
          </div>
        )}
        {status === 'error' && errorMessage && (
          <div className={style.error}>{errorMessage}</div>
        )}
      </div>

      <div>
        <label htmlFor="name" className={style.label}>
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Ayanda M."
          className={style.input}
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="email" className={style.label}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.co.za"
            className={style.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className={style.label}>
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+27 10 123 4567"
            className={style.input}
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={style.label}>
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={variant === 'dark' ? 5 : 4}
          placeholder={
            variant === 'dark'
              ? 'Share your compliance requirements, launch date, and target outcomes.'
              : 'Share a bit about your business, timelines, and the outcomes you need.'
          }
          className={style.textarea}
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className={style.button} disabled={isLoading}>
        <Send className="w-4 h-4" />
        {isLoading ? 'Sending...' : 'Submit Enquiry'}
      </button>

      {(helperText || variant === 'dark') && (
        <p className={style.helper}>
          {helperText ?? 'We’ll respond within one business day. After-hours? WhatsApp us using the floating button.'}
        </p>
      )}
    </form>
  );
};
