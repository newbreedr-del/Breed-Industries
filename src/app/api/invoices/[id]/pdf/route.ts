import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById } from '@/lib/invoiceStorage';
import { generateInvoicePDF } from '@/lib/pdf/breedPdf';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const pdfBuffer = generateInvoicePDF({
      invoiceNumber:   invoice.invoiceNumber,
      quoteNumber:     invoice.quoteNumber,
      customerName:    invoice.customerName,
      customerEmail:   invoice.customerEmail,
      customerPhone:   invoice.customerPhone,
      customerAddress: invoice.customerAddress,
      items:           invoice.items,
      oneTimeTotal:    invoice.oneTimeTotal,
      monthlyTotal:    invoice.monthlyTotal,
      deposit:         invoice.deposit,
      balance:         invoice.balance,
      totalAmount:     invoice.totalAmount,
      status:          invoice.status,
      paymentStatus:   invoice.paymentStatus,
      dueDate:         invoice.dueDate,
      issueDate:       invoice.issueDate,
      notes:           invoice.notes,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Breed_Industries_Invoice_${invoice.invoiceNumber}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice PDF' },
      { status: 500 }
    );
  }
}
