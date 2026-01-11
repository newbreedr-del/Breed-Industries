"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Zap, Rocket, Shield } from 'lucide-react';

export default function Home() {
  const featuredServices = [
    {
      id: 'business-setup',
      title: 'Business Setup',
      description:
        'Complete registration and compliance services to establish your business on solid legal ground.',
      href: '/services#business-setup',
      icon: <Shield className="w-6 h-6 text-accent" />,
      image: '/assets/images/services/business-setup.jpg',
    },
    {
      id: 'branding',
      title: 'Branding & Identity',
      description:
        'Strategic brand development that positions your business for recognition and trust in your market.',
      href: '/services#branding',
      icon: <Rocket className="w-6 h-6 text-accent" />,
      image: '/assets/images/services/branding.jpg',
    },
    {
      id: 'digital',
      title: 'Digital Solutions',
      description:
        'Custom websites, apps, and digital marketing strategies that drive growth and engagement.',
      href: '/services#digital',
      icon: <Zap className="w-6 h-6 text-accent" />,
      image: '/assets/images/services/digital.jpg',
    },
  ];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/hero/lobby.jpg"
            alt="Breed Industries lobby"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-color-bg-deep via-color-bg-deep/80 to-color-bg-deep" />
        </div>
        <div className="absolute inset-0 grid-overlay grid-overlay-animated"></div>
        
        {/* Accent Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 blur-3xl rounded-full"></div>
        </div>
        
        {/* Floating Tech Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="hidden sm:block absolute top-1/4 left-[6%] md:left-[12%] text-accent/20"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Shield size={60} />
          </motion.div>
          
          <motion.div 
            className="hidden sm:block absolute bottom-1/3 right-[6%] md:right-[12%] text-accent/20"
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Rocket size={80} />
          </motion.div>
          
          <motion.div 
            className="hidden sm:block absolute top-1/2 right-[4%] md:right-[10%] text-accent/20"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap size={70} />
          </motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p 
                className="text-accent font-medium text-sm uppercase tracking-wider mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Premium Growth Agency · Durban
              </motion.p>
              
              <motion.h1 
                className="text-4xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="text-gradient-gold">Creative & Innovative</span> Ideas for Your Business
              </motion.h1>
              
              <motion.p 
                className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                From registration to unstoppable branding & tech – we get you seen, trusted, and profitable.
                Work with the team built for ambitious South African entrepreneurs.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link 
                  href="/services"
                  className="btn btn-primary"
                >
                  Explore Services
                  <ChevronRight size={16} className="ml-1" />
                </Link>
                
                <Link 
                  href="/lab"
                  className="btn btn-outline"
                >
                  Build Your Package
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Services Preview */}
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay grid-overlay-half"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Premium Services for <span className="text-accent">Every Stage</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              From business registration to complete digital transformation, we offer end-to-end solutions
              tailored to your growth journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Link key={service.id} href={service.href} className="group">
                <div className="relative overflow-hidden glass-card h-full transition-all duration-300 group-hover:-translate-y-2">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={640}
                    height={480}
                    className="absolute inset-0 h-full w-full object-cover opacity-20 transition-opacity group-hover:opacity-30"
                  />
                  <div className="relative p-8">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-white/70 mb-6">
                      {service.description}
                    </p>
                    <div className="flex items-center text-accent font-medium">
                      <span>Learn more</span>
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/services"
              className="btn btn-outline"
            >
              View All Services
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-card-accent p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                Ready to Build Your Empire?
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Book a strategy call with our team to discuss your business goals and how we can help you achieve them.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/contact"
                  className="btn btn-primary"
                >
                  Book Strategy Call
                </Link>
                <Link 
                  href="/portfolio"
                  className="btn btn-outline"
                >
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
