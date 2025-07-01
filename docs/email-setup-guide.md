# Contact Form with GoDaddy Email Setup

## Overview

This document outlines how to configure the contact form in the BOH Concepts website to send emails using your GoDaddy email service via Netlify Functions.

## How It Works

1. When a user submits the contact form:
   - The form data is saved to your Supabase database
   - A Netlify function is called to send two emails:
     - A confirmation email to the user who submitted the form
     - A notification email to your company email address

## Configuration Steps

### 1. Set Environment Variables in Netlify

1. Log in to your [Netlify Dashboard](https://app.netlify.com/)
2. Navigate to your site > **Site settings** > **Environment variables**
3. Add the following variables:

```
EMAIL_USER=youremail@bohconcepts.com  # Your GoDaddy email address
EMAIL_PASSWORD=your-password-here     # Your GoDaddy email password
COMPANY_EMAIL=info@bohconcepts.com    # Email where you want to receive notifications
SMTP_HOST=smtpout.secureserver.net    # GoDaddy SMTP server
SMTP_PORT=587                         # GoDaddy SMTP port (usually 587)
SMTP_SECURE=false                     # Set to 'true' only if using port 465
```

### 2. Configure App Password for GoDaddy Email

For security reasons, it's recommended to use an app-specific password instead of your main account password:

1. Log in to your GoDaddy Email & Office account
2. Navigate to Settings > Security
3. Generate an app password specifically for this website
4. Use this app password for the `EMAIL_PASSWORD` environment variable

### 3. Deploy to Netlify

Once you've set up the environment variables, deploy your site to Netlify:

```bash
git push # If using Git deployment
# or
npm run build && netlify deploy --prod # If using Netlify CLI
```

## Testing the Email Functionality

1. Go to your deployed website
2. Fill out and submit the contact form
3. Check that:
   - You receive a notification email at your company address
   - The user receives a confirmation email at their provided address
   - The form data is saved in your Supabase database

## Troubleshooting

### Emails Not Sending

1. Check Netlify Function Logs:
   - Go to Netlify Dashboard > Functions > send-email > Logs
   - Look for any error messages

2. Verify Environment Variables:
   - Ensure all environment variables are set correctly
   - Double-check your email password is correct

3. GoDaddy SMTP Issues:
   - Confirm SMTP settings are correct
   - Check if GoDaddy has any outage or maintenance

4. Netlify Function Timeouts:
   - If functions time out, you may need to increase the function timeout limit

## Security Considerations

- Your email credentials are stored as environment variables in Netlify and never exposed to the client
- The Netlify function includes validation to prevent abuse
- Form submissions are rate-limited by default via Netlify
