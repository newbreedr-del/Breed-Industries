import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  console.log('API route called');
  
  try {
    // Parse request body
    const data = await req.json();
    console.log('Request data received:', { ...data, customerEmail: data.customerEmail ? '[REDACTED]' : 'MISSING' });
    
    const {
      customerName = '',
      customerEmail = '',
      projectName = '',
      contactPerson = '',
      items = []
    } = data ?? {};

    // Basic validation
    if (!customerName.trim() || !customerEmail.trim() || !projectName.trim() || !contactPerson.trim()) {
      return NextResponse.json(
        { error: 'Customer name, email, project name, and contact person are required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one quote item is required.' },
        { status: 400 }
      );
    }

    // Generate quote number
    const quoteNumber = `Q-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    console.log('Quote generated successfully:', quoteNumber);

    // For now, just return success without sending emails
    return NextResponse.json({ 
      success: true, 
      message: 'Quote generated successfully (emails disabled for testing)',
      quoteNumber
    });
    
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quote' },
      { status: 500 }
    );
  }
}
