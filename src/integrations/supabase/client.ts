import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Credentials are read from environment variables so preview/staging/production
// can point at different Supabase projects. The bundled fallbacks are the
// project's publishable (anon) credentials — safe to ship in client code, but
// prefer setting VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY explicitly.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://jlrlobigcfxhsjvbeemu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpscmxvYmlnY2Z4aHNqdmJlZW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTE1NTMsImV4cCI6MjA2Mjg4NzU1M30.hZFdxHq5i35FsPLs8sEaAhx5OzpQG9700ZDvxWNL184";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
