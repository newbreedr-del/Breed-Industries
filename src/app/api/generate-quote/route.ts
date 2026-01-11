import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import sgMail from '@sendgrid/mail';
import { randomUUID } from 'crypto';
import { format } from 'date-fns';

// Set SendGrid API key
// In production, use environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);

// Company email to CC
const COMPANY_EMAIL = 'info@thebreed.co.za';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (simple implementation)
    // In production, use a proper rate limiting solution
    
    // Parse request body
    const data = await req.json();
    const { 
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
    } = data;
    
    // Validate required fields
    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate quote number and date
    const quoteNumber = `Q-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentDate = format(new Date(), 'MMMM dd, yyyy');
    const validUntil = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy');
    
    // Calculate totals
    let subtotal = 0;
    items.forEach((item: any) => {
      subtotal += item.quantity * item.rate;
    });
    
    const taxRate = 0.15; // 15% VAT
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    // Generate HTML for the quote
    const quoteHTML = generateQuoteHTML({
      quoteNumber,
      currentDate,
      validUntil,
      customerName,
      customerCompany,
      customerAddress,
      customerEmail,
      customerPhone,
      projectName,
      contactPerson,
      paymentTerms,
      items,
      subtotal,
      tax,
      taxRate,
      total,
      notes
    });
    
    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(quoteHTML, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();
    
    // Convert PDF to base64 for email attachment
    const pdfBase64 = pdf.toString('base64');
    
    // Send email with PDF attachment
    const msg = {
      to: customerEmail,
      cc: COMPANY_EMAIL,
      from: COMPANY_EMAIL,
      subject: `Quote #${quoteNumber} from Breed Industries`,
      text: `Dear ${customerName},\n\nThank you for your interest in our services. Please find attached your quote #${quoteNumber}.\n\nThis quote is valid until ${validUntil}.\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\nBreed Industries Team`,
      attachments: [
        {
          content: pdfBase64,
          filename: `Breed_Industries_Quote_${quoteNumber}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    await sgMail.send(msg);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Quote generated and sent successfully',
      quoteNumber
    });
    
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: 'Failed to generate quote' },
      { status: 500 }
    );
  }
}

function generateQuoteHTML(data: any) {
  const {
    quoteNumber,
    currentDate,
    validUntil,
    customerName,
    customerCompany,
    customerAddress,
    customerEmail,
    customerPhone,
    projectName,
    contactPerson,
    paymentTerms,
    items,
    subtotal,
    tax,
    taxRate,
    total,
    notes
  } = data;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount).replace('ZAR', 'R');
  };
  
  // Generate items HTML
  const itemsHTML = items.map((item: any) => `
    <tr>
      <td>
        <strong>${item.name}</strong>
        <div class="item-description">${item.description || ''}</div>
      </td>
      <td class="right">${item.quantity}</td>
      <td class="right">${formatCurrency(item.rate)}</td>
      <td class="right">${formatCurrency(item.quantity * item.rate)}</td>
    </tr>
  `).join('');
  
  // Return the complete HTML template
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote Template</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
            padding: 40px;
            background: white;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
        }
        
        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #CA8114;
        }
        
        .logo-section {
            flex: 1;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }
        
        .company-details {
            font-size: 12px;
            color: #666;
            line-height: 1.4;
        }
        
        .quote-info {
            text-align: right;
        }
        
        .quote-title {
            font-size: 32px;
            font-weight: bold;
            color: #CA8114;
            margin-bottom: 10px;
        }
        
        .quote-meta {
            font-size: 13px;
            color: #666;
        }
        
        .quote-meta div {
            margin: 3px 0;
        }
        
        /* Customer Info */
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            gap: 40px;
        }
        
        .info-block {
            flex: 1;
        }
        
        .info-block h3 {
            font-size: 14px;
            color: #CA8114;
            text-transform: uppercase;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .info-block p {
            font-size: 13px;
            margin: 3px 0;
            color: #444;
        }
        
        /* Items Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        .items-table thead {
            background: #CA8114;
            color: white;
        }
        
        .items-table th {
            padding: 12px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
        }
        
        .items-table th.right {
            text-align: right;
        }
        
        .items-table tbody tr {
            border-bottom: 1px solid #e5e7eb;
        }
        
        .items-table tbody tr:hover {
            background: #f9fafb;
        }
        
        .items-table td {
            padding: 12px;
            font-size: 13px;
        }
        
        .items-table td.right {
            text-align: right;
        }
        
        .item-description {
            color: #666;
            font-size: 12px;
            margin-top: 3px;
        }
        
        /* Totals */
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
        }
        
        .totals {
            width: 300px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
        }
        
        .total-row.subtotal {
            border-top: 1px solid #e5e7eb;
        }
        
        .total-row.tax {
            color: #666;
        }
        
        .total-row.total {
            border-top: 2px solid #CA8114;
            margin-top: 8px;
            padding-top: 12px;
            font-size: 18px;
            font-weight: bold;
            color: #D6610D;
        }
        
        /* Notes */
        .notes-section {
            background: #f9fafb;
            padding: 20px;
            border-left: 4px solid #CA8114;
            margin-bottom: 30px;
        }
        
        .notes-section h3 {
            font-size: 14px;
            color: #CA8114;
            margin-bottom: 8px;
        }
        
        .notes-section p {
            font-size: 13px;
            color: #555;
        }
        
        /* Terms */
        .terms-section {
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
            font-size: 11px;
            color: #666;
            line-height: 1.6;
        }
        
        .terms-section h3 {
            font-size: 12px;
            color: #333;
            margin-bottom: 8px;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 11px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIEJyZWVkIEluZHVzdHJpZXMgTG9nbyAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMCwgMTApIj4KICAgIDwhLS0gSGV4YWdvbiBTaGFwZSAtLT4KICAgIDxwYXRoIGQ9Ik0yMCw1IEw0MCwyMCBMNDAsNTAgTDIwLDY1IEwwLDUwIEwwLDIwIFoiIGZpbGw9IiNDQTgxMTQiLz4KICAgIDxwYXRoIGQ9Ik0yMCw1IEw0MCwyMCBMNDAsNTAgTDIwLDY1IEwyMCw1IFoiIGZpbGw9IiNENjYxMEQiLz4KICAgIDxwYXRoIGQ9Ik0yMCw2NSBMMCw1MCBMMCwyMCBMMjAsNSBMMjAsNjUgWiIgZmlsbD0iI0NBODExNCIgb3BhY2l0eT0iMC44Ii8+CiAgICA8IS0tIElubmVyIEIgU2hhcGUgLS0+CiAgICA8cGF0aCBkPSJNMTUsMjAgTDI1LDI1IEwyNSw0NSBMMTUsNTAgTDE1LDIwIFoiIGZpbGw9IndoaXRlIi8+CiAgPC9nPgogIDx0ZXh0IHg9IjcwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzFkMWQxZiI+QlJFRUQ8L3RleHQ+CiAgPHRleHQgeD0iNzAiIHk9Ijc1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMxZDFkMWYiPklORFVTVFJJRVM8L3RleHQ+Cjwvc3ZnPg==" alt="Breed Industries" style="height: 60px; margin-bottom: 10px;">
                <div class="company-details">
                    4 Ivy Road<br>
                    Pinetown, 3610<br>
                    Phone: +27 60 496 4105<br>
                    Email: info@thebreed.co.za
                </div>
            </div>
            <div class="quote-info">
                <div class="quote-title">QUOTE</div>
                <div class="quote-meta">
                    <div><strong>Quote #:</strong> ${quoteNumber}</div>
                    <div><strong>Date:</strong> ${currentDate}</div>
                    <div><strong>Valid Until:</strong> ${validUntil}</div>
                </div>
            </div>
        </div>

        <!-- Customer Info -->
        <div class="info-section">
            <div class="info-block">
                <h3>Bill To</h3>
                <p><strong>${customerName}</strong></p>
                <p>${customerCompany || ''}</p>
                <p>${customerAddress || ''}</p>
                <p>${customerEmail}</p>
                <p>${customerPhone || ''}</p>
            </div>
            <div class="info-block">
                <h3>Project Details</h3>
                <p><strong>Project:</strong> ${projectName || 'Custom Services'}</p>
                <p><strong>Contact:</strong> ${contactPerson || customerName}</p>
                <p><strong>Payment Terms:</strong> ${paymentTerms || 'Net 30'}</p>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 50%;">Description</th>
                    <th class="right" style="width: 15%;">Qty</th>
                    <th class="right" style="width: 15%;">Rate</th>
                    <th class="right" style="width: 20%;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
            <div class="totals">
                <div class="total-row subtotal">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(subtotal)}</span>
                </div>
                <div class="total-row tax">
                    <span>VAT (${taxRate * 100}%):</span>
                    <span>${formatCurrency(tax)}</span>
                </div>
                <div class="total-row total">
                    <span>Total:</span>
                    <span>${formatCurrency(total)}</span>
                </div>
            </div>
        </div>

        <!-- Notes -->
        <div class="notes-section">
            <h3>Notes</h3>
            <p>${notes || 'Thank you for considering our services. This quote is valid for 30 days. A 50% deposit is required to begin work, with the remaining balance due upon project completion. Please contact us if you have any questions.'}</p>
        </div>

        <!-- Terms -->
        <div class="terms-section">
            <h3>Terms & Conditions</h3>
            <p>
                Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly interest charge. 
                All work is guaranteed for 90 days from completion. Client is responsible for providing all necessary 
                content and materials. Changes to project scope may result in additional charges. We reserve the right 
                to use completed work in our portfolio unless otherwise agreed in writing.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            Thank you for your business!<br>
            www.thebreed.co.za | info@thebreed.co.za | +27 60 496 4105
        </div>
    </div>
</body>
</html>`;
}
