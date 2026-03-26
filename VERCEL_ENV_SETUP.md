# Vercel Environment Variables Setup

## Issue: Quotes showing in Supabase but not on website

The quotes are in your Supabase database, but the production website at `thebreed.co.za` can't access them because the environment variables aren't configured in Vercel.

## Solution: Add Supabase Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Find your project: **Breed Industries Web App**
3. Click on the project

### Step 2: Add Environment Variables

1. Click **Settings** (top navigation)
2. Click **Environment Variables** (left sidebar)
3. Add these 2 variables:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://zdpbkrrohdwohelsrvic.supabase.co
Environment: Production, Preview, Development (check all 3)
```

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcGJrcnJvaGR3b2hlbHNydmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NzY4OTgsImV4cCI6MjA1ODU1Mjg5OH0.uY8t5kj14Bk_Tdc-Kre4_Q__FC5wtJXrKWEhcvNcGiI
Environment: Production, Preview, Development (check all 3)
```

### Step 3: Redeploy

After adding the environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **⋯** (three dots menu)
4. Click **Redeploy**
5. Wait 2-3 minutes for deployment to complete

### Step 4: Verify

1. Go to https://thebreed.co.za/admin/quotes
2. Refresh the page (Ctrl+R or F5)
3. You should now see all 4 quotes:
   - Q-2026-9926 - Lino
   - Q-2026-5447 - Mzokuthula Chiliza
   - Q-2026-3433 - Nolwazi Herbal
   - Q-2026-3225 - Zama Shengu

## Why This Happens

- **Local development** uses `.env.local` file (which has the Supabase credentials)
- **Production** (Vercel) needs environment variables configured in Vercel dashboard
- Without these variables, the API can't connect to Supabase
- The quotes exist in Supabase, but the website can't fetch them

## After Setup

Once environment variables are added and redeployed:
- ✅ Quotes will appear on `/admin/quotes`
- ✅ Admin dashboard will show correct counts
- ✅ Search and filtering will work
- ✅ Import page will work
- ✅ All data persists permanently

## Quick Checklist

- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel
- [ ] Check all 3 environments (Production, Preview, Development)
- [ ] Redeploy the site
- [ ] Wait 2-3 minutes
- [ ] Refresh `/admin/quotes` page
- [ ] Verify quotes appear

---

**This is a one-time setup. Once done, all quotes will work forever!** 🚀
