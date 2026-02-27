# WhatsApp Notification System Setup Guide

## Overview
This system automatically sends WhatsApp notifications when:
- New client requests are submitted via the contact form
- Quotes are generated
- Payments are received
- Project milestones are completed

## Prerequisites
1. **WhatsApp Business Account** - Apply at [Meta Business Suite](https://business.facebook.com/)
2. **Phone Number** - A dedicated business phone number
3. **Facebook Business Account** - For API access

## Step 1: Apply for WhatsApp Business API

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Create or connect your Business Account
3. Click "WhatsApp" → "Get Started"
4. Submit your business details:
   - Business name: "Breed Industries (PTY) LTD"
   - Business category: "Business Services"
   - Website: https://thebreed.co.za
   - Business address: 4 Ivy Road, Pinetown, 3610
5. Wait for approval (1-3 business days)

## Step 2: Configure Phone Number

Once approved:
1. Add your business phone number
2. Verify the number (receive a verification code via SMS/call)
3. Note down your **Phone Number ID** from the WhatsApp Manager

## Step 3: Get API Credentials

1. In WhatsApp Manager, go to "Settings" → "API Setup"
2. Generate an **Access Token** (valid for 60 days, can be refreshed)
3. Copy these values:
   - Access Token
   - Phone Number ID
   - Webhook Verify Token (create one)

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=EAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=1234567890123456
WHATSAPP_API_VERSION=v18.0
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_secret_verify_token_123

# Your WhatsApp Number (to receive notifications)
YOUR_WHATSAPP_NUMBER=27xxxxxxxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=https://thebreed.co.za
```

## Step 5: Create Message Templates

WhatsApp requires pre-approved templates. Create these in WhatsApp Manager:

### Template 1: new_client_request
```
New client request from {{1}}

Name: {{1}}
Email: {{2}}
Phone: {{3}}
Service: {{4}}
Message: {{5}}
```

### Template 2: quote_status_update
```
Quote Update: {{1}}

Client: {{2}}
Status: {{3}}
Amount: R{{4}}
Updated: {{5}}
```

### Template 3: payment_received
```
Payment Received!

Client: {{1}}
Amount: R{{2}}
Quote: {{3}}
Method: {{4}}
Date: {{5}}
```

### Template 4: project_milestone
```
Project Milestone: {{1}}

Client: {{2}}
Milestone: {{3}}
Completed: {{4}}
Next Steps: {{5}}
```

## Step 6: Set Up Webhook

1. Deploy your app to production (Vercel, etc.)
2. In WhatsApp Manager, set webhook URL to:
   `https://your-domain.com/api/whatsapp/webhook`
3. Subscribe to these webhook events:
   - `messages`
   - `message_statuses`
4. Click "Verify and Save"

## Step 7: Test the System

1. **Test Contact Form**:
   - Go to your website's contact page
   - Submit a test request
   - Check your WhatsApp for notification

2. **Test Quote Generation**:
   - Go to `/lab` and generate a quote
   - Check for WhatsApp notification

3. **View Admin Dashboard**:
   - Go to `/admin/notifications`
   - View notification history and status

## Features

### Automatic Triggers:
- ✅ Contact form submissions
- ✅ Quote generation
- ✅ Status updates (manual trigger via API)
- ✅ Payment confirmations
- ✅ Project milestones

### Admin Dashboard:
- View all notifications
- Filter by type/status
- See success/failure rates
- View error messages

### API Endpoints:
- `POST /api/notifications` - Send notification
- `GET /api/notifications` - View notifications
- `GET/POST /api/whatsapp/webhook` - WhatsApp webhook

## Usage Examples

### Send Custom Notification:
```javascript
// Client-side
import { notifyClientRequest } from '@/lib/notify';

await notifyClientRequest({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+27821234567',
  service: 'Business Registration',
  message: 'Need help registering my company'
});
```

### Server-side:
```javascript
// In API route
import { notifyServer } from '@/lib/notify';

await notifyServer('payment_received', {
  clientName: 'John Doe',
  amount: '5000.00',
  quoteId: 'Q-2024-1234',
  paymentMethod: 'EFT'
});
```

## Troubleshooting

### Common Issues:
1. **Template Not Approved**: Wait for template approval (can take 24-48 hours)
2. **Webhook Not Receiving**: Check webhook URL is publicly accessible
3. **Access Token Expired**: Regenerate token in WhatsApp Manager
4. **Rate Limits**: WhatsApp has limits (1000 messages/day for free tier)

### Debug Mode:
Check browser console and server logs for detailed error messages.

## Costs

- **Free Tier**: 1,000 conversations/month
- **Paid Tier**: ~$0.05 per message after free tier
- **No additional infrastructure costs**

## Security Notes

- Keep access tokens secure
- Use HTTPS for webhook URL
- Validate webhook requests
- Don't expose API endpoints publicly without authentication

## Support

For WhatsApp API issues:
- [Meta Business Help Center](https://www.facebook.com/business/help)
- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)

For code issues:
- Check the admin dashboard at `/admin/notifications`
- Review server logs
- Contact your developer
