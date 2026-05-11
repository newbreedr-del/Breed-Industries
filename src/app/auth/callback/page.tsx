'use client';

/**
 * /auth/callback
 *
 * Landing page for Supabase magic links. The link in the email
 * includes an access_token in the URL hash fragment. The Supabase
 * SDK processes this automatically and makes the session available
 * via getSession(). We then call /api/admin/verify-supabase to
 * exchange it for the admin_session cookie and redirect to /admin.
 */

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import { supabase }            from '@/lib/supabase';
import { Lock }                from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [message, setMessage] = useState('Completing sign-in…');

  useEffect(() => {
    let cancelled = false;

    const complete = async () => {
      try {
        // Give the Supabase SDK a moment to parse the hash fragment
        await new Promise(r => setTimeout(r, 300));

        const { data: { session }, error: sessionErr } = await supabase.auth.getSession();

        if (sessionErr || !session?.access_token) {
          throw new Error('Could not read session from magic link.');
        }

        // Exchange the Supabase session for an admin_session cookie
        const res = await fetch('/api/admin/verify-supabase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: session.access_token }),
        });

        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error ?? 'Not authorised.');
        }

        if (!cancelled) {
          router.replace('/admin');
        }
      } catch (err) {
        if (!cancelled) {
          setMessage(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
          setStatus('error');
        }
      }
    };

    complete();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1118]">
      <div className="text-center max-w-sm px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-accent/40 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <Lock className="text-accent" size={24} />
        </div>

        {status === 'loading' ? (
          <>
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">{message}</p>
          </>
        ) : (
          <>
            <p className="text-red-400 text-sm mb-4">{message}</p>
            <a href="/admin/login" className="btn btn-primary text-sm px-5 py-2">
              Back to Login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
