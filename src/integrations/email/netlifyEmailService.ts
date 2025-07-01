/**
 * Email service for sending emails through Netlify Functions
 * This service uses the Netlify serverless function to send emails via GoDaddy SMTP
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
    
    // Call the Netlify function endpoint
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Check if response is ok first
    if (!response.ok) {
      let errorData: any = {};
      
      try {
        // Try to parse JSON response, but be ready for non-JSON responses
        errorData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        
        // If JSON parsing fails, get text instead
        const errorText = await response.text();
        console.error('Raw error response:', errorText);
        
        errorData = { error: `HTTP error ${response.status}: ${errorText || 'No response body'}` };
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
