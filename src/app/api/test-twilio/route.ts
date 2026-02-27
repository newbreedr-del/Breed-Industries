import { NextResponse } from 'next/server';
import { testTwilioConnection, sendWhatsAppMessage } from '@/lib/twilio';

export async function GET() {
  try {
    // Test Twilio connection
    const connectionTest = await testTwilioConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Twilio connection failed',
        details: connectionTest.error
      });
    }

    // Test sending a message
    const messageTest = await sendWhatsAppMessage({
      to: process.env.YOUR_WHATSAPP_NUMBER || '27xxxxxxxxxx',
      message: '🧪 Twilio WhatsApp Test

This is a test message from Breed Industries website.
If you receive this, WhatsApp notifications are working!

Time: ' + new Date().toLocaleString()
    });

    return NextResponse.json({
      success: true,
      connection: connectionTest.details,
      message: messageTest
    });

  } catch (error) {
    console.error('Twilio test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    });
  }
}
