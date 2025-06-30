import { getDefaultTransporter } from './emailTransporter';
import { EmailMessage, FormSubmissionData } from './types';

// Company email address for receiving form submissions
const COMPANY_EMAIL = 'info@bohconcepts.com';
// Distribution email address for sending emails
const DISTRIBUTION_EMAIL = 'contact@bohconcepts.com';

/**
 * Send an email using the default transporter
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  try {
    const transporter = getDefaultTransporter();
    
    // Set default from address if not provided
    if (!message.from) {
      message.from = `BOH Concepts <${DISTRIBUTION_EMAIL}>`;
    }
    
    const info = await transporter.sendMail(message);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send a confirmation email to the user who submitted a form
 */
export async function sendUserConfirmation(data: FormSubmissionData): Promise<boolean> {
  const { name, email, formType } = data;
  
  let subject = 'Thank you for contacting BOH Concepts';
  let content = '';
  
  switch (formType) {
    case 'contact':
      subject = 'Thank you for contacting BOH Concepts';
      content = `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to BOH Concepts. We have received your message and will get back to you shortly.</p>
        <p>Our team is reviewing your inquiry and will respond within 1-2 business days.</p>
        <p>Best regards,</p>
        <p>The BOH Concepts Team</p>
      `;
      break;
    case 'partnership':
      subject = 'Thank you for your partnership inquiry';
      content = `
        <p>Dear ${name},</p>
        <p>Thank you for your interest in partnering with BOH Concepts. We have received your partnership request and are excited about the potential opportunity to work together.</p>
        <p>Our partnership team will review your information and contact you within 3-5 business days to discuss next steps.</p>
        <p>Best regards,</p>
        <p>The BOH Concepts Team</p>
      `;
      break;
    default:
      content = `
        <p>Dear ${name},</p>
        <p>Thank you for submitting your information to BOH Concepts. We have received your submission and will process it accordingly.</p>
        <p>If we need any additional information, we will contact you soon.</p>
        <p>Best regards,</p>
        <p>The BOH Concepts Team</p>
      `;
  }
  
  const message: EmailMessage = {
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">BOH Concepts</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb;">
          ${content}
        </div>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>© ${new Date().getFullYear()} BOH Concepts. All rights reserved.</p>
          <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    `
  };
  
  return sendEmail(message);
}

/**
 * Send notification to company about a new form submission
 */
export async function sendCompanyNotification(data: FormSubmissionData): Promise<boolean> {
  const { name, email, subject = 'Form Submission', message = '', formType, ...otherFields } = data;
  
  // Format additional fields for display
  const additionalFieldsHtml = Object.entries(otherFields)
    .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
    .join('');
  
  const emailSubject = `New ${formType} form submission from ${name}`;
  
  const emailMessage: EmailMessage = {
    to: COMPANY_EMAIL,
    subject: emailSubject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Form Submission</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb;">
          <h2>Form Details:</h2>
          <p><strong>Form Type:</strong> ${formType}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
          ${additionalFieldsHtml ? `<h3>Additional Information:</h3>${additionalFieldsHtml}` : ''}
        </div>
      </div>
    `
  };
  
  return sendEmail(emailMessage);
}

/**
 * Process a form submission by sending emails to both the user and company
 */
export async function processFormSubmission(data: FormSubmissionData): Promise<{
  success: boolean;
  userEmailSent: boolean;
  companyEmailSent: boolean;
}> {
  const userEmailSent = await sendUserConfirmation(data);
  const companyEmailSent = await sendCompanyNotification(data);
  
  return {
    success: userEmailSent && companyEmailSent,
    userEmailSent,
    companyEmailSent
  };
}
