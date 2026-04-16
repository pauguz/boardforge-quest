// Re-export the official Lovable Cloud Supabase client.
// Do NOT create a parallel client here — the official one in
// `@/integrations/supabase/client` is auto-wired with the correct
// VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY env vars
// injected by Lovable Cloud at build time.
export { supabase } from "@/integrations/supabase/client";
