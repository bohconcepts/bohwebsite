import { supabase } from '@/integrations/supabase/client';

// Email service for sending emails through Supabase Edge Functions
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send an email using Supabase Edge Functions
 * This requires setting up an Edge Function in your Supabase project
 */
export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get the sender email from environment variables or use default
    const senderEmail = import.meta.env.VITE_EMAIL_SENDER || 'sefa@bohconcepts.com';
    
    // Call the Supabase Edge Function for sending emails
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: options.to,
        subject: options.subject,
        html: options.html,
        from: options.from || senderEmail
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Send a subscription confirmation email with unsubscribe link
 */
export const sendSubscriptionConfirmationEmail = async (
  email: string, 
  unsubscribeToken: string
): Promise<{ success: boolean; error?: string }> => {
  const subject = 'Thank you for subscribing to BOH Concepts Newsletter';
  
  // Create the unsubscribe URL
  const unsubscribeUrl = `${window.location.origin}/unsubscribe?token=${unsubscribeToken}`;
  
  // Create HTML email content
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1a365d; padding: 20px; text-align: center;">
        <img src="${window.location.origin}/images/logo/boh_logo.png" alt="BOH Concepts Logo" style="height: 60px; width: auto;">
      </div>
      
      <div style="padding: 20px; background-color: #ffffff; color: #333333;">
        <h2 style="color: #1a365d;">Thank You for Subscribing!</h2>
        
        <p>Dear Subscriber,</p>
        
        <p>Thank you for subscribing to the BOH Concepts newsletter. We're excited to have you join our community!</p>
        
        <p>You'll now receive regular updates on industry insights, exclusive opportunities, and the latest news from BOH Concepts.</p>
        
        <p>We respect your privacy and want to ensure you have control over your subscription preferences. You have the right to unsubscribe at any time by clicking the link below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${unsubscribeUrl}" style="background-color: #e84118; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Unsubscribe</a>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Best regards,<br>The BOH Concepts Team</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666666;">
        <p>&copy; ${new Date().getFullYear()} BOH Concepts. All rights reserved.</p>
        <p>This email was sent to ${email}. You received this email because you subscribed to our newsletter.</p>
      </div>
    </div>
  `;
  
  return await sendEmail({
    to: email,
    subject,
    html
  });
};
