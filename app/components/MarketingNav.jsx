"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HOME_PATH, SETUP_PATH } from "../../lib/routes";
import { MARKETING_SECTION_LINKS, SITE_NAME } from "../../lib/site";

const arrowLeftIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function MarketingNav({ variant = "marketing" }) {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`landing-nav${navScrolled ? " scrolled" : ""}`}>
      <div className="landing-nav-inner">
        <Link href={HOME_PATH} className="landing-nav-brand">
          <span className="landing-logo-icon">⚡</span>
          {SITE_NAME}
        </Link>
        <div className="landing-nav-links">
          {variant === "marketing" ? (
            <>
              {MARKETING_SECTION_LINKS.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
              <Link href={SETUP_PATH} className="button button-primary landing-nav-cta">
                Get Started
              </Link>
            </>
          ) : (
            <Link href={HOME_PATH} className="button button-secondary landing-nav-cta">
              {arrowLeftIcon} Back to Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
