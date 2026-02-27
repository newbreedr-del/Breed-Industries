// Easy-to-use notification system for triggering WhatsApp messages

export async function notifyClientRequest(data: {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message?: string;
}) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'new_client_request',
        data
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Failed to send client request notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function notifyQuoteStatus(data: {
  quoteId: string;
  clientName: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  amount?: string;
}) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'quote_status_update',
        data: {
          ...data,
          updatedAt: new Date().toLocaleString()
        }
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Failed to send quote status notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function notifyPaymentReceived(data: {
  clientName: string;
  amount: string;
  quoteId: string;
  paymentMethod?: string;
}) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'payment_received',
        data: {
          ...data,
          date: new Date().toLocaleDateString(),
          paymentMethod: data.paymentMethod || 'Bank Transfer'
        }
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Failed to send payment notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function notifyProjectMilestone(data: {
  clientName: string;
  projectName: string;
  milestone: string;
  completionDate?: string;
  nextSteps?: string;
}) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'project_milestone',
        data: {
          ...data,
          completionDate: data.completionDate || new Date().toLocaleDateString(),
          nextSteps: data.nextSteps || 'Continuing with next phase'
        }
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Failed to send milestone notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Server-side version (for use in API routes)
export async function notifyServer(type: string, data: any, recipient?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        data,
        recipient
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Failed to send server notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
