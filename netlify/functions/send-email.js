const nodemailer = require('nodemailer');

// Create a transporter using Office 365 SMTP settings
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // set SMTP_SECURE=true in Netlify if using port 465
    auth: {
      user: process.env.EMAIL_USER || 'sefa@bohconcepts.com',
      pass: process.env.EMAIL_PASSWORD || '',
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: true
    },
    debug: true, // Add debug flag to get more information
  });
};

// Company email address for receiving form submissions
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'michael@bohconcepts.com';
const DISTRIBUTION_EMAIL = process.env.EMAIL_USER || 'sefa@bohconcepts.com';

/** * Sends a confirmation email to the user */
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

/** * Sends a notification email to the company */
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

    // Send emails
    let userEmailSent = false;
    let companyEmailSent = false;
    let userEmailError = null;
    let companyEmailError = null;

    try {
      const userResult = await sendUserConfirmationEmail(formData);
      userEmailSent = userResult.success;
    } catch (error) {
      console.error('Error sending user confirmation email:', error);
      userEmailError = error.message;
    }

    try {
      const companyResult = await sendCompanyNotificationEmail(formData);
      companyEmailSent = companyResult.success;
    } catch (error) {
      console.error('Error sending company notification email:', error);
      companyEmailError = error.message;
    }

    if (userEmailSent && companyEmailSent) {
      return {
        statusCode: 200,
        headers,
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
        headers,
        body: JSON.stringify({
          success: userEmailSent || companyEmailSent,
          userEmailSent,
          companyEmailSent,
          userEmailError,
          companyEmailError,
          message: 'Form processed with partial success',
        }),
      };
    }
  } catch (error) {
    console.error('Error processing form submission:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
    };
  }
};