# BOH Concepts Email Integration Guide

## Overview

This document explains the email integration for the BOH Concepts website. We've implemented a dual-solution approach that ensures reliable email delivery:

1. **Primary Method**: Netlify Serverless Functions with Nodemailer
2. **Fallback Method**: EmailJS client-side service

This approach ensures that emails will be sent even if one method fails.

## How It Works

1. When a user submits a form, the data is saved to your Supabase database
2. The system first attempts to send emails using the Netlify function
3. If the Netlify function fails (e.g., not properly configured yet), it falls back to EmailJS
4. Two emails are sent for each submission:
   - A confirmation email to the user who submitted the form
   - A notification email to your company email address

## Setup Instructions

### 1. Netlify Function Setup

1. **Configure Environment Variables in Netlify**:
   - Go to your Netlify dashboard → Site settings → Environment variables
   - Add these variables:
     - `EMAIL_USER`: Your GoDaddy email (e.g., contact@bohconcepts.com)
     - `EMAIL_PASSWORD`: Your GoDaddy email password
     - `COMPANY_EMAIL`: Email to receive notifications (e.g., info@bohconcepts.com)
     - `SMTP_HOST`: Your SMTP server (default: smtpout.secureserver.net)
     - `SMTP_PORT`: Your SMTP port (default: 587)
     - `SMTP_SECURE`: Set to 'true' if using port 465, otherwise leave as 'false'

2. **Deploy to Netlify**:
   - The function will be automatically deployed when you push your code

### 2. EmailJS Fallback Setup (Optional but Recommended)

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
   - Also update the public key in Contact.tsx and PartnershipForm.tsx:
     ```typescript
     initEmailJS('YOUR_EMAILJS_PUBLIC_KEY');
     ```

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

## Future Improvements

- Once the Netlify function is working reliably, you can remove the EmailJS fallback if desired
- Consider adding email templates for different types of forms
- Implement email analytics to track open rates and engagement
