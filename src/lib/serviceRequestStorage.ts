import { supabase } from './supabase';
import { ServiceRequest, ServiceRequestCreateRequest, ServiceRequestUpdateRequest } from '@/types/serviceRequest';

const dbToServiceRequest = (row: any): ServiceRequest => {
  return {
    id: row.id,
    serviceId: row.service_id,
    serviceName: row.service_name,
    serviceCategory: row.service_category,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerCompany: row.customer_company,
    documents: row.documents || [],
    additionalNotes: row.additional_notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assignedTo: row.assigned_to,
    estimatedPrice: row.estimated_price ? parseFloat(row.estimated_price) : undefined,
    quoteSent: row.quote_sent,
    quoteId: row.quote_id
  };
};

const serviceRequestToDb = (request: Partial<ServiceRequest>) => {
  return {
    id: request.id,
    service_id: request.serviceId,
    service_name: request.serviceName,
    service_category: request.serviceCategory,
    customer_name: request.customerName,
    customer_email: request.customerEmail,
    customer_phone: request.customerPhone,
    customer_company: request.customerCompany,
    documents: request.documents,
    additional_notes: request.additionalNotes,
    status: request.status,
    created_at: request.createdAt,
    updated_at: request.updatedAt,
    assigned_to: request.assignedTo,
    estimated_price: request.estimatedPrice,
    quote_sent: request.quoteSent,
    quote_id: request.quoteId
  };
};

export async function createServiceRequest(data: ServiceRequestCreateRequest & { serviceName: string; serviceCategory: string }): Promise<ServiceRequest> {
  const now = new Date().toISOString();
  const id = `sreq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const request: ServiceRequest = {
    id,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    serviceCategory: data.serviceCategory,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    customerCompany: data.customerCompany,
    documents: data.documents,
    additionalNotes: data.additionalNotes,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };

  const dbRequest = serviceRequestToDb(request);

  const { data: inserted, error } = await supabase
    .from('service_requests')
    .insert([dbRequest])
    .select()
    .single();

  if (error) {
    console.error('Error creating service request:', error);
    throw new Error(`Failed to create service request: ${error.message}`);
  }

  return dbToServiceRequest(inserted);
}

export async function getServiceRequestById(id: string): Promise<ServiceRequest | null> {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching service request:', error);
    throw new Error(`Failed to fetch service request: ${error.message}`);
  }

  return data ? dbToServiceRequest(data) : null;
}

export async function updateServiceRequest(id: string, updates: ServiceRequestUpdateRequest): Promise<ServiceRequest | null> {
  const dbUpdates: any = {};

  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
  if (updates.estimatedPrice !== undefined) dbUpdates.estimated_price = updates.estimatedPrice;
  if (updates.quoteSent !== undefined) dbUpdates.quote_sent = updates.quoteSent;
  if (updates.quoteId !== undefined) dbUpdates.quote_id = updates.quoteId;
  if (updates.additionalNotes !== undefined) dbUpdates.additional_notes = updates.additionalNotes;

  const { data, error } = await supabase
    .from('service_requests')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service request:', error);
    throw new Error(`Failed to update service request: ${error.message}`);
  }

  return data ? dbToServiceRequest(data) : null;
}

export async function deleteServiceRequest(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('service_requests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service request:', error);
    throw new Error(`Failed to delete service request: ${error.message}`);
  }

  return true;
}

export async function getServiceRequests(filters?: {
  status?: string;
  serviceId?: string;
  customerEmail?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('service_requests')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.serviceId) {
    query = query.eq('service_id', filters.serviceId);
  }

  if (filters?.customerEmail) {
    query = query.eq('customer_email', filters.customerEmail);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching service requests:', error);
    throw new Error(`Failed to fetch service requests: ${error.message}`);
  }

  return {
    requests: data ? data.map(dbToServiceRequest) : [],
    total: count || 0
  };
}

export async function uploadServiceDocument(file: File, requestId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${requestId}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('service-documents')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading document:', error);
    throw new Error(`Failed to upload document: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('service-documents')
    .getPublicUrl(fileName);

  return publicUrl;
}
