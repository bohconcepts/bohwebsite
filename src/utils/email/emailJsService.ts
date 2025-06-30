import emailjs from '@emailjs/browser';
import { FormSubmissionData } from './types';

import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID_USER,
  EMAILJS_TEMPLATE_ID_COMPANY
} from './emailJsConfig';

// EmailJS Configuration
export const EmailJSConfig = {
  serviceId: EMAILJS_SERVICE_ID,
  templateIdUser: EMAILJS_TEMPLATE_ID_USER,
  templateIdCompany: EMAILJS_TEMPLATE_ID_COMPANY,
  publicKey: EMAILJS_PUBLIC_KEY
};

/**
 * Initialize EmailJS with your public key
 * @param publicKey Your EmailJS public key
 */
export const initEmailJS = (publicKey: string) => {
  EmailJSConfig.publicKey = publicKey;
  emailjs.init(publicKey);
};

/**
 * Sends emails using EmailJS for form submissions
 * @param formData Form submission data
 * @returns Promise with the result of the email sending operation
 */
export const sendFormEmails = async (formData: FormSubmissionData) => {
  try {
    // Prepare template parameters for user confirmation email
    const userEmailParams = {
      to_name: formData.name,
      to_email: formData.email,
      from_name: 'BOH Concepts',
      message: `Thank you for your ${formData.formType} submission. We'll get back to you soon.`,
      subject: `BOH Concepts - ${formData.formType.charAt(0).toUpperCase() + formData.formType.slice(1)} Form Submission`,
    };

    // Prepare template parameters for company notification email
    const companyEmailParams = {
      from_name: formData.name,
      from_email: formData.email,
      form_type: formData.formType,
      message: formData.message,
      subject: `New ${formData.formType} form submission from ${formData.name}`,
      // Add any additional fields from the form data
      ...formData
    };

    // Send confirmation email to user
    const userEmailResult = await emailjs.send(
      EmailJSConfig.serviceId,
      EmailJSConfig.templateIdUser,
      userEmailParams
    );

    // Send notification email to company
    const companyEmailResult = await emailjs.send(
      EmailJSConfig.serviceId,
      EmailJSConfig.templateIdCompany,
      companyEmailParams
    );

    return {
      success: userEmailResult.status === 200 && companyEmailResult.status === 200,
      userEmailSent: userEmailResult.status === 200,
      companyEmailSent: companyEmailResult.status === 200,
    };
  } catch (error) {
    console.error('Error sending emails with EmailJS:', error);
    return {
      success: false,
      userEmailSent: false,
      companyEmailSent: false,
      error
    };
  }
};
