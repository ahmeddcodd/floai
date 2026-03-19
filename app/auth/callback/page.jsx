import { Suspense } from "react";
import AuthCallbackClient from "./callback-client";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="page">
          <section className="card" style={{ textAlign: "center", padding: "80px 40px" }}>
            <div className="friendly-loader" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="friendly-loader-title">Completing sign in...</p>
            <p className="help-text">Please wait while we securely connect your account.</p>
          </section>
        </main>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
