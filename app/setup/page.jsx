"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import SiteFooter from "../components/SiteFooter";
import UserAccountBadge from "../components/UserAccountBadge";
import { API_BASE_URL, META_APP_ID, META_CONFIG_ID } from "../../lib/config";
import { buildApiUrl, createAuthHeaders, readErrorMessage } from "../../lib/api";
import { AUTH_CALLBACK_PATH, buildDashboardPath, SETUP_PATH } from "../../lib/routes";
import { SITE_NAME } from "../../lib/site";

function normalizeDomain(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const withScheme = raw.match(/^https?:\/\//i) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    return url.hostname.replace(/^www\./i, "");
  } catch {
    return raw
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .trim();
  }
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function deriveMerchantId(domain, storeName) {
  const base = domain ? domain.replace(/[^a-zA-Z0-9-_.]/g, "-") : slugify(storeName);
  return base || `merchant-${Math.random().toString(36).slice(2, 8)}`;
}

export default function SetupPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    storeName: "",
    storeUrl: "",
    shopifyToken: "",
    waitMinutes: "20",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [googleSigningIn, setGoogleSigningIn] = useState(false);
  const [fbReady, setFbReady] = useState(false);
  const [waConnected, setWaConnected] = useState(false);
  const [waData, setWaData] = useState(null); // { phone_number_id, waba_id }
  const [waAuthCode, setWaAuthCode] = useState(null); // FB.login auth code
  const [waConnecting, setWaConnecting] = useState(false);
  const initialAuthCheckCompletedRef = useRef(false);
  const waConnectTimeoutRef = useRef(null);

  const resolveSessionAndMerchant = useCallback(
    async ({ session: knownSession } = {}) => {
      const session =
        knownSession ??
        (
          await supabase.auth.getSession()
        ).data.session;
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (!currentUser || !session) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(buildApiUrl("/api/merchants/me"), {
          headers: createAuthHeaders(session.access_token),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.merchant_id) {
            if (typeof window !== "undefined") {
              localStorage.setItem("merchant_id", data.merchant_id);
            }
            router.replace(buildDashboardPath(data.merchant_id));
            return;
          }
        }
      } catch {
        // No merchant found yet, continue with setup.
      }

      setLoading(false);
    },
    [router]
  );

  // 1. Check Auth state
  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      await resolveSessionAndMerchant();
      initialAuthCheckCompletedRef.current = true;
    };

    void getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) {
        return;
      }

      if (!session) {
        if (event === "SIGNED_OUT") {
          setUser(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("merchant_id");
          }
          setLoading(false);
        }
        return;
      }

      if (event === "TOKEN_REFRESHED") {
        setUser(session.user);
        return;
      }

      // INITIAL_SESSION can fire after getSession() and also when tab focus changes.
      // Avoid re-running setup loading flow for those non-user-initiated events.
      if (event === "INITIAL_SESSION" && initialAuthCheckCompletedRef.current) {
        setUser(session.user);
        return;
      }

      void resolveSessionAndMerchant({ session });
    });


    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [resolveSessionAndMerchant]);

  // Facebook SDK initialization + Embedded Signup listener
  useEffect(() => {
    if (!META_APP_ID) return;

    const initializeFacebookSdk = () => {
      window.FB.init({
        appId: META_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v22.0",
      });
      setFbReady(true);
    };

    window.fbAsyncInit = initializeFacebookSdk;

    if (window.FB) {
      initializeFacebookSdk();
    }

    const handleMessage = (event) => {
      if (!event.origin.endsWith("facebook.com")) return;
      try {
        const payload =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (payload?.type === "WA_EMBEDDED_SIGNUP") {
          const eventName = String(payload.event || "").toUpperCase();
          const details =
            typeof payload.data === "string" ? JSON.parse(payload.data) : payload.data;

          if (eventName === "FINISH" && details) {
            const phoneNumberId = String(details?.phone_number_id || "").trim();
            const wabaId = String(details?.waba_id || "").trim();
            if (!phoneNumberId || !wabaId) {
              setWaConnecting(false);
              setWaConnected(false);
              setWaData(null);
              setError("WhatsApp signup finished, but required account details were missing. Please try again.");
              return;
            }
            setWaConnected(true);
            setWaData({
              phone_number_id: phoneNumberId,
              waba_id: wabaId,
            });
            setWaConnecting(false);
          } else if (eventName === "CANCEL" || eventName === "ERROR") {
            setWaConnecting(false);
            setWaConnected(false);
            setWaData(null);
          }
        }
      } catch {
        // non-JSON message, ignore
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!waConnecting) {
      if (waConnectTimeoutRef.current) {
        clearTimeout(waConnectTimeoutRef.current);
        waConnectTimeoutRef.current = null;
      }
      return;
    }

    waConnectTimeoutRef.current = setTimeout(() => {
      setWaConnecting(false);
      setWaConnected(false);
      setWaData(null);
      setError("WhatsApp signup timed out before completion details were received. Please try Connect WhatsApp again.");
    }, 45000);

    return () => {
      if (waConnectTimeoutRef.current) {
        clearTimeout(waConnectTimeoutRef.current);
        waConnectTimeoutRef.current = null;
      }
    };
  }, [waConnecting]);

  const launchWhatsAppSignup = () => {
    setError("");
    if (!META_CONFIG_ID) {
      setError("WhatsApp signup is not configured. Please set NEXT_PUBLIC_META_CONFIG_ID.");
      return;
    }
    if (!window.FB) {
      setError("Facebook SDK not loaded yet. Please wait a moment and try again.");
      return;
    }
    window.FB.login(
      (response) => {
        if (response?.authResponse?.code) {
          setWaAuthCode(response.authResponse.code);
          setWaConnecting(true);
        } else {
          setWaConnecting(false);
          setWaConnected(false);
          setWaData(null);
        }
      },
      {
        config_id: META_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: { setup: {} },
      }
    );
  };

  const normalizedDomain = useMemo(
    () => normalizeDomain(form.storeUrl),
    [form.storeUrl]
  );
  const merchantId = useMemo(
    () => deriveMerchantId(normalizedDomain, form.storeName),
    [normalizedDomain, form.storeName]
  );
  const merchantIdPreviewReady = Boolean(normalizedDomain || form.storeName.trim());

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleSigningIn(true);

    // Keep redirect on the exact same origin that initiated OAuth so PKCE verifier storage matches.
    const redirectOrigin = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectOrigin}${AUTH_CALLBACK_PATH}?next=${encodeURIComponent(SETUP_PATH)}`,
        scopes: "openid email profile",
        queryParams: {
          prompt: "select_account",
        },
      },
    });
    if (error) {
      setGoogleSigningIn(false);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (typeof window !== "undefined") {
        localStorage.removeItem("merchant_id");
      }
      await supabase.auth.signOut();
    } finally {
      setTimeout(() => setSigningOut(false), 500);
    }
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Please sign in again.");
      return;
    }

    const payload = {
      user_id: user.id,
      merchant_id: merchantId,
      store_name: form.storeName.trim(),
      shopify_domain: normalizedDomain,
      shopify_token: form.shopifyToken.trim(),
      wait_minutes: Number(form.waitMinutes || 20),
    };

    if (!payload.store_name || !payload.shopify_domain || !payload.shopify_token) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(buildApiUrl("/api/merchants/register"), {
        method: "POST",
        headers: createAuthHeaders(session.access_token, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Unable to register merchant."));
      }

      // After registration, send WhatsApp credentials if connected
      if (waAuthCode && waData?.phone_number_id && waData?.waba_id) {
        try {
          const waRes = await fetch(
            buildApiUrl(`/api/merchants/${encodeURIComponent(merchantId)}/whatsapp`),
            {
              method: "POST",
              headers: createAuthHeaders(session.access_token, {
                "Content-Type": "application/json",
              }),
              body: JSON.stringify({
                code: waAuthCode,
                phone_number_id: waData.phone_number_id,
                waba_id: waData.waba_id,
              }),
            }
          );
          if (!waRes.ok) {
            console.error("WhatsApp credential storage failed:", await waRes.text());
          }
        } catch (waErr) {
          console.error("WhatsApp connect error (non-blocking):", waErr);
        }
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("merchant_id", merchantId);
      }

      router.replace(buildDashboardPath(merchantId));
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="page">
        <header className="header reveal" style={{ "--delay": "0.1s" }}>
          <div className="brand">
            <h1>{SITE_NAME}</h1>
          </div>
        </header>
        <div className="card auth-card auth-card-loading">
          <div className="friendly-loader" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="friendly-loader-title">Getting your dashboard ready...</p>
          <p className="help-text">Just a moment while we prepare your workspace.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header reveal" style={{ "--delay": "0.1s" }}>
        <div className="brand">
          <h1>{SITE_NAME}</h1>
          <p>Register your Shopify store and track COD confirmations in one place.</p>
        </div>
        <div className="header-tools">
          <UserAccountBadge user={user} />
          {user && (
            <button
              onClick={handleLogout}
              className="button signout-button"
              disabled={signingOut}
            >
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          )}
        </div>
      </header>

      {!user ? (
        <section
          className="card reveal auth-card auth-signin-card"
          style={{ "--delay": "0.2s" }}
        >
          <h2 className="section-title">Sign in to continue</h2>
          <p className="help-text signin-help">
            Please sign in with your Google account to manage your store and COD orders.
          </p>
          <button
            className="button button-primary"
            onClick={handleGoogleLogin}
            disabled={googleSigningIn}
          >
            <span className="google-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-1.9 2.9l3 2.3c1.7-1.6 2.7-3.9 2.7-6.8 0-.6-.1-1.2-.2-1.8H12z" />
                <path fill="#34A853" d="M12 22c2.4 0 4.5-.8 6-2.1l-3-2.3c-.8.5-1.9.8-3 .8-2.3 0-4.3-1.6-5-3.8H3.9v2.4A10 10 0 0 0 12 22z" />
                <path fill="#4A90E2" d="M7 14.6c-.2-.5-.3-1-.3-1.6s.1-1.1.3-1.6V9H3.9A10 10 0 0 0 3 13c0 1.4.3 2.8.9 4l3.1-2.4z" />
                <path fill="#FBBC05" d="M12 7.6c1.3 0 2.4.4 3.3 1.2l2.4-2.4C16.5 5.2 14.4 4.4 12 4.4A10 10 0 0 0 3.9 9L7 11.4c.7-2.2 2.7-3.8 5-3.8z" />
              </svg>
            </span>
            {googleSigningIn ? "Redirecting to Google..." : "Sign in with Google"}
          </button>
          {error ? <p className="notice error-notice signin-error">{error}</p> : null}
        </section>
      ) : (
        <section
          className="card reveal"
          style={{ "--delay": "0.2s" }}
        >
          <div className="split">
            <div className="info-section">
              <h2 className="section-title">Store setup</h2>
              <p className="help-text">
                Welcome, <strong>{user.email}</strong>.
                We will save your store configuration and link it to your account.
              </p>
              <div className="panel merchant-id-panel">
                <strong>Merchant ID</strong>
                <p className="merchant-id-value">
                  {merchantIdPreviewReady
                    ? merchantId
                    : "Will be generated from your store URL after you start filling the form."}
                </p>
                <p className="help-text">
                  This ID is saved on registration and used for Shopify webhook mapping.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="field">
                <label htmlFor="storeName">Store name</label>
                <input
                  id="storeName"
                  value={form.storeName}
                  onChange={handleChange("storeName")}
                  placeholder="GlowCart Pakistan"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="storeUrl">Store URL</label>
                <input
                  id="storeUrl"
                  value={form.storeUrl}
                  onChange={handleChange("storeUrl")}
                  placeholder="your-store.myshopify.com"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="shopifyToken">Shopify token</label>
                <input
                  id="shopifyToken"
                  type="password"
                  value={form.shopifyToken}
                  onChange={handleChange("shopifyToken")}
                  placeholder="shpat_..."
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="waitMinutes">Wait time (minutes)</label>
                <input
                  id="waitMinutes"
                  type="number"
                  min="1"
                  value={form.waitMinutes}
                  onChange={handleChange("waitMinutes")}
                  required
                />
              </div>

              <div className="api-info form-span-full">
                <span className="api-label">Connected API Endpoint</span>
                <code className="api-url">{API_BASE_URL}</code>
              </div>

              {/* ── WhatsApp Embedded Signup ── */}
              {META_APP_ID && META_CONFIG_ID && (
                <div className="field form-span-full">
                  <label>Connect to send automated message to clients.</label>
                  <div className="wa-connect-row">
                    {waConnected ? (
                      <div className="wa-connected-card">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        <div>
                          <strong>WhatsApp Connected</strong>
                          {waData && (
                            <p className="wa-connected-meta">
                              Phone ID: {waData.phone_number_id} &bull; WABA: {waData.waba_id}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={launchWhatsAppSignup}
                        disabled={!fbReady || waConnecting}
                        className="button wa-connect-button"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {!fbReady ? "Loading SDK..." : waConnecting ? "Finishing..." : "Connect WhatsApp"}
                      </button>
                    )}
                  </div>
                  <p className="help-text wa-help">
                    Connect your WhatsApp Business account to send automated order confirmations from your own number.
                  </p>
                </div>
              )}

              <div className="actions form-actions">
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save and open dashboard"}
                </button>
              </div>
            </form>
          </div>
          {error ? <p className="notice error-notice">{error}</p> : null}
        </section>
      )}

      {signingOut ? (
        <div className="feedback-overlay">
          <div className="feedback-card">
            <div className="friendly-loader" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="friendly-loader-title">Signing you out safely...</p>
          </div>
        </div>
      ) : null}

      <SiteFooter compact transparent />
    </main>
  );
}
