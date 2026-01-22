import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { Resend } from 'resend';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Use puppeteer-extra with stealth plugin
const puppeteer = require('puppeteer-extra');
const hidden = require('puppeteer-extra-plugin-stealth');

// require executablePath from puppeteer
const { executablePath } = require('puppeteer');

import { format } from 'date-fns';

export const runtime = 'nodejs';

// Resend configuration
const resend = new Resend(process.env.RESEND_API_KEY || 're_hfSbzJmW_JcaVST8yquP4fSZpP7rMUYZs');

const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'info@thebreed.co.za';

let cachedLogoDataUri: string | null = null;

async function launchBrowser() {
  try {
    // Launch sequence with puppeteer-extra and stealth
    puppeteer.use(hidden());
    
    console.log('Attempting to launch browser with puppeteer-extra...');
    
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process'
      ],
      headless: true,
      ignoreHTTPSErrors: true,
      executablePath: executablePath(),
      timeout: 30000
    });
    
    console.log('Browser launched successfully');
    return browser;
  } catch (error) {
    console.error('Failed to launch browser:', error);
    throw new Error(`Failed to launch browser: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function getLogoDataUri() {
  if (cachedLogoDataUri) {
    return cachedLogoDataUri;
  }

  try {
    const logoPath = join(
      process.cwd(),
      'assets',
      'images',
      'The Breed Industries-01-01.png'
    );
    const logoBuffer = await readFile(logoPath);
    cachedLogoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    return cachedLogoDataUri;
  } catch (error) {
    console.error('Failed to load logo asset for quote template:', error);
    cachedLogoDataUri = null;
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (simple implementation)
    // In production, use a proper rate limiting solution

    // Parse request body
    const data = await req.json();
    const {
      customerName = '',
      customerCompany = '',
      customerAddress = '',
      customerEmail = '',
      customerPhone = '',
      projectName = '',
      contactPerson = '',
      paymentTerms = 'Net 30',
      items = [],
      notes = ''
    } = data ?? {};

    const sanitizedItems = Array.isArray(items)
      ? items.map((item: any) => ({
          name: String(item?.name ?? '').trim(),
          description: String(item?.description ?? '').trim(),
          quantity: Number(item?.quantity ?? 0),
          rate: Number(item?.rate ?? 0)
        }))
      : [];

    if (!customerName.trim() || !customerEmail.trim() || !projectName.trim() || !contactPerson.trim()) {
      return NextResponse.json(
        { error: 'Customer name, email, project name, and contact person are required.' },
        { status: 400 }
      );
    }

    if (sanitizedItems.length === 0) {
      return NextResponse.json(
        { error: 'At least one quote item is required.' },
        { status: 400 }
      );
    }

    const invalidItem = sanitizedItems.find(
      (item) => !item.name || Number.isNaN(item.quantity) || Number.isNaN(item.rate) || item.quantity <= 0 || item.rate <= 0
    );

    if (invalidItem) {
      return NextResponse.json(
        { error: 'Each quote item must include a name, quantity above 0, and rate above 0.' },
        { status: 400 }
      );
    }

    // Generate quote number and date
    const quoteNumber = `Q-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentDate = format(new Date(), 'MMMM dd, yyyy');
    const validUntil = format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy');

    // Calculate total
    const total = sanitizedItems.reduce((sum: number, item: any) => sum + item.quantity * item.rate, 0);

    // Generate HTML for the quote
    const logoDataUri = await getLogoDataUri();

    const quoteHTML = generateQuoteHTML({
      quoteNumber,
      currentDate,
      validUntil,
      customerName: customerName.trim(),
      customerCompany: customerCompany.trim(),
      customerAddress: customerAddress.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      projectName: projectName.trim(),
      contactPerson: contactPerson.trim(),
      paymentTerms,
      items: sanitizedItems,
      total,
      notes: notes.trim(),
      logoDataUri
    });

    // Generate PDF using Puppeteer
    let browser = await launchBrowser();

    
    try {
      const page = await browser.newPage();
      await page.setContent(quoteHTML, { waitUntil: 'domcontentloaded', timeout: 0 });
      await page.emulateMediaType('screen');
      
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
      
      // Convert PDF to buffer for email attachment
      const pdfBuffer = Buffer.from(pdf);
      
      // Send email with PDF attachment via Resend
      try {
        const { data, error } = await resend.emails.send({
          from: COMPANY_EMAIL,
          to: [customerEmail.trim()],
          subject: `Quote #${quoteNumber} from Breed Industries`,
          html: `<p>Dear ${customerName.trim()},</p>
                 <p>Thank you for your interest in our services. Please find attached your quote #${quoteNumber}.</p>
                 <p>This quote is valid until ${validUntil}.</p>
                 <p>If you have any questions, please don't hesitate to contact us.</p>
                 <p>Best regards,<br>Breed Industries Team</p>`,
          attachments: [
            {
              filename: `Breed_Industries_Quote_${quoteNumber}.pdf`,
              content: pdfBuffer
            }
          ]
        });

        if (error) {
          console.error('Resend error:', error);
          throw new Error('Failed to send email: ' + error.message);
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Quote generated and sent successfully',
          quoteNumber
        });
      } catch (sendError) {
        console.error('Email send error:', sendError);
        throw new Error('Failed to send email: ' + (sendError instanceof Error ? sendError.message : 'Unknown email error'));
      }
    } finally {
      if (browser) {
        await browser.close();
      }
    }
    
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quote' },
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
    total,
    notes,
    logoDataUri
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
                ${logoDataUri
                  ? `<img src="${logoDataUri}" alt="Breed Industries" style="height: 60px; margin-bottom: 10px;">`
                  : `<div class="company-name">Breed Industries</div>`}
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
                <div class="total-row total" style="border-top: 0; padding-top: 0; margin-top: 0;">
                    <span>Total (ex VAT):</span>
                    <span>${formatCurrency(total)}</span>
                </div>
                <div class="total-row tax" style="margin-top: 8px; font-size: 12px; color: #888;">
                    <span>Breed Industries is not VAT registered. All pricing is exclusive of VAT.</span>
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
