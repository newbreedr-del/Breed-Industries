'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, 
  Facebook, Instagram, Linkedin, 
  Twitter, ChevronRight 
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-color-bg-secondary relative pt-20 pb-8">
      <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image 
                src="/assets/images/logos/breed-logo-just.png" 
                alt="Breed Industries" 
                width={56} 
                height={56} 
                className="w-14 h-14"
              />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl text-white">BREED</span>
                <span className="text-xs text-accent -mt-1">INDUSTRIES</span>
              </div>
            </Link>
            
            <p className="text-white/70 mb-6">
              Premium South African business agency providing registration, branding, and digital solutions for ambitious entrepreneurs.
            </p>
            
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-color-bg-deep transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-color-bg-deep transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-color-bg-deep transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent hover:text-color-bg-deep transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-white font-heading font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link href="/lab" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>The Lab</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>Portfolio</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>About</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="md:col-span-3">
            <h3 className="text-white font-heading font-bold text-lg mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services#business-setup" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>Business Setup</span>
                </Link>
              </li>
              <li>
                <Link href="/services#branding" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>Branding & Identity</span>
                </Link>
              </li>
              <li>
                <Link href="/services#digital" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>Digital Solutions</span>
                </Link>
              </li>
              <li>
                <Link href="/services#launch-starter" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>Launch Starter</span>
                </Link>
              </li>
              <li>
                <Link href="/services#growth-professional" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>Growth Professional</span>
                </Link>
              </li>
              <li>
                <Link href="/services#empire-premium" className="text-white/70 hover:text-accent transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  <span>Empire Premium</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="md:col-span-3">
            <h3 className="text-white font-heading font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-accent mr-3 mt-1" />
                <div>
                  <p className="text-white font-medium">Call Us</p>
                  <a href="tel:+27604964105" className="text-white/70 hover:text-accent transition-colors">
                    +27 60 496 4105
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-accent mr-3 mt-1" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <a href="mailto:info@thebreed.co.za" className="text-white/70 hover:text-accent transition-colors">
                    info@thebreed.co.za
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-accent mr-3 mt-1" />
                <div>
                  <p className="text-white font-medium">Office</p>
                  <p className="text-white/70">
                    Durban & Johannesburg
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Breed Industries. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-white/50 text-sm hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-white/50 text-sm hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
