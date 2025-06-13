import { supabase } from "../client";
import { createProfile } from "./profileService";
import type { ProfileInsert } from "../types/profiles";

/**
 * Interface for signup response
 */
export interface SignupResponse {
  success: boolean;
  error?: string;
  userId?: string;
}

/**
 * Registers a new user with Supabase Auth and creates their profile
 * @param email User's email
 * @param password User's password
 * @param fullName User's full name
 * @param role User's role (default: "staff")
 * @returns Promise resolving to signup result
 */
export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
  role: string = "staff"
): Promise<SignupResponse> => {
  try {
    // First, sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm-password`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError || !authData.user) {
      console.error("Error registering user:", authError);
      return {
        success: false,
        error: authError?.message || "Failed to register user",
      };
    }

    // Then create a profile for the user
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    const profileData: ProfileInsert = {
      user_id: authData.user.id,
      email: email,
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
      role: role as "admin" | "viewer" | "staff",
      is_active: true,
    };

    const { success, error } = await createProfile(profileData);

    if (!success) {
      console.error("Error creating profile:", error);
      return {
        success: false,
        error: error || "Failed to create user profile",
        userId: authData.user.id,
      };
    }

    return {
      success: true,
      userId: authData.user.id,
    };
  } catch (error) {
    console.error("Unexpected error during registration:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred during registration",
    };
  }
};

/**
 * Signs in a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns Promise resolving to login result
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<SignupResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.error("Error logging in:", error);
      return {
        success: false,
        error: error?.message || "Failed to login",
      };
    }

    return {
      success: true,
      userId: data.user.id,
    };
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred during login",
    };
  }
};

/**
 * Signs out the current user
 * @returns Promise resolving to logout result
 */
export const logoutUser = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error during logout:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred during logout",
    };
  }
};
