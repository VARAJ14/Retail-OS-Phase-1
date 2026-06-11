const TRENZ_WEBSITE_CONTROL_DATA = {
  summary: {
    liveProducts: 5842,
    visibleCategories: 4,
    activeBanners: 5,
    activeOffers: 12,
    syncedBranches: 3,
    stockIssues: 14,
    seoScore: "91%",
    conversionRate: "11.8%"
  },

  branches: [
    {
      id: "anna-nagar",
      name: "BEST CHOICE ANNA NAGAR BRANCH",
      city: "Chennai",
      websiteStock: 1842,
      pickupEnabled: true,
      localOrders: 286,
      sync: "Live",
      issues: 4
    },
    {
      id: "padi",
      name: "PADI BRANCH",
      city: "Chennai",
      websiteStock: 1428,
      pickupEnabled: true,
      localOrders: 196,
      sync: "Live",
      issues: 6
    },
    {
      id: "spencer",
      name: "SPENCER",
      city: "Chennai",
      websiteStock: 1284,
      pickupEnabled: true,
      localOrders: 221,
      sync: "Live",
      issues: 4
    }
  ],

  banners: [
    {
      id: "BAN-001",
      title: "Summer Clothing Drop",
      placement: "Homepage Hero",
      category: "Clothing",
      branch: "Select All",
      status: "Live",
      linkedCampaign: "Anna Nagar Fashion Weekend",
      conversion: "13.2%"
    },
    {
      id: "BAN-002",
      title: "Electronics Week",
      placement: "Homepage Secondary",
      category: "Electronics",
      branch: "PADI BRANCH",
      status: "Scheduled",
      linkedCampaign: "Padi Electronics Week",
      conversion: "9.4%"
    },
    {
      id: "BAN-003",
      title: "Beauty Essentials",
      placement: "Category Page",
      category: "Cosmetics",
      branch: "SPENCER",
      status: "Live",
      linkedCampaign: "Spencer Beauty Essentials",
      conversion: "14.8%"
    }
  ],

  categories: [
    {
      id: "cat-clothing",
      name: "Clothing",
      visible: true,
      products: 1840,
      featured: true,
      ownerLocked: false
    },
    {
      id: "cat-electronics",
      name: "Electronics",
      visible: true,
      products: 1240,
      featured: true,
      ownerLocked: false
    },
    {
      id: "cat-cosmetics",
      name: "Cosmetics",
      visible: true,
      products: 1320,
      featured: true,
      ownerLocked: false
    },
    {
      id: "cat-accessories",
      name: "Accessories",
      visible: true,
      products: 1442,
      featured: false,
      ownerLocked: false
    }
  ],

  websiteProducts: [
    {
      id: "PRD-001",
      sku: "CLO-SHT-MEN-WHT-M",
      name: "Men Cotton Shirt",
      category: "Clothing",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      branchStock: 18,
      visibleOnline: true,
      price: 1299,
      overridePrice: null,
      offer: "15% Weekend Offer",
      status: "Visible",
      issue: "Low Stock"
    },
    {
      id: "PRD-002",
      sku: "ELE-EAR-NSP-BLK",
      name: "NoiseShield Earbuds Pro",
      category: "Electronics",
      branch: "PADI BRANCH",
      branchStock: 28,
      visibleOnline: true,
      price: 3499,
      overridePrice: 3299,
      offer: "₹200 Off",
      status: "Visible",
      issue: "None"
    },
    {
      id: "PRD-003",
      sku: "COS-FC-HERBAL100",
      name: "Herbal Face Cream 100ml",
      category: "Cosmetics",
      branch: "SPENCER",
      branchStock: 52,
      visibleOnline: true,
      price: 649,
      overridePrice: null,
      offer: "Buy 2 Get 10%",
      status: "Visible",
      issue: "Expiry Watch"
    },
    {
      id: "PRD-004",
      sku: "ACC-WLT-BRN-LEA",
      name: "Brown Leather Wallet",
      category: "Accessories",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      branchStock: 22,
      visibleOnline: true,
      price: 999,
      overridePrice: null,
      offer: "Combo Eligible",
      status: "Visible",
      issue: "Reorder"
    }
  ],

  seoSettings: {
    title: "TRENZ OS RETAIL - Chennai Fashion, Electronics, Beauty and Accessories",
    description: "Shop clothing, electronics, cosmetics and accessories from live Chennai branch inventory.",
    keywords: "Chennai retail, clothing, electronics, cosmetics, accessories, Anna Nagar, Padi, Spencer",
    indexable: true,
    score: "91%"
  },

  localOfferRequests: [
    {
      id: "REQ-WEB-101",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      manager: "S. Karthik",
      request: "Feature Men Cotton Shirt for weekend offer",
      status: "Owner Approval Pending",
      product: "Men Cotton Shirt",
      reason: "High branch stock movement"
    },
    {
      id: "REQ-WEB-102",
      branch: "PADI BRANCH",
      manager: "R. Meena",
      request: "Promote USB-C chargers for local website pickup",
      status: "Approved",
      product: "USB-C Fast Charger 45W",
      reason: "Electronics demand spike"
    }
  ]
};

function websiteControlMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getWebsiteControlBranch(branchId) {
  return TRENZ_WEBSITE_CONTROL_DATA.branches.find((branch) => branch.id === branchId);
}

function getWebsiteProductsByBranch(branchName) {
  if (!branchName || branchName === "Select All") {
    return TRENZ_WEBSITE_CONTROL_DATA.websiteProducts;
  }

  return TRENZ_WEBSITE_CONTROL_DATA.websiteProducts.filter((item) => item.branch === branchName);
}
