# Client Secretary System - Setup Guide

A comprehensive client work management system with automated WhatsApp reminders.

## Features

- **Client Management** - Store client info, industry, and contact details
- **Task Tracking** - Assign recurring tasks (daily, weekly, monthly)
- **WhatsApp Reminders** - Automatic notifications at set times
- **Completion Tracking** - Mark tasks complete, view history
- **Dashboard** - Overview of pending, overdue, and due-today tasks

## Quick Setup

### 1. Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Run the complete setup script
\i SETUP_CLIENT_SECRETARY.sql
```

Or manually copy the SQL from `SETUP_CLIENT_SECRETARY.sql` and execute it.

### 2. Environment Variables

Add these to your `.env.local`:

```env
# WhatsApp Business API (required for reminders)
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_API_VERSION=v18.0
NEXT_PUBLIC_BASE_URL=https://thebreed.co.za
```

### 3. Set Up Cron Job

For automated reminders, set up a cron job to call:

```
GET https://thebreed.co.za/api/reminders/cron
```

**Options:**

#### Option A: Vercel Cron (Recommended)
Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/reminders/cron",
      "schedule": "0 9 * * *"
    }
  ]
}
```

This runs daily at 9 AM. Adjust the schedule as needed.

#### Option B: External Cron Service
Use [cron-job.org](https://cron-job.org) or similar to ping the endpoint every hour.

#### Option C: Manual Testing
Visit `/api/reminders/cron` in your browser to trigger manually.

### 4. WhatsApp Business API Setup

1. Apply for WhatsApp Business API at [Meta Business Suite](https://business.facebook.com/)
2. Create templates for reminders (see below)
3. Add your phone number as the recipient
4. Configure the environment variables

### 5. Access the System

Go to: `https://thebreed.co.za/admin/secretary`

## WhatsApp Templates

Create these templates in WhatsApp Manager:

### Template: `work_reminder`

```
📋 *SECRETARY REMINDER*

Hi! This is your work reminder.

*Client:* {{1}}
*Task:* {{2}}
*Frequency:* {{3}}

⏰ This task is due today. Please complete and update the system.

Reply DONE when complete.
```

Variables:
- {{1}} = Client name
- {{2}} = Task name
- {{3}} = Frequency (daily/weekly/monthly)

## Usage

### Adding a Client

1. Click "Add Client"
2. Enter name, company, industry, phone
3. Save

### Adding a Task

1. Click "Add Task"
2. Select client
3. Choose a service or enter custom task name
4. Set reminder frequency (daily/weekly/monthly)
5. Set reminder time
6. Enable WhatsApp reminders
7. Save

### Manual Reminders

Click the 📤 (send) icon next to any task to manually trigger a WhatsApp reminder.

### Marking Complete

Click the ✅ (check) icon to mark a task complete. The system will:
- Log the completion
- Calculate next due date based on frequency
- Update the task

## Database Schema

### Tables Created

- `clients` - Client information
- `services` - Services you offer
- `client_tasks` - Tasks assigned to clients
- `task_completion_log` - History of completed tasks
- `whatsapp_reminders` - Log of sent reminders
- `secretary_settings` - User preferences

### Views

- `tasks_due_today` - Tasks due today with client info
- `client_work_summary` - Aggregated stats per client

## Troubleshooting

### Reminders not sending

1. Check WhatsApp API credentials
2. Verify template is approved
3. Check `/admin/secretary` dashboard for errors
4. Test manually via API: `POST /api/reminders/send`

### Database errors

1. Verify Supabase credentials
2. Check that tables were created by running the SQL
3. Check RLS policies are configured

### Cron job not running

1. Check Vercel dashboard for cron execution logs
2. Verify the endpoint returns 200
3. Test the endpoint manually in browser

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/clients` | GET, POST | List/create clients |
| `/api/clients/[id]` | GET, PUT, DELETE | Manage single client |
| `/api/client-tasks` | GET, POST | List/create tasks |
| `/api/client-tasks/[id]` | GET, PUT, PATCH, DELETE | Manage single task |
| `/api/services` | GET, POST | List services |
| `/api/reminders/send` | POST | Send WhatsApp reminder |
| `/api/reminders/cron` | GET, POST | Check due tasks & send reminders |

## Support

For issues:
1. Check browser console for errors
2. Check Vercel function logs
3. Verify all environment variables are set
4. Ensure WhatsApp templates are approved
