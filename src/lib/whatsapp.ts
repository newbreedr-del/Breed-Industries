// WhatsApp Business API integration
// This will use the official WhatsApp Cloud API

interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: 'body' | 'header' | 'footer';
      parameters: Array<{
        type: 'text' | 'image' | 'document' | 'video';
        text?: string;
        image?: {
          link: string;
        };
        document?: {
          link: string;
          filename: string;
        };
        video?: {
          link: string;
        };
      }>;
    }>;
  };
}

interface WhatsAppResponse {
  messaging_product: 'whatsapp';
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
    status: string;
  }>;
}

interface SendWhatsAppParams {
  to: string;
  templateName: string;
  languageCode: string;
  components?: Array<{
    type: 'body' | 'header' | 'footer';
    parameters: Array<{
      type: 'text' | 'image' | 'document' | 'video';
      text?: string;
      image?: { link: string };
      document?: { link: string; filename: string };
      video?: { link: string };
    }>;
  }>;
}

export async function sendWhatsAppMessage(params: SendWhatsAppParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const version = process.env.WHATSAPP_API_VERSION || 'v18.0';

    if (!accessToken || !phoneNumberId) {
      console.error('WhatsApp credentials not configured');
      return { success: false, error: 'WhatsApp credentials not configured' };
    }

    const message: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: params.to.replace(/[^\d]/g, ''), // Remove non-digits
      type: 'template',
      template: {
        name: params.templateName,
        language: {
          code: params.languageCode
        }
      }
    };

    // Add components if provided
    if (params.components && params.components.length > 0) {
      message.template.components = params.components;
    }

    const response = await fetch(
      `https://graph.facebook.com/${version}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('WhatsApp API error:', errorData);
      return {
        success: false,
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data: WhatsAppResponse = await response.json();

    if (data.messages && data.messages.length > 0) {
      return {
        success: true,
        messageId: data.messages[0].id
      };
    } else {
      return {
        success: false,
        error: 'No message ID returned from WhatsApp API'
      };
    }

  } catch (error) {
    console.error('WhatsApp send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Function to verify webhook (for receiving messages)
export function verifyWhatsAppWebhook(
  mode: string,
  token: string,
  challenge: string
): { valid: boolean; response?: string } {
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    return { valid: true, response: challenge };
  }

  return { valid: false };
}

// Function to process incoming webhook messages
export async function processWhatsAppWebhook(data: any): Promise<{
  processed: boolean;
  messages?: any[];
}> {
  try {
    if (data.object !== 'whatsapp_business_account') {
      return { processed: false };
    }

    const messages: any[] = [];

    for (const entry of data.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'messages') {
          for (const message of change.value.messages || []) {
            // Process incoming message
            messages.push({
              from: message.from,
              id: message.id,
              timestamp: message.timestamp,
              type: message.type,
              text: message.text?.body,
              // Add other message types as needed
            });
          }
        }
      }
    }

    return { processed: true, messages };
  } catch (error) {
    console.error('Webhook processing error:', error);
    return { processed: false };
  }
}

// Template validation helper
export function validateTemplate(templateName: string): boolean {
  const approvedTemplates = [
    'new_client_request',
    'quote_status_update',
    'payment_received',
    'project_milestone',
    'appointment_reminder',
    'follow_up_message'
  ];

  return approvedTemplates.includes(templateName);
}

// Rate limiting helper
const messageTimestamps = new Map<string, number[]>();

export function checkRateLimit(phoneNumber: string, maxMessages: number = 10, timeWindow: number = 60000): boolean {
  const now = Date.now();
  const timestamps = messageTimestamps.get(phoneNumber) || [];

  // Remove old timestamps
  const recentTimestamps = timestamps.filter(timestamp => now - timestamp < timeWindow);

  // Check if we've exceeded the limit
  if (recentTimestamps.length >= maxMessages) {
    return false;
  }

  // Add current timestamp
  recentTimestamps.push(now);
  messageTimestamps.set(phoneNumber, recentTimestamps);

  return true;
}

// Helper to format phone numbers
export function formatPhoneNumber(phoneNumber: string): string {
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
