export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  pricingType: 'one-time' | 'monthly';
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  oneTimeTotal: number;
  monthlyTotal: number;
  deposit: number;
  balance: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  paidAmount: number;
  paymentDate?: string;
  stitchPaymentId?: string;
  stitchPaymentUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceCreateRequest {
  quoteNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  dueDate: string;
  notes?: string;
}

export interface InvoiceUpdateRequest {
  status?: Invoice['status'];
  paymentStatus?: Invoice['paymentStatus'];
  paidAmount?: number;
  paidDate?: string;
  notes?: string;
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  pageSize: number;
}
