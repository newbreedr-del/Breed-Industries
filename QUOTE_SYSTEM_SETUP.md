# Quote Generation System Setup Guide

This document provides instructions for setting up the automated quote generation system for Breed Industries website.

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
# SendGrid API Key
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Company Email (used as sender and CC recipient)
COMPANY_EMAIL=info@thebreed.co.za
```

## SendGrid Setup

1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com/) if you don't have one already
2. Navigate to Settings > API Keys and create a new API key with "Mail Send" permissions
3. Copy the API key and add it to your `.env.local` file
4. Verify your sender email address in SendGrid (Settings > Sender Authentication)

## Installation

The necessary dependencies have been added to your `package.json` file. Install them by running:

```bash
npm install
# or
yarn install
```

## How It Works

1. **Quote Generation Button**: The "Generate Auto Quote" button in the package builder opens a modal with the quote form
2. **Quote Form**: Users fill in their details and the selected package items are pre-populated
3. **PDF Generation**: When submitted, the form data is sent to the API endpoint that generates a PDF using Puppeteer
4. **Email Delivery**: The PDF is attached to an email and sent to the customer with a CC to your company email

## Security Considerations

- API keys are stored securely on the server side
- Input validation is implemented to prevent abuse
- Rate limiting should be implemented in production

## Production Deployment

For production deployment:

1. Add the environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Ensure Puppeteer is properly configured for your hosting environment
3. Consider implementing a more robust rate limiting solution

## Customization

- Edit the email template in `src/app/api/generate-quote/route.ts`
- Modify the PDF template in the `generateQuoteHTML` function
- Update company details as needed

## Troubleshooting

- If emails are not being sent, verify your SendGrid API key and sender authentication
- If PDFs are not generating, check Puppeteer configuration for your hosting environment
- For local development issues, ensure all dependencies are installed correctly
