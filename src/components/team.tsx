'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Phone } from 'lucide-react';

// Team member data - in a real implementation, this would come from a CMS or API
const teamData = [
  {
    id: 'gabrielle',
    name: 'Gabrielle Winn',
    position: 'CEO',
    image: '/assets/images/team/gabrielle.jpg',
    bio: 'Gabrielle leads our strategic vision with over 10 years of experience in business development and branding. She specializes in helping entrepreneurs transform their ideas into market-ready businesses.',
    linkedin: 'https://www.linkedin.com/',
    email: 'gabrielle@thebreed.co.za'
  },
  {
    id: 'mario',
    name: 'Mario Palmer',
    position: 'Managing Partner',
    image: '/assets/images/team/mario.jpg',
    bio: 'Mario oversees our client relationships and project delivery. With a background in finance and technology, he ensures our solutions are both innovative and commercially viable.',
    linkedin: 'https://www.linkedin.com/',
    email: 'mario@thebreed.co.za'
  },
  {
    id: 'kelly',
    name: 'Kelly Williams',
    position: 'Marketing Strategist',
    image: '/assets/images/team/kelly.jpg',
    bio: 'Kelly crafts our marketing strategies and leads our digital campaigns. Her expertise in social media and content marketing helps our clients build meaningful connections with their audience.',
    linkedin: 'https://www.linkedin.com/',
    email: 'kelly@thebreed.co.za'
  },
  {
    id: 'james',
    name: 'James Thompson',
    position: 'Lead Developer',
    image: '/assets/images/team/placeholder.jpg',
    bio: 'James leads our development team with expertise in web and mobile applications. He specializes in creating scalable, user-friendly digital experiences that drive business growth.',
    linkedin: 'https://www.linkedin.com/',
    email: 'james@thebreed.co.za'
  },
  {
    id: 'sophia',
    name: 'Sophia Chen',
    position: 'Design Director',
    image: '/assets/images/team/placeholder.jpg',
    bio: 'Sophia oversees our creative direction and design processes. Her background in visual communication and brand identity helps our clients establish distinctive and memorable brands.',
    linkedin: 'https://www.linkedin.com/',
    email: 'sophia@thebreed.co.za'
  },
  {
    id: 'michael',
    name: 'Michael Ndlovu',
    position: 'Business Development',
    image: '/assets/images/team/placeholder.jpg',
    bio: 'Michael focuses on growing our client base and identifying new market opportunities. His deep understanding of the South African business landscape is invaluable to our expansion strategy.',
    linkedin: 'https://www.linkedin.com/',
    email: 'michael@thebreed.co.za'
  }
];

export const Team = () => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  
  const handleMemberClick = (memberId: string) => {
    setSelectedMember(selectedMember === memberId ? null : memberId);
  };
  
  return (
    <section className="py-20 bg-navy relative overflow-hidden" id="team">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,var(--color-gold)_0%,transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,var(--color-gold)_0%,transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">Our People</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-2 mb-4">
            Leadership Team
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            Meet the experts behind Breed Industries who are dedicated to helping South African entrepreneurs build successful businesses.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamData.map((member) => (
            <motion.div
              key={member.id}
              className={`bg-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${
                selectedMember === member.id ? 'ring-2 ring-gold' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              onClick={() => handleMemberClick(member.id)}
            >
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  width={400} 
                  height={400} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="text-xl font-heading font-bold text-white">{member.name}</h3>
                  <p className="text-gold">{member.position}</p>
                </div>
              </div>
              
              <motion.div 
                className="p-6"
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: selectedMember === member.id ? 'auto' : 0,
                  opacity: selectedMember === member.id ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {selectedMember === member.id && (
                  <>
                    <p className="text-white/80 mb-4">{member.bio}</p>
                    <div className="flex gap-4">
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-navy transition-colors"
                        aria-label={`${member.name}'s LinkedIn`}
                      >
                        <Linkedin size={16} />
                      </a>
                      <a 
                        href={`mailto:${member.email}`}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-navy transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail size={16} />
                      </a>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href="/about#team" 
            className="inline-flex items-center text-gold hover:text-white transition-colors"
          >
            Learn more about our team
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
