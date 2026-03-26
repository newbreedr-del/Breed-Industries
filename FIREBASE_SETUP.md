# Firebase Setup Guide

## ✅ Firebase Already Configured!

Your Firebase project is already set up and ready to use:

- **Project ID**: `breed-industries-70feb`
- **Project Name**: Breed Industries
- **Region**: Default (US)

## 🔧 What's Already Done

1. ✅ Firebase project created
2. ✅ Firebase SDK installed (`npm install firebase`)
3. ✅ Firebase configuration added to codebase
4. ✅ Firestore database initialized

## 📋 Next Steps

### Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **breed-industries-70feb**
3. Click **Firestore Database** in the left menu
4. Click **Create database**
5. Choose **Start in production mode** (we'll add security rules later)
6. Select location: **nam5 (us-central)** or closest to South Africa
7. Click **Enable**

### Step 2: Create Firestore Collections

Firebase will automatically create collections when you add your first document, but you can set up indexes:

1. In Firestore console, go to **Indexes** tab
2. Click **Create Index**
3. Create these composite indexes:

**Index 1: For filtering by status and sorting**
- Collection ID: `invoices`
- Fields:
  - `status` (Ascending)
  - `createdAt` (Descending)

**Index 2: For filtering by payment status and sorting**
- Collection ID: `invoices`
- Fields:
  - `paymentStatus` (Ascending)
  - `createdAt` (Descending)

**Index 3: For invoice number queries**
- Collection ID: `invoices`
- Fields:
  - `invoiceNumber` (Ascending)
  - `invoiceNumber` (Descending)

### Step 3: Set Up Security Rules

1. In Firestore console, go to **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all operations on invoices (you can restrict this later)
    match /invoices/{invoiceId} {
      allow read, write: if true;
    }
    
    // Allow all operations on quotes (you can restrict this later)
    match /quotes/{quoteId} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

**Note**: These rules allow anyone to read/write. For production, you should add authentication and restrict access.

### Step 4: Add Environment Variables to Vercel

Your Firebase config is already in the code, but for security, you should add them to Vercel:

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (already configured in your code):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD0MUcLAc_ym5Iv2UW8-Kl9LLX5wIAhPG8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=breed-industries-70feb.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=breed-industries-70feb
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=breed-industries-70feb.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=262740985828
NEXT_PUBLIC_FIREBASE_APP_ID=1:262740985828:web:35ada068a9bcadd9b7a9f1
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-G91F6CCKY8
```

5. Make sure they're available for all environments (Production, Preview, Development)
6. Click **Save**

### Step 5: Test the Integration

1. Run your app locally: `npm run dev`
2. Go to `/admin/invoices`
3. Click **Create Invoice**
4. Fill out and save an invoice
5. Check Firebase Console → Firestore Database
6. You should see a new `invoices` collection with your data!

## 🎯 Data Structure

### Invoices Collection

Each invoice document contains:

```javascript
{
  invoiceNumber: "INV-202603-0001",
  quoteNumber: "Q-2026-0001",
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+27 12 345 6789",
  customerAddress: "123 Main St, City",
  items: [
    {
      id: "item_123",
      name: "Website Development",
      description: "Custom website",
      quantity: 1,
      rate: 15000,
      amount: 15000,
      pricingType: "one-time"
    }
  ],
  oneTimeTotal: 15000,
  monthlyTotal: 0,
  deposit: 7500,
  balance: 7500,
  totalAmount: 15000,
  status: "draft",
  paymentStatus: "unpaid",
  dueDate: "2026-04-26T00:00:00.000Z",
  issueDate: "2026-03-26T07:00:00.000Z",
  paidDate: null,
  paidAmount: 0,
  paymentDate: null,
  stitchPaymentId: null,
  stitchPaymentUrl: null,
  notes: "Payment terms: 50% deposit required",
  createdAt: "2026-03-26T07:00:00.000Z",
  updatedAt: "2026-03-26T07:00:00.000Z"
}
```

## 🔒 Security Best Practices

### Current Setup (Development)
- ✅ All data is public (anyone can read/write)
- ⚠️ **Not suitable for production**

### Recommended for Production

1. **Add Firebase Authentication**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /invoices/{invoiceId} {
      // Only authenticated users can read/write
      allow read, write: if request.auth != null;
    }
  }
}
```

2. **Add Admin-Only Access**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /invoices/{invoiceId} {
      // Only specific admin users
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
```

3. **Add Role-Based Access**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /invoices/{invoiceId} {
      // Admins can do everything
      allow read, write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // Customers can only read their own invoices
      allow read: if resource.data.customerEmail == request.auth.token.email;
    }
  }
}
```

## 📊 Firebase Free Tier Limits

Your project includes:

- **Firestore Database**
  - 1 GiB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day

- **Cloud Storage**
  - 5 GB storage
  - 1 GB/day downloads
  - 20,000 uploads/day

- **Authentication**
  - Unlimited users
  - 10,000 verifications/month (phone auth)

**This is more than enough for your business needs!**

## 🔄 Data Migration

If you have existing data to import:

### Option 1: Manual Import via Console
1. Go to Firestore console
2. Click **Start collection**
3. Enter collection name: `invoices`
4. Add documents manually

### Option 2: Bulk Import via Script
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

const invoices = [/* your invoice data */];

async function importInvoices() {
  for (const invoice of invoices) {
    await addDoc(collection(db, 'invoices'), invoice);
  }
}
```

### Option 3: Import from JSON
1. Export your data as JSON
2. Use Firebase CLI: `firebase firestore:import data.json`

## 📈 Monitoring & Analytics

### View Usage
1. Firebase Console → **Usage and billing**
2. See reads, writes, storage usage
3. Set up budget alerts

### Enable Analytics
Analytics is already configured in your app:
- Page views tracked automatically
- Custom events can be added
- View reports in Firebase Console → **Analytics**

## 🆘 Troubleshooting

### Error: "Missing or insufficient permissions"
- Check Firestore security rules
- Make sure rules allow your operations
- Verify you're using the correct project

### Error: "Firebase not initialized"
- Check that Firebase config is correct
- Verify environment variables are set
- Make sure `firebase` package is installed

### Data not showing
- Check Firestore console to verify data exists
- Check browser console for errors
- Verify collection name is correct (`invoices`)

### Slow queries
- Create composite indexes (Firebase will suggest them)
- Limit query results
- Use pagination

## 🎉 You're All Set!

Your Firebase integration is complete. Just enable Firestore in the console and you're ready to go!

**Benefits:**
- ✅ Data persists forever
- ✅ Real-time updates available
- ✅ Automatic backups
- ✅ Scalable infrastructure
- ✅ Free tier is generous
- ✅ Google's reliability

## 📚 Additional Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Best Practices](https://firebase.google.com/docs/firestore/best-practices)
