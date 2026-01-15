# Breed Industries Website Documentation

## Project Overview

The Breed Industries website is a modern Next.js application showcasing the company's services and providing interactive features for customers, including a quote generation system and contact form.

## Technical Stack

- **Framework**: Next.js 16.1.1
- **UI Library**: React 18.3.1
- **Styling**: TailwindCSS 3.4.15
- **Email Service**: SendGrid (SMTP relay via Nodemailer)
- **PDF Generation**: Puppeteer with chrome-aws-lambda
- **Deployment**: Netlify

## Project Structure

```
/
├── .github/workflows/   # GitHub Actions workflows
├── .next/              # Next.js build output
├── assets/             # Static assets like images
├── public/             # Public assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── api/        # API routes
│   │   │   ├── contact/        # Contact form API
│   │   │   └── generate-quote/ # Quote generator API
│   │   └── ...         # Page routes
│   ├── components/     # React components
│   └── ...             # Other source files
├── .env                # Environment variables (non-sensitive)
├── .env.local          # Local environment variables (sensitive)
├── netlify.toml        # Netlify configuration
└── package.json        # Project dependencies
```

## Key Features

### 1. Quote Generation System

The quote generation system allows customers to request quotes for services. It includes:

- Interactive form for customer details and service selection
- PDF generation using Puppeteer
- Email delivery via SendGrid

**Implementation Files:**
- `src/components/QuoteGenerator.tsx`: Frontend component
- `src/app/api/generate-quote/route.ts`: API endpoint

### 2. Contact Form

The contact form enables visitors to send inquiries directly to the company:

- Form validation
- Email delivery via SendGrid
- Success/error feedback

**Implementation Files:**
- `src/components/ContactForm.tsx`: Frontend component
- `src/app/api/contact/route.ts`: API endpoint

## Environment Variables

The application requires the following environment variables:

```
# Required for email functionality (SendGrid SMTP)
SENDGRID_SMTP_HOST=smtp.sendgrid.net
SENDGRID_SMTP_PORT=587
SENDGRID_SMTP_USER=apikey
SENDGRID_SMTP_PASS=your_sendgrid_smtp_api_key
COMPANY_EMAIL=info@thebreed.co.za

# Optional for local development
PORT=3000
```

## Development Workflow

1. **Local Development**:
   ```bash
   npm run dev
   ```

2. **Building for Production**:
   ```bash
   npm run build
   ```

3. **Running Production Build**:
   ```bash
   npm start
   ```

## Deployment

The application is configured for deployment on Netlify. See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## Troubleshooting Common Issues

### Quote Generator Issues

- **"Unauthorized" Error**: Check that the SendGrid API key is properly set in environment variables
- **PDF Generation Failure**: Ensure Puppeteer and chrome-aws-lambda are properly configured for the deployment environment
- **Logo Not Appearing**: Verify the assets directory is included in the deployment

### Contact Form Issues

- **Email Not Sending**: Verify SendGrid API key and sender authentication
- **Form Validation Errors**: Check browser console for specific validation errors

## Maintenance and Updates

### Adding New Services

To add new services to the quote generator:

1. Update the service options in `src/components/QuoteGenerator.tsx`
2. Ensure the API endpoint in `src/app/api/generate-quote/route.ts` can handle the new service types

### Updating Email Templates

Email templates for quotes and contact form submissions can be modified in their respective API route files:

- Quote emails: `src/app/api/generate-quote/route.ts`
- Contact form emails: `src/app/api/contact/route.ts`
