'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface BlogImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export function BlogImage({ src, alt, fill, className, priority }: BlogImageProps) {
  const [error, setError] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    // Reset error state when src changes
    setError(false);
    // Check if the source is a local asset path that might be broken
    setIsLocal(src?.startsWith('/') && !src?.startsWith('http'));
  }, [src]);

  // If there's an error or no source, show the fallback gradient
  if (error || !src) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-accent/20 to-color-bg-deep/50 ${className}`} />
    );
  }

  // If it's a local path that we suspect is broken (causing 400s), 
  // we use a standard img tag to bypass Next.js Image Optimization errors
  // while we wait for the database migration to propagate.
  if (isLocal) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} ${fill ? 'absolute inset-0 w-full h-full object-cover' : ''}`}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      onError={() => {
        console.warn(`BlogImage failed to load: ${src}`);
        setError(true);
      }}
      unoptimized={src.includes('supabase.co')} // Bypass optimization for Supabase to avoid 400s
    />
  );
}
