import { Invoice } from '@/types/invoice';
import { supabase } from './supabase';

// Convert database row to Invoice type
function dbToInvoice(row: any): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    quoteNumber: row.quote_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    items: row.items,
    oneTimeTotal: parseFloat(row.one_time_total),
    monthlyTotal: parseFloat(row.monthly_total),
    deposit: parseFloat(row.deposit),
    balance: parseFloat(row.balance),
    totalAmount: parseFloat(row.total_amount),
    status: row.status,
    paymentStatus: row.payment_status,
    dueDate: row.due_date,
    issueDate: row.issue_date,
    paidDate: row.paid_date,
    paidAmount: parseFloat(row.paid_amount || 0),
    paymentDate: row.payment_date,
    stitchPaymentId: row.stitch_payment_id,
    stitchPaymentUrl: row.stitch_payment_url,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Convert Invoice to database row
function invoiceToDb(invoice: Invoice) {
  return {
    id: invoice.id,
    invoice_number: invoice.invoiceNumber,
    quote_number: invoice.quoteNumber,
    customer_name: invoice.customerName,
    customer_email: invoice.customerEmail,
    customer_phone: invoice.customerPhone,
    customer_address: invoice.customerAddress,
    items: invoice.items,
    one_time_total: invoice.oneTimeTotal,
    monthly_total: invoice.monthlyTotal,
    deposit: invoice.deposit,
    balance: invoice.balance,
    total_amount: invoice.totalAmount,
    status: invoice.status,
    payment_status: invoice.paymentStatus,
    due_date: invoice.dueDate,
    issue_date: invoice.issueDate,
    paid_date: invoice.paidDate,
    paid_amount: invoice.paidAmount,
    payment_date: invoice.paymentDate,
    stitch_payment_id: invoice.stitchPaymentId,
    stitch_payment_url: invoice.stitchPaymentUrl,
    notes: invoice.notes
  };
}

// Read all invoices
export async function readInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error reading invoices:', error);
    return [];
  }

  return (data || []).map(dbToInvoice);
}

// Write all invoices (not used with Supabase, kept for compatibility)
export async function writeInvoices(invoices: Invoice[]): Promise<void> {
  console.warn('writeInvoices is deprecated with Supabase');
}

// Get invoice by ID
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error getting invoice:', error);
    return null;
  }

  return data ? dbToInvoice(data) : null;
}

// Get invoice by invoice number
export async function getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('invoice_number', invoiceNumber)
    .single();

  if (error) {
    console.error('Error getting invoice by number:', error);
    return null;
  }

  return data ? dbToInvoice(data) : null;
}

// Create new invoice
export async function createInvoice(invoice: Invoice): Promise<Invoice> {
  const dbInvoice = invoiceToDb(invoice);
  
  const { data, error } = await supabase
    .from('invoices')
    .insert(dbInvoice)
    .select()
    .single();

  if (error) {
    console.error('Error creating invoice:', error);
    throw new Error('Failed to create invoice');
  }

  return dbToInvoice(data);
}

// Update invoice
export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice | null> {
  const dbUpdates = {
    ...invoiceToDb(updates as Invoice),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('invoices')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating invoice:', error);
    return null;
  }

  return data ? dbToInvoice(data) : null;
}

// Delete invoice
export async function deleteInvoice(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }

  return true;
}

// Generate next invoice number
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const prefix = `INV-${year}${month}`;

  const { data, error } = await supabase
    .from('invoices')
    .select('invoice_number')
    .like('invoice_number', `${prefix}%`)
    .order('invoice_number', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error generating invoice number:', error);
    return `${prefix}-0001`;
  }

  let nextNumber = 1;
  if (data && data.length > 0) {
    const lastNumber = data[0].invoice_number;
    const parts = lastNumber.split('-');
    nextNumber = parseInt(parts[parts.length - 1], 10) + 1;
  }

  return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
}

// Get invoices with filters
export async function getInvoices(filters?: {
  status?: Invoice['status'];
  paymentStatus?: Invoice['paymentStatus'];
  customerEmail?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ invoices: Invoice[]; total: number }> {
  let query = supabase.from('invoices').select('*', { count: 'exact' });

  // Apply filters
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.paymentStatus) {
    query = query.eq('payment_status', filters.paymentStatus);
  }
  if (filters?.customerEmail) {
    query = query.ilike('customer_email', `%${filters.customerEmail}%`);
  }

  // Sort by creation date (newest first)
  query = query.order('created_at', { ascending: false });

  // Apply pagination
  if (filters?.page && filters?.pageSize) {
    const start = (filters.page - 1) * filters.pageSize;
    const end = start + filters.pageSize - 1;
    query = query.range(start, end);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error getting invoices:', error);
    return { invoices: [], total: 0 };
  }

  return {
    invoices: (data || []).map(dbToInvoice),
    total: count || 0
  };
}
