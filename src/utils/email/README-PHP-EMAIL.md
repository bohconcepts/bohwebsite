# PHP Email Service for BOH Concepts Website

## Overview

This document explains how to set up and use the PHP email service for sending emails from the BOH Concepts website. This solution uses your existing GoDaddy hosting and email services without requiring any third-party email services.

## How It Works

1. When a user submits a form on the website, the form data is saved to your Supabase database
2. The form data is then sent to a PHP script hosted on your GoDaddy server
3. The PHP script uses the built-in `mail()` function to send emails using your GoDaddy SMTP server
4. Two emails are sent:
   - A confirmation email to the user who submitted the form
   - A notification email to your company email address

## Setup Instructions

### 1. Upload the PHP Script

The PHP script needs to be uploaded to your GoDaddy hosting:

1. Log in to your GoDaddy hosting control panel
2. Navigate to the File Manager or use FTP to access your website files
3. Create a directory called `api` in the root of your website if it doesn't already exist
4. Upload the `send-email.php` file from `public/api/` to this directory

### 2. Test the PHP Script

After uploading, you should test that the script is accessible:

1. Visit `https://yourdomain.com/api/send-email.php` in your browser
2. You should see a message indicating that only POST requests are allowed

### 3. Configure Email Addresses

The PHP script is pre-configured with these email addresses:

- Company email: `info@bohconcepts.com` (receives notifications)
- From email: `contact@bohconcepts.com` (sends the emails)

If you need to change these, edit the `send-email.php` file around line 45-46.

## Troubleshooting

If emails are not being sent:

1. Check that the PHP script is properly uploaded and accessible
2. Verify that your GoDaddy hosting allows the PHP `mail()` function
3. Check your server's error logs for any PHP errors
4. Make sure your distribution email address is properly set up in GoDaddy

## Security Considerations

- The PHP script includes basic validation to prevent abuse
- CORS headers are set to allow requests from any origin, which you may want to restrict in production
- Consider adding rate limiting if you experience form spam

## Local Development

For local development, you'll need to:

1. Set up a local PHP server or use a tool like XAMPP
2. Place the PHP script in the appropriate directory
3. Update the `apiUrl` in `phpEmailService.ts` to point to your local PHP server

Note that the `mail()` function may not work in local development environments without additional configuration.
