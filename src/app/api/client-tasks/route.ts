import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET /api/client-tasks - List all tasks with client info
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const frequency = searchParams.get('frequency');
    const dueToday = searchParams.get('dueToday');
    
    let query = supabase
      .from('client_tasks')
      .select(`
        *,
        clients (id, name, company_name, phone, industry),
        services (name, category, description)
      `)
      .order('next_due_date', { ascending: true });
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (frequency) {
      query = query.eq('reminder_frequency', frequency);
    }
    
    if (dueToday === 'true') {
      query = query.lte('next_due_date', new Date().toISOString().split('T')[0]);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ tasks: data, total: data?.length || 0 });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/client-tasks - Create new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      client_id,
      service_id,
      task_name,
      task_description,
      reminder_frequency,
      reminder_day,
      reminder_time,
      priority,
      whatsapp_enabled,
      whatsapp_number,
      next_due_date
    } = body;
    
    if (!client_id || !task_name || !reminder_frequency) {
      return NextResponse.json(
        { error: 'Client ID, task name, and reminder frequency are required' },
        { status: 400 }
      );
    }
    
    // Calculate next due date if not provided
    let calculatedDueDate = next_due_date;
    if (!calculatedDueDate) {
      const today = new Date();
      if (reminder_frequency === 'daily') {
        calculatedDueDate = today.toISOString().split('T')[0];
      } else if (reminder_frequency === 'weekly') {
        // Set to next occurrence of reminder_day
        const dayDiff = (reminder_day - today.getDay() + 7) % 7;
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + dayDiff);
        calculatedDueDate = nextDate.toISOString().split('T')[0];
      } else if (reminder_frequency === 'monthly') {
        // Set to reminder_day of current or next month
        const targetDay = reminder_day || 1;
        const targetMonth = targetDay >= today.getDate() ? today.getMonth() : today.getMonth() + 1;
        const targetDate = new Date(today.getFullYear(), targetMonth, targetDay);
        calculatedDueDate = targetDate.toISOString().split('T')[0];
      }
    }
    
    const { data, error } = await supabase
      .from('client_tasks')
      .insert([{
        client_id,
        service_id,
        task_name,
        task_description,
        reminder_frequency,
        reminder_day,
        reminder_time: reminder_time || '09:00',
        priority: priority || 'medium',
        status: 'pending',
        whatsapp_enabled: whatsapp_enabled !== false,
        whatsapp_number,
        next_due_date: calculatedDueDate
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ task: data, success: true });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create task' },
      { status: 500 }
    );
  }
}
