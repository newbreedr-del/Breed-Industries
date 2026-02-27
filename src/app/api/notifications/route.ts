import { NextRequest, NextResponse } from 'next/server';
import { twilioNotifications } from '@/lib/twilio';
import { logNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const { type, data, recipient } = await request.json();

    // Validate required fields
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      );
    }

    // Log the notification attempt
    const logId = await logNotification({
      type,
      data,
      recipient: recipient || process.env.YOUR_WHATSAPP_NUMBER,
      status: 'pending'
    });

    // Send WhatsApp message using Twilio
    let messageResult;
    switch (type) {
      case 'new_client_request':
        messageResult = await twilioNotifications.newClientRequest(data);
        break;

      case 'quote_status_update':
        messageResult = await twilioNotifications.quoteStatusUpdate(data);
        break;

      case 'payment_received':
        messageResult = await twilioNotifications.paymentReceived(data);
        break;

      case 'project_milestone':
        messageResult = await twilioNotifications.projectMilestone(data);
        break;

      default:
        await logNotification({ id: logId, status: 'failed', error: 'Unknown notification type' });
        return NextResponse.json(
          { error: 'Unknown notification type' },
          { status: 400 }
        );
    }

    // Update log with result
    await logNotification({
      id: logId,
      status: messageResult.success ? 'sent' : 'failed',
      messageId: messageResult.messageId,
      error: messageResult.error
    });

    return NextResponse.json({
      success: messageResult.success,
      messageId: messageResult.messageId,
      logId
    });

  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

    // This would fetch from your database
    // For now, return recent notifications
    const notifications = await getNotifications(type, limit);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function (you'll implement this with your database)
async function getNotifications(type?: string | null, limit: number = 10) {
  // TODO: Implement database query
  // This would fetch from your notifications table
  return [];
}
