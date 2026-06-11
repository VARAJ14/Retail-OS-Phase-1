const TRENZ_MAIN_INVENTORY_DATA = {
  branches: [
    {
      id: "anna-nagar",
      name: "BEST CHOICE ANNA NAGAR BRANCH",
      city: "Chennai"
    },
    {
      id: "padi",
      name: "PADI BRANCH",
      city: "Chennai"
    },
    {
      id: "spencer",
      name: "SPENCER",
      city: "Chennai"
    }
  ],

  products: [
    {
      sku: "CLO-SHT-MEN-WHT-M",
      name: "Men Cotton Shirt",
      brand: "TRENZ Basics",
      category: "Clothing",
      variant: "White / M",
      mainStock: 320,
      allocated: 53,
      available: 267,
      reserved: 0,
      sold: 0,
      damaged: 0,
      returned: 0,
      transferPending: 80,
      warrantyClaim: 0,
      disposal: 0,
      expired: 0,
      state: "Available",
      lowThreshold: 25,
      websiteReady: true,
      posReady: false,
      supplier: "Tamil Nadu Textiles Co.",
      price: 1299,
      gst: 5
    },
    {
      sku: "CLO-JKT-DNM-BLU-L",
      name: "Denim Jacket",
      brand: "Urban TRENZ",
      category: "Clothing",
      variant: "Blue / L",
      mainStock: 140,
      allocated: 56,
      available: 84,
      reserved: 0,
      sold: 0,
      damaged: 1,
      returned: 2,
      transferPending: 0,
      warrantyClaim: 0,
      disposal: 0,
      expired: 0,
      state: "Available",
      lowThreshold: 20,
      websiteReady: true,
      posReady: true,
      supplier: "Tamil Nadu Textiles Co.",
      price: 2499,
      gst: 5
    },
    {
      sku: "ELE-EAR-NSP-BLK",
      name: "NoiseShield Earbuds Pro",
      brand: "SoundMax",
      category: "Electronics",
      variant: "Black",
      mainStock: 210,
      allocated: 79,
      available: 131,
      reserved: 0,
      sold: 0,
      damaged: 0,
      returned: 0,
      transferPending: 20,
      warrantyClaim: 7,
      disposal: 0,
      expired: 0,
      state: "Available",
      lowThreshold: 30,
      websiteReady: true,
      posReady: true,
      supplier: "Chennai Electronics Hub",
      price: 3499,
      gst: 18
    },
    {
      sku: "ELE-CHG-USB45W",
      name: "USB-C Fast Charger 45W",
      brand: "VoltPlus",
      category: "Electronics",
      variant: "Black",
      mainStock: 88,
      allocated: 13,
      available: 75,
      reserved: 0,
      sold: 0,
      damaged: 0,
      returned: 1,
      transferPending: 40,
      warrantyClaim: 4,
      disposal: 0,
      expired: 0,
      state: "Low Stock",
      lowThreshold: 80,
      websiteReady: false,
      posReady: true,
      supplier: "Chennai Electronics Hub",
      price: 1499,
      gst: 18
    },
    {
      sku: "COS-FC-HERBAL100",
      name: "Herbal Face Cream 100ml",
      brand: "GlowHerb",
      category: "Cosmetics",
      variant: "Batch COS-TN-884",
      mainStock: 480,
      allocated: 164,
      available: 316,
      reserved: 0,
      sold: 0,
      damaged: 0,
      returned: 3,
      transferPending: 0,
      warrantyClaim: 0,
      disposal: 5,
      expired: 0,
      state: "Expiry Watch",
      lowThreshold: 70,
      websiteReady: true,
      posReady: true,
      supplier: "South Beauty Distributors",
      price: 649,
      gst: 18,
      expiry: "22 days"
    },
    {
      sku: "COS-LIP-MAT-RED",
      name: "Matte Lipstick",
      brand: "ColorAura",
      category: "Cosmetics",
      variant: "Red / Batch COS-TN-902",
      mainStock: 260,
      allocated: 94,
      available: 166,
      reserved: 0,
      sold: 0,
      damaged: 0,
      returned: 1,
      transferPending: 0,
      warrantyClaim: 0,
      disposal: 2,
      expired: 0,
      state: "Available",
      lowThreshold: 40,
      websiteReady: true,
      posReady: true,
      supplier: "South Beauty Distributors",
      price: 499,
      gst: 18,
      expiry: "74 days"
    },
    {
      sku: "ACC-WLT-BRN-LEA",
      name: "Brown Leather Wallet",
      brand: "TRENZ Classic",
      category: "Accessories",
      variant: "Brown",
      mainStock: 95,
      allocated: 46,
      available: 49,
      reserved: 0,
      sold: 0,
      damaged: 0,
      returned: 1,
      transferPending: 30,
      warrantyClaim: 0,
      disposal: 0,
      expired: 0,
      state: "Reorder",
      lowThreshold: 60,
      websiteReady: true,
      posReady: true,
      supplier: "Accessory Mart Chennai",
      price: 999,
      gst: 12
    },
    {
      sku: "ACC-BLT-BLK-L",
      name: "Black Formal Belt",
      brand: "TRENZ Classic",
      category: "Accessories",
      variant: "Black / L",
      mainStock: 130,
      allocated: 110,
      available: 20,
      reserved: 0,
      sold: 0,
      damaged: 0,
      returned: 0,
      transferPending: 0,
      warrantyClaim: 0,
      disposal: 0,
      expired: 0,
      state: "Low Stock",
      lowThreshold: 40,
      websiteReady: true,
      posReady: true,
      supplier: "Accessory Mart Chennai",
      price: 799,
      gst: 12
    }
  ],

  allocations: [
    {
      id: "TRF-MAIN-1028",
      sku: "CLO-SHT-MEN-WHT-M",
      product: "Men Cotton Shirt",
      from: "Main Inventory",
      to: "BEST CHOICE ANNA NAGAR BRANCH",
      qty: 80,
      state: "Transfer Pending",
      createdBy: "Owner",
      status: "Awaiting branch receive"
    },
    {
      id: "TRF-MAIN-1029",
      sku: "ELE-CHG-USB45W",
      product: "USB-C Fast Charger 45W",
      from: "Main Inventory",
      to: "PADI BRANCH",
      qty: 40,
      state: "Transfer Pending",
      createdBy: "Owner",
      status: "Dispatch pending"
    },
    {
      id: "TRF-MAIN-1030",
      sku: "ACC-WLT-BRN-LEA",
      product: "Brown Leather Wallet",
      from: "Main Inventory",
      to: "SPENCER",
      qty: 30,
      state: "Transfer Pending",
      createdBy: "Owner",
      status: "Awaiting dispatch"
    }
  ],

  movementLog: [
    {
      id: "MOV-MAIN-901",
      event: "Product Created",
      sku: "CLO-SHT-MEN-WHT-M",
      from: "Product Creation",
      to: "Main Inventory",
      qty: 320,
      state: "Available",
      impact: "SKU initialized and ready for branch allocation",
      time: "11:45 AM"
    },
    {
      id: "MOV-MAIN-902",
      event: "Branch Allocation",
      sku: "CLO-SHT-MEN-WHT-M",
      from: "Main Inventory",
      to: "BEST CHOICE ANNA NAGAR BRANCH",
      qty: 80,
      state: "Transfer Pending",
      impact: "Branch receiving queue created",
      time: "11:48 AM"
    },
    {
      id: "MOV-MAIN-903",
      event: "Warranty Hold",
      sku: "ELE-EAR-NSP-BLK",
      from: "Returned Inventory",
      to: "Warranty Claim",
      qty: 7,
      state: "Warranty Claim",
      impact: "Units excluded from POS and website availability",
      time: "10:58 AM"
    },
    {
      id: "MOV-MAIN-904",
      event: "Cosmetics Disposal",
      sku: "COS-FC-HERBAL100",
      from: "Returned Inventory",
      to: "Disposal",
      qty: 5,
      state: "Disposal",
      impact: "Disposed items removed from sellable inventory",
      time: "10:42 AM"
    }
  ]
};
function getMainInventoryTotals() {
  const products = TRENZ_MAIN_INVENTORY_DATA.products;

  return {
    totalSkus: products.length,
    mainStock: products.reduce((sum, item) => sum + item.mainStock, 0),
    available: products.reduce((sum, item) => sum + item.available, 0),
    transferPending: products.reduce((sum, item) => sum + item.transferPending, 0),
    riskStock: products.reduce(
      (sum, item) =>
        sum + item.returned + item.warrantyClaim + item.disposal,
      0
    ),
    lowStock: products.filter(item =>
      ["Low Stock", "Reorder", "Expiry Watch"].includes(item.state)
    ).length
  };
}

function mainInvMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function findMainInventoryItem(sku) {
  return TRENZ_MAIN_INVENTORY_DATA.products.find((item) => item.sku === sku);
}
function getMainInventoryTotals() {
  const products = TRENZ_MAIN_INVENTORY_DATA.products;

  return {
    totalSkus: products.length,
    mainStock: products.reduce((sum, item) => sum + item.mainStock, 0),
    available: products.reduce((sum, item) => sum + item.available, 0),
    transferPending: products.reduce((sum, item) => sum + item.transferPending, 0),
    riskStock: products.reduce(
      (sum, item) => sum + item.returned + item.warrantyClaim + item.disposal,
      0
    ),
    lowStock: products.filter(item =>
      ["Low Stock", "Reorder", "Expiry Watch"].includes(item.state)
    ).length
  };
}

function findMainInventoryItem(sku) {
  return TRENZ_MAIN_INVENTORY_DATA.products.find(
    item => item.sku === sku
  );
}