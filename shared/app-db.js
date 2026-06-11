(function () {
  const DB_KEYS = {
    staff: "trenzos_staff",
    products: "trenzos_products",
    inventory: "trenzos_inventory",
    orders: "trenzos_orders",
    customers: "trenzos_customers",
    returns: "trenzos_returns",
    cart: "trenzos_cart",
    invoices: "trenzos_invoices" ,
    payments: "trenzos_payments" ,
    session: "trenzos_retail_session"
  };

  const BRANCHES = [
    "Select All",
    "BEST CHOICE ANNA NAGAR BRANCH",
    "PADI BRANCH",
    "SPENCER"
  ];

  const DEFAULT_STAFF = [
    {
      id: "STF-001",
      name: "R. Santhosh",
      email: "owner@trenzosretail.com",
      phone: "+91 90000 11111",
      role: "Owner",
      branch: "Select All",
      status: "Active",
      createdAt: "2026-01-01T09:00:00.000Z"
    },
    {
      id: "STF-002",
      name: "S. Karthik",
      email: "manager@trenzosretail.com",
      phone: "+91 90000 22222",
      role: "Manager",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      status: "Active",
      createdAt: "2026-01-01T09:05:00.000Z"
    },
    {
      id: "STF-003",
      name: "M. Divya",
      email: "cashier@trenzosretail.com",
      phone: "+91 90000 33333",
      role: "Cashier",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      status: "Active",
      createdAt: "2026-01-01T09:10:00.000Z"
    },
    {
      id: "STF-004",
      name: "K. Nisha",
      email: "staff@trenzosretail.com",
      phone: "+91 90000 44444",
      role: "Staff",
      branch: "SPENCER",
      status: "Active",
      createdAt: "2026-01-01T09:15:00.000Z"
    }
  ];

  const DEFAULT_PRODUCTS = [
    {
      id: "PRD-001",
      sku: "CLO-SHT-MEN-WHT-M",
      name: "Men Cotton Shirt",
      brand: "TRENZ Basics",
      category: "Clothing",
      variant: "White / M",
      price: 1299,
      mrp: 1599,
      gst: 5,
      stock: 320,
      state: "Available",
      websiteVisible: true,
      posVisible: true,
      branchStock: {
        "BEST CHOICE ANNA NAGAR BRANCH": 18,
        "PADI BRANCH": 24,
        "SPENCER": 11
      }
    },
    {
      id: "PRD-002",
      sku: "ELE-EAR-NSP-BLK",
      name: "NoiseShield Earbuds Pro",
      brand: "SoundMax",
      category: "Electronics",
      variant: "Black",
      price: 3499,
      mrp: 3999,
      gst: 18,
      stock: 210,
      state: "Available",
      websiteVisible: true,
      posVisible: true,
      branchStock: {
        "BEST CHOICE ANNA NAGAR BRANCH": 32,
        "PADI BRANCH": 28,
        "SPENCER": 19
      }
    },
    {
      id: "PRD-003",
      sku: "COS-FC-HERBAL100",
      name: "Herbal Face Cream 100ml",
      brand: "GlowHerb",
      category: "Cosmetics",
      variant: "Batch COS-TN-884",
      price: 649,
      mrp: 799,
      gst: 18,
      stock: 480,
      state: "Available",
      websiteVisible: true,
      posVisible: true,
      branchStock: {
        "BEST CHOICE ANNA NAGAR BRANCH": 64,
        "PADI BRANCH": 48,
        "SPENCER": 52
      }
    },
    {
      id: "PRD-004",
      sku: "ACC-WLT-BRN-LEA",
      name: "Brown Leather Wallet",
      brand: "TRENZ Classic",
      category: "Accessories",
      variant: "Brown",
      price: 999,
      mrp: 1199,
      gst: 12,
      stock: 95,
      state: "Available",
      websiteVisible: true,
      posVisible: true,
      branchStock: {
        "BEST CHOICE ANNA NAGAR BRANCH": 22,
        "PADI BRANCH": 16,
        "SPENCER": 8
      }
    }
  ];

  const DEFAULT_ORDERS = [
    {
      id: "ORD-TN-78412",
      invoice: "INV-TN-78412",
      channel: "Website",
      customer: "Priya Raman",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      amount: 4177,
      status: "Picking",
      stockState: "Reserved",
      createdAt: "2026-01-02T10:36:00.000Z"
    },
    {
      id: "POS-AN-58291",
      invoice: "INV-AN-58291",
      channel: "POS",
      customer: "Priya Raman",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      amount: 2597,
      status: "Completed",
      stockState: "Sold",
      createdAt: "2026-01-02T10:42:00.000Z"
    }
  ];

  const DEFAULT_CUSTOMERS = [
    {
      id: "CRM-TN-10482",
      name: "Priya Raman",
      phone: "+91 98765 43210",
      email: "priya.raman@email.com",
      tier: "Gold",
      points: 1840,
      orders: 24,
      spend: 82430,
      returns: 3
    }
  ];

  const DEFAULT_RETURNS = [
    {
      id: "RET-TN-20491",
      orderId: "ORD-TN-78412",
      product: "Denim Jacket",
      customer: "Priya Raman",
      reason: "Size issue",
      status: "Pending Approval",
      refundStatus: "Exchange pending",
      inventoryAction: "Returned → Inspection",
      createdAt: "2026-01-02T11:00:00.000Z"
    }
  ];

  function parse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function get(key, fallback = []) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return parse(raw, fallback);
  }

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("trenz-db-updated", { detail: { key, value } }));
  }

  function remove(key) {
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent("trenz-db-updated", { detail: { key, value: null } }));
  }

  function createId(prefix) {
    return `${prefix}-${Date.now().toString().slice(-6)}`;
  }

  function seed() {
    if (!localStorage.getItem(DB_KEYS.staff)) set(DB_KEYS.staff, DEFAULT_STAFF);
    if (!localStorage.getItem(DB_KEYS.products)) set(DB_KEYS.products, DEFAULT_PRODUCTS);
    if (!localStorage.getItem(DB_KEYS.inventory)) set(DB_KEYS.inventory, DEFAULT_PRODUCTS);
    if (!localStorage.getItem(DB_KEYS.orders)) set(DB_KEYS.orders, DEFAULT_ORDERS);
    if (!localStorage.getItem(DB_KEYS.customers)) set(DB_KEYS.customers, DEFAULT_CUSTOMERS);
    if (!localStorage.getItem(DB_KEYS.returns)) set(DB_KEYS.returns, DEFAULT_RETURNS);
    if (!localStorage.getItem(DB_KEYS.cart)) set(DB_KEYS.cart, []);
    if (!localStorage.getItem(DB_KEYS.invoices)) set(DB_KEYS.invoices, []);
    if (!localStorage.getItem(DB_KEYS.payments)) set(DB_KEYS.payments, []);
  }

  function resetDemoData() {
    set(DB_KEYS.staff, DEFAULT_STAFF);
    set(DB_KEYS.products, DEFAULT_PRODUCTS);
    set(DB_KEYS.inventory, DEFAULT_PRODUCTS);
    set(DB_KEYS.orders, DEFAULT_ORDERS);
    set(DB_KEYS.customers, DEFAULT_CUSTOMERS);
    set(DB_KEYS.returns, DEFAULT_RETURNS);
    set(DB_KEYS.cart, []);
     }

  seed();

  window.TRENZ_DB_KEYS = DB_KEYS;
  window.TRENZ_BRANCHES = BRANCHES;
  window.trenzDbGet = get;
  window.trenzDbSet = set;
  window.trenzDbRemove = remove;
  window.trenzCreateId = createId;
  window.trenzResetDemoData = resetDemoData;
})();
