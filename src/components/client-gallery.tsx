'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';

const CLIENT_LOGO_EBODWENI = '/assets/images/Client portfolio/Ebodweni-01.jpg';
const CLIENT_LOGO_IGROUP = '/assets/images/Client portfolio/I Group Logo White-01-01.png';
const CLIENT_LOGO_GOBIZZ = '/assets/images/Client portfolio/gobizz-logo White-01.png';
const CLIENT_LOGO_MCWAYS = '/assets/images/Client portfolio/MC Ways New-03.png';
const CLIENT_LOGO_NSPIRAXION = '/assets/images/Client portfolio/NSPIRAXION IMPULSE PROJECTS LOGO [Recovered]-01.png';
const CLIENT_LOGO_GENERIC = '/assets/images/Client portfolio/Logo-01.png';

const PORTFOLIO_CASE_GRID = '/assets/images/portfolio/case-study-grid.jpg';
const PORTFOLIO_CLIENT_SHOWCASE = '/assets/images/portfolio/client-showcase.jpg';
const PORTFOLIO_BRANDING = '/assets/images/portfolio/branding-suite.jpg';
const PORTFOLIO_DIGITAL = '/assets/images/portfolio/digital-experience.jpg';
const PORTFOLIO_ENTERPRISE = '/assets/images/portfolio/enterprise-success.jpg';

// Sample client data - in a real implementation, this would come from a CMS or API
const clientsData = [
  {
    id: 'cvs',
    name: 'Ebodweni Logistics',
    logo: CLIENT_LOGO_EBODWENI,
    industry: 'Logistics & Transport',
    description: 'Fleet branding, compliance registrations, and digital profile to secure municipal contracts.',
    featured: true
  },
  {
    id: 'berkshire',
    name: 'iGroup Tech',
    logo: CLIENT_LOGO_IGROUP,
    industry: 'Technology',
    description: 'Product launch campaign, investor deck, and website for a Durban SaaS collective.',
    featured: true
  },
  {
    id: 'att',
    name: 'GoBizz Africa',
    logo: CLIENT_LOGO_GOBIZZ,
    industry: 'Business Services',
    description: 'Brand identity, portal, and B2B marketing assets for an SME service marketplace.',
    featured: true
  },
  {
    id: 'wordpress',
    name: 'MC Ways Projects',
    logo: CLIENT_LOGO_MCWAYS,
    industry: 'Construction',
    description: 'CIDB compliance set-up, project portfolio, and corporate profile for tenders.',
    featured: true
  },
  {
    id: 'client5',
    name: 'Nspiraxion Impulse',
    logo: CLIENT_LOGO_NSPIRAXION,
    industry: 'Energy',
    description: 'Brand refresh, investor documentation, and safety compliance kit.',
    featured: false
  },
  {
    id: 'client6',
    name: 'iGroup Tech (Events)',
    logo: CLIENT_LOGO_IGROUP,
    industry: 'Technology',
    description: 'Live event branding, motion graphics, and social media rollout.',
    featured: false
  },
  {
    id: 'client7',
    name: 'Ebodweni Logistics (Fleet)',
    logo: CLIENT_LOGO_EBODWENI,
    industry: 'Logistics',
    description: 'Vehicle wraps, safety documentation, and corporate signage.',
    featured: false
  },
  {
    id: 'client8',
    name: 'Generic Portfolio Client',
    logo: CLIENT_LOGO_GENERIC,
    industry: 'Professional Services',
    description: 'Brand kit, stationery suite, and responsive brochure website.',
    featured: false
  }
];

// Sample portfolio projects
const portfolioProjects = [
  {
    id: 'project1',
    title: 'Financial Services Portal',
    category: 'Web Development',
    image: PORTFOLIO_ENTERPRISE,
    description: 'Custom financial portal with client dashboard, reporting tools, and secure document management.'
  },
  {
    id: 'project2',
    title: 'Healthcare Brand Identity',
    category: 'Branding',
    image: PORTFOLIO_BRANDING,
    description: 'Complete brand identity system including logo, color palette, typography, and brand guidelines.'
  },
  {
    id: 'project3',
    title: 'E-commerce Platform',
    category: 'Web Development',
    image: PORTFOLIO_CLIENT_SHOWCASE,
    description: 'Fully responsive e-commerce platform with product management, payment processing, and inventory tracking.'
  },
  {
    id: 'project4',
    title: 'Corporate Identity Package',
    category: 'Branding',
    image: PORTFOLIO_CASE_GRID,
    description: 'Corporate identity package including logo, business cards, letterhead, and email signatures.'
  },
  {
    id: 'project5',
    title: 'Mobile App Development',
    category: 'App Development',
    image: PORTFOLIO_DIGITAL,
    description: 'Custom mobile application for iOS and Android with user authentication and real-time data synchronization.'
  },
  {
    id: 'project6',
    title: 'Marketing Campaign',
    category: 'Marketing',
    image: PORTFOLIO_ENTERPRISE,
    description: 'Integrated marketing campaign across digital and traditional channels with performance tracking.'
  },
  {
    id: 'stellar',
    title: 'Breed Industries Production',
    category: 'Video & Media',
    image: PORTFOLIO_ENTERPRISE,
    description: 'Brand video ad emphasising our full production capability — from creative direction to final delivery.'
  }
];

// Filter categories for portfolio
const categories = ['All', 'Web Development', 'Branding', 'App Development', 'Marketing', 'Video & Media'];

export const ClientGallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Filter projects based on active category
  const filteredProjects = activeCategory === 'All' 
    ? portfolioProjects 
    : portfolioProjects.filter(project => project.category === activeCategory);
  
  // Navigation for client carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === Math.ceil(clientsData.length / 4) - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? Math.ceil(clientsData.length / 4) - 1 : prev - 1));
  };
  
  return (
    <section className="py-20 bg-offWhite" id="portfolio">
      <div className="container mx-auto px-4">
        {/* Clients Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-gold font-medium text-sm uppercase tracking-wider">Our Clients</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy mt-2 mb-4">
              Connecting with Industry Leaders
            </h2>
            <p className="text-charcoal/80 max-w-3xl mx-auto">
              We've had the privilege of working with forward-thinking businesses across various industries.
            </p>
          </div>
          
          <div className="relative">
            {/* Client Carousel */}
            <div className="overflow-hidden">
              <motion.div 
                className="flex"
                animate={{ x: `-${currentSlide * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {Array.from({ length: Math.ceil(clientsData.length / 4) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full grid grid-cols-2 md:grid-cols-4 gap-6">
                    {clientsData.slice(slideIndex * 4, slideIndex * 4 + 4).map((client) => (
                      <motion.div
                        key={client.id}
                        className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center"
                        whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
                      >
                        <div className="w-32 h-20 relative mb-4 flex items-center justify-center">
                          <Image 
                            src={client.logo} 
                            alt={`${client.name} logo`} 
                            width={120} 
                            height={80} 
                            className="object-contain"
                          />
                        </div>
                        <h3 className="font-medium text-navy mb-1">{client.name}</h3>
                        <p className="text-sm text-charcoal/70">{client.industry}</p>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Navigation Arrows */}
            <button 
              className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-colors"
              onClick={prevSlide}
              aria-label="Previous clients"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-colors"
              onClick={nextSlide}
              aria-label="Next clients"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Portfolio Section */}
        <div>
          <div className="text-center mb-12">
            <span className="text-gold font-medium text-sm uppercase tracking-wider">Our Work</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy mt-2 mb-4">
              Featured Projects
            </h2>
            <p className="text-charcoal/80 max-w-3xl mx-auto">
              Explore our portfolio of successful projects across various industries and services.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category 
                    ? 'bg-navy text-white' 
                    : 'bg-white text-navy hover:bg-navy/10'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-xl overflow-hidden shadow-md group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    width={400} 
                    height={300} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <a 
                      href={`/portfolio/${project.id}`}
                      className="bg-gold text-navy font-medium py-2 px-4 rounded-md flex items-center gap-1"
                    >
                      View Project
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-gold text-sm font-medium">{project.category}</span>
                  <h3 className="text-xl font-heading font-bold text-navy mt-1 mb-2">{project.title}</h3>
                  <p className="text-charcoal/80 text-sm">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="/portfolio" 
              className="btn btn-outline inline-flex items-center gap-2 border-2 border-navy text-navy hover:bg-navy/5"
            >
              View All Projects
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
