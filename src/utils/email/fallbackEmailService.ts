import { FormSubmissionData } from './types';
import emailjs from '@emailjs/browser';

/**
 * EmailJS Configuration
 * Replace these with your actual EmailJS credentials
 */
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID', // Replace with your actual service ID
  templateIdUser: 'YOUR_USER_TEMPLATE_ID', // Replace with your actual template ID
  templateIdCompany: 'YOUR_COMPANY_TEMPLATE_ID', // Replace with your actual template ID
  publicKey: 'YOUR_PUBLIC_KEY', // Replace with your actual public key
};

/**
 * Initialize EmailJS with your public key
 */
export const initEmailJS = (publicKey?: string) => {
  try {
    const keyToUse = publicKey || EMAILJS_CONFIG.publicKey;
    if (keyToUse && keyToUse !== 'YOUR_PUBLIC_KEY') {
      emailjs.init(keyToUse);
      return true;
    } else {
      console.warn('EmailJS initialization skipped: No valid public key provided');
      return false;
    }
  } catch (error) {
    console.error('EmailJS initialization failed:', error);
    return false;
  }
};

/**
 * Response from the email service
 */
export interface EmailServiceResponse {
  success: boolean;
  userEmailSent?: boolean;
  companyEmailSent?: boolean;
  message?: string;
  error?: string;
}

/**
 * Sends form emails using EmailJS
 * @param formData The form submission data
 * @returns Promise with the result of the email sending operation
 */
export const sendFormEmails = async (formData: FormSubmissionData): Promise<EmailServiceResponse> => {
  try {
    // Check if EmailJS is properly configured
    if (EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID' || 
        EMAILJS_CONFIG.templateIdUser === 'YOUR_USER_TEMPLATE_ID' ||
        EMAILJS_CONFIG.templateIdCompany === 'YOUR_COMPANY_TEMPLATE_ID') {
      console.error('EmailJS not properly configured with real service/template IDs');
      return {
        success: false,
        error: 'EmailJS not properly configured. Please update the configuration with real values.',
      };
    }
    
    // Skip sending if we know it will fail
    if (!EMAILJS_CONFIG.publicKey || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
      console.error('EmailJS public key not set or invalid');
      return {
        success: false,
        error: 'EmailJS public key missing or invalid',
      };
    }
    
    try {
      // Send confirmation email to user
      const userEmailPromise = emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateIdUser,
        {
          to_email: formData.email,
          to_name: formData.name,
          form_type: formData.formType,
        }
      );
      
      // Send notification email to company
      const companyEmailPromise = emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateIdCompany,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message || '',
          form_type: formData.formType,
          ...formData, // Include all form data
        }
      );
      
      // Wait for both emails to be sent
      const [userResult, companyResult] = await Promise.allSettled([userEmailPromise, companyEmailPromise]);
      
      const userEmailSent = userResult.status === 'fulfilled';
      const companyEmailSent = companyResult.status === 'fulfilled';
      
      // Log any specific errors
      if (!userEmailSent && userResult.status === 'rejected') {
        console.error('User email failed:', userResult.reason);
      }
      if (!companyEmailSent && companyResult.status === 'rejected') {
        console.error('Company email failed:', companyResult.reason);
      }
      
      return {
        success: userEmailSent || companyEmailSent,
        userEmailSent,
        companyEmailSent,
        message: 'Used EmailJS service',
      };
    } catch (error) {
      console.error('Error sending emails with EmailJS:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'EmailJS sending error',
      };
    }
  } catch (error) {
    console.error('Error in EmailJS service:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'EmailJS configuration error',
    };
  }
};
