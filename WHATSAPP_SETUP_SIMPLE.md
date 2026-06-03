# WhatsApp Agent Setup — Simple Steps

## What You're Building
- **Vercel** = Your Breed Industries app (frontend + API routes)
- **Railway** = WhatsApp Evolution API (the engine that connects to WhatsApp)
- **Supabase** = Database (stores messages + session)

---

## Step 1: Deploy Evolution API on Railway (5 min)

1. Go to [railway.app](https://railway.app) and log in
2. Click **New Project** → **Deploy from image**
3. Enter image: `atendai/evolution-api:latest`
4. Click **Deploy**

---

## Step 2: Add Environment Variables in Railway

Go to your new service → **Variables** tab → Add these:

```
AUTHENTICATION_TYPE=apikey
AUTHENTICATION_API_KEY=breed-api-key-2025-secure
DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://postgres.zdpbkrrohdwohelsrvic:MySlungile_2026@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
QRCODE_LIMIT=30
DEL_INSTANCE=false
```

**To get your Supabase connection string:**
- Go to Supabase → your project → Settings → Database
- Copy "Connection string" (URI mode)
- Replace `YOUR_PASS` with your actual database password

---

## Step 3: Add Volume in Railway (IMPORTANT for persistence)

1. In Railway, go to **Volumes** tab
2. Click **New Volume**
3. Mount path: `/evolution/instances`
4. Size: 5GB (enough)

This saves your WhatsApp session so you don't rescan after restarts.

---

## Step 4: Get Your Railway URL

1. Go to **Settings** tab in Railway
2. Copy your public domain (looks like `breed-evolution.up.railway.app`)
3. Save it — you'll need it in Step 6

---

## Step 5: Create WhatsApp Instance

In Railway, go to **Logs** tab and watch for "API running", then run this curl in terminal:

```bash
curl -X POST https://YOUR-URL.up.railway.app/instance/create \
  -H "apikey: breed-api-key-2025-secure" \
  -H "Content-Type: application/json" \
  -d '{"instanceName":"breed-agent","qrcode":true}'
```

Replace `YOUR-URL` with your Railway domain from Step 4.

---

## Step 6: Add Environment Variables in Vercel

Go to Vercel → Your project → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `EVOLUTION_API_URL` | `https://YOUR-URL.up.railway.app` |
| `EVOLUTION_API_KEY` | `breed-api-key-2025-secure` |
| `EVOLUTION_INSTANCE_NAME` | `breed-agent` |
| `EVOLUTION_WEBHOOK_URL` | `https://www.thebreed.co.za/api/whatsapp/webhook` |
| `WHATSAPP_ADMIN_NUMBER` | `27604964105` |

Click **Save** and **Redeploy** your project.

---

## Step 7: Run Database Migration

In Supabase SQL Editor, run the contents of `SETUP_WHATSAPP.sql`:

```sql
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  sender_name TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Step 8: Connect Your WhatsApp

1. Go to `https://www.thebreed.co.za/admin/whatsapp`
2. Click **Register Webhook** (once only)
3. Click **Get QR Code**
4. Scan with your business phone **0685834837**
5. Done! Status should show "Connected"

---

## How It Works

```
Client messages 0685834837 (business number)
    ↓
Evolution API (Railway) receives it
    ↓
Sends to your webhook (Vercel)
    ↓
You get alert on 27604964105 (your phone)
    ↓
Reply with "SEND 2782xxxx your message"
    ↓
Agent forwards to client
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| QR expires fast | Click Get QR again, scan within 60 seconds |
| Session drops | Check Railway Volume is mounted at `/evolution/instances` |
| Messages not arriving | Click Register Webhook again |
| Can't connect | Check `EVOLUTION_API_URL` has no trailing slash |

---

## Commands from Your Phone

Once connected, message your agent number from 27604964105:
- `HELP` — list commands
- `STATUS` — check connection
- `LIST` — see CRM clients
- `SEND 27820001234 Hello` — send to any number
- `@27820001234 Hello` — shorthand send
