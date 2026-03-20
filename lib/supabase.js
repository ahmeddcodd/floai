import { createClient } from "@supabase/supabase-js";

const supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseCustomDomainUrl =
  process.env.NEXT_PUBLIC_SUPABASE_CUSTOM_DOMAIN_URL?.trim() || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

// If you configure a Supabase custom/vanity domain, prefer it for OAuth branding.
const supabaseUrl = supabaseCustomDomainUrl || supabaseProjectUrl;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
    // We handle the OAuth callback explicitly in /auth/callback to avoid
    // duplicate exchange races between auto-detection and manual exchange.
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
