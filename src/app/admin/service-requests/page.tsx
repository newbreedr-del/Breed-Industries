'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { ServiceRequest } from '@/types/serviceRequest';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download,
  Eye,
  Filter
} from 'lucide-react';
import Link from 'next/link';

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' 
        ? '/api/service-requests' 
        : `/api/service-requests?status=${statusFilter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'in-progress':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Header />
      
      <PageHero
        title="Service Requests"
        subtitle="Manage all customer service requests and documentation"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Service Requests', href: '/admin/service-requests' }
        ]}
        size="default"
      >
        <Link href="/admin" className="btn btn-outline">
          Back to Dashboard
        </Link>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Filters */}
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center gap-4">
              <Filter size={20} className="text-accent" />
              <div className="flex gap-2">
                {['all', 'pending', 'in-progress', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-accent text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Requests List */}
          {loading ? (
            <div className="glass-card p-12 text-center">
              <div className="text-white/60">Loading service requests...</div>
            </div>
          ) : requests.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <FileText size={48} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No service requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(request => (
                <div key={request.id} className="glass-card p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{request.serviceName}</h3>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          <span className={`text-sm font-medium ${getStatusColor(request.status)}`}>
                            {request.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Customer:</span>
                          <span className="text-white ml-2">{request.customerName}</span>
                          {request.customerCompany && (
                            <span className="text-white/60 ml-1">({request.customerCompany})</span>
                          )}
                        </div>
                        <div>
                          <span className="text-white/60">Email:</span>
                          <span className="text-white ml-2">{request.customerEmail}</span>
                        </div>
                        {request.customerPhone && (
                          <div>
                            <span className="text-white/60">Phone:</span>
                            <span className="text-white ml-2">{request.customerPhone}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-white/60">Submitted:</span>
                          <span className="text-white ml-2">{formatDate(request.createdAt)}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <FileText size={16} className="text-accent" />
                        <span className="text-white/60 text-sm">
                          {request.documents.length} document{request.documents.length !== 1 ? 's' : ''} uploaded
                        </span>
                      </div>

                      {request.additionalNotes && (
                        <div className="mt-3 p-3 bg-white/5 rounded-lg">
                          <p className="text-white/60 text-sm italic">{request.additionalNotes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/admin/service-requests/${request.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
