'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already seen popup this session
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
      // If mouse is leaving towards the top (address bar) and hasn't shown yet
      if (mouseY < 50 && !hasShown && !isDismissed) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    // Also show after 30 seconds if they haven't interacted much
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-color-bg-deep to-color-bg-secondary border border-white/10 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Don&apos;t Leave Empty-Handed!
          </h3>
          <p className="text-white/70">
            Get a free custom quote for your business needs. No commitment required.
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6">
          {[
            'Instant pricing estimate',
            'Custom package tailored to your needs',
            'Expert consultation included',
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-white/80">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 text-accent" />
              </div>
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/build-package"
            onClick={handleDismiss}
            className="flex-1 btn btn-primary flex items-center justify-center gap-2"
          >
            Get Free Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDismiss}
            className="flex-1 btn btn-outline"
          >
            Maybe Later
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-4">
          Trusted by 500+ South African businesses
        </p>
      </div>
    </div>
  );
}
