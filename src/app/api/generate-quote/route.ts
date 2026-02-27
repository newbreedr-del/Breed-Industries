import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    // Send email notification
    const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
    const COMPANY_EMAIL = process.env.COMPANY_EMAIL ?? 'info@thebreed.co.za';

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        
        // Calculate total
        const total = items.reduce((sum: number, item: any) => {
          const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
          return sum + itemTotal;
        }, 0);

        // Format items list
        const itemsList = items.map((item: any, index: number) => 
          `${index + 1}. ${item.description || 'N/A'} - Qty: ${item.quantity || 0} @ R${(item.unitPrice || 0).toFixed(2)} = R${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}`
        ).join('\n');

        const emailContent = `New Quote Request

Quote Number: ${quoteNumber}
Customer: ${customerName}
Email: ${customerEmail}
Project: ${projectName}
Contact Person: ${contactPerson}

Items:
${itemsList}

Total: R${total.toFixed(2)}

Generated: ${new Date().toLocaleString()}`;

        await resend.emails.send({
          from: COMPANY_EMAIL,
          to: COMPANY_EMAIL,
          replyTo: customerEmail,
          subject: `New Quote Request - ${quoteNumber} - ${customerName}`,
          text: emailContent,
        });

        console.log('Quote email sent successfully');
      } catch (emailError) {
        console.error('Failed to send quote email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Quote generated successfully',
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
