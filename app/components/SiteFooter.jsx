import Link from "next/link";
import {
  LEGAL_LINKS,
  PRODUCT_SECTION_LINKS,
  SITE_COPYRIGHT_TEXT,
  SITE_NAME,
  SITE_TAGLINE,
} from "../../lib/site";

export default function SiteFooter({ compact = false, transparent = false }) {
  const footerStyle = transparent ? { marginTop: "auto", background: "transparent", borderTop: "none" } : undefined;

  if (compact) {
    return (
      <footer className="landing-footer" style={footerStyle}>
        <div className="landing-footer-bottom">
          <p>
            {SITE_COPYRIGHT_TEXT}
            {" • "}
            {LEGAL_LINKS.map((link, index) => (
              <span key={link.href}>
                {index > 0 ? " • " : null}
                <Link href={link.href} style={{ color: "inherit", textDecoration: "underline" }}>
                  {link.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="landing-footer" style={footerStyle}>
      <div className="landing-footer-inner">
        <div className="landing-footer-brand">
          <span className="landing-logo-icon">⚡</span> {SITE_NAME}
          <p>{SITE_TAGLINE}</p>
        </div>
        <div className="landing-footer-links">
          <div>
            <h4>Product</h4>
            {PRODUCT_SECTION_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h4>Legal</h4>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="landing-footer-bottom">
        <p>{SITE_COPYRIGHT_TEXT}</p>
      </div>
    </footer>
  );
}
