'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  HelpCircle,
  ChevronDown,
  Save,
  X
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface FAQCategory {
  name: string;
  faqs: FAQ[];
}

export default function FAQManagement() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = () => {
    // Default FAQ data - in production this would come from an API/database
    const defaultFAQs: FAQCategory[] = [
      {
        name: 'Company Registration',
        faqs: [
          {
            id: '1',
            question: 'How long does company registration take in South Africa?',
            answer: 'With our professional service, company registration typically takes 3-7 business days. DIY registration through CIPC can take 2-4 weeks depending on their workload and any issues with name approval or documentation.',
            category: 'Company Registration',
            order: 1,
          },
          {
            id: '2',
            question: 'What documents do I need to register a company?',
            answer: 'You will need certified ID copies of all directors and shareholders (certified within the last 3 months), proof of address (utility bill or bank statement not older than 3 months), and director consent forms. We handle all document preparation and certification guidance.',
            category: 'Company Registration',
            order: 2,
          },
        ],
      },
      {
        name: 'Branding & Design',
        faqs: [
          {
            id: '3',
            question: 'How long does logo design take?',
            answer: 'Our logo design process typically takes 5-10 business days. This includes initial concepts (3-5 options), revision rounds based on your feedback, and final file delivery in all formats. Rush services are available for urgent projects.',
            category: 'Branding & Design',
            order: 1,
          },
        ],
      },
      {
        name: 'Website Development',
        faqs: [
          {
            id: '4',
            question: 'How long does it take to build a website?',
            answer: 'Timeline depends on complexity: Basic business websites take 1-2 weeks, professional websites with custom features take 2-4 weeks, and e-commerce websites take 4-8 weeks. We provide detailed timelines during consultation.',
            category: 'Website Development',
            order: 1,
          },
        ],
      },
      {
        name: 'Pricing & Payment',
        faqs: [
          {
            id: '5',
            question: 'What payment options do you offer?',
            answer: 'We accept EFT, credit card payments (via PayFast), and cash deposits. For larger projects, we offer payment plans with 50% deposit to commence work and balance on completion.',
            category: 'Pricing & Payment',
            order: 1,
          },
        ],
      },
    ];

    setCategories(defaultFAQs);
    // Expand all by default
    setExpandedCategories(new Set(defaultFAQs.map(c => c.name)));
    setIsLoading(false);
  };

  const toggleCategory = (name: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSaveFAQ = async (faq: FAQ) => {
    try {
      // In production, this would save to database via API
      const newCategories = categories.map(cat => {
        if (cat.name === faq.category) {
          const existingIndex = cat.faqs.findIndex(f => f.id === faq.id);
          if (existingIndex >= 0) {
            // Update existing
            const newFaqs = [...cat.faqs];
            newFaqs[existingIndex] = faq;
            return { ...cat, faqs: newFaqs };
          } else {
            // Add new
            return { ...cat, faqs: [...cat.faqs, { ...faq, id: Date.now().toString() }] };
          }
        }
        return cat;
      });

      // If category doesn't exist, create it
      if (!newCategories.find(c => c.name === faq.category)) {
        newCategories.push({
          name: faq.category,
          faqs: [{ ...faq, id: Date.now().toString() }],
        });
      }

      setCategories(newCategories);
      setEditingFAQ(null);
      setIsCreating(false);
      alert(isCreating ? 'FAQ created successfully!' : 'FAQ updated successfully!');
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Failed to save FAQ. Please try again.');
    }
  };

  const handleDeleteFAQ = async (categoryName: string, faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      const newCategories = categories.map(cat => {
        if (cat.name === categoryName) {
          return { ...cat, faqs: cat.faqs.filter(f => f.id !== faqId) };
        }
        return cat;
      }).filter(cat => cat.faqs.length > 0); // Remove empty categories

      setCategories(newCategories);
      alert('FAQ deleted successfully');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.faqs.length > 0);

  const allCategories = [...new Set(categories.map(c => c.name))];

  return (
    <div className="min-h-screen bg-color-bg-deep">
      {/* Header */}
      <div className="bg-color-bg-secondary border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-accent" />
                FAQ Manager
              </h1>
            </div>
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingFAQ({
                  id: '',
                  question: '',
                  answer: '',
                  category: allCategories[0] || 'Company Registration',
                  order: 1,
                });
              }}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-accent"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">
              {categories.reduce((sum, cat) => sum + cat.faqs.length, 0)}
            </p>
            <p className="text-white/60 text-sm">Total FAQs</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{categories.length}</p>
            <p className="text-white/60 text-sm">Categories</p>
          </div>
        </div>

        {/* Edit/Create Modal */}
        {(editingFAQ || isCreating) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-color-bg-secondary border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {isCreating ? 'Create New FAQ' : 'Edit FAQ'}
                </h2>
                <button
                  onClick={() => {
                    setEditingFAQ(null);
                    setIsCreating(false);
                  }}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Category</label>
                  <select
                    value={editingFAQ?.category}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ!, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent"
                  >
                    {allCategories.map(cat => (
                      <option key={cat} value={cat} className="bg-color-bg-deep">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Or New Category</label>
                  <input
                    type="text"
                    placeholder="Enter new category name..."
                    onChange={(e) => {
                      if (e.target.value) {
                        setEditingFAQ({ ...editingFAQ!, category: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Question *</label>
                  <input
                    type="text"
                    value={editingFAQ?.question}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ!, question: e.target.value })}
                    placeholder="Enter the question..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Answer *</label>
                  <textarea
                    value={editingFAQ?.answer}
                    onChange={(e) => setEditingFAQ({ ...editingFAQ!, answer: e.target.value })}
                    placeholder="Enter the answer..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setEditingFAQ(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => editingFAQ && handleSaveFAQ(editingFAQ)}
                    disabled={!editingFAQ?.question || !editingFAQ?.answer}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-color-bg-deep rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save FAQ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Categories */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading FAQs...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-2">No FAQs found</p>
            <p className="text-white/40 text-sm">
              {searchQuery ? 'Try adjusting your search' : 'Create your first FAQ to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <div key={category.name} className="glass-card overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown 
                      className={`w-5 h-5 text-accent transition-transform ${
                        expandedCategories.has(category.name) ? '' : '-rotate-90'
                      }`} 
                    />
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                      {category.faqs.length} FAQs
                    </span>
                  </div>
                </button>

                {expandedCategories.has(category.name) && (
                  <div className="border-t border-white/10">
                    {category.faqs.map((faq, index) => (
                      <div
                        key={faq.id}
                        className={`p-4 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors ${
                          index !== category.faqs.length - 1 ? 'border-b border-white/10' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white mb-2">{faq.question}</p>
                          <p className="text-white/60 text-sm line-clamp-2">{faq.answer}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setEditingFAQ(faq)}
                            className="p-2 text-white/60 hover:text-accent hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFAQ(category.name, faq.id)}
                            className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
