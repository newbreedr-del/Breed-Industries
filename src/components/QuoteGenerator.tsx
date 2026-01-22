'use client';

import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, MinusCircle, Loader2, CheckCircle, Send, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
      
      // Create new PDF document
      const pdf = new jsPDF();
      
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

      // Create HTML header with logo
      const headerElement = document.createElement('div');
      headerElement.style.position = 'absolute';
      headerElement.style.left = '-9999px';
      headerElement.style.top = '-9999px';
      headerElement.style.width = '210mm';
      headerElement.style.backgroundColor = '#1A1A1B';
      headerElement.style.padding = '20px';
      headerElement.style.fontFamily = 'Arial, sans-serif';
      headerElement.style.textAlign = 'center';
      headerElement.style.color = 'white';
      
      // Try multiple image paths and add debugging
      const imagePaths = [
        '/assets/images/The Breed Industries Just Logo-01 igkjh-01.png',
        '/The Breed Industries Just Logo-01 igkjh-01.png',
        'The Breed Industries Just Logo-01 igkjh-01.png'
      ];
      
      headerElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 8px;">
          <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">BREED INDUSTRIES</div>
        </div>
        <div style="font-size: 13px; margin-bottom: 5px; text-align: center;">Be seen, be trusted, be unstoppable</div>
        <div style="font-size: 11px; text-align: center;">Professional Business Solutions</div>
      `;

      document.body.appendChild(headerElement);

      // Wait a bit for image to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Header element created, attempting to convert to canvas...');

      // Generate header with logo using html2canvas
      const headerCanvas = await html2canvas(headerElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const headerImgData = headerCanvas.toDataURL('image/png');
      
      // Add header to PDF
      pdf.addImage(headerImgData, 'PNG', 0, 0, 210, 50);

      // Clean up
      document.body.removeChild(headerElement);

      // Quote Details
      pdf.setFillColor(245, 245, 245);
      pdf.rect(20, 60, 170, 20, 'F');
      
      pdf.setTextColor(26, 26, 27);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Quote #${quoteNumber}`, 30, 72);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${currentDate}`, 30, 80);
      pdf.text(`Valid Until: ${validUntil}`, 120, 80);
      
      // Customer Information
      pdf.setTextColor(26, 26, 27);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customer Information', 20, 95);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      
      let yPos = 105;
      pdf.text(`Name: ${customerName}`, 20, yPos);
      yPos += 6;
      pdf.text(`Company: ${customerCompany || 'N/A'}`, 20, yPos);
      yPos += 6;
      pdf.text(`Email: ${customerEmail}`, 20, yPos);
      yPos += 6;
      pdf.text(`Phone: ${customerPhone || 'N/A'}`, 20, yPos);
      yPos += 6;
      pdf.text(`Project: ${projectName}`, 20, yPos);
      yPos += 6;
      pdf.text(`Contact: ${contactPerson}`, 20, yPos);
      
      // Quote Items Table
      yPos += 12;
      pdf.setTextColor(26, 26, 27);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Quote Items', 20, yPos);
      
      yPos += 8;
      
      // Table headers
      pdf.setFillColor(26, 26, 27);
      pdf.rect(20, yPos, 170, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Service', 25, yPos + 7);
      pdf.text('Qty', 100, yPos + 7);
      pdf.text('Rate', 130, yPos + 7);
      pdf.text('Amount', 160, yPos + 7);
      
      yPos += 10;
      
      // Table rows
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      
      items.forEach((item, index) => {
        if (yPos > 240) {
          pdf.addPage();
          yPos = 20;
        }
        
        // Alternate row background
        if (index % 2 === 0) {
          pdf.setFillColor(248, 249, 250);
          pdf.rect(20, yPos, 170, 8, 'F');
        }
        
        pdf.text(item.name.substring(0, 50), 25, yPos + 5);
        pdf.text(item.quantity.toString(), 105, yPos + 5);
        pdf.text(`R${item.rate}`, 135, yPos + 5);
        pdf.text(`R${item.quantity * item.rate}`, 165, yPos + 5);
        
        yPos += 8;
      });
      
      // Total
      yPos += 8;
      pdf.setFillColor(26, 26, 27);
      pdf.rect(20, yPos, 170, 12, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL (EX VAT):', 25, yPos + 8);
      pdf.text(formattedTotal, 160, yPos + 8, { align: 'right' });
      
      yPos += 20;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(136, 136, 136);
      pdf.text('Breed Industries is not VAT registered. All pricing is exclusive of VAT.', 105, yPos, { align: 'center' });
      
      // Notes if any
      if (notes) {
        yPos += 15;
        pdf.setTextColor(26, 26, 27);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notes', 20, yPos);
        
        yPos += 8;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const splitNotes = pdf.splitTextToSize(notes, 170);
        splitNotes.forEach((line, index) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(line, 20, yPos + (index * 4));
        });
        yPos += splitNotes.length * 4;
      }
      
      // Terms & Conditions - Simplified
      yPos += 15;
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setTextColor(26, 26, 27);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Terms & Conditions', 20, yPos);
      
      yPos += 8;
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      
      const terms = [
        '• Payment due within 30 days. Late payments incur 1.5% monthly interest.',
        '• Work guaranteed for 90 days. Client responsible for content/materials.',
        '• Scope changes may incur additional charges. Portfolio rights reserved.'
      ];
      
      terms.forEach((term, index) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(term, 20, yPos + (index * 5));
      });
      
      // Footer - Position at actual bottom of A4 page (297mm height)
      const footerY = 272; // Position at actual bottom
      pdf.setFillColor(26, 26, 27);
      pdf.rect(0, footerY, 210, 25, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Thank you for your business!', 105, footerY + 8, { align: 'center' });
      
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('www.thebreed.co.za | info@thebreed.co.za | +27 60 496 4105', 105, footerY + 18, { align: 'center' });

      // Download PDF
      pdf.save(`Breed_Industries_Quote_${quoteNumber}.pdf`);

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
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(errorText || 'Failed to generate quote');
      }
      
      const data = await response.json();
      
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
