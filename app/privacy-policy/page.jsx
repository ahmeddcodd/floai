"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ── SVG Icons ────────────────────────────────────────────────────────── */
const icons = {
  arrowLeft: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

export default function PrivacyPolicy() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
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

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main className="landing-section" style={{ paddingTop: '140px' }}>
        <div className="landing-section-inner" style={{ maxWidth: '800px' }}>
          <div className="reveal" style={{ "--delay": "0.1s" }}>
            <div className="landing-feature-icon" style={{ margin: '0 auto 24px' }}>
              {icons.shield}
            </div>
            <h1 className="landing-section-title">Privacy Policy</h1>
            <p className="landing-section-subtitle">
              Last Updated: March 16, 2026
            </p>
          </div>

          <div className="card reveal" style={{ "--delay": "0.2s", marginTop: '48px', textAlign: 'left', lineHeight: '1.8' }}>
            <section style={{ marginBottom: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>1. Introduction</h2>
              <p>
                Welcome to FloAI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring that your personal and business data is handled securely and transparently. This Privacy Policy explains how we collect, use, and share information when you use our COD (Cash on Delivery) automation platform.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>2. Information We Collect</h2>
              <p>To provide our services, we collect the following types of information:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
                <li><strong>Account Information:</strong> When you sign in via Google, we receive your email address and basic profile information.</li>
                <li><strong>Store Configuration:</strong> We collect your Shopify store name, store URL, and Shopify Admin API access tokens to monitor and manage your orders.</li>
                <li><strong>WhatsApp Business Data:</strong> If you connect your WhatsApp Business account via Meta's Embedded Signup, we receive your Phone Number ID and WhatsApp Business Account (WABA) ID.</li>
                <li><strong>Order Data:</strong> We process order details from your Shopify store (phone numbers, addresses, order values) to perform AI risk scoring and send confirmation messages.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
                <li>To provide automated COD order verification and risk scoring.</li>
                <li>To send automated WhatsApp confirmation messages on your behalf.</li>
                <li>To update order statuses (confirm or cancel) in your Shopify admin panel.</li>
                <li>To provide you with a dashboard to monitor your store's performance.</li>
                <li>To improve our AI risk detection algorithms.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>4. Data Sharing and Third Parties</h2>
              <p>We do not sell your data. We share information only with service providers necessary to operate our platform:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
                <li><strong>Meta (Facebook/WhatsApp):</strong> To send messages via the WhatsApp Business API.</li>
                <li><strong>Shopify:</strong> To synchronize order data and perform actions on your store.</li>
                <li><strong>Supabase:</strong> For secure database storage and authentication.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data, including encryption of sensitive API tokens and secure authentication via Google OAuth and Supabase.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>6. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your account and store information at any time. You can disconnect your Shopify store or WhatsApp account from our dashboard. For data deletion requests, please contact us at support@floai.pk.
              </p>
            </section>

            <section>
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please reach out to us:
              </p>
              <p style={{ marginTop: '12px' }}>
                <strong>Email:</strong> support@floai.pk<br />
                <strong>Website:</strong> https://floai.pk
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
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
