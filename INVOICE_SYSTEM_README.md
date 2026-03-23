# Invoice System Documentation

## Overview

The Breed Industries invoice system provides complete invoice management with automated email delivery, payment tracking, and PDF generation. The system integrates with Hostinger IMAP/SMTP for email automation.

## Features

- ✅ **Invoice Generation**: Create invoices from quotes or manually
- ✅ **PDF Generation**: Automatic PDF creation with company branding
- ✅ **Email Automation**: Send invoices via Hostinger SMTP (sales@thebreed.co.za)
- ✅ **Payment Tracking**: Track payment status (unpaid, partial, paid)
- ✅ **Status Management**: Draft, sent, paid, overdue, cancelled
- ✅ **One-time vs Monthly Fees**: Separate tracking for recurring subscriptions
- ✅ **Admin Dashboard**: Full invoice management interface
- ✅ **Email Monitoring**: IMAP integration for incoming email classification

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

The following packages are required (already added to package.json):
- `imap` - IMAP email client
- `mailparser` - Email parsing
- `nodemailer` - SMTP email sending
- `@types/nodemailer` - TypeScript types

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
# Hostinger Email Configuration (for sales@thebreed.co.za)
SALES_EMAIL_USER=sales@thebreed.co.za
SALES_EMAIL_PASSWORD=your_actual_password_here
```

**Important**: Replace `your_actual_password_here` with the actual password for sales@thebreed.co.za from Hostinger.

### 3. Hostinger Email Settings

The system uses these Hostinger email server settings:

**SMTP (Sending):**
- Host: `smtp.hostinger.com`
- Port: `465`
- Encryption: `SSL`
- Username: `sales@thebreed.co.za`
- Password: From environment variable

**IMAP (Receiving):**
- Host: `imap.hostinger.com`
- Port: `993`
- Encryption: `SSL/TLS`
- Username: `sales@thebreed.co.za`
- Password: From environment variable

### 4. Data Storage

Invoices are stored in JSON format at:
```
/data/invoices/invoices.json
```

This directory is automatically created and is excluded from Git via `.gitignore`.

## API Endpoints

### Invoice Management

#### Create Invoice
```
POST /api/invoices
```

**Request Body:**
```json
{
  "quoteNumber": "QTE-202603-0001",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+27 60 123 4567",
  "customerAddress": "123 Main St, Cape Town",
  "items": [
    {
      "id": "1",
      "name": "Website Development",
      "description": "Custom 5-page website",
      "quantity": 1,
      "rate": 5000,
      "pricingType": "one-time",
      "amount": 5000
    },
    {
      "id": "2",
      "name": "Social Media Management",
      "description": "Monthly social media management",
      "quantity": 1,
      "rate": 3500,
      "pricingType": "monthly",
      "amount": 3500
    }
  ],
  "dueDate": "2026-04-23T00:00:00.000Z",
  "notes": "Payment terms: 50% deposit required"
}
```

**Response:**
```json
{
  "success": true,
  "invoice": {
    "id": "inv_1234567890_abc123",
    "invoiceNumber": "INV-202603-0001",
    "status": "draft",
    "paymentStatus": "unpaid",
    ...
  }
}
```

#### List Invoices
```
GET /api/invoices?page=1&pageSize=10&status=sent&paymentStatus=unpaid
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)
- `status` - Filter by status (draft, sent, paid, overdue, cancelled)
- `paymentStatus` - Filter by payment status (unpaid, partial, paid)
- `customerEmail` - Search by customer email

#### Get Single Invoice
```
GET /api/invoices/[id]
```

#### Update Invoice
```
PATCH /api/invoices/[id]
```

**Request Body:**
```json
{
  "status": "paid",
  "paymentStatus": "paid",
  "paidAmount": 5000,
  "paidDate": "2026-03-25T00:00:00.000Z"
}
```

#### Delete Invoice
```
DELETE /api/invoices/[id]
```

#### Download Invoice PDF
```
GET /api/invoices/[id]/pdf
```

Returns PDF file for download.

#### Send Invoice Email
```
POST /api/invoices/[id]/send
```

Sends invoice PDF to customer via email and updates status to "sent".

## Admin Dashboard

Access the invoice management dashboard at:
```
/admin/invoices
```

### Features:
- **Search & Filter**: Filter by status, payment status, or customer email
- **Quick Actions**: 
  - Download PDF
  - Send invoice via email
  - View invoice details
  - Delete invoice
- **Status Badges**: Visual indicators for invoice and payment status
- **Pagination**: Navigate through large invoice lists

## Email Automation

### Sending Invoices

When you send an invoice via the dashboard or API, the system:

1. Generates a PDF invoice
2. Composes a professional email with:
   - Customer greeting
   - Invoice number
   - Payment details (bank account info)
   - PDF attachment
3. Sends via Hostinger SMTP
4. Updates invoice status to "sent"

### Email Template

The system sends emails with:
- **From**: Breed Industries <sales@thebreed.co.za>
- **Subject**: Invoice [INV-NUMBER] from Breed Industries
- **Body**: Professional message with payment instructions
- **Attachment**: Invoice PDF

### Monitoring Incoming Emails (Future Enhancement)

The `emailService.ts` includes IMAP functions for:
- Fetching unread emails
- Classifying emails (lead, support, billing, spam)
- Marking emails as read

To implement automated email monitoring, create a cron job or scheduled task that calls:
```typescript
import { fetchUnreadEmails, classifyEmail } from '@/lib/emailService';

// Fetch and process emails
const emails = await fetchUnreadEmails();
for (const email of emails) {
  const type = classifyEmail(email.subject, email.text);
  // Handle based on type
}
```

## Invoice Numbering

Invoices are automatically numbered using the format:
```
INV-YYYYMM-NNNN
```

Example: `INV-202603-0001`

- `YYYY` - Year
- `MM` - Month
- `NNNN` - Sequential number (resets each month)

## Payment Tracking

### One-Time Fees vs Monthly Subscriptions

The system separates:
- **One-Time Fees**: Services billed once (deposit + balance)
- **Monthly Subscriptions**: Recurring services (invoiced separately)

### Payment Workflow

1. **Invoice Created** (status: draft, payment: unpaid)
2. **Invoice Sent** (status: sent, payment: unpaid)
3. **Deposit Received** (status: sent, payment: partial)
4. **Full Payment** (status: paid, payment: paid)

### Monthly Subscription Invoicing

For services with `pricingType: "monthly"`:
- Not included in deposit calculation
- Shown separately on invoice
- Note added: "Recurring monthly fees will be invoiced separately after initial payment is received"
- Create new invoices monthly for these services

## Security Considerations

1. **Email Credentials**: Never commit `.env.local` to Git
2. **Admin Access**: Add authentication to `/admin/invoices` route
3. **API Protection**: Add API key or session validation to invoice endpoints
4. **Data Backup**: Regularly backup `/data/invoices/` directory

## Deployment to Vercel

### Environment Variables

Add to Vercel environment variables:
```
SALES_EMAIL_USER=sales@thebreed.co.za
SALES_EMAIL_PASSWORD=your_password
```

### Data Persistence

**Important**: The current JSON file storage is not persistent on Vercel (serverless environment).

For production, consider:
1. **Vercel Postgres** - Store invoices in database
2. **Vercel KV** - Redis-based key-value storage
3. **External Database** - MongoDB, Supabase, etc.

To migrate to database:
- Update `src/lib/invoiceStorage.ts` to use database queries
- Keep the same function signatures for compatibility

## Troubleshooting

### Email Not Sending

1. Check environment variables are set correctly
2. Verify Hostinger email credentials
3. Check SMTP logs in console
4. Ensure port 465 is not blocked by firewall

### Invoice PDF Not Generating

1. Check jsPDF is installed: `npm list jspdf`
2. Verify invoice data structure matches `Invoice` type
3. Check console for PDF generation errors

### IMAP Connection Issues

1. Verify IMAP is enabled in Hostinger email settings
2. Check port 993 is accessible
3. Ensure TLS/SSL is properly configured

## Future Enhancements

- [ ] Database integration for production
- [ ] Authentication for admin dashboard
- [ ] Automated overdue invoice detection
- [ ] Email templates customization
- [ ] Bulk invoice operations
- [ ] Invoice templates
- [ ] Multi-currency support
- [ ] Tax calculations (VAT)
- [ ] Payment gateway integration
- [ ] Automated monthly subscription invoicing
- [ ] Email auto-responder for common queries

## Support

For issues or questions:
- Email: info@thebreed.co.za
- Phone: +27 60 496 4105
