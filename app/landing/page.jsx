"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

/* ── Animated counter hook ─────────────────────────────────────────────── */
function useCounter(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return { count, ref };
}

/* ── SVG Icons (inline, no deps) ──────────────────────────────────────── */
const icons = {
  shield: (
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  whatsapp: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  clock: (
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  phone: (
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  chart: (
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  history: (
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  arrow: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  check: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  x: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

/* ── Step card for "How It Works" ─────────────────────────────────────── */
function StepCard({ number, title, description, icon, delay }) {
  return (
    <div className="card landing-step reveal" style={{ "--delay": delay }}>
      <div className="landing-step-number">{number}</div>
      <div className="landing-step-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

/* ── Feature card ─────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, description, delay }) {
  return (
    <div className="card landing-feature reveal" style={{ "--delay": delay }}>
      <div className="landing-feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

/* ── Pricing card ─────────────────────────────────────────────────────── */
function PricingCard({ name, price, period, description, features, excluded, popular, delay }) {
  return (
    <div
      className={`card landing-pricing-card${popular ? " popular" : ""} reveal`}
      style={{ "--delay": delay }}
    >
      {popular && <div className="popular-badge">Most Popular</div>}
      <div className="pricing-header">
        <h3>{name}</h3>
        <p className="pricing-description">{description}</p>
        <div className="pricing-amount">
          <span className="pricing-currency">PKR</span>
          <span className="pricing-value">{price}</span>
          <span className="pricing-period">/{period}</span>
        </div>
      </div>
      <ul className="pricing-features">
        {features.map((f, i) => (
          <li key={i}><span className="pricing-check">{icons.check}</span>{f}</li>
        ))}
        {excluded && excluded.map((f, i) => (
          <li key={`ex-${i}`} className="excluded"><span className="pricing-x">{icons.x}</span>{f}</li>
        ))}
      </ul>
      <Link
        href="/"
        className={`button ${popular ? "button-primary landing-btn-glow" : "button-secondary"} landing-pricing-btn`}
      >
        Get Started {icons.arrow}
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stat1 = useCounter(40, 2000);
  const stat2 = useCounter(95, 2200);
  const stat3 = useCounter(3, 1500);

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
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <Link href="/" className="button button-primary landing-nav-cta">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge reveal" style={{ "--delay": "0.1s" }}>
            <span className="landing-hero-badge-flag" aria-hidden="true">🇵🇰</span>
            <span>Built for Pakistani Shopify Stores</span>
          </div>
          <h1 className="landing-hero-title reveal" style={{ "--delay": "0.2s" }}>
            No More Returns. No More{" "}
            <span className="landing-gradient-text">Shipping Fee Leaks</span>
          </h1>
          <p className="landing-hero-subtitle reveal" style={{ "--delay": "0.35s" }}>
            AI-powered risk scoring identifies fake orders instantly.
            Automated WhatsApp confirmations go out in seconds.
            No reply? Auto-cancelled. Your profit margins stay protected.
          </p>
          <div className="landing-hero-actions reveal" style={{ "--delay": "0.5s" }}>
            <Link href="/" className="button button-primary landing-btn-glow landing-hero-btn">
              Start Free — No Card Needed {icons.arrow}
            </Link>
            <a href="#how-it-works" className="button button-secondary landing-hero-btn">
              See How It Works
            </a>
          </div>

          {/* Animated stats */}
          <div className="landing-hero-stats reveal" style={{ "--delay": "0.65s" }}>
            <div className="landing-hero-stat" ref={stat1.ref}>
              <strong>{stat1.count}%</strong>
              <span>Fake Orders Blocked</span>
            </div>
            <div className="landing-hero-stat" ref={stat2.ref}>
              <strong>{stat2.count}%</strong>
              <span>WhatsApp Delivery Rate</span>
            </div>
            <div className="landing-hero-stat" ref={stat3.ref}>
              <strong>{stat3.count}s</strong>
              <span>Avg. Response Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem Statement ───────────────────────────────────────────── */}
      <section className="landing-section landing-problem">
        <div className="landing-section-inner">
          <h2 className="landing-section-title reveal" style={{ "--delay": "0.1s" }}>
            The COD Problem in Pakistan
          </h2>
          <p className="landing-section-subtitle reveal" style={{ "--delay": "0.2s" }}>
            Cash on Delivery makes up <strong>70%+ of all e-commerce orders</strong> in Pakistan.
            But up to <strong>40% of COD orders are fake</strong> — prank orders, wrong numbers,
            or customers who never intended to pay. Every returned package costs you
            shipping, packaging, and lost inventory.
          </p>
          <div className="landing-problem-grid">
            <div className="card landing-problem-card reveal" style={{ "--delay": "0.3s" }}>
              <div className="landing-problem-stat">Rs. 500–1500</div>
              <p>Average cost per returned COD order including shipping & handling</p>
            </div>
            <div className="card landing-problem-card reveal" style={{ "--delay": "0.4s" }}>
              <div className="landing-problem-stat">40%</div>
              <p>Of COD orders are fake or go undelivered across Pakistani e-commerce</p>
            </div>
            <div className="card landing-problem-card reveal" style={{ "--delay": "0.5s" }}>
              <div className="landing-problem-stat">0 Seconds</div>
              <p>Time it takes our AI to flag suspicious orders before shipping</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="landing-section">
        <div className="landing-section-inner">
          <h2 className="landing-section-title reveal" style={{ "--delay": "0.1s" }}>
            How It Works
          </h2>
          <p className="landing-section-subtitle reveal" style={{ "--delay": "0.2s" }}>
            Three simple steps. Fully automated. Zero manual work.
          </p>
          <div className="landing-steps-grid">
            <StepCard
              number="01"
              title="Order Placed"
              description="Customer places a COD order on your Shopify store. Our system is instantly notified via webhook."
              icon={icons.chart}
              delay="0.3s"
            />
            <StepCard
              number="02"
              title="AI Risk Check + WhatsApp Sent"
              description="We score the order against 20+ risk signals (fake phones, repeat cancellers, odd hours, filler addresses). A WhatsApp confirmation message is sent instantly."
              icon={icons.shield}
              delay="0.4s"
            />
            <StepCard
              number="03"
              title="Confirm or Auto-Cancel"
              description="Customer replies YES → order confirmed. Replies NO → cancelled. No reply in 20 minutes → auto-cancelled. You only ship real orders."
              icon={icons.whatsapp}
              delay="0.5s"
            />
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="landing-section">
        <div className="landing-section-inner">
          <h2 className="landing-section-title reveal" style={{ "--delay": "0.1s" }}>
            Everything You Need to Eliminate Fake Orders
          </h2>
          <p className="landing-section-subtitle reveal" style={{ "--delay": "0.2s" }}>
            Purpose-built for the Pakistani e-commerce market. Every feature designed to save you money.
          </p>
          <div className="landing-features-grid">
            <FeatureCard
              icon={icons.shield}
              title="AI Risk Scoring"
              description="20+ risk signals calibrated for Pakistan — repeated digits, landline detection, filler addresses, order flooding, and more. Every order gets a 0-100 risk score."
              delay="0.25s"
            />
            <FeatureCard
              icon={icons.whatsapp}
              title="Instant WhatsApp Confirmation"
              description="Automated WhatsApp template messages sent within seconds of order placement. Uses Meta's official Cloud API for 95%+ delivery rates."
              delay="0.3s"
            />
            <FeatureCard
              icon={icons.clock}
              title="Auto-Cancel No-Reply"
              description="No response within your configured wait time? The order is automatically cancelled on Shopify. No manual follow-up needed."
              delay="0.35s"
            />
            <FeatureCard
              icon={icons.phone}
              title="PK Phone Validation"
              description="Validates against all Pakistani carrier prefixes — Jazz, Zong, Telenor, Ufone, SCO. Detects landlines, repeated digits, and sequential patterns."
              delay="0.4s"
            />
            <FeatureCard
              icon={icons.history}
              title="Order History Analysis"
              description="Tracks repeat offenders. If a phone number has a 70%+ cancel rate or multiple auto-cancels, future orders are flagged automatically."
              delay="0.45s"
            />
            <FeatureCard
              icon={icons.chart}
              title="Real-Time Dashboard"
              description="Monitor all orders, risk scores, confirmation rates, and fake order statistics in a beautiful live dashboard."
              delay="0.5s"
            />
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="landing-section">
        <div className="landing-section-inner">
          <h2 className="landing-section-title reveal" style={{ "--delay": "0.1s" }}>
            Simple, Transparent Pricing
          </h2>
          <p className="landing-section-subtitle reveal" style={{ "--delay": "0.2s" }}>
            Start free. Scale as you grow. Cancel anytime.
          </p>
          <div className="landing-pricing-grid">
            <PricingCard
              name="Starter"
              price="1,200"
              period="month"
              description="Perfect for new stores testing the waters"
              features={[
                "Up to 100 orders/month",
                "AI risk scoring",
                "WhatsApp confirmations",
                "Auto-cancel on no reply",
                "Basic dashboard",
              ]}
              excluded={[
                "Priority support",
                "Custom wait times",
                "API access",
              ]}
              delay="0.3s"
            />
            <PricingCard
              name="Pro"
              price="2,000"
              period="month"
              description="For growing stores with serious COD volume"
              features={[
                "Up to 2,000 orders/month",
                "AI risk scoring",
                "WhatsApp confirmations",
                "Auto-cancel on no reply",
                "Full analytics dashboard",
                "Custom wait times",
                "Priority WhatsApp support",
              ]}
              excluded={[
                "API access",
              ]}
              popular
              delay="0.35s"
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="landing-section landing-cta-section">
        <div className="landing-section-inner">
          <div className="card landing-cta-card reveal" style={{ "--delay": "0.1s" }}>
            <h2>Ready to Stop Shipping to Fake Customers?</h2>
            <p>
              Join hundreds of Pakistani Shopify store owners who are saving
              thousands every month with automated COD order confirmation.
            </p>
            <Link href="/" className="button button-primary landing-btn-glow landing-hero-btn">
              Start Free Today {icons.arrow}
            </Link>
          </div>
        </div>
      </section>

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
              <a href="#how-it-works">How It Works</a>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
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
