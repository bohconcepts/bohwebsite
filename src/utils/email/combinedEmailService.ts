import { FormSubmissionData } from './types';
import { sendFormEmails as sendWithNetlify, EmailServiceResponse } from './netlifyEmailService';
import { sendFormEmails as sendWithEmailJS, initEmailJS } from './fallbackEmailService';

/**
 * Combined email service that tries Netlify function first, then falls back to EmailJS
 * 
 * This ensures emails are sent even if the Netlify function isn't working yet
 */
export const sendFormEmails = async (formData: FormSubmissionData): Promise<EmailServiceResponse> => {
  try {
    // First try the Netlify function
    const netlifyResult = await sendWithNetlify(formData);
    
    // If Netlify function succeeded, return its result
    if (netlifyResult.success) {
      return netlifyResult;
    }
    
    console.log('Netlify email function failed, trying EmailJS fallback');
    
    // If Netlify function failed, try EmailJS
    const emailJsResult = await sendWithEmailJS(formData);
    
    // Return EmailJS result with a note that it's a fallback
    return {
      ...emailJsResult,
      message: emailJsResult.message + ' (fallback from Netlify function)',
    };
  } catch (error) {
    console.error('All email methods failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'All email methods failed',
    };
  }
};

// Re-export the initialization function
export { initEmailJS };

// Re-export the response type
export type { EmailServiceResponse };
