export interface ServiceRequestDocument {
  documentName: string;
  fileName: string;
  fileUrl?: string;
  fileData?: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  documents: ServiceRequestDocument[];
  additionalNotes?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  estimatedPrice?: number;
  quoteSent?: boolean;
  quoteId?: string;
}

export interface ServiceRequestCreateRequest {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  documents: ServiceRequestDocument[];
  additionalNotes?: string;
}

export interface ServiceRequestUpdateRequest {
  status?: ServiceRequest['status'];
  assignedTo?: string;
  estimatedPrice?: number;
  quoteSent?: boolean;
  quoteId?: string;
  additionalNotes?: string;
}

export interface ServiceRequestListResponse {
  requests: ServiceRequest[];
  total: number;
  page: number;
  limit: number;
}
