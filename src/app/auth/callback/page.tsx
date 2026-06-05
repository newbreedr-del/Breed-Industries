'use client';

/**
 * /auth/callback
 *
 * The Supabase client (detectSessionInUrl: true) automatically exchanges the
 * token_hash / code in the URL as soon as this page loads. We must NOT call
 * verifyOtp or exchangeCodeForSession ourselves — the SDK already did it.
 *
 * Instead we listen via onAuthStateChange for the SIGNED_IN event, then
 * exchange the resulting access_token for our admin_session cookie.
 */

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, AlertCircle } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [message, setMessage] = useState('Completing sign-in…');

  useEffect(() => {
    // Bail out early if Supabase already sent an error in the URL
    const urlError     = searchParams.get('error');
    const urlErrorCode = searchParams.get('error_code');
    const urlErrorDesc = searchParams.get('error_description');

    if (urlError) {
      setStatus('error');
      if (urlErrorCode === 'otp_expired') {
        setMessage('This login link has expired. Links are valid for 1 hour — please request a new one.');
      } else {
        setMessage(urlErrorDesc?.replace(/\+/g, ' ') ?? 'Authentication failed. Please try again.');
      }
      return;
    }

    let done = false;

    // The SDK exchanges the token automatically on page load.
    // We listen for the session it creates instead of exchanging it ourselves.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (done) return;

        if (event === 'SIGNED_IN' && session?.access_token) {
          done = true;
          setMessage('Verifying access…');

          try {
            const res = await fetch('/api/admin/verify-supabase', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ access_token: session.access_token }),
            });

            if (!res.ok) {
              const d = await res.json().catch(() => ({}));
              throw new Error(
                res.status === 403
                  ? 'This email is not authorised for admin access.'
                  : (d.error ?? 'Verification failed. Please try again.')
              );
            }

            router.replace('/admin');
          } catch (err) {
            setStatus('error');
            setMessage(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
          }
        }

        // INITIAL_SESSION fires with null if there is genuinely no session
        // (e.g. direct navigation to /auth/callback without a magic link)
        if (event === 'INITIAL_SESSION' && !session) {
          done = true;
          setStatus('error');
          setMessage('No login session found. Please use the link in your email, or request a new one.');
        }
      }
    );

    // Timeout — if no auth event fires within 10 s, something went wrong
    const timeout = setTimeout(() => {
      if (!done) {
        done = true;
        setStatus('error');
        setMessage('Sign-in timed out. The link may have expired or already been used — please request a new one.');
      }
    }, 10_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1118]">
      <div className="text-center max-w-sm px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-accent/40 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-5">
          {status === 'error'
            ? <AlertCircle className="text-red-400" size={24} />
            : <Lock className="text-accent" size={24} />
          }
        </div>

        {status === 'loading' ? (
          <>
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 text-sm">{message}</p>
          </>
        ) : (
          <>
            <p className="text-white font-medium mb-2">Sign-in failed</p>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">{message}</p>
            <a
              href="/admin/login"
              className="inline-block bg-accent hover:bg-accent/90 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Back to Login →
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0B1118]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
