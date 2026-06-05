'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Sprout, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'fresh_start_popup_dismissed';
const SCROLL_THRESHOLD = 0.55;   // trigger at 55% scroll depth
const SCROLL_DELAY_MS  = 2000;   // wait 2s after threshold before showing
const TIME_FALLBACK_MS = 45000;  // or after 45 seconds, whichever comes first

// Pages where the popup should never appear
const EXCLUDED_PATHS = ['/fresh-start', '/build-package', '/contact', '/admin'];

export function FreshStartPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const shouldExclude = EXCLUDED_PATHS.some((p) => pathname?.startsWith(p));

  const trigger = useCallback(() => {
    if (triggered) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch { /* noop */ }
    setTriggered(true);
    setVisible(true);
  }, [triggered]);

  const dismiss = useCallback(() => {
    setVisible(false);
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (shouldExclude) return;

    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch { /* noop */ }

    // Scroll-based trigger - fires after threshold + a short pause
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (triggered) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const ratio = window.scrollY / total;
      if (ratio >= SCROLL_THRESHOLD && !scrollTimer) {
        scrollTimer = setTimeout(trigger, SCROLL_DELAY_MS);
      }
    };

    // Time-based fallback - show after TIME_FALLBACK_MS regardless of scroll
    const timer = setTimeout(trigger, TIME_FALLBACK_MS);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [shouldExclude, trigger, triggered]);

  if (shouldExclude) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 left-6 z-40 w-[300px]"
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-120%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          role="dialog"
          aria-label="Fresh Start programme"
        >
          <div
            style={{ background: '#0B1118', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            className="rounded-xl overflow-hidden border border-white/10"
          >
            {/* Orange top bar */}
            <div style={{ background: '#FF9F00', height: '3px' }} />

            {/* Content */}
            <div className="p-5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    style={{ background: '#FF9F00' }}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <Sprout size={15} color="#0B1118" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p
                      style={{ color: '#FF9F00', fontSize: '10px', letterSpacing: '2px' }}
                      className="uppercase font-bold"
                    >
                      Fresh Start
                    </p>
                    <p className="text-white font-bold text-sm leading-tight">
                      Starting from zero?
                    </p>
                  </div>
                </div>
                <button
                  onClick={dismiss}
                  className="text-white/40 hover:text-white/80 transition-colors mt-0.5 flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-white/60 text-xs leading-relaxed mb-4">
                We help entrepreneurs access government and private funding first, then build your business with us.
              </p>

              <Link
                href="/fresh-start"
                onClick={dismiss}
                style={{ background: '#FF9F00', color: '#0B1118' }}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Learn about Fresh Start
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>

              <p className="text-white/30 text-[10px] text-center mt-3">
                R1,000 commitment fee · No percentage taken
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
