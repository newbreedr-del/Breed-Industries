'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  data: any;
  recipient: string;
  status: 'pending' | 'sent' | 'failed' | 'delivered' | 'read';
  messageId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotificationsAdmin() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0
  });

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications${filter !== 'all' ? `?type=${filter}` : ''}`);
      const data = await response.json();
      
      setNotifications(data.notifications || []);
      
      // Calculate stats
      const notificationsList = data.notifications || [];
      setStats({
        total: notificationsList.length,
        sent: notificationsList.filter((n: Notification) => n.status === 'sent').length,
        failed: notificationsList.filter((n: Notification) => n.status === 'failed').length,
        pending: notificationsList.filter((n: Notification) => n.status === 'pending').length
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'delivered':
        return <Bell className="w-4 h-4 text-blue-500" />;
      case 'read':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'delivered':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'read':
        return 'bg-green-600/10 text-green-300 border-green-600/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'new_client_request':
        return 'New Client Request';
      case 'quote_status_update':
        return 'Quote Status Update';
      case 'payment_received':
        return 'Payment Received';
      case 'project_milestone':
        return 'Project Milestone';
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-color-bg-deep text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">WhatsApp Notifications</h1>
          <button
            onClick={fetchNotifications}
            className="flex items-center gap-2 px-4 py-2 bg-color-accent text-white rounded-lg hover:bg-color-accent/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-color-accent" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-400">Total</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.sent}</p>
                <p className="text-sm text-gray-400">Sent</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.failed}</p>
                <p className="text-sm text-gray-400">Failed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-color-bg-surface border border-color-border rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Types</option>
            <option value="new_client_request">New Client Requests</option>
            <option value="quote_status_update">Quote Updates</option>
            <option value="payment_received">Payments</option>
            <option value="project_milestone">Project Milestones</option>
          </select>
        </div>

        {/* Notifications List */}
        <div className="glass-card">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-color-border">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-6 hover:bg-color-bg-surface/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(notification.status)}
                        <span className="font-semibold">{getNotificationTypeLabel(notification.type)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(notification.status)}`}>
                          {notification.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-400 mb-2">
                        <p>To: {notification.recipient}</p>
                        <p>Created: {formatDate(notification.createdAt)}</p>
                        {notification.updatedAt !== notification.createdAt && (
                          <p>Updated: {formatDate(notification.updatedAt)}</p>
                        )}
                      </div>

                      {/* Notification Data Preview */}
                      <div className="text-sm text-gray-300">
                        {notification.type === 'new_client_request' && (
                          <p>
                            <strong>{notification.data.name}</strong> ({notification.data.email}) 
                            {notification.data.service && ` - ${notification.data.service}`}
                          </p>
                        )}
                        {notification.type === 'quote_status_update' && (
                          <p>
                            Quote <strong>{notification.data.quoteId}</strong> for {notification.data.clientName} 
                            - {notification.data.status}
                            {notification.data.amount && ` - R${notification.data.amount}`}
                          </p>
                        )}
                        {notification.type === 'payment_received' && (
                          <p>
                            <strong>{notification.data.clientName}</strong> paid R{notification.data.amount} 
                            for quote {notification.data.quoteId}
                          </p>
                        )}
                        {notification.type === 'project_milestone' && (
                          <p>
                            <strong>{notification.data.projectName}</strong> - {notification.data.milestone}
                          </p>
                        )}
                      </div>

                      {notification.error && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                          Error: {notification.error}
                        </div>
                      )}
                    </div>

                    {notification.messageId && (
                      <div className="ml-4">
                        <span className="text-xs text-gray-500">ID: {notification.messageId}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
