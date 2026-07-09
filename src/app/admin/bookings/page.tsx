'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { Trash2, Plus, Users, Armchair, Search, X, CheckCircle, AlertTriangle, MessageCircle, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';

const DEFAULT_REMINDER =
  `Hi {{name}} 👋\n\n` +
  `This is a friendly reminder about *The Future-Proof Business* event.\n\n` +
  `🗓️ Tuesday, 14 July 2026 — 10:00 AM\n` +
  `📍 65 St Johns Ave, Nisbett Rd, Pinetown\n\n` +
  `🎟️ Booking Ref: *{{reference}}*\n` +
  `💺 Your Seats: {{seats}}\n\n` +
  `Please arrive 30 minutes early and have your booking reference ready at the door.\n\n` +
  `See you there! 🎉\n\n` +
  `_Breed Industries — 060 496 4105_`;

const REMINDER_TEMPLATES = [
  {
    id: 'event',
    label: '🎟️ Event Reminder (FPB)',
    message: DEFAULT_REMINDER,
  },
  {
    id: 'appointment',
    label: '📅 Appointment Reminder',
    message:
      `Hi {{name}}! 👋 Just a quick reminder from Breed Industries about our upcoming appointment on [Date] at [Time]. 🧠💻 Looking forward to connecting! Here is the link to join: [Insert Link]\n\n_Breed Industries — 060 496 4105_`,
  },
  {
    id: 'followup',
    label: '🤝 Follow Up',
    message:
      `Hi {{name}}! 👋 Just following up on our recent chat regarding your tech infrastructure with Breed Industries. 🛠️✨ Let me know if you\'ve had a chance to review the details or if you have any quick questions I can jump on!\n\n_Breed Industries — 060 496 4105_`,
  },
  {
    id: 'payment',
    label: '💳 Payment Due',
    message:
      `Hi {{name}}! 👋 This is a quick heads-up from Breed Industries that your monthly platform administration cycle is up. 🧠💻 Your official invoice is being sent over separately today for your records. Thank you for your continued partnership! 🙏\n\n_Breed Industries — 060 496 4105_`,
  },
  {
    id: 'milestone',
    label: '🚀 Project Milestone',
    message:
      `Hi {{name}}! 🚀 Exciting news from Breed Industries — we\'ve officially completed [Milestone Name]! 💻✨ The updates are live on your staging link for you to look at. Let us know your thoughts so we can jump straight into the next phase! 🛠️\n\n_Breed Industries — 060 496 4105_`,
  },
  {
    id: 'quote',
    label: '📋 Quote Follow-up',
    message:
      `Hi {{name}}! 👋 Just checking in to see if you and the team had a look over the custom tech proposal from Breed Industries? 🧠📊 Keep in mind the official quote details were sent over separately. Let me know if you want to tweak anything! 🛠️\n\n_Breed Industries — 060 496 4105_`,
  },
  {
    id: 'renewal',
    label: '🔄 Subscription Renewal',
    message:
      `Hi {{name}}! 👋 Quick heads-up that your platform administration subscription with Breed Industries is renewing on [Date]. 🚀🧠 Your renewal invoice will be sent over separately today. We\'re excited to keep your apps fast and secure! 💻🔒\n\n_Breed Industries — 060 496 4105_`,
  },
];

interface Booking {
  id: string;
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  seats: string;
  seat_count: number;
  created_at: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  // Reminder state: target is a booking id, 'all', or null (closed)
  const [reminderTarget, setReminderTarget] = useState<string | 'all' | null>(null);
  const [reminderType, setReminderType] = useState('event');
  const [reminderMessage, setReminderMessage] = useState(DEFAULT_REMINDER);
  const [sendingReminder, setSendingReminder] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    seats: '',
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        showToast('Booking deleted successfully');
      } else {
        const data = await res.json();
        showToast('Error: ' + (data.error || 'Failed to delete'));
      }
    } catch (err: any) {
      showToast('Error: ' + err.message);
    }
    setDeleteId(null);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const seatList = form.seats.split(',').map((s) => s.trim()).filter(Boolean);
    if (seatList.length === 0) {
      showToast('Please enter at least one seat (e.g. A-1, B-3)');
      return;
    }

    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          seats: seatList,
          seatCount: seatList.length,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBookings((prev) => [data.booking, ...prev]);
        setShowAddModal(false);
        setForm({ firstName: '', lastName: '', email: '', phone: '', seats: '' });
        showToast('Booking added successfully');
      } else {
        showToast('Error: ' + (data.error || 'Failed to add'));
      }
    } catch (err: any) {
      showToast('Error: ' + err.message);
    }
  }

  async function handleSendReminder() {
    if (reminderTarget === null) return;
    setSendingReminder(true);
    try {
      const res = await fetch('/api/admin/bookings/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reminderTarget === 'all' ? undefined : reminderTarget,
          message: reminderMessage,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const s = data.summary;
        showToast(`Reminders: ${s.sent} sent, ${s.failed} failed, ${s.skipped} skipped (no phone)`);
        setReminderTarget(null);
        setReminderType('event');
        setReminderMessage(DEFAULT_REMINDER);
      } else {
        showToast('Error: ' + (data.error || 'Failed to send reminders'));
      }
    } catch (err: any) {
      showToast('Error: ' + err.message);
    } finally {
      setSendingReminder(false);
    }
  }

  function handleTemplateChange(id: string) {
    setReminderType(id);
    const tpl = REMINDER_TEMPLATES.find((t) => t.id === id);
    if (tpl) setReminderMessage(tpl.message);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.first_name.toLowerCase().includes(q) ||
      b.last_name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.reference.toLowerCase().includes(q) ||
      (b.phone && b.phone.includes(q)) ||
      b.seats.toLowerCase().includes(q)
    );
  });

  const totalSeats = bookings.reduce((sum, b) => sum + (b.seat_count || 0), 0);

  return (
    <>
      <Header />
      <PageHero
        title="Event Bookings"
        subtitle="Admin"
        description="Manage seat reservations for The Future Proof Business event."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Bookings', href: '/admin/bookings' },
        ]}
        size="default"
        align="left"
      />

      <section className="py-12 bg-color-bg-secondary relative min-h-screen">
        <div className="absolute inset-0 grid-overlay" />
        <div className="container mx-auto px-4 relative z-10">

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#FF9F00]/10">
                <Users size={22} className="text-[#FF9F00]" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Armchair size={22} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Seats Reserved</p>
                <p className="text-2xl font-bold text-white">{totalSeats}</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Armchair size={22} className="text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Seats Available</p>
                <p className="text-2xl font-bold text-white">{70 - totalSeats}</p>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search by name, email, reference or seat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0B1118] border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:border-[#FF9F00] focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => { setReminderType('event'); setReminderMessage(DEFAULT_REMINDER); setReminderTarget('all'); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={16} />
              Remind All
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FF9F00] text-gray-900 rounded-lg text-sm font-bold hover:bg-[#e88a00] transition-colors"
            >
              <Plus size={16} />
              Add Reservation
            </button>
          </div>

          {/* Table */}
          <div className="glass-card overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-white/50">Loading bookings...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-white/50">
                <Armchair size={48} className="mx-auto mb-4 opacity-30" />
                <p>{search ? 'No bookings match your search.' : 'No bookings yet.'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700/50 text-white/60 text-xs uppercase tracking-wider">
                      <th className="text-left px-4 py-3">Reference</th>
                      <th className="text-left px-4 py-3">Name</th>
                      <th className="text-left px-4 py-3">Contact</th>
                      <th className="text-left px-4 py-3">Seats</th>
                      <th className="text-left px-4 py-3">Count</th>
                      <th className="text-left px-4 py-3">Date</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b) => (
                      <tr key={b.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-[#FF9F00] font-semibold">{b.reference}</td>
                        <td className="px-4 py-3 text-white">{b.first_name} {b.last_name}</td>
                        <td className="px-4 py-3">
                          <div className="text-white">{b.email}</div>
                          {b.phone && <div className="text-white/50 text-xs">{b.phone}</div>}
                        </td>
                        <td className="px-4 py-3 text-white/80">{b.seats}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">
                            {b.seat_count}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs">
                          {new Date(b.created_at).toLocaleDateString('en-ZA')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => { setReminderType('event'); setReminderMessage(DEFAULT_REMINDER); setReminderTarget(b.id); }}
                              disabled={!b.phone}
                              className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title={b.phone ? 'Send WhatsApp reminder' : 'No phone number on file'}
                            >
                              <MessageCircle size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteId(b.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                              title="Delete booking"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Reminder Modal */}
      {reminderTarget !== null && (() => {
        const reminderBooking = reminderTarget !== 'all' ? bookings.find((b) => b.id === reminderTarget) : null;
        return (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50" onClick={(e) => e.target === e.currentTarget && !sendingReminder && setReminderTarget(null)}>
            <div className="bg-[#0B1118] border border-gray-800 rounded-2xl p-6 w-full max-w-lg animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageCircle size={18} className="text-green-400" />
                  {reminderTarget === 'all' ? 'Remind All Attendees' : 'Send WhatsApp Reminder'}
                </h2>
                <button onClick={() => setReminderTarget(null)} disabled={sendingReminder} className="text-white/40 hover:text-white disabled:opacity-30">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {reminderTarget === 'all'
                  ? `Sends a WhatsApp message to all attendees with a phone number (${bookings.filter(b => b.phone).length} of ${bookings.length}).`
                  : reminderBooking
                    ? <span>Sending to <span className="text-white font-semibold">{reminderBooking.first_name} {reminderBooking.last_name}</span> <span className="text-white/40">({reminderBooking.phone})</span></span>
                    : 'Sends a WhatsApp message to this attendee.'}
              </p>

              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Template</label>
              <select
                value={reminderType}
                onChange={(e) => handleTemplateChange(e.target.value)}
                disabled={sendingReminder}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#FF9F00] focus:outline-none mb-4 disabled:opacity-50"
              >
                {REMINDER_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>

              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
              <textarea
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                rows={9}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF9F00] focus:outline-none font-mono resize-none"
              />
              <p className="text-[11px] text-gray-600 mt-1.5 mb-4">
                Placeholders: <code className="text-gray-400">{'{{name}}'}</code>, <code className="text-gray-400">{'{{fullName}}'}</code>, <code className="text-gray-400">{'{{reference}}'}</code>, <code className="text-gray-400">{'{{seats}}'}</code>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setReminderTarget(null)}
                  disabled={sendingReminder}
                  className="flex-1 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReminder}
                  disabled={sendingReminder}
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {sendingReminder ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Reminder</>}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="bg-[#0B1118] border border-gray-800 rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Add Reservation</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">First name</label>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF9F00] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Last name</label>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF9F00] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF9F00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="060 123 4567"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF9F00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Seats (comma-separated)</label>
                <input
                  required
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: e.target.value })}
                  placeholder="A-1, B-3, C-5"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#FF9F00] focus:outline-none"
                />
                <p className="text-xs text-gray-600 mt-1">Enter seat IDs separated by commas</p>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#FF9F00] text-gray-900 rounded-lg text-sm font-bold hover:bg-[#e88a00] transition-colors"
              >
                Add Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="bg-[#0B1118] border border-gray-800 rounded-2xl p-6 w-full max-w-sm text-center animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Booking?</h3>
            <p className="text-sm text-gray-400 mb-6">This will free up the reserved seats. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 rounded-lg px-5 py-3 text-sm text-white shadow-xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom-4">
          <CheckCircle size={16} className="text-green-400" />
          {toast}
        </div>
      )}
    </>
  );
}
