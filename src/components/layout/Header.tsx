'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Phone,
  MessageSquare, Search
} from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Network', path: '/network' },
  { name: 'Services', path: '/services' },
  { name: 'Tender Services', path: '/tender-services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 bg-opacity-95' : 'py-4 bg-opacity-80'
      } backdrop-blur-md`}
      style={{ 
        backgroundColor: isScrolled ? 'rgba(11, 17, 24, 0.95)' : 'rgba(11, 17, 24, 0.8)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none'
      }}
    >
      <div className="grid-overlay">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4">
              <Image 
                src="/assets/images/logos/breed-logo-just.png" 
                alt="Breed Industries Mark" 
                width={56} 
                height={56} 
                className="w-14 h-14"
                priority
              />
              <div className="flex flex-col leading-tight">
                <span className="font-heading font-bold text-xl text-white tracking-[0.2em]">BREED</span>
                <span className="text-xs text-accent tracking-[0.35em]">INDUSTRIES</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.name} className="relative">
                    <Link 
                      href={item.path} 
                      className="text-white hover:text-accent active:text-accent focus:text-accent transition-colors py-2"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href="/network"
                className="btn btn-primary"
              >
                <MessageSquare size={16} className="mr-2" />
                Join the Network
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white hover:text-accent transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="lg:hidden fixed inset-0 z-[60] flex h-screen w-screen bg-[#020b16]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="flex h-full w-full flex-col overflow-hidden px-6 py-10 pt-24 text-white"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="self-end text-white/70 hover:text-accent transition-colors mb-6"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>

              {/* Mobile Search Bar */}
              <div className="flex items-center bg-navy-dark/80 rounded-md mb-6">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent text-white py-2 px-4 w-full focus:outline-none"
                />
                <button className="bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-r-md transition-colors">
                  <Search size={18} />
                </button>
              </div>
              
              <nav className="flex flex-col flex-1 overflow-y-auto pr-1">
                {navItems.map((item) => (
                  <div key={item.name} className="border-b border-white/10 py-3">
                    <Link 
                      href={item.path} 
                      className="text-white text-lg font-heading hover:text-accent active:text-accent focus:text-accent block py-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
                
                {/* Mobile Contact */}
                <div className="mt-6 flex flex-col gap-4">
                  <Link
                    href="/network"
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Join the Network
                  </Link>
                  
                  <div className="flex flex-col items-center gap-1">
                    <a 
                      href="tel:+27314590080"
                      className="flex items-center gap-2 text-white/80 hover:text-accent"
                    >
                      <Phone size={16} />
                      <span>+27 31 459 0080</span>
                    </a>
                    <span className="text-white/40 text-xs">or</span>
                    <a 
                      href="tel:+27604964105"
                      className="flex items-center gap-2 text-white/60 hover:text-accent text-sm"
                    >
                      <span>+27 60 496 4105</span>
                    </a>
                  </div>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
