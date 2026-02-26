export const landingConfig = {
  // Brand
  brand: {
    name: "strikezone",
    logo: "◆"
  },

  // Meta
  meta: {
    title: "strikezone | Gamma Analytics for Indian Options",
    description: "Real-time GEX and OTM Greeks visualization for NIFTY & BANKNIFTY options trading."
  },

  // Navigation
  nav: {
    links: [
      { text: "Features", href: "#features" },
      { text: "Pricing", href: "#pricing" },
      { text: "FAQ", href: "#faq" }
    ],
    cta: {
      text: "Get Started",
      href: "#pricing"
    }
  },

  // Hero Section
  hero: {
    badge: "Real-time Analytics",
    headline: "See what other traders can't.",
    subheadline: "Gamma exposure visualization that reveals institutional positioning. Know support and resistance levels before they're tested.",
    cta: {
      text: "Start Trading With Edge",
      href: "#pricing"
    }
  },

  // Features Section
  features: {
    sectionTitle: "Features that matter",
    items: [
      {
        title: "Strike-by-Strike GEX",
        description: "See gamma exposure at every strike. Green bars mark support where dealers buy dips. Red bars mark resistance where they sell rallies. The spot line shows your position in the distribution.",
        image: "/feature-1.png"
      },
      {
        title: "Intraday Net GEX Flow",
        description: "Track how total net gamma evolves through the day. Watch for gamma flips — when market character shifts from stabilizing (long gamma) to accelerating (short gamma).",
        image: "/feature-2.png"
      },
      {
        title: "OTM Greeks Monitor",
        description: "Monitor Vega, Theta, and Delta changes for out-of-the-money options. See how time decay and volatility shifts affect pricing in real-time.",
        image: "/feature-3.png"
      }
    ]
  },

  // Pricing Section
  pricing: {
    sectionTitle: "Simple Pricing",
    badge: "Monthly Access",
    price: "₹249",
    period: "/month",
    description: "One plan. Full access. No upsells.",
    cta: {
      text: "Subscribe Now",
      href: "#"
    },
    features: [
      "Real-time GEX data (1-minute updates)",
      "Strike-by-strike gamma visualization",
      "Intraday Net GEX tracking",
      "OTM Greeks (Vega, Theta, Delta)",
      "NIFTY & BANKNIFTY coverage",
      "All expiries — weekly & monthly",
      "Historical data (31-day rolling)",
      "9:15 AM to 3:30 PM market hours"
    ],
    note: "Cancel anytime. No questions asked."
  },

  // FAQ Section
  faq: {
    sectionTitle: "Common Questions",
    items: [
      {
        question: "What exactly is GEX?",
        answer: "GEX (Gamma Exposure) measures the total gamma position of market makers at each strike price. When dealers are long gamma (positive GEX), they hedge by selling rallies and buying dips — creating support/resistance. When short gamma (negative GEX), they chase momentum — accelerating moves."
      },
      {
        question: "How often does data update?",
        answer: "Every 60 seconds during market hours (9:15 AM to 3:30 PM IST). Historical data shows 5-minute snapshots for dates beyond 30 days."
      },
      {
        question: "Do you offer a free trial?",
        answer: "No. The price is set low enough that serious traders can evaluate value quickly. Cancel anytime if it doesn't fit your workflow."
      },
      {
        question: "Which instruments are covered?",
        answer: "NIFTY 50 and BANKNIFTY options only. We focus on these two indices to provide the highest quality data rather than diluting coverage across 50+ stocks."
      },
      {
        question: "Can I use this for positional/swing trading?",
        answer: "Yes. Historical mode lets you analyze any trading day's GEX profile. Study how gamma exposure behaved on expiry days, gap-up opens, or trend continuation days."
      },
      {
        question: "What happens on weekends or holidays?",
        answer: "The app automatically switches to historical mode and displays the most recent trading day's data. Live mode is only available during market hours."
      }
    ]
  },

  // Final CTA Section
  cta: {
    headline: "Trade With Precision",
    subheadline: "Join traders who understand market structure. ₹249/month.",
    button: {
      text: "Get Started Now",
      href: "#pricing"
    }
  },

  // Footer
  footer: {
    copyright: "© 2025 strikezone",
    links: [
      { text: "Dashboard", href: "/dashboard" },
      { text: "Terms", href: "#" },
      { text: "Privacy", href: "#" }
    ]
  }
};

export type LandingConfig = typeof landingConfig;
