import LegalPageLayout from "../components/LegalPageLayout";
import LegalSection from "../components/LegalSection";
import { SITE_NAME, SITE_SUPPORT_EMAIL, SITE_URL } from "../../lib/site";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="March 16, 2026" maxWidth="800px">
      <LegalSection title="1. Introduction">
        <p>
          Welcome to {SITE_NAME} ("we," "our," or "us"). We are committed to protecting your privacy and ensuring that your personal and business data is handled securely and transparently. This Privacy Policy explains how we collect, use, and share information when you use our COD (Cash on Delivery) automation platform.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>To provide our services, we collect the following types of information:</p>
        <ul style={{ paddingLeft: "20px", marginTop: "12px" }}>
          <li><strong>Account Information:</strong> When you sign in via Google, we receive your email address and basic profile information.</li>
          <li><strong>Store Configuration:</strong> We collect your Shopify store name, store URL, and Shopify Admin API access tokens to monitor and manage your orders.</li>
          <li><strong>WhatsApp Business Data:</strong> If you connect your WhatsApp Business account via Meta's Embedded Signup, we receive your Phone Number ID and WhatsApp Business Account (WABA) ID.</li>
          <li><strong>Order Data:</strong> We process order details from your Shopify store (phone numbers, addresses, order values) to perform AI risk scoring and send confirmation messages.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use the collected information for the following purposes:</p>
        <ul style={{ paddingLeft: "20px", marginTop: "12px" }}>
          <li>To provide automated COD order verification and risk scoring.</li>
          <li>To send automated WhatsApp confirmation messages on your behalf.</li>
          <li>To update order statuses (confirm or cancel) in your Shopify admin panel.</li>
          <li>To provide you with a dashboard to monitor your store's performance.</li>
          <li>To improve our AI risk detection algorithms.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Data Sharing and Third Parties">
        <p>We do not sell your data. We share information only with service providers necessary to operate our platform:</p>
        <ul style={{ paddingLeft: "20px", marginTop: "12px" }}>
          <li><strong>Meta (Facebook/WhatsApp):</strong> To send messages via the WhatsApp Business API.</li>
          <li><strong>Shopify:</strong> To synchronize order data and perform actions on your store.</li>
          <li><strong>Supabase:</strong> For secure database storage and authentication.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Data Security">
        <p>
          We implement industry-standard security measures to protect your data, including encryption of sensitive API tokens and secure authentication via Google OAuth and Supabase.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <p>
          You have the right to access, update, or delete your account and store information at any time. You can disconnect your Shopify store or WhatsApp account from our dashboard. For data deletion requests, please contact us at {SITE_SUPPORT_EMAIL}.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact Us" last>
        <p>
          If you have any questions about this Privacy Policy or our data practices, please reach out to us:
        </p>
        <p style={{ marginTop: "12px" }}>
          <strong>Email:</strong> {SITE_SUPPORT_EMAIL}<br />
          <strong>Website:</strong> {SITE_URL}
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
