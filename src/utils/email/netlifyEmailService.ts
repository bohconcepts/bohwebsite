import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const data = JSON.parse(event.body || '{}');
  const { name, email, message } = data;

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  // Configure SMTP transporter with GoDaddy
  const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true, // true for port 465
    auth: {
      user: process.env.GODADDY_EMAIL_USER,
      pass: process.env.GODADDY_EMAIL_PASSWORD,
    },
  });

  try {
    // Send email to company
    await transporter.sendMail({
      from: process.env.GODADDY_EMAIL_USER,
      to: 'yourcompany@example.com',
      subject: 'New Feedback Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.GODADDY_EMAIL_USER,
      to: email,
      subject: 'Thanks for your feedback!',
      text: `Hi ${name},\n\nThanks for reaching out. We have received your message and will reply shortly.\n\n- Your Company Team`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        userEmailSent: true,
        companyEmailSent: true,
        message: 'Emails sent successfully',
      }),
    };
  } catch (error) {
    console.error('SMTP error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown server error',
      }),
    };
  }
};

export { handler };
