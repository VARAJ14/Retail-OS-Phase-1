const TRENZOS_INVENTORY_DATA = {
  branch: {
    id: "anna-nagar",
    name: "BEST CHOICE ANNA NAGAR BRANCH",
    city: "Chennai",
    manager: "S. Karthik"
  },

  stocks: [
    {
      sku: "CLO-SHT-MEN-WHT-M",
      name: "Men Cotton Shirt",
      category: "Clothing",
      variant: "White / M",
      mainStock: 320,
      branchStock: 18,
      reserved: 3,
      sold: 36,
      state: "Low Stock",
      posAvailable: true,
      websiteVisible: true,
      returnRule: "Exchange allowed",
      price: 1299,
      gst: 5,
      lastMovement: "Transfer received · 09:10 AM"
    },
    {
      sku: "CLO-JKT-DNM-BLU-L",
      name: "Denim Jacket",
      category: "Clothing",
      variant: "Blue / L",
      mainStock: 140,
      branchStock: 24,
      reserved: 1,
      sold: 12,
      state: "Available",
      posAvailable: true,
      websiteVisible: true,
      returnRule: "Exchange allowed",
      price: 2499,
      gst: 5,
      lastMovement: "POS sale · 10:22 AM"
    },
    {
      sku: "ELE-CHG-USB45W",
      name: "USB-C Fast Charger 45W",
      category: "Electronics",
      variant: "Black",
      mainStock: 88,
      branchStock: 7,
      reserved: 0,
      sold: 19,
      state: "Critical",
      posAvailable: true,
      websiteVisible: false,
      returnRule: "Warranty claim",
      price: 1499,
      gst: 18,
      lastMovement: "Website stock hidden · Low qty"
    },
    {
      sku: "ELE-EAR-NSP-BLK",
      name: "NoiseShield Earbuds Pro",
      category: "Electronics",
      variant: "Black",
      mainStock: 210,
      branchStock: 32,
      reserved: 8,
      sold: 28,
      state: "Available",
      posAvailable: true,
      websiteVisible: true,
      returnRule: "Warranty claim",
      price: 3499,
      gst: 18,
      lastMovement: "POS sale · 10:36 AM"
    },
    {
      sku: "COS-FC-HERBAL100",
      name: "Herbal Face Cream 100ml",
      category: "Cosmetics",
      variant: "Batch COS-TN-884",
      mainStock: 480,
      branchStock: 64,
      reserved: 6,
      sold: 41,
      state: "Expiry Watch",
      posAvailable: true,
      websiteVisible: true,
      returnRule: "Hygiene restricted",
      price: 649,
      gst: 18,
      expiry: "22 days",
      lastMovement: "Campaign recommended"
    },
    {
      sku: "COS-LIP-MAT-RED",
      name: "Matte Lipstick",
      category: "Cosmetics",
      variant: "Red / Batch COS-TN-902",
      mainStock: 260,
      branchStock: 38,
      reserved: 2,
      sold: 24,
      state: "Available",
      posAvailable: true,
      websiteVisible: true,
      returnRule: "Hygiene restricted",
      price: 499,
      gst: 18,
      expiry: "74 days",
      lastMovement: "Website order · 09:58 AM"
    },
    {
      sku: "ACC-WLT-BRN-LEA",
      name: "Brown Leather Wallet",
      category: "Accessories",
      variant: "Brown",
      mainStock: 95,
      branchStock: 22,
      reserved: 4,
      sold: 18,
      state: "Reorder",
      posAvailable: true,
      websiteVisible: true,
      returnRule: "Conditional return",
      price: 999,
      gst: 12,
      lastMovement: "Low stock alert"
    },
    {
      sku: "ACC-BLT-BLK-L",
      name: "Black Formal Belt",
      category: "Accessories",
      variant: "Black / L",
      mainStock: 130,
      branchStock: 44,
      reserved: 3,
      sold: 16,
      state: "Available",
      posAvailable: true,
      websiteVisible: true,
      returnRule: "Conditional return",
      price: 799,
      gst: 12,
      lastMovement: "POS sale · 10:05 AM"
    }
  ],

  movements: [
    {
      id: "MOV-AN-901",
      event: "POS Sale",
      sku: "CLO-SHT-MEN-WHT-M",
      from: "Branch Available",
      to: "Sold",
      qty: 1,
      impact: "Website stock reduced, CRM updated, analytics logged",
      time: "10:42 AM"
    },
    {
      id: "MOV-AN-902",
      event: "Cart Reservation",
      sku: "COS-FC-HERBAL100",
      from: "Available",
      to: "Reserved",
      qty: 2,
      impact: "Branch stock held for checkout",
      time: "10:36 AM"
    },
    {
      id: "MOV-AN-903",
      event: "Incoming Transfer",
      sku: "CLO-SHT-MEN-WHT-M",
      from: "Main Inventory",
      to: "BEST CHOICE ANNA NAGAR BRANCH",
      qty: 80,
      impact: "POS availability increased after receiving",
      time: "09:10 AM"
    },
    {
      id: "MOV-AN-904",
      event: "Website Visibility Update",
      sku: "ELE-CHG-USB45W",
      from: "Visible Online",
      to: "Hidden Online",
      qty: 7,
      impact: "Website stock hidden due to critical quantity",
      time: "09:02 AM"
    }
  ],

  syncImpact: {
    selectedSale: {
      invoice: "INV-AN-58292",
      customer: "Priya Raman",
      customerId: "CRM-TN-10482",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      sku: "CLO-SHT-MEN-WHT-M",
      item: "Men Cotton Shirt - White / M",
      qty: 1,
      amount: 1299,
      previousState: "Reserved",
      nextState: "Sold",
      websiteAction: "Stock reduced",
      crmAction: "Purchase added",
      analyticsAction: "Sale logged"
    }
  }
};

function inventoryINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getInventoryTotals() {
  const stocks = TRENZOS_INVENTORY_DATA.stocks;

  return {
    totalSkus: stocks.length,
    branchStock: stocks.reduce((sum, item) => sum + item.branchStock, 0),
    reserved: stocks.reduce((sum, item) => sum + item.reserved, 0),
    soldToday: stocks.reduce((sum, item) => sum + item.sold, 0),
    lowStock: stocks.filter((item) => ["Low Stock", "Critical", "Reorder", "Expiry Watch"].includes(item.state)).length,
    websiteVisible: stocks.filter((item) => item.websiteVisible).length
  };
}

function getInventoryBySku(sku) {
  return TRENZOS_INVENTORY_DATA.stocks.find((item) => item.sku === sku);
}
