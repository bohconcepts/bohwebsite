/**
 * Email service for sending emails through Netlify Functions
 * This service uses the Netlify serverless function to send emails via Office 365 SMTP
 */

export interface NetlifyEmailFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  formType: 'contact' | 'partnership' | 'newsletter';
  [key: string]: any; // Allow any additional fields
}

/**
 * Check if we're in development mode
 */
const isDevelopment = (): boolean => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

/**
 * Safe console log that only logs in development
 */
const devLog = (...args: any[]): void => {
  if (isDevelopment()) {
    console.log(...args);
  }
};

/**
 * Get the appropriate function URL based on environment
 */
const getFunctionUrl = (baseUrl: string): string => {
  // Check if we're in development mode
  const isDev = isDevelopment();
  
  // For local development with Vite (not using netlify dev)
  if (isDev && window.location.port === '5173') {
    // Try the Netlify Dev server on port 8888 by default
    return `http://localhost:8888${baseUrl}`;
  }
  
  return baseUrl;
};

/**
 * Send emails (both confirmation to user and notification to company) via Netlify function
 */
export const sendEmailsViaNetlify = async (formData: NetlifyEmailFormData): Promise<{
  success: boolean;
  userEmailSent: boolean;
  companyEmailSent: boolean;
  message: string;
  error?: string;
}> => {
  try {
    console.log('Sending emails via Netlify function:', formData);
    
    // Get the appropriate URL for the current environment
    const functionUrl = getFunctionUrl('/.netlify/functions/send-email');
    console.log(`Using email function URL: ${functionUrl}`);
    
    // Call the Netlify function endpoint
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Clone the response before reading its body (to avoid stream already read errors)
    const responseClone = response.clone();
    
    // Check if response is ok first
    if (!response.ok) {
      let errorData: any = {};
      
      try {
        // Try to parse JSON response, but be ready for non-JSON responses
        errorData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        
        // If JSON parsing fails, get text instead from the cloned response
        try {
          const errorText = await responseClone.text();
          console.error('Raw error response:', errorText);
          errorData = { error: `HTTP error ${response.status}: ${errorText || 'No response body'}` };
        } catch (textError) {
          console.error('Failed to get response text:', textError);
          errorData = { error: `HTTP error ${response.status}: Unable to read response` };
        }
      }
      
      // Special handling for 404 errors which likely indicate function path issues
      if (response.status === 404) {
        console.error('Email function not found (404):', errorData);
        return {
          success: false,
          userEmailSent: false,
          companyEmailSent: false,
          message: 'Email service not found',
          error: 'Email service not found. If running locally, make sure to use the netlify:dev script instead of the regular dev script.',
        };
      }
      
      console.error(`Email sending failed (HTTP ${response.status}):`, errorData);
      return {
        success: false,
        userEmailSent: false,
        companyEmailSent: false,
        message: errorData.error || `HTTP error ${response.status}`,
        error: errorData.details || errorData.error || `Failed with status ${response.status}`,
      };
    }

    // For successful responses, parse the JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse success response:', parseError);
      
      // Try to get the text content from the cloned response
      try {
        const textContent = await responseClone.text();
        console.log('Success response text content:', textContent);
      } catch (textError) {
        console.error('Failed to get response text:', textError);
      }
      
      // If we can't parse the JSON, create a default success response
      // This shouldn't normally happen, but it's good to be defensive
      return {
        success: true,
        userEmailSent: true,
        companyEmailSent: true,
        message: 'Emails likely sent, but couldn\'t confirm details',
      };
    }

    return {
      success: data.success !== false, // Default to true if not explicitly false
      userEmailSent: data.userEmailSent || false,
      companyEmailSent: data.companyEmailSent || false,
      message: data.message || 'Emails sent successfully',
    };
  } catch (error) {
    // This catches network errors and other exceptions
    console.error('Error sending emails:', error);
    
    // Check if the error was due to a network issue
    const isNetworkError = error instanceof Error && 
      (error.message.includes('NetworkError') || 
       error.message.includes('Failed to fetch') ||
       error.message.includes('Network request failed'));
    
    return {
      success: false,
      userEmailSent: false,
      companyEmailSent: false,
      message: isNetworkError 
        ? 'Network error - Please check your internet connection'
        : 'Error sending emails',
      error: error instanceof Error 
        ? error.message 
        : 'Unknown error',
    };
  }
};
