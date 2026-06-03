'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Users,
  CheckSquare,
  Bell,
  Calendar,
  Plus,
  Search,
  Phone,
  Building2,
  Briefcase,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  MoreVertical,
  Send,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  industry: string;
  status: string;
  created_at: string;
}

interface Task {
  id: string;
  client_id: string;
  task_name: string;
  task_description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reminder_frequency: 'daily' | 'weekly' | 'monthly';
  next_due_date: string;
  whatsapp_enabled: boolean;
  clients?: Client;
}

interface Service {
  id: string;
  name: string;
  category: string;
}

export default function SecretaryDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'tasks'>('overview');
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    todayReminders: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch clients
      const clientsRes = await fetch('/api/clients');
      const clientsData = await clientsRes.json();
      setClients(clientsData.clients || []);
      
      // Fetch tasks
      const tasksRes = await fetch('/api/client-tasks');
      const tasksData = await tasksRes.json();
      setTasks(tasksData.tasks || []);
      
      // Fetch services
      const servicesRes = await fetch('/api/services');
      const servicesData = await servicesRes.json();
      setServices(servicesData.services || []);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const pending = tasksData.tasks?.filter((t: Task) => t.status === 'pending').length || 0;
      const overdue = tasksData.tasks?.filter((t: Task) => 
        t.status !== 'completed' && t.next_due_date < today
      ).length || 0;
      
      setStats({
        totalClients: clientsData.total || 0,
        totalTasks: tasksData.total || 0,
        pendingTasks: pending,
        overdueTasks: overdue,
        todayReminders: tasksData.tasks?.filter((t: Task) => 
          t.next_due_date === today && t.whatsapp_enabled
        ).length || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markTaskComplete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/client-tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', completed_by: 'Admin' })
      });
      
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const sendReminder = async (taskId: string) => {
    try {
      const res = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, manual: true })
      });
      
      const data = await res.json();
      if (data.success) {
        alert('WhatsApp reminder sent!');
      } else {
        alert('Failed to send reminder: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(t =>
    t.task_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Header />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Admin
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">Secretary System</h1>
            </div>
            <p className="text-gray-400">Client work management & WhatsApp reminders</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard 
              icon={<Users className="w-5 h-5" />} 
              label="Clients" 
              value={stats.totalClients} 
              color="blue"
            />
            <StatCard 
              icon={<CheckSquare className="w-5 h-5" />} 
              label="Total Tasks" 
              value={stats.totalTasks} 
              color="purple"
            />
            <StatCard 
              icon={<Clock className="w-5 h-5" />} 
              label="Pending" 
              value={stats.pendingTasks} 
              color="yellow"
            />
            <StatCard 
              icon={<AlertCircle className="w-5 h-5" />} 
              label="Overdue" 
              value={stats.overdueTasks} 
              color="red"
            />
            <StatCard 
              icon={<Bell className="w-5 h-5" />} 
              label="Today" 
              value={stats.todayReminders} 
              color="green"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
              Overview
            </TabButton>
            <TabButton active={activeTab === 'clients'} onClick={() => setActiveTab('clients')}>
              Clients
            </TabButton>
            <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>
              Tasks
            </TabButton>
          </div>

          {/* Search & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search clients, tasks, industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClientModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Client</span>
              </button>
              <button
                onClick={() => setShowTaskModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewTab 
                  tasks={filteredTasks.slice(0, 10)} 
                  onComplete={markTaskComplete}
                  onRemind={sendReminder}
                />
              )}
              {activeTab === 'clients' && (
                <ClientsTab 
                  clients={filteredClients}
                  onRefresh={fetchData}
                />
              )}
              {activeTab === 'tasks' && (
                <TasksTab 
                  tasks={filteredTasks}
                  onComplete={markTaskComplete}
                  onRemind={sendReminder}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Client Modal */}
      {showClientModal && (
        <AddClientModal 
          onClose={() => setShowClientModal(false)} 
          onSuccess={() => { fetchData(); setShowClientModal(false); }}
        />
      )}

      {/* Add Task Modal */}
      {showTaskModal && (
        <AddTaskModal 
          clients={clients}
          services={services}
          onClose={() => setShowTaskModal(false)} 
          onSuccess={() => { fetchData(); setShowTaskModal(false); }}
        />
      )}

      <Footer />
    </div>
  );
}

// --- Subcomponents ---

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
  }[color];

  return (
    <div className={`p-4 rounded-xl border ${colorClasses}`}>
      <div className="flex items-center gap-2 mb-2 opacity-80">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium transition-colors relative ${
        active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {children}
      {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />}
    </button>
  );
}

function OverviewTab({ tasks, onComplete, onRemind }: { tasks: Task[]; onComplete: (id: string) => void; onRemind: (id: string) => void }) {
  const today = new Date().toISOString().split('T')[0];
  const dueToday = tasks.filter(t => t.next_due_date === today);
  const overdue = tasks.filter(t => t.next_due_date < today && t.status !== 'completed');

  return (
    <div className="space-y-6">
      {/* Due Today */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-400" />
          Due Today ({dueToday.length})
        </h3>
        {dueToday.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tasks due today!</p>
        ) : (
          <div className="space-y-3">
            {dueToday.map(task => (
              <TaskRow key={task.id} task={task} onComplete={onComplete} onRemind={onRemind} />
            ))}
          </div>
        )}
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Overdue ({overdue.length})
          </h3>
          <div className="space-y-3">
            {overdue.map(task => (
              <TaskRow key={task.id} task={task} onComplete={onComplete} onRemind={onRemind} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskRow({ task, onComplete, onRemind }: { task: Task; onComplete: (id: string) => void; onRemind: (id: string) => void }) {
  const isOverdue = task.next_due_date < new Date().toISOString().split('T')[0] && task.status !== 'completed';
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      isOverdue ? 'bg-red-500/5 border-red-500/20' : 'bg-gray-800/50 border-gray-700/50'
    }`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded ${
            task.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
            task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>{task.priority}</span>
          <span className="text-xs text-gray-500">{task.reminder_frequency}</span>
        </div>
        <p className="text-white font-medium truncate">{task.task_name}</p>
        <p className="text-sm text-gray-400">{task.clients?.name} • {task.clients?.company_name}</p>
        {task.task_description && (
          <p className="text-sm text-gray-500 mt-1 truncate">{task.task_description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        {task.whatsapp_enabled && (
          <button
            onClick={() => onRemind(task.id)}
            className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
            title="Send WhatsApp reminder"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
        {task.status !== 'completed' && (
          <button
            onClick={() => onComplete(task.id)}
            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
            title="Mark complete"
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function ClientsTab({ clients, onRefresh }: { clients: Client[]; onRefresh: () => void }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Client</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Company</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Industry</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Contact</th>
            <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {clients.map(client => (
            <tr key={client.id} className="hover:bg-gray-800/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-medium text-sm">
                    {client.name.charAt(0)}
                  </div>
                  <span className="text-white font-medium">{client.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-300">{client.company_name || '-'}</td>
              <td className="px-4 py-3">
                <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">{client.industry}</span>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-400">{client.email}</div>
                <div className="text-sm text-gray-500">{client.phone}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  client.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  client.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{client.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TasksTab({ tasks, onComplete, onRemind }: { tasks: Task[]; onComplete: (id: string) => void; onRemind: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskRow key={task.id} task={task} onComplete={onComplete} onRemind={onRemind} />
      ))}
    </div>
  );
}

// --- Modals ---

function AddClientModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    industry: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  const industries = [
    'Construction', 'Retail', 'Technology', 'Healthcare', 
    'Finance', 'Education', 'Hospitality', 'Manufacturing',
    'Real Estate', 'Transportation', 'Agriculture', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        onSuccess();
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      alert('Failed to create client');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Add New Client" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name *" value={formData.name} onChange={v => setFormData({...formData, name: v})} required />
        <Input label="Company Name" value={formData.company_name} onChange={v => setFormData({...formData, company_name: v})} />
        <Select 
          label="Industry *" 
          value={formData.industry} 
          onChange={v => setFormData({...formData, industry: v})}
          options={industries.map(i => ({ value: i, label: i }))}
          required 
        />
        <Input label="Email" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
        <Input label="Phone / WhatsApp" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} placeholder="e.g., 0821234567" />
        <TextArea label="Notes" value={formData.notes} onChange={v => setFormData({...formData, notes: v})} />
        
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl transition-colors disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Client'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AddTaskModal({ clients, services, onClose, onSuccess }: { clients: Client[]; services: Service[]; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    client_id: '',
    service_id: '',
    task_name: '',
    task_description: '',
    reminder_frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    reminder_day: 1,
    reminder_time: '09:00',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    whatsapp_enabled: true,
    next_due_date: ''
  });
  const [saving, setSaving] = useState(false);

  // Update task name when service selected
  useEffect(() => {
    if (formData.service_id) {
      const service = services.find(s => s.id === formData.service_id);
      if (service && !formData.task_name) {
        setFormData(prev => ({ ...prev, task_name: service.name }));
      }
    }
  }, [formData.service_id, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/client-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        onSuccess();
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      alert('Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Add New Task" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select 
          label="Client *" 
          value={formData.client_id} 
          onChange={v => setFormData({...formData, client_id: v})}
          options={clients.map(c => ({ value: c.id, label: `${c.name} ${c.company_name ? `(${c.company_name})` : ''}` }))}
          required 
        />
        
        <Select 
          label="Service (optional)" 
          value={formData.service_id} 
          onChange={v => setFormData({...formData, service_id: v})}
          options={[{ value: '', label: 'Custom task...' }, ...services.map(s => ({ value: s.id, label: `${s.name} (${s.category})` }))]}
        />
        
        <Input label="Task Name *" value={formData.task_name} onChange={v => setFormData({...formData, task_name: v})} required />
        <TextArea label="Description" value={formData.task_description} onChange={v => setFormData({...formData, task_description: v})} />
        
        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Frequency *" 
            value={formData.reminder_frequency} 
            onChange={v => setFormData({...formData, reminder_frequency: v as any})}
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' }
            ]}
            required 
          />
          <Select 
            label="Priority" 
            value={formData.priority} 
            onChange={v => setFormData({...formData, priority: v as any})}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' }
            ]}
          />
        </div>

        {formData.reminder_frequency === 'weekly' && (
          <Select 
            label="Day of Week" 
            value={String(formData.reminder_day)} 
            onChange={v => setFormData({...formData, reminder_day: parseInt(v)})}
            options={[
              { value: '0', label: 'Sunday' },
              { value: '1', label: 'Monday' },
              { value: '2', label: 'Tuesday' },
              { value: '3', label: 'Wednesday' },
              { value: '4', label: 'Thursday' },
              { value: '5', label: 'Friday' },
              { value: '6', label: 'Saturday' }
            ]}
          />
        )}
        
        {formData.reminder_frequency === 'monthly' && (
          <Select 
            label="Day of Month" 
            value={String(formData.reminder_day)} 
            onChange={v => setFormData({...formData, reminder_day: parseInt(v)})}
            options={Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}${['st','nd','rd'][((i+1)%10)-1] || 'th'}` }))}
          />
        )}
        
        <Input 
          label="Reminder Time" 
          type="time" 
          value={formData.reminder_time} 
          onChange={v => setFormData({...formData, reminder_time: v})} 
        />
        
        <Input 
          label="First Due Date" 
          type="date" 
          value={formData.next_due_date} 
          onChange={v => setFormData({...formData, next_due_date: v})} 
        />
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.whatsapp_enabled}
            onChange={e => setFormData({...formData, whatsapp_enabled: e.target.checked})}
            className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-green-500 focus:ring-green-500"
          />
          <span className="text-gray-300">Enable WhatsApp reminders</span>
        </label>
        
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl transition-colors disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// --- Shared Components ---

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, type = 'text', value, onChange, required, placeholder }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 resize-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500/50"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
