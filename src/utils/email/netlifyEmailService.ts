import { FormSubmissionData } from './types';

/**
 * Configuration for the Netlify email service
 */
interface EmailServiceConfig {
  functionUrl: string;
}

/**
 * Default configuration - automatically detects environment
 */
const defaultConfig: EmailServiceConfig = {
  // Uses relative URL for both local (via netlify dev) and production
  functionUrl: '/.netlify/functions/send-email',
};

/**
 * Response from the Netlify email service
 */
export interface EmailServiceResponse {
  success: boolean;
  userEmailSent?: boolean;
  companyEmailSent?: boolean;
  message?: string;
  error?: string;
}

/**
 * Sends form data to the Netlify function email service
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
    const response = await fetch(finalConfig.functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    let result: any = {};

    // Check if response has a body to parse
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      console.error('Email function returned non-JSON response');
      return {
        success: false,
        error: 'Invalid response format from email function',
      };
    }

    if (!response.ok) {
      console.error('Email service error:', result);
      return {
        success: false,
        error: result.error || 'Unknown error from email service',
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
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
