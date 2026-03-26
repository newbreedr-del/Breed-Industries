import { Invoice } from '@/types/invoice';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';

const INVOICES_COLLECTION = 'invoices';

// Convert Firestore document to Invoice type
function docToInvoice(id: string, data: DocumentData): Invoice {
  return {
    id,
    invoiceNumber: data.invoiceNumber,
    quoteNumber: data.quoteNumber,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    customerAddress: data.customerAddress,
    items: data.items,
    oneTimeTotal: data.oneTimeTotal,
    monthlyTotal: data.monthlyTotal,
    deposit: data.deposit,
    balance: data.balance,
    totalAmount: data.totalAmount,
    status: data.status,
    paymentStatus: data.paymentStatus,
    dueDate: data.dueDate,
    issueDate: data.issueDate,
    paidDate: data.paidDate,
    paidAmount: data.paidAmount || 0,
    paymentDate: data.paymentDate,
    stitchPaymentId: data.stitchPaymentId,
    stitchPaymentUrl: data.stitchPaymentUrl,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

// Convert Invoice to Firestore document
function invoiceToDoc(invoice: Invoice) {
  return {
    invoiceNumber: invoice.invoiceNumber,
    quoteNumber: invoice.quoteNumber,
    customerName: invoice.customerName,
    customerEmail: invoice.customerEmail,
    customerPhone: invoice.customerPhone,
    customerAddress: invoice.customerAddress,
    items: invoice.items,
    oneTimeTotal: invoice.oneTimeTotal,
    monthlyTotal: invoice.monthlyTotal,
    deposit: invoice.deposit,
    balance: invoice.balance,
    totalAmount: invoice.totalAmount,
    status: invoice.status,
    paymentStatus: invoice.paymentStatus,
    dueDate: invoice.dueDate,
    issueDate: invoice.issueDate,
    paidDate: invoice.paidDate,
    paidAmount: invoice.paidAmount,
    paymentDate: invoice.paymentDate,
    stitchPaymentId: invoice.stitchPaymentId,
    stitchPaymentUrl: invoice.stitchPaymentUrl,
    notes: invoice.notes,
    createdAt: invoice.createdAt,
    updatedAt: invoice.updatedAt
  };
}

// Read all invoices
export async function readInvoices(): Promise<Invoice[]> {
  try {
    const invoicesRef = collection(db, INVOICES_COLLECTION);
    const q = query(invoicesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => docToInvoice(doc.id, doc.data()));
  } catch (error) {
    console.error('Error reading invoices:', error);
    return [];
  }
}

// Write all invoices (not used with Firebase, kept for compatibility)
export async function writeInvoices(invoices: Invoice[]): Promise<void> {
  console.warn('writeInvoices is deprecated with Firebase');
}

// Get invoice by ID
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const docRef = doc(db, INVOICES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return docToInvoice(docSnap.id, docSnap.data());
  } catch (error) {
    console.error('Error getting invoice:', error);
    return null;
  }
}

// Get invoice by invoice number
export async function getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
  try {
    const invoicesRef = collection(db, INVOICES_COLLECTION);
    const q = query(invoicesRef, where('invoiceNumber', '==', invoiceNumber), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return docToInvoice(doc.id, doc.data());
  } catch (error) {
    console.error('Error getting invoice by number:', error);
    return null;
  }
}

// Create new invoice
export async function createInvoice(invoice: Invoice): Promise<Invoice> {
  try {
    const invoicesRef = collection(db, INVOICES_COLLECTION);
    const docData = invoiceToDoc(invoice);
    
    // Add document with auto-generated ID
    const docRef = await addDoc(invoicesRef, docData);
    
    // Return invoice with the generated ID
    return { ...invoice, id: docRef.id };
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw new Error('Failed to create invoice');
  }
}

// Update invoice
export async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice | null> {
  try {
    const docRef = doc(db, INVOICES_COLLECTION, id);
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    
    // Fetch and return updated invoice
    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) {
      return null;
    }
    
    return docToInvoice(updatedDoc.id, updatedDoc.data());
  } catch (error) {
    console.error('Error updating invoice:', error);
    return null;
  }
}

// Delete invoice
export async function deleteInvoice(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, INVOICES_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }
}

// Generate next invoice number
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const prefix = `INV-${year}${month}`;

  try {
    const invoicesRef = collection(db, INVOICES_COLLECTION);
    const q = query(
      invoicesRef,
      where('invoiceNumber', '>=', prefix),
      where('invoiceNumber', '<', `${prefix}\uf8ff`),
      orderBy('invoiceNumber', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);

    let nextNumber = 1;
    if (!querySnapshot.empty) {
      const lastInvoice = querySnapshot.docs[0].data();
      const lastNumber = lastInvoice.invoiceNumber;
      const parts = lastNumber.split('-');
      nextNumber = parseInt(parts[parts.length - 1], 10) + 1;
    }

    return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    return `${prefix}-0001`;
  }
}

// Get invoices with filters
export async function getInvoices(filters?: {
  status?: Invoice['status'];
  paymentStatus?: Invoice['paymentStatus'];
  customerEmail?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ invoices: Invoice[]; total: number }> {
  try {
    const invoicesRef = collection(db, INVOICES_COLLECTION);
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.paymentStatus) {
      constraints.push(where('paymentStatus', '==', filters.paymentStatus));
    }
    if (filters?.customerEmail) {
      constraints.push(where('customerEmail', '==', filters.customerEmail));
    }

    // Sort by creation date (newest first)
    constraints.push(orderBy('createdAt', 'desc'));

    // Apply pagination limit
    if (filters?.pageSize) {
      constraints.push(limit(filters.pageSize));
    }

    const q = query(invoicesRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const invoices = querySnapshot.docs.map(doc => docToInvoice(doc.id, doc.data()));

    // Note: Firebase doesn't provide total count easily, so we return the current page count
    // For accurate total, you'd need a separate count query or maintain a counter
    return {
      invoices,
      total: invoices.length
    };
  } catch (error) {
    console.error('Error getting invoices:', error);
    return { invoices: [], total: 0 };
  }
}
