'use client';

import { useState } from 'react';
import { theme } from '@/lib/theme';

export interface CustomerData {
  customerName: string;
  customerCompany: string;
  customerAddress: string;
  customerEmail: string;
  customerPhone: string;
  projectName: string;
  contactPerson: string;
  paymentTerms: string;
  notes: string;
  requireDeposit: boolean;
}

interface QuoteFormProps {
  onSubmit: (data: CustomerData) => void;
  initialData?: Partial<CustomerData>;
}

export function QuoteForm({ onSubmit, initialData }: QuoteFormProps) {
  const [formData, setFormData] = useState<CustomerData>({
    customerName: initialData?.customerName || '',
    customerCompany: initialData?.customerCompany || '',
    customerAddress: initialData?.customerAddress || '',
    customerEmail: initialData?.customerEmail || '',
    customerPhone: initialData?.customerPhone || '',
    projectName: initialData?.projectName || '',
    contactPerson: initialData?.contactPerson || '',
    paymentTerms: initialData?.paymentTerms || '50% Upfront',
    notes: initialData?.notes || '',
    requireDeposit: initialData?.requireDeposit !== undefined ? initialData.requireDeposit : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof CustomerData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`${theme.card} p-8`}>
      <h2 className="text-2xl font-heading font-bold text-white mb-6">
        Customer Information
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`${theme.text.secondary} text-sm mb-2 block`}>
              Name *
            </label>
            <input
              type="text"
              className={theme.input}
              value={formData.customerName}
              onChange={(e) => updateField('customerName', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className={`${theme.text.secondary} text-sm mb-2 block`}>
              Company
            </label>
            <input
              type="text"
              className={theme.input}
              value={formData.customerCompany}
              onChange={(e) => updateField('customerCompany', e.target.value)}
            />
          </div>
          
          <div>
            <label className={`${theme.text.secondary} text-sm mb-2 block`}>
              Email *
            </label>
            <input
              type="email"
              className={theme.input}
              value={formData.customerEmail}
              onChange={(e) => updateField('customerEmail', e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className={`${theme.text.secondary} text-sm mb-2 block`}>
              Phone
            </label>
            <input
              type="tel"
              className={theme.input}
              value={formData.customerPhone}
              onChange={(e) => updateField('customerPhone', e.target.value)}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className={`${theme.text.secondary} text-sm mb-2 block`}>
              Address
            </label>
            <textarea
              className={theme.input + ' resize-none'}
              value={formData.customerAddress}
              onChange={(e) => updateField('customerAddress', e.target.value)}
              rows={2}
            />
          </div>
        </div>
        
        {/* Project Information */}
        <div className="pt-6 border-t border-white/10">
          <h3 className="text-lg font-heading font-semibold text-white mb-4">
            Project Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${theme.text.secondary} text-sm mb-2 block`}>
                Project Name *
              </label>
              <input
                type="text"
                className={theme.input}
                value={formData.projectName}
                onChange={(e) => updateField('projectName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className={`${theme.text.secondary} text-sm mb-2 block`}>
                Contact Person *
              </label>
              <input
                type="text"
                className={theme.input}
                value={formData.contactPerson}
                onChange={(e) => updateField('contactPerson', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className={`${theme.text.secondary} text-sm mb-2 block`}>
                Payment Terms
              </label>
              <select
                className={theme.input}
                value={formData.paymentTerms}
                onChange={(e) => updateField('paymentTerms', e.target.value)}
              >
                <option value="Net 30">Net 30</option>
                <option value="Net 15">Net 15</option>
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="50% Upfront">50% Upfront</option>
              </select>
            </div>
          </div>
          
          {/* Deposit Toggle */}
          <div className="mt-4 p-4 border border-white/10 rounded-lg bg-white/5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requireDeposit}
                onChange={(e) => updateField('requireDeposit', e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent focus:ring-offset-0"
              />
              <div>
                <span className="text-white font-medium">Require 50% Deposit</span>
                <p className="text-white/60 text-sm mt-1">
                  When enabled, the quote will require a 50% deposit before work commences.
                </p>
              </div>
            </label>
          </div>
        </div>
        
        {/* Notes */}
        <div className="pt-6 border-t border-white/10">
          <label className={`${theme.text.secondary} text-sm mb-2 block`}>
            Additional Notes
          </label>
          <textarea
            className={theme.input + ' resize-none'}
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={3}
            placeholder="Add any additional notes or terms for this quote..."
          />
        </div>
        
        <button type="submit" className={theme.button.primary + ' w-full'}>
          Continue to Services
        </button>
      </form>
    </div>
  );
}
