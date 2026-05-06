'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, Phone, 
  MessageSquare, Layers, Briefcase, 
  Users, LayoutGrid, Settings,
  Search
} from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { 
    name: 'Services', 
    path: '/services',
    megaMenu: true,
    children: [
      {
        title: 'Business Setup',
        icon: <Settings className="w-5 h-5" />,
        description: 'Registration, compliance, and documentation',
        link: '/services#business-setup'
      },
      {
        title: 'Branding',
        icon: <Briefcase className="w-5 h-5" />,
        description: 'Logo design, identity systems, and guidelines',
        link: '/services#branding'
      },
      {
        title: 'Digital',
        icon: <Layers className="w-5 h-5" />,
        description: 'Web, mobile, and digital marketing solutions',
        link: '/services#digital'
      }
    ]
  },
  { name: 'Build Package', path: '/build-package' },
  { name: 'Fresh Start', path: '/fresh-start' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const tiers = [
  {
    name: 'Launch Essentials',
    price: 'From R3,950',
    description: 'CIPC registration, basic logo, and business cards',
    link: '/build-package'
  },
  {
    name: 'Growth Momentum',
    price: 'From R9,800',
    description: 'Full branding, 5-page website, and business plan',
    link: '/build-package',
    featured: true
  },
  {
    name: 'Empire Ascend',
    price: 'From R18,500',
    description: 'E-commerce portal, premium branding & social media',
    link: '/build-package'
  }
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setActiveMegaMenu(null);
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

  const toggleMegaMenu = (name: string) => {
    setActiveMegaMenu(activeMegaMenu === name ? null : name);
  };

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
                    {item.megaMenu ? (
                      <button 
                        className="flex items-center gap-1 text-white hover:text-accent transition-colors py-2"
                        onClick={() => toggleMegaMenu(item.name)}
                        onMouseEnter={() => setActiveMegaMenu(item.name)}
                        onMouseLeave={() => setActiveMegaMenu(null)}
                      >
                        {item.name}
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${activeMegaMenu === item.name ? 'rotate-180 text-accent' : ''}`} 
                        />
                      </button>
                    ) : (
                      <Link 
                        href={item.path} 
                        className="text-white hover:text-accent active:text-accent focus:text-accent transition-colors py-2"
                      >
                        {item.name}
                      </Link>
                    )}

                    {/* Mega Menu */}
                    {item.megaMenu && item.children && (
                      <AnimatePresence>
                        {activeMegaMenu === item.name && (
                          <motion.div
                            className="absolute top-full left-0 mt-2 w-[700px] glass-card-strong p-5 rounded-xl"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            onMouseEnter={() => setActiveMegaMenu(item.name)}
                            onMouseLeave={() => setActiveMegaMenu(null)}
                          >
                            <div className="grid grid-cols-[180px_1fr] gap-5">
                              {/* Service Categories */}
                              <div>
                                <h3 className="text-xs uppercase tracking-wider text-accent mb-3">Categories</h3>
                                <div className="space-y-2">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.title}
                                      href={child.link}
                                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                                    >
                                      <div className="mt-0.5 text-accent">{child.icon}</div>
                                      <div>
                                        <h4 className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                                          {child.title}
                                        </h4>
                                        <p className="text-xs text-white/60 leading-tight">{child.description}</p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>

                              {/* Package Tiers */}
                              <div>
                                <h3 className="text-xs uppercase tracking-wider text-accent mb-3">Service Packages</h3>
                                <div className="grid grid-cols-3 gap-3">
                                  {tiers.map((tier) => (
                                    <Link
                                      key={tier.name}
                                      href={tier.link}
                                      className={`p-3 rounded-lg transition-all ${
                                        tier.featured
                                          ? 'glass-card-accent'
                                          : 'hover:bg-white/5'
                                      }`}
                                    >
                                      <h4 className={`text-sm font-medium ${tier.featured ? 'text-accent' : 'text-white'}`}>
                                        {tier.name}
                                      </h4>
                                      <p className="text-base font-heading font-bold mt-1">{tier.price}</p>
                                      <p className="text-xs text-white/60 mt-1 leading-tight">{tier.description}</p>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link 
                href="/contact"
                className="btn btn-primary"
              >
                <MessageSquare size={16} className="mr-2" />
                Book Strategy Call
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
                    {item.megaMenu ? (
                      <div>
                        <button 
                          className="flex items-center justify-between w-full text-white text-lg font-heading"
                          onClick={() => toggleMegaMenu(item.name)}
                        >
                          {item.name}
                          <ChevronDown 
                            size={20} 
                            className={`transition-transform ${activeMegaMenu === item.name ? 'rotate-180 text-accent' : ''}`} 
                          />
                        </button>
                        
                        {activeMegaMenu === item.name && item.children && (
                          <div className="mt-3 bg-navy-dark/90 border-l-2 border-accent">
                            <div className="py-1">
                              {item.children.map((child) => (
                              <Link 
                                key={child.title} 
                                href={child.link}
                                className="flex items-center gap-3 text-white hover:text-accent py-3 px-4 border-b border-white/10"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="text-accent">{child.icon}</div>
                                <span>{child.title}</span>
                              </Link>
                            ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link 
                        href={item.path} 
                        className="text-white text-lg font-heading hover:text-accent active:text-accent focus:text-accent block py-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile Service Tiers */}
                <div className="mt-6 pt-2">
                  <h3 className="text-sm uppercase tracking-wider text-accent mb-4">Service Packages</h3>
                  <div className="space-y-4">
                    {tiers.map((tier) => (
                      <Link 
                        key={tier.name} 
                        href={tier.link}
                        className={`block p-4 rounded-lg ${
                          tier.featured ? 'glass-card-accent' : 'glass-card-light'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <h4 className={`font-medium ${tier.featured ? 'text-accent' : 'text-white'}`}>
                          {tier.name}
                        </h4>
                        <p className="text-lg font-heading font-bold mt-1">{tier.price}</p>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Mobile Contact */}
                <div className="mt-6 flex flex-col gap-4">
                  <Link 
                    href="/contact"
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Book Strategy Call
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
