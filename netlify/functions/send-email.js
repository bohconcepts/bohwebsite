const nodemailer = require('nodemailer');

// Utility function to determine if we're in a development environment
const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || process.env.CONTEXT === 'dev' || process.env.NETLIFY_DEV === 'true';
};

// Safe logging function that only logs in development
const devLog = (...args) => {
  if (isDevelopment()) {
    console.log(...args);
  }
};

// Create a transporter using Office 365 SMTP settings
const createTransporter = () => {
  try {
    // Log SMTP configuration (without password) only in development
    devLog('SMTP Configuration:', {
      host: process.env.SMTP_HOST || 'smtp.office365.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.EMAIL_USER || 'sefa@bohconcepts.com',
      passwordProvided: !!process.env.EMAIL_PASSWORD
    });
    
    // Create reusable transporter object using SMTP transport
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
        rejectUnauthorized: false // Changed to false to avoid certificate issues
      },
      debug: isDevelopment(), // Only enable debug in development
      logger: isDevelopment(), // Only enable logger in development
    });
  } catch (error) {
    console.error('Error creating transporter:', error); // Keep error logs for production
    throw new Error('Failed to create transporter');
  }
};

// Company email address for receiving form submissions
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'michael@bohconcepts.com';
const DISTRIBUTION_EMAIL = process.env.EMAIL_USER || 'sefa@bohconcepts.com';

/**
 * Send confirmation email to the user who submitted the form
 */
const sendUserConfirmationEmail = async (formData) => {
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
  
  try {
    const transporter = createTransporter();
    const result = await transporter.sendMail(mailOptions);
    devLog('User confirmation email sent:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending user confirmation email:', error); // Keep error logs for production
    
    // Check for Office 365 SMTP auth disabled error
    if (error.message && error.message.includes('SmtpClientAuthentication is disabled for the Tenant')) {
      console.error('OFFICE 365 AUTHENTICATION ERROR: SMTP Authentication is disabled for your tenant');
      return { 
        success: false, 
        error: 'Office 365 SMTP Authentication is disabled. Please visit https://aka.ms/smtp_auth_disabled for instructions or use an app password.'
      };
    }
    
    return { success: false, error: error.message };
  }
};

/**
 * Send notification email to the company about the new form submission
 */
const sendCompanyNotificationEmail = async (formData) => {
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
  
  try {
    const transporter = createTransporter();
    const result = await transporter.sendMail(mailOptions);
    devLog('Company notification email sent:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending company notification email:', error);
    
    // Check for Office 365 SMTP auth disabled error
    if (error.message && error.message.includes('SmtpClientAuthentication is disabled for the Tenant')) {
      console.error('OFFICE 365 AUTHENTICATION ERROR: SMTP Authentication is disabled for your tenant');
      return { 
        success: false, 
        error: 'Office 365 SMTP Authentication is disabled. Please visit https://aka.ms/smtp_auth_disabled for instructions or use an app password.'
      };
    }
    
    return { success: false, error: error.message };
  }
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
    let userEmailError = null;
    let companyEmailError = null;

    try {
      const userResult = await sendUserConfirmationEmail(formData);
      devLog('User email result:', userResult);
      userEmailSent = userResult.success;
      if (!userEmailSent) {
        userEmailError = userResult.error;
      }
    } catch (error) {
      console.error('Error sending user confirmation email:', error);
      userEmailError = error.message || 'Unknown error sending user email';
    }

    try {
      const companyResult = await sendCompanyNotificationEmail(formData);
      devLog('Company email result:', companyResult);
      companyEmailSent = companyResult.success;
      if (!companyEmailSent) {
        companyEmailError = companyResult.error;
      }
    } catch (error) {
      console.error('Error sending company notification email:', error);
      companyEmailError = error.message || 'Unknown error sending company email';
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message || String(error)
      }),
    };
  }
};
