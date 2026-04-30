'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  questions: FAQ[];
}

export function FAQSection({ faqCategories }: { faqCategories: FAQCategory[] }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>(faqCategories[0]?.category || '');

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  const activeFAQs = faqCategories.find((cat) => cat.category === activeCategory)?.questions || [];

  return (
    <section className="py-20 bg-color-bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-accent" />
                Categories
              </h3>
              <div className="space-y-2">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setActiveCategory(cat.category)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      activeCategory === cat.category
                        ? 'bg-accent text-color-bg-deep font-medium'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-white mb-8">{activeCategory}</h2>
            <div className="space-y-4">
              {activeFAQs.map((faq, index) => {
                const id = `${activeCategory}-${index}`;
                const isOpen = openItems.has(id);

                return (
                  <div
                    key={id}
                    className={`glass-card overflow-hidden transition-all duration-300 ${
                      isOpen ? 'border-accent/30' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(id)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="font-medium text-white pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="px-6 pb-6">
                        <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
