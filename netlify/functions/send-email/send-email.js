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
  });
};

// Company email address for receiving form submissions
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'info@bohconcepts.com';
const DISTRIBUTION_EMAIL = process.env.EMAIL_USER || 'contact@bohconcepts.com';

/**
 * Send confirmation email to the user who submitted the form
 */
const sendUserConfirmationEmail = async (formData) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `BOH Concepts <${DISTRIBUTION_EMAIL}>`,
    to: formData.email,
    subject: `Thank you for your ${formData.formType} submission`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for reaching out!</h2>
        <p>Hello ${formData.name},</p>
        <p>We have received your ${formData.formType} submission and will get back to you shortly.</p>
        <p>Best regards,</p>
        <p>The BOH Concepts Team</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

/**
 * Send notification email to the company about the new form submission
 */
const sendCompanyNotificationEmail = async (formData) => {
  const transporter = createTransporter();

  // Build the email content
  let formFields = '';
  Object.keys(formData).forEach(key => {
    if (key !== 'formType') {
      formFields += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}:</strong> ${formData[key]}</p>`;
    }
  });

  const mailOptions = {
    from: `Website Form <${DISTRIBUTION_EMAIL}>`,
    to: COMPANY_EMAIL,
    subject: `New ${formData.formType} Form Submission`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New ${formData.formType} Form Submission</h2>
        ${formFields}
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const formData = JSON.parse(event.body);

    // Basic validation
    if (!formData.name || !formData.email || !formData.formType) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
