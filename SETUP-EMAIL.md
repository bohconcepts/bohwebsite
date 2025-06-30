# Email Setup Guide for BOH Concepts Website

## Overview

This guide explains how to set up the email functionality for the BOH Concepts website. We've implemented a dual email solution:

1. **Primary Method**: Netlify Serverless Functions with Nodemailer (using your GoDaddy SMTP)
2. **Fallback Method**: EmailJS client-side service (optional)

## Setup Instructions

### 1. Netlify Function Setup

#### Configure Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add these variables:

```
EMAIL_USER=contact@bohconcepts.com  # Your GoDaddy email address
EMAIL_PASSWORD=your-password-here    # Your GoDaddy email password
COMPANY_EMAIL=info@bohconcepts.com   # Email to receive notifications
SMTP_HOST=smtpout.secureserver.net   # GoDaddy SMTP server
SMTP_PORT=587                        # SMTP port (usually 587)
SMTP_SECURE=false                    # Set to 'true' if using port 465
```

#### Deploy to Netlify

The function will be automatically deployed when you push your code to the branch connected to your Netlify site.

### 2. EmailJS Fallback Setup (Optional)

If you want to set up the EmailJS fallback:

1. **Sign up for EmailJS**:
   - Create an account at [EmailJS.com](https://www.emailjs.com/)
   - The free tier allows 200 emails per month

2. **Create Email Templates**:
   - Create two templates:
     - User confirmation template (template_user_confirmation)
     - Company notification template (template_company_notification)

3. **Update Configuration**:
   - Open `src/utils/email/fallbackEmailService.ts`
   - Replace the placeholder values with your actual EmailJS credentials:
     ```typescript
     const EMAILJS_CONFIG = {
       serviceId: 'YOUR_SERVICE_ID',
       templateIdUser: 'YOUR_USER_TEMPLATE_ID',
       templateIdCompany: 'YOUR_COMPANY_TEMPLATE_ID',
       publicKey: 'YOUR_PUBLIC_KEY',
     };
     ```

4. **Set Environment Variable**:
   - For local development, create a `.env.local` file with:
     ```
     VITE_EMAILJS_PUBLIC_KEY=your-public-key-here
     ```
   - For production, add this variable to your Netlify environment variables

## Testing

1. **Test the Forms**:
   - Submit test forms on both the Contact and Partnership pages
   - Check the browser console for success/error messages
   - Verify emails are received by both the user and company addresses

2. **Check Which Method Was Used**:
   - The console will log which method was used (Netlify or EmailJS fallback)
   - The email subject or content may also indicate which method was used

## Troubleshooting

### Netlify Function Issues

- Check Netlify function logs in your Netlify dashboard
- Verify environment variables are set correctly
- Ensure your GoDaddy SMTP settings are correct
- Test the function locally using Netlify CLI if possible

### EmailJS Issues

- Verify your EmailJS account is active
- Check that templates are set up correctly
- Ensure the public key and service IDs are correct
- Check browser console for specific EmailJS errors

## Security Considerations

- Netlify Functions securely store your email credentials as environment variables
- EmailJS public key is exposed in client-side code, but it has limited permissions
- Both methods include basic validation to prevent abuse

## Maintenance

- Monitor your EmailJS usage if using the free tier (200 emails/month limit)
- Periodically check that both methods are working correctly
- Update SMTP credentials if you change your email provider
