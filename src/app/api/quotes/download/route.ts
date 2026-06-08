import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateQuotePDF, QuoteData } from '@/lib/pdf/breedPdf';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quoteId = searchParams.get('id');

    if (!quoteId) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    // Fetch quote from database
    const { data: quote, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (error || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Prepare quote data for PDF generation
    const date = new Date(quote.created_at).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const validUntil = new Date(new Date(quote.created_at).getTime() + 30 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

    const quoteData: QuoteData = {
      quoteNumber: quote.quote_number,
      customerName: quote.customer_name,
      customerCompany: quote.customer_company || '',
      customerAddress: quote.customer_address || '',
      customerEmail: quote.customer_email,
      customerPhone: quote.customer_phone || '',
      projectName: quote.project_name,
      contactPerson: quote.contact_person,
      paymentTerms: quote.payment_terms || '50% Upfront',
      requireDeposit: quote.require_deposit ?? true,
      items: quote.items || [],
      notes: quote.notes || '',
      date,
      validUntil,
    };

    // Generate PDF
    const pdfBuffer = generateQuotePDF(quoteData);

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${quote.quote_number}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating quote PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}
