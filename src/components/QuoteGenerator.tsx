'use client';

import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, MinusCircle, Loader2, CheckCircle, Send, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');
  
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
        rate: item.price ?? 0
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

  // Generate PDF function
  const generatePDF = async (quoteNumber: string) => {
    try {
      console.log('Generating PDF with items:', items);
      console.log('Selected items from props:', selectedItems);
      
      // Create a temporary div to render the quote content
      const quoteElement = document.createElement('div');
      quoteElement.style.position = 'absolute';
      quoteElement.style.left = '-9999px';
      quoteElement.style.top = '-9999px';
      quoteElement.style.width = '800px';
      quoteElement.style.backgroundColor = 'white';
      quoteElement.style.padding = '40px';
      quoteElement.style.fontFamily = 'Arial, sans-serif';
      
      // Generate dates
      const currentDate = new Date().toLocaleDateString('en-ZA', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      // Calculate total
      const total = items.reduce((sum: number, item: QuoteItem) => sum + item.quantity * item.rate, 0);
      const formattedTotal = new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(total).replace('ZAR', 'R');

      console.log('Total calculated:', total, 'Formatted:', formattedTotal);

      // Create HTML content for PDF with logo
      quoteElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #1A1A1B; padding-bottom: 20px;">
          <div style="font-size: 32px; font-weight: bold; color: #1A1A1B; margin-bottom: 10px; letter-spacing: 2px;">BREED INDUSTRIES</div>
          <div style="font-size: 18px; font-weight: bold; color: #1A1A1B;">Quote #${quoteNumber}</div>
          <div>Date: ${currentDate}</div>
          <div>Valid Until: ${validUntil}</div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1A1A1B; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">Customer Information</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <div><strong>Name:</strong> ${customerName}</div>
              <div><strong>Company:</strong> ${customerCompany || 'N/A'}</div>
              <div><strong>Email:</strong> ${customerEmail}</div>
            </div>
            <div>
              <div><strong>Phone:</strong> ${customerPhone || 'N/A'}</div>
              <div><strong>Project:</strong> ${projectName}</div>
              <div><strong>Contact:</strong> ${contactPerson}</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1A1A1B; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">Quote Items</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; background-color: #1A1A1B; color: white;">Item</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd; background-color: #1A1A1B; color: white;">Quantity</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd; background-color: #1A1A1B; color: white;">Rate</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd; background-color: #1A1A1B; color: white;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">
                    <strong>${item.name}</strong>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">${item.description}</div>
                  </td>
                  <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd;">R ${item.rate.toLocaleString()}</td>
                  <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd;">R ${(item.quantity * item.rate).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="text-align: right; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px; font-weight: bold; border-top: 2px solid #1A1A1B; padding-top: 10px;">
              <span>Total (ex VAT):</span>
              <span>${formattedTotal}</span>
            </div>
            <div style="font-size: 12px; color: #888;">Breed Industries is not VAT registered. All pricing is exclusive of VAT.</div>
          </div>
        </div>

        ${notes ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1A1A1B; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">Notes</h2>
          <p style="line-height: 1.6;">${notes}</p>
        </div>
        ` : ''}

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1A1A1B; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">Terms & Conditions</h2>
          <p style="line-height: 1.6;">
            Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly interest charge. 
            All work is guaranteed for 90 days from completion. Client is responsible for providing all necessary 
            content and materials. Changes to project scope may result in additional charges. We reserve the right 
            to use completed work in our portfolio unless otherwise agreed in writing.
          </p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px;">
          <p><strong>Thank you for your business!</strong></p>
          <p>www.thebreed.co.za | info@thebreed.co.za | +27 60 496 4105</p>
        </div>
      `;

      document.body.appendChild(quoteElement);

      // Generate PDF
      const canvas = await html2canvas(quoteElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save(`Breed_Industries_Quote_${quoteNumber}.pdf`);

      // Clean up
      document.body.removeChild(quoteElement);

      // Don't return PDF base64 since we're not sending it as attachment
      return null;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
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
      // Generate quote number
      const quoteNumber = `Q-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Generate PDF first (download only, no attachment)
      await generatePDF(quoteNumber);
      
      // Then send email without PDF attachment
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
          items: items.map((item) => ({
            ...item,
            name: item.name.trim(),
            description: item.description.trim(),
            quantity: Number(item.quantity),
            rate: Number(item.rate)
          })),
          notes: notes.trim(),
          pdfBase64: '' // No PDF attachment
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quote');
      }
      
      setQuoteNumber(data.quoteNumber);
      setIsSuccess(true);
      
      if (onSuccess) {
        onSuccess({ quoteNumber: data.quoteNumber, customerEmail: customerEmail.trim() });
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
