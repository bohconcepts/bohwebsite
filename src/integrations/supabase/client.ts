import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types/index";

// Get environment variables directly from import.meta.env
// These are automatically injected by Vite for variables prefixed with VITE_
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://krbkwdkluhyxpgddnqwr.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyYmt3ZGtsdWh5eHBnZGRucXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NTE4MTcsImV4cCI6MjA2NTMyNzgxN30.cqcg9G8PsfP2xFTVdKToktzGcA0zv-LZXxgQO8__aaw";

// Add console logs for debugging
console.log("Supabase URL being used:", SUPABASE_URL);
console.log("Supabase ANON KEY available:", !!SUPABASE_ANON_KEY);

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Configure client with persistent sessions to prevent logout on refresh
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "bohconcepts",
      detectSessionInUrl: true,
      flowType: "implicit",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
    global: {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
  }
);

// Singleton anonymous client to avoid multiple GoTrueClient instances
let anonymousClient: SupabaseClient<Database> | undefined = undefined;

/**
 * Creates or returns an existing anonymous Supabase client for public operations
 * This client doesn't use any stored session and is suitable for public operations
 * like submitting forms that should work for non-authenticated users
 */
export const createAnonymousClient = (): SupabaseClient<Database> => {
  if (!anonymousClient) {
    anonymousClient = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          // Don't specify storage to avoid conflicts
        },
        global: {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      }
    );
  }
  return anonymousClient;
};
