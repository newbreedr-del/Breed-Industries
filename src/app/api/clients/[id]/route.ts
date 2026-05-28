import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET /api/clients/[id] - Get single client with tasks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (clientError) throw clientError;
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    
    // Get client's tasks with service details
    const { data: tasks, error: tasksError } = await supabase
      .from('client_tasks')
      .select(`
        *,
        services (name, category, description)
      `)
      .eq('client_id', id)
      .order('created_at', { ascending: false });
    
    if (tasksError) throw tasksError;
    
    // Get completion history
    const { data: completionHistory, error: historyError } = await supabase
      .from('task_completion_log')
      .select('*')
      .eq('client_id', id)
      .order('completed_at', { ascending: false })
      .limit(20);
    
    if (historyError) throw historyError;
    
    return NextResponse.json({
      client,
      tasks: tasks || [],
      completionHistory: completionHistory || []
    });
  } catch (error: any) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Update client
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ client: data, success: true });
  } catch (error: any) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update client' },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Delete client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete client' },
      { status: 500 }
    );
  }
}
