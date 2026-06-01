const TRENZ_CAMPAIGN_DATA = {
  summary: {
    activeCampaigns: 12,
    whatsappSent: 18420,
    conversionRate: "11.8%",
    revenue: 486200,
    eligibleCustomers: 9840,
    websiteBanners: 5
  },

  campaigns: [
    {
      id: "CMP-TN-901",
      name: "Anna Nagar Fashion Weekend",
      type: "WhatsApp",
      segment: "Fashion Buyers",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      offer: "Flat 15% on shirts and jackets",
      products: "Men Cotton Shirt, Denim Jacket",
      status: "Active",
      sent: 6420,
      conversion: "13.2%",
      revenue: 184250,
      websiteBanner: "Enabled"
    },
    {
      id: "CMP-TN-902",
      name: "Padi Electronics Week",
      type: "Offer",
      segment: "Electronics Buyers",
      branch: "PADI BRANCH",
      offer: "₹300 off on earbuds",
      products: "NoiseShield Earbuds Pro",
      status: "Scheduled",
      sent: 4280,
      conversion: "9.4%",
      revenue: 124900,
      websiteBanner: "Enabled"
    },
    {
      id: "CMP-TN-903",
      name: "Spencer Beauty Essentials",
      type: "WhatsApp",
      segment: "Beauty Loyalists",
      branch: "SPENCER",
      offer: "Buy 2 cosmetics, get 10% off",
      products: "Face Cream, Matte Lipstick",
      status: "Active",
      sent: 5120,
      conversion: "14.8%",
      revenue: 151200,
      websiteBanner: "Enabled"
    },
    {
      id: "CMP-TN-904",
      name: "Accessory Add-on Deal",
      type: "Cross-sell",
      segment: "Gift Buyers",
      branch: "Select All",
      offer: "Wallet + Belt combo",
      products: "Brown Wallet, Black Belt",
      status: "Draft",
      sent: 2600,
      conversion: "6.1%",
      revenue: 25900,
      websiteBanner: "Draft"
    }
  ],

  segments: [
    "Fashion Buyers",
    "Electronics Buyers",
    "Beauty Loyalists",
    "Gift Buyers",
    "Gold Members",
    "Return Safe Customers",
    "Campaign Ready"
  ]
};

function campaignMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}
