import fs from 'fs';
import path from 'path';
import { Invoice } from '@/types/invoice';

const INVOICES_DIR = path.join(process.cwd(), 'data', 'invoices');
const INVOICES_FILE = path.join(INVOICES_DIR, 'invoices.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(INVOICES_DIR)) {
    fs.mkdirSync(INVOICES_DIR, { recursive: true });
  }
  if (!fs.existsSync(INVOICES_FILE)) {
    fs.writeFileSync(INVOICES_FILE, JSON.stringify([], null, 2));
  }
}

// Read all invoices
export function readInvoices(): Invoice[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(INVOICES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading invoices:', error);
    return [];
  }
}

// Write all invoices
export function writeInvoices(invoices: Invoice[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(INVOICES_FILE, JSON.stringify(invoices, null, 2));
  } catch (error) {
    console.error('Error writing invoices:', error);
    throw new Error('Failed to save invoices');
  }
}

// Get invoice by ID
export function getInvoiceById(id: string): Invoice | null {
  const invoices = readInvoices();
  return invoices.find(inv => inv.id === id) || null;
}

// Get invoice by invoice number
export function getInvoiceByNumber(invoiceNumber: string): Invoice | null {
  const invoices = readInvoices();
  return invoices.find(inv => inv.invoiceNumber === invoiceNumber) || null;
}

// Create new invoice
export function createInvoice(invoice: Invoice): Invoice {
  const invoices = readInvoices();
  invoices.push(invoice);
  writeInvoices(invoices);
  return invoice;
}

// Update invoice
export function updateInvoice(id: string, updates: Partial<Invoice>): Invoice | null {
  const invoices = readInvoices();
  const index = invoices.findIndex(inv => inv.id === id);
  
  if (index === -1) {
    return null;
  }
  
  invoices[index] = {
    ...invoices[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  writeInvoices(invoices);
  return invoices[index];
}

// Delete invoice
export function deleteInvoice(id: string): boolean {
  const invoices = readInvoices();
  const filteredInvoices = invoices.filter(inv => inv.id !== id);
  
  if (filteredInvoices.length === invoices.length) {
    return false;
  }
  
  writeInvoices(filteredInvoices);
  return true;
}

// Generate next invoice number
export function generateInvoiceNumber(): string {
  const invoices = readInvoices();
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Find highest invoice number for current month
  const prefix = `INV-${year}${month}`;
  const monthInvoices = invoices.filter(inv => inv.invoiceNumber.startsWith(prefix));
  
  let nextNumber = 1;
  if (monthInvoices.length > 0) {
    const numbers = monthInvoices.map(inv => {
      const parts = inv.invoiceNumber.split('-');
      return parseInt(parts[parts.length - 1], 10);
    });
    nextNumber = Math.max(...numbers) + 1;
  }
  
  return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
}

// Get invoices with filters
export function getInvoices(filters?: {
  status?: Invoice['status'];
  paymentStatus?: Invoice['paymentStatus'];
  customerEmail?: string;
  page?: number;
  pageSize?: number;
}): { invoices: Invoice[]; total: number } {
  let invoices = readInvoices();
  
  // Apply filters
  if (filters?.status) {
    invoices = invoices.filter(inv => inv.status === filters.status);
  }
  if (filters?.paymentStatus) {
    invoices = invoices.filter(inv => inv.paymentStatus === filters.paymentStatus);
  }
  if (filters?.customerEmail) {
    invoices = invoices.filter(inv => 
      inv.customerEmail.toLowerCase().includes(filters.customerEmail!.toLowerCase())
    );
  }
  
  // Sort by creation date (newest first)
  invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const total = invoices.length;
  
  // Apply pagination
  if (filters?.page && filters?.pageSize) {
    const start = (filters.page - 1) * filters.pageSize;
    const end = start + filters.pageSize;
    invoices = invoices.slice(start, end);
  }
  
  return { invoices, total };
}
