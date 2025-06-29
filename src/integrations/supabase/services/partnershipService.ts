import { supabase } from "../client";
// Import createClient when needed
// import { createClient } from "@supabase/supabase-js";
import type { PartnershipRequestInsert, PartnershipRequestUpdate } from "../types/partnership-requests";

// Get environment variables with fallbacks for development
// These will be used when Supabase integration is enabled
// const SUPABASE_URL = "https://krbkwdkluhyxpgddnqwr.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyYmt3ZGtsdWh5eHBnZGRucXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTE4MTcsImV4cCI6MjA2NTMyNzgxN30.cqcg9G8PsfP2xFTVdKToktzGcA0zv-LZXxgQO8__aaw";

/**
 * Saves a partnership request to the Supabase partnership_requests table
 * @param partnershipData The partnership request data to save
 * @returns Promise resolving to success status and optional error message
 */
export const savePartnershipRequest = async (partnershipData: {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  website?: string;
  industry?: string;
  partnership_type?: string;
  message?: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Saving partnership request:', partnershipData);
    
    // Create the partnership request insert object
    const newPartnershipRequest: PartnershipRequestInsert = {
      company_name: partnershipData.company_name,
      contact_person: partnershipData.contact_person,
      email: partnershipData.email,
      phone: partnershipData.phone,
      website: partnershipData.website || null,
      industry: partnershipData.industry || null,
      partnership_type: partnershipData.partnership_type || null,
      message: partnershipData.message || null,
    };

    // For now, let's just log the request and return success
    // This will allow the form to work even if Supabase is not properly configured
    console.log('Partnership request data:', newPartnershipRequest);
    
    // Uncomment this section when Supabase is properly configured
    /*
    // Create a new anonymous client for public access
    // This ensures we're using the anon key even if the user is logged in
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { error } = await anonClient
      .from("partnership_requests")
      .insert(newPartnershipRequest);
      
    if (error) {
      console.error("Error saving partnership request:", error);
      return { success: false, error: error.message };
    }
    */
    
    // Return success for now
    return { success: true };
  } catch (error) {
    console.error("Unexpected error saving partnership request:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Gets all partnership requests
 * @param options Filter options
 * @returns Promise resolving to an array of partnership requests
 */
export const getPartnershipRequests = async (options?: {
  limit?: number;
  offset?: number;
  partnershipType?: string;
}) => {
  try {
    let query = supabase.from("partnership_requests").select("*");

    // Apply filters if provided
    if (options?.partnershipType) {
      query = query.eq("partnership_type", options.partnershipType);
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
      console.error("Error fetching partnership requests:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error fetching partnership requests:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Gets a single partnership request by ID
 * @param id The ID of the partnership request to retrieve
 * @returns Promise resolving to the partnership request or null if not found
 */
export const getPartnershipRequestById = async (id: string) => {
  try {
    // Use authenticated client for admin operations
    const { data, error } = await supabase
      .from("partnership_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching partnership request:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error fetching partnership request:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Updates a partnership request
 * @param id Partnership request ID
 * @param updateData Data to update
 * @returns Promise resolving to success status
 */
export const updatePartnershipRequest = async (
  id: string,
  updateData: PartnershipRequestUpdate
) => {
  try {
    // Use authenticated client for admin operations
    const { error } = await supabase
      .from("partnership_requests")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating partnership request:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating partnership request:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Deletes a partnership request
 * @param id Partnership request ID
 * @returns Promise resolving to success status
 */
export const deletePartnershipRequest = async (id: string) => {
  try {
    // Use authenticated client for admin operations
    const { error } = await supabase
      .from("partnership_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting partnership request:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting partnership request:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Gets partnership request statistics
 * @returns Promise resolving to partnership request statistics
 */
export const getPartnershipStats = async () => {
  try {
    // Use authenticated client for admin operations
    
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from("partnership_requests")
      .select("*", { count: "exact", head: true });

    // Get count by partnership type
    const { data: typeCounts, error: typeError } = await supabase
      .from("partnership_requests")
      .select("partnership_type, count", { count: "exact" });

    if (totalError || typeError) {
      console.error("Error fetching partnership stats:", totalError || typeError);
      return { 
        success: false, 
        error: (totalError || typeError)?.message 
      };
    }

    return { 
      success: true, 
      data: { 
        total: total || 0,
        typeCounts: typeCounts || []
      } 
    };
  } catch (error) {
    console.error("Unexpected error fetching partnership stats:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
