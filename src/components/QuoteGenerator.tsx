'use client';

import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, MinusCircle, Loader2, CheckCircle, Send, Download, ChevronDown } from 'lucide-react';
import { serviceDefinitions } from '@/data/serviceDefinitions';

interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  pricingType?: 'one-time' | 'monthly';
}

interface SelectedItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  rate?: number;
  pricingType?: 'one-time' | 'monthly';
}

interface QuoteGeneratorProps {
  selectedItems: SelectedItem[];
  onSuccess?: (details: { quoteNumber: string; customerEmail: string }) => void;
}

export default function QuoteGenerator({ selectedItems, onSuccess }: QuoteGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteNumber, setQuoteNumber] = useState<string | null>(null);
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [projectName, setProjectName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('50% Upfront');
  const [notes, setNotes] = useState('');
  const [requireDeposit, setRequireDeposit] = useState(true);
  
  // Items state
  const defaultItem: QuoteItem = useMemo(
    () => ({ id: '1', name: '', description: '', quantity: 1, rate: 0 }),
    []
  );

  const [items, setItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    if (selectedItems && selectedItems.length > 0) {
      const mappedItems = selectedItems.map((item, index) => ({
        id: item.id ?? (index + 1).toString(),
        name: item.name,
        description: item.description ?? '',
        quantity: 1,
        rate: item.price ?? 0,
        pricingType: item.pricingType ?? 'one-time'
      }));
      setItems(mappedItems);
      console.log('Set items from selectedItems:', mappedItems);
    } else {
      setItems([defaultItem]);
      console.log('Set default item');
    }
  }, [selectedItems]);
  
  // Add new item
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        quantity: 1,
        rate: 0
      }
    ]);
  };
  
  // Remove item
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };
  
  // Update item
  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Handle service selection
  const handleServiceSelect = (itemId: string, serviceId: string) => {
    const service = serviceDefinitions.find(s => s.id === serviceId);
    if (service) {
      updateItem(itemId, 'name', service.name);
      updateItem(itemId, 'description', service.description);
      // Parse base price to extract numeric value
      if (service.basePrice) {
        const priceMatch = service.basePrice.match(/R[\s]*([\d,]+)/);
        if (priceMatch) {
          const price = parseFloat(priceMatch[1].replace(',', ''));
          updateItem(itemId, 'rate', price);
        }
      }
    }
  };
  
  // Calculate total
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };
  
  const resetForm = () => {
    setCustomerName('');
    setCustomerCompany('');
    setCustomerAddress('');
    setCustomerEmail('');
    setCustomerPhone('');
    setProjectName('');
    setContactPerson('');
    setPaymentTerms('Net 30');
    setNotes('');
    setItems([defaultItem]);
  };

  const validateForm = () => {
    if (!customerName.trim()) {
      return 'Customer name is required.';
    }

    if (!customerEmail.trim()) {
      return 'Customer email is required.';
    }

    if (!projectName.trim()) {
      return 'Project name is required.';
    }

    if (!contactPerson.trim()) {
      return 'Contact person is required.';
    }

    const invalidItems = items.filter(
      (item) => !item.name.trim() || item.quantity <= 0 || item.rate <= 0
    );

    if (invalidItems.length > 0) {
      return 'Each quote item needs a name, quantity of at least 1, and a rate above 0.';
    }

    return null;
  };

  // Download PDF from base64
  const downloadPDF = (base64Data: string, quoteNumber: string) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Breed_Industries_Quote_${quoteNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Send quote request to server (PDF generated server-side)
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerCompany: customerCompany.trim(),
          customerAddress: customerAddress.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          projectName: projectName.trim(),
          contactPerson: contactPerson.trim(),
          paymentTerms,
          requireDeposit,
          items: items.map((item) => ({
            ...item,
            name: item.name.trim(),
            description: item.description.trim(),
            quantity: Number(item.quantity),
            rate: Number(item.rate)
          })),
          notes: notes.trim()
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(errorText || 'Failed to generate quote');
      }
      
      const data = await response.json();
      
      // Download PDF from server response
      if (data.pdfBase64) {
        downloadPDF(data.pdfBase64, data.quoteNumber);
      }
      
      setQuoteNumber(data.quoteNumber);
      setIsSuccess(true);
      
      if (onSuccess) {
        onSuccess({ quoteNumber: data.quoteNumber, customerEmail: customerEmail.trim() });
      }
      
      // Send WhatsApp notification about new quote
      try {
        const notifyResponse = await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'quote_status_update',
            data: {
              quoteId: data.quoteNumber,
              clientName: customerName.trim(),
              status: 'pending',
              amount: calculateTotal().toFixed(2),
              updatedAt: new Date().toLocaleString()
            }
          })
        });
        console.log('Quote notification sent:', await notifyResponse.json());
      } catch (notifyError) {
        console.error('Failed to send quote notification:', notifyError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quote');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="glass-card p-8">
      <h2 className="text-2xl font-heading font-bold text-white mb-6">Generate Quote</h2>
      
      {isSuccess ? (
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-white mb-2">Quote Generated Successfully!</h3>
          <p className="text-white/70 mb-4">Quote #{quoteNumber} has been sent to {customerEmail}</p>
          <button 
            onClick={() => {
              setIsSuccess(false);
              setQuoteNumber(null);
            }}
            className="btn btn-primary"
          >
            Generate Another Quote
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Company</label>
                <input
                  type="text"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Email *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Phone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-1">Address</label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  rows={2}
                />
              </div>
            </div>
          </div>
          
          {/* Project Information */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Project Name *</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Contact Person *</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
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
                  checked={requireDeposit}
                  onChange={(e) => setRequireDeposit(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent focus:ring-offset-0"
                />
                <div>
                  <span className="text-white font-medium">Require 50% Deposit</span>
                  <p className="text-white/60 text-sm mt-1">
                    When enabled, the quote will require a 50% deposit before work commences. 
                    Uncheck if the client has already paid a deposit or if full payment is required upfront.
                  </p>
                </div>
              </label>
            </div>
          </div>
          
          {/* Quote Items */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Quote Items</h3>
            
            {items.map((item, index) => (
              <div key={item.id} className="mb-4 p-4 border border-white/10 rounded-lg bg-white/5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-white font-medium">Item {index + 1}</h4>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <MinusCircle size={18} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Select Service (Optional)</label>
                    <div className="relative">
                      <select
                        onChange={(e) => e.target.value && handleServiceSelect(item.id, e.target.value)}
                        className="w-full rounded-lg bg-[#1a1a1a] border border-white/10 p-3 text-white appearance-none cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                        defaultValue=""
                      >
                        <option value="" className="bg-[#1a1a1a] text-white">Or select from services...</option>
                        {serviceDefinitions.map(service => (
                          <option key={service.id} value={service.id} className="bg-[#1a1a1a] text-white">
                            {service.category} - {service.name} {service.basePrice && `(${service.basePrice})`}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1">Item Name *</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                      placeholder="Enter item name or select service above"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Quantity *</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Rate (R) *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm mb-1">Description</label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                    rows={2}
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-accent hover:text-accent/80 mt-2"
            >
              <PlusCircle size={18} />
              <span>Add Another Item</span>
            </button>
            
            <div className="mt-4 p-4 border border-white/10 rounded-lg bg-white/5">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Total (ex VAT):</span>
                <span className="text-accent font-heading font-bold text-xl">
                  R {calculateTotal().toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-2">Breed Industries is not VAT registered. All figures are exclusive of VAT.</p>
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
              rows={3}
              placeholder="Add any additional notes or terms for this quote..."
            />
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-white">
              {error}
            </div>
          )}
          
          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary px-8 py-3 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Quote...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download & Send Quote
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
