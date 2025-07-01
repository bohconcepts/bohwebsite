const nodemailer = require('nodemailer');

// Create a transporter using GoDaddy SMTP settings
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // set SMTP_SECURE=true in Netlify if using port 465
    auth: {
      user: process.env.EMAIL_USER || 'contact@bohconcepts.com',
      pass: process.env.EMAIL_PASSWORD || '',
    },
    debug: true, // Add debug flag to get more information
  });
};

// Company email address for receiving form submissions
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'info@bohconcepts.com';
const DISTRIBUTION_EMAIL = process.env.EMAIL_USER || 'contact@bohconcepts.com';

/**
 * Sends a confirmation email to the user
 */
const sendUserConfirmationEmail = async (formData) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `BOH Concepts <${DISTRIBUTION_EMAIL}>`,
    to: formData.email,
    subject: `BOH Concepts - ${formData.formType.charAt(0).toUpperCase() + formData.formType.slice(1)} Form Submission`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for your ${formData.formType} submission!</h2>
        <p>Hello ${formData.name},</p>
        <p>We've received your submission and will get back to you soon.</p>
        <p>Best regards,<br>The BOH Concepts Team</p>
      </div>
    `,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('User email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending user email:', error);
    throw error;
  }
};

/**
 * Sends a notification email to the company
 */
const sendCompanyNotificationEmail = async (formData) => {
  const transporter = createTransporter();

  // Build the email content
  let formFields = '';
  Object.keys(formData).forEach(key => {
    if (!['formType'].includes(key)) {
      formFields += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}:</strong> ${formData[key]}</p>`;
    }
  });

  const mailOptions = {
    from: `Website Form <${DISTRIBUTION_EMAIL}>`,
    to: COMPANY_EMAIL,
    replyTo: formData.email,
    subject: `New ${formData.formType.charAt(0).toUpperCase() + formData.formType.slice(1)} Form Submission from ${formData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New ${formData.formType.charAt(0).toUpperCase() + formData.formType.slice(1)} Form Submission</h2>
        ${formFields}
      </div>
    `,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Company email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending company email:', error);
    throw error;
  }
};

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Received form submission:', event.body);
    const formData = JSON.parse(event.body);

    // Basic validation
    if (!formData.name || !formData.email || !formData.formType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          requiredFields: ['name', 'email', 'formType'],
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Send emails
    let userEmailSent = false;
    let companyEmailSent = false;

    try {
      await sendUserConfirmationEmail(formData);
      userEmailSent = true;
    } catch (error) {
      console.error('Error sending user confirmation email:', error);
    }

    try {
      await sendCompanyNotificationEmail(formData);
      companyEmailSent = true;
    } catch (error) {
      console.error('Error sending company notification email:', error);
    }

    if (userEmailSent && companyEmailSent) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          userEmailSent,
          companyEmailSent,
          message: 'Form submitted and emails sent successfully',
        }),
      };
    } else {
      return {
        statusCode: 207, // Multi-Status
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          userEmailSent,
          companyEmailSent,
          message: 'Form processed with partial success',
        }),
      };
    }
  } catch (error) {
    console.error('Error processing form submission:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
