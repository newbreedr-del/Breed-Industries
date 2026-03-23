import nodemailer from 'nodemailer';
import Imap from 'imap';
import { simpleParser } from 'mailparser';

// Email configuration
const SMTP_CONFIG = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SALES_EMAIL_USER || 'sales@thebreed.co.za',
    pass: process.env.SALES_EMAIL_PASSWORD || ''
  }
};

const IMAP_CONFIG = {
  user: process.env.SALES_EMAIL_USER || 'sales@thebreed.co.za',
  password: process.env.SALES_EMAIL_PASSWORD || '',
  host: 'imap.hostinger.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
};

// Create SMTP transporter
export function createTransporter() {
  return nodemailer.createTransporter(SMTP_CONFIG);
}

// Send email via SMTP
export async function sendEmail(options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  replyTo?: string;
}) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `Breed Industries <${SMTP_CONFIG.auth.user}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
      replyTo: options.replyTo || SMTP_CONFIG.auth.user
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Send invoice email
export async function sendInvoiceEmail(
  customerEmail: string,
  customerName: string,
  invoiceNumber: string,
  invoicePDF: Buffer,
  options?: {
    subject?: string;
    message?: string;
  }
) {
  const subject = options?.subject || `Invoice ${invoiceNumber} from Breed Industries`;
  const message = options?.message || `
Dear ${customerName},

Thank you for your business! Please find attached invoice ${invoiceNumber}.

Payment Details:
- Bank: Standard Bank
- Account Name: The Breed Industries (PTY) LTD
- Account Number: 10268731932
- Branch Code: 051001
- SWIFT Code: SBZA ZA JJ

A 50% deposit is required before work commences. The balance is due upon project completion.

If you have any questions about this invoice, please don't hesitate to contact us.

Best regards,
The Breed Industries Team

---
www.thebreed.co.za
info@thebreed.co.za
+27 60 496 4105
  `.trim();

  return sendEmail({
    to: customerEmail,
    subject,
    text: message,
    html: message.replace(/\n/g, '<br>'),
    attachments: [{
      filename: `Invoice_${invoiceNumber}.pdf`,
      content: invoicePDF,
      contentType: 'application/pdf'
    }]
  });
}

// IMAP: Connect and fetch unread emails
export async function fetchUnreadEmails(): Promise<Array<{
  from: string;
  subject: string;
  date: Date;
  text: string;
  html: string;
  messageId: string;
  inReplyTo?: string;
  references?: string[];
}>> {
  return new Promise((resolve, reject) => {
    const imap = new Imap(IMAP_CONFIG);
    const emails: any[] = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        imap.search(['UNSEEN'], (err, results) => {
          if (err) {
            reject(err);
            return;
          }

          if (!results || results.length === 0) {
            imap.end();
            resolve([]);
            return;
          }

          const fetch = imap.fetch(results, { bodies: '' });

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) {
                  console.error('Error parsing email:', err);
                  return;
                }

                emails.push({
                  from: parsed.from?.text || '',
                  subject: parsed.subject || '',
                  date: parsed.date || new Date(),
                  text: parsed.text || '',
                  html: parsed.html || '',
                  messageId: parsed.messageId || '',
                  inReplyTo: parsed.inReplyTo,
                  references: parsed.references
                });
              });
            });
          });

          fetch.once('error', (err) => {
            reject(err);
          });

          fetch.once('end', () => {
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.once('end', () => {
      resolve(emails);
    });

    imap.connect();
  });
}

// Mark email as read
export async function markEmailAsRead(messageId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const imap = new Imap(IMAP_CONFIG);

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err) => {
        if (err) {
          reject(err);
          return;
        }

        imap.search([['HEADER', 'MESSAGE-ID', messageId]], (err, results) => {
          if (err) {
            reject(err);
            return;
          }

          if (results && results.length > 0) {
            imap.addFlags(results, ['\\Seen'], (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
              imap.end();
            });
          } else {
            imap.end();
            resolve();
          }
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.connect();
  });
}

// Classify email type
export function classifyEmail(subject: string, text: string): 'lead' | 'support' | 'billing' | 'spam' {
  const lowerSubject = subject.toLowerCase();
  const lowerText = text.toLowerCase();

  // Spam indicators
  if (
    lowerSubject.includes('unsubscribe') ||
    lowerSubject.includes('viagra') ||
    lowerSubject.includes('casino') ||
    lowerText.includes('click here to unsubscribe')
  ) {
    return 'spam';
  }

  // Billing indicators
  if (
    lowerSubject.includes('invoice') ||
    lowerSubject.includes('payment') ||
    lowerSubject.includes('quote') ||
    lowerText.includes('payment') ||
    lowerText.includes('invoice')
  ) {
    return 'billing';
  }

  // Support indicators
  if (
    lowerSubject.includes('help') ||
    lowerSubject.includes('support') ||
    lowerSubject.includes('issue') ||
    lowerSubject.includes('problem')
  ) {
    return 'support';
  }

  // Default to lead
  return 'lead';
}
