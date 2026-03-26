# Import Old Quotes Guide

## Your Quote Files

I found these quote PDFs in your folder:
- `Lino_Quote_Q-2026-9926.pdf`
- `Mzokuthula Chiliza Business Registration_Quote_Q-2026-5447.pdf`
- `Nolwazi Herbal_Quote_Q-2026-3433.pdf`
- `ZamaShengu_Quote_Q-2026-3225.pdf`

## Option 1: Quick Manual Import (Recommended)

### Step 1: Run the SQL to Create Quotes Table

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **zdpbkrrohdwohelsrvic**
3. Click **SQL Editor** → **New query**
4. Copy the SQL from `SUPABASE_SETUP.md` (lines 48-110)
5. Click **Run**

### Step 2: Use the Import Script

I've created a script at `scripts/import-quotes.js` with your quote data pre-filled.

**To use it:**

1. Open `scripts/import-quotes.js`
2. Update the quote details with actual information from your PDFs:
   - Customer emails
   - Item descriptions
   - Prices/amounts
   - Totals

3. Run the import:
```bash
node scripts/import-quotes.js
```

## Option 2: Manual Entry via Supabase Dashboard

1. Go to Supabase Dashboard → **Table Editor** → **quotes**
2. Click **Insert** → **Insert row**
3. Fill in the data for each quote:

### Quote 1: Lino (Q-2026-9926)
```
id: quote_lino_9926
quote_number: Q-2026-9926
customer_name: Lino
customer_email: [GET FROM PDF]
project_name: [GET FROM PDF]
contact_person: Lino
items: [{"id":"item_1","name":"Service Name","description":"Description","quantity":1,"rate":0,"amount":0,"pricingType":"one-time"}]
total: [GET FROM PDF]
status: sent
```

### Quote 2: Mzokuthula Chiliza (Q-2026-5447)
```
id: quote_mzokuthula_5447
quote_number: Q-2026-5447
customer_name: Mzokuthula Chiliza
customer_email: [GET FROM PDF]
project_name: Business Registration
contact_person: Mzokuthula Chiliza
items: [{"id":"item_1","name":"Business Registration","description":"Company registration services","quantity":1,"rate":0,"amount":0,"pricingType":"one-time"}]
total: [GET FROM PDF]
status: sent
```

### Quote 3: Nolwazi Herbal (Q-2026-3433)
```
id: quote_nolwazi_3433
quote_number: Q-2026-3433
customer_name: Nolwazi Herbal
customer_email: [GET FROM PDF]
project_name: [GET FROM PDF]
contact_person: Nolwazi
items: [{"id":"item_1","name":"Service Name","description":"Description","quantity":1,"rate":0,"amount":0,"pricingType":"one-time"}]
total: [GET FROM PDF]
status: sent
```

### Quote 4: Zama Shengu (Q-2026-3225)
```
id: quote_zama_3225
quote_number: Q-2026-3225
customer_name: Zama Shengu
customer_email: [GET FROM PDF]
project_name: [GET FROM PDF]
contact_person: Zama Shengu
items: [{"id":"item_1","name":"Service Name","description":"Description","quantity":1,"rate":0,"amount":0,"pricingType":"one-time"}]
total: [GET FROM PDF]
status: sent
```

## Option 3: CSV Import Template

Create a file called `quotes.csv` with this format:

```csv
id,quote_number,customer_name,customer_email,project_name,contact_person,items,total,status
quote_lino_9926,Q-2026-9926,Lino,lino@example.com,Lino Project,Lino,"[{""id"":""item_1"",""name"":""Service"",""quantity"":1,""rate"":5000,""amount"":5000}]",5000,sent
quote_mzokuthula_5447,Q-2026-5447,Mzokuthula Chiliza,mzokuthula@example.com,Business Registration,Mzokuthula Chiliza,"[{""id"":""item_1"",""name"":""Registration"",""quantity"":1,""rate"":3000,""amount"":3000}]",3000,sent
```

Then import via Supabase Dashboard:
1. Go to **Table Editor** → **quotes**
2. Click **Import data** → **CSV**
3. Upload your `quotes.csv` file

## Verify Import

After importing, check:
1. Go to `/admin/quotes` on your website
2. You should see all 4 quotes listed
3. Each quote should show:
   - Quote number
   - Customer name
   - Total amount
   - Status
   - Date created

## What Information to Extract from PDFs

For each PDF, you need:
1. **Customer Email** - Contact email address
2. **Project Name** - What service/product they requested
3. **Items** - List of services/products with prices
4. **Total Amount** - Final quote total
5. **Date** - When the quote was created (optional, will default to now)

## Need Help?

If you have trouble:
1. Open one PDF at a time
2. Extract the information manually
3. Use Option 2 (Manual Entry) to add each quote
4. It should only take 5-10 minutes for all 4 quotes

## After Import

Once imported, your quotes will:
- ✅ Show up in `/admin/quotes`
- ✅ Be searchable by customer name/email
- ✅ Be stored permanently in Supabase
- ✅ Never be lost even if you redeploy

---

**Quick Start:** Use `scripts/import-quotes.js` - just update the values and run it!
