'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { ServiceRequest } from '@/types/serviceRequest';
import { 
  FileText, 
  Download, 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function ServiceRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchRequest(params.id as string);
    }
  }, [params.id]);

  const fetchRequest = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/service-requests/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRequest(data.request);
      } else {
        alert('Service request not found');
        router.push('/admin/service-requests');
      }
    } catch (error) {
      console.error('Error fetching service request:', error);
      alert('Failed to load service request');
      router.push('/admin/service-requests');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: ServiceRequest['status']) => {
    if (!request) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/service-requests/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        setRequest(data.request);
        alert('Status updated successfully');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const downloadDocument = (doc: any) => {
    if (doc.fileData) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.fileName;
      link.click();
    } else if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-color-bg-secondary">
          <div className="text-white text-xl">Loading service request...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!request) {
    return null;
  }

  return (
    <>
      <Header />
      
      <PageHero
        title={`Service Request: ${request.serviceName}`}
        subtitle={`Request ID: ${request.id}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Service Requests', href: '/admin/service-requests' },
          { label: request.id, href: `/admin/service-requests/${request.id}` }
        ]}
        size="default"
      >
        <Link href="/admin/service-requests" className="btn btn-outline">
          <ArrowLeft size={16} />
          Back to Requests
        </Link>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <User size={20} className="text-accent" />
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-white/60 mt-1" />
                    <div>
                      <div className="text-white/60 text-sm">Name</div>
                      <div className="text-white font-medium">{request.customerName}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-white/60 mt-1" />
                    <div>
                      <div className="text-white/60 text-sm">Email</div>
                      <div className="text-white font-medium">{request.customerEmail}</div>
                    </div>
                  </div>
                  {request.customerPhone && (
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="text-white/60 mt-1" />
                      <div>
                        <div className="text-white/60 text-sm">Phone</div>
                        <div className="text-white font-medium">{request.customerPhone}</div>
                      </div>
                    </div>
                  )}
                  {request.customerCompany && (
                    <div className="flex items-start gap-3">
                      <Building size={16} className="text-white/60 mt-1" />
                      <div>
                        <div className="text-white/60 text-sm">Company</div>
                        <div className="text-white font-medium">{request.customerCompany}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-accent" />
                  Uploaded Documents ({request.documents.length})
                </h2>
                <div className="space-y-3">
                  {request.documents.map((doc, index) => (
                    <div key={index} className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{doc.documentName}</h3>
                          <p className="text-white/60 text-sm mt-1">{doc.fileName}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                            <span>{formatFileSize(doc.fileSize)}</span>
                            <span>Uploaded: {formatDate(doc.uploadedAt)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadDocument(doc)}
                          className="btn btn-outline btn-sm"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              {request.additionalNotes && (
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Additional Notes</h2>
                  <p className="text-white/70 whitespace-pre-wrap">{request.additionalNotes}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Status</h2>
                <div className="space-y-3">
                  {(['pending', 'in-progress', 'completed', 'cancelled'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(status)}
                      disabled={updating || request.status === status}
                      className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                        request.status === status
                          ? 'bg-accent text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Request Details */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Request Details</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-white/60">Service Category</div>
                    <div className="text-white font-medium">{request.serviceCategory}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Service</div>
                    <div className="text-white font-medium">{request.serviceName}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Submitted</div>
                    <div className="text-white font-medium">{formatDate(request.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Last Updated</div>
                    <div className="text-white font-medium">{formatDate(request.updatedAt)}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
                <div className="space-y-2">
                  <Link
                    href={`/admin/quotes/create?customer=${encodeURIComponent(request.customerEmail)}`}
                    className="btn btn-primary w-full"
                  >
                    Create Quote
                  </Link>
                  <Link
                    href={`/admin/invoices/create?customer=${encodeURIComponent(request.customerEmail)}`}
                    className="btn btn-outline w-full"
                  >
                    Create Invoice
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
