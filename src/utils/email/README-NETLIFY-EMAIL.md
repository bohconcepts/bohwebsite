# Netlify Serverless Email Service for BOH Concepts Website

## Overview

This document explains how to set up and use the Netlify serverless function for sending emails from the BOH Concepts website. This solution uses Netlify Functions and Nodemailer to send emails through your GoDaddy email service.

## How It Works

1. When a user submits a form on the website, the form data is saved to your Supabase database
2. The form data is then sent to a Netlify serverless function
3. The function uses Nodemailer to send emails through your GoDaddy SMTP server
4. Two emails are sent:
   - A confirmation email to the user who submitted the form
   - A notification email to your company email address

## Setup Instructions

### 1. Configure Environment Variables in Netlify

You need to set up environment variables in your Netlify dashboard:

1. Log in to your Netlify dashboard
2. Go to your site settings
3. Navigate to "Environment variables"
4. Add the following variables:
   - `COMPANY_EMAIL`: Your company email address (e.g., info@bohconcepts.com)
   
   If your GoDaddy email requires authentication, also add:
   - `EMAIL_USER`: Your GoDaddy email username
   - `EMAIL_PASSWORD`: Your GoDaddy email password

### 2. Deploy to Netlify

The serverless function will be automatically deployed when you push your code to the repository connected to Netlify.

### 3. Test the Function

After deployment, you can test the function by submitting a form on your website. Check both your company email and the user's email to ensure both emails are being sent correctly.

## Local Development

To test the function locally:

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Create a `.env` file in the root of your project with the environment variables mentioned above
3. Run `netlify dev` to start a local development server with function support
4. Your function will be available at `http://localhost:8888/.netlify/functions/send-email`

## Troubleshooting

If emails are not being sent:

1. Check the Netlify function logs in your Netlify dashboard
2. Verify that your environment variables are set correctly
3. Ensure your GoDaddy SMTP settings are correct
4. If using authentication, make sure your email credentials are correct

## Security Considerations

- Netlify Functions are secure by default and handle CORS automatically
- Your email credentials are stored as environment variables and are not exposed to the client
- The function includes basic validation to prevent abuse

## Customization

You can customize the email templates by editing the HTML in the `send-email.js` function. Look for the `html` sections in the `sendUserConfirmationEmail` and `sendCompanyNotificationEmail` functions.
