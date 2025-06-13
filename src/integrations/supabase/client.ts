import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/index";

// Use the actual Supabase project values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Configure client with persistent sessions to prevent logout on refresh
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
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
