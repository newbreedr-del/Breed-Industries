# Supabase Database Setup Guide

## Why Supabase?

Your quotes and invoices were being stored in memory, which means they disappeared every time the server restarted or when you deployed new code. Supabase provides:

- ✅ **Persistent Storage** - Data survives deployments and restarts
- ✅ **Free Tier** - 500MB database, 1GB file storage, 2GB bandwidth
- ✅ **PostgreSQL Database** - Reliable, industry-standard database
- ✅ **Real-time Updates** - Optional real-time features
- ✅ **Easy Migration** - Can move to another host if needed

## Setup Instructions

### Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Create a new organization (e.g., "Breed Industries")

### Step 2: Create a New Project

1. Click "New Project"
2. Fill in:
   - **Name**: `breed-industries-db`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to South Africa (e.g., `eu-west-1` or `ap-southeast-1`)
   - **Pricing Plan**: Free
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### Step 3: Get Your API Credentials

1. In your Supabase project dashboard, click "Settings" (gear icon)
2. Click "API" in the sidebar
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 4: Create Database Tables

1. In Supabase dashboard, click "SQL Editor"
2. Click "New query"
3. Copy and paste this SQL:

```sql
-- Create invoices table
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  quote_number TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  items JSONB NOT NULL,
  one_time_total DECIMAL(10,2) NOT NULL,
  monthly_total DECIMAL(10,2) NOT NULL,
  deposit DECIMAL(10,2) NOT NULL,
  balance DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  due_date TIMESTAMP NOT NULL,
  issue_date TIMESTAMP NOT NULL,
  paid_date TIMESTAMP,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  payment_date TIMESTAMP,
  stitch_payment_id TEXT,
  stitch_payment_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE quotes (
  id TEXT PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  project_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_invoices_customer_email ON invoices(customer_email);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX idx_invoices_created_at ON invoices(created_at DESC);

CREATE INDEX idx_quotes_customer_email ON quotes(customer_email);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow all operations on quotes" ON quotes FOR ALL USING (true);
```

4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned"

### Step 5: Add Environment Variables

1. Open your `.env.local` file
2. Add these lines:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace with your actual values from Step 3

### Step 6: Add to Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Make sure they're available for all environments (Production, Preview, Development)
6. Click "Save"

### Step 7: Redeploy

1. Go to "Deployments" tab in Vercel
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Or push a new commit to trigger deployment

## Testing the Database

After setup, test that it works:

1. Go to `/admin/invoices`
2. Click "Create Invoice"
3. Fill out the form and save
4. Refresh the page - the invoice should still be there!
5. Check Supabase dashboard → "Table Editor" → "invoices" to see your data

## Data Migration

If you have existing quotes/invoices you want to keep, you can:

1. Export them as JSON
2. Use Supabase SQL Editor to insert them
3. Or use the Supabase API to bulk insert

## Security Notes

- The `anon` key is safe to expose in frontend code
- Row Level Security (RLS) is enabled
- Current policy allows all operations - you can restrict this later
- For production, consider adding authentication

## Backup & Export

To backup your data:

1. Go to Supabase dashboard
2. Click "Database" → "Backups"
3. Or export via SQL:
   ```sql
   COPY invoices TO '/tmp/invoices.csv' CSV HEADER;
   COPY quotes TO '/tmp/quotes.csv' CSV HEADER;
   ```

## Troubleshooting

**Error: "Failed to fetch"**
- Check your environment variables are correct
- Verify Supabase project is active
- Check browser console for CORS errors

**Error: "Invalid API key"**
- Make sure you're using the `anon` key, not the `service_role` key
- Verify the key is copied correctly (no extra spaces)

**Data not showing**
- Check Supabase Table Editor to verify data is there
- Check browser console for errors
- Verify RLS policies are set correctly

## Cost & Limits

**Free Tier Includes:**
- 500MB database space
- 1GB file storage
- 2GB bandwidth per month
- 50,000 monthly active users
- 500MB database backups

**When to Upgrade:**
- If you exceed free tier limits
- If you need more than 7 days of backups
- If you need priority support

## Next Steps

1. ✅ Complete the setup above
2. ✅ Test creating invoices and quotes
3. ✅ Verify data persists after page refresh
4. ✅ Deploy to Vercel
5. Consider adding authentication for admin routes
6. Set up automated backups
7. Monitor usage in Supabase dashboard

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues
