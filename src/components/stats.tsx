'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatProps {
  number: number;
  label: string;
  suffix?: string;
  prefix?: string;
  delay?: number;
}

const Stat = ({ number, label, suffix = '', prefix = '', delay = 0 }: StatProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000; // Animation duration in ms
      const frameDuration = 1000 / 60; // Duration of one frame at 60fps
      const totalFrames = Math.round(duration / frameDuration);
      const increment = number / totalFrames;
      
      let currentFrame = 0;
      const counter = setInterval(() => {
        currentFrame++;
        const progress = easeOutQuad(currentFrame / totalFrames);
        setCount(Math.floor(progress * number));
        
        if (currentFrame === totalFrames) {
          clearInterval(counter);
          setCount(number);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }
  }, [isInView, number]);
  
  // Easing function for smoother animation
  const easeOutQuad = (x: number): number => {
    return 1 - (1 - x) * (1 - x);
  };
  
  return (
    <motion.div
      ref={ref}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      <span className="text-4xl md:text-5xl font-heading font-bold text-gold block mb-2">
        {prefix}{isInView ? count : 0}{suffix}
      </span>
      <span className="text-white/80 text-lg">{label}</span>
    </motion.div>
  );
};

export const Stats = () => {
  return (
    <section className="py-20 bg-offWhite">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">By the Numbers</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy mt-2 mb-4">
            Proven impact for ambitious founders
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat number={45} label="Businesses Launched" suffix="+" delay={0.1} />
          <Stat number={94} label="Client Satisfaction" suffix="%" delay={0.2} />
          <Stat number={72} label="Avg Turnaround" suffix="hr" delay={0.3} />
          <Stat number={850} label="Revenue Generated" prefix="R" suffix="K" delay={0.4} />
        </div>
      </div>
    </section>
  );
};
