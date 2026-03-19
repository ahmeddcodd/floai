# Vercel Deployment

## Project Root

When importing this repository into Vercel, set the **Root Directory** to:

`cod-dashboard`

This app lives in a subfolder, so setting the root directory correctly is important.

## Required Environment Variables

Add these variables in the Vercel project settings before deploying:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
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
