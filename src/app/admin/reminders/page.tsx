'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { 
  Calendar, Clock, Send, CheckCircle, XCircle, AlertCircle, 
  ChevronLeft, ChevronRight, Plus, Search, Phone, User,
  Bell, MessageSquare, LayoutGrid, List, Trash2, RefreshCw,
  ArrowLeft, FileText, Briefcase
} from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminder_type: string;
  scheduled_at: string;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  whatsapp_sent: boolean;
  phone_number: string;
  message_text: string;
  client?: { full_name: string; company_name: string; phone: string };
  lead?: { full_name: string; company_name: string; phone: string };
}

interface CRMClient {
  id: string;
  full_name: string;
  company_name: string;
  contact_phone: string;
  phone: string;
}

interface Tender {
  id: string;
  title: string;
  description: string;
  closing_date: string;
  status: string;
  category: string;
}

export default function RemindersAdmin() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showTenderModal, setShowTenderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [forAdmin, setForAdmin] = useState(false); // Self-reminder toggle

  // Form states
  const [createForm, setCreateForm] = useState({
    client_id: '',
    title: '',
    description: '',
    reminder_type: 'custom',
    scheduled_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    message_text: '',
    auto_send: true,
    notify_admin: true // Send copy to admin
  });

  const [bulkForm, setBulkForm] = useState({
    client_ids: [] as string[],
    title: '',
    description: '',
    reminder_type: 'custom',
    days_from_now: 3,
    message_template: ''
  });

  const reminderTypes = [
    { value: 'appointment', label: 'Appointment', icon: Calendar },
    { value: 'follow_up', label: 'Follow Up', icon: RefreshCw },
    { value: 'payment_due', label: 'Payment Due', icon: AlertCircle },
    { value: 'milestone', label: 'Project Milestone', icon: CheckCircle },
    { value: 'quote_followup', label: 'Quote Follow-up', icon: MessageSquare },
    { value: 'subscription_renewal', label: 'Subscription Renewal', icon: Bell },
    { value: 'custom', label: 'Custom', icon: LayoutGrid }
  ];

  useEffect(() => {
    fetchReminders();
    fetchClients();
    fetchTenders();
  }, [filterStatus]);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.set('status', filterStatus);
      params.set('limit', '100');
      
      const res = await fetch(`/api/reminders?${params}`);
      const data = await res.json();
      setReminders(data.reminders || []);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/crm/clients?limit=200');
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const fetchTenders = async () => {
    try {
      const res = await fetch('/api/tenders?limit=50&status=open');
      const data = await res.json();
      setTenders(data.tenders || []);
    } catch (err) {
      console.error('Failed to fetch tenders:', err);
    }
  };

  const createReminder = async () => {
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      });
      if (res.ok) {
        setShowCreateModal(false);
        setCreateForm({
          client_id: '', title: '', description: '', reminder_type: 'custom',
          scheduled_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          message_text: '', auto_send: true
        });
        fetchReminders();
      }
    } catch (err) {
      alert('Failed to create reminder');
    }
  };

  const createBulkReminders = async () => {
    try {
      const res = await fetch('/api/reminders/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkForm)
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Created ${data.created} reminders`);
        setShowBulkModal(false);
        setBulkForm({ client_ids: [], title: '', description: '', reminder_type: 'custom', days_from_now: 3, message_template: '' });
        fetchReminders();
      }
    } catch (err) {
      alert('Failed to create bulk reminders');
    }
  };

  const sendNow = async (reminderId: string) => {
    try {
      const res = await fetch('/api/reminders/send-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminder_id: reminderId })
      });
      const data = await res.json();
      if (data.success) {
        alert('WhatsApp sent successfully!');
        fetchReminders();
      } else {
        alert('Failed: ' + data.error);
      }
    } catch (err) {
      alert('Failed to send');
    }
  };

  const deleteReminder = async (id: string) => {
    if (!confirm('Delete this reminder?')) return;
    try {
      await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
      fetchReminders();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const getRemindersForDay = (day: Date) => {
    return reminders.filter(r => isSameDay(parseISO(r.scheduled_at), day));
  };

  const filteredClients = clients.filter(c => 
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact_phone?.includes(searchQuery)
  );

  const statusColors = {
    pending: 'bg-yellow-500',
    sent: 'bg-green-500',
    failed: 'bg-red-500',
    cancelled: 'bg-gray-500'
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href="/admin" 
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Admin
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Calendar className="w-8 h-8 text-orange-500" />
              Reminders & Calendar
            </h1>
            <p className="text-slate-400 mt-1">Schedule WhatsApp reminders for clients and yourself</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTenderModal(true)}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Briefcase size={18} />
              Share Tenders
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
              className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 flex items-center gap-2"
            >
              {viewMode === 'calendar' ? <List size={18} /> : <LayoutGrid size={18} />}
              {viewMode === 'calendar' ? 'List View' : 'Calendar'}
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 flex items-center gap-2"
            >
              <Send size={18} />
              Bulk Schedule
            </button>
            <button
              onClick={() => {
                setForAdmin(true);
                setCreateForm({...createForm, client_id: 'ADMIN', title: '', description: ''});
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Bell size={18} />
              Self Reminder
            </button>
            <button
              onClick={() => {
                setForAdmin(false);
                setCreateForm({...createForm, client_id: '', title: '', description: ''});
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 flex items-center gap-2"
            >
              <Plus size={18} />
              New Reminder
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Pending', value: reminders.filter(r => r.status === 'pending').length, color: 'text-yellow-400' },
            { label: 'Sent Today', value: reminders.filter(r => r.status === 'sent' && isSameDay(parseISO(r.sent_at || r.scheduled_at), new Date())).length, color: 'text-green-400' },
            { label: 'Failed', value: reminders.filter(r => r.status === 'failed').length, color: 'text-red-400' },
            { label: 'Total', value: reminders.length, color: 'text-blue-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-4 mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchReminders}
            className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {viewMode === 'calendar' ? (
          /* Calendar View */
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-700 rounded">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 text-sm">
                  Today
                </button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-700 rounded">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-slate-700 rounded-lg overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-slate-800 p-3 text-center text-sm text-slate-400 font-medium">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, idx) => {
                const dayReminders = getRemindersForDay(day);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      bg-slate-800 p-2 min-h-[100px] cursor-pointer transition-colors
                      ${isSelected ? 'ring-2 ring-orange-500' : 'hover:bg-slate-700'}
                      ${!isCurrentMonth ? 'opacity-50' : ''}
                    `}
                  >
                    <div className={`text-sm font-medium mb-1 ${isSameDay(day, new Date()) ? 'text-orange-400' : 'text-slate-300'}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayReminders.slice(0, 3).map((r, i) => (
                        <div
                          key={i}
                          className={`text-xs p-1 rounded truncate ${
                            r.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                            r.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {r.title}
                        </div>
                      ))}
                      {dayReminders.length > 3 && (
                        <div className="text-xs text-slate-500">+{dayReminders.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Day Details */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                {format(selectedDate, 'EEEE, MMMM do')} — {getRemindersForDay(selectedDate).length} reminders
              </h3>
              <div className="space-y-2">
                {getRemindersForDay(selectedDate).map(reminder => (
                  <ReminderCard key={reminder.id} reminder={reminder} onSend={sendNow} onDelete={deleteReminder} />
                ))}
                {getRemindersForDay(selectedDate).length === 0 && (
                  <p className="text-slate-500 text-center py-8">No reminders for this day</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="space-y-2">
              {reminders.map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} onSend={sendNow} onDelete={deleteReminder} />
              ))}
              {reminders.length === 0 && !loading && (
                <p className="text-slate-500 text-center py-8">No reminders found</p>
              )}
            </div>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {forAdmin ? <Bell className="text-purple-500" /> : <Plus className="text-orange-500" />}
                {forAdmin ? 'Self Reminder' : 'New Reminder'}
              </h2>
              
              <div className="space-y-4">
                {/* Toggle between Admin and Client reminder */}
                <div className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!forAdmin}
                      onChange={() => { setForAdmin(false); setCreateForm({...createForm, client_id: ''}); }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">For Client</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={forAdmin}
                      onChange={() => { setForAdmin(true); setCreateForm({...createForm, client_id: 'ADMIN'}); }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">For Myself (Admin)</span>
                  </label>
                </div>

                {/* Client Selection - only show if not admin reminder */}
                {!forAdmin && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Client</label>
                    <select
                      value={createForm.client_id}
                      onChange={(e) => setCreateForm({...createForm, client_id: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 rounded-lg"
                    >
                      <option value="">Select client...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.contact_name || c.full_name} {c.company_name ? `(${c.company_name})` : ''} — {c.contact_phone || c.phone || 'No phone'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Admin reminder context - show which client this is about */}
                {forAdmin && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">About Client (optional)</label>
                    <select
                      value={createForm.client_id === 'ADMIN' ? '' : createForm.client_id}
                      onChange={(e) => setCreateForm({...createForm, client_id: e.target.value || 'ADMIN'})}
                      className="w-full px-3 py-2 bg-slate-700 rounded-lg"
                    >
                      <option value="">General / Not specific to a client</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.contact_name || c.full_name} {c.company_name ? `(${c.company_name})` : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">This reminder will be sent to your admin number</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Type</label>
                  <select
                    value={createForm.reminder_type}
                    onChange={(e) => setCreateForm({...createForm, reminder_type: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg"
                  >
                    {reminderTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg"
                    placeholder="e.g., Follow up on tender proposal"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Description</label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg h-20"
                    placeholder="Details about this reminder..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    value={createForm.scheduled_at}
                    onChange={(e) => setCreateForm({...createForm, scheduled_at: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">WhatsApp Message (optional)</label>
                  <textarea
                    value={createForm.message_text}
                    onChange={(e) => setCreateForm({...createForm, message_text: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg h-20"
                    placeholder="Leave blank to use description as message..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={createForm.auto_send}
                    onChange={(e) => setCreateForm({...createForm, auto_send: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label className="text-sm">Send immediately if date is now or past</label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={createReminder}
                  disabled={!createForm.title || !createForm.scheduled_at}
                  className="flex-1 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  Create Reminder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Send className="text-orange-500" />
                Bulk Schedule Reminders
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Search Clients</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-slate-700 rounded-lg"
                      placeholder="Search by name or phone..."
                    />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p className="text-sm text-slate-400 mb-2">Select clients ({bulkForm.client_ids.length} selected):</p>
                  <div className="space-y-1">
                    {filteredClients.map(c => (
                      <label key={c.id} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bulkForm.client_ids.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkForm({...bulkForm, client_ids: [...bulkForm.client_ids, c.id]});
                            } else {
                              setBulkForm({...bulkForm, client_ids: bulkForm.client_ids.filter(id => id !== c.id)});
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{c.full_name} — {c.contact_phone || c.phone || 'No phone'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Type</label>
                    <select
                      value={bulkForm.reminder_type}
                      onChange={(e) => setBulkForm({...bulkForm, reminder_type: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 rounded-lg"
                    >
                      {reminderTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Days from now</label>
                    <input
                      type="number"
                      value={bulkForm.days_from_now}
                      onChange={(e) => setBulkForm({...bulkForm, days_from_now: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-slate-700 rounded-lg"
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={bulkForm.title}
                    onChange={(e) => setBulkForm({...bulkForm, title: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg"
                    placeholder="e.g., Monthly check-in"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Message Template</label>
                  <textarea
                    value={bulkForm.message_template}
                    onChange={(e) => setBulkForm({...bulkForm, message_template: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg h-24"
                    placeholder="Hi {name}, this is a reminder from Breed Industries about..."
                  />
                  <p className="text-xs text-slate-500 mt-1">Variables: {'{name}'}, {'{company}'}, {'{phone}'}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={createBulkReminders}
                  disabled={!bulkForm.title || bulkForm.client_ids.length === 0}
                  className="flex-1 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  Schedule {bulkForm.client_ids.length} Reminders
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tender Sharing Modal */}
        {showTenderModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="text-blue-500" />
                Share Tender Opportunities
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                Select available tenders and clients to notify them about opportunities
              </p>

              <div className="space-y-4">
                {/* Available Tenders */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Available Tenders ({tenders.length})</label>
                  <div className="bg-slate-900 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                    {tenders.map(tender => (
                      <div key={tender.id} className="flex items-start gap-3 p-2 bg-slate-800 rounded">
                        <FileText className="text-blue-400 shrink-0 mt-0.5" size={16} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{tender.title}</p>
                          <p className="text-xs text-slate-500">
                            Closes: {format(parseISO(tender.closing_date), 'MMM d, yyyy')} • {tender.category}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const message = `Hi {name}, we found a tender opportunity for you:\n\n📋 ${tender.title}\n🏷️ ${tender.category}\n📅 Closes: ${format(parseISO(tender.closing_date), 'MMMM d, yyyy')}\n\nContact us to discuss how we can help you win this tender.\n\n— Breed Industries`;
                            setBulkForm({
                              ...bulkForm,
                              title: `Tender: ${tender.title.slice(0, 30)}...`,
                              message_template: message,
                              reminder_type: 'custom'
                            });
                            setShowTenderModal(false);
                            setShowBulkModal(true);
                          }}
                          className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
                        >
                          Share
                        </button>
                      </div>
                    ))}
                    {tenders.length === 0 && (
                      <p className="text-slate-500 text-center py-4">No open tenders available</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/admin/tenders"
                    onClick={() => setShowTenderModal(false)}
                    className="flex items-center justify-center gap-2 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 text-sm"
                  >
                    <FileText size={16} />
                    Manage Tenders
                  </Link>
                  <button
                    onClick={() => {
                      setShowTenderModal(false);
                      setShowBulkModal(true);
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-orange-600 rounded-lg hover:bg-orange-700 text-sm"
                  >
                    <Send size={16} />
                    Custom Message
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowTenderModal(false)}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reminder Card Component
function ReminderCard({ reminder, onSend, onDelete }: { 
  reminder: Reminder; 
  onSend: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  // Check if this is an admin self-reminder
  const isAdminReminder = reminder.client_id === 'ADMIN' || !reminder.client_id;
  
  const contactName = isAdminReminder 
    ? 'Myself (Admin)' 
    : (reminder.client?.full_name || reminder.lead?.full_name || 'Unknown');
  const company = isAdminReminder 
    ? (reminder.client?.company_name || '') 
    : (reminder.client?.company_name || reminder.lead?.company_name);
  const phone = isAdminReminder 
    ? 'Admin Number' 
    : (reminder.phone_number || reminder.client?.phone || reminder.lead?.phone);

  return (
    <div className={`rounded-lg p-4 flex items-center justify-between ${isAdminReminder ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-slate-700/50'}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${
            reminder.status === 'sent' ? 'bg-green-500' :
            reminder.status === 'failed' ? 'bg-red-500' :
            reminder.status === 'cancelled' ? 'bg-gray-500' :
            'bg-yellow-500'
          }`} />
          <span className="font-medium">{reminder.title}</span>
          <span className="text-xs px-2 py-0.5 bg-slate-600 rounded capitalize">
            {reminder.reminder_type.replace('_', ' ')}
          </span>
          {isAdminReminder && (
            <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">
              Self Reminder
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 mb-1">{reminder.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <User size={12} />
            {contactName} {company && `(${company})`}
          </span>
          {phone && (
            <span className="flex items-center gap-1">
              <Phone size={12} />
              {phone}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {format(parseISO(reminder.scheduled_at), 'MMM d, h:mm a')}
          </span>
          {reminder.whatsapp_sent && (
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle size={12} />
              WhatsApp sent
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {reminder.status === 'pending' && (
          <button
            onClick={() => onSend(reminder.id)}
            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
            title="Send now"
          >
            <Send size={16} />
          </button>
        )}
        <button
          onClick={() => onDelete(reminder.id)}
          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
