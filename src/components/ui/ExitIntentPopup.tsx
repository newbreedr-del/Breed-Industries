'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle2, Sprout } from 'lucide-react';
import Link from 'next/link';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const sessionDismissed = sessionStorage.getItem('exitPopupDismissed');
    if (sessionDismissed) {
      setIsDismissed(true);
      return;
    }

    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseY = e.clientY;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (mouseY < 50 && !hasShown && !isDismissed) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    const timer = setTimeout(() => {
      if (!hasShown && !isDismissed && !sessionDismissed) {
        setIsVisible(true);
        setHasShown(true);
      }
    }, 30000);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasShown, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('exitPopupDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0B1118', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Orange top bar */}
        <div style={{ background: '#FF9F00', height: '3px' }} />

        <div className="p-8">
          {/* Close */}
          <button
            onClick={handleDismiss}
            className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Icon + heading */}
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(255,159,0,0.15)' }}
            >
              <CheckCircle2 size={28} style={{ color: '#FF9F00' }} />
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">
              Don&apos;t Leave Empty-Handed!
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Whether you're ready to build now or need funding first — we've got a path for you.
            </p>
          </div>

          {/* Two path cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Ready to build */}
            <Link
              href="/build-package"
              onClick={handleDismiss}
              className="group rounded-xl p-4 transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(255,159,0,0.1)', border: '1px solid rgba(255,159,0,0.25)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={15} style={{ color: '#FF9F00' }} />
                <span style={{ color: '#FF9F00' }} className="text-xs font-bold uppercase tracking-wide">
                  I&apos;m Ready
                </span>
              </div>
              <p className="text-white font-bold text-sm mb-1">Build a Package</p>
              <p className="text-white/50 text-xs leading-relaxed">
                Get a free custom quote and pricing estimate.
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs" style={{ color: '#FF9F00' }}>
                Get Free Quote <ArrowRight size={12} />
              </div>
            </Link>

            {/* Need funding first */}
            <Link
              href="/fresh-start"
              onClick={handleDismiss}
              className="group rounded-xl p-4 transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sprout size={15} style={{ color: '#FF9F00' }} />
                <span style={{ color: '#FF9F00' }} className="text-xs font-bold uppercase tracking-wide">
                  Fresh Start
                </span>
              </div>
              <p className="text-white font-bold text-sm mb-1">Need Funding First?</p>
              <p className="text-white/50 text-xs leading-relaxed">
                We help you access capital before you build.
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs" style={{ color: '#FF9F00' }}>
                Learn More <ArrowRight size={12} />
              </div>
            </Link>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              'Instant pricing estimate',
              'Custom package tailored to you',
              'Expert consultation included',
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-1.5">
                <CheckCircle2 size={12} style={{ color: '#FF9F00', flexShrink: 0, marginTop: 2 }} />
                <span className="text-white/50 text-xs leading-tight">{benefit}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleDismiss}
            className="w-full text-white/30 hover:text-white/60 transition-colors text-xs py-2"
          >
            No thanks, I&apos;ll continue browsing
          </button>

          <p className="text-center text-white/20 text-xs mt-2">
            Trusted by 500+ South African businesses
          </p>
        </div>
      </div>
    </div>
  );
}
