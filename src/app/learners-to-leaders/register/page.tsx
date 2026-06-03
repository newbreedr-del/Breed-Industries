'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GraduationCap, Loader2, CheckCircle, ArrowRight, User, Mail, Phone, Briefcase } from 'lucide-react';
import Link from 'next/link';

type RegisterType = 'learner' | 'corporate' | 'government';

export default function LearnersToLeadersRegisterPage() {
  const [type, setType] = useState<RegisterType>('learner');
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', company_name: '',
    position: '', package_interest: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const typeLabels: Record<RegisterType, string> = {
    learner: 'Learner Application',
    corporate: 'Corporate Partner',
    government: 'Government Partner',
  };

  const packageOptions: Record<RegisterType, string[]> = {
    learner: ['Full Programme (6 months)', 'Short Course (4 weeks)', 'Not sure yet'],
    corporate: ['Sponsor a Cohort', 'Staff Development Programme', 'Custom Partnership'],
    government: ['Youth Employment Initiative', 'Skills Development Partnership', 'Community Programme'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          company_name: form.company_name,
          position: form.position,
          package_interest: `[${typeLabels[type]}] ${form.package_interest}`,
          notes: form.notes,
          source_event: 'learners-to-leaders',
          event_date: new Date().toISOString().split('T')[0],
          status: 'New Lead',
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-color-bg-primary flex items-center justify-center py-24 relative">
          <div className="absolute inset-0 grid-overlay" />
          <div className="relative z-10 text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white mb-3">Application Received!</h1>
            <p className="text-white/60 mb-8 leading-relaxed">
              Thank you for your interest in Learners to Leaders. Our team will review your application and be in touch within 48 hours.
            </p>
            <Link href="/learners-to-leaders" className="inline-flex items-center gap-2 text-accent font-medium hover:underline">
              Back to Programme <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-color-bg-primary pt-24 pb-20 relative">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10 max-w-2xl">

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/15 mb-4">
              <GraduationCap className="text-accent" size={28} />
            </div>
            <span className="text-accent text-sm uppercase tracking-widest font-medium mb-2 block">Learners to Leaders</span>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">Apply / Register Interest</h1>
            <p className="text-white/55">
              Fill in your details and we'll reach out to confirm your spot and next steps.
            </p>
          </div>

          <div className="glass-card p-8">
            {/* Type toggle */}
            <div className="flex rounded-lg overflow-hidden border border-white/10 mb-8">
              {(Object.keys(typeLabels) as RegisterType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setType(t); setForm(f => ({ ...f, package_interest: '' })); }}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                    type === t ? 'bg-accent text-black' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {typeLabels[t]}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input required
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 placeholder:text-white/25"
                      placeholder="Jane Smith"
                      value={form.full_name}
                      onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input required type="email"
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 placeholder:text-white/25"
                      placeholder="jane@company.co.za"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 placeholder:text-white/25"
                      placeholder="060 000 0000"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">
                    {type === 'learner' ? 'School / Institution' : 'Organisation Name'}
                  </label>
                  <div className="relative">
                    <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 placeholder:text-white/25"
                      placeholder={type === 'learner' ? 'Ntuzuma High School' : 'Company / Department'}
                      value={form.company_name}
                      onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-1.5">
                  {type === 'learner' ? 'Current Grade / Age' : 'Your Role / Position'}
                </label>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 placeholder:text-white/25"
                  placeholder={type === 'learner' ? 'Grade 11 / 17 years old' : 'HR Manager / CEO'}
                  value={form.position}
                  onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-1.5">Programme Interest *</label>
                <select required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50"
                  value={form.package_interest}
                  onChange={e => setForm(f => ({ ...f, package_interest: e.target.value }))}
                >
                  <option value="" className="bg-gray-900">Select an option...</option>
                  {packageOptions[type].map(opt => (
                    <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/60 text-xs font-medium mb-1.5">Additional Message</label>
                <textarea
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-accent/50 placeholder:text-white/25 resize-none"
                  placeholder="Any questions or context you'd like to share..."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-black text-sm bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                  : <><GraduationCap size={16} /> Submit Application <ArrowRight size={14} /></>
                }
              </button>

              <p className="text-white/30 text-xs text-center">
                We'll respond within 48 hours. Your details are private and never shared.
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
