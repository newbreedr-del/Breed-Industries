'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { 
  Calendar, Clock, Send, CheckCircle, XCircle, AlertCircle, 
  ChevronLeft, ChevronRight, Plus, Search, Phone, User,
  Bell, MessageSquare, LayoutGrid, List, Trash2, RefreshCw,
  ArrowLeft, FileText, Briefcase, RotateCw
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
  client_id?: string;
  client?: { full_name: string; company_name: string; phone: string };
  lead?: { full_name: string; company_name: string; phone: string };
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_count?: number;
}

interface CRMClient {
  id: string;
  contact_name: string;
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
    client_name: '',
    client_phone: '',
    client_email: '',
    client_company: '',
    title: '',
    description: '',
    reminder_type: 'custom',
    scheduled_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    message_text: '',
    auto_send: true,
    notify_admin: true, // Send copy to admin
    is_recurring: false,
    recurrence_pattern: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    recurrence_interval: 1,
    recurrence_end_date: '',
    max_recurrences: '' as string | number
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
    { value: 'appointment', label: '📅 Appointment', icon: Calendar },
    { value: 'follow_up', label: '🤝 Follow Up', icon: RefreshCw },
    { value: 'payment_due', label: '💳 Payment Due', icon: AlertCircle },
    { value: 'milestone', label: '🚀 Project Milestone', icon: CheckCircle },
    { value: 'quote_followup', label: '📋 Quote Follow-up', icon: MessageSquare },
    { value: 'subscription_renewal', label: '🔄 Subscription Renewal', icon: Bell },
    { value: 'custom', label: '✏️ Custom', icon: LayoutGrid }
  ];

  const REMINDER_TEMPLATE_DEFAULTS: Record<string, { title: string; description: string; message_text: string }> = {
    appointment: {
      title: '📅 Confirmed: Upcoming Scheduled Strategy Session',
      description: `This is a quick reminder regarding your upcoming appointment with Breed Industries. We are looking forward to connecting and diving into your project goals.\n\nEvent: Strategy & Tech Consultation\nHost: Breed Industries 🚀\nLocation/Platform: [Insert Link / Venue]\n\nPlease ensure you are in a quiet space with a stable internet connection. If you need to reschedule, please let us know at least 24 hours in advance.`,
      message_text: `Hi [Client Name]! 👋 Just a quick reminder from Breed Industries about our upcoming appointment on [Date] at [Time]. 🧠💻 Looking forward to connecting! Here is the link to join: [Insert Link]\n\n_Breed Industries — 060 496 4105_`,
    },
    follow_up: {
      title: '🤝 Following Up: Next Steps for Your Digital Infrastructure',
      description: `We are checking in regarding our recent discussion about your web application and AI workflows.\n\nAt Breed Industries, we want to ensure you have everything you need to make an informed decision.\n\nStatus: Awaiting Feedback / Next Steps 🚀\nSubject: Custom Business Automation & Administration`,
      message_text: `Hi [Client Name]! 👋 Just following up on our recent chat regarding your tech infrastructure with Breed Industries. 🛠️✨ Let me know if you've had a chance to review the details or if you have any quick questions I can jump on!\n\n_Breed Industries — 060 496 4105_`,
    },
    payment_due: {
      title: '💳 Service Reminder: Monthly Administration Fees',
      description: `This is a friendly notification that the current billing cycle for your Webapp & AI Platform Administration is now due.\n\nService: Monthly Administration & Support\nProvider: Breed Industries 🚀\nStatus: Invoice Sent Separately\n\nTo avoid any service interruptions to your live apps, please arrange payment at your earliest convenience.`,
      message_text: `Hi [Client Name]! 👋 This is a quick heads-up from Breed Industries that your monthly platform administration cycle is up. 🧠💻 Your official invoice is being sent over separately today for your records. Thank you for your continued partnership! 🙏\n\n_Breed Industries — 060 496 4105_`,
    },
    milestone: {
      title: '🚀 Project Milestone Achieved & Ready for Review',
      description: `Great news! We have successfully completed a major milestone for your custom application development.\n\nProject: Custom Webapp & AI Integration\nMilestone: [Insert Milestone Name]\nAction Required: Client Review & Feedback 📋\n\nPlease review the latest updates on your staging URL and reply with your sign-off so we can move into the next phase.`,
      message_text: `Hi [Client Name]! 🚀 Exciting news from Breed Industries — we've officially completed [Milestone Name]! 💻✨ The updates are live on your staging link for you to look at. Let us know your thoughts so we can jump straight into the next phase! 🛠️\n\n_Breed Industries — 060 496 4105_`,
    },
    quote_followup: {
      title: '📋 Reviewing Your Custom Tech Proposal',
      description: `We are following up on the custom technology implementation proposal prepared for your business.\n\nProposal Type: Webapp Development & AI Integration Strategy\nStatus: Quote Sent Separately 🚀\n\nIf you would like to adjust the scope, remove features, or fast-track the launch date, please let us know.`,
      message_text: `Hi [Client Name]! 👋 Just checking in to see if you and the team had a look over the custom tech proposal from Breed Industries? 🧠📊 Keep in mind the official quote details were sent over separately. Let me know if you want to tweak anything! 🛠️\n\n_Breed Industries — 060 496 4105_`,
    },
    subscription_renewal: {
      title: '🔄 Notice: Upcoming Subscription Renewal',
      description: `Your automated Webapp & AI Platform Administration agreement with Breed Industries is approaching its scheduled renewal date.\n\nService Plan: Monthly Core Platform Administration\nRenewal Date: [Insert Date]\nBilling: Subscription Invoice Sent Separately 🚀\n\nNo action required if you wish to maintain your current tier.`,
      message_text: `Hi [Client Name]! 👋 Quick heads-up that your platform administration subscription with Breed Industries is renewing on [Date]. 🚀🧠 Your renewal invoice will be sent over separately today. We're excited to keep your apps fast and secure! 💻🔒\n\n_Breed Industries — 060 496 4105_`,
    },
  };

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
        setForAdmin(false);
        setCreateForm({
          client_id: '', client_name: '', client_phone: '', client_email: '', client_company: '',
          title: '', description: '', reminder_type: 'custom',
          scheduled_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          message_text: '', auto_send: true, notify_admin: true,
          is_recurring: false, recurrence_pattern: 'weekly', recurrence_interval: 1,
          recurrence_end_date: '', max_recurrences: ''
        });
        fetchReminders();
      } else {
        const errorData = await res.json();
        alert(`Failed to create reminder: ${errorData.error || res.statusText}`);
      }
    } catch (err: any) {
      alert(`Failed to create reminder: ${err.message}`);
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

  const handleTypeChange = (type: string) => {
    const tpl = REMINDER_TEMPLATE_DEFAULTS[type];
    if (tpl) {
      const name = createForm.client_name?.trim() || '[Client Name]';
      setCreateForm({
        ...createForm,
        reminder_type: type,
        title: tpl.title,
        description: tpl.description,
        message_text: tpl.message_text.replace(/\[Client Name\]/g, name),
      });
    } else {
      setCreateForm({ ...createForm, reminder_type: type, title: '', description: '', message_text: '' });
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
    c.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
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
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowTenderModal(true)}
              className="px-3 md:px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm md:text-base"
            >
              <Briefcase size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Share Tenders</span>
              <span className="sm:hidden">Tenders</span>
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
              className="px-3 md:px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 flex items-center gap-2 text-sm md:text-base"
            >
              {viewMode === 'calendar' ? <List size={16} className="md:w-[18px] md:h-[18px]" /> : <LayoutGrid size={16} className="md:w-[18px] md:h-[18px]" />}
              <span className="hidden sm:inline">{viewMode === 'calendar' ? 'List View' : 'Calendar'}</span>
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-3 md:px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 flex items-center gap-2 text-sm md:text-base"
            >
              <Send size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Bulk Schedule</span>
              <span className="sm:hidden">Bulk</span>
            </button>
            <button
              onClick={() => {
                setForAdmin(true);
                setCreateForm({...createForm, client_id: 'ADMIN', client_name: '', client_phone: '', client_email: '', client_company: '', title: '', description: ''});
                setShowCreateModal(true);
              }}
              className="px-3 md:px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm md:text-base"
            >
              <Bell size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Self Reminder</span>
              <span className="sm:hidden">Self</span>
            </button>
            <button
              onClick={() => {
                setForAdmin(false);
                setCreateForm({...createForm, client_id: '', client_name: '', client_phone: '', client_email: '', client_company: '', title: '', description: ''});
                setShowCreateModal(true);
              }}
              className="px-3 md:px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 flex items-center gap-2 text-sm md:text-base"
            >
              <Plus size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">New Reminder</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
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
          <div className="bg-slate-800 rounded-xl p-3 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex gap-1 md:gap-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 md:p-2 hover:bg-slate-700 rounded">
                  <ChevronLeft size={18} className="md:w-5 md:h-5" />
                </button>
                <button onClick={() => setCurrentMonth(new Date())} className="px-2 md:px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 text-xs md:text-sm">
                  Today
                </button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 md:p-2 hover:bg-slate-700 rounded">
                  <ChevronRight size={18} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-slate-700 rounded-lg overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={day} className="bg-slate-800 p-1 md:p-3 text-center text-[10px] md:text-sm text-slate-400 font-medium">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.charAt(0)}</span>
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
                      bg-slate-800 p-1 md:p-2 min-h-[60px] md:min-h-[100px] cursor-pointer transition-colors
                      ${isSelected ? 'ring-2 ring-orange-500' : 'hover:bg-slate-700'}
                      ${!isCurrentMonth ? 'opacity-50' : ''}
                    `}
                  >
                    <div className={`text-xs md:text-sm font-medium mb-0.5 md:mb-1 ${isSameDay(day, new Date()) ? 'text-orange-400' : 'text-slate-300'}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
                      {dayReminders.slice(0, 2).map((r, i) => (
                        <div
                          key={i}
                          className={`text-[9px] md:text-xs p-0.5 md:p-1 rounded truncate ${
                            r.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                            r.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          <span className="hidden md:inline">{r.title}</span>
                          <span className="md:hidden">•</span>
                        </div>
                      ))}
                      {dayReminders.length > 2 && (
                        <div className="text-[9px] md:text-xs text-slate-500">+{dayReminders.length - 2}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Day Details */}
            <div className="mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
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

                {/* Client Details - manual input instead of dropdown */}
                {!forAdmin && (
                  <div className="space-y-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <p className="text-sm font-medium text-orange-400">Client Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Name *</label>
                        <input
                          type="text"
                          value={createForm.client_name}
                          onChange={(e) => setCreateForm({...createForm, client_name: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-700 rounded-lg text-sm"
                          placeholder="Client name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          value={createForm.client_phone}
                          onChange={(e) => setCreateForm({...createForm, client_phone: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-700 rounded-lg text-sm"
                          placeholder="0821234567"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Email</label>
                        <input
                          type="email"
                          value={createForm.client_email}
                          onChange={(e) => setCreateForm({...createForm, client_email: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-700 rounded-lg text-sm"
                          placeholder="client@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Company</label>
                        <input
                          type="text"
                          value={createForm.client_company}
                          onChange={(e) => setCreateForm({...createForm, client_company: e.target.value})}
                          className="w-full px-3 py-2 bg-slate-700 rounded-lg text-sm"
                          placeholder="Company name"
                        />
                      </div>
                    </div>
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
                          {c.contact_name} {c.company_name ? `(${c.company_name})` : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">This reminder will be sent to your admin number</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Type <span className="text-slate-500 text-xs">(auto-fills template)</span></label>
                  <select
                    value={createForm.reminder_type}
                    onChange={(e) => handleTypeChange(e.target.value)}
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

                {/* Recurring Reminder Section */}
                <div className="border-t border-slate-600 pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="is_recurring"
                      checked={createForm.is_recurring}
                      onChange={(e) => setCreateForm({...createForm, is_recurring: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_recurring" className="text-sm font-medium text-orange-400">
                      Repeat this reminder (recurring)
                    </label>
                  </div>

                  {createForm.is_recurring && (
                    <div className="space-y-3 pl-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Repeat every</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min={1}
                              max={createForm.recurrence_pattern === 'hourly' ? 12 : 52}
                              value={createForm.recurrence_interval}
                              onChange={(e) => setCreateForm({...createForm, recurrence_interval: parseInt(e.target.value) || 1})}
                              className="w-20 px-2 py-1 bg-slate-700 rounded text-center"
                            />
                            <select
                              value={createForm.recurrence_pattern}
                              onChange={(e) => setCreateForm({...createForm, recurrence_pattern: e.target.value as any, recurrence_interval: 1})}
                              className="flex-1 px-2 py-1 bg-slate-700 rounded"
                            >
                              <option value="hourly">Hour(s)</option>
                              <option value="daily">Day(s)</option>
                              <option value="weekly">Week(s)</option>
                              <option value="monthly">Month(s)</option>
                              <option value="yearly">Year(s)</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">End date (optional)</label>
                          <input
                            type="date"
                            value={createForm.recurrence_end_date}
                            onChange={(e) => setCreateForm({...createForm, recurrence_end_date: e.target.value})}
                            className="w-full px-2 py-1 bg-slate-700 rounded"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Max occurrences (optional)</label>
                        <input
                          type="number"
                          min={1}
                          placeholder="e.g., 12"
                          value={createForm.max_recurrences}
                          onChange={(e) => setCreateForm({...createForm, max_recurrences: e.target.value})}
                          className="w-full px-2 py-1 bg-slate-700 rounded"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Next reminder will auto-generate when this one is sent via WhatsApp
                      </p>
                    </div>
                  )}
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
                  disabled={!createForm.title || !createForm.scheduled_at || (!forAdmin && (!createForm.client_name || !createForm.client_phone))}
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
                        <span className="text-sm">{c.contact_name} — {c.contact_phone || c.phone || 'No phone'}</span>
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
          {reminder.is_recurring && (
            <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded flex items-center gap-1">
              <RefreshCw size={10} />
              {reminder.recurrence_pattern} ({reminder.recurrence_count || 0} sent)
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
