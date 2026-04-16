'use client';

import { useState } from 'react';
import { serviceDefinitions, ServiceDefinition, ServiceDocument } from '@/data/serviceDefinitions';
import { ServiceRequestDocument } from '@/types/serviceRequest';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ServiceRequestFormProps {
  preselectedServiceId?: string;
  onSuccess?: (requestId: string) => void;
}

export default function ServiceRequestForm({ preselectedServiceId, onSuccess }: ServiceRequestFormProps) {
  const [selectedService, setSelectedService] = useState<ServiceDefinition | null>(
    preselectedServiceId ? serviceDefinitions.find(s => s.id === preselectedServiceId) || null : null
  );
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [documents, setDocuments] = useState<Map<string, File>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    const service = serviceDefinitions.find(s => s.id === serviceId);
    setSelectedService(service || null);
    setDocuments(new Map());
  };

  const handleFileSelect = (documentName: string, file: File | null) => {
    const newDocs = new Map(documents);
    if (file) {
      newDocs.set(documentName, file);
    } else {
      newDocs.delete(documentName);
    }
    setDocuments(newDocs);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedService) {
      setError('Please select a service');
      return;
    }

    if (!customerName || !customerEmail) {
      setError('Please fill in all required fields');
      return;
    }

    const requiredDocs = selectedService.requiredDocuments.filter(doc => doc.required);
    const missingDocs = requiredDocs.filter(doc => !documents.has(doc.name));
    
    if (missingDocs.length > 0) {
      setError(`Please upload required documents: ${missingDocs.map(d => d.name).join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const requestDocuments: ServiceRequestDocument[] = [];

      for (const [docName, file] of documents.entries()) {
        const fileData = await convertFileToBase64(file);
        requestDocuments.push({
          documentName: docName,
          fileName: file.name,
          fileData,
          fileType: file.type,
          fileSize: file.size,
          uploadedAt: new Date().toISOString()
        });
      }

      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          customerName,
          customerEmail,
          customerPhone,
          customerCompany,
          documents: requestDocuments,
          additionalNotes
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        if (onSuccess) {
          onSuccess(data.request.id);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit service request');
      }
    } catch (err) {
      console.error('Error submitting service request:', err);
      setError('An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Request Submitted Successfully!</h2>
        <p className="text-white/70 mb-6">
          We've received your service request and will get back to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false);
            setSelectedService(null);
            setCustomerName('');
            setCustomerEmail('');
            setCustomerPhone('');
            setCustomerCompany('');
            setAdditionalNotes('');
            setDocuments(new Map());
          }}
          className="btn btn-primary"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Service Selection */}
      {!preselectedServiceId && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">Select Service</h3>
          <select
            value={selectedService?.id || ''}
            onChange={(e) => handleServiceSelect(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
            required
          >
            <option value="">Choose a service...</option>
            {serviceDefinitions.map(service => (
              <option key={service.id} value={service.id}>
                {service.category} - {service.name} {service.basePrice && `(${service.basePrice})`}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedService && (
        <>
          {/* Service Details */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">{selectedService.name}</h3>
            <p className="text-white/70 mb-2">{selectedService.description}</p>
            {selectedService.basePrice && (
              <p className="text-accent font-semibold">{selectedService.basePrice}</p>
            )}
            {selectedService.additionalInfo && (
              <p className="text-white/60 text-sm mt-2 italic">{selectedService.additionalInfo}</p>
            )}
          </div>

          {/* Customer Information */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Email Address *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Company Name</label>
                <input
                  type="text"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Required Documents</h3>
            <div className="space-y-4">
              {selectedService.requiredDocuments.map((doc) => (
                <div key={doc.name} className="border border-white/10 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        {doc.name}
                        {doc.required && <span className="text-red-500 text-sm">*</span>}
                      </h4>
                      <p className="text-white/60 text-sm mt-1">{doc.description}</p>
                      {doc.acceptedFormats && (
                        <p className="text-white/40 text-xs mt-1">
                          Accepted formats: {doc.acceptedFormats.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {documents.has(doc.name) ? (
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 mt-2">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-accent" />
                        <span className="text-white text-sm">{documents.get(doc.name)?.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileSelect(doc.name, null)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-white/20 rounded-lg p-4 mt-2 cursor-pointer hover:border-accent/50 transition-colors">
                      <Upload size={20} className="text-white/60" />
                      <span className="text-white/60 text-sm">Click to upload</span>
                      <input
                        type="file"
                        accept={doc.acceptedFormats?.join(',') || '*'}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(doc.name, file);
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Additional Information</h3>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              placeholder="Any additional information or special requirements..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText size={20} />
                  Submit Service Request
                </>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
