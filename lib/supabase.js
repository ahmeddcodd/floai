import { createClient } from "@supabase/supabase-js";

const supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseCustomDomainUrl =
  process.env.NEXT_PUBLIC_SUPABASE_CUSTOM_DOMAIN_URL?.trim() || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
const shouldUseCustomDomain =
  process.env.NEXT_PUBLIC_SUPABASE_USE_CUSTOM_DOMAIN?.trim() === "true";

// Use project URL by default for reliability. Custom domain must be explicitly enabled.
const supabaseUrl =
  shouldUseCustomDomain && supabaseCustomDomainUrl
    ? supabaseCustomDomainUrl
    : supabaseProjectUrl;

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
