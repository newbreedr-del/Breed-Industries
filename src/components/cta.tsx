'use client';

import { motion } from 'framer-motion';

export const Cta = () => {
  return (
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-4">
        <motion.div 
          className="bg-gradient-to-r from-gold/20 to-navy-light/30 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-12 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Abstract shapes */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gold/20 rounded-full blur-3xl"></div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-heading font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ready to Level Up?
          </motion.h2>
          
          <motion.p 
            className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Let's build the compliant, credible, and captivating brand your business deserves.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a 
              href="https://wa.me/27685037221?text=Hi%20Breed%20Industries!%20I'd%20like%20to%20get%20a%20custom%20quote%20for:" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              Chat on WhatsApp
            </a>
            
            <a 
              href="/contact" 
              className="btn btn-outline-light"
            >
              Contact Us
            </a>
          </motion.div>
          
          <motion.p 
            className="text-sm text-white/50 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Fast responses · Professional service · No obligation quotes
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
