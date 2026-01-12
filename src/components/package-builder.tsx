'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, DollarSign, Check, ShoppingCart, Package, Trash2 } from 'lucide-react';

// Service categories and items
const serviceCategories = [
  {
    id: 'setup',
    name: 'Business Setup',
    items: [
      { id: 'registration-basic', name: 'Basic Registration', price: 550, description: 'Company name reservation, COR docs' },
      { id: 'registration-silver', name: 'Silver Registration', price: 850, description: 'Basic + Share certificates' },
      { id: 'registration-gold', name: 'Gold Registration', price: 1600, description: 'Silver + BEE certificate' },
      { id: 'registration-platinum', name: 'Platinum Registration', price: 2000, description: 'Gold + Tax clearance' },
      { id: 'registration-premium', name: 'Premium Registration', price: 2500, description: 'Platinum + Business profile' },
    ]
  },
  {
    id: 'branding',
    name: 'Branding',
    items: [
      { id: 'logo-basic', name: 'Basic Logo', price: 750, description: '2 Concepts + Revisions' },
      { id: 'logo-standard', name: 'Standard Logo', price: 1150, description: '3 Concepts + Business Card' },
      { id: 'logo-premium', name: 'Premium Logo', price: 1650, description: '5 Concepts + Full Brand Guide' },
      { id: 'business-cards', name: 'Business Cards', price: 550, description: '500 Premium Cards' },
      { id: 'media-kit', name: 'Full Media Kit', price: 2500, description: 'Photography, Video, Press-ready Assets' },
    ]
  },
  {
    id: 'digital',
    name: 'Digital',
    items: [
      { id: 'website-basic', name: 'Basic Website', price: 3000, description: '5-page Responsive Site' },
      { id: 'website-premium', name: 'Premium Website', price: 8000, description: '10+ pages with SEO' },
      { id: 'portal-custom', name: 'Custom Web Portal', price: 12000, description: 'Bookings, Payments, Dashboard' },
      { id: 'social-setup', name: 'Social Media Setup', price: 1500, description: 'Branded Profiles + Launch Content' },
      { id: 'video-ad', name: 'Video Ad (1 min)', price: 5000, description: 'Script, Shoot, Edit, Sound' },
    ]
  }
];

const getTimelineEstimate = (cart: any[]) => {
  if (cart.length === 0) {
    return null;
  }

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const hasHighComplexity = cart.some(item => ['portal-custom', 'website-premium', 'video-ad', 'media-kit'].includes(item.id));

  if (total <= 3000 && !hasHighComplexity && cart.length <= 2) {
    return '3 – 5 working days';
  }

  if (total <= 8000 && cart.length <= 5) {
    return '1 – 2 weeks';
  }

  return '2 – 3 weeks';
};

export const PackageBuilder = () => {
  const [selectedCategory, setSelectedCategory] = useState('setup');
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const timelineEstimate = useMemo(() => getTimelineEstimate(cart), [cart]);
  
  // Calculate total when cart changes
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price, 0);
    setTotal(newTotal);
  }, [cart]);
  
  // Add item to cart
  const addToCart = (item: any) => {
    // Check if item is already in cart
    if (!cart.some(cartItem => cartItem.id === item.id)) {
      setCart([...cart, item]);
    }
  };
  
  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Generate WhatsApp message with selected services
  const generateWhatsAppMessage = () => {
    if (cart.length === 0) return '';
    
    const servicesList = cart.map(item => item.name).join(', ');
    const messageTimeline = timelineEstimate ? ` Estimated timeline: ${timelineEstimate}.` : '';
    const message = `Hi Breed Industries! I'd like to get a quote for my custom package including: ${servicesList}. Total estimate: R${total}.${messageTimeline}`;
    
    return `https://wa.me/27604964105?text=${encodeURIComponent(message)}`;
  };
  
  return (
    <section className="py-20 bg-offWhite" id="package-builder">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">Build Your Own</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy mt-2 mb-4">
            Custom Package Builder
          </h2>
          <p className="text-charcoal/80 max-w-3xl mx-auto">
            Select the exact services you need and get an instant price estimate. Mix and match from our premium offerings to create your perfect solution.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Selection */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex border-b border-gray-200 mb-6">
              {serviceCategories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-3 font-medium transition-colors ${
                    selectedCategory === category.id 
                      ? 'text-gold border-b-2 border-gold' 
                      : 'text-navy/60 hover:text-navy'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="space-y-4">
              {serviceCategories
                .find(category => category.id === selectedCategory)?.items
                .map(item => (
                  <motion.div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gold/30 hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-navy">{item.name}</h4>
                      <p className="text-sm text-charcoal/70">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gold whitespace-nowrap">R{item.price}</span>
                      <button
                        className={`p-2 rounded-full transition-colors ${
                          cart.some(cartItem => cartItem.id === item.id)
                            ? 'bg-navy text-white'
                            : 'bg-gold/10 text-gold hover:bg-gold hover:text-navy'
                        }`}
                        onClick={() => {
                          if (cart.some(cartItem => cartItem.id === item.id)) {
                            removeFromCart(item.id);
                          } else {
                            addToCart(item);
                          }
                        }}
                      >
                        {cart.some(cartItem => cartItem.id === item.id) ? (
                          <Minus size={18} />
                        ) : (
                          <Plus size={18} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
          
          {/* Cart Summary */}
          <div className="bg-navy rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Your Package</h3>
              {cart.length > 0 && (
                <button 
                  className="text-white/70 hover:text-white text-sm flex items-center gap-1"
                  onClick={clearCart}
                >
                  <Trash2 size={14} />
                  Clear all
                </button>
              )}
            </div>
            
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-white/50">
                <ShoppingCart size={48} className="mb-4 opacity-50" />
                <p>Your package is empty</p>
                <p className="text-sm">Add services from the left panel</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-white/70">R{item.price}</p>
                      </div>
                      <button 
                        className="text-white/70 hover:text-white"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Total Estimate</span>
                    <span className="text-gold text-xl font-bold">R{total}</span>
                  </div>
                  {timelineEstimate && (
                    <div className="flex justify-between items-center text-sm text-white/70">
                      <span>Estimated timeline</span>
                      <span>{timelineEstimate}</span>
                    </div>
                  )}
                  <p className="text-xs text-white/50">Pricing excludes VAT.</p>
                </div>
                
                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold text-navy font-medium py-3 px-6 rounded-md w-full flex items-center justify-center gap-2 hover:bg-gold-light transition-colors"
                >
                  <i className="fab fa-whatsapp text-lg"></i>
                  Get Custom Quote
                </a>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-charcoal/70 mb-2">Need help building your perfect package?</p>
          <a
            href="https://wa.me/message/4FOGIOMM2A35L1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-gold hover:text-navy transition-colors font-medium"
          >
            <i className="fab fa-whatsapp mr-2"></i>
            Chat with our team for expert guidance
          </a>
        </div>
      </div>
    </section>
  );
};
