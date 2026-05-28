import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

// This endpoint should be called by a cron job (e.g., Vercel Cron, or external scheduler)
// It checks for due tasks and sends WhatsApp reminders

// GET /api/reminders/cron - Check and send due reminders
export async function GET(request: Request) {
  try {
    // Get current time info
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    const currentDate = now.getDate();
    
    // Find tasks that:
    // 1. Are pending or in_progress
    // 2. Are due (next_due_date <= today)
    // 3. Have WhatsApp enabled
    // 4. Match reminder_time (within 5-minute window)
    
    const { data: dueTasks, error } = await supabase
      .from('client_tasks')
      .select(`
        *,
        clients (id, name, company_name, phone)
      `)
      .in('status', ['pending', 'in_progress'])
      .lte('next_due_date', now.toISOString().split('T')[0])
      .eq('whatsapp_enabled', true);
    
    if (error) throw error;
    
    if (!dueTasks || dueTasks.length === 0) {
      return NextResponse.json({ message: 'No due tasks found', sent: 0 });
    }
    
    // Filter tasks by reminder_time and frequency
    const tasksToRemind = dueTasks.filter((task: any) => {
      const reminderTime = task.reminder_time || '09:00';
      const frequency = task.reminder_frequency;
      const reminderDay = task.reminder_day;
      
      // Check if it's within 5 minutes of reminder time
      const [reminderHour, reminderMinute] = reminderTime.split(':').map(Number);
      const timeDiff = Math.abs(
        (currentHour * 60 + currentMinute) - (reminderHour * 60 + reminderMinute)
      );
      
      if (timeDiff > 5) return false;
      
      // Check frequency conditions
      if (frequency === 'daily') return true;
      if (frequency === 'weekly' && reminderDay === currentDay) return true;
      if (frequency === 'monthly' && reminderDay === currentDate) return true;
      
      return false;
    });
    
    // Send reminders
    let sent = 0;
    let failed = 0;
    
    for (const task of tasksToRemind) {
      try {
        // Call the send reminder endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/reminders/send`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task_id: task.id, manual: false })
          }
        );
        
        if (response.ok) {
          sent++;
        } else {
          failed++;
        }
      } catch (err) {
        console.error(`Failed to send reminder for task ${task.id}:`, err);
        failed++;
      }
    }
    
    return NextResponse.json({
      message: 'Cron job completed',
      checked: dueTasks.length,
      matched: tasksToRemind.length,
      sent,
      failed,
      timestamp: now.toISOString()
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Cron job failed' },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: Request) {
  return GET(request);
}
