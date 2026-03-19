"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { HOME_PATH, SETUP_PATH } from "../../../lib/routes";

function resolveNextPath(next) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return SETUP_PATH;
  }

  return next;
}

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const finishSignIn = async () => {
      const code = searchParams.get("code");
      const next = resolveNextPath(searchParams.get("next"));
      const errorDescription = searchParams.get("error_description");
      const errorCode = searchParams.get("error");

      if (errorDescription || errorCode) {
        if (!cancelled) {
          setError(errorDescription || errorCode || "Unable to complete sign in.");
        }
        return;
      }

      try {
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("Sign in could not be completed. Please try again.");
        }

        if (!cancelled) {
          router.replace(next);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to complete sign in.");
        }
      }
    };

    void finishSignIn();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="page">
      <section className="card" style={{ textAlign: "center", padding: "80px 40px" }}>
        {!error ? (
          <>
            <div className="friendly-loader" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="friendly-loader-title">Completing sign in...</p>
            <p className="help-text">Please wait while we securely connect your account.</p>
          </>
        ) : (
          <>
            <h1 className="section-title" style={{ marginBottom: "16px" }}>Sign-in problem</h1>
            <p className="notice error-notice">{error}</p>
            <div className="actions" style={{ justifyContent: "center", marginTop: "24px" }}>
              <Link href={SETUP_PATH} className="button button-primary">
                Back to setup
              </Link>
              <Link href={HOME_PATH} className="button button-secondary">
                Back to home
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
