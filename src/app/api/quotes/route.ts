import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    const { data, error } = await supabase
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
