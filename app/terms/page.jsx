import LegalPageLayout from "../components/LegalPageLayout";
import LegalSection from "../components/LegalSection";
import { SITE_NAME, SITE_SUPPORT_EMAIL, SITE_URL } from "../../lib/site";

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms and Conditions" lastUpdated="March 19, 2026" maxWidth="860px">
      <LegalSection title="1. Agreement to These Terms">
        <p>
          These Terms and Conditions govern your access to and use of {SITE_NAME}. By creating an account,
          connecting a store, or using the platform, you agree to these terms. If you do not agree,
          do not use {SITE_NAME}.
        </p>
      </LegalSection>

      <LegalSection title={`2. What ${SITE_NAME} Provides`}>
        <p>
          {SITE_NAME} is a software tool for Shopify merchants that helps automate cash-on-delivery order
          review workflows. The platform currently supports store configuration, risk scoring,
          dashboard reporting, and WhatsApp-based order confirmation workflows when properly connected
          to supported third-party services.
        </p>
        <p className="legal-block-gap">
          {SITE_NAME} is not a marketplace, payment processor, fulfillment provider, insurance service,
          or legal compliance service.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility and Account Responsibility">
        <p>
          You may use {SITE_NAME} only if you are authorized to act for the business or store being connected.
          You are responsible for your account, for all activity that occurs through it, and for keeping
          your login credentials and API credentials secure.
        </p>
      </LegalSection>

      <LegalSection title="4. Your Responsibilities">
        <p>You are responsible for:</p>
        <ul className="legal-list">
          <li>Providing accurate account, store, and integration information.</li>
          <li>Ensuring you have lawful authority to access and use your Shopify, WhatsApp, and related business accounts through {SITE_NAME}.</li>
          <li>Reviewing and monitoring automated actions taken on your behalf.</li>
          <li>Complying with laws and regulations applicable to your store, products, customer communications, privacy, and consumer protection obligations.</li>
          <li>Your relationship with your customers, including refunds, cancellations, shipping, taxes, disputes, and fulfillment.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Third-Party Services">
        <p>
          {SITE_NAME} depends on third-party services including Shopify, Meta/WhatsApp, Google authentication,
          and Supabase. Your use of those services remains subject to their own terms and policies.
          {SITE_NAME} is not responsible for downtime, access restrictions, policy changes, pricing changes,
          or enforcement actions imposed by those providers.
        </p>
      </LegalSection>

      <LegalSection title="6. Automated Decisions and No Guarantee">
        <p>
          {SITE_NAME} uses rules, automation, and AI-assisted analysis to help merchants make operational
          decisions. Risk scores, recommendations, and automated message flows are decision-support tools
          only. They may be incomplete, inaccurate, or unavailable in some cases.
        </p>
        <p className="legal-block-gap">
          We do not guarantee that {SITE_NAME} will identify every fraudulent order, prevent every return,
          improve delivery rates, or produce any specific business outcome.
        </p>
      </LegalSection>

      <LegalSection title="7. Acceptable Use">
        <p>You may not use {SITE_NAME} to:</p>
        <ul className="legal-list">
          <li>Access or manage a store or business account without authorization.</li>
          <li>Send unlawful, deceptive, abusive, or spam communications.</li>
          <li>Interfere with the operation, security, or integrity of the platform.</li>
          <li>Attempt to reverse engineer, copy, resell, or misuse the service beyond permitted use.</li>
          <li>Use customer or merchant data in a way that violates applicable law or third-party platform terms.</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Data and Privacy">
        <p>
          Our handling of personal and business data is described in our Privacy Policy. By using {SITE_NAME},
          you also agree to that policy.
        </p>
        <p className="legal-block-gap">
          You remain responsible for obtaining any customer notices, consents, or permissions required
          for your own store operations and communications.
        </p>
      </LegalSection>

      <LegalSection title="9. Availability and Changes">
        <p>
          We may update, improve, limit, or discontinue parts of {SITE_NAME} at any time. We do not promise
          uninterrupted availability, error-free operation, or compatibility with every device,
          browser, store configuration, or third-party integration.
        </p>
      </LegalSection>

      <LegalSection title="10. Suspension and Termination">
        <p>
          We may suspend or terminate access if we reasonably believe you are violating these terms,
          using the service unlawfully, creating security risk, or exposing us or others to harm.
          You may stop using {SITE_NAME} at any time.
        </p>
      </LegalSection>

      <LegalSection title="11. Disclaimer of Warranties">
        <p>
          {SITE_NAME} is provided on an "as is" and "as available" basis to the fullest extent permitted
          by applicable law. We disclaim warranties of merchantability, fitness for a particular
          purpose, non-infringement, and uninterrupted service, except where such disclaimers are
          not allowed by law.
        </p>
      </LegalSection>

      <LegalSection title="12. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, {SITE_NAME} and its operators will not be liable for any
          indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss
          of profits, revenue, data, goodwill, customers, or business opportunities arising out of or
          related to your use of the platform.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes to These Terms">
        <p>
          We may update these terms from time to time. When we do, we will update the "Last Updated"
          date on this page. Your continued use of {SITE_NAME} after updated terms are posted means you
          accept the revised terms.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact" last>
        <p>If you have questions about these Terms and Conditions, contact us at:</p>
        <p className="legal-block-gap">
          <strong>Email:</strong> {SITE_SUPPORT_EMAIL}<br />
          <strong>Website:</strong> {SITE_URL}
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
