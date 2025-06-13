import { supabase } from "../client";
import type { Profile, ProfileInsert, ProfileUpdate } from "../types/index";
import type { QueryResponse, PaginatedQueryResponse } from "../types/base";

/**
 * Fetches the profile for the current authenticated user
 * @returns Promise resolving to the user's profile or null if not found
 */
export const getCurrentUserProfile = async (): Promise<QueryResponse<Profile>> => {
  try {
    // First get the current user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData?.user) {
      console.error("Error getting current user:", authError);
      return { 
        success: false, 
        error: authError?.message || "User not authenticated" 
      };
    }

    // Then fetch the profile for this user
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", authData.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Profile };
  } catch (error) {
    console.error("Unexpected error fetching current user profile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Creates a new profile for a user
 * @param profileData The profile data to create
 * @returns Promise resolving to the created profile
 */
export const createProfile = async (profileData: ProfileInsert): Promise<QueryResponse<Profile>> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Profile };
  } catch (error) {
    console.error("Unexpected error creating profile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Updates an existing profile
 * @param id The ID of the profile to update
 * @param updates The profile fields to update
 * @returns Promise resolving to the updated profile
 */
export const updateProfile = async (
  id: string,
  updates: ProfileUpdate
): Promise<QueryResponse<Profile>> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Profile };
  } catch (error) {
    console.error("Unexpected error updating profile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Updates the profile for the current authenticated user
 * @param updates The profile fields to update
 * @returns Promise resolving to the updated profile
 */
export const updateCurrentUserProfile = async (
  updates: Omit<ProfileUpdate, "user_id">
): Promise<QueryResponse<Profile>> => {
  try {
    // First get the current user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authData?.user) {
      console.error("Error getting current user:", authError);
      return { 
        success: false, 
        error: authError?.message || "User not authenticated" 
      };
    }

    // Then update the profile for this user
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", authData.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Profile };
  } catch (error) {
    console.error("Unexpected error updating current user profile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Fetches a profile by ID
 * @param id The ID of the profile to fetch
 * @returns Promise resolving to the profile
 */
export const getProfileById = async (id: string): Promise<QueryResponse<Profile>> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Profile };
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Fetches a profile by user ID
 * @param userId The user ID of the profile to fetch
 * @returns Promise resolving to the profile
 */
export const getProfileByUserId = async (userId: string): Promise<QueryResponse<Profile>> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Profile };
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Fetches all profiles with optional filtering and pagination
 * @param options Filter and pagination options
 * @returns Promise resolving to an array of profiles
 */
export const getProfiles = async (options?: {
  role?: "admin" | "operator" | "staff";
  isActive?: boolean;
  limit?: number;
  offset?: number;
}): Promise<PaginatedQueryResponse<Profile>> => {
  try {
    let query = supabase.from("profiles").select("*", { count: "exact" });

    // Apply filters if provided
    if (options?.role) {
      query = query.eq("role", options.role);
    }

    if (options?.isActive !== undefined) {
      query = query.eq("is_active", options.isActive);
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

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching profiles:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { 
      success: true, 
      data: data as Profile[],
      count,
      hasMore: count ? (options?.offset || 0) + (options?.limit || 10) < count : false
    };
  } catch (error) {
    console.error("Unexpected error fetching profiles:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: [] 
    };
  }
};

/**
 * Checks if a user has admin privileges
 * @param userId The user ID to check
 * @returns Promise resolving to a boolean indicating if the user is an admin
 */
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Checks if the current authenticated user has admin privileges
 * @returns Promise resolving to a boolean indicating if the current user is an admin
 */
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData?.user) {
      return false;
    }

    return isUserAdmin(authData.user.id);
  } catch (error) {
    console.error("Error checking current user admin status:", error);
    return false;
  }
};
