# WhatsApp Agent Setup — Breed Industries
## One-time QR scan = permanent session (no re-scanning needed after restarts)

Uses **Evolution API** — open source, self-hosted on Railway.
No Meta/WhatsApp Business API approval required. Uses your own number via QR scan.

---

## Step 1 — Deploy Evolution API on Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from image**
2. Use image: `atendai/evolution-api:latest`
3. Add the following environment variables in Railway:

```env
AUTHENTICATION_TYPE=apikey
AUTHENTICATION_API_KEY=choose_a_strong_random_key_here
AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true

DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://USER:PASS@HOST:PORT/DB
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true
DATABASE_SAVE_DATA_CONTACTS=true
DATABASE_SAVE_DATA_CHATS=true

QRCODE_LIMIT=30
DEL_INSTANCE=false
```

> For `DATABASE_CONNECTION_URI`, use the Supabase connection string from:
> Supabase → Settings → Database → Connection string (URI mode, port 5432)

4. Add a **Railway Volume** mounted at `/evolution/instances` — this provides a filesystem
   backup for session data between deploys.
5. Deploy. Copy the public Railway URL (e.g. `https://breed-evolution.up.railway.app`)

---

## Step 2 — Create the WhatsApp Instance

In Railway logs or using curl:

```bash
curl -X POST https://your-evolution-url.up.railway.app/instance/create \
  -H "apikey: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"instanceName":"breed-agent","qrcode":true}'
```

---

## Step 3 — Add Environment Variables to Breed Industries App

Add to `.env.local` (and to Vercel/Railway environment for production):

```env
EVOLUTION_API_URL=https://your-evolution-url.up.railway.app
EVOLUTION_API_KEY=your_strong_api_key
EVOLUTION_INSTANCE_NAME=breed-agent
EVOLUTION_WEBHOOK_URL=https://www.thebreed.co.za/api/whatsapp/webhook
WHATSAPP_ADMIN_NUMBER=27XXXXXXXXX
```

Replace `27XXXXXXXXX` with your personal WhatsApp number to receive admin alerts.

---

## Step 4 — Run SQL Migration

Run `SETUP_WHATSAPP.sql` in Supabase SQL Editor to create the message log table.

---

## Step 5 — Connect WhatsApp (One-time QR scan)

1. Go to `/admin/whatsapp` in the app
2. Click **Register Webhook** (once only — registers the webhook with Evolution API)
3. Click **Get QR Code**
4. Scan the QR code with the dedicated WhatsApp number
5. Session is saved to PostgreSQL — **no re-scan needed after restarts**

---

## How Session Persistence Works

Evolution API stores the WhatsApp session in PostgreSQL (`DATABASE_CONNECTION_URI`).
When the Railway container restarts, it loads the session from the database and
reconnects automatically — no QR scan required.

The `DEL_INSTANCE=false` env var prevents the instance from being deleted on restart.

---

## Automatic Notifications Wired In

| Event | Admin notified | Client notified |
|---|---|---|
| New lead (contact form / event) | ✅ | — |
| Payment received | ✅ | ✅ (if phone on file) |
| Subscription started | ✅ | ✅ (if phone on file) |
| Inbound WhatsApp message | ✅ forwarded | — |
| Compliance reminder | ✅ | ✅ |
| Invoice sent | — | ✅ |
| Session disconnected | ✅ | — |

---

## Admin Panel

`/admin/whatsapp` — connection status, QR code, message log, manual send, quick templates.

---

## Troubleshooting

- **QR expired**: Click Get QR Code again (expires in ~60 seconds)
- **Session dropped**: Check Railway logs; container may have restarted without DB persistence
- **Messages not arriving**: Click Register Webhook again to re-register the endpoint
- **Evolution API unreachable**: Check Railway service is running and URL is correct
