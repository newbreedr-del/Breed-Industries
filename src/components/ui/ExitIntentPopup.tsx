'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Users, Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const pathname = usePathname();

  const isExcludedPage = pathname?.startsWith('/admin') || pathname?.startsWith('/invite') || pathname?.toLowerCase().includes('fpb-event');

  useEffect(() => {
    if (isExcludedPage) return;

    const sessionDismissed = sessionStorage.getItem('exitPopupDismissed');
    if (sessionDismissed) {
      setIsDismissed(true);
      return;
    }

    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => { mouseY = e.clientY; };

    const handleMouseLeave = () => {
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
  }, [hasShown, isDismissed, isExcludedPage]);

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

          {/* Heading */}
          <div className="mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(255,159,0,0.15)' }}
            >
              <Users size={24} style={{ color: '#FF9F00' }} />
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">
              The Breed Business Network is open.
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Join 250+ South African business owners getting the tools, training, and community they need to grow. Not someday — now.
            </p>
          </div>

          {/* Two CTAs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link
              href="/network"
              onClick={handleDismiss}
              className="group rounded-xl p-4 transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(255,159,0,0.1)', border: '1px solid rgba(255,159,0,0.3)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} style={{ color: '#FF9F00' }} />
                <span style={{ color: '#FF9F00' }} className="text-xs font-bold uppercase tracking-wide">
                  The Network
                </span>
              </div>
              <p className="text-white font-bold text-sm mb-1">Join the Network</p>
              <p className="text-white/50 text-xs leading-relaxed">
                From R950/month. No lock-in. Cancel anytime.
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs" style={{ color: '#FF9F00' }}>
                See membership tiers <ArrowRight size={12} />
              </div>
            </Link>

            <a
              href="https://wa.me/27604964105?text=Hi%2C%20I%20want%20to%20book%20a%20free%20strategy%20call"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDismiss}
              className="group rounded-xl p-4 transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Phone size={14} style={{ color: '#FF9F00' }} />
                <span style={{ color: '#FF9F00' }} className="text-xs font-bold uppercase tracking-wide">
                  Talk First
                </span>
              </div>
              <p className="text-white font-bold text-sm mb-1">Free Strategy Call</p>
              <p className="text-white/50 text-xs leading-relaxed">
                30 minutes. No pressure. We identify your biggest gap.
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs" style={{ color: '#FF9F00' }}>
                WhatsApp us <ArrowRight size={12} />
              </div>
            </a>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              'Education & training events',
              'Isivuno community fund',
              'Compliance & web infrastructure',
            ].map((item) => (
              <div key={item} className="flex items-start gap-1.5">
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#FF9F00' }} />
                <span className="text-white/40 text-xs leading-tight">{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleDismiss}
            className="w-full text-white/25 hover:text-white/50 transition-colors text-xs py-2"
          >
            No thanks, I&apos;ll continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
