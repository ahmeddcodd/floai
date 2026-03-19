"use client";

import { useEffect, useRef, useState } from "react";
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
  const completedRef = useRef(false);

  useEffect(() => {
    if (completedRef.current) {
      return;
    }
    completedRef.current = true;

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
        const {
          data: { session: existingSession },
        } = await supabase.auth.getSession();

        if (existingSession) {
          if (!cancelled) {
            router.replace(next);
          }
          return;
        }

        if (!code) {
          throw new Error("Sign in could not be completed. Please try again.");
        }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          // Strict Mode in development can run this effect twice, so an already-used
          // OAuth code should still continue if a session is now present.
          const {
            data: { session: recoveredSession },
          } = await supabase.auth.getSession();
          if (!recoveredSession) {
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
      <section className="card auth-card">
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
            <h1 className="section-title callback-title">Sign-in problem</h1>
            <p className="notice error-notice">{error}</p>
            <div className="actions callback-actions">
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
