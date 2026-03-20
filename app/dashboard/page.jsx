"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import SiteFooter from "../components/SiteFooter";
import UserAccountBadge from "../components/UserAccountBadge";
import { buildApiUrl, createAuthHeaders, readErrorMessage } from "../../lib/api";
import { buildDashboardPath, SETUP_PATH } from "../../lib/routes";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function formatFlags(flags) {
  if (!flags || !Array.isArray(flags) || flags.length === 0) return "-";
  return flags.join(", ");
}

async function getStableSession({ attempts = 4, delayMs = 120 } = {}) {
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

export default function DashboardPage() {
  const router = useRouter();
  const [merchantId, setMerchantId] = useState("");
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState(null);
  const [merchantSourceResolved, setMerchantSourceResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const session = await getStableSession();
      if (session) {
        if (!cancelled) {
          setUser(session.user);
        }
        return;
      }

      const {
        data: { session: refreshedSession },
      } = await supabase.auth.refreshSession();

      if (refreshedSession) {
        if (!cancelled) {
          setUser(refreshedSession.user);
        }
        return;
      }

      if (!session) {
        if (!cancelled) {
          router.replace(SETUP_PATH);
        }
        return;
      }
    };

    void checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) {
        return;
      }

      if (event === "SIGNED_OUT") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("merchant_id");
        }
        router.replace(SETUP_PATH);
        return;
      }

      if (session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const param = new URLSearchParams(window.location.search).get("merchant_id");
    if (param) {
      setMerchantId(param);
      localStorage.setItem("merchant_id", param);
    } else {
      const stored = localStorage.getItem("merchant_id");
      if (stored) {
        setMerchantId(stored);
      }
    }
    setMerchantSourceResolved(true);
  }, []);

  useEffect(() => {
    if (!merchantSourceResolved || merchantId) {
      return;
    }

    let cancelled = false;

    const resolveMerchantFromAccount = async () => {
      const session = await getStableSession();

      if (!session) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(buildApiUrl("/api/merchants/me"), {
          headers: createAuthHeaders(session.access_token),
        });

        if (!response.ok) {
          throw new Error("Missing merchant.");
        }

        const data = await response.json();
        if (!data?.merchant_id) {
          throw new Error("Missing merchant.");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("merchant_id", data.merchant_id);
        }
        if (!cancelled) {
          setMerchantId(data.merchant_id);
          router.replace(buildDashboardPath(data.merchant_id));
        }
      } catch {
        if (!cancelled) {
          setError("Unable to verify merchant profile right now. Please try again.");
          setLoading(false);
        }
      }
    };

    void resolveMerchantFromAccount();

    return () => {
      cancelled = true;
    };
  }, [merchantId, merchantSourceResolved, router]);

  const loadDashboardData = useCallback(async ({ showLoading = true } = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !merchantId) {
      if (showLoading) {
        setLoading(false);
      }
      return;
    }

    if (showLoading) {
      setLoading(true);
      setError("");
    }

    try {
      const headers = createAuthHeaders(session.access_token);

      const [ordersRes, statsRes] = await Promise.all([
        fetch(buildApiUrl(`/api/merchants/${encodeURIComponent(merchantId)}/orders?limit=50`), { headers }),
        fetch(buildApiUrl(`/api/merchants/${encodeURIComponent(merchantId)}/stats`), { headers }),
      ]);

      if (!ordersRes.ok) throw new Error(await readErrorMessage(ordersRes, "Unable to load orders."));
      if (!statsRes.ok) throw new Error(await readErrorMessage(statsRes, "Unable to load stats."));

      const ordersData = await ordersRes.json();
      const statsData = await statsRes.json();

      setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);
      setStats(statsData);
    } catch (err) {
      if (showLoading) {
        setError(err.message || "Unable to load dashboard data.");
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [merchantId]);

  useEffect(() => {
    if (!merchantId) {
      if (merchantSourceResolved) {
        setLoading(false);
      }
      return;
    }

    void loadDashboardData({ showLoading: true });
  }, [loadDashboardData, merchantId, merchantSourceResolved, refreshKey]);

  useEffect(() => {
    if (!merchantId) return;

    const channel = supabase
      .channel(`orders_realtime_${merchantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        () => {
          setTimeout(() => {
            void loadDashboardData({ showLoading: false });
          }, 500);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        () => {
          setTimeout(() => {
            void loadDashboardData({ showLoading: false });
          }, 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadDashboardData, merchantId]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      void (async () => {
        const session = await getStableSession();
        if (session) {
          setUser(session.user);
        }
      })();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (typeof window !== "undefined") {
        localStorage.removeItem("merchant_id");
      }
      await supabase.auth.signOut();
      router.replace(SETUP_PATH);
    } finally {
      setTimeout(() => setSigningOut(false), 500);
    }
  };

  const orderRows = useMemo(() => {
    return orders.map((order) => ({
      id: order.order_id || order.id,
      orderName: order.order_name || "-",
      customer: order.customer || "-",
      phone: order.phone || "-",
      product: order.product || "-",
      amount: order.amount ? `${order.amount} ${order.currency || ""}`.trim() : "-",
      status: order.status || "pending",
      riskScore: typeof order.risk_score === "number" ? order.risk_score.toFixed(2) : "-",
      riskFlags: formatFlags(order.risk_flags),
      reply: order.reply || "-",
      createdAt: formatDate(order.created_at),
    }));
  }, [orders]);

  return (
    <main className="page">
      <header className="header reveal" style={{ "--delay": "0.1s" }}>
        <div className="brand">
          <h2>Orders dashboard</h2>
          <p>Merchant: {merchantId || "Not set"}</p>
        </div>
        <div className="actions header-tools">
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

          <button
            className="button button-secondary"
            onClick={() => setRefreshKey((k) => k + 1)}
          >
            Refresh data
          </button>

          <span className="dashboard-link-wrap">
            <Link className="button button-primary" href={SETUP_PATH}>
              Manage store
            </Link>
          </span>
        </div>
      </header>

      {!merchantId ? (
        <section className="card reveal" style={{ "--delay": "0.2s" }}>
          <p className="notice">No merchant ID found. Register a store to view its orders.</p>
        </section>
      ) : null}

      {stats ? (
        <section className="card reveal" style={{ "--delay": "0.2s" }}>
          <div className="stats">
            <div className="stat">
              <span>Total orders</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat">
              <span>Confirmed</span>
              <strong>{stats.confirmed}</strong>
            </div>
            <div className="stat">
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
            <div className="stat">
              <span>Cancelled</span>
              <strong>{stats.cancelled + stats.auto_cancelled}</strong>
            </div>
            <div className="stat">
              <span>Confirmation rate</span>
              <strong>{stats.confirmation_rate}</strong>
            </div>
            <div className="stat">
              <span>Fake order rate</span>
              <strong>{stats.fake_order_rate}</strong>
            </div>
          </div>
        </section>
      ) : null}

      <section className="card reveal" style={{ "--delay": "0.3s" }}>
        <div className="table-header">
          <h3 className="section-title">Latest orders</h3>
          <span className="help-text">Showing {orderRows.length} orders</span>
        </div>

        {loading ? <p className="help-text">Loading orders...</p> : null}
        {error ? <p className="notice error-notice">{error}</p> : null}

        {!loading && !error && orderRows.length === 0 ? (
          <p className="help-text">No orders yet. New COD orders will appear here.</p>
        ) : null}

        {orderRows.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order name</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Risk score</th>
                  <th>Risk flags</th>
                  <th>Reply</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {orderRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.orderName}</td>
                    <td>{row.customer}</td>
                    <td>{row.phone}</td>
                    <td>{row.product}</td>
                    <td>{row.amount}</td>
                    <td><span className={`tag ${row.status}`}>{row.status}</span></td>
                    <td>{row.riskScore}</td>
                    <td>{row.riskFlags}</td>
                    <td>{row.reply}</td>
                    <td>{row.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
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
