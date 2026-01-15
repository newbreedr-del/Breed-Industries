# Breed Industries Website Deployment Guide

This document provides instructions for deploying the Breed Industries website to Netlify.

## Prerequisites

- GitHub account
- Netlify account
- SendGrid account with API key

## Local Development Setup

1. Clone the repository
2. Create a `.env.local` file with the following variables:
   ```
   SENDGRID_SMTP_HOST=smtp.sendgrid.net
   SENDGRID_SMTP_PORT=587
   SENDGRID_SMTP_USER=apikey
   SENDGRID_SMTP_PASS=your_sendgrid_smtp_api_key_here
   COMPANY_EMAIL=info@thebreed.co.za
   ```
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server

## Netlify Deployment

### Initial Setup

1. Push your code to GitHub
2. Log in to Netlify
3. Click "New site from Git"
4. Select your GitHub repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"

### Environment Variables

Add the following environment variables in Netlify:
1. Go to Site settings > Build & deploy > Environment
2. Add the following variables:
   - `SENDGRID_SMTP_HOST`: smtp.sendgrid.net
   - `SENDGRID_SMTP_PORT`: 587 (or 465 if you prefer SSL)
   - `SENDGRID_SMTP_USER`: apikey
   - `SENDGRID_SMTP_PASS`: Your SendGrid SMTP API key
   - `COMPANY_EMAIL`: info@thebreed.co.za
   - `NODE_VERSION`: 18
   - `NPM_VERSION`: 9

### Netlify Configuration

The `netlify.toml` file in the repository root contains the necessary configuration for Netlify deployment:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[dev]
  command = "npm run dev"
  port = 3000
  targetPort = 3000

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Troubleshooting

If you encounter issues with the quote generator or other features:

1. **Check environment variables**: Ensure all required environment variables are set in Netlify
2. **Check build logs**: Review the build logs in Netlify for any errors
3. **Function logs**: Check the function logs in Netlify for API errors
4. **Local vs. Production**: Compare the local environment with the production environment

## Continuous Deployment

Netlify automatically deploys when changes are pushed to the main branch. To manually trigger a deployment:

1. Go to the Deploys tab in Netlify
2. Click "Trigger deploy" > "Deploy site"

## Important Notes

- The quote generator requires SendGrid API key to function properly
- Puppeteer is configured to use chrome-aws-lambda in production
- Make sure the assets directory is included in the deployment for logo images
