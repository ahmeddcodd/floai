export const HERO_STATS = [
  { value: 40, suffix: "%", label: "Fake Orders Blocked", duration: 2000 },
  { value: 95, suffix: "%", label: "WhatsApp Delivery Rate", duration: 2200 },
  { value: 3, suffix: "s", label: "Avg. Response Time", duration: 1500 },
];

export const PROBLEM_STATS = [
  {
    value: "Rs. 500-1500",
    description: "Average cost per returned COD order including shipping & handling",
    delay: "0.3s",
  },
  {
    value: "40%",
    description: "Of COD orders are fake or go undelivered across Pakistani e-commerce",
    delay: "0.4s",
  },
  {
    value: "0 Seconds",
    description: "Time it takes our AI to flag suspicious orders before shipping",
    delay: "0.5s",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Order Placed",
    description: "Customer places a COD order on your Shopify store. Our system is instantly notified via webhook.",
    icon: "chart",
    delay: "0.3s",
  },
  {
    number: "02",
    title: "AI Risk Check + WhatsApp Sent",
    description: "We score the order against 20+ risk signals (fake phones, repeat cancellers, odd hours, filler addresses). A WhatsApp confirmation message is sent instantly.",
    icon: "shield",
    delay: "0.4s",
  },
  {
    number: "03",
    title: "Confirm or Auto-Cancel",
    description: "Customer replies YES -> order confirmed. Replies NO -> cancelled. No reply in 20 minutes -> auto-cancelled. You only ship real orders.",
    icon: "whatsapp",
    delay: "0.5s",
  },
];

export const FEATURE_LIST = [
  {
    icon: "shield",
    title: "AI Risk Scoring",
    description: "20+ risk signals calibrated for Pakistan - repeated digits, landline detection, filler addresses, order flooding, and more. Every order gets a 0-100 risk score.",
    delay: "0.25s",
  },
  {
    icon: "whatsapp",
    title: "Instant WhatsApp Confirmation",
    description: "Automated WhatsApp template messages sent within seconds of order placement. Uses Meta's official Cloud API for 95%+ delivery rates.",
    delay: "0.3s",
  },
  {
    icon: "clock",
    title: "Auto-Cancel No-Reply",
    description: "No response within your configured wait time? The order is automatically cancelled on Shopify. No manual follow-up needed.",
    delay: "0.35s",
  },
  {
    icon: "phone",
    title: "PK Phone Validation",
    description: "Validates against all Pakistani carrier prefixes - Jazz, Zong, Telenor, Ufone, SCO. Detects landlines, repeated digits, and sequential patterns.",
    delay: "0.4s",
  },
  {
    icon: "history",
    title: "Order History Analysis",
    description: "Tracks repeat offenders. If a phone number has a 70%+ cancel rate or multiple auto-cancels, future orders are flagged automatically.",
    delay: "0.45s",
  },
  {
    icon: "chart",
    title: "Real-Time Dashboard",
    description: "Monitor all orders, risk scores, confirmation rates, and fake order statistics in a beautiful live dashboard.",
    delay: "0.5s",
  },
];

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: "1,200",
    period: "month",
    description: "Perfect for new stores testing the waters",
    features: [
      "Up to 100 orders/month",
      "AI risk scoring",
      "WhatsApp confirmations",
      "Auto-cancel on no reply",
      "Basic dashboard",
    ],
    excluded: [
      "Priority support",
      "Custom wait times",
      "API access",
    ],
    delay: "0.3s",
  },
  {
    name: "Pro",
    price: "2,000",
    period: "month",
    description: "For growing stores with serious COD volume",
    features: [
      "Up to 2,000 orders/month",
      "AI risk scoring",
      "WhatsApp confirmations",
      "Auto-cancel on no reply",
      "Full analytics dashboard",
      "Custom wait times",
      "Priority WhatsApp support",
    ],
    excluded: ["API access"],
    popular: true,
    delay: "0.35s",
  },
];
