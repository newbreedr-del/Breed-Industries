import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { format } from 'date-fns';

export const runtime = 'nodejs';

// Resend configuration
const resend = new Resend(process.env.RESEND_API_KEY || 're_hfSbzJmW_JcaVST8yquP4fSZpP7rMUYZs');

const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'info@thebreed.co.za';

export async function POST(req: NextRequest) {
  try {
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

    // Generate HTML email content
    const emailHTML = generateQuoteEmail({
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
      notes: notes.trim()
    });

    // Send email via Resend
    try {
      const { data, error } = await resend.emails.send({
        from: COMPANY_EMAIL,
        to: [customerEmail.trim()],
        subject: `Quote #${quoteNumber} from Breed Industries`,
        html: emailHTML,
        replyTo: COMPANY_EMAIL
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error('Failed to send email: ' + error.message);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Quote sent successfully to your email',
        quoteNumber
      });
    } catch (sendError) {
      console.error('Email send error:', sendError);
      return NextResponse.json(
        { error: 'Failed to send email: ' + (sendError instanceof Error ? sendError.message : 'Unknown email error') },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quote' },
      { status: 500 }
    );
  }
}

function generateQuoteEmail(data: any) {
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
        <div style="font-size: 12px; color: #666; margin-top: 5px;">${item.description || ''}</div>
      </td>
      <td style="text-align: right;">${item.quantity}</td>
      <td style="text-align: right;">${formatCurrency(item.rate)}</td>
      <td style="text-align: right;">${formatCurrency(item.quantity * item.rate)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Quote #${quoteNumber} - Breed Industries</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #1A1A1B;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1A1A1B;
            margin-bottom: 10px;
        }
        .quote-details {
            text-align: center;
            margin-bottom: 20px;
        }
        .quote-number {
            font-size: 18px;
            font-weight: bold;
            color: #1A1A1B;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #1A1A1B;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .info-item {
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: bold;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #1A1A1B;
            color: white;
            font-weight: bold;
        }
        .right {
            text-align: right;
        }
        .totals {
            text-align: right;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .total {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #1A1A1B;
            padding-top: 10px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">BREED INDUSTRIES</div>
            <div class="quote-details">
                <div class="quote-number">Quote #${quoteNumber}</div>
                <div>Date: ${currentDate}</div>
                <div>Valid Until: ${validUntil}</div>
            </div>
        </div>

        <div class="section">
            <h2>Project Information</h2>
            <div class="info-grid">
                <div>
                    <div class="info-item">
                        <div class="info-label">Project Name:</div>
                        <div>${projectName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Contact Person:</div>
                        <div>${contactPerson}</div>
                    </div>
                </div>
                <div>
                    <div class="info-item">
                        <div class="info-label">Payment Terms:</div>
                        <div>${paymentTerms}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Customer Information</h2>
            <div class="info-grid">
                <div>
                    <div class="info-item">
                        <div class="info-label">Name:</div>
                        <div>${customerName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Company:</div>
                        <div>${customerCompany || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Address:</div>
                        <div>${customerAddress || 'N/A'}</div>
                    </div>
                </div>
                <div>
                    <div class="info-item">
                        <div class="info-label">Email:</div>
                        <div>${customerEmail}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone:</div>
                        <div>${customerPhone || 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Quote Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th class="right">Quantity</th>
                        <th class="right">Rate</th>
                        <th class="right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            <div class="totals">
                <div class="total-row total">
                    <span>Total (ex VAT):</span>
                    <span>${formatCurrency(total)}</span>
                </div>
                <div class="total-row" style="font-size: 12px; color: #888;">
                    <span>Breed Industries is not VAT registered. All pricing is exclusive of VAT.</span>
                </div>
            </div>
        </div>

        ${notes ? `
        <div class="section">
            <h2>Notes</h2>
            <p>${notes}</p>
        </div>
        ` : ''}

        <div class="section">
            <h2>Terms & Conditions</h2>
            <p>
                Payment is due within 30 days of invoice date. Late payments may incur a 1.5% monthly interest charge. 
                All work is guaranteed for 90 days from completion. Client is responsible for providing all necessary 
                content and materials. Changes to project scope may result in additional charges. We reserve the right 
                to use completed work in our portfolio unless otherwise agreed in writing.
            </p>
        </div>

        <div class="footer">
            <p><strong>Thank you for your business!</strong></p>
            <p>www.thebreed.co.za | info@thebreed.co.za | +27 60 496 4105</p>
        </div>
    </div>
</body>
</html>`;
}
