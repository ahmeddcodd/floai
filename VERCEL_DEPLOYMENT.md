# Vercel Deployment

## Project Root

When importing this repository into Vercel, set the **Root Directory** to:

`cod-dashboard`

This app lives in a subfolder, so setting the root directory correctly is important.

## Environment Variables

Add these required variables in the Vercel project settings before deploying:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional (recommended for branded Google OAuth):

- `NEXT_PUBLIC_SUPABASE_CUSTOM_DOMAIN_URL`

Add these only if you want WhatsApp Embedded Signup enabled in the setup flow:

- `NEXT_PUBLIC_META_APP_ID`
- `NEXT_PUBLIC_META_CONFIG_ID`

You can use `.env.example` as the reference for names.

## Build Settings

The default Vercel settings are fine for this app once the root directory is `cod-dashboard`:

- Framework Preset: `Next.js`
- Install Command: auto-detected
- Build Command: `next build`
- Output Directory: auto-detected

## Post-Deploy Checks

After the first deployment:

1. Open the deployed site and verify the landing page, sign-in page, dashboard route, privacy page, and terms page.
2. Confirm Google sign-in redirect URLs are allowed for the deployed domain in Supabase auth settings.
   Add your deployed callback URL ending in `/auth/callback`.
3. Confirm the deployed domain is allowed in Meta app / WhatsApp Embedded Signup configuration if that flow is enabled.
4. Confirm `NEXT_PUBLIC_API_BASE_URL` points to the correct backend environment.
5. Confirm `NEXT_PUBLIC_SITE_URL` exactly matches your public app domain (for example `https://floai.pk`).

## Google Sign-In Branding (Show "FloAI")

If Google currently shows your Supabase project-ref domain (for example `xxxx.supabase.co`) during sign-in:

1. Configure a Supabase custom domain or vanity subdomain for your project.
2. Set `NEXT_PUBLIC_SUPABASE_CUSTOM_DOMAIN_URL` in Vercel to that branded Supabase domain.
3. In Google OAuth client settings, allow both callback URLs:
   - `https://<project-ref>.supabase.co/auth/v1/callback`
   - `https://<your-branded-domain>/auth/v1/callback`
4. In Google Auth Platform > Branding, set app name to `FloAI`, complete brand verification, and publish branding.

## Google OAuth Page-Not-Found Fix

If the browser shows a **Page not found** right after selecting a Google account:

1. In Google OAuth client settings, **do not** set your app URL (like `https://your-app.com/auth/v1/callback`) as the redirect URI.
2. Use only your Supabase auth callback URIs:
   - `https://<project-ref>.supabase.co/auth/v1/callback`
   - `https://<your-supabase-custom-domain>/auth/v1/callback` (if configured)
3. In Supabase Auth URL configuration, allow your app callback URL:
   - `https://<your-app-domain>/auth/callback`
