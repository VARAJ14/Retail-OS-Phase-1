const TRENZ_CRM_DATA = {
  summary: {
    customers: 48920,
    repeatBuyers: 18604,
    loyaltyMembers: 22180,
    campaignEligible: 9840,
    returnRisk: 1284,
    goldMembers: 4280
  },

  customers: [
    {
      id: "CRM-TN-10482",
      name: "Priya Raman",
      phone: "+91 98765 43210",
      email: "priya.raman@email.com",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      tier: "Gold",
      points: 1840,
      orders: 24,
      spend: 82430,
      returns: 3,
      returnRate: "12.5%",
      segment: ["VIP", "Fashion Buyer", "Beauty Buyer", "Campaign Ready"],
      lastPurchase: "Denim Jacket + Herbal Face Cream",
      nextAction: "Send clothing exchange offer"
    },
    {
      id: "CRM-TN-20918",
      name: "Arun Prakash",
      phone: "+91 98401 22110",
      email: "arun.prakash@email.com",
      branch: "PADI BRANCH",
      tier: "Silver",
      points: 920,
      orders: 8,
      spend: 64990,
      returns: 1,
      returnRate: "12.5%",
      segment: ["Electronics Buyer", "Warranty Active"],
      lastPurchase: "NoiseShield Earbuds Pro",
      nextAction: "Warranty follow-up"
    },
    {
      id: "CRM-TN-31844",
      name: "Meena Lakshmi",
      phone: "+91 98844 77120",
      email: "meena.l@email.com",
      branch: "SPENCER",
      tier: "Gold",
      points: 1420,
      orders: 16,
      spend: 38620,
      returns: 0,
      returnRate: "0%",
      segment: ["Beauty Loyalist", "High Trust", "Campaign Ready"],
      lastPurchase: "Matte Lipstick + Face Cream",
      nextAction: "Beauty bundle offer"
    },
    {
      id: "CRM-TN-44021",
      name: "Suresh Kumar",
      phone: "+91 90031 88442",
      email: "suresh.k@email.com",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      tier: "Base",
      points: 310,
      orders: 11,
      spend: 24880,
      returns: 5,
      returnRate: "45%",
      segment: ["Return-prone", "Manual Approval"],
      lastPurchase: "Brown Leather Wallet",
      nextAction: "Manual return approval only"
    }
  ],

  timeline: [
    {
      time: "Today",
      type: "Purchase",
      detail: "Website order ORD-TN-78412 added to Priya Raman profile.",
      impact: "Loyalty +84 points"
    },
    {
      time: "Today",
      type: "Return",
      detail: "Denim Jacket exchange request created.",
      impact: "Return history updated"
    },
    {
      time: "Yesterday",
      type: "Campaign",
      detail: "Beauty offer sent to Meena Lakshmi.",
      impact: "Campaign eligible"
    },
    {
      time: "3 days ago",
      type: "Warranty",
      detail: "Arun Prakash warranty claim created for earbuds.",
      impact: "Electronics support active"
    }
  ]
};

function crmMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}
