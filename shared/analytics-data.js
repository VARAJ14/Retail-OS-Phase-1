const TRENZ_ANALYTICS_DATA = {
  summary: {
    netSales: 28400000,
    orders: 12486,
    returnRate: "8.6%",
    inventoryTurnover: "4.7x",
    retention: "42%",
    deadStock: 1860000
  },

  branchPerformance: [
    { branch: "BEST CHOICE ANNA NAGAR BRANCH", sales: 8240000, orders: 3284, returns: "7.8%", stockHealth: "Healthy" },
    { branch: "PADI BRANCH", sales: 6880000, orders: 2418, returns: "9.1%", stockHealth: "Watch" },
    { branch: "SPENCER", sales: 7420000, orders: 2794, returns: "8.9%", stockHealth: "Expiry Watch" }
  ],

  categoryPerformance: [
    { category: "Clothing", sales: 7420000, trend: "+18.4%", returns: "9.2%", action: "Rebalance sizes" },
    { category: "Electronics", sales: 9180000, trend: "+12.1%", returns: "6.8%", action: "Review warranty claims" },
    { category: "Cosmetics", sales: 4860000, trend: "+21.6%", returns: "4.1%", action: "Campaign expiry stock" },
    { category: "Accessories", sales: 2940000, trend: "-4.2%", returns: "3.8%", action: "Reorder wallets" }
  ],

  reports: [
    { name: "GST Sales Summary", data: "POS + Website + Returns", format: "Excel / PDF", frequency: "Monthly", owner: "Finance" },
    { name: "Inventory State Report", data: "Main + Branch Inventory", format: "Excel", frequency: "Daily", owner: "Owner" },
    { name: "Return Loss Report", data: "Returns + Refunds", format: "PDF", frequency: "Weekly", owner: "Operations" },
    { name: "CRM Retention Report", data: "CRM + Campaigns", format: "Excel", frequency: "Weekly", owner: "Marketing" }
  ]
};

function analyticsMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}
