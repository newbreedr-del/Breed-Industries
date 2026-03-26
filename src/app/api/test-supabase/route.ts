import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('quotes')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.error('❌ Connection error:', connectionError);
      return NextResponse.json({
        success: false,
        error: 'Connection failed',
        details: connectionError.message,
        environment: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
        }
      }, { status: 500 });
    }

    // Test 2: Get actual quotes count
    const { data: quotes, error: quotesError } = await supabase
      .from('quotes')
      .select('quote_number, customer_name, total, created_at')
      .order('created_at', { ascending: false });

    if (quotesError) {
      console.error('❌ Quotes query error:', quotesError);
      return NextResponse.json({
        success: false,
        error: 'Quotes query failed',
        details: quotesError.message
      }, { status: 500 });
    }

    console.log('✅ Supabase connection successful!');
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection is working',
      quotesCount: quotes?.length || 0,
      quotes: quotes || [],
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
