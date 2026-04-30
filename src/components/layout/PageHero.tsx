'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  align?: 'left' | 'center';
  size?: 'default' | 'large' | 'small';
  backgroundPattern?: 'grid' | 'blueprint' | 'none';
  backgroundImage?: string;
  children?: React.ReactNode;
}

export const PageHero = ({
  title,
  subtitle,
  description,
  breadcrumbs,
  align = 'center',
  size = 'default',
  backgroundPattern = 'grid',
  backgroundImage,
  children
}: PageHeroProps) => {
  // Determine padding based on size
  const paddingClasses = {
    small: 'py-16 md:py-20',
    default: 'py-20 md:py-28',
    large: 'py-22 md:py-30'
  };

  // Determine text alignment
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto'
  };

  // Determine max width for content
  const maxWidthClasses = {
    left: '',
    center: 'max-w-3xl'
  };

  return (
    <section 
      className={`relative ${paddingClasses[size]} overflow-hidden bg-color-bg-deep`}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
      )}

      {/* Background Pattern */}
      {!backgroundImage && backgroundPattern === 'grid' && (
        <div className="absolute inset-0 grid-overlay"></div>
      )}

      {!backgroundImage && backgroundPattern === 'blueprint' && (
        <div className="absolute inset-0 blueprint-bg"></div>
      )}
      
      {/* Accent Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 blur-3xl rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <motion.nav 
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ol className={`flex ${align === 'center' ? 'justify-center' : 'justify-start'} flex-wrap gap-2 text-sm`}>
              <li>
                <Link href="/" className="text-white/60 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center">
                  <ChevronRight size={14} className="text-white/40 mx-1" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-accent">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-white/60 hover:text-accent transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}
        
        {/* Title Content */}
        <div className={`${alignClasses[align]} ${maxWidthClasses[align]}`}>
          {subtitle && (
            <motion.p 
              className="text-accent font-medium text-sm uppercase tracking-wider mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {subtitle}
            </motion.p>
          )}
          
          <motion.h1 
            className={`font-heading font-bold text-white ${
              size === 'large' ? 'text-4xl md:text-6xl' : 'text-3xl md:text-5xl'
            } mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {title}
          </motion.h1>
          
          {description && (
            <motion.p 
              className={`text-white/70 ${size === 'large' ? 'text-lg md:text-xl' : 'text-base md:text-lg'} mb-8`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
          
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
