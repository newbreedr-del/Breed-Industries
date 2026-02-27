import { NextRequest, NextResponse } from 'next/server';
import { verifyWhatsAppWebhook, processWhatsAppWebhook } from '@/lib/whatsapp';
import { updateNotificationStatus } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verification = verifyWhatsAppWebhook(mode || '', token || '', challenge || '');

  if (verification.valid && verification.response) {
    return new NextResponse(verification.response, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid verification' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await processWhatsAppWebhook(data);

    if (result.processed && result.messages) {
      // Process status updates for sent messages
      for (const message of result.messages) {
        // This would handle message status updates (delivered, read, etc.)
        // You'll need to map incoming status updates to your notification logs
        console.log('WhatsApp webhook message:', message);
      }
    }

    return NextResponse.json({ status: 'received' });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
