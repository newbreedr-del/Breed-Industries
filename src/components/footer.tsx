'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-navy pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          {/* Brand and info */}
          <div className="mb-8 md:mb-0">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Image 
                src="/assets/images/breed-logo.svg" 
                alt="Breed Industries logo" 
                width={40} 
                height={40} 
                className="w-10 h-10"
              />
              <span className="font-heading font-bold text-xl text-white">Breed Industries</span>
            </Link>
            
            <p className="text-white/70 max-w-sm mb-6">
              Premium South African business growth agency delivering registration, branding, and custom digital solutions for entrepreneurs.
            </p>
            
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/breedindustries" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-navy transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/breedindustries" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-navy transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/company/breedindustries" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-navy transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://twitter.com/breedindustries" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-navy transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#hero" className="text-white/70 hover:text-gold transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-white/70 hover:text-gold transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#packages" className="text-white/70 hover:text-gold transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-white/70 hover:text-gold transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-white/70 hover:text-gold transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Our Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/services#business-setup" className="text-white/70 hover:text-gold transition-colors">
                    Business Setup
                  </Link>
                </li>
                <li>
                  <Link href="/services#branding" className="text-white/70 hover:text-gold transition-colors">
                    Logo & Branding
                  </Link>
                </li>
                <li>
                  <Link href="/services#digital" className="text-white/70 hover:text-gold transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/services#digital" className="text-white/70 hover:text-gold transition-colors">
                    Custom Portals
                  </Link>
                </li>
                <li>
                  <Link href="/services#digital" className="text-white/70 hover:text-gold transition-colors">
                    Social Media
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="text-white/70">
                  <strong className="text-white">WhatsApp:</strong><br />
                  <a 
                    href="https://wa.me/27685037221" 
                    className="hover:text-gold transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    068 503 7221
                  </a>
                </li>
                <li className="text-white/70">
                  <strong className="text-white">Email:</strong><br />
                  <a 
                    href="mailto:info@thebreed.co.za" 
                    className="hover:text-gold transition-colors"
                  >
                    info@thebreed.co.za
                  </a>
                </li>
                <li className="text-white/70">
                  <strong className="text-white">Address:</strong><br />
                  70 Blenheim Road<br />
                  Farningham Ridge<br />
                  Pinetown, 3610
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 text-sm mb-4 md:mb-0">
              © {currentYear} Breed Industries – Professional Tools for the Modern Entrepreneur
            </p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="text-white/50 text-sm hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/50 text-sm hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
