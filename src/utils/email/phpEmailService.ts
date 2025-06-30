import { FormSubmissionData } from './types';

/**
 * Configuration for the PHP email service
 */
interface EmailServiceConfig {
  apiUrl: string;
}

/**
 * Default configuration - update this with your actual domain in production
 */
const defaultConfig: EmailServiceConfig = {
  // Local development URL
  apiUrl: 'http://localhost/api/send-email.php',
};

// Production URL detection
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  // When in production, use the same domain as the website
  defaultConfig.apiUrl = `${window.location.origin}/api/send-email.php`;
}

/**
 * Response from the PHP email service
 */
interface EmailServiceResponse {
  success: boolean;
  userEmailSent?: boolean;
  companyEmailSent?: boolean;
  message?: string;
  error?: string;
}

/**
 * Sends form data to the PHP email service
 * @param formData The form submission data
 * @param config Optional configuration overrides
 * @returns Promise with the result of the email sending operation
 */
export const sendFormEmails = async (
  formData: FormSubmissionData,
  config: Partial<EmailServiceConfig> = {}
): Promise<EmailServiceResponse> => {
  const finalConfig = { ...defaultConfig, ...config };
  
  try {
    const response = await fetch(finalConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Email service error:', result);
      return {
        success: false,
        error: result.error || 'Unknown error',
      };
    }
    
    return {
      success: result.success,
      userEmailSent: result.userEmailSent,
      companyEmailSent: result.companyEmailSent,
      message: result.message,
    };
  } catch (error) {
    console.error('Error sending emails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
