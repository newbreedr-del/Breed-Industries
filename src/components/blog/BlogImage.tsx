'use client';

import Image from 'next/image';
import { useState } from 'react';

interface BlogImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export function BlogImage({ src, alt, fill, className, priority }: BlogImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br from-accent/20 to-color-bg-deep/50 ${className}`} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
