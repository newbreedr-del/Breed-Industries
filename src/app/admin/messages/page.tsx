'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { Mail, Search, Archive, Phone, ChevronDown, ChevronUp } from 'lucide-react';

type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const { messages } = await res.json();
        setMessages(messages || []);
      }
    } catch (_) {}
    setLoading(false);
  };

  const markStatus = async (id: string, status: 'read' | 'archived') => {
    try {
      await fetch('/api/contact', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch (_) {}
  };

  const handleExpand = (id: string) => {
    setExpanded(prev => prev === id ? null : id);
    const msg = messages.find(m => m.id === id);
    if (msg?.status === 'unread') markStatus(id, 'read');
  };

  const filtered = messages.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    return matchSearch && (filter === 'all' || m.status === filter);
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <>
      <Header />
      <PageHero
        title="Messages"
        subtitle="Admin Dashboard"
        description="Contact form submissions from your website visitors."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Messages', href: '/admin/messages' }]}
        size="default"
      />
      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total', value: messages.length, color: 'text-white' },
              { label: 'Unread', value: unreadCount, color: 'text-accent' },
              { label: 'Read', value: messages.filter(m => m.status === 'read').length, color: 'text-white' },
            ].map(s => (
              <div key={s.label} className="glass-card p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-white/60 text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent/50" />
              </div>
              <div className="flex gap-2">
                {(['all', 'unread', 'read', 'archived'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-accent text-color-bg-deep' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                    {f}{f === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="glass-card p-12 text-center text-white/60">Loading messages…</div>
            ) : filtered.length === 0 ? (
              <div className="glass-card p-12 text-center text-white/60">
                <Mail size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">{messages.length === 0 ? 'No messages yet' : 'No matching messages'}</p>
                <p className="text-sm mt-1">Contact form submissions will appear here automatically.</p>
                {messages.length === 0 && (
                  <p className="text-xs mt-3 text-white/40">Run the SQL setup script in Supabase to enable message storage.</p>
                )}
              </div>
            ) : (
              filtered.map(msg => (
                <div key={msg.id} className={`glass-card overflow-hidden ${msg.status === 'unread' ? 'border border-accent/30' : ''}`}>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5" onClick={() => handleExpand(msg.id)}>
                    <div className="flex items-center gap-3">
                      {msg.status === 'unread' && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium text-sm">{msg.name}</p>
                          {msg.status === 'unread' && <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded font-medium">New</span>}
                        </div>
                        <p className="text-white/50 text-xs">{msg.email}{msg.phone ? ` · ${msg.phone}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-white/40 text-xs hidden md:block max-w-[200px] truncate">{msg.message}</p>
                      <p className="text-white/40 text-xs whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString('en-ZA')}</p>
                      {expanded === msg.id ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                    </div>
                  </div>
                  {expanded === msg.id && (
                    <div className="border-t border-white/10 p-4 bg-white/[0.02]">
                      <p className="text-white/80 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{msg.message}</p>
                      <div className="flex items-center gap-3">
                        <a href={`mailto:${msg.email}`} className="btn btn-primary text-xs py-1.5 px-4">Reply</a>
                        {msg.phone && (
                          <a href={`tel:${msg.phone}`} className="btn btn-outline text-xs py-1.5 px-3 flex items-center gap-1">
                            <Phone size={12} /> Call
                          </a>
                        )}
                        {msg.status !== 'archived' && (
                          <button onClick={() => markStatus(msg.id, 'archived')}
                            className="flex items-center gap-1 text-white/40 hover:text-white/70 text-xs ml-auto transition-colors">
                            <Archive size={12} /> Archive
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
