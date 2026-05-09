import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET /api/quotes - List all quotes
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Fetching quotes...');
    console.log('🔍 Environment check:', {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
      urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      keyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
    });

    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ API: Supabase error:', error);
      console.error('❌ API: Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json(
        { 
          error: 'Failed to fetch quotes',
          details: error.message,
          code: error.code,
          environment: {
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
            supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
          }
        },
        { status: 500 }
      );
    }

    console.log('✅ API: Successfully fetched quotes:', data?.length || 0);
    return NextResponse.json({ quotes: data || [] });
  } catch (error) {
    console.error('❌ API: Unexpected error:', error);
    console.error('❌ API: Error stack:', error instanceof Error ? error.stack : 'No stack available');
    return NextResponse.json(
      { 
        error: 'Failed to fetch quotes',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
        }
      },
      { status: 500 }
    );
  }
}

// PATCH /api/quotes - Update quote (full update or status only)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Remove id from updates and add updated_at
    const updateData = { ...updates, updated_at: new Date().toISOString() };
    delete updateData.id;

    const { data, error } = await supabaseAdmin
      .from('quotes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating quote:', error);
      return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
    }

    return NextResponse.json({ success: true, quote: data });
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

// DELETE /api/quotes - Delete quote
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    console.log('API: Attempting to delete quote with ID:', id);

    const { data, error } = await supabaseAdmin
      .from('quotes')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('API: Supabase delete error:', error);
      return NextResponse.json({ 
        error: 'Failed to delete quote', 
        details: error.message,
        code: error.code 
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    console.log('API: Quote deleted successfully:', data);
    return NextResponse.json({ 
      success: true, 
      message: 'Quote deleted successfully',
      deleted: data[0]
    });
  } catch (error) {
    console.error('API: Unexpected error deleting quote:', error);
    return NextResponse.json({ 
      error: 'Failed to delete quote', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// POST /api/quotes - Create new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.quote_number || !body.customer_name || !body.customer_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('quotes')
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Error creating quote:', error);
      return NextResponse.json(
        { error: 'Failed to create quote' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quote: data
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
}
