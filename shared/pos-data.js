const TRENZOS_POS_DATA = {
  branch: {
    id: "anna-nagar",
    name: "BEST CHOICE ANNA NAGAR BRANCH",
    city: "Chennai",
    counter: "POS-AN-01",
    cashier: "M. Divya",
    shift: "Morning Shift"
  },

  products: [
    {
      id: "PRD-001",
      sku: "CLO-SHT-MEN-WHT-M",
      barcode: "890100110001",
      name: "Men Cotton Shirt",
      brand: "TRENZ Basics",
      category: "Clothing",
      variant: "White / M",
      price: 1299,
      gst: 5,
      inclusiveGst: false,
      stock: 18,
      state: "Available",
      returnRule: "Exchange allowed",
      details: "Cotton shirt with size/color variants and standard GST.",
      variants: ["White / S", "White / M", "White / L", "Blue / M"]
    },
    {
      id: "PRD-002",
      sku: "ELE-CHG-USB45W",
      barcode: "890100110002",
      name: "USB-C Fast Charger 45W",
      brand: "VoltMax",
      category: "Electronics",
      variant: "Black",
      price: 1499,
      gst: 18,
      inclusiveGst: false,
      stock: 7,
      state: "Low Stock",
      returnRule: "Warranty claim",
      details: "Serial controlled electronics item with warranty validation.",
      variants: ["Black", "White"]
    },
    {
      id: "PRD-003",
      sku: "COS-FC-HERBAL100",
      barcode: "890100110003",
      name: "Herbal Face Cream 100ml",
      brand: "GlowHerb",
      category: "Cosmetics",
      variant: "Batch COS-TN-884",
      price: 649,
      gst: 18,
      inclusiveGst: true,
      stock: 64,
      state: "Expiry Watch",
      returnRule: "Hygiene restricted",
      details: "Batch and expiry controlled cosmetics item with inclusive GST.",
      variants: ["Batch COS-TN-884", "Batch COS-TN-885"]
    },
    {
      id: "PRD-004",
      sku: "ACC-WLT-BRN-LEA",
      barcode: "890100110004",
      name: "Brown Leather Wallet",
      brand: "TRENZ Classic",
      category: "Accessories",
      variant: "Brown",
      price: 999,
      gst: 12,
      inclusiveGst: false,
      stock: 22,
      state: "Available",
      returnRule: "Conditional return",
      details: "Accessory item eligible for condition-based return.",
      variants: ["Brown", "Black", "Tan"]
    }
  ],

  customers: [
    {
      id: "CRM-TN-10482",
      name: "Priya Raman",
      phone: "+91 98765 43210",
      email: "priya.raman@email.com",
      tier: "Gold",
      points: 1840,
      orders: 24,
      spend: 82430,
      returns: 3,
      lastVisit: "Anna Nagar",
      returnRisk: "Normal",
      history: [
        { invoice: "INV-AN-58291", amount: 2597, items: 2, createdAt: "2026-01-02T10:42:00.000Z" },
        { invoice: "INV-AN-58289", amount: 999, items: 1, createdAt: "2026-01-02T10:14:00.000Z" }
      ]
    },
    {
      id: "CRM-TN-20918",
      name: "Arun Prakash",
      phone: "+91 98401 22110",
      email: "arun.prakash@email.com",
      tier: "Silver",
      points: 620,
      orders: 8,
      spend: 21480,
      returns: 1,
      lastVisit: "Padi",
      returnRisk: "Normal",
      history: []
    }
  ],

  get customer() {
    return this.customers[0];
  },

  cart: [
    {
      id: "PRD-001",
      sku: "CLO-SHT-MEN-WHT-M",
      barcode: "890100110001",
      name: "Men Cotton Shirt",
      category: "Clothing",
      variant: "White / M",
      qty: 1,
      price: 1299,
      gst: 5,
      inclusiveGst: false,
      note: ""
    },
    {
      id: "PRD-003",
      sku: "COS-FC-HERBAL100",
      barcode: "890100110003",
      name: "Herbal Face Cream 100ml",
      category: "Cosmetics",
      variant: "Batch COS-TN-884",
      qty: 2,
      price: 649,
      gst: 18,
      inclusiveGst: true,
      note: "Expiry checked"
    }
  ],

  invoices: [
    {
      id: "INV-AN-58291",
      orderId: "POS-AN-58291",
      customer: "Priya Raman",
      customerId: "CRM-TN-10482",
      salesperson: "M. Divya",
      amount: 2597,
      status: "Paid",
      time: "10:42 AM",
      sync: "CRM + Analytics Updated",
      items: [
        { id: "PRD-001", sku: "CLO-SHT-MEN-WHT-M", name: "Men Cotton Shirt", qty: 1, price: 1299, gst: 5 },
        { id: "PRD-003", sku: "COS-FC-HERBAL100", name: "Herbal Face Cream 100ml", qty: 2, price: 649, gst: 18, inclusiveGst: true }
      ],
      payments: [{ id: "PAY-SEED-1", method: "UPI", amount: 2597, reference: "UPI58291" }],
      taxSummary: [
        { slab: "5%", taxable: 1299, gst: 65, total: 1364 },
        { slab: "18%", taxable: 1100, gst: 198, total: 1298 }
      ],
      createdAt: "2026-01-02T10:42:00.000Z"
    },
    {
      id: "INV-AN-58290",
      orderId: "POS-AN-58290",
      customer: "Walk-in Customer",
      customerId: "Guest",
      salesperson: "M. Divya",
      amount: 1499,
      status: "Paid",
      time: "10:31 AM",
      sync: "Analytics Updated",
      items: [
        { id: "PRD-002", sku: "ELE-CHG-USB45W", name: "USB-C Fast Charger 45W", qty: 1, price: 1499, gst: 18 }
      ],
      payments: [{ id: "PAY-SEED-2", method: "Cash", amount: 1499, reference: "CASH" }],
      taxSummary: [{ slab: "18%", taxable: 1499, gst: 270, total: 1769 }],
      createdAt: "2026-01-02T10:31:00.000Z"
    },
    {
      id: "INV-AN-58289",
      orderId: "POS-AN-58289",
      customer: "Suresh Kumar",
      customerId: "CRM-TN-44021",
      salesperson: "M. Divya",
      amount: 999,
      status: "Return Eligible",
      time: "10:14 AM",
      sync: "CRM Updated",
      items: [
        { id: "PRD-004", sku: "ACC-WLT-BRN-LEA", name: "Brown Leather Wallet", qty: 1, price: 999, gst: 12 }
      ],
      payments: [{ id: "PAY-SEED-3", method: "Card", amount: 999, reference: "CARD58289" }],
      taxSummary: [{ slab: "12%", taxable: 999, gst: 120, total: 1119 }],
      createdAt: "2026-01-02T10:14:00.000Z"
    }
  ],

  coupons: [
    { code: "POS10", label: "10% POS launch offer", type: "percent", value: 10, maxDiscount: 500, minTotal: 999, active: true },
    { code: "FLAT250", label: "Flat customer delight discount", type: "amount", value: 250, maxDiscount: 250, minTotal: 1999, active: true }
  ],

  giftCards: [
    { code: "GC1000", customer: "Priya Raman", balance: 1000, active: true },
    { code: "GC2500", customer: "Corporate Walk-in", balance: 2500, active: true }
  ],

  taxSlabs: [
    { label: "GST 0%", rate: 0 },
    { label: "GST 5%", rate: 5 },
    { label: "GST 12%", rate: 12 },
    { label: "GST 18%", rate: 18 },
    { label: "GST 28%", rate: 28 }
  ],

  paymentMethods: ["Cash", "UPI", "Card", "Gift Card", "Customer Credit"],
  returnModes: ["Full Return", "Partial Return", "Exchange", "Return Without Invoice"],

  staffTasks: [
    {
      id: "TASK-AN-101",
      title: "Receive transfer",
      item: "Men Cotton Shirt - White / M",
      qty: 80,
      priority: "High",
      module: "Branch Inventory",
      status: "Open"
    },
    {
      id: "TASK-AN-102",
      title: "Pack website order",
      item: "Herbal Face Cream 100ml",
      qty: 2,
      priority: "Medium",
      module: "Orders",
      status: "Open"
    },
    {
      id: "TASK-AN-103",
      title: "Inspect returned item",
      item: "Denim Jacket - Blue / L",
      qty: 1,
      priority: "High",
      module: "Returns",
      status: "Pending"
    },
    {
      id: "TASK-AN-104",
      title: "Update shelf count",
      item: "USB-C Fast Charger 45W",
      qty: 7,
      priority: "Low Stock",
      module: "Inventory",
      status: "Open"
    }
  ]
};

window.TRENZOS_POS_DATA = TRENZOS_POS_DATA;
window.TRENZ_POS_DATA = TRENZOS_POS_DATA;

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function calculateStaticCartTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const gst = cart.reduce((sum, item) => {
    return sum + item.price * item.qty * (item.gst / 100);
  }, 0);

  const loyaltyDiscount = 150;
  const total = subtotal + gst - loyaltyDiscount;

  return {
    subtotal,
    gst,
    loyaltyDiscount,
    total
  };
}
