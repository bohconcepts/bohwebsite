# Supabase Edge Functions

This directory contains Edge Functions that run on Supabase's infrastructure using the Deno runtime.

## Available Functions

### send-email

This function handles sending emails for the application. It's used for:
- Sending newsletter subscription confirmation emails
- Sending unsubscribe confirmation emails

## Deployment Instructions

To deploy these functions to your Supabase project, follow these steps:

1. Install the Supabase CLI if you haven't already:
```bash
npm install -g supabase
```

2. Login to your Supabase account:
```bash
supabase login
```

3. Link your local project to your Supabase project:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy the functions:
```bash
supabase functions deploy send-email
```

## Environment Variables

The `send-email` function requires the following environment variables to be set in your Supabase project:

- `SMTP_HOST`: Your SMTP server host (e.g., smtp.gmail.com)
- `SMTP_PORT`: Your SMTP server port (e.g., 587)
- `SMTP_USERNAME`: Your SMTP username/email
- `SMTP_PASSWORD`: Your SMTP password
- `DEFAULT_FROM_EMAIL`: Default sender email address (e.g., noreply@bohconcepts.com)

You can set these variables using the Supabase CLI:

```bash
supabase secrets set SMTP_HOST=smtp.example.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USERNAME=your-email@example.com
supabase secrets set SMTP_PASSWORD=your-password
supabase secrets set DEFAULT_FROM_EMAIL=noreply@bohconcepts.com
```

Or through the Supabase dashboard under Settings > API > Edge Functions.

## Note on TypeScript Errors

You may see TypeScript errors in your IDE for Deno-specific imports and globals. These errors are expected and won't affect the functionality of your Edge Functions when deployed to Supabase's Deno environment.
