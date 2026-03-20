import Link from "next/link";
import { HOME_PATH, SETUP_PATH } from "../../../../lib/routes";

function resolveSupabaseCallbackUrl() {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const customDomainUrl =
    process.env.NEXT_PUBLIC_SUPABASE_CUSTOM_DOMAIN_URL?.trim() || "";
  const supabaseBaseUrl = customDomainUrl || projectUrl;

  if (!supabaseBaseUrl) {
    return "";
  }

  try {
    return new URL("/auth/v1/callback", supabaseBaseUrl).toString();
  } catch {
    return "";
  }
}

export default function MisconfiguredGoogleCallbackPage() {
  const expectedSupabaseCallback = resolveSupabaseCallbackUrl();

  return (
    <main className="page">
      <section className="card auth-card">
        <h1 className="section-title callback-title">Google OAuth redirect is misconfigured</h1>
        <p className="notice error-notice">
          This app route is not the Google OAuth callback endpoint. Configure Google to redirect
          to your Supabase callback URL, then try sign-in again.
        </p>
        <p className="help-text">
          Google OAuth Authorized Redirect URI must be:
          {" "}
          <strong>{expectedSupabaseCallback || "https://<project-ref>.supabase.co/auth/v1/callback"}</strong>
        </p>
        <div className="actions callback-actions">
          <Link href={SETUP_PATH} className="button button-primary">
            Back to setup
          </Link>
          <Link href={HOME_PATH} className="button button-secondary">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
