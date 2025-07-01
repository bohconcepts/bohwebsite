# Office 365 Email Setup Guide for BOH Concepts Website

This guide explains how to configure the BOH Concepts website to send emails using your Office 365 mailbox hosted with GoDaddy.

## Configuration Steps

### 1. Environment Variables

The following environment variables need to be set in your Netlify dashboard:

```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=sefa@bohconcepts.com
EMAIL_PASSWORD=your-password-here
COMPANY_EMAIL=michael@bohconcepts.com
```

### 2. Local Development

For local development, you can use the `.env.development` file (do not commit your actual password):

```
# Add your password to the .env.development file but don't commit it
EMAIL_PASSWORD=your-password-here
```

Then run the local development server with Netlify functions:

```bash
npm run netlify:dev
```

### 3. Troubleshooting SMTP Authentication

If you encounter authentication issues:

1. **Password Issues**:
   - Ensure you're using the correct password
   - For Office 365 accounts with MFA enabled, you may need to generate an app password
   - App passwords can be created in your Microsoft account security settings

2. **Office 365 Settings**:
   - Verify that SMTP sending is enabled for your account
   - Check if your GoDaddy Office 365 plan includes SMTP relay permissions

3. **Connection Issues**:
   - If port 587 doesn't work, try port 465 with `SMTP_SECURE=true`
   - Check Netlify function logs for detailed error messages

### 4. Testing Email Functionality

To test if your email configuration is working:

1. Fill out a form on the website (contact or partnership form)
2. Check the Netlify function logs for any errors or debug information
3. Verify if emails are received at both the user's email and the company email

## Email Function Structure

The email sending functionality is implemented as a Netlify serverless function:

- **Function Path**: `netlify/functions/send-email.js`
- **Frontend Service**: `src/utils/email/netlifyEmailService.ts`

## Sending Limits

Office 365 typically has sending limits (often 10,000 messages per day). Monitor for rate limiting if you're sending a large volume of emails.
