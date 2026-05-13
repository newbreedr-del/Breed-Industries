/**
 * Breed Industries — Shared PDF Design Utility
 * Brand: Dark Navy (#0B1118) + Orange (#FF9F00) + White (#FFFFFF)
 *
 * Usage:
 *   const pdf = new BreedPDF();
 *   pdf.addCoverPage({ title: 'Fresh Start', subtitle: 'Welcome Pack' });
 *   pdf.addSection('Section Heading', 'Body text...');
 *   const buffer = pdf.toBuffer();
 */

import jsPDF from 'jspdf';
import fs from 'fs';
import path from 'path';
import { scopeDetails as scopeDetailsData } from '@/data/scopeDetails';

// ── Brand Tokens ─────────────────────────────────────────────────────────────
const NAVY:   [number, number, number] = [11,  17,  24];   // #0B1118
const ORANGE: [number, number, number] = [255, 159,  0];   // #FF9F00
const WHITE:  [number, number, number] = [255, 255, 255];
const OFFWHITE: [number, number, number] = [248, 248, 250];
const MUTED:  [number, number, number] = [110, 118, 130];
const DARK:   [number, number, number] = [28,  34,  44];
const LIGHT_BORDER: [number, number, number] = [228, 232, 238];

// ── Page Dimensions ───────────────────────────────────────────────────────────
const PAGE_W   = 210;
const PAGE_H   = 297;
const MARGIN   = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H  = 16;

// ── Logo ──────────────────────────────────────────────────────────────────────
function loadLogoBase64(): string | null {
  try {
    // Try the white logo first (for dark backgrounds)
    const logoPaths = [
      path.join(process.cwd(), 'assets', 'images', 'The Breed Industries Just Logo-01 igkjh-01.png'),
      path.join(process.cwd(), 'public', 'assets', 'images', 'logos', 'breed-logo-just.png'),
      path.join(process.cwd(), 'assets', 'images', 'breed-logo.png'),
    ];

    for (const p of logoPaths) {
      if (fs.existsSync(p)) {
        const data = fs.readFileSync(p);
        return `data:image/png;base64,${data.toString('base64')}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export class BreedPDF {
  private doc: jsPDF;
  private logoBase64: string | null;
  private currentY: number = 0;

  constructor() {
    this.doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    this.logoBase64 = loadLogoBase64();
  }

  // ── Private Helpers ─────────────────────────────────────────────────────────

  private setFont(style: 'bold' | 'normal' | 'italic' = 'normal', size: number = 10) {
    this.doc.setFont('helvetica', style);
    this.doc.setFontSize(size);
  }

  private drawPageFooter() {
    const y = PAGE_H - FOOTER_H;
    this.doc.setFillColor(...NAVY);
    this.doc.rect(0, y, PAGE_W, FOOTER_H, 'F');
    this.setFont('normal', 7);
    this.doc.setTextColor(...WHITE);
    this.doc.text(
      'The Breed Industries (PTY) LTD  ·  www.thebreed.co.za  ·  info@thebreed.co.za  ·  +27 60 496 4105',
      PAGE_W / 2,
      y + 6,
      { align: 'center' }
    );
    this.doc.setTextColor(...MUTED);
    this.doc.text(
      `Page ${this.doc.getCurrentPageInfo().pageNumber}`,
      PAGE_W / 2,
      y + 11,
      { align: 'center' }
    );
  }

  private drawSectionHeader(title: string) {
    const y = this.currentY;
    // Orange left accent bar
    this.doc.setFillColor(...ORANGE);
    this.doc.rect(MARGIN, y, 3, 7, 'F');
    // Title text
    this.setFont('bold', 11);
    this.doc.setTextColor(...DARK);
    this.doc.text(title.toUpperCase(), MARGIN + 6, y + 5.5);
    // Thin divider line
    this.doc.setDrawColor(...LIGHT_BORDER);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGIN, y + 9, MARGIN + CONTENT_W, y + 9);
    this.currentY = y + 14;
  }

  private checkPageBreak(neededHeight: number) {
    if (this.currentY + neededHeight > PAGE_H - FOOTER_H - 8) {
      this.drawPageFooter();
      this.doc.addPage();
      this.drawContentPageHeader(); // sets this.currentY = 30
    }
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Cover page — full navy background with logo, document title and subtitle.
   */
  addCoverPage(opts: {
    title: string;
    subtitle: string;
    recipientName?: string;
    date?: string;
    refNumber?: string;
  }) {
    // Full navy background
    this.doc.setFillColor(...NAVY);
    this.doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

    // Orange accent band across the top
    this.doc.setFillColor(...ORANGE);
    this.doc.rect(0, 0, PAGE_W, 4, 'F');

    // Logo (top-left)
    if (this.logoBase64) {
      try {
        this.doc.addImage(this.logoBase64, 'PNG', MARGIN, 18, 28, 28);
      } catch { /* silently skip if image fails */ }
    }

    // Company name (top-right, stacked)
    this.setFont('bold', 16);
    this.doc.setTextColor(...WHITE);
    this.doc.text('BREED', PAGE_W - MARGIN, 27, { align: 'right' });
    this.setFont('normal', 8);
    this.doc.setTextColor(...ORANGE);
    this.doc.text('INDUSTRIES', PAGE_W - MARGIN, 34, { align: 'right' });

    // Horizontal rule
    this.doc.setDrawColor(...ORANGE);
    this.doc.setLineWidth(0.5);
    this.doc.line(MARGIN, 55, PAGE_W - MARGIN, 55);

    // Document title (large, centred, lower half)
    this.setFont('bold', 32);
    this.doc.setTextColor(...WHITE);
    this.doc.text(opts.title.toUpperCase(), PAGE_W / 2, 130, { align: 'center' });

    // Subtitle
    this.setFont('normal', 13);
    this.doc.setTextColor(...ORANGE);
    this.doc.text(opts.subtitle, PAGE_W / 2, 144, { align: 'center' });

    // Divider
    this.doc.setDrawColor(...ORANGE);
    this.doc.setLineWidth(0.3);
    this.doc.line(PAGE_W / 2 - 30, 150, PAGE_W / 2 + 30, 150);

    // Recipient / meta block
    let metaY = 162;
    if (opts.recipientName) {
      this.setFont('normal', 9);
      this.doc.setTextColor(180, 190, 200);
      this.doc.text('Prepared for:', PAGE_W / 2, metaY, { align: 'center' });
      this.setFont('bold', 11);
      this.doc.setTextColor(...WHITE);
      this.doc.text(opts.recipientName, PAGE_W / 2, metaY + 7, { align: 'center' });
      metaY += 18;
    }

    if (opts.date || opts.refNumber) {
      this.setFont('normal', 8);
      this.doc.setTextColor(140, 155, 170);
      if (opts.date) {
        this.doc.text(`Date: ${opts.date}`, PAGE_W / 2, metaY, { align: 'center' });
        metaY += 6;
      }
      if (opts.refNumber) {
        this.doc.text(`Reference: ${opts.refNumber}`, PAGE_W / 2, metaY, { align: 'center' });
      }
    }

    // Bottom orange bar
    this.doc.setFillColor(...ORANGE);
    this.doc.rect(0, PAGE_H - 4, PAGE_W, 4, 'F');

    // Start content on next page
    this.doc.addPage();
    this.currentY = MARGIN + 4;
    this.drawContentPageHeader();
  }

  /**
   * Letterhead header drawn on content pages (navy strip, logo, company name).
   */
  private drawContentPageHeader() {
    this.doc.setFillColor(...NAVY);
    this.doc.rect(0, 0, PAGE_W, 22, 'F');

    if (this.logoBase64) {
      try {
        this.doc.addImage(this.logoBase64, 'PNG', MARGIN, 3, 14, 14);
      } catch { /* skip */ }
    }

    this.setFont('bold', 11);
    this.doc.setTextColor(...WHITE);
    this.doc.text('BREED', MARGIN + 17, 12);
    this.setFont('normal', 6);
    this.doc.setTextColor(...ORANGE);
    this.doc.text('INDUSTRIES', MARGIN + 17, 17);

    // Orange accent bar below header
    this.doc.setFillColor(...ORANGE);
    this.doc.rect(0, 22, PAGE_W, 2, 'F');

    this.currentY = 30;
  }

  /**
   * Add a new section with a heading and body text.
   */
  addSection(heading: string, body: string, opts?: { highlight?: boolean }) {
    this.checkPageBreak(30);
    this.drawSectionHeader(heading);

    if (body) {
      const lines = this.doc.splitTextToSize(body, CONTENT_W - 4);
      this.checkPageBreak(lines.length * 5 + 4);
      this.setFont('normal', 9);
      this.doc.setTextColor(...DARK);
      if (opts?.highlight) {
        this.doc.setFillColor(...OFFWHITE);
        this.doc.rect(MARGIN, this.currentY - 2, CONTENT_W, lines.length * 5 + 4, 'F');
      }
      this.doc.text(lines, MARGIN + 2, this.currentY + 3);
      this.currentY += lines.length * 5 + 8;
    }
  }

  /**
   * Add a list of bullet items under a heading.
   */
  addList(heading: string, items: Array<{ label: string; value?: string; note?: string }>) {
    this.checkPageBreak(20 + items.length * 10);
    if (heading) this.drawSectionHeader(heading);

    items.forEach((item) => {
      this.checkPageBreak(12);
      // Orange bullet dot
      this.doc.setFillColor(...ORANGE);
      this.doc.circle(MARGIN + 3, this.currentY + 2.5, 1.2, 'F');

      this.setFont('bold', 9);
      this.doc.setTextColor(...DARK);
      this.doc.text(item.label, MARGIN + 8, this.currentY + 4);

      if (item.value) {
        this.setFont('normal', 9);
        this.doc.setTextColor(...MUTED);
        this.doc.text(item.value, PAGE_W - MARGIN, this.currentY + 4, { align: 'right' });
      }

      if (item.note) {
        this.setFont('italic', 8);
        this.doc.setTextColor(...MUTED);
        const noteLines = this.doc.splitTextToSize(item.note, CONTENT_W - 12);
        this.doc.text(noteLines, MARGIN + 8, this.currentY + 9);
        this.currentY += noteLines.length * 4 + 8;
      } else {
        this.currentY += 9;
      }
    });

    this.currentY += 4;
  }

  /**
   * Add a highlighted call-out box (orange border, light background).
   */
  addCallout(text: string, type: 'info' | 'important' | 'legal' = 'info') {
    const lines = this.doc.splitTextToSize(text, CONTENT_W - 16);
    const boxH = lines.length * 5 + 12;
    this.checkPageBreak(boxH + 6);

    const bgColor: [number, number, number] =
      type === 'legal' ? [245, 247, 250] :
      type === 'important' ? [255, 250, 240] :
      [240, 248, 255];

    this.doc.setFillColor(...bgColor);
    this.doc.rect(MARGIN, this.currentY, CONTENT_W, boxH, 'F');
    // Left accent
    this.doc.setFillColor(...ORANGE);
    this.doc.rect(MARGIN, this.currentY, 3, boxH, 'F');

    this.setFont('normal', 9);
    this.doc.setTextColor(...DARK);
    this.doc.text(lines, MARGIN + 8, this.currentY + 7);
    this.currentY += boxH + 6;
  }

  /**
   * Add a three-step process block.
   */
  addSteps(steps: Array<{ number: string; title: string; description: string }>) {
    steps.forEach((step) => {
      this.checkPageBreak(24);

      // Step number circle — center Y is currentY+5, radius 5
      // For Helvetica Bold 9pt, cap height ~2.3mm, so baseline = center + ~1.1
      this.doc.setFillColor(...ORANGE);
      this.doc.circle(MARGIN + 5, this.currentY + 5, 5, 'F');
      this.setFont('bold', 9);
      this.doc.setTextColor(...WHITE);
      this.doc.text(step.number, MARGIN + 5, this.currentY + 6.1, { align: 'center' });

      // Title
      this.setFont('bold', 10);
      this.doc.setTextColor(...DARK);
      this.doc.text(step.title, MARGIN + 14, this.currentY + 4);

      // Description
      const descLines = this.doc.splitTextToSize(step.description, CONTENT_W - 18);
      this.setFont('normal', 8.5);
      this.doc.setTextColor(...MUTED);
      this.doc.text(descLines, MARGIN + 14, this.currentY + 10);
      this.currentY += descLines.length * 4.5 + 14;
    });
  }

  /**
   * Add a two-column funding source card row.
   */
  addFundingCards(cards: Array<{ name: string; description: string; type: string }>) {
    const cardW = (CONTENT_W - 6) / 2;
    let col = 0;
    let rowStartY = this.currentY;

    cards.forEach((card, i) => {
      if (col === 0) {
        this.checkPageBreak(36);
        rowStartY = this.currentY;
      }

      const x = MARGIN + col * (cardW + 6);
      const descLines = this.doc.splitTextToSize(card.description, cardW - 10);
      const cardH = descLines.length * 4.5 + 22;

      // Card background
      this.doc.setFillColor(...OFFWHITE);
      this.doc.rect(x, rowStartY, cardW, cardH, 'F');
      // Orange top bar
      this.doc.setFillColor(...ORANGE);
      this.doc.rect(x, rowStartY, cardW, 2, 'F');

      // Type badge
      this.setFont('normal', 7);
      this.doc.setTextColor(...ORANGE);
      this.doc.text(card.type.toUpperCase(), x + 5, rowStartY + 8);

      // Name
      this.setFont('bold', 9);
      this.doc.setTextColor(...DARK);
      this.doc.text(card.name, x + 5, rowStartY + 14);

      // Description
      this.setFont('normal', 8);
      this.doc.setTextColor(...MUTED);
      this.doc.text(descLines, x + 5, rowStartY + 20);

      col++;
      if (col === 2 || i === cards.length - 1) {
        const maxCardH = 36; // approximate
        this.currentY = rowStartY + maxCardH + 6;
        col = 0;
      }
    });

    this.currentY += 4;
  }

  /**
   * Spacer
   */
  addSpacer(mm: number = 6) {
    this.currentY += mm;
  }

  /**
   * Finish the last page with footer and return buffer.
   */
  toBuffer(): Buffer {
    this.drawPageFooter();
    return Buffer.from(this.doc.output('arraybuffer'));
  }
}

// ── Quote PDF Interfaces ────────────────────────────────────────────────────

export interface QuoteItemData {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  pricingType?: 'one-time' | 'monthly';
}

export interface QuoteData {
  quoteNumber: string;
  customerName: string;
  customerCompany?: string;
  customerAddress?: string;
  customerEmail: string;
  customerPhone?: string;
  projectName: string;
  contactPerson: string;
  paymentTerms: string;
  requireDeposit: boolean;
  items: QuoteItemData[];
  notes?: string;
  date: string;
  validUntil: string;
}

// ── Helper for Quote PDF Scope Details ───────────────────────────────────────

// Scope details will be loaded from @/data/scopeDetails.ts
// This is imported in the generateQuotePDF function

/**
 * Generate a professional quote PDF with full branding.
 * Page 1: Cover, header, items table, totals, banking details.
 * Page 2+: Scope of Work, Payment Terms, Terms & Conditions.
 */
export function generateQuotePDF(data: QuoteData): Buffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });

  // ── Brand Colors ────────────────────────────────────────────────────────────
  const NAVY: [number, number, number] = [11, 17, 24];       // #0B1118
  const ORANGE: [number, number, number] = [255, 159, 0];    // #FF9F00
  const WHITE: [number, number, number] = [255, 255, 255];
  const OFFWHITE: [number, number, number] = [248, 248, 250];
  const MUTED: [number, number, number] = [110, 118, 130];
  const DARK: [number, number, number] = [28, 34, 44];
  const LIGHT_GRAY: [number, number, number] = [228, 232, 238];
  const ORANGE_LIGHT: [number, number, number] = [255, 243, 230];

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 20;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const FOOTER_Y = PAGE_H - 14;
  const HEADER_H = 52;

  // ── Load Logo ───────────────────────────────────────────────────────────────
  const logoBase64 = loadLogoBase64();

  // ── Helper Functions ──────────────────────────────────────────────────────

  function setFont(style: 'bold' | 'normal' | 'italic' = 'normal', size: number = 10) {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
  }

  function drawQFooter(pageNum: number, totalPages: number) {
    doc.setDrawColor(...LIGHT_GRAY);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, FOOTER_Y, PAGE_W - MARGIN, FOOTER_Y);
    setFont('normal', 7);
    doc.setTextColor(...MUTED);
    doc.text(
      'The Breed Industries (PTY) LTD · 12 Kings Road, Pinetown, Durban 3610 · www.thebreed.co.za · info@thebreed.co.za · +27 31 459 0080',
      MARGIN,
      FOOTER_Y + 5
    );
    doc.text(
      `Page ${pageNum} of ${totalPages}`,
      PAGE_W - MARGIN,
      FOOTER_Y + 5,
      { align: 'right' }
    );
  }

  // ── Page 1: Quotation Cover ────────────────────────────────────────────────

  // Full navy header background
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, HEADER_H, 'F');

  // Logo (left)
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', MARGIN, 8, 36, 36);
    } catch { /* skip */ }
  }

  // Company contact (right side of header)
  setFont('normal', 7);
  doc.setTextColor(200, 200, 200);
  doc.text('The Breed Industries (PTY) LTD', PAGE_W - MARGIN, 14, { align: 'right' });
  doc.text('12 Kings Road, Pinetown, Durban 3610', PAGE_W - MARGIN, 20, { align: 'right' });
  doc.text('Landline: +27 31 459 0080', PAGE_W - MARGIN, 26, { align: 'right' });
  doc.text('Mobile: +27 60 496 4105', PAGE_W - MARGIN, 32, { align: 'right' });
  doc.text('Email: info@thebreed.co.za', PAGE_W - MARGIN, 38, { align: 'right' });
  doc.text('Web: www.thebreed.co.za', PAGE_W - MARGIN, 44, { align: 'right' });

  // Orange title bar
  doc.setFillColor(...ORANGE);
  doc.rect(0, HEADER_H, PAGE_W, 14, 'F');
  setFont('bold', 14);
  doc.setTextColor(...NAVY);
  doc.text('QUOTATION', MARGIN, HEADER_H + 10);
  setFont('bold', 12);
  doc.text(`#${data.quoteNumber}`, PAGE_W - MARGIN, HEADER_H + 10, { align: 'right' });

  // Meta row (Date / Valid Until / Terms)
  let y = HEADER_H + 22;
  doc.setFillColor(...OFFWHITE);
  doc.rect(MARGIN, y, CONTENT_W, 12, 'F');
  setFont('bold', 8);
  doc.setTextColor(...DARK);
  doc.text(`Date: ${data.date}`, MARGIN + 4, y + 8);
  doc.text(`Valid Until: ${data.validUntil}`, MARGIN + CONTENT_W / 3, y + 8);
  doc.text(`Terms: ${data.paymentTerms}`, MARGIN + (CONTENT_W * 2) / 3, y + 8);

  // Two-panel Bill To + Project block
  y += 18;
  const panelW = (CONTENT_W - 8) / 2;

  // Calculate Bill To panel height dynamically based on content
  let billToHeight = 44; // Base height
  if (data.customerAddress) {
    const addrLines = doc.splitTextToSize(data.customerAddress, panelW - 12);
    billToHeight += (addrLines.length - 1) * 4; // Add height for extra address lines
  }
  if (!data.customerPhone) billToHeight -= 4; // Reduce if no phone
  
  // Ensure minimum height matches project panel
  const projectPanelHeight = 40;
  const panelHeight = Math.max(billToHeight, projectPanelHeight);

  // Bill To panel
  doc.setFillColor(...OFFWHITE);
  doc.rect(MARGIN, y, panelW, panelHeight, 'F');
  doc.setFillColor(...ORANGE);
  doc.rect(MARGIN, y, 3, panelHeight, 'F');
  setFont('bold', 9);
  doc.setTextColor(...ORANGE);
  doc.text('BILL TO', MARGIN + 6, y + 7);
  setFont('bold', 10);
  doc.setTextColor(...DARK);
  doc.text(data.customerName, MARGIN + 6, y + 16);
  setFont('normal', 8);
  doc.setTextColor(...MUTED);
  let currentY = y + 22;
  if (data.customerCompany) {
    doc.text(data.customerCompany, MARGIN + 6, currentY);
    currentY += 6;
  }
  if (data.customerAddress) {
    const addrLines = doc.splitTextToSize(data.customerAddress, panelW - 12);
    doc.text(addrLines, MARGIN + 6, currentY);
    currentY += (addrLines.length * 4) + 2;
  }
  doc.text(data.customerEmail, MARGIN + 6, currentY);
  currentY += 6;
  if (data.customerPhone) {
    doc.text(data.customerPhone, MARGIN + 6, currentY);
  }

  // Project panel
  doc.setFillColor(...OFFWHITE);
  doc.rect(MARGIN + panelW + 8, y, panelW, panelHeight, 'F');
  doc.setFillColor(...ORANGE);
  doc.rect(MARGIN + panelW + 8, y, 3, panelHeight, 'F');
  setFont('bold', 9);
  doc.setTextColor(...ORANGE);
  doc.text('PROJECT', MARGIN + panelW + 14, y + 7);
  setFont('bold', 10);
  doc.setTextColor(...DARK);
  doc.text(data.projectName, MARGIN + panelW + 14, y + 16);
  setFont('normal', 8);
  doc.setTextColor(...MUTED);
  doc.text(`Contact: ${data.contactPerson}`, MARGIN + panelW + 14, y + 26);
  doc.text(`Payment: ${data.paymentTerms}`, MARGIN + panelW + 14, y + 32);

  // Items table header
  y += 48;
  doc.setFillColor(...NAVY);
  doc.rect(MARGIN, y, CONTENT_W, 10, 'F');
  setFont('bold', 9);
  doc.setTextColor(...WHITE);
  doc.text('#', MARGIN + 4, y + 6.5);
  doc.text('Service / Description', MARGIN + 14, y + 6.5);
  doc.text('Qty', PAGE_W - MARGIN - 50, y + 6.5, { align: 'center' });
  doc.text('Rate', PAGE_W - MARGIN - 30, y + 6.5, { align: 'center' });
  doc.text('Amount', PAGE_W - MARGIN - 4, y + 6.5, { align: 'right' });

  // Items rows
  y += 10;
  let oneTimeTotal = 0;
  let monthlyTotal = 0;

  data.items.forEach((item, i) => {
    const amount = item.quantity * item.rate;
    if (item.pricingType === 'monthly') {
      monthlyTotal += amount;
    } else {
      oneTimeTotal += amount;
    }

    const hasDesc = item.description && item.description.trim().length > 0;
    const rowH   = hasDesc ? 18 : 12;
    // Vertically centre all text within the row
    const textY  = y + rowH / 2 + 1.5;

    const rowColor = i % 2 === 0 ? OFFWHITE : WHITE;
    doc.setFillColor(...rowColor);
    doc.rect(MARGIN, y, CONTENT_W, rowH, 'F');

    // Row number + item name — same baseline as qty/rate/amount
    setFont('bold', 8.5);
    doc.setTextColor(...DARK);
    doc.text(`${i + 1}`, MARGIN + 4, textY);
    doc.text(item.name + (item.pricingType === 'monthly' ? ' (Monthly)' : ''), MARGIN + 14, textY);

    // Description on a second line when present
    if (hasDesc) {
      setFont('normal', 7.5);
      doc.setTextColor(...MUTED);
      const descLines = doc.splitTextToSize(item.description, CONTENT_W - 75);
      doc.text(descLines[0] || '', MARGIN + 14, y + 13);
    }

    // Qty / Rate / Amount — exactly same baseline as name
    setFont('normal', 8.5);
    doc.setTextColor(...DARK);
    doc.text(item.quantity.toString(), PAGE_W - MARGIN - 50, textY, { align: 'center' });
    doc.text(`R${item.rate.toLocaleString('en-ZA')}`, PAGE_W - MARGIN - 30, textY, { align: 'center' });
    setFont('bold', 8.5);
    doc.text(`R${amount.toLocaleString('en-ZA')}`, PAGE_W - MARGIN - 4, textY, { align: 'right' });

    y += rowH;
  });

  // ── Totals ────────────────────────────────────────────────────────────────
  y += 6;

  // Page-break guard: calculate everything that follows and add a new page if needed
  {
    const hasDeposit = data.requireDeposit && oneTimeTotal > 0;
    const neededH =
      (oneTimeTotal > 0 ? 7 : 0) +
      (monthlyTotal > 0 ? 7 : 0) +
      (hasDeposit ? 13 : 0) +
      4 + 14 +                       // gap + total bar
      (monthlyTotal > 0 ? 18 : 0) +  // monthly subscription note
      (data.notes ? 25 : 0) +        // optional notes block estimate
      6 + 10 +                       // VAT note gap + height
      4 + 44 + 4;                    // banking block gap + height + bottom margin

    if (y + neededH > FOOTER_Y) {
      doc.addPage();
      // Compact page header (matches page 2+ style)
      doc.setFillColor(...NAVY);
      doc.rect(0, 0, PAGE_W, 22, 'F');
      if (logoBase64) {
        try { doc.addImage(logoBase64, 'PNG', MARGIN, 3, 14, 14); } catch { /* skip */ }
      }
      setFont('bold', 11);
      doc.setTextColor(...WHITE);
      doc.text('BREED', MARGIN + 17, 12);
      setFont('normal', 6);
      doc.setTextColor(...ORANGE);
      doc.text('INDUSTRIES', MARGIN + 17, 17);
      doc.setFillColor(...ORANGE);
      doc.rect(0, 22, PAGE_W, 2, 'F');
      y = 32;
    }
  }

  if (oneTimeTotal > 0) {
    setFont('bold', 9);
    doc.setTextColor(...MUTED);
    doc.text('One-Time Subtotal:', PAGE_W - MARGIN - 62, y);
    doc.setTextColor(...DARK);
    doc.text(`R${oneTimeTotal.toLocaleString('en-ZA')}`, PAGE_W - MARGIN - 4, y, { align: 'right' });
    y += 7;
  }

  if (monthlyTotal > 0) {
    setFont('bold', 9);
    doc.setTextColor(...MUTED);
    doc.text('Monthly Subscription:', PAGE_W - MARGIN - 62, y);
    doc.setTextColor(...DARK);
    doc.text(`R${monthlyTotal.toLocaleString('en-ZA')}/mo`, PAGE_W - MARGIN - 4, y, { align: 'right' });
    y += 7;
  }

  if (data.requireDeposit && oneTimeTotal > 0) {
    const deposit = oneTimeTotal * 0.5;
    const balance = oneTimeTotal - deposit;
    setFont('normal', 8);
    doc.setTextColor(...MUTED);
    doc.text('50% Deposit Due:', PAGE_W - MARGIN - 62, y);
    doc.setTextColor(...DARK);
    doc.text(`R${deposit.toLocaleString('en-ZA')}`, PAGE_W - MARGIN - 4, y, { align: 'right' });
    y += 6;
    doc.setTextColor(...MUTED);
    doc.text('Balance on Completion:', PAGE_W - MARGIN - 62, y);
    doc.setTextColor(...DARK);
    doc.text(`R${balance.toLocaleString('en-ZA')}`, PAGE_W - MARGIN - 4, y, { align: 'right' });
    y += 7;
  }

  // Total bar
  y += 4;
  doc.setFillColor(...NAVY);
  doc.rect(MARGIN, y, CONTENT_W, 14, 'F');
  setFont('bold', 11);
  doc.setTextColor(...WHITE);
  doc.text('TOTAL', MARGIN + 6, y + 9);
  doc.setTextColor(...ORANGE);
  doc.text(`R${oneTimeTotal.toLocaleString('en-ZA')}`, PAGE_W - MARGIN - 4, y + 9, { align: 'right' });
  y += 14; // advance y past the total bar rect

  // Monthly subscription note (optional, below total bar)
  if (monthlyTotal > 0) {
    y += 4;
    doc.setFillColor(...ORANGE_LIGHT);
    doc.rect(MARGIN, y, CONTENT_W, 14, 'F');
    doc.setFillColor(...ORANGE);
    doc.rect(MARGIN, y, 3, 14, 'F');
    setFont('normal', 7.5);
    doc.setTextColor(...DARK);
    const noteText = `Monthly subscription of R${monthlyTotal.toLocaleString('en-ZA')}/mo will be invoiced separately after initial payment.`;
    doc.text(doc.splitTextToSize(noteText, CONTENT_W - 10), MARGIN + 6, y + 5.5);
    y += 14;
  }

  // Notes (if present)
  if (data.notes) {
    y += 6;
    setFont('bold', 8);
    doc.setTextColor(...NAVY);
    doc.text('Notes:', MARGIN, y);
    y += 5;
    setFont('normal', 8);
    doc.setTextColor(...DARK);
    const noteLines = doc.splitTextToSize(data.notes, CONTENT_W);
    doc.text(noteLines.slice(0, 4), MARGIN, y); // max 4 lines on page 1
    y += noteLines.slice(0, 4).length * 4 + 2;
  }

  // ── VAT note ──────────────────────────────────────────────────────────────
  y += 6;
  setFont('italic', 7);
  doc.setTextColor(...MUTED);
  doc.text('All prices exclude VAT. VAT will be added at the applicable rate where required.', MARGIN, y);
  y += 10;

  // ── Payment + Banking two-column block ────────────────────────────────────
  // The page-break guard above guarantees there is room below y for this block.
  const blockH = 44;
  const blockY = y; // safe: page break was taken if needed
  const halfW  = (CONTENT_W - 6) / 2;

  doc.setFillColor(...OFFWHITE);
  doc.rect(MARGIN, blockY, CONTENT_W, blockH, 'F');
  doc.setFillColor(...ORANGE);
  doc.rect(MARGIN, blockY, 3, blockH, 'F');

  // Left column — Payment terms
  setFont('bold', 8);
  doc.setTextColor(...NAVY);
  doc.text('PAYMENT REQUIRED', MARGIN + 7, blockY + 9);
  setFont('normal', 7.5);
  doc.setTextColor(...DARK);
  const paymentText = data.requireDeposit
    ? 'A 50% deposit is required before work commences. Balance due on project completion.'
    : 'Full payment is required before any work commences.';
  const payLines = doc.splitTextToSize(paymentText, halfW - 6);
  doc.text(payLines, MARGIN + 7, blockY + 17);

  // Vertical divider
  doc.setDrawColor(...LIGHT_GRAY);
  doc.setLineWidth(0.3);
  doc.line(MARGIN + halfW + 3, blockY + 6, MARGIN + halfW + 3, blockY + blockH - 6);

  // Right column — Banking details
  const bx = MARGIN + halfW + 9;
  setFont('bold', 8);
  doc.setTextColor(...NAVY);
  doc.text('BANKING DETAILS', bx, blockY + 9);
  setFont('normal', 7.5);
  doc.setTextColor(...DARK);
  doc.text('Bank:',           bx,      blockY + 17); doc.text('Standard Bank',                    bx + 22, blockY + 17);
  doc.text('Account:',        bx,      blockY + 24); doc.text('The Breed Industries (PTY) LTD',   bx + 22, blockY + 24);
  doc.text('Acc No:',         bx,      blockY + 31); doc.text('10268731932',                      bx + 22, blockY + 31);
  doc.text('Branch / SWIFT:', bx,      blockY + 38); doc.text('051001  ·  SBZAZAJJ',              bx + 22, blockY + 38);

  // Page 1 footer drawn at the very end once we know total pages

  // ═════════════════════════════════════════════════════════════════════════════
  // PAGE 2: Scope of Work, Payment Terms, Terms & Conditions
  // ═════════════════════════════════════════════════════════════════════════════

  doc.addPage();

  // Compact content header
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, 22, 'F');
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', MARGIN, 3, 14, 14);
    } catch { /* skip */ }
  }
  setFont('bold', 11);
  doc.setTextColor(...WHITE);
  doc.text('BREED', MARGIN + 17, 12);
  setFont('normal', 6);
  doc.setTextColor(...ORANGE);
  doc.text('INDUSTRIES', MARGIN + 17, 17);
  doc.setFillColor(...ORANGE);
  doc.rect(0, 22, PAGE_W, 2, 'F');

  y = 32;

  // ── Section 1: Scope of Work ───────────────────────────────────────────────
  function drawSectionHeader(title: string) {
    doc.setFillColor(...ORANGE);
    doc.roundedRect(MARGIN, y, 6, 18, 3, 3, 'F');
    setFont('bold', 11);
    doc.setTextColor(...NAVY);
    doc.text(title, MARGIN + 12, y + 7);
    y += 22;
  }

  drawSectionHeader('1. SCOPE OF WORK — TIMELINES & CLIENT REQUIREMENTS');

  // Use statically imported scope details
  const scopeDetailMap = scopeDetailsData;

  data.items.forEach((item) => {
    // Check page break
    if (y > PAGE_H - 60) {
      doc.addPage();
      y = 30;
    }

    const detail = scopeDetailMap[item.name] || { timeline: 'Timeline to be confirmed', clientRequirements: [] };

    // Service name bar
    doc.setFillColor(...OFFWHITE);
    doc.rect(MARGIN, y, CONTENT_W - 40, 10, 'F');
    setFont('bold', 10);
    doc.setTextColor(...DARK);
    doc.text(item.name, MARGIN + 4, y + 7);

    // Timeline (right aligned, orange)
    doc.setFillColor(...ORANGE_LIGHT);
    doc.rect(PAGE_W - MARGIN - 38, y, 38, 10, 'F');
    setFont('bold', 8);
    doc.setTextColor(...ORANGE);
    doc.text(detail.timeline, PAGE_W - MARGIN - 4, y + 7, { align: 'right' });
    y += 12;

    // Service description
    if (item.description) {
      setFont('normal', 8);
      doc.setTextColor(...MUTED);
      const descLines = doc.splitTextToSize(`Description: ${item.description}`, CONTENT_W - 12);
      doc.text(descLines, MARGIN + 4, y + 3);
      y += (descLines.length * 3.5) + 4;
    }

    // Client requirements bullet list
    if (detail.clientRequirements && detail.clientRequirements.length > 0) {
      setFont('bold', 8);
      doc.setTextColor(...DARK);
      doc.text('Client Requirements:', MARGIN + 4, y);
      y += 5;
      
      detail.clientRequirements.forEach((req) => {
        // Check page break
        if (y > PAGE_H - 50) {
          drawQFooter(2, 2);
          doc.addPage();
          y = 30;
        }

        // Bullet dot
        doc.setFillColor(...ORANGE);
        doc.circle(MARGIN + 4, y + 2, 1.2, 'F');
        setFont('normal', 8);
        doc.setTextColor(...DARK);
        const reqLines = doc.splitTextToSize(req, CONTENT_W - 16);
        doc.text(reqLines, MARGIN + 10, y + 3);
        y += (reqLines.length * 3.5) + 3;
      });
    } else {
      // Generic requirements if none specified
      setFont('normal', 8);
      doc.setTextColor(...MUTED);
      doc.text('• Specific requirements and timeline will be confirmed upon project initiation.', MARGIN + 4, y);
      y += 5;
      doc.text('• Our team will contact you within 24 hours to discuss project details.', MARGIN + 4, y);
      y += 5;
    }

    y += 6;
  });

  // ── Section 2: Payment Terms ───────────────────────────────────────────────
  if (y > PAGE_H - 80) {
    drawQFooter(2, 2);
    doc.addPage();
    y = 30;
  }

  drawSectionHeader('2. PAYMENT TERMS');

  const paymentTermsList = data.requireDeposit
    ? [
        'A 50% deposit is required before any work commences.',
        'The remaining 50% balance is due upon project completion.',
        'Work will only begin once the deposit has cleared in our account.',
        'Monthly subscription fees (if applicable) will be invoiced separately after initial payment.',
      ]
    : [
        'Full payment is required before any work commences.',
        'Work will only begin once full payment has cleared in our account.',
        'Monthly subscription fees (if applicable) will be invoiced separately after initial payment.',
      ];

  paymentTermsList.forEach((term) => {
    if (y > PAGE_H - 50) {
      doc.addPage();
      y = 30;
    }
    doc.setFillColor(...ORANGE);
    doc.circle(MARGIN + 4, y + 2, 1.2, 'F');
    setFont('normal', 9);
    doc.setTextColor(...DARK);
    doc.text(term, MARGIN + 10, y + 3);
    y += 8;
  });

  // ── Section 3: Terms & Conditions ──────────────────────────────────────────
  if (y > PAGE_H - 100) {
    drawQFooter(2, 2);
    doc.addPage();
    y = 30;
  }

  drawSectionHeader('3. TERMS, CONDITIONS & DISCLAIMERS');

  const terms = [
    {
      title: 'Scope of Work',
      body: 'The services listed above constitute the agreed scope of work. Any additional services or changes to the scope must be agreed upon in writing and may incur additional charges.',
    },
    {
      title: 'Timelines',
      body: 'Timelines provided are estimates based on standard workflows. Actual delivery dates may vary depending on client response times, revision rounds, and unforeseen technical requirements.',
    },
    {
      title: 'Revisions',
      body: 'Unless otherwise specified, each deliverable includes up to 3 revision rounds. Additional revisions will be billed at R350 per hour.',
    },
    {
      title: 'Intellectual Property',
      body: 'Full ownership and intellectual property rights will transfer to the client only upon final payment. Until then, all work remains the property of Breed Industries.',
    },
    {
      title: 'Confidentiality',
      body: 'Breed Industries agrees to maintain confidentiality of all client information and business details disclosed during the project.',
    },
    {
      title: 'Portfolio Rights',
      body: 'Breed Industries reserves the right to display completed work in our portfolio and marketing materials unless otherwise agreed in writing.',
    },
    {
      title: 'Cancellation',
      body: 'If the project is cancelled by the client after work has commenced, the deposit is forfeited. Any work completed beyond the deposit value will be billed accordingly.',
    },
    {
      title: 'Warranty',
      body: 'Breed Industries warrants that all services will be performed in a professional manner. We do not warrant third-party services or dependencies.',
    },
    {
      title: 'Liability',
      body: 'Breed Industries liability is limited to the total value of the project. We are not liable for indirect, consequential, or incidental damages.',
    },
    {
      title: 'Force Majeure',
      body: 'Neither party shall be liable for delays caused by circumstances beyond their reasonable control, including but not limited to acts of God, war, or technical failures.',
    },
    {
      title: 'Governing Law',
      body: 'This agreement is governed by the laws of the Republic of South Africa. Any disputes shall be resolved through negotiation or mediation before litigation.',
    },
  ];

  terms.forEach((term) => {
    if (y > PAGE_H - 50) {
      doc.addPage();
      y = 30;
    }
    setFont('bold', 9);
    doc.setTextColor(...NAVY);
    doc.text(term.title, MARGIN, y);
    y += 5;
    setFont('normal', 8);
    doc.setTextColor(...DARK);
    const bodyLines = doc.splitTextToSize(term.body, CONTENT_W);
    doc.text(bodyLines, MARGIN, y);
    y += (bodyLines.length * 3.5) + 6;
  });

  // Payment Agreement Notice (no signature required)
  if (y > PAGE_H - 60) {
    drawQFooter(2, 2);
    doc.addPage();
    y = 30;
  }

  y += 10;
  doc.setFillColor(...ORANGE_LIGHT);
  doc.rect(MARGIN, y, CONTENT_W, 28, 'F');
  doc.setFillColor(...ORANGE);
  doc.rect(MARGIN, y, 3, 28, 'F');
  y += 8;
  setFont('bold', 10);
  doc.setTextColor(...NAVY);
  doc.text('PAYMENT AGREEMENT', MARGIN + 8, y);
  y += 8;
  setFont('normal', 9);
  doc.setTextColor(...DARK);
  doc.text('Receipt of payment constitutes acceptance of this quote and agreement', MARGIN + 8, y);
  y += 5;
  doc.text('to all terms and conditions outlined above. No signature required.', MARGIN + 8, y);
  y += 12;

  // Draw all page footers now that we know the true total
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawQFooter(i, totalPages);
  }

  return Buffer.from(doc.output('arraybuffer'));
}

/**
 * Convenience: generate the Fresh Start welcome pack PDF for a given applicant.
 */
export function generateFreshStartPDF(opts: {
  name: string;
  email: string;
  businessName?: string;
  businessIdea?: string;
  refNumber: string;
  date: string;
}): Buffer {
  const pdf = new BreedPDF();

  pdf.addCoverPage({
    title: 'Fresh Start',
    subtitle: 'Funding Assistance Welcome Pack',
    recipientName: opts.name + (opts.businessName ? ` — ${opts.businessName}` : ''),
    date: opts.date,
    refNumber: opts.refNumber,
  });

  // ── Welcome ──────────────────────────────────────────────────────────────────
  pdf.addSection(
    'Welcome to Fresh Start',
    `Thank you for taking the first step, ${opts.name.split(' ')[0]}. Fresh Start is Breed Industries' dedicated programme for entrepreneurs who have the vision but need the capital first. We exist to help you access the right funding — so that when you're ready to build, we build together.\n\nThis document outlines everything you need to know about the programme: how it works, who we'll approach for funding on your behalf, what your commitment covers, and the terms that protect both parties throughout the process.`
  );

  // ── How It Works ─────────────────────────────────────────────────────────────
  pdf.addSection(`How Fresh Start Works`, ``);
  pdf.addSteps([
    {
      number: `1`,
      title: `Commitment Fee — R1,000`,
      description: `A once-off R1,000 commitment fee is required to begin. This fee covers our initial research, application preparation, and agency engagement on your behalf. It is non-refundable as a standalone payment — however, it is fully credited and deducted from the cost of your chosen Breed Industries service package once your funding is approved and you proceed with us.`,
    },
    {
      number: `2`,
      title: `Funding Research & Application`,
      description: `We research the best-fit funding programmes for your specific business type, sector, and circumstances — including government institutions such as SEDFA, the NYDA, and selected private funding bodies. We draft and submit your application on your behalf, and where permitted, engage with agencies directly to advocate for your application.`,
    },
    {
      number: `3`,
      title: `Funding Approved — Build Together`,
      description: `Once your funding comes through, your R1,000 commitment fee is deducted from the final cost of your Breed Industries package. You choose the package that fits your business goals, and we get to work building what you set out to create from the start.`,
    },
  ]);

  pdf.addSpacer(4);

  // ── Funding Sources ──────────────────────────────────────────────────────────
  pdf.addSection(
    `Funding Sources We Work With`,
    `We research and engage with the following programmes on your behalf. Every situation is different — we identify which sources are most suitable for your business type, stage, and sector.`
  );

  pdf.addFundingCards([
    {
      name: `SEDFA`,
      type: `Government`,
      description: `The Small Enterprise Development and Finance Agency (formerly SEDA + SEFA, merged October 2024). Offers both non-financial development support and direct financing for SMMEs.`,
    },
    {
      name: `NYDA`,
      type: `Government — Youth`,
      description: `The National Youth Development Agency provides grants and business development support specifically for entrepreneurs aged 18-35. Ideal for young founders starting out.`,
    },
    {
      name: `Private Funding`,
      type: `Private Sector`,
      description: `We research relevant private funders, angel investors, and impact funds suited to your industry and business model — not just government programmes.`,
    },
    {
      name: `Sector-Specific Programmes`,
      type: `Targeted`,
      description: `Depending on your industry (agriculture, tech, construction, retail, etc.) there may be sector-specific grants or incentives we identify during our research phase.`,
    },
  ]);

  pdf.addSpacer(4);

  // ── What's Included ───────────────────────────────────────────────────────────
  pdf.addList(`What Your R1,000 Covers`, [
    {
      label: `Funding Suitability Assessment`,
      note: `We assess your business idea, sector, and circumstances against available programmes to identify the best-fit funding opportunities.`,
    },
    {
      label: `Application Drafting`,
      note: `We write your funding application — including motivation letters, business summaries, and any supporting documentation required.`,
    },
    {
      label: `Agency Engagement`,
      note: `Where permitted, we engage with the funding agency directly and follow up on your application status.`,
    },
    {
      label: `R1,000 Credited to Your Package`,
      note: `Should your funding be approved and you proceed with a Breed Industries service package, this amount is deducted in full from your package cost.`,
    },
  ]);

  pdf.addSpacer(4);

  // ── Legal Terms ───────────────────────────────────────────────────────────────
  pdf.addSection(`Terms & Conditions Summary`, ``);

  pdf.addCallout(
    `The following is a plain-language summary of the key terms governing this service. The full service agreement will be provided and must be signed prior to commencement of any funding research or application work.`,
    `legal`
  );

  pdf.addSpacer(4);

  pdf.addList(`Key Terms`, [
    {
      label: `Commitment Fee`,
      note: `R1,000 is payable upfront and is non-refundable as a standalone fee. It is credited in full against your Breed Industries package upon funding approval and package selection.`,
    },
    {
      label: `No Guarantee of Funding`,
      note: `Breed Industries acts as a service provider and funding facilitator. We do not guarantee the approval of any funding application. Outcomes depend on the client's eligibility and the decisions of third-party agencies.`,
    },
    {
      label: `No Commission or Percentage of Funds`,
      note: `We do not charge a percentage of your approved funding. Our fee structure is fixed and transparent: R1,000 upfront, credited to your package.`,
    },
    {
      label: `Client Responsibility`,
      note: `The client is responsible for providing accurate and truthful information for inclusion in applications. Breed Industries is not liable for applications declined due to inaccurate information provided by the client.`,
    },
    {
      label: `Data & Confidentiality`,
      note: `All personal and business information provided is handled confidentially and used solely for the purpose of preparing and submitting funding applications. Your data will not be shared with third parties beyond the funding agencies involved.`,
    },
    {
      label: `Governing Law`,
      note: `This agreement is governed by the laws of the Republic of South Africa, including the Consumer Protection Act 68 of 2008 and the Electronic Communications and Transactions Act 25 of 2002.`,
    },
  ]);

  pdf.addCallout(
    'By submitting your Fresh Start application and paying the R1,000 commitment fee, you confirm that you have read and understood these terms and agree to the full service agreement which will be provided to you separately.',
    'important'
  );

  pdf.addSpacer(6);

  // ── Next Steps ────────────────────────────────────────────────────────────────
  pdf.addSection(
    'Your Next Steps',
    'Our team will be in contact within 1–2 business days to confirm receipt of your application, collect any outstanding documentation, and begin the funding suitability assessment. In the meantime, if you have any questions please reach out directly:'
  );

  pdf.addList('Contact Us', [
    { label: 'Email', value: 'info@thebreed.co.za' },
    { label: 'Landline', value: '+27 31 459 0080' },
    { label: 'Mobile / WhatsApp', value: '+27 60 496 4105' },
    { label: 'Website', value: 'www.thebreed.co.za/fresh-start' },
    { label: 'Reference Number', value: opts.refNumber },
  ]);

  return pdf.toBuffer();
}

// ── Invoice PDF ───────────────────────────────────────────────────────────────

export interface InvoicePDFItem {
  name: string;
  description: string;
  quantity: number;
  rate: number;
  pricingType?: 'one-time' | 'monthly';
  amount: number;
}

export interface InvoicePDFData {
  invoiceNumber: string;
  quoteNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  items: InvoicePDFItem[];
  oneTimeTotal: number;
  monthlyTotal: number;
  deposit: number;
  balance: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  dueDate: string;
  issueDate: string;
  notes?: string;
}

/**
 * Generate a fully-branded Invoice PDF.
 * Matches the quote PDF brand tokens — navy header, orange accents, clean table.
 */
export function generateInvoicePDF(data: InvoicePDFData): Buffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });

  // ── Brand Tokens ──────────────────────────────────────────────────────────
  const NAVY: [number, number, number]      = [11, 17, 24];
  const ORANGE: [number, number, number]    = [255, 159, 0];
  const WHITE: [number, number, number]     = [255, 255, 255];
  const OFFWHITE: [number, number, number]  = [248, 248, 250];
  const MUTED: [number, number, number]     = [110, 118, 130];
  const DARK: [number, number, number]      = [28, 34, 44];
  const LIGHT_GRAY: [number, number, number] = [228, 232, 238];
  const ORANGE_LIGHT: [number, number, number] = [255, 243, 230];

  const PAGE_W  = 210;
  const PAGE_H  = 297;
  const MARGIN  = 20;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const HEADER_H  = 52;
  const FOOTER_Y  = PAGE_H - 14;

  const logoBase64 = loadLogoBase64();

  function setFont(style: 'bold' | 'normal' | 'italic' = 'normal', size: number = 10) {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
  }

  function fmt(n: number): string {
    return 'R ' + n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function drawPageFooter(pageNum: number, totalPages: number) {
    doc.setDrawColor(...LIGHT_GRAY);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, FOOTER_Y, PAGE_W - MARGIN, FOOTER_Y);
    setFont('normal', 7);
    doc.setTextColor(...MUTED);
    doc.text(
      'The Breed Industries (PTY) LTD · 12 Kings Road, Pinetown, Durban 3610 · www.thebreed.co.za · info@thebreed.co.za · +27 31 459 0080',
      MARGIN,
      FOOTER_Y + 5
    );
    doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, FOOTER_Y + 5, { align: 'right' });
  }

  // ── Page Header (navy bar + logo) ─────────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_W, HEADER_H, 'F');

  if (logoBase64) {
    try { doc.addImage(logoBase64, 'PNG', MARGIN, 8, 36, 36); } catch { /* skip */ }
  }

  setFont('normal', 7);
  doc.setTextColor(200, 200, 200);
  doc.text('The Breed Industries (PTY) LTD',    PAGE_W - MARGIN, 14, { align: 'right' });
  doc.text('12 Kings Road, Pinetown, Durban 3610', PAGE_W - MARGIN, 20, { align: 'right' });
  doc.text('Landline: +27 31 459 0080',           PAGE_W - MARGIN, 26, { align: 'right' });
  doc.text('Mobile: +27 60 496 4105',             PAGE_W - MARGIN, 32, { align: 'right' });
  doc.text('Email: info@thebreed.co.za',          PAGE_W - MARGIN, 38, { align: 'right' });
  doc.text('Web: www.thebreed.co.za',             PAGE_W - MARGIN, 44, { align: 'right' });

  // Orange title bar
  doc.setFillColor(...ORANGE);
  doc.rect(0, HEADER_H, PAGE_W, 14, 'F');
  setFont('bold', 14);
  doc.setTextColor(...NAVY);
  doc.text('INVOICE', MARGIN, HEADER_H + 10);
  setFont('bold', 12);
  doc.text(`#${data.invoiceNumber}`, PAGE_W - MARGIN, HEADER_H + 10, { align: 'right' });

  // ── Meta row ──────────────────────────────────────────────────────────────
  let y = HEADER_H + 22;
  doc.setFillColor(...OFFWHITE);
  doc.rect(MARGIN, y, CONTENT_W, 12, 'F');
  setFont('bold', 8);
  doc.setTextColor(...DARK);
  doc.text(
    `Issue Date: ${new Date(data.issueDate).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}`,
    MARGIN + 4, y + 8
  );
  doc.text(
    `Due Date: ${new Date(data.dueDate).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}`,
    MARGIN + CONTENT_W / 3, y + 8
  );
  // Status badge
  const statusColor: [number, number, number] =
    data.paymentStatus === 'paid'    ? [34, 197, 94] :
    data.paymentStatus === 'pending' ? ORANGE :
    data.paymentStatus === 'partial' ? [234, 179, 8] :
    MUTED;
  doc.setTextColor(...statusColor);
  doc.text(data.paymentStatus.toUpperCase(), PAGE_W - MARGIN - 4, y + 8, { align: 'right' });

  // ── Bill To + Reference panels ────────────────────────────────────────────
  y += 18;
  const panelW = (CONTENT_W - 8) / 2;

  // Bill To
  doc.setFillColor(...OFFWHITE);
  doc.rect(MARGIN, y, panelW, 42, 'F');
  doc.setFillColor(...ORANGE);
  doc.rect(MARGIN, y, 3, 42, 'F');
  setFont('bold', 9);
  doc.setTextColor(...ORANGE);
  doc.text('BILL TO', MARGIN + 6, y + 7);
  setFont('bold', 10);
  doc.setTextColor(...DARK);
  doc.text(data.customerName, MARGIN + 6, y + 16);
  setFont('normal', 8);
  doc.setTextColor(...MUTED);
  if (data.customerEmail)   doc.text(data.customerEmail,   MARGIN + 6, y + 23);
  if (data.customerPhone)   doc.text(data.customerPhone,   MARGIN + 6, y + 29);
  if (data.customerAddress) {
    const addrLines = doc.splitTextToSize(data.customerAddress, panelW - 12);
    doc.text(addrLines, MARGIN + 6, y + (data.customerPhone ? 35 : 29));
  }

  // Invoice reference
  doc.setFillColor(...OFFWHITE);
  doc.rect(MARGIN + panelW + 8, y, panelW, 42, 'F');
  doc.setFillColor(...ORANGE);
  doc.rect(MARGIN + panelW + 8, y, 3, 42, 'F');
  setFont('bold', 9);
  doc.setTextColor(...ORANGE);
  doc.text('INVOICE DETAILS', MARGIN + panelW + 14, y + 7);
  setFont('normal', 8);
  doc.setTextColor(...DARK);
  doc.text(`Invoice #: ${data.invoiceNumber}`, MARGIN + panelW + 14, y + 16);
  if (data.quoteNumber) doc.text(`Quote #: ${data.quoteNumber}`, MARGIN + panelW + 14, y + 23);
  doc.text(`Status: ${data.status.toUpperCase()}`, MARGIN + panelW + 14, y + (data.quoteNumber ? 30 : 23));
  doc.text(`Payment: ${data.paymentStatus.toUpperCase()}`, MARGIN + panelW + 14, y + (data.quoteNumber ? 37 : 30));

  // ── Items table ───────────────────────────────────────────────────────────
  y += 50;
  doc.setFillColor(...NAVY);
  doc.rect(MARGIN, y, CONTENT_W, 10, 'F');
  setFont('bold', 9);
  doc.setTextColor(...WHITE);
  doc.text('#',                           MARGIN + 4,              y + 6.5);
  doc.text('Service / Description',       MARGIN + 14,             y + 6.5);
  doc.text('Qty',   PAGE_W - MARGIN - 52, y + 6.5, { align: 'center' });
  doc.text('Rate',  PAGE_W - MARGIN - 32, y + 6.5, { align: 'center' });
  doc.text('Amount',PAGE_W - MARGIN - 4,  y + 6.5, { align: 'right' });
  y += 10;

  data.items.forEach((item, i) => {
    if (y > PAGE_H - 60) {
      doc.addPage();
      // mini header on continuation page
      doc.setFillColor(...NAVY);
      doc.rect(0, 0, PAGE_W, 14, 'F');
      doc.setFillColor(...ORANGE);
      doc.rect(0, 14, PAGE_W, 2, 'F');
      setFont('bold', 9);
      doc.setTextColor(...WHITE);
      doc.text('BREED INDUSTRIES — INVOICE CONTINUED', MARGIN, 10);
      y = 22;
    }

    const rowH = item.description ? 16 : 10;
    const rowBg: [number, number, number] = i % 2 === 0 ? OFFWHITE : WHITE;
    doc.setFillColor(...rowBg);
    doc.rect(MARGIN, y, CONTENT_W, rowH, 'F');

    setFont('bold', 8.5);
    doc.setTextColor(...DARK);
    doc.text(`${i + 1}`, MARGIN + 4, y + 5.5);
    doc.text(item.name + (item.pricingType === 'monthly' ? ' (Monthly)' : ''), MARGIN + 14, y + 5.5);

    if (item.description) {
      setFont('normal', 7.5);
      doc.setTextColor(...MUTED);
      const descLines = doc.splitTextToSize(item.description, CONTENT_W - 72);
      doc.text(descLines[0] || '', MARGIN + 14, y + 11);
    }

    setFont('normal', 8.5);
    doc.setTextColor(...DARK);
    doc.text(item.quantity.toString(), PAGE_W - MARGIN - 52, y + (rowH / 2) + 1.5, { align: 'center' });
    doc.text(
      fmt(item.rate) + (item.pricingType === 'monthly' ? '/mo' : ''),
      PAGE_W - MARGIN - 32, y + (rowH / 2) + 1.5, { align: 'center' }
    );
    setFont('bold', 8.5);
    doc.text(
      fmt(item.amount) + (item.pricingType === 'monthly' ? '/mo' : ''),
      PAGE_W - MARGIN - 4, y + (rowH / 2) + 1.5, { align: 'right' }
    );
    y += rowH;
  });

  // ── Totals ────────────────────────────────────────────────────────────────
  y += 8;
  doc.setDrawColor(...LIGHT_GRAY);
  doc.setLineWidth(0.3);
  doc.line(MARGIN + 90, y - 4, MARGIN + CONTENT_W, y - 4);

  if (data.oneTimeTotal > 0) {
    setFont('normal', 9);
    doc.setTextColor(...MUTED);
    doc.text('One-Time Fees:',   PAGE_W - MARGIN - 62, y);
    doc.setTextColor(...DARK);
    doc.text(fmt(data.oneTimeTotal), PAGE_W - MARGIN - 4, y, { align: 'right' });
    y += 7;
  }
  if (data.monthlyTotal > 0) {
    setFont('normal', 9);
    doc.setTextColor(...MUTED);
    doc.text('Monthly Subscription:', PAGE_W - MARGIN - 62, y);
    doc.setTextColor(...DARK);
    doc.text(fmt(data.monthlyTotal) + '/mo', PAGE_W - MARGIN - 4, y, { align: 'right' });
    y += 7;
  }
  if (data.deposit > 0) {
    setFont('bold', 9);
    doc.setTextColor(...ORANGE);
    doc.text('50% Deposit Required:', PAGE_W - MARGIN - 62, y);
    doc.text(fmt(data.deposit), PAGE_W - MARGIN - 4, y, { align: 'right' });
    y += 7;
    setFont('normal', 9);
    doc.setTextColor(...MUTED);
    doc.text('Balance on Completion:', PAGE_W - MARGIN - 62, y);
    doc.setTextColor(...DARK);
    doc.text(fmt(data.balance), PAGE_W - MARGIN - 4, y, { align: 'right' });
    y += 7;
  }

  // Total bar
  y += 2;
  doc.setFillColor(...NAVY);
  doc.rect(MARGIN, y, CONTENT_W, 14, 'F');
  setFont('bold', 11);
  doc.setTextColor(...WHITE);
  doc.text('TOTAL DUE', MARGIN + 6, y + 9);
  doc.setTextColor(...ORANGE);
  doc.text(fmt(data.totalAmount), PAGE_W - MARGIN - 4, y + 9, { align: 'right' });
  y += 18;

  // Monthly note callout
  if (data.monthlyTotal > 0) {
    doc.setFillColor(...ORANGE_LIGHT);
    doc.rect(MARGIN, y, CONTENT_W, 16, 'F');
    doc.setFillColor(...ORANGE);
    doc.rect(MARGIN, y, 3, 16, 'F');
    setFont('bold', 8);
    doc.setTextColor(...NAVY);
    doc.text('MONTHLY SUBSCRIPTIONS:', MARGIN + 6, y + 6);
    setFont('normal', 8);
    doc.setTextColor(...DARK);
    doc.text(
      `Recurring fee of ${fmt(data.monthlyTotal)}/mo will be invoiced separately after initial payment is received.`,
      MARGIN + 6, y + 12
    );
    y += 22;
  }

  // VAT note
  setFont('italic', 7);
  doc.setTextColor(...MUTED);
  doc.text('All prices exclude VAT. VAT will be added at the applicable rate where required.', MARGIN, y);
  y += 10;

  // ── Banking Details ───────────────────────────────────────────────────────
  doc.setFillColor(...OFFWHITE);
  doc.rect(MARGIN, y, CONTENT_W, 52, 'F');
  doc.setFillColor(...ORANGE);
  doc.rect(MARGIN, y, 3, 52, 'F');
  setFont('bold', 9);
  doc.setTextColor(...ORANGE);
  doc.text('PAYMENT DETAILS', MARGIN + 8, y + 8);
  setFont('normal', 9);
  doc.setTextColor(...DARK);
  doc.text('Bank:',           MARGIN + 8,  y + 18);  doc.text('Standard Bank',                        MARGIN + 48, y + 18);
  doc.text('Account Name:',   MARGIN + 8,  y + 26);  doc.text('The Breed Industries (PTY) LTD',        MARGIN + 48, y + 26);
  doc.text('Account Number:', MARGIN + 8,  y + 34);  doc.text('10268731932',                           MARGIN + 48, y + 34);
  doc.text('Branch Code:',    MARGIN + 8,  y + 42);  doc.text('051001',                                MARGIN + 48, y + 42);
  doc.text('SWIFT Code:',     MARGIN + 8,  y + 50);  doc.text('SBZAZAJJ',                              MARGIN + 48, y + 50);
  setFont('bold', 8);
  doc.setTextColor(...ORANGE);
  doc.text('Please use the invoice number as your payment reference.', MARGIN + 8, y + 58);
  y += 64;

  // Notes
  if (data.notes) {
    setFont('bold', 9);
    doc.setTextColor(...NAVY);
    doc.text('Notes:', MARGIN, y);
    y += 6;
    setFont('normal', 8);
    doc.setTextColor(...DARK);
    const noteLines = doc.splitTextToSize(data.notes, CONTENT_W);
    doc.text(noteLines, MARGIN, y);
    y += noteLines.length * 4 + 6;
  }

  // ── Draw all page footers now that we know the total ──────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(i, totalPages);
  }

  return Buffer.from(doc.output('arraybuffer'));
}

export interface InvoicePDFItem {
  name: string;
  description: string;
  quantity: number;
  rate: number;
  pricingType?: 'one-time' | 'monthly';
  amount: number;
}

export interface InvoicePDFData {
  invoiceNumber: string;
  quoteNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  items: InvoicePDFItem[];
  oneTimeTotal: number;
  monthlyTotal: number;
  deposit: number;
  balance: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  dueDate: string;
  issueDate: string;
  notes?: string;
}
