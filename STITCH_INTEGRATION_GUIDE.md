# Stitch Money Integration Guide

## Overview

This guide explains how to integrate Stitch Money payment processing with the Breed Industries invoice system. Stitch Money enables instant EFT payments directly from customer bank accounts to your business account.

## What is Stitch Money?

Stitch Money is a South African payment platform that allows customers to pay invoices directly from their bank account using instant EFT. Benefits include:

- **Instant payments** - Funds reflect immediately
- **Lower fees** - Cheaper than card payments
- **Bank-level security** - No card details stored
- **All major banks** - FNB, Standard Bank, Nedbank, Absa, Capitec, etc.
- **Real-time verification** - Know immediately if payment succeeded

## Setup Instructions

### 1. Create Stitch Money Account

1. Visit [https://stitch.money](https://stitch.money)
2. Sign up for a business account
3. Complete KYC verification
4. Get your API credentials from the dashboard

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Stitch Money Configuration
STITCH_CLIENT_ID=your_client_id_from_stitch_dashboard
STITCH_CLIENT_SECRET=your_client_secret_from_stitch_dashboard
STITCH_ENVIRONMENT=sandbox  # Use 'production' when ready to go live
STITCH_REDIRECT_URI=https://yourdomain.com/api/stitch/callback
STITCH_WEBHOOK_SECRET=your_webhook_secret

# Company Bank Account (Standard Bank)
COMPANY_ACCOUNT_NUMBER=10268731932
COMPANY_BANK_ID=standard_bank
COMPANY_BRANCH_CODE=051001
```

### 3. Configure Webhooks in Stitch Dashboard

1. Log into your Stitch dashboard
2. Go to Settings > Webhooks
3. Add webhook URL: `https://yourdomain.com/api/stitch/webhook`
4. Select events: `payment.status.updated`
5. Copy the webhook secret to your `.env.local`

### 4. Test in Sandbox Mode

Before going live, test with sandbox mode:

```env
STITCH_ENVIRONMENT=sandbox
```

Use Stitch's test bank accounts to simulate payments.

## How It Works

### Payment Flow

1. **Customer receives invoice** via email with payment link
2. **Customer clicks "Pay Now"** button
3. **Redirected to Stitch** payment page
4. **Customer selects bank** and logs in
5. **Payment authorized** and processed instantly
6. **Customer redirected back** to your site
7. **Webhook updates invoice** status automatically

### Invoice Payment Process

```javascript
// 1. Create payment request
POST /api/stitch/payment
{
  "invoiceId": "inv_123"
}

// Response includes payment URL
{
  "paymentUrl": "https://pay.stitch.money/payment/xyz",
  "paymentRequestId": "pr_abc123",
  "amount": 5000.00
}

// 2. Customer completes payment on Stitch

// 3. Webhook receives status update
POST /api/stitch/webhook
{
  "type": "payment.status.updated",
  "data": {
    "paymentRequestId": "pr_abc123",
    "status": "complete"
  }
}

// 4. Invoice automatically updated to 'paid'
```

## API Endpoints

### Create Payment Request

**Endpoint:** `POST /api/stitch/payment`

**Request:**
```json
{
  "invoiceId": "inv_20260325_0001"
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://pay.stitch.money/payment/pr_abc123",
  "paymentRequestId": "pr_abc123",
  "amount": 5000.00
}
```

### Payment Callback

**Endpoint:** `GET /api/stitch/callback`

**Query Parameters:**
- `paymentRequestId` - The payment request ID
- `status` - Payment status (complete, cancelled, pending)

Automatically redirects to admin dashboard with status message.

### Webhook Handler

**Endpoint:** `POST /api/stitch/webhook`

**Payload:**
```json
{
  "id": "evt_123",
  "type": "payment.status.updated",
  "data": {
    "paymentRequestId": "pr_abc123",
    "status": "complete",
    "amount": {
      "quantity": "500000",
      "currency": "ZAR"
    }
  }
}
```

Automatically updates invoice payment status.

## Using in Admin Dashboard

### Send Invoice with Payment Link

1. Navigate to **Admin > Invoices**
2. Click on an invoice
3. Click **"Generate Payment Link"**
4. Payment URL is created and can be:
   - Copied and sent to customer
   - Included in invoice email automatically
   - Displayed as QR code

### Track Payment Status

Invoice statuses are automatically updated:
- **Unpaid** - No payment received
- **Pending** - Payment initiated but not complete
- **Partial** - Partial payment received
- **Paid** - Fully paid

### View Payment History

Each invoice shows:
- Payment request ID
- Payment date and time
- Amount paid
- Payment method (Stitch EFT)
- Transaction reference

## Email Integration

Payment links are automatically included in invoice emails:

```html
<a href="https://pay.stitch.money/payment/pr_abc123">
  Pay Invoice Now
</a>
```

Customers can click directly from email to pay.

## Security Features

### Webhook Verification

All webhooks are verified using HMAC-SHA256 signatures:

```javascript
const signature = request.headers.get('x-stitch-signature');
const isValid = verifyWebhookSignature(payload, signature, webhookSecret);
```

### Payment Validation

- Amount verification against invoice total
- Duplicate payment prevention
- Invoice status checks
- Customer authentication via bank login

## Testing

### Sandbox Testing

1. Set `STITCH_ENVIRONMENT=sandbox`
2. Use test credentials from Stitch dashboard
3. Use test bank accounts:
   - **Test Bank** - Any credentials work
   - Simulate success, failure, cancellation

### Test Scenarios

```bash
# Create test payment
curl -X POST http://localhost:3000/api/stitch/payment \
  -H "Content-Type: application/json" \
  -d '{"invoiceId": "test_invoice_id"}'

# Simulate webhook (use Stitch dashboard webhook tester)
curl -X POST http://localhost:3000/api/stitch/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment.status.updated",
    "data": {
      "paymentRequestId": "pr_test",
      "status": "complete"
    }
  }'
```

## Going Live

### Pre-Launch Checklist

- [ ] Complete Stitch KYC verification
- [ ] Verify bank account details
- [ ] Test all payment flows in sandbox
- [ ] Set up webhook URL with SSL
- [ ] Update environment to production
- [ ] Test with small real payment
- [ ] Monitor first transactions closely

### Switch to Production

```env
STITCH_ENVIRONMENT=production
STITCH_CLIENT_ID=prod_client_id
STITCH_CLIENT_SECRET=prod_client_secret
```

## Troubleshooting

### Payment Not Completing

1. Check webhook is configured correctly
2. Verify webhook secret matches
3. Check Stitch dashboard for payment status
4. Review server logs for errors

### Webhook Not Received

1. Verify webhook URL is publicly accessible
2. Check SSL certificate is valid
3. Test webhook with Stitch dashboard tester
4. Check firewall/security settings

### Amount Mismatch

1. Verify invoice total calculation
2. Check for currency conversion issues
3. Ensure amounts are in cents (multiply by 100)

## Support

- **Stitch Documentation:** https://stitch.money/docs
- **Stitch Support:** support@stitch.money
- **API Status:** https://status.stitch.money

## Bank IDs Reference

Use these bank IDs in your configuration:

- `absa` - Absa Bank
- `capitec` - Capitec Bank
- `fnb` - First National Bank
- `nedbank` - Nedbank
- `standard_bank` - Standard Bank
- `investec` - Investec
- `discovery` - Discovery Bank
- `tymebank` - TymeBank

## Example: Complete Payment Flow

```typescript
// 1. Customer receives invoice email
// 2. Admin creates payment link
const response = await fetch('/api/stitch/payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ invoiceId: 'inv_123' })
});

const { paymentUrl } = await response.json();

// 3. Send payment URL to customer
// 4. Customer clicks link and pays
// 5. Webhook automatically updates invoice
// 6. Admin sees payment reflected in dashboard
```

## Benefits for Your Business

- ✅ **Faster payments** - Instant vs 3-5 days for EFT
- ✅ **Lower fees** - ~1.5% vs 3-4% for cards
- ✅ **Better cash flow** - Immediate access to funds
- ✅ **Reduced admin** - Automatic reconciliation
- ✅ **Higher conversion** - Easier for customers to pay
- ✅ **Bank-level security** - No PCI compliance needed

## Next Steps

1. Sign up for Stitch Money account
2. Complete verification
3. Add credentials to `.env.local`
4. Test in sandbox mode
5. Go live and start accepting payments!
