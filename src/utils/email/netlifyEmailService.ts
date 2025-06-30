import { FormSubmissionData } from './types';

/**
 * Configuration for the Netlify email service
 */
interface EmailServiceConfig {
  functionUrl: string;
}

/**
 * Default configuration - uses relative URL for local (netlify dev) and production
 */
const defaultConfig: EmailServiceConfig = {
  functionUrl: '/.netlify/functions/send-email',
};

/**
 * Response from the Netlify email service
 */
interface EmailServiceResponse {
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

    // Initialize an empty result
    let result: any = {};

    // Check for valid JSON Content-Type
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON from email function:', jsonError);
        return {
          success: false,
          error: 'Invalid JSON returned from email function',
        };
      }
    } else {
      console.error('Email function returned non-JSON response');
      return {
        success: false,
        error: 'Invalid response format from email function',
      };
    }

    if (!response.ok) {
      console.error('Email service responded with error:', result);
      return {
        success: false,
        error: result.error || result.message || 'Unknown error from email service',
      };
    }

    // Successful response
    return {
      success: result.success ?? true,
      userEmailSent: result.userEmailSent,
      companyEmailSent: result.companyEmailSent,
      message: result.message || 'Emails sent successfully',
    };

  } catch (error) {
    console.error('Error sending emails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
