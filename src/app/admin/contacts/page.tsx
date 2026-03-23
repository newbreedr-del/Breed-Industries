'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { Users, Mail, Phone, Search, Filter, Download } from 'lucide-react';

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Header />
      
      <PageHero
        title="Contacts & Leads"
        subtitle="Admin Dashboard"
        description="Manage customer contacts and track leads from contact form submissions."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Contacts', href: '/admin/contacts' }
        ]}
        size="default"
      />

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Filters */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  <Search size={14} className="inline mr-1" />
                  Search Contacts
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, email, or phone"
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
                  <Filter size={14} className="inline mr-1" />
                  Source
                </label>
                <select className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white">
                  <option value="all">All Sources</option>
                  <option value="contact-form">Contact Form</option>
                  <option value="quote">Quote Request</option>
                  <option value="manual">Manual Entry</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-outline flex-1"
                >
                  Clear
                </button>
                <button className="btn btn-primary flex-1">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-12 text-center text-white/60">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No contacts yet</p>
              <p className="text-sm">Contact form submissions and quote requests will appear here.</p>
              <p className="text-xs mt-4 text-white/40">
                Contact data will be stored when customers submit the contact form or request quotes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
