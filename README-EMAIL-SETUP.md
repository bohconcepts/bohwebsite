# Email Setup for BOH Concepts Website

## Overview

This document explains how the email functionality is set up for the BOH Concepts website. The site uses Office 365 SMTP for sending emails through Netlify Functions.

## Architecture

1. **Frontend**: React components collect form data
2. **Email Service**: TypeScript utility sends data to Netlify Function
3. **Netlify Function**: Node.js serverless function sends emails via Office 365 SMTP
4. **Email Provider**: Office 365 (hosted by GoDaddy)

## Key Files

- `src/utils/email/netlifyEmailService.ts` - Frontend service for sending emails
- `netlify/functions/send-email.js` - Netlify serverless function that sends emails
- `.env.development` - Local development environment variables
- `netlify.toml` - Netlify configuration

## Local Development

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.development`:
   ```
   SMTP_HOST=smtp.office365.com
   SMTP_PORT=587
   SMTP_SECURE=false
   EMAIL_USER=sefa@bohconcepts.com
   EMAIL_PASSWORD=your-password-here
   COMPANY_EMAIL=michael@bohconcepts.com
   ```

3. Run the development server with Netlify Functions:
   ```bash
   npm run netlify:dev
   ```

### Testing

When running with `netlify:dev`, your application will be available at:
- Website: http://localhost:8888
- Functions: http://localhost:8888/.netlify/functions/send-email

## Production Deployment

### Environment Variables

Set these in the Netlify dashboard (Site settings > Build & deploy > Environment variables):

```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=sefa@bohconcepts.com
EMAIL_PASSWORD=your-password-here
COMPANY_EMAIL=michael@bohconcepts.com
```

## Troubleshooting

### 404 Errors

If you get a 404 error when trying to send emails:

1. **Local Development**: Make sure you're using `npm run netlify:dev` instead of regular `npm run dev`
2. **Production**: Check that the function is properly deployed in the Netlify dashboard

### Authentication Errors

If emails fail to send due to authentication issues:

1. Verify your Office 365 credentials
2. If using MFA, generate an app password
3. Check if SMTP sending is enabled for your account

### Debugging

The Netlify function has debug mode enabled. Check the function logs in the Netlify dashboard or local console for detailed SMTP communication logs.

## Security Considerations

1. Never commit email passwords to the repository
2. Use environment variables for all sensitive information
3. The function validates form data before sending emails

## Additional Resources

- [Office 365 SMTP Settings](https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Nodemailer Documentation](https://nodemailer.com/)
