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
      this.currentY = MARGIN + 4;
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
