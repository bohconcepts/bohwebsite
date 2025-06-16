import { supabase, createAnonymousClient } from '../client';
import { NewsletterSubscriber, NewsletterSubscriberInsert, NewsletterSubscriberUpdate } from '../types/newsletter-subscribers';
import { sendSubscriptionConfirmationEmail } from '@/integrations/email/emailService';

/**
 * Subscribe a new email to the newsletter
 * Uses anonymous client to comply with RLS policies
 * Sends a confirmation email with unsubscribe link
 */
export const subscribeToNewsletter = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Use anonymous client for public operations
    const anonClient = createAnonymousClient();
    
    const newSubscriber: NewsletterSubscriberInsert = {
      email: email.toLowerCase().trim(),
      confirmed: false, // Default to unconfirmed until email verification
    };

    // Insert the new subscriber
    const { data, error } = await anonClient
      .from("newsletter_subscribers")
      .insert(newSubscriber)
      .select('unsubscribe_token')
      .single();

    if (error) {
      // Handle duplicate email error more gracefully
      if (error.code === '23505') {
        return { success: false, error: 'This email is already subscribed to our newsletter.' };
      }
      return { success: false, error: error.message };
    }

    // Send confirmation email with unsubscribe link
    if (data?.unsubscribe_token) {
      try {
        await sendSubscriptionConfirmationEmail(email, data.unsubscribe_token);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // We don't want to fail the subscription if just the email fails
        // The user is still subscribed, they just didn't get the confirmation email
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Confirm a newsletter subscription using the confirmation token
 */
export const confirmSubscription = async (token: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ confirmed: true })
      .eq("confirmation_token", token);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error confirming subscription:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Unsubscribe from the newsletter using the unsubscribe token
 */
export const unsubscribeFromNewsletter = async (token: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("unsubscribe_token", token);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Get all newsletter subscribers (admin function)
 */
export const getNewsletterSubscribers = async (): Promise<{ 
  success: boolean; 
  data?: NewsletterSubscriber[]; 
  error?: string;
  count?: number;
}> => {
  try {
    const { data, error, count: rawCount } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact" });

    if (error) {
      return { success: false, error: error.message };
    }

    // Convert null to undefined to match the return type
    const count = rawCount === null ? undefined : rawCount;

    return { success: true, data, count };
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Delete a newsletter subscriber by ID (admin function)
 */
export const deleteNewsletterSubscriber = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting newsletter subscriber:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Update a newsletter subscriber by ID (admin function)
 */
export const updateNewsletterSubscriber = async (
  id: string, 
  updates: NewsletterSubscriberUpdate
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update(updates)
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating newsletter subscriber:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Get newsletter subscription statistics (admin function)
 */
export const getNewsletterStats = async (): Promise<{ 
  success: boolean; 
  data?: { total: number; confirmed: number; unconfirmed: number }; 
  error?: string 
}> => {
  try {
    const { count: totalCount, error: totalError } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true });
    
    const { count: confirmedCount, error: confirmedError } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("confirmed", true);

    if (totalError || confirmedError) {
      return { 
        success: false, 
        error: (totalError || confirmedError)?.message 
      };
    }

    // Convert null to 0 to avoid type issues
    const total = totalCount ?? 0;
    const confirmed = confirmedCount ?? 0;
    const unconfirmed = total - confirmed;

    return { 
      success: true, 
      data: { 
        total, 
        confirmed, 
        unconfirmed 
      } 
    };
  } catch (error) {
    console.error("Error fetching newsletter stats:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
