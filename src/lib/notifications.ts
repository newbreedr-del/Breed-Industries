// Notification logging and management system

interface NotificationLog {
  id?: string;
  type: string;
  data: any;
  recipient: string;
  status: 'pending' | 'sent' | 'failed' | 'delivered' | 'read';
  messageId?: string;
  error?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// In-memory storage for development (replace with database in production)
const notificationLogs = new Map<string, NotificationLog>();

export async function logNotification(notification: Partial<NotificationLog>): Promise<string> {
  const id = notification.id || generateId();
  const now = new Date();
  
  const logEntry: NotificationLog = {
    id,
    type: notification.type!,
    data: notification.data!,
    recipient: notification.recipient!,
    status: notification.status || 'pending',
    messageId: notification.messageId,
    error: notification.error,
    createdAt: notification.createdAt || now,
    updatedAt: now
  };

  notificationLogs.set(id, logEntry);
  
  // TODO: Save to database
  // await db.notifications.create({ data: logEntry });
  
  return id;
}

export async function updateNotificationStatus(
  id: string,
  status: NotificationLog['status'],
  updates?: Partial<NotificationLog>
): Promise<void> {
  const existing = notificationLogs.get(id);
  if (!existing) {
    throw new Error(`Notification with id ${id} not found`);
  }

  const updated: NotificationLog = {
    ...existing,
    status,
    ...updates,
    updatedAt: new Date()
  };

  notificationLogs.set(id, updated);
  
  // TODO: Update in database
  // await db.notifications.update({ where: { id }, data: updated });
}

export async function getNotifications(
  type?: string,
  limit: number = 10,
  offset: number = 0
): Promise<NotificationLog[]> {
  let logs = Array.from(notificationLogs.values());
  
  // Filter by type if specified
  if (type) {
    logs = logs.filter(log => log.type === type);
  }
  
  // Sort by creation date (newest first)
  logs.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  
  // Apply pagination
  return logs.slice(offset, offset + limit);
}

export async function getNotificationById(id: string): Promise<NotificationLog | null> {
  return notificationLogs.get(id) || null;
}

export async function getNotificationStats(): Promise<{
  total: number;
  sent: number;
  failed: number;
  pending: number;
  delivered: number;
  read: number;
}> {
  const logs = Array.from(notificationLogs.values());
  
  return {
    total: logs.length,
    sent: logs.filter(log => log.status === 'sent').length,
    failed: logs.filter(log => log.status === 'failed').length,
    pending: logs.filter(log => log.status === 'pending').length,
    delivered: logs.filter(log => log.status === 'delivered').length,
    read: logs.filter(log => log.status === 'read').length
  };
}

// Helper function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Notification type definitions
export const NOTIFICATION_TYPES = {
  NEW_CLIENT_REQUEST: 'new_client_request',
  QUOTE_STATUS_UPDATE: 'quote_status_update',
  PAYMENT_RECEIVED: 'payment_received',
  PROJECT_MILESTONE: 'project_milestone',
  APPOINTMENT_REMINDER: 'appointment_reminder',
  FOLLOW_UP_MESSAGE: 'follow_up_message',
  SYSTEM_ALERT: 'system_alert'
} as const;

// Notification templates for different types
export const NOTIFICATION_TEMPLATES = {
  [NOTIFICATION_TYPES.NEW_CLIENT_REQUEST]: {
    templateName: 'new_client_request',
    requiredFields: ['name', 'email', 'phone', 'service'],
    optionalFields: ['message']
  },
  [NOTIFICATION_TYPES.QUOTE_STATUS_UPDATE]: {
    templateName: 'quote_status_update',
    requiredFields: ['quoteId', 'clientName', 'status'],
    optionalFields: ['amount', 'updatedAt']
  },
  [NOTIFICATION_TYPES.PAYMENT_RECEIVED]: {
    templateName: 'payment_received',
    requiredFields: ['clientName', 'amount', 'quoteId'],
    optionalFields: ['paymentMethod', 'date']
  },
  [NOTIFICATION_TYPES.PROJECT_MILESTONE]: {
    templateName: 'project_milestone',
    requiredFields: ['clientName', 'projectName', 'milestone'],
    optionalFields: ['completionDate', 'nextSteps']
  }
} as const;

// Validation helper
export function validateNotificationData(
  type: string,
  data: any
): { valid: boolean; missingFields?: string[] } {
  const template = NOTIFICATION_TEMPLATES[type as keyof typeof NOTIFICATION_TEMPLATES];
  
  if (!template) {
    return { valid: false, missingFields: ['Invalid notification type'] };
  }

  const missingFields = template.requiredFields.filter(field => !data[field]);
  
  return {
    valid: missingFields.length === 0,
    missingFields: missingFields.length > 0 ? missingFields : undefined
  };
}

// Cleanup old notifications (older than 30 days)
export async function cleanupOldNotifications(): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  let deletedCount = 0;
  
  for (const [id, log] of notificationLogs.entries()) {
    if (log.createdAt && log.createdAt < thirtyDaysAgo) {
      notificationLogs.delete(id);
      deletedCount++;
    }
  }
  
  // TODO: Also cleanup from database
  // await db.notifications.deleteMany({
  //   where: { createdAt: { lt: thirtyDaysAgo } }
  // });
  
  return deletedCount;
}

// Retry failed notifications
export async function retryFailedNotifications(maxRetries: number = 3): Promise<number> {
  const failedLogs = Array.from(notificationLogs.values())
    .filter(log => log.status === 'failed')
    .filter(log => {
      // Count previous attempts (you'd store this in the log)
      const retryCount = log.data?.retryCount || 0;
      return retryCount < maxRetries;
    });

  let retriedCount = 0;

  for (const log of failedLogs) {
    try {
      // Import here to avoid circular dependency
      const { sendWhatsAppMessage } = await import('./whatsapp');
      
      // Update retry count
      const updatedData = { ...log.data, retryCount: (log.data?.retryCount || 0) + 1 };
      
      // Attempt to resend
      const result = await sendWhatsAppMessage({
        to: log.recipient,
        templateName: NOTIFICATION_TEMPLATES[log.type as keyof typeof NOTIFICATION_TEMPLATES]?.templateName || log.type,
        languageCode: 'en',
        components: buildComponentsFromData(log.type, updatedData)
      });

      if (result.success) {
        await updateNotificationStatus(log.id!, 'sent', {
          messageId: result.messageId,
          data: updatedData
        });
        retriedCount++;
      } else {
        await updateNotificationStatus(log.id!, 'failed', {
          error: result.error,
          data: updatedData
        });
      }
    } catch (error) {
      await updateNotificationStatus(log.id!, 'failed', {
        error: error instanceof Error ? error.message : 'Unknown error during retry'
      });
    }
  }

  return retriedCount;
}

// Helper to build WhatsApp components from notification data
function buildComponentsFromData(type: string, data: any): any[] {
  const template = NOTIFICATION_TEMPLATES[type as keyof typeof NOTIFICATION_TEMPLATES];
  if (!template) return [];

  // This would be customized based on your template structure
  return [{
    type: 'body',
    parameters: template.requiredFields.map(field => ({
      type: 'text',
      text: data[field] || 'N/A'
    }))
  }];
}
