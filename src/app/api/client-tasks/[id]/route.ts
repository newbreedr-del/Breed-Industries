import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/client-tasks/[id] - Get single task
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data, error } = await supabase
      .from('client_tasks')
      .select(`
        *,
        clients (id, name, company_name, phone, industry),
        services (name, category, description)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Get reminder history
    const { data: reminders, error: remindersError } = await supabase
      .from('whatsapp_reminders')
      .select('*')
      .eq('task_id', id)
      .order('sent_at', { ascending: false })
      .limit(10);
    
    if (remindersError) throw remindersError;
    
    return NextResponse.json({
      task: data,
      reminders: reminders || []
    });
  } catch (error: any) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT /api/client-tasks/[id] - Update task
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('client_tasks')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ task: data, success: true });
  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}

// PATCH /api/client-tasks/[id] - Mark task complete
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes, completed_by } = body;
    
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (status === 'completed') {
      updates.last_completed_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('client_tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Log completion
    if (status === 'completed') {
      await supabase
        .from('task_completion_log')
        .insert([{
          task_id: id,
          client_id: data.client_id,
          completed_by,
          notes,
          next_scheduled_date: data.next_due_date
        }]);
    }
    
    return NextResponse.json({ task: data, success: true });
  } catch (error: any) {
    console.error('Error updating task status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/client-tasks/[id] - Delete task
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { error } = await supabase
      .from('client_tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete task' },
      { status: 500 }
    );
  }
}
