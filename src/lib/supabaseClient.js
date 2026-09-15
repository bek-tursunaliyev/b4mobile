import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Whether real Supabase credentials were provided at build time. When they
// are missing (e.g. env vars not set on the hosting provider), we still
// build a client with harmless placeholder values so importing this module
// never throws during script evaluation — that kind of top-level throw
// happens before React even mounts and results in a blank white page with
// no way to show the user what went wrong.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "public-anon-key-placeholder"
);
