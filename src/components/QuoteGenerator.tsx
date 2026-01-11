'use client';

import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, MinusCircle, Loader2, CheckCircle, Send } from 'lucide-react';

interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
}

interface SelectedItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  rate?: number;
}

interface QuoteGeneratorProps {
  selectedItems: SelectedItem[];
}

export default function QuoteGenerator({ selectedItems }: QuoteGeneratorProps) {
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
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');
  
  // Items state
  const defaultItem: QuoteItem = useMemo(
    () => ({ id: '1', name: '', description: '', quantity: 1, rate: 0 }),
    []
  );

  const [items, setItems] = useState<QuoteItem[]>([defaultItem]);

  useEffect(() => {
    if (selectedItems.length === 0) {
      setItems([defaultItem]);
      return;
    }

    setItems(
      selectedItems.map((item, index) => ({
        id: item.id ?? (index + 1).toString(),
        name: item.name,
        description: item.description ?? '',
        quantity: item.quantity ?? 1,
        rate: item.rate ?? item.price ?? 0,
      }))
    );
  }, [defaultItem, selectedItems]);
  
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
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!customerName || !customerEmail || items.some(item => !item.name)) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          customerCompany,
          customerAddress,
          customerEmail,
          customerPhone,
          projectName,
          contactPerson,
          paymentTerms,
          items,
          notes
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quote');
      }
      
      setQuoteNumber(data.quoteNumber);
      setIsSuccess(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setQuoteNumber(null);
      }, 5000);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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
                <label className="block text-white/70 text-sm mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
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
                    <label className="block text-white/70 text-sm mb-1">Item Name *</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Rate (R)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white"
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
                <span className="text-white">Subtotal:</span>
                <span className="text-accent font-heading font-bold">
                  R {calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-white/70 mt-1">
                <span>VAT (15%):</span>
                <span>R {(calculateSubtotal() * 0.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                <span className="text-white font-medium">Total:</span>
                <span className="text-accent font-heading font-bold text-xl">
                  R {(calculateSubtotal() * 1.15).toFixed(2)}
                </span>
              </div>
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
                  <Send className="w-5 h-5" />
                  Generate & Send Quote
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
