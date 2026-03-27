import { NextRequest, NextResponse } from 'next/server';
import { Invoice, InvoiceCreateRequest } from '@/types/invoice';
import { 
  createInvoice, 
  getInvoices, 
  generateInvoiceNumber 
} from '@/lib/invoiceStorage';

// GET /api/invoices - List invoices with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as Invoice['status'] | null;
    const paymentStatus = searchParams.get('paymentStatus') as Invoice['paymentStatus'] | null;
    const customerEmail = searchParams.get('customerEmail');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const filters: any = { page, pageSize };
    if (status) filters.status = status;
    if (paymentStatus) filters.paymentStatus = paymentStatus;
    if (customerEmail) filters.customerEmail = customerEmail;

    const { invoices, total } = await getInvoices(filters);

    return NextResponse.json({
      invoices,
      total,
      page,
      pageSize
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const body: InvoiceCreateRequest = await request.json();

    // Validate required fields
    if (!body.customerName || !body.customerEmail || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, items' },
        { status: 400 }
      );
    }

    // Calculate totals
    const oneTimeTotal = body.items.reduce((sum, item) => {
      return item.pricingType === 'monthly' ? sum : sum + item.amount;
    }, 0);

    const monthlyTotal = body.items.reduce((sum, item) => {
      return item.pricingType === 'monthly' ? sum + item.amount : sum;
    }, 0);

    const requireDeposit = body.requireDeposit !== false; // default true
    const deposit = requireDeposit ? oneTimeTotal * 0.5 : 0;
    const balance = oneTimeTotal - deposit;
    const totalAmount = oneTimeTotal; // monthly billed separately (first month shown on invoice)

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Create invoice object
    const now = new Date().toISOString();
    const invoice: Invoice = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber,
      quoteNumber: body.quoteNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      items: body.items,
      oneTimeTotal,
      monthlyTotal,
      deposit,
      balance,
      totalAmount,
      status: 'draft',
      paymentStatus: 'unpaid',
      dueDate: body.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      issueDate: now,
      paidAmount: 0,
      notes: body.notes,
      createdAt: now,
      updatedAt: now
    };

    // Save invoice
    const savedInvoice = createInvoice(invoice);

    return NextResponse.json({
      success: true,
      invoice: savedInvoice
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
