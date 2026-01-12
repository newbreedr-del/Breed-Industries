'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-navy/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/assets/images/breed-logo.svg" 
            alt="Breed Industries logo" 
            width={40} 
            height={40} 
            className="w-10 h-10"
          />
          <span className="font-heading font-bold text-xl text-white">Breed Industries</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <a href="#hero" className="text-white hover:text-gold transition-colors">
              Home
            </a>
            <a href="#services" className="text-white hover:text-gold transition-colors">
              Services
            </a>
            <a href="#packages" className="text-white hover:text-gold transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-white hover:text-gold transition-colors">
              About Us
            </a>
            <a href="#contact" className="text-white hover:text-gold transition-colors">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/message/4FOGIOMM2A35L1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <span>Get a Quote</span>
            </a>
          </div>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-navy/95 backdrop-blur-md py-4 shadow-lg">
          <nav className="container mx-auto px-4 flex flex-col gap-4">
            <a 
              href="#hero" 
              className="text-white hover:text-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#services" 
              className="text-white hover:text-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </a>
            <a 
              href="#packages" 
              className="text-white hover:text-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#about" 
              className="text-white hover:text-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </a>
            <a 
              href="#contact" 
              className="text-white hover:text-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <a 
              href="https://wa.me/message/4FOGIOMM2A35L1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Get a Quote</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
