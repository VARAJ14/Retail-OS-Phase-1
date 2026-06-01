const TRENZ_PRODUCT_DATA = {
  branches: [
    {
      id: "all",
      name: "Select All"
    },
    {
      id: "anna-nagar",
      name: "BEST CHOICE ANNA NAGAR BRANCH"
    },
    {
      id: "padi",
      name: "PADI BRANCH"
    },
    {
      id: "spencer",
      name: "SPENCER"
    }
  ],

  suppliers: [
    {
      id: "sup-tn-textiles",
      name: "Tamil Nadu Textiles Co.",
      categories: ["Clothing"]
    },
    {
      id: "sup-chennai-electro",
      name: "Chennai Electronics Hub",
      categories: ["Electronics"]
    },
    {
      id: "sup-beauty-south",
      name: "South Beauty Distributors",
      categories: ["Cosmetics"]
    },
    {
      id: "sup-accessory-mart",
      name: "Accessory Mart Chennai",
      categories: ["Accessories"]
    }
  ],

  categoryRules: {
    Clothing: {
      accent: "indigo",
      skuPrefix: "CLO",
      requiredFields: ["Size", "Color", "Season", "Exchange Rule"],
      inventoryState: "Available",
      returnRule: "Exchange allowed after inspection",
      websiteRule: "Visible if branch stock is available",
      analyticsTag: "Fashion"
    },

    Electronics: {
      accent: "cyan",
      skuPrefix: "ELE",
      requiredFields: ["Warranty", "Serial Verification", "Compatibility", "Warranty Claim Rule"],
      inventoryState: "Available",
      returnRule: "Warranty claim after serial verification",
      websiteRule: "Visible if sellable stock excludes warranty hold",
      analyticsTag: "Electronics"
    },

    Cosmetics: {
      accent: "fuchsia",
      skuPrefix: "COS",
      requiredFields: ["Batch Number", "Expiry Date", "Hygiene Rule", "Disposal Rule"],
      inventoryState: "Available",
      returnRule: "No restock after opening due to hygiene restriction",
      websiteRule: "Visible if batch is valid and not expired",
      analyticsTag: "Beauty"
    },

    Accessories: {
      accent: "emerald",
      skuPrefix: "ACC",
      requiredFields: ["Material", "Color", "Condition Rule", "Return Rule"],
      inventoryState: "Available",
      returnRule: "Return allowed if unused and tagged",
      websiteRule: "Visible if branch stock is available",
      analyticsTag: "Accessories"
    }
  },

  draftProduct: {
    name: "Men Cotton Shirt",
    brand: "TRENZ Basics",
    category: "Clothing",
    sku: "CLO-SHT-MEN-WHT-M",
    barcodeReady: "890-TRENZ-CLO-0001",
    supplier: "Tamil Nadu Textiles Co.",
    status: "Active",
    mrp: 1599,
    sellingPrice: 1299,
    gst: 5,
    discount: 19,
    openingStock: 320,
    lowStockThreshold: 25,
    mainWarehouseQty: 320,
    initialState: "Available",
    websiteVisible: true,
    featured: true,
    newArrival: true,
    bestSeller: false,
    offerItem: true
  },

  recentProducts: [
    {
      sku: "CLO-SHT-MEN-WHT-M",
      name: "Men Cotton Shirt",
      category: "Clothing",
      stock: 320,
      state: "Available",
      website: "Visible",
      nextStep: "Allocate to Branch"
    },
    {
      sku: "ELE-EAR-NSP-BLK",
      name: "NoiseShield Earbuds Pro",
      category: "Electronics",
      stock: 210,
      state: "Available",
      website: "Visible",
      nextStep: "Serial Setup"
    },
    {
      sku: "COS-FC-HERBAL100",
      name: "Herbal Face Cream 100ml",
      category: "Cosmetics",
      stock: 480,
      state: "Available",
      website: "Visible",
      nextStep: "Batch Review"
    },
    {
      sku: "ACC-WLT-BRN-LEA",
      name: "Brown Leather Wallet",
      category: "Accessories",
      stock: 95,
      state: "Available",
      website: "Visible",
      nextStep: "Allocate to Branch"
    }
  ],

  creationEvents: [
    {
      time: "11:42 AM",
      event: "SKU created",
      detail: "CLO-SHT-MEN-WHT-M added to master inventory.",
      module: "Products"
    },
    {
      time: "11:43 AM",
      event: "Inventory initialized",
      detail: "320 units added to Main Inventory as Available.",
      module: "Main Inventory"
    },
    {
      time: "11:44 AM",
      event: "Website visibility enabled",
      detail: "Product marked as new arrival and offer item.",
      module: "Website"
    },
    {
      time: "11:45 AM",
      event: "Branch allocation ready",
      detail: "Product is ready for allocation to Anna Nagar, Padi and Spencer.",
      module: "Branch Inventory"
    }
  ]
};

function productMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getCategoryRule(category) {
  return TRENZ_PRODUCT_DATA.categoryRules[category] || TRENZ_PRODUCT_DATA.categoryRules.Clothing;
}

function generateSkuPreview(category, code, gender, color, variant) {
  const rule = getCategoryRule(category);

  const clean = (value) => {
    return String(value || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 4);
  };

  return [
    rule.skuPrefix,
    clean(code || "ITEM"),
    clean(gender || "GEN"),
    clean(color || "CLR"),
    clean(variant || "STD")
  ].join("-");
}
