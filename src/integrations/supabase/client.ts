import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types/index";

// Declare the global variables defined in vite.config.ts
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

// Get environment variables from Vite's define declarations
export const SUPABASE_URL = __SUPABASE_URL__ || "";
export const SUPABASE_ANON_KEY = __SUPABASE_ANON_KEY__ || "";

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
