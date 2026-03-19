import { HOME_PATH } from "./routes";

export const SITE_NAME = "FloAI";
export const SITE_TAGLINE = "AI-powered COD order verification for Pakistani Shopify stores.";
export const SITE_DESCRIPTION = SITE_TAGLINE;
export const SITE_SUPPORT_EMAIL = "support@floai.pk";
export const SITE_URL = "https://floai.pk";
export const SITE_COPYRIGHT_TEXT = "Copyright 2026 FloAI. Built for Pakistan.";

export const MARKETING_SECTION_LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export const PRODUCT_SECTION_LINKS = MARKETING_SECTION_LINKS.map((link) => ({
  ...link,
  href: `${HOME_PATH}${link.href}`,
}));

export const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];
