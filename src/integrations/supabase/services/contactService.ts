import { supabase } from "../client";
import type { ContactInsert } from "../types/index";

/**
 * Saves a contact form submission to the Supabase contacts table
 * @param contactData The contact form data to save
 * @returns Promise resolving to the inserted contact or null if there was an error
 */
export const saveContactMessage = async (contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    // Create the contact insert object
    const newContact: ContactInsert = {
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      read: false,
      archived: false,
    };

    // Create a new anonymous client for public access
    // This ensures we're using the anon key even if the user is logged in
    const { error } = await supabase
      .from("contacts")
      .insert(newContact);

    if (error) {
      console.error("Error saving contact message:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error saving contact message:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Gets all contact messages
 * @param options Filter options
 * @returns Promise resolving to an array of contacts
 */
export const getContactMessages = async (options?: {
  archived?: boolean;
  read?: boolean;
  limit?: number;
  offset?: number;
}) => {
  try {
    let query = supabase.from("contacts").select("*");

    // Apply filters if provided
    if (options?.archived !== undefined) {
      query = query.eq("archived", options.archived);
    }

    if (options?.read !== undefined) {
      query = query.eq("read", options.read);
    }

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    // Order by created_at descending (newest first)
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching contact messages:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error fetching contact messages:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: [] 
    };
  }
};

/**
 * Updates a contact message
 * @param id The ID of the contact to update
 * @param updates The fields to update
 * @returns Promise resolving to success status
 */
export const updateContactMessage = async (
  id: string,
  updates: { read?: boolean; archived?: boolean }
) => {
  try {
    const { data, error } = await supabase
      .from("contacts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating contact message:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error updating contact message:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Deletes a contact message
 * @param id The ID of the contact to delete
 * @returns Promise resolving to success status
 */
export const deleteContactMessage = async (id: string) => {
  try {
    const { error } = await supabase.from("contacts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting contact message:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting contact message:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Gets contact message statistics
 * @returns Promise resolving to contact statistics
 */
export const getContactStats = async () => {
  try {
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true });

    // Get unread count
    const { count: unread, error: unreadError } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("read", false);

    // Get archived count
    const { count: archived, error: archivedError } = await supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("archived", true);

    if (totalError || unreadError || archivedError) {
      console.error("Error fetching contact stats:", totalError || unreadError || archivedError);
      return { 
        success: false, 
        error: (totalError || unreadError || archivedError)?.message 
      };
    }

    return { 
      success: true, 
      data: { 
        total: total || 0, 
        unread: unread || 0, 
        archived: archived || 0 
      } 
    };
  } catch (error) {
    console.error("Unexpected error fetching contact stats:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
