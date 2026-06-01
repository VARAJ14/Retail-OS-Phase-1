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
      sku: "CLO-SHT-MEN-WHT-M",
      name: "Men Cotton Shirt",
      category: "Clothing",
      variant: "White / M",
      price: 1299,
      gst: 5,
      stock: 18,
      state: "Available",
      returnRule: "Exchange allowed"
    },
    {
      sku: "ELE-CHG-USB45W",
      name: "USB-C Fast Charger 45W",
      category: "Electronics",
      variant: "Black",
      price: 1499,
      gst: 18,
      stock: 7,
      state: "Low Stock",
      returnRule: "Warranty claim"
    },
    {
      sku: "COS-FC-HERBAL100",
      name: "Herbal Face Cream 100ml",
      category: "Cosmetics",
      variant: "Batch COS-TN-884",
      price: 649,
      gst: 18,
      stock: 64,
      state: "Expiry Watch",
      returnRule: "Hygiene restricted"
    },
    {
      sku: "ACC-WLT-BRN-LEA",
      name: "Brown Leather Wallet",
      category: "Accessories",
      variant: "Brown",
      price: 999,
      gst: 12,
      stock: 22,
      state: "Available",
      returnRule: "Conditional return"
    }
  ],

  customer: {
    id: "CRM-TN-10482",
    name: "Priya Raman",
    phone: "+91 98765 43210",
    tier: "Gold",
    points: 1840,
    lastVisit: "Anna Nagar",
    returnRisk: "Normal"
  },

  cart: [
    {
      sku: "CLO-SHT-MEN-WHT-M",
      name: "Men Cotton Shirt",
      qty: 1,
      price: 1299,
      gst: 5
    },
    {
      sku: "COS-FC-HERBAL100",
      name: "Herbal Face Cream 100ml",
      qty: 2,
      price: 649,
      gst: 18
    }
  ],

  invoices: [
    {
      id: "INV-AN-58291",
      customer: "Priya Raman",
      amount: 2597,
      status: "Paid",
      time: "10:42 AM",
      sync: "CRM + Analytics Updated"
    },
    {
      id: "INV-AN-58290",
      customer: "Walk-in Customer",
      amount: 1499,
      status: "Paid",
      time: "10:31 AM",
      sync: "Analytics Updated"
    },
    {
      id: "INV-AN-58289",
      customer: "Suresh Kumar",
      amount: 999,
      status: "Return Eligible",
      time: "10:14 AM",
      sync: "CRM Updated"
    }
  ],

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

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function calculateCartTotals(cart) {
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
