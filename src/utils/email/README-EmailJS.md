# Email Service with EmailJS

This document explains how to set up and use the EmailJS service for sending emails from the BOH Concepts website.

## Overview

We've switched from using a server-side email solution to EmailJS, which allows sending emails directly from the browser without needing a backend API. This is more compatible with static site hosting and Vite-based applications.

## Setup Instructions

1. **Create an EmailJS Account**
   - Go to [EmailJS.com](https://www.emailjs.com/) and sign up for an account
   - The free tier allows 200 emails per month

2. **Create an Email Service**
   - Connect your GoDaddy email service to EmailJS
   - Name it `service_bohconcepts` or update the `EMAILJS_SERVICE_ID` in the code

3. **Create Email Templates**
   - Create two templates:
     - User confirmation template (ID: `template_user_confirmation`)
     - Company notification template (ID: `template_company_notification`)
   - Make sure to include the necessary template variables (see below)

4. **Get Your Public Key**
   - Find your public key in the EmailJS dashboard
   - Replace `YOUR_EMAILJS_PUBLIC_KEY` in the code with your actual public key

## Template Variables

### User Confirmation Template
- `{{to_name}}` - User's name
- `{{to_email}}` - User's email
- `{{from_name}}` - BOH Concepts
- `{{message}}` - Thank you message
- `{{subject}}` - Email subject

### Company Notification Template
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email
- `{{form_type}}` - Type of form (contact, partnership)
- `{{message}}` - User's message
- `{{subject}}` - Email subject
- Additional fields from the form will also be available

## Implementation

The implementation is already complete in the codebase. The key files are:

- `src/utils/email/emailJsService.ts` - Core EmailJS integration
- `src/pages/Contact.tsx` - Contact form integration
- `src/components/forms/PartnershipForm.tsx` - Partnership form integration

## Testing

To test the email functionality:

1. Replace the placeholder public key with your actual EmailJS public key
2. Fill out and submit either the Contact or Partnership form
3. Check that both you and the company email receive the appropriate emails

## Troubleshooting

If emails are not being sent:

1. Check the browser console for errors
2. Verify your EmailJS account is active and has available email quota
3. Confirm that your templates are correctly set up with the required variables
4. Make sure your public key is correctly entered in the code
