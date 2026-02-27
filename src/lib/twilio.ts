import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

export const twilioClient = accountSid && authToken ? new Twilio(accountSid, authToken) : null;

interface SendWhatsAppParams {
  to: string;
  message: string;
}

export async function sendWhatsAppMessage(params: SendWhatsAppParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    if (!twilioClient) {
      return { success: false, error: 'Twilio not configured' };
    }

    if (!twilioWhatsAppNumber) {
      return { success: false, error: 'Twilio WhatsApp number not configured' };
    }

    // Format phone numbers for WhatsApp
    const formattedTo = formatPhoneNumber(params.to);
    const formattedFrom = `whatsapp:${twilioWhatsAppNumber}`;

    const message = await twilioClient.messages.create({
      body: params.message,
      from: formattedFrom,
      to: `whatsapp:${formattedTo}`
    });

    return {
      success: true,
      messageId: message.sid
    };

  } catch (error) {
    console.error('Twilio WhatsApp error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper to format phone numbers for WhatsApp
function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');

  // Add country code if missing (assuming South Africa)
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    cleaned = '27' + cleaned.substring(1);
  } else if (cleaned.length === 9 && !cleaned.startsWith('27')) {
    cleaned = '27' + cleaned;
  }

  return cleaned;
}

// Test function to verify Twilio setup
export async function testTwilioConnection(): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    if (!twilioClient) {
      return { success: false, error: 'Twilio client not initialized' };
    }

    // Get account info to test connection
    const account = await twilioClient.api.accounts(accountSid).fetch();
    
    return {
      success: true,
      details: {
        accountSid: account.sid,
        friendlyName: account.friendlyName,
        status: account.status
      }
    };

  } catch (error) {
    console.error('Twilio connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Connection test failed'
    };
  }
}

// Send different types of notifications
export const twilioNotifications = {
  async newClientRequest(data: {
    name: string;
    email: string;
    phone?: string;
    service: string;
    message?: string;
  }) {
    const message = `🆕 New Client Request

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
Service: ${data.service}
${data.message ? `Message: ${data.message}` : ''}

Time: ${new Date().toLocaleString()}`;

    return sendWhatsAppMessage({
      to: process.env.YOUR_WHATSAPP_NUMBER!,
      message
    });
  },

  async quoteStatusUpdate(data: {
    quoteId: string;
    clientName: string;
    status: string;
    amount?: string;
  }) {
    const message = `📋 Quote Update

Quote: ${data.quoteId}
Client: ${data.clientName}
Status: ${data.status}
${data.amount ? `Amount: R${data.amount}` : ''}

Time: ${new Date().toLocaleString()}`;

    return sendWhatsAppMessage({
      to: process.env.YOUR_WHATSAPP_NUMBER!,
      message
    });
  },

  async paymentReceived(data: {
    clientName: string;
    amount: string;
    quoteId: string;
    paymentMethod?: string;
  }) {
    const message = `💰 Payment Received!

Client: ${data.clientName}
Amount: R${data.amount}
Quote: ${data.quoteId}
Method: ${data.paymentMethod || 'Bank Transfer'}

Time: ${new Date().toLocaleString()}`;

    return sendWhatsAppMessage({
      to: process.env.YOUR_WHATSAPP_NUMBER!,
      message
    });
  },

  async projectMilestone(data: {
    clientName: string;
    projectName: string;
    milestone: string;
    nextSteps?: string;
  }) {
    const message = `🎯 Project Milestone

Client: ${data.clientName}
Project: ${data.projectName}
Milestone: ${data.milestone}
${data.nextSteps ? `Next Steps: ${data.nextSteps}` : ''}

Time: ${new Date().toLocaleString()}`;

    return sendWhatsAppMessage({
      to: process.env.YOUR_WHATSAPP_NUMBER!,
      message
    });
  }
};
