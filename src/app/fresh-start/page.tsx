'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sprout, CheckCircle2, ArrowRight, FileText,
  Building2, Users, Globe, Briefcase,
  AlertCircle, Loader2, BadgeCheck, ChevronDown
} from 'lucide-react';

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  }),
};

// ── Funding Source Data ───────────────────────────────────────────────────────
const fundingSources = [
  {
    icon: <Building2 className="w-6 h-6" />,
    name: 'SEDFA',
    fullName: 'Small Enterprise Development and Finance Agency',
    type: 'Government',
    description:
      'Formed in October 2024 through the merger of SEDA, SEFA, and the CBDA. SEDFA offers both non-financial development support and direct financing for SMMEs across all sectors.',
    link: 'https://www.sedfa.org.za',
  },
  {
    icon: <Users className="w-6 h-6" />,
    name: 'NYDA',
    fullName: 'National Youth Development Agency',
    type: 'Government — Youth',
    description:
      'Grants and business development support for entrepreneurs aged 18–35. The NYDA is specifically designed to reduce barriers for young South Africans looking to start or grow a business.',
    link: 'https://www.nyda.gov.za',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    name: 'Private Funding',
    fullName: 'Angel Investors & Impact Funds',
    type: 'Private Sector',
    description:
      'Beyond government programmes, we research relevant private funders and impact investors suited to your industry, stage, and business model — widening your chances of approval.',
    link: null,
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    name: 'Sector Programmes',
    fullName: 'Industry-Specific Grants & Incentives',
    type: 'Targeted',
    description:
      'Depending on your industry — agriculture, technology, construction, retail, creative — there may be targeted grants or incentive schemes we identify during the research phase.',
    link: null,
  },
];

// ── Steps Data ────────────────────────────────────────────────────────────────
const steps = [
  {
    number: '01',
    title: 'Pay R1,000 Commitment Fee',
    description:
      'A once-off fee that covers our research, application writing, and agency engagement on your behalf. It\'s not a deposit — it\'s an investment in the work we do for you.',
    note: 'Credited in full to your Breed Industries package once funding is approved.',
  },
  {
    number: '02',
    title: 'We Research & Apply',
    description:
      'We assess your business type, sector, and circumstances against available funding programmes — then draft and submit your application, and engage directly with the agencies.',
    note: 'SEDFA, NYDA, private funders, and sector-specific programmes.',
  },
  {
    number: '03',
    title: 'Funding Approved — Build Together',
    description:
      'Once your funding comes through, choose the Breed Industries package that fits your goals. Your R1,000 is deducted from the cost, and we start building.',
    note: 'From branding and registration to websites and full digital solutions.',
  },
];

// ── FAQ Data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Is the R1,000 refundable?',
    a: 'The R1,000 commitment fee is not refundable as a standalone payment. However, if your funding is approved and you proceed with a Breed Industries service package, the full R1,000 is credited and deducted from your package cost.',
  },
  {
    q: 'Do you guarantee my funding will be approved?',
    a: 'No — and any service that promises this should be treated with caution. Funding approvals are decided by third-party agencies based on their own eligibility criteria. We do everything possible to submit a strong application, but we cannot guarantee outcomes.',
  },
  {
    q: 'Do you take a percentage of my funding?',
    a: 'Never. Our fee structure is transparent and fixed: R1,000 upfront, credited to your package. We do not take commissions, percentages, or any portion of your approved funding.',
  },
  {
    q: 'What if I don\'t qualify for any funding?',
    a: 'If we determine early in the process that you\'re unlikely to qualify for any of the programmes we work with, we\'ll let you know honestly before proceeding further. We\'d rather guide you toward a better path than waste your time and money.',
  },
  {
    q: 'How long does the process take?',
    a: 'The timeline varies by funding body — government programmes typically take 4–12 weeks to process. We\'ll give you realistic expectations based on the specific programmes we\'re pursuing for you.',
  },
  {
    q: 'Can I apply if I haven\'t registered my business yet?',
    a: 'Yes. Some funding programmes are available to unregistered sole traders or individuals with a strong business concept. We\'ll assess your situation and advise accordingly. Breed Industries also offers business registration services if that becomes a requirement.',
  },
];

// ── Application Form ──────────────────────────────────────────────────────────
type FormState = 'idle' | 'submitting' | 'success' | 'error';

function ApplicationForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    sector: '',
    ageGroup: '',
    businessIdea: '',
    agreedToTerms: false,
  });
  const [status, setStatus] = useState<FormState>('idle');
  const [refNumber, setRefNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreedToTerms) return;

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/fresh-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed.');
      }

      setRefNumber(data.refNumber || '');
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(255,159,0,0.15)' }}
        >
          <BadgeCheck style={{ color: '#FF9F00' }} size={34} />
        </div>
        <h3 className="text-white text-2xl font-bold mb-3">Application Received</h3>
        <p className="text-white/60 mb-4 max-w-sm mx-auto text-sm leading-relaxed">
          We've sent your Fresh Start Welcome Pack to your email — check your inbox (and spam, just in case). Our team will be in touch within 1–2 business days.
        </p>
        {refNumber && (
          <div
            className="inline-block px-6 py-3 rounded-lg mb-6"
            style={{ background: 'rgba(255,159,0,0.1)', border: '1px solid rgba(255,159,0,0.3)' }}
          >
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Your Reference</p>
            <p style={{ color: '#FF9F00' }} className="font-bold font-mono text-lg">{refNumber}</p>
          </div>
        )}
        <a
          href={`https://wa.me/27685037221?text=Hi, I just submitted a Fresh Start application. My reference is ${refNumber}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          Questions? Chat on WhatsApp →
        </a>
      </motion.div>
    );
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg text-sm outline-none transition-all';
  const inputStyle: React.CSSProperties = {
    background: '#131b27',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#ffffff',
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    cursor: 'pointer',
  };

  return (
    <>
    <style>{`
      .fs-select option { background: #131b27; color: #ffffff; }
    `}</style>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wide">Full Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className={inputClass}
            style={{ ...inputStyle, '--tw-ring-color': '#FF9F00' } as React.CSSProperties}
          />
        </div>
        <div>
          <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wide">Email Address *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wide">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+27 ..."
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wide">Business / Idea Name</label>
          <input
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            placeholder="If you have one already"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wide">Business Sector</label>
          <select
            name="sector"
            value={form.sector}
            onChange={handleChange}
            className={`${inputClass} fs-select`}
            style={selectStyle}
          >
            <option value="">Select a sector...</option>
            <option>Technology & Digital</option>
            <option>Retail & E-commerce</option>
            <option>Construction & Property</option>
            <option>Agriculture & Food</option>
            <option>Creative & Media</option>
            <option>Education & Training</option>
            <option>Health & Wellness</option>
            <option>Finance & Professional Services</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wide">Age Group</label>
          <select
            name="ageGroup"
            value={form.ageGroup}
            onChange={handleChange}
            className={`${inputClass} fs-select`}
            style={selectStyle}
          >
            <option value="">Select...</option>
            <option>18–25</option>
            <option>26–35</option>
            <option>36–45</option>
            <option>46+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wide">
          Tell us about your business idea
        </label>
        <textarea
          name="businessIdea"
          value={form.businessIdea}
          onChange={handleChange}
          rows={4}
          placeholder="What does your business do? What problem does it solve? The more detail you give, the better we can match you to the right funding."
          className={inputClass}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Commitment fee notice */}
      <div
        className="rounded-lg p-4"
        style={{ background: 'rgba(255,159,0,0.08)', border: '1px solid rgba(255,159,0,0.2)' }}
      >
        <p style={{ color: '#FF9F00' }} className="font-bold text-sm mb-1">
          R1,000 Commitment Fee
        </p>
        <p className="text-white/60 text-xs leading-relaxed">
          After submitting this form, our team will contact you with payment instructions. Work begins once payment is confirmed. The R1,000 is credited in full to your Breed Industries package upon funding approval.
        </p>
      </div>

      {/* Terms agreement */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          name="agreedToTerms"
          checked={form.agreedToTerms}
          onChange={handleChange}
          className="mt-0.5 flex-shrink-0 w-4 h-4 accent-orange-400 cursor-pointer"
          required
        />
        <span className="text-white/60 text-xs leading-relaxed group-hover:text-white/80 transition-colors">
          I have read and agree to the{' '}
          <Link
            href="/terms-of-service"
            target="_blank"
            style={{ color: '#FF9F00' }}
            className="underline underline-offset-2"
          >
            Terms of Service
          </Link>{' '}
          and understand that the R1,000 commitment fee is non-refundable but credited to my package upon funding approval. I confirm the information I provide is accurate and truthful.
        </span>
      </label>

      {status === 'error' && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
        >
          <AlertCircle size={16} className="flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting' || !form.agreedToTerms}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: '#FF9F00', color: '#0B1118' }}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Submitting Application...
          </>
        ) : (
          <>
            Submit My Fresh Start Application
            <ArrowRight size={17} strokeWidth={2.5} />
          </>
        )}
      </button>
    </form>
    </>
  );
}

// ── FAQ Accordion Item ────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-lg overflow-hidden transition-all"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <span className="text-white text-sm font-medium">{q}</span>
        <ChevronDown
          size={18}
          className="flex-shrink-0 transition-transform text-white/40"
          style={{ transform: open ? 'rotate(180deg)' : undefined, color: open ? '#FF9F00' : undefined }}
        />
      </button>
      {open && (
        <div
          className="px-5 py-4 text-white/60 text-sm leading-relaxed"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FreshStartPage() {
  return (
    <>
      <Header />

      <main style={{ background: '#0B1118', minHeight: '100vh' }}>

        {/* ── Hero ─────────────────────────────────────────────────────────────── */}
        <section className="relative pt-36 pb-24 overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(255,159,0,0.08) 0%, transparent 70%)' }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {/* Badge */}
              <motion.div variants={fadeUp} className="flex justify-center mb-6">
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{
                    background: 'rgba(255,159,0,0.12)',
                    border: '1px solid rgba(255,159,0,0.3)',
                    color: '#FF9F00',
                  }}
                >
                  <Sprout size={13} strokeWidth={2.5} />
                  Fresh Start by Breed Industries
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
              >
                You have the vision.
                <br />
                <span style={{ color: '#FF9F00' }}>We'll help you find the capital.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto"
              >
                Fresh Start is for entrepreneurs who aren't ready for a full Breed Industries package yet — not because they lack ambition, but because they lack access. We help you unlock government and private funding first, then build together.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <a
                  href="#apply"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ background: '#FF9F00', color: '#0B1118' }}
                >
                  Apply Now — R1,000 to Start
                  <ArrowRight size={17} strokeWidth={2.5} />
                </a>
                <a
                  href="#how-it-works"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  See how it works ↓
                </a>
              </motion.div>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {[
                { value: 'R1,000', label: 'Commitment Fee' },
                { value: '4+', label: 'Funding Sources' },
                { value: '0%', label: 'Commission Taken' },
                { value: '1–2 days', label: 'Response Time' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p style={{ color: '#FF9F00' }} className="text-xl font-extrabold">{stat.value}</p>
                  <p className="text-white/50 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* ── How It Works ─────────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.p variants={fadeUp} style={{ color: '#FF9F00' }} className="text-xs uppercase tracking-[4px] font-bold mb-3">
                The Process
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-white text-3xl md:text-4xl font-extrabold">
                Three steps from here to funded
              </motion.h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  className="flex gap-6 p-6 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-lg"
                    style={{ background: '#FF9F00', color: '#0B1118' }}
                  >
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-3">{step.description}</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} style={{ color: '#FF9F00', flexShrink: 0 }} />
                      <p style={{ color: '#FF9F00' }} className="text-xs">{step.note}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* ── Funding Sources ───────────────────────────────────────────────────── */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.p variants={fadeUp} style={{ color: '#FF9F00' }} className="text-xs uppercase tracking-[4px] font-bold mb-3">
                Funding Sources
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-white text-3xl md:text-4xl font-extrabold mb-4">
                We know where to look
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/50 text-sm max-w-xl mx-auto">
                We research and engage with multiple funding bodies — not just one. Every client's situation is different, and we match you to the programmes you're most likely to qualify for.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {fundingSources.map((source, i) => (
                <motion.div
                  key={source.name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  className="p-6 rounded-2xl relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* Top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: '#FF9F00' }}
                  />
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(255,159,0,0.12)', color: '#FF9F00' }}
                    >
                      {source.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-white font-bold text-base">{source.name}</h3>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(255,159,0,0.1)',
                            color: '#FF9F00',
                            border: '1px solid rgba(255,159,0,0.2)',
                          }}
                        >
                          {source.type}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs mb-3 italic">{source.fullName}</p>
                      <p className="text-white/60 text-sm leading-relaxed">{source.description}</p>
                      {source.link && (
                        <a
                          href={source.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-3 text-xs transition-colors"
                          style={{ color: '#FF9F00' }}
                        >
                          Visit {source.name} <ArrowRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* ── Legal Terms Strip ─────────────────────────────────────────────────── */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div
              className="max-w-4xl mx-auto rounded-2xl p-8"
              style={{ background: 'rgba(255,159,0,0.06)', border: '1px solid rgba(255,159,0,0.2)' }}
            >
              <div className="flex items-start gap-4">
                <FileText style={{ color: '#FF9F00', flexShrink: 0 }} size={22} className="mt-1" />
                <div>
                  <h3 className="text-white font-bold text-base mb-3">Key Terms — Plain Language</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
                    {[
                      'The R1,000 commitment fee is non-refundable as a standalone payment, but credited in full to your Breed Industries package on approval.',
                      'We do not guarantee funding approval — decisions rest with third-party agencies.',
                      'We never take a percentage of your approved funding. Fixed fee only.',
                      'You are responsible for providing accurate information for your application.',
                      'Your data is handled confidentially and used only for application purposes.',
                      'Governed by South African law including the Consumer Protection Act 68 of 2008.',
                    ].map((term) => (
                      <div key={term} className="flex items-start gap-2">
                        <CheckCircle2
                          size={14}
                          style={{ color: '#FF9F00', flexShrink: 0 }}
                          className="mt-0.5"
                        />
                        <p className="text-white/60 text-xs leading-relaxed">{term}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/40 text-xs mt-5">
                    A full service agreement will be provided before work commences.{' '}
                    <Link href="/terms-of-service" style={{ color: '#FF9F00' }} className="underline">
                      View full Terms of Service →
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.p variants={fadeUp} style={{ color: '#FF9F00' }} className="text-xs uppercase tracking-[4px] font-bold mb-3">
                Questions
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-white text-3xl font-extrabold">
                Frequently Asked
              </motion.h2>
            </motion.div>
            <div className="max-w-2xl mx-auto space-y-3">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* ── Application Form ──────────────────────────────────────────────────── */}
        <section id="apply" className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <motion.div
                className="text-center mb-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                <motion.p variants={fadeUp} style={{ color: '#FF9F00' }} className="text-xs uppercase tracking-[4px] font-bold mb-3">
                  Apply
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-white text-3xl font-extrabold mb-4">
                  Start Your Fresh Start Application
                </motion.h2>
                <motion.p variants={fadeUp} className="text-white/50 text-sm">
                  Fill in the form below. Once submitted, we'll send your Welcome Pack via email and be in touch within 1–2 business days.
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl p-8"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <ApplicationForm />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/40 text-sm mb-2">Already funded? Ready to build?</p>
            <Link
              href="/build-package"
              className="inline-flex items-center gap-2 text-white hover:text-orange-400 transition-colors font-semibold"
            >
              Explore our service packages <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
