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
 * Get the appropriate function URL based on environment
 */
const getFunctionUrl = (configUrl: string): string => {
  // Check if we're in development mode
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // For local development with Vite (not using netlify dev)
  if (isDev && window.location.port === '5173') {
    // Try the Netlify Dev server on port 8888 by default
    return `http://localhost:8888${configUrl}`;
  }
  
  return configUrl;
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
  const functionUrl = getFunctionUrl(finalConfig.functionUrl);
  
  try {
    console.log(`Sending email request to: ${functionUrl}`);
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    let result: any = {};
    
    // Clone the response before reading its body
    const responseClone = response.clone();
    
    // Check if response has a body to parse
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        // If JSON parsing fails, try to get the text content
        const textContent = await responseClone.text();
        console.log('Response text content:', textContent);
        return {
          success: false,
          error: 'Failed to parse response: ' + (jsonError instanceof Error ? jsonError.message : String(jsonError)),
        };
      }
    } else {
      console.error('Email function returned non-JSON response');
      // Use the cloned response to get text content
      const textContent = await responseClone.text();
      console.log('Response text content:', textContent);
      return {
        success: false,
        error: 'Invalid response format from email function',
      };
    }

    if (!response.ok) {
      console.error(`Email service error (${response.status}):`, result);
      
      // Special handling for 404 errors which likely indicate function path issues
      if (response.status === 404) {
        return {
          success: false,
          error: 'Email service not found. This may indicate a configuration issue with Netlify Functions.',
          message: 'If running locally, make sure to use the netlify:dev script instead of the regular dev script.'
        };
      }
      
      return {
        success: false,
        error: result.error || `Server error: ${response.status} ${response.statusText}`,
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
