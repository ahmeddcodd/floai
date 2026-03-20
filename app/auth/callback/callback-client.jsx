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

function readHashParams() {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  const rawHash = window.location.hash || "";
  const hash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  return new URLSearchParams(hash);
}

function clearCallbackHash() {
  if (typeof window === "undefined" || !window.location.hash) {
    return;
  }
  const cleanUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, document.title, cleanUrl);
}

function readPkceExchangeState(code) {
  if (typeof window === "undefined" || !code) {
    return "";
  }
  try {
    return window.sessionStorage.getItem(`oauth-pkce-exchange:${code}`) || "";
  } catch {
    return "";
  }
}

function writePkceExchangeState(code, state) {
  if (typeof window === "undefined" || !code) {
    return;
  }
  try {
    if (!state) {
      window.sessionStorage.removeItem(`oauth-pkce-exchange:${code}`);
      return;
    }
    window.sessionStorage.setItem(`oauth-pkce-exchange:${code}`, state);
  } catch {
    // ignore storage errors
  }
}

async function waitForSession({ attempts = 6, delayMs = 150 } = {}) {
  for (let index = 0; index < attempts; index += 1) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      return session;
    }

    if (index < attempts - 1) {
      await new Promise((resolve) => {
        setTimeout(resolve, delayMs);
      });
    }
  }

  return null;
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
      const next = resolveNextPath(searchParams.get("next"));
      const code = searchParams.get("code");
      const hashParams = readHashParams();
      const errorDescription =
        searchParams.get("error_description") || hashParams.get("error_description");
      const errorCode = searchParams.get("error") || hashParams.get("error");

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

        if (code) {
          const exchangeState = readPkceExchangeState(code);

          // In React Strict Mode (dev), callback effects can run more than once.
          // If another render already started/finished the same code exchange, wait for its session.
          if (exchangeState === "started" || exchangeState === "done") {
            const recoveredSession = await waitForSession({ attempts: 40, delayMs: 150 });
            if (recoveredSession) {
              if (!cancelled) {
                router.replace(next);
              }
              return;
            }
          }

          writePkceExchangeState(code, "started");
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            // A parallel callback attempt may have completed exchange first; allow enough time to recover.
            const recoveredSession = await waitForSession({ attempts: 40, delayMs: 150 });
            if (!recoveredSession) {
              writePkceExchangeState(code, "");
              throw exchangeError;
            }
            writePkceExchangeState(code, "done");
          } else {
            writePkceExchangeState(code, "done");
          }
        } else {
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          // Fallback for implicit-hash callbacks when a project was previously configured that way.
          if (accessToken && refreshToken) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (setSessionError) {
              throw setSessionError;
            }
            clearCallbackHash();
          }
        }

        const session = await waitForSession({ attempts: 8, delayMs: 150 });
        if (!session) {
          throw new Error(
            "Sign in could not be completed. Check Supabase redirect URLs and try again."
          );
        }

        if (!cancelled) {
          router.replace(next);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err?.message || "Unable to complete sign in.";
          if (/PKCE code verifier not found/i.test(message)) {
            setError(
              "Sign in expired before callback completion. Please start Google sign-in again from setup."
            );
            return;
          }
          setError(message);
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
