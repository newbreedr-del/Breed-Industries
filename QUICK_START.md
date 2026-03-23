# Quick Start Guide - Invoice System

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Email
Add to `.env.local`:
```env
SALES_EMAIL_USER=sales@thebreed.co.za
SALES_EMAIL_PASSWORD=your_hostinger_password
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Access Invoice Dashboard
Open browser: `http://localhost:3000/admin/invoices`

## 📋 Create Your First Invoice

### Option 1: Via API
```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "customerEmail": "test@example.com",
    "items": [{
      "id": "1",
      "name": "Website Development",
      "description": "5-page website",
      "quantity": 1,
      "rate": 5000,
      "pricingType": "one-time",
      "amount": 5000
    }],
    "dueDate": "2026-04-30T00:00:00.000Z"
  }'
```

### Option 2: Via Dashboard
1. Go to `/admin/invoices`
2. Click "Create Invoice"
3. Fill in customer details
4. Add line items
5. Click "Create"

## 📧 Send Invoice to Customer

### Via Dashboard:
1. Find invoice in list
2. Click "Send" icon (paper plane)
3. Confirm sending
4. Email sent automatically!

### Via API:
```bash
curl -X POST http://localhost:3000/api/invoices/[invoice-id]/send
```

## 💾 Where Invoices Are Stored

Local development: `/data/invoices/invoices.json`

**Note**: For production, migrate to database (see INVOICE_SYSTEM_README.md)

## 🔧 Common Tasks

### Download Invoice PDF
```
GET /api/invoices/[id]/pdf
```

### Update Payment Status
```bash
curl -X PATCH http://localhost:3000/api/invoices/[id] \
  -H "Content-Type: application/json" \
  -d '{
    "paymentStatus": "paid",
    "paidAmount": 5000,
    "paidDate": "2026-03-25T00:00:00.000Z"
  }'
```

### Filter Invoices
```
GET /api/invoices?status=sent&paymentStatus=unpaid
```

## 📚 Full Documentation

See `INVOICE_SYSTEM_README.md` for complete documentation.

## ⚠️ Important Notes

1. **Email Password**: Get from Hostinger control panel
2. **Admin Access**: Add authentication before production
3. **Data Backup**: Backup `/data/` directory regularly
4. **Production**: Use database instead of JSON files

## 🆘 Need Help?

- Check console for error messages
- Review `INVOICE_SYSTEM_README.md`
- Contact: info@thebreed.co.za
