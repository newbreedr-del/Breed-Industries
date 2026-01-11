'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage of screen
      const xPos = (clientX / innerWidth) - 0.5;
      const yPos = (clientY / innerHeight) - 0.5;
      
      // Apply parallax effect to floating elements
      const floatingIcons = heroRef.current.querySelectorAll('.floating-icon');
      floatingIcons.forEach((icon) => {
        const element = icon as HTMLElement;
        const speed = parseFloat(element.dataset.speed || '0.2');
        
        // Apply transform based on mouse position and speed
        element.style.transform = `translate(${xPos * 30 * speed}px, ${yPos * 30 * speed}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 bg-gradient-to-br from-navy to-navy-dark overflow-hidden"
    >
      {/* Gold particles background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(212,175,55,0.1)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(212,175,55,0.1)_0%,transparent_50%)]"></div>
      
      {/* Floating icons with parallax effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-icon text-gold/20 text-5xl absolute top-1/4 left-1/4" data-speed="0.25">
          <i className="fas fa-rocket"></i>
        </div>
        <div className="floating-icon text-gold/20 text-5xl absolute top-3/4 left-1/3" data-speed="0.35">
          <i className="fas fa-briefcase"></i>
        </div>
        <div className="floating-icon text-gold/20 text-5xl absolute top-1/3 right-1/4" data-speed="0.2">
          <i className="fas fa-chart-line"></i>
        </div>
        <div className="floating-icon text-gold/20 text-5xl absolute top-2/3 right-1/3" data-speed="0.4">
          <i className="fas fa-bullseye"></i>
        </div>
        <div className="floating-icon text-gold/20 text-5xl absolute bottom-1/4 left-1/2" data-speed="0.3">
          <i className="fas fa-bolt"></i>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-gold font-medium text-sm uppercase tracking-wider mb-4">
            Premium Growth Agency · Durban
          </span>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Build Your Empire the <span className="text-gold">Right Way</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From registration to unstoppable branding & tech – we get you seen, trusted, and profitable.
            Work with the Durban team built for ambitious South African entrepreneurs.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a 
              href="https://wa.me/27685037221?text=Hi%20Breed%20Industries!%20I'd%20like%20to%20get%20a%20custom%20quote%20for:" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary w-full sm:w-auto"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              Get Your Custom Quote
            </a>
            
            <a 
              href="/services" 
              className="btn btn-outline-light w-full sm:w-auto"
            >
              Explore Services
              <ChevronRight size={16} className="ml-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Hero bottom curve */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-12 md:h-16"
          fill="#F8F5F0"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,208.18,70.28,282.35,43.93,248,56.44,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};
