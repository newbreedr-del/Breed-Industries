'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { Mail, Search, Filter, Eye, Trash2, Archive } from 'lucide-react';

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Header />
      
      <PageHero
        title="Messages"
        subtitle="Admin Dashboard"
        description="View and manage contact form submissions and customer messages."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Messages', href: '/admin/messages' }
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
                  Search Messages
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
                  <Filter size={14} className="inline mr-1" />
                  Status
                </label>
                <select className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white">
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="glass-card overflow-hidden">
            <div className="p-12 text-center text-white/60">
              <Mail size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Contact form submissions will appear here.</p>
              <p className="text-xs mt-4 text-white/40">
                Messages are sent to info@thebreed.co.za and will be logged here for tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
