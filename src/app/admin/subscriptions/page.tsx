'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, parseISO, addDays, isPast, isToday } from 'date-fns';
import { 
  CreditCard, ArrowLeft, Users, AlertCircle, CheckCircle, 
  Clock, DollarSign, Send, Bell, RefreshCw, Search,
  Phone, Mail, FileText, TrendingUp
} from 'lucide-react';

interface Subscription {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name: string;
  plan_type: string;
  status: 'active' | 'cancelled' | 'paused' | 'past_due';
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  next_billing_date: string;
  last_payment_date: string;
  total_paid: number;
  created_at: string;
}

interface UnpaidInvoice {
  id: string;
  invoice_number: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name: string;
  amount: number;
  due_date: string;
  status: 'sent' | 'overdue' | 'paid';
  days_overdue: number;
}

export default function SubscriptionsAdmin() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState<UnpaidInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch subscriptions
      const subsRes = await fetch('/api/subscriptions');
      const subsData = await subsRes.json();
      setSubscriptions(subsData.subscriptions || []);

      // Fetch unpaid invoices
      const invRes = await fetch('/api/invoices?status=sent,overdue&unpaid=true');
      const invData = await invRes.json();
      
      // Calculate days overdue and add to data
      const processedInvoices = (invData.invoices || []).map((inv: any) => {
        const dueDate = parseISO(inv.due_date);
        const today = new Date();
        const daysOverdue = isPast(dueDate) && !isToday(dueDate) 
          ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        return { ...inv, days_overdue: daysOverdue };
      });
      
      setUnpaidInvoices(processedInvoices);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendPaymentReminder = async (invoice: UnpaidInvoice, method: 'whatsapp' | 'email' = 'whatsapp') => {
    try {
      const daysText = invoice.days_overdue > 0 
        ? `${invoice.days_overdue} days overdue` 
        : 'due soon';
      
      const message = `Hi ${invoice.client_name},\n\n` +
        `This is a friendly reminder about your unpaid invoice:\n\n` +
        `📄 Invoice: ${invoice.invoice_number}\n` +
        `💰 Amount: R${invoice.amount.toFixed(2)}\n` +
        `📅 Status: ${daysText}\n` +
        `🏢 Company: ${invoice.company_name || 'N/A'}\n\n` +
        `Please make payment at your earliest convenience.\n` +
        `Bank: Standard Bank\n` +
        `Acc: 10268731932\n` +
        `Branch: 051001\n\n` +
        `Thank you,\nBreed Industries`;

      if (method === 'whatsapp' && invoice.client_phone) {
        await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: invoice.client_phone,
            message
          })
        });
      } else if (method === 'email' && invoice.client_email) {
        await fetch('/api/notifications/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: invoice.client_email,
            subject: `Payment Reminder - Invoice ${invoice.invoice_number}`,
            message
          })
        });
      }

      // Log the reminder
      await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: invoice.client_id,
          title: `Payment reminder for ${invoice.invoice_number}`,
          description: `Sent ${method} reminder for R${invoice.amount} - ${daysText}`,
          reminder_type: 'payment_due',
          scheduled_at: new Date().toISOString(),
          phone_number: invoice.client_phone,
          message_text: message,
          auto_send_whatsapp: false
        })
      });

      alert(`Payment reminder sent via ${method}!`);
    } catch (err) {
      alert('Failed to send reminder');
    }
  };

  const bulkSendReminders = async () => {
    for (const invoiceId of selectedInvoices) {
      const invoice = unpaidInvoices.find(i => i.id === invoiceId);
      if (invoice) {
        await sendPaymentReminder(invoice, 'whatsapp');
      }
    }
    setShowReminderModal(false);
    setSelectedInvoices([]);
    alert('Bulk reminders sent!');
  };

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    pastDue: subscriptions.filter(s => s.status === 'past_due').length,
    monthlyRevenue: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (s.frequency === 'monthly' ? s.amount : s.amount / 12), 0),
    unpaidTotal: unpaidInvoices.reduce((sum, i) => sum + i.amount, 0),
    overdueCount: unpaidInvoices.filter(i => i.days_overdue > 0).length
  };

  const filteredInvoices = unpaidInvoices.filter(inv => 
    (filterStatus === 'all' || inv.status === filterStatus) &&
    (inv.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     inv.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     inv.company_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors text-sm md:text-base"
            >
              <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" />
              Back to Admin
            </Link>
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Subscriptions & Billing</h1>
            </div>
            <p className="text-sm md:text-base text-gray-400">Manage subscriptions, track payments, and send reminders</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <StatCard 
              icon={<Users className="w-5 h-5" />} 
              label="Active Subs" 
              value={stats.active}
              color="green"
            />
            <StatCard 
              icon={<DollarSign className="w-5 h-5" />} 
              label="Monthly Revenue" 
              value={`R${stats.monthlyRevenue.toFixed(0)}`}
              color="blue"
            />
            <StatCard 
              icon={<AlertCircle className="w-5 h-5" />} 
              label="Overdue Invoices" 
              value={stats.overdueCount}
              color="red"
            />
            <StatCard 
              icon={<FileText className="w-5 h-5" />} 
              label="Unpaid Total" 
              value={`R${stats.unpaidTotal.toFixed(0)}`}
              color="yellow"
            />
          </div>

          {/* Unpaid Invoices Section */}
          <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
              <div>
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <AlertCircle className="text-red-400 w-5 h-5" />
                  Unpaid Invoices
                </h2>
                <p className="text-xs md:text-sm text-slate-400">
                  {unpaidInvoices.length} unpaid, {stats.overdueCount} overdue
                </p>
              </div>
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={() => setShowReminderModal(true)}
                  disabled={selectedInvoices.length === 0}
                  className="px-3 md:px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2 text-sm md:text-base"
                >
                  <Bell size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="hidden sm:inline">Bulk Remind ({selectedInvoices.length})</span>
                  <span className="sm:hidden">Remind ({selectedInvoices.length})</span>
                </button>
                <button
                  onClick={fetchData}
                  className="px-3 md:px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 flex items-center gap-2"
                >
                  <RefreshCw size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by client, invoice #..."
                  className="w-full pl-10 pr-3 py-2 bg-slate-700 rounded-lg"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-slate-700 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Invoices List */}
            <div className="space-y-2">
              {filteredInvoices.map(invoice => (
                <div 
                  key={invoice.id} 
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    invoice.days_overdue > 7 ? 'bg-red-500/10 border border-red-500/20' :
                    invoice.days_overdue > 0 ? 'bg-yellow-500/10 border border-yellow-500/20' :
                    'bg-slate-700/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedInvoices.includes(invoice.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInvoices([...selectedInvoices, invoice.id]);
                      } else {
                        setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText size={16} className="text-slate-400" />
                      <span className="font-medium">{invoice.invoice_number}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        invoice.days_overdue > 0 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {invoice.days_overdue > 0 ? `${invoice.days_overdue} days overdue` : 'Due soon'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 flex gap-4">
                      <span>{invoice.client_name}</span>
                      {invoice.company_name && <span>({invoice.company_name})</span>}
                      <span className="text-white">R{invoice.amount.toFixed(2)}</span>
                      <span>Due: {format(parseISO(invoice.due_date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {invoice.client_phone && (
                      <button
                        onClick={() => sendPaymentReminder(invoice, 'whatsapp')}
                        className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                        title="Send WhatsApp reminder"
                      >
                        <Phone size={16} />
                      </button>
                    )}
                    {invoice.client_email && (
                      <button
                        onClick={() => sendPaymentReminder(invoice, 'email')}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                        title="Send email reminder"
                      >
                        <Mail size={16} />
                      </button>
                    )}
                    <Link
                      href={`/admin/invoices/${invoice.id}`}
                      className="p-2 bg-slate-600 rounded-lg hover:bg-slate-500"
                    >
                      <FileText size={16} />
                    </Link>
                  </div>
                </div>
              ))}
              {filteredInvoices.length === 0 && !loading && (
                <p className="text-slate-500 text-center py-8">No unpaid invoices found</p>
              )}
            </div>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-slate-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="text-green-400" />
                  Active Subscriptions
                </h2>
                <p className="text-sm text-slate-400">
                  {stats.active} active, {stats.pastDue} past due
                </p>
              </div>
              <Link
                href="/admin/subscriptions/new"
                className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <CreditCard size={18} />
                New Subscription
              </Link>
            </div>

            <div className="space-y-2">
              {subscriptions
                .filter(s => s.status === 'active' || s.status === 'past_due')
                .map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{sub.client_name}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded capitalize">
                        {sub.plan_type}
                      </span>
                      {sub.status === 'past_due' && (
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                          Past Due
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-400 flex gap-4">
                      <span>R{sub.amount}/{sub.frequency}</span>
                      <span>Next billing: {format(parseISO(sub.next_billing_date), 'MMM d, yyyy')}</span>
                      <span>Total paid: R{sub.total_paid?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/crm/${sub.client_id}`}
                      className="px-3 py-1 bg-slate-600 rounded text-sm hover:bg-slate-500"
                    >
                      View Client
                    </Link>
                    <button
                      onClick={() => {
                        // Cancel subscription
                        if (confirm('Cancel this subscription?')) {
                          fetch(`/api/subscriptions/${sub.id}`, { method: 'DELETE' })
                            .then(() => fetchData());
                        }
                      }}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
              {subscriptions.filter(s => s.status === 'active' || s.status === 'past_due').length === 0 && (
                <p className="text-slate-500 text-center py-8">No active subscriptions</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bulk Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Send Bulk Reminders</h3>
            <p className="text-slate-400 mb-4">
              Send WhatsApp payment reminders to {selectedInvoices.length} selected clients?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReminderModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={bulkSendReminders}
                className="flex-1 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Send Reminders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  color: 'green' | 'blue' | 'red' | 'yellow';
}) {
  const colors = {
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    red: 'bg-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4">
      <div className={`w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
