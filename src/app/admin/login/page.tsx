'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        // Set the admin session cookie and redirect
        document.cookie = `admin_session=${data.session}; path=/; max-age=86400; secure; samesite=strict`;
        router.push('/admin');
      } else {
        setErrMsg(data.error ?? 'Invalid credentials. Please try again.');
      }
    } catch {
      setErrMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <PageHero
        title="Admin Login"
        subtitle="Authentication Required"
        description="Access the Breed Industries admin dashboard."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Login', href: '/admin/login' },
        ]}
        size="default"
      />

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="glass-card p-8">

              {/* Icon */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-accent" size={24} />
                </div>
                <h2 className="text-2xl font-heading font-bold text-white mb-2">
                  Admin Access
                </h2>
                <p className="text-white/60 text-sm">
                  Enter your credentials to access the dashboard.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={submit} className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-white/70 text-sm font-medium mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      autoFocus
                      className="w-full pl-9 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-accent/50 focus:outline-none transition-colors text-sm"
                      placeholder="Enter username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-white/70 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-accent/50 focus:outline-none transition-colors text-sm"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {errMsg && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{errMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
        <div className="text-white">Loading…</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
