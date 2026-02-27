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
  const [paymentTerms, setPaymentTerms] = useState('50% Upfront');
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

  // Scope-specific timelines and client requirements
  const scopeDetails: Record<string, { timeline: string; clientRequirements: string[] }> = {
    'CIPC Registration': { timeline: '2 – 5 Business Days', clientRequirements: ['Certified copy of ID document (all directors)', 'Proof of residential address (not older than 3 months)', 'Three proposed company name options', 'Signed CIPC forms (provided by Breed Industries)'] },
    'Tax Compliance': { timeline: '3 – 7 Business Days', clientRequirements: ['CIPC registration certificate (COR 14.3 / COR 15.3)', 'Certified ID copies of all directors', 'Proof of business address', 'Banking details confirmation letter'] },
    'BEE Certification': { timeline: '5 – 10 Business Days', clientRequirements: ['Latest financial statements or management accounts', 'Signed BEE declaration (EME/QSE affidavit)', 'Payroll records (if applicable)', 'Skills development records'] },
    'COID Registration / Letter of Good Standing': { timeline: '3 – 7 Business Days', clientRequirements: ['CIPC registration documents', 'Estimated annual payroll amount', 'Nature of business activities', 'Number of employees'] },
    'UIF Registration & Compliance Letter': { timeline: '3 – 7 Business Days', clientRequirements: ['CIPC registration documents', 'Employee details (ID numbers, start dates)', 'Monthly payroll figures', 'Employer banking details'] },
    'CIPC Annual Return': { timeline: '1 – 3 Business Days', clientRequirements: ['CIPC customer code and password', 'Current registered office address confirmation', 'Director changes (if any)', 'Annual return fee (paid to CIPC)'] },
    'Basic Logo Design': { timeline: '3 – 5 Business Days', clientRequirements: ['Brand name and tagline (if applicable)', 'Preferred colours and style references', 'Industry and target audience description', 'Any existing brand assets'] },
    'Premium Logo Design': { timeline: '7 – 10 Business Days', clientRequirements: ['Detailed brand brief (provided by Breed Industries)', 'Competitor references and positioning notes', 'Vision, mission, and values statement', 'Stakeholder availability for feedback sessions'] },
    'Business Branding': { timeline: '5 – 8 Business Days', clientRequirements: ['Approved logo files', 'Brand story and company background', 'Target market demographics', 'Preferred tone of voice and messaging'] },
    'Business Cards (250)': { timeline: '5 – 7 Business Days (incl. print)', clientRequirements: ['Approved logo and brand colours', 'Contact details for each cardholder', 'Preferred card stock and finish', 'Delivery address for printed cards'] },
    'Marketing Materials': { timeline: '5 – 10 Business Days', clientRequirements: ['Approved brand guidelines', 'Content and copy for each material', 'High-resolution images (if available)', 'Distribution format preferences (print/digital)'] },
    'Website Development': { timeline: '10 – 15 Business Days', clientRequirements: ['Sitemap and page structure preferences', 'All text content for each page', 'High-resolution images and media', 'Domain name and hosting credentials (or purchase authorisation)', 'Logo and brand guidelines'] },
    'Mobile App Development': { timeline: '8 – 12 Weeks', clientRequirements: ['Detailed feature requirements document', 'User flow diagrams or wireframes (if available)', 'API documentation for third-party integrations', 'App Store / Play Store developer account credentials', 'Test device availability'] },
    'E-commerce Solutions': { timeline: '15 – 25 Business Days', clientRequirements: ['Product catalogue with descriptions, images, and pricing', 'Payment gateway preferences (PayFast, Stripe, etc.)', 'Shipping and delivery policies', 'Domain and hosting details', 'Business registration for payment gateway setup'] },
    'SEO & Digital Marketing': { timeline: '7 – 14 Business Days (setup)', clientRequirements: ['Website access (CMS admin credentials)', 'Google Analytics and Search Console access', 'Target keywords and competitor list', 'Business goals and KPIs', 'Monthly budget for paid campaigns (if applicable)'] },
    'Social Media Management': { timeline: '3-Month Engagement', clientRequirements: ['Social media account credentials', 'Brand guidelines and tone of voice', 'Product/service images and descriptions', 'Monthly promotional calendar or events', 'Approval workflow and turnaround expectations'] },
    'Business Profile - Starter (1\u20134 Pages)': { timeline: '3 – 5 Business Days', clientRequirements: ['Company overview and history', 'Services or products offered', 'Director/owner profiles', 'Contact details and logo'] },
    'Business Profile - Standard (5\u201310 Pages)': { timeline: '5 – 8 Business Days', clientRequirements: ['Detailed company background and milestones', 'Full service/product catalogue', 'Team profiles with photographs', 'Client references or testimonials', 'Certifications and compliance documents'] },
    'Business Plan - Basic/Entry-Level': { timeline: '4 – 7 Business Days', clientRequirements: ['Business concept and model description', 'Target market information', 'Revenue model and pricing strategy', 'Startup costs estimate'] },
    'Business Plan - Standard/Comprehensive': { timeline: '8 – 15 Business Days', clientRequirements: ['Detailed business model and value proposition', 'Market research data and competitor analysis', 'Financial records (existing business) or projections', '3-year revenue and expense forecasts', 'Funding requirements and use of funds breakdown'] },
  };

  // Generate PDF function
  const generatePDF = async (quoteNumber: string) => {
    try {
      const pdf = new jsPDF();
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      const accentColor: [number, number, number] = [202, 129, 20]; // #CA8114
      const darkBg: [number, number, number] = [26, 26, 27];
      const white: [number, number, number] = [255, 255, 255];
      const lightGray: [number, number, number] = [245, 245, 245];
      const textDark: [number, number, number] = [40, 40, 40];
      const textMuted: [number, number, number] = [100, 100, 100];

      const currentDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
      const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
      const total = items.reduce((sum: number, item: QuoteItem) => sum + item.quantity * item.rate, 0);
      const deposit = total * 0.5;
      const balance = total - deposit;
      const fmt = (n: number) => 'R ' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      // ─── HELPER: draw page footer ───
      const drawFooter = (pageNum: number, totalPages: number) => {
        pdf.setFillColor(...darkBg);
        pdf.rect(0, pageHeight - 18, pageWidth, 18, 'F');
        pdf.setTextColor(...white);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.text('www.thebreed.co.za  |  info@thebreed.co.za  |  +27 60 496 4105', pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      };

      // ═══════════════════════════════════════════
      // PAGE 1 — QUOTATION
      // ═══════════════════════════════════════════

      // Header bar
      pdf.setFillColor(...darkBg);
      pdf.rect(0, 0, pageWidth, 52, 'F');

      // Load and add logo
      try {
        const logoImg = new window.Image();
        logoImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          logoImg.onload = () => resolve();
          logoImg.onerror = () => reject(new Error('Logo failed to load'));
          logoImg.src = '/assets/images/breed-logo-white.png';
        });
        const logoCanvas = document.createElement('canvas');
        logoCanvas.width = logoImg.naturalWidth;
        logoCanvas.height = logoImg.naturalHeight;
        const ctx = logoCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(logoImg, 0, 0);
          const logoData = logoCanvas.toDataURL('image/png');
          pdf.addImage(logoData, 'PNG', margin, 6, 40, 40);
        }
      } catch {
        // Fallback text if logo fails
        pdf.setTextColor(...white);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('BREED INDUSTRIES', margin, 30);
      }

      // Company details in header
      pdf.setTextColor(200, 200, 200);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('The Breed Industries (PTY) LTD', pageWidth - margin, 14, { align: 'right' });
      pdf.text('4 Ivy Road, Pinetown, 3610', pageWidth - margin, 20, { align: 'right' });
      pdf.text('Phone: +27 60 496 4105', pageWidth - margin, 26, { align: 'right' });
      pdf.text('Email: info@thebreed.co.za', pageWidth - margin, 32, { align: 'right' });
      pdf.text('Web: www.thebreed.co.za', pageWidth - margin, 38, { align: 'right' });

      // QUOTE title bar
      pdf.setFillColor(...accentColor);
      pdf.rect(0, 52, pageWidth, 14, 'F');
      pdf.setTextColor(...white);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('QUOTATION', margin, 61);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`#${quoteNumber}`, pageWidth - margin, 61, { align: 'right' });

      // Quote meta row
      let y = 74;
      pdf.setFillColor(...lightGray);
      pdf.rect(margin, y, contentWidth, 10, 'F');
      pdf.setTextColor(...textDark);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Date: ${currentDate}`, margin + 4, y + 7);
      pdf.text(`Valid Until: ${validUntil}`, pageWidth / 2, y + 7);
      pdf.text(`Payment: ${paymentTerms}`, pageWidth - margin - 4, y + 7, { align: 'right' });

      // Customer & Project info side by side
      y = 92;
      pdf.setFillColor(...accentColor);
      pdf.rect(margin, y, 80, 1, 'F');
      pdf.rect(margin + 90, y, 80, 1, 'F');

      y += 6;
      pdf.setTextColor(...accentColor);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BILL TO', margin, y);
      pdf.text('PROJECT DETAILS', margin + 90, y);

      y += 6;
      pdf.setTextColor(...textDark);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(customerName, margin, y);
      pdf.text(projectName || 'Custom Services', margin + 90, y);

      y += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...textMuted);
      if (customerCompany) { pdf.text(customerCompany, margin, y); y += 5; } else { y += 5; }
      pdf.text(`Contact: ${contactPerson || customerName}`, margin + 90, y - 5);
      pdf.text(customerEmail, margin, y);
      pdf.text(`Terms: ${paymentTerms}`, margin + 90, y);
      y += 5;
      if (customerPhone) pdf.text(`Tel: ${customerPhone}`, margin, y);
      if (customerAddress) { y += 5; const addrLines = pdf.splitTextToSize(customerAddress, 75); addrLines.forEach((line: string) => { pdf.text(line, margin, y); y += 4; }); }

      // Items table
      y = Math.max(y + 8, 138);
      // Table header
      pdf.setFillColor(...darkBg);
      pdf.rect(margin, y, contentWidth, 10, 'F');
      pdf.setTextColor(...white);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('#', margin + 3, y + 7);
      pdf.text('Service / Description', margin + 12, y + 7);
      pdf.text('Qty', margin + 110, y + 7, { align: 'center' });
      pdf.text('Rate', margin + 135, y + 7, { align: 'right' });
      pdf.text('Amount', margin + contentWidth - 2, y + 7, { align: 'right' });
      y += 10;

      // Table rows
      items.forEach((item, index) => {
        if (y > 230) { pdf.addPage(); y = 20; }
        if (index % 2 === 0) { pdf.setFillColor(250, 250, 250); pdf.rect(margin, y, contentWidth, 12, 'F'); }
        pdf.setTextColor(...textDark);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${index + 1}`, margin + 3, y + 5);
        pdf.setFont('helvetica', 'bold');
        pdf.text(item.name.substring(0, 55), margin + 12, y + 5);
        if (item.description) {
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(...textMuted);
          pdf.setFontSize(7);
          const descLines = pdf.splitTextToSize(item.description.substring(0, 120), 90);
          pdf.text(descLines[0] || '', margin + 12, y + 10);
        }
        pdf.setTextColor(...textDark);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(item.quantity.toString(), margin + 110, y + 5, { align: 'center' });
        pdf.text(fmt(item.rate), margin + 135, y + 5, { align: 'right' });
        pdf.setFont('helvetica', 'bold');
        pdf.text(fmt(item.quantity * item.rate), margin + contentWidth - 2, y + 5, { align: 'right' });
        y += 12;
      });

      // Totals section
      y += 4;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin + 90, y, margin + contentWidth, y);
      y += 6;

      // Subtotal
      pdf.setTextColor(...textMuted);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Subtotal (ex VAT):', margin + 95, y);
      pdf.text(fmt(total), margin + contentWidth - 2, y, { align: 'right' });
      y += 6;

      // 50% Deposit
      pdf.setTextColor(...accentColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text('50% Deposit Required:', margin + 95, y);
      pdf.text(fmt(deposit), margin + contentWidth - 2, y, { align: 'right' });
      y += 6;

      // Balance
      pdf.setTextColor(...textMuted);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Balance on Completion:', margin + 95, y);
      pdf.text(fmt(balance), margin + contentWidth - 2, y, { align: 'right' });
      y += 4;

      // Total bar
      pdf.setFillColor(...darkBg);
      pdf.rect(margin + 90, y, contentWidth - 90, 12, 'F');
      pdf.setTextColor(...white);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL (EX VAT):', margin + 95, y + 8);
      pdf.text(fmt(total), margin + contentWidth - 4, y + 8, { align: 'right' });
      y += 16;

      pdf.setTextColor(...textMuted);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Breed Industries is not VAT registered. All pricing is exclusive of VAT.', margin, y);
      y += 8;

      // ─── IMPORTANT NOTICE ───
      pdf.setFillColor(255, 248, 235);
      pdf.rect(margin, y, contentWidth, 22, 'F');
      pdf.setDrawColor(...accentColor);
      pdf.rect(margin, y, contentWidth, 22, 'S');
      pdf.setTextColor(...accentColor);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('IMPORTANT: 50% DEPOSIT REQUIRED BEFORE WORK COMMENCES', margin + 4, y + 7);
      pdf.setTextColor(...textDark);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`A non-refundable deposit of ${fmt(deposit)} is required before any work will begin. The remaining`, margin + 4, y + 13);
      pdf.text(`balance of ${fmt(balance)} is due upon project completion and final delivery of all deliverables.`, margin + 4, y + 18);
      y += 28;

      // ─── BANKING DETAILS ───
      if (y > 240) { pdf.addPage(); y = 20; }
      pdf.setFillColor(...lightGray);
      pdf.rect(margin, y, contentWidth, 32, 'F');
      pdf.setTextColor(...accentColor);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BANKING DETAILS', margin + 4, y + 7);
      pdf.setTextColor(...textDark);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Account Name:', margin + 4, y + 14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('The Breed Industries (PTY) LTD', margin + 40, y + 14);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Account Number:', margin + 4, y + 20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('10268731932', margin + 40, y + 20);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Branch Code:', margin + 4, y + 26);
      pdf.setFont('helvetica', 'bold');
      pdf.text('051001', margin + 40, y + 26);

      pdf.setFont('helvetica', 'normal');
      pdf.text('Bank:', margin + contentWidth / 2, y + 14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Standard Bank', margin + contentWidth / 2 + 20, y + 14);
      pdf.setFont('helvetica', 'normal');
      pdf.text('SWIFT:', margin + contentWidth / 2, y + 20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SBZA ZA JJ', margin + contentWidth / 2 + 20, y + 20);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Reference:', margin + contentWidth / 2, y + 26);
      pdf.setFont('helvetica', 'bold');
      pdf.text(quoteNumber, margin + contentWidth / 2 + 20, y + 26);

      // Notes
      if (notes) {
        y += 38;
        if (y > 255) { pdf.addPage(); y = 20; }
        pdf.setTextColor(...accentColor);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('NOTES', margin, y);
        y += 6;
        pdf.setTextColor(...textMuted);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        const splitNotes = pdf.splitTextToSize(notes, contentWidth);
        splitNotes.forEach((line: string) => {
          if (y > 265) { pdf.addPage(); y = 20; }
          pdf.text(line, margin, y);
          y += 4;
        });
      }

      // Page 1 footer
      drawFooter(1, 2);

      // ═══════════════════════════════════════════
      // PAGE 2 — CLIENT REQUIREMENTS, TIMELINES & DISCLAIMERS
      // ═══════════════════════════════════════════
      pdf.addPage();

      // Header bar
      pdf.setFillColor(...darkBg);
      pdf.rect(0, 0, pageWidth, 20, 'F');
      pdf.setTextColor(...white);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROJECT SCHEDULE, CLIENT REQUIREMENTS & TERMS', margin, 13);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Quote #${quoteNumber}`, pageWidth - margin, 13, { align: 'right' });

      y = 30;

      // Section: Scope of Work Breakdown
      pdf.setTextColor(...accentColor);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('1. SCOPE OF WORK — TIMELINES & CLIENT REQUIREMENTS', margin, y);
      y += 3;
      pdf.setDrawColor(...accentColor);
      pdf.line(margin, y, margin + contentWidth, y);
      y += 6;

      pdf.setTextColor(...textMuted);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Each service below lists the estimated delivery timeline and what we need from you to begin work.', margin, y);
      y += 8;

      items.forEach((item) => {
        const details = scopeDetails[item.name];
        const timeline = details?.timeline || '3 – 7 Business Days';
        const requirements = details?.clientRequirements || ['Content and materials as discussed', 'Timely feedback on deliverables'];

        const blockHeight = 10 + requirements.length * 4 + 4;
        if (y + blockHeight > 265) { pdf.addPage(); pdf.setFillColor(...darkBg); pdf.rect(0, 0, pageWidth, 12, 'F'); pdf.setTextColor(...white); pdf.setFontSize(7); pdf.setFont('helvetica', 'normal'); pdf.text(`Quote #${quoteNumber} — Continued`, margin, 8); drawFooter(2, 2); y = 20; }

        // Service name + timeline
        pdf.setFillColor(250, 248, 245);
        pdf.rect(margin, y - 3, contentWidth, 8, 'F');
        pdf.setTextColor(...textDark);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text(item.name, margin + 3, y + 2);
        pdf.setTextColor(...accentColor);
        pdf.setFontSize(7);
        pdf.text(`Timeline: ${timeline}`, pageWidth - margin - 3, y + 2, { align: 'right' });
        y += 8;

        // Requirements
        pdf.setTextColor(...textMuted);
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        requirements.forEach((req) => {
          pdf.text(`\u2022  ${req}`, margin + 6, y);
          y += 4;
        });
        y += 3;
      });

      // Section: Payment Terms
      y += 4;
      if (y > 220) { pdf.addPage(); y = 20; }
      pdf.setTextColor(...accentColor);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('2. PAYMENT TERMS', margin, y);
      y += 3;
      pdf.setDrawColor(...accentColor);
      pdf.line(margin, y, margin + contentWidth, y);
      y += 7;

      const paymentTermsList = [
        `A 50% non-refundable deposit of ${fmt(deposit)} is required before any work commences.`,
        `The remaining balance of ${fmt(balance)} is due upon project completion and final delivery.`,
        'Payment must be made via EFT to the banking details provided on Page 1.',
        `Use quote reference "${quoteNumber}" as your payment reference.`,
        'Proof of payment must be emailed to info@thebreed.co.za before work begins.',
        'Late payments (beyond 7 days of invoice) will incur interest at 2% per month on the outstanding amount.',
        'Work will be paused on any account with payments overdue by more than 14 days.',
      ];
      pdf.setTextColor(...textDark);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      paymentTermsList.forEach((term) => {
        if (y > 265) { pdf.addPage(); y = 20; }
        pdf.text(`\u2022  ${term}`, margin + 3, y);
        y += 5;
      });

      // Section: Disclaimers & Terms
      y += 4;
      if (y > 210) { pdf.addPage(); y = 20; }
      pdf.setTextColor(...accentColor);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('3. TERMS, CONDITIONS & DISCLAIMERS', margin, y);
      y += 3;
      pdf.setDrawColor(...accentColor);
      pdf.line(margin, y, margin + contentWidth, y);
      y += 7;

      const disclaimers = [
        ['Scope of Work:', 'This quote covers only the services explicitly listed above. Any additional work, revisions beyond the agreed scope, or new requirements will be quoted separately and require written approval before commencement.'],
        ['Timelines:', 'Estimated timelines begin from the date the 50% deposit clears AND all required client materials have been received. Delays in providing materials or feedback will extend delivery dates accordingly. Breed Industries is not liable for delays caused by the client.'],
        ['Revisions:', 'Each deliverable includes up to 2 rounds of revisions unless otherwise stated. Additional revision rounds will be billed at R350/hour.'],
        ['Intellectual Property:', 'All intellectual property and deliverables remain the property of Breed Industries until full payment has been received. Upon full payment, ownership of final deliverables transfers to the client. Source files and working files remain the property of Breed Industries unless explicitly included in the scope.'],
        ['Confidentiality:', 'Both parties agree to keep all project-related information confidential. Breed Industries will not share client data with third parties without written consent.'],
        ['Portfolio Rights:', 'Breed Industries reserves the right to feature completed work in our portfolio, website, and marketing materials unless a written non-disclosure agreement is in place.'],
        ['Cancellation:', 'If the client cancels the project after the deposit has been paid, the deposit is non-refundable. Work completed beyond the deposit value will be invoiced separately. Breed Industries may cancel this agreement with 14 days written notice, refunding any unearned portion of payments received.'],
        ['Warranty:', 'All deliverables are guaranteed for 30 days from final delivery. This covers defects in workmanship only, not changes to requirements, content updates, or third-party service failures.'],
        ['Liability:', 'Breed Industries\u2019 total liability under this agreement shall not exceed the total value of this quote. We are not liable for indirect, consequential, or incidental damages including lost profits, data loss, or business interruption.'],
        ['Force Majeure:', 'Neither party shall be liable for failure to perform obligations due to circumstances beyond reasonable control, including but not limited to natural disasters, power outages, internet failures, government actions, or pandemics.'],
        ['Governing Law:', 'This agreement is governed by the laws of the Republic of South Africa. Any disputes shall be resolved through mediation before escalation to the Magistrate\u2019s Court of Pinetown, KwaZulu-Natal.'],
        ['Acceptance:', 'Payment of the 50% deposit constitutes acceptance of this quote and all terms and conditions contained herein.'],
      ];

      pdf.setFontSize(7);
      disclaimers.forEach(([title, text]) => {
        if (y > 258) { pdf.addPage(); y = 20; }
        pdf.setTextColor(...textDark);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin + 3, y);
        y += 4;
        pdf.setTextColor(...textMuted);
        pdf.setFont('helvetica', 'normal');
        const lines = pdf.splitTextToSize(text, contentWidth - 6);
        lines.forEach((line: string) => {
          if (y > 268) { pdf.addPage(); y = 20; }
          pdf.text(line, margin + 3, y);
          y += 3.5;
        });
        y += 3;
      });

      // Acceptance notice
      if (y > 240) { pdf.addPage(); y = 20; }
      y += 6;
      pdf.setFillColor(...lightGray);
      pdf.rect(margin, y, contentWidth, 16, 'F');
      pdf.setTextColor(...accentColor);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ACCEPTANCE OF TERMS', margin + 4, y + 7);
      pdf.setTextColor(...textDark);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Payment of the 50% deposit constitutes acceptance of this quote and all terms and conditions contained herein.', margin + 4, y + 13);

      // Page 2 footer
      drawFooter(2, 2);

      // Download
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
