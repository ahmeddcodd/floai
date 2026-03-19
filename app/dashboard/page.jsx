"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cod-automation.vercel.app";

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

  // 1. Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }
      setUser(session.user);
    };
    checkAuth();
  }, [router]);

  // 2. Merchant ID
  useEffect(() => {
    if (typeof window === "undefined") return;
    const param = new URLSearchParams(window.location.search).get("merchant_id");
    if (param) {
      setMerchantId(param);
      localStorage.setItem("merchant_id", param);
      return;
    }
    const stored = localStorage.getItem("merchant_id");
    if (stored) {
      setMerchantId(stored);
    }
  }, []);

  // 3. Fetch orders + stats (initial load + manual refresh)
  useEffect(() => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setLoading(true);
      setError("");

      try {
        const headers = { "Authorization": `Bearer ${session.access_token}` };

        const [ordersRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/api/merchants/${encodeURIComponent(merchantId)}/orders?limit=50`, { headers }),
          fetch(`${API_BASE}/api/merchants/${encodeURIComponent(merchantId)}/stats`, { headers }),
        ]);

        if (!ordersRes.ok) throw new Error(await ordersRes.text());
        if (!statsRes.ok) throw new Error(await statsRes.text());

        const ordersData = await ordersRes.json();
        const statsData = await statsRes.json();

        if (!cancelled) {
          setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);
          setStats(statsData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [merchantId, refreshKey]);

  // 4. Silent background refetch (no loading spinner — used by realtime)
  const silentRefresh = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !merchantId) return;

      const headers = { "Authorization": `Bearer ${session.access_token}` };

      const [ordersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/merchants/${encodeURIComponent(merchantId)}/orders?limit=50`, { headers }),
        fetch(`${API_BASE}/api/merchants/${encodeURIComponent(merchantId)}/stats`, { headers }),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Silent refresh failed:", err);
    }
  };

  // 5. Realtime subscription
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
        (payload) => {
          console.log("INSERT received:", payload.new);
          // Always do a silent refresh to get the complete data + updated stats
          // Small delay to ensure the DB write is fully committed
          setTimeout(() => silentRefresh(), 500);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("UPDATE received:", payload.new);
          setTimeout(() => silentRefresh(), 500);
        }
      )
      .subscribe((status, err) => {
        console.log("Realtime status:", status, err ?? "");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [merchantId]);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      await supabase.auth.signOut();
      router.push("/");
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
          {user && <p style={{ fontSize: '1rem', opacity: 0.7 }}>Account: {user.email}</p>}
        </div>
        <div className="actions">
          {user && (
            <button
              onClick={handleLogout}
              className="button"
              style={{ padding: '10px 20px', fontSize: '1rem' }}
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

          <span style={{ display: "inline-flex" }}>
            <Link className="button button-primary" href="/">
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

      <footer className="landing-footer" style={{ marginTop: 'auto', background: 'transparent', borderTop: 'none' }}>
        <div className="landing-footer-bottom">
          <p>
            © 2026 FloAI &bull; <Link href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy</Link> &bull; <Link href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms &amp; Conditions</Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
