"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const icons = {
  arrowLeft: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
};

export default function TermsPage() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-page">
      <nav className={`landing-nav${navScrolled ? " scrolled" : ""}`}>
        <div className="landing-nav-inner">
          <Link href="/landing" className="landing-nav-brand">
            <span className="landing-logo-icon">⚡</span>
            FloAI
          </Link>
          <div className="landing-nav-links">
            <Link href="/landing" className="button button-secondary landing-nav-cta">
              {icons.arrowLeft} Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="landing-section" style={{ paddingTop: "140px" }}>
        <div className="landing-section-inner" style={{ maxWidth: "860px" }}>
          <div className="reveal" style={{ "--delay": "0.1s" }}>
            <div className="landing-feature-icon" style={{ margin: "0 auto 24px" }}>
              {icons.shield}
            </div>
            <h1 className="landing-section-title">Terms and Conditions</h1>
            <p className="landing-section-subtitle">Last Updated: March 19, 2026</p>
          </div>

          <div className="card reveal" style={{ "--delay": "0.2s", marginTop: "48px", textAlign: "left", lineHeight: "1.8" }}>
            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>1. Agreement to These Terms</h2>
              <p>
                These Terms and Conditions govern your access to and use of FloAI. By creating an account,
                connecting a store, or using the platform, you agree to these terms. If you do not agree,
                do not use FloAI.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>2. What FloAI Provides</h2>
              <p>
                FloAI is a software tool for Shopify merchants that helps automate cash-on-delivery order
                review workflows. The platform currently supports store configuration, risk scoring,
                dashboard reporting, and WhatsApp-based order confirmation workflows when properly connected
                to supported third-party services.
              </p>
              <p style={{ marginTop: "12px" }}>
                FloAI is not a marketplace, payment processor, fulfillment provider, insurance service,
                or legal compliance service.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>3. Eligibility and Account Responsibility</h2>
              <p>
                You may use FloAI only if you are authorized to act for the business or store being connected.
                You are responsible for your account, for all activity that occurs through it, and for keeping
                your login credentials and API credentials secure.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>4. Your Responsibilities</h2>
              <p>You are responsible for:</p>
              <ul style={{ paddingLeft: "20px", marginTop: "12px" }}>
                <li>Providing accurate account, store, and integration information.</li>
                <li>Ensuring you have lawful authority to access and use your Shopify, WhatsApp, and related business accounts through FloAI.</li>
                <li>Reviewing and monitoring automated actions taken on your behalf.</li>
                <li>Complying with laws and regulations applicable to your store, products, customer communications, privacy, and consumer protection obligations.</li>
                <li>Your relationship with your customers, including refunds, cancellations, shipping, taxes, disputes, and fulfillment.</li>
              </ul>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>5. Third-Party Services</h2>
              <p>
                FloAI depends on third-party services including Shopify, Meta/WhatsApp, Google authentication,
                and Supabase. Your use of those services remains subject to their own terms and policies.
                FloAI is not responsible for downtime, access restrictions, policy changes, pricing changes,
                or enforcement actions imposed by those providers.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>6. Automated Decisions and No Guarantee</h2>
              <p>
                FloAI uses rules, automation, and AI-assisted analysis to help merchants make operational
                decisions. Risk scores, recommendations, and automated message flows are decision-support tools
                only. They may be incomplete, inaccurate, or unavailable in some cases.
              </p>
              <p style={{ marginTop: "12px" }}>
                We do not guarantee that FloAI will identify every fraudulent order, prevent every return,
                improve delivery rates, or produce any specific business outcome.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>7. Acceptable Use</h2>
              <p>You may not use FloAI to:</p>
              <ul style={{ paddingLeft: "20px", marginTop: "12px" }}>
                <li>Access or manage a store or business account without authorization.</li>
                <li>Send unlawful, deceptive, abusive, or spam communications.</li>
                <li>Interfere with the operation, security, or integrity of the platform.</li>
                <li>Attempt to reverse engineer, copy, resell, or misuse the service beyond permitted use.</li>
                <li>Use customer or merchant data in a way that violates applicable law or third-party platform terms.</li>
              </ul>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>8. Data and Privacy</h2>
              <p>
                Our handling of personal and business data is described in our Privacy Policy. By using FloAI,
                you also agree to that policy.
              </p>
              <p style={{ marginTop: "12px" }}>
                You remain responsible for obtaining any customer notices, consents, or permissions required
                for your own store operations and communications.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>9. Availability and Changes</h2>
              <p>
                We may update, improve, limit, or discontinue parts of FloAI at any time. We do not promise
                uninterrupted availability, error-free operation, or compatibility with every device,
                browser, store configuration, or third-party integration.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>10. Suspension and Termination</h2>
              <p>
                We may suspend or terminate access if we reasonably believe you are violating these terms,
                using the service unlawfully, creating security risk, or exposing us or others to harm.
                You may stop using FloAI at any time.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>11. Disclaimer of Warranties</h2>
              <p>
                FloAI is provided on an "as is" and "as available" basis to the fullest extent permitted
                by applicable law. We disclaim warranties of merchantability, fitness for a particular
                purpose, non-infringement, and uninterrupted service, except where such disclaimers are
                not allowed by law.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>12. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, FloAI and its operators will not be liable for any
                indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss
                of profits, revenue, data, goodwill, customers, or business opportunities arising out of or
                related to your use of the platform.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>13. Changes to These Terms</h2>
              <p>
                We may update these terms from time to time. When we do, we will update the "Last Updated"
                date on this page. Your continued use of FloAI after updated terms are posted means you
                accept the revised terms.
              </p>
            </section>

            <section>
              <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "16px" }}>14. Contact</h2>
              <p>If you have questions about these Terms and Conditions, contact us at:</p>
              <p style={{ marginTop: "12px" }}>
                <strong>Email:</strong> support@floai.pk<br />
                <strong>Website:</strong> https://floai.pk
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <span className="landing-logo-icon">⚡</span> FloAI
            <p>AI-powered COD order verification for Pakistani Shopify stores.</p>
          </div>
          <div className="landing-footer-links">
            <div>
              <h4>Product</h4>
              <Link href="/landing#how-it-works">How It Works</Link>
              <Link href="/landing#features">Features</Link>
              <Link href="/landing#pricing">Pricing</Link>
            </div>
            <div>
              <h4>Legal</h4>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p>© 2026 FloAI. Built for 🇵🇰 Pakistan.</p>
        </div>
      </footer>
    </div>
  );
}
