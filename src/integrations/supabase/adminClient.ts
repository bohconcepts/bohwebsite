import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types/index";

// IMPORTANT: Using direct values as a temporary solution since environment variables aren't loading
// In production, these should come from environment variables for security
const SUPABASE_URL = "https://krbkwdkluhyxpgddnqwr.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyYmt3ZGtsdWh5eHBnZGRucXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTc1MTgxNywiZXhwIjoyMDY1MzI3ODE3fQ.Tc-N4YP8lA2rxjiDu0HejcDBNsteJuTN-N6G2TTl2wk";

// NOTE: Replace the values above with your actual Supabase project details
// You can find these in your Supabase dashboard under Project Settings > API

// Add console logs for debugging
console.log("Admin - Supabase URL being used:", SUPABASE_URL);
console.log(
  "Admin - Supabase SERVICE ROLE KEY available:",
  !!SUPABASE_SERVICE_ROLE_KEY
);

// This client should only be used for admin operations on the server or in protected admin routes
export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
