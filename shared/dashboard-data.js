const TRENZOS_DASHBOARD_DATA = {
  branches: [
    {
      id: "anna-nagar",
      name: "BEST CHOICE ANNA NAGAR BRANCH",
      city: "Chennai",
      salesToday: 684250,
      ordersToday: 284,
      stockHealth: "Healthy",
      lowStock: 8,
      returnsPending: 5,
      sync: "Live",
      topCategory: "Clothing",
      manager: "S. Karthik"
    },
    {
      id: "padi",
      name: "PADI BRANCH",
      city: "Chennai",
      salesToday: 438900,
      ordersToday: 196,
      stockHealth: "Watch",
      lowStock: 14,
      returnsPending: 8,
      sync: "Live",
      topCategory: "Electronics",
      manager: "R. Meena"
    },
    {
      id: "spencer",
      name: "SPENCER",
      city: "Chennai",
      salesToday: 512780,
      ordersToday: 221,
      stockHealth: "Low Stock",
      lowStock: 19,
      returnsPending: 6,
      sync: "Live",
      topCategory: "Cosmetics",
      manager: "A. Rahman"
    }
  ],

  kpis: {
    owner: {
      netSalesToday: 1635930,
      totalOrders: 701,
      activeBranches: 3,
      lowStockSkus: 41,
      returnsPending: 19,
      crmUpdates: 642
    },
    manager: {
      branchSalesToday: 684250,
      branchOrders: 284,
      availableStock: 12840,
      lowStockSkus: 8,
      returnsPending: 5,
      staffOnline: 14
    }
  },

  inventoryAlerts: [
    {
      sku: "CLO-SHT-MEN-WHT-M",
      item: "Men Cotton Shirt - White / M",
      category: "Clothing",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      state: "Low Stock",
      qty: 18,
      action: "Request stock"
    },
    {
      sku: "ELE-CHG-USB45W",
      item: "USB-C Fast Charger 45W",
      category: "Electronics",
      branch: "PADI BRANCH",
      state: "Critical",
      qty: 7,
      action: "Transfer today"
    },
    {
      sku: "COS-FC-HERBAL100",
      item: "Herbal Face Cream 100ml",
      category: "Cosmetics",
      branch: "SPENCER",
      state: "Expiry Watch",
      qty: 64,
      action: "Promote offer"
    },
    {
      sku: "ACC-WLT-BRN-LEA",
      item: "Brown Leather Wallet",
      category: "Accessories",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      state: "Reorder",
      qty: 22,
      action: "Create PO"
    }
  ],

  liveFlow: [
    {
      step: "Main Inventory",
      status: "Ready",
      count: "8,426 SKUs",
      color: "indigo"
    },
    {
      step: "Branch Inventory",
      status: "Synced",
      count: "3 branches",
      color: "cyan"
    },
    {
      step: "POS Billing",
      status: "Live",
      count: "18 counters",
      color: "emerald"
    },
    {
      step: "Website Stock",
      status: "Updated",
      count: "5,842 live items",
      color: "blue"
    },
    {
      step: "CRM Update",
      status: "Active",
      count: "642 updates",
      color: "fuchsia"
    },
    {
      step: "Analytics",
      status: "Streaming",
      count: "99.4% sync",
      color: "amber"
    }
  ],

  recentActivity: [
    {
      time: "10:42 AM",
      title: "POS sale completed",
      detail: "Anna Nagar counter billed ₹4,860. Stock moved Reserved → Sold.",
      module: "POS"
    },
    {
      time: "10:36 AM",
      title: "Website order reserved",
      detail: "SPENCER reserved 2 cosmetics items for delivery.",
      module: "Website"
    },
    {
      time: "10:22 AM",
      title: "Transfer requested",
      detail: "PADI requested 40 USB-C chargers from Main Inventory.",
      module: "Inventory"
    },
    {
      time: "10:05 AM",
      title: "Return approved",
      detail: "Clothing exchange approved at Anna Nagar.",
      module: "Returns"
    }
  ],

  branchQueue: [
    {
      id: "TRF-1028",
      type: "Incoming Transfer",
      item: "Men Cotton Shirt - White / M",
      qty: 80,
      from: "Main Inventory",
      to: "BEST CHOICE ANNA NAGAR BRANCH",
      status: "Receive"
    },
    {
      id: "RET-4482",
      type: "Return Approval",
      item: "Denim Jacket - Blue / L",
      qty: 1,
      from: "Customer",
      to: "Return Inspection",
      status: "Inspect"
    },
    {
      id: "ORD-9091",
      type: "Website Order",
      item: "Herbal Face Cream 100ml",
      qty: 2,
      from: "Website",
      to: "Branch Packing",
      status: "Pack"
    }
  ]
};

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getBranchById(branchId) {
  return TRENZOS_DASHBOARD_DATA.branches.find((branch) => branch.id === branchId);
}
