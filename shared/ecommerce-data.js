const TRENZ_ECOMMERCE_DATA = {
  branches: [
    {
      id: "anna-nagar",
      name: "BEST CHOICE ANNA NAGAR BRANCH",
      area: "Anna Nagar, Chennai",
      speed: "Today pickup",
      availableItems: 5842
    },
    {
      id: "padi",
      name: "PADI BRANCH",
      area: "Padi, Chennai",
      speed: "Today pickup",
      availableItems: 4218
    },
    {
      id: "spencer",
      name: "SPENCER",
      area: "Spencer Plaza, Chennai",
      speed: "Express delivery",
      availableItems: 3984
    }
  ],

  popularSearches: [
    "cotton shirts",
    "fast charger",
    "herbal face cream",
    "wallet",
    "denim jacket",
    "lipstick",
    "earbuds"
  ],

  recentSearches: [
    "men shirt white",
    "nykaa style cosmetics",
    "usb c charger",
    "leather wallet"
  ],

  categories: [
    {
      id: "clothing",
      name: "Clothing",
      subtitle: "Shirts, jackets, daily wear",
      color: "indigo"
    },
    {
      id: "electronics",
      name: "Electronics",
      subtitle: "Chargers, earbuds, gadgets",
      color: "cyan"
    },
    {
      id: "cosmetics",
      name: "Cosmetics",
      subtitle: "Beauty, skincare, lipstick",
      color: "fuchsia"
    },
    {
      id: "accessories",
      name: "Accessories",
      subtitle: "Wallets, belts, add-ons",
      color: "emerald"
    }
  ],

  products: [
    {
      id: "prd-shirt-white",
      sku: "CLO-SHT-MEN-WHT-M",
      name: "Men Cotton Shirt",
      brand: "TRENZ Basics",
      category: "Clothing",
      variant: "White / M",
      price: 1299,
      mrp: 1599,
      discount: 19,
      gst: 5,
      rating: 4.3,
      reviews: 128,
      badge: "Low stock",
      tags: ["new", "featured"],
      imageCode: "CL",
      description: "Soft cotton shirt designed for Chennai weather, office wear and daily comfort.",
      bullets: [
        "Breathable cotton fabric",
        "Regular fit",
        "Size exchange available",
        "Ideal for office and casual wear"
      ],
      returnRule: "Exchange allowed within policy",
      branchStock: {
        "anna-nagar": 18,
        padi: 24,
        spencer: 11
      },
      visible: true,
      bestseller: true,
      newest: true,
      offer: true
    },
    {
      id: "prd-denim-jacket",
      sku: "CLO-JKT-DNM-BLU-L",
      name: "Denim Jacket",
      brand: "Urban TRENZ",
      category: "Clothing",
      variant: "Blue / L",
      price: 2499,
      mrp: 2999,
      discount: 17,
      gst: 5,
      rating: 4.6,
      reviews: 84,
      badge: "Best seller",
      tags: ["bestseller", "featured"],
      imageCode: "CL",
      description: "Classic blue denim jacket with a structured fit and durable stitching.",
      bullets: [
        "Premium denim feel",
        "Size exchange available",
        "Best paired with casual wear",
        "Branch pickup available"
      ],
      returnRule: "Exchange allowed within policy",
      branchStock: {
        "anna-nagar": 24,
        padi: 18,
        spencer: 14
      },
      visible: true,
      bestseller: true,
      newest: false,
      offer: true
    },
    {
      id: "prd-earbuds",
      sku: "ELE-EAR-NSP-BLK",
      name: "NoiseShield Earbuds Pro",
      brand: "SoundMax",
      category: "Electronics",
      variant: "Black",
      price: 3499,
      mrp: 3999,
      discount: 13,
      gst: 18,
      rating: 4.7,
      reviews: 256,
      badge: "Top rated",
      tags: ["bestseller", "featured"],
      imageCode: "EL",
      description: "Wireless earbuds with noise cancellation, long battery life and warranty support.",
      bullets: [
        "Active noise cancellation",
        "12-month warranty",
        "Serial verification at dispatch",
        "Fast charging case"
      ],
      returnRule: "Warranty claim only after verification",
      branchStock: {
        "anna-nagar": 32,
        padi: 28,
        spencer: 19
      },
      visible: true,
      bestseller: true,
      newest: false,
      offer: true
    },
    {
      id: "prd-charger",
      sku: "ELE-CHG-USB45W",
      name: "USB-C Fast Charger 45W",
      brand: "VoltPlus",
      category: "Electronics",
      variant: "Black",
      price: 1499,
      mrp: 1799,
      discount: 17,
      gst: 18,
      rating: 4.2,
      reviews: 62,
      badge: "Few left",
      tags: ["offer"],
      imageCode: "EL",
      description: "Compact fast charger compatible with phones, tablets and accessories.",
      bullets: [
        "45W fast charging",
        "Warranty supported",
        "Compact travel-ready design",
        "Limited online availability"
      ],
      returnRule: "Warranty claim only after verification",
      branchStock: {
        "anna-nagar": 7,
        padi: 4,
        spencer: 2
      },
      visible: true,
      bestseller: false,
      newest: false,
      offer: true
    },
    {
      id: "prd-face-cream",
      sku: "COS-FC-HERBAL100",
      name: "Herbal Face Cream 100ml",
      brand: "GlowHerb",
      category: "Cosmetics",
      variant: "Batch COS-TN-884",
      price: 649,
      mrp: 799,
      discount: 19,
      gst: 18,
      rating: 4.1,
      reviews: 193,
      badge: "Limited offer",
      tags: ["new", "offer", "featured"],
      imageCode: "CO",
      description: "Herbal face cream with aloe vera and neem extracts for daily skincare.",
      bullets: [
        "Aloe vera and neem extracts",
        "Batch tracked",
        "Expiry monitored",
        "Hygiene return restricted"
      ],
      returnRule: "No return after opening due to hygiene policy",
      branchStock: {
        "anna-nagar": 64,
        padi: 48,
        spencer: 52
      },
      visible: true,
      bestseller: true,
      newest: true,
      offer: true
    },
    {
      id: "prd-lipstick",
      sku: "COS-LIP-MAT-RED",
      name: "Matte Lipstick",
      brand: "ColorAura",
      category: "Cosmetics",
      variant: "Red",
      price: 499,
      mrp: 599,
      discount: 17,
      gst: 18,
      rating: 4.4,
      reviews: 144,
      badge: "New shade",
      tags: ["new"],
      imageCode: "CO",
      description: "Long-lasting matte lipstick with rich pigment and smooth finish.",
      bullets: [
        "Long-lasting color",
        "Smooth matte finish",
        "Batch tracked",
        "Hygiene return restricted"
      ],
      returnRule: "No return after opening due to hygiene policy",
      branchStock: {
        "anna-nagar": 38,
        padi: 22,
        spencer: 34
      },
      visible: true,
      bestseller: false,
      newest: true,
      offer: false
    },
    {
      id: "prd-wallet",
      sku: "ACC-WLT-BRN-LEA",
      name: "Brown Leather Wallet",
      brand: "TRENZ Classic",
      category: "Accessories",
      variant: "Brown",
      price: 999,
      mrp: 1199,
      discount: 17,
      gst: 12,
      rating: 4.5,
      reviews: 98,
      badge: "Few left",
      tags: ["bestseller", "offer"],
      imageCode: "AC",
      description: "Compact leather wallet with multiple card slots and premium finish.",
      bullets: [
        "Genuine leather texture",
        "8-card layout",
        "Gift-friendly product",
        "Conditional return if unused"
      ],
      returnRule: "Return allowed if unused and tagged",
      branchStock: {
        "anna-nagar": 22,
        padi: 16,
        spencer: 8
      },
      visible: true,
      bestseller: true,
      newest: false,
      offer: true
    },
    {
      id: "prd-belt",
      sku: "ACC-BLT-BLK-L",
      name: "Black Formal Belt",
      brand: "TRENZ Classic",
      category: "Accessories",
      variant: "Black / L",
      price: 799,
      mrp: 999,
      discount: 20,
      gst: 12,
      rating: 4.3,
      reviews: 76,
      badge: "Deal",
      tags: ["offer"],
      imageCode: "AC",
      description: "Premium black formal belt with auto-lock buckle and durable finish.",
      bullets: [
        "Formal everyday style",
        "Auto-lock buckle",
        "Conditional return if unused",
        "Branch pickup available"
      ],
      returnRule: "Return allowed if unused and tagged",
      branchStock: {
        "anna-nagar": 44,
        padi: 38,
        spencer: 28
      },
      visible: true,
      bestseller: false,
      newest: false,
      offer: true
    }
  ],

  cart: [
    {
      productId: "prd-denim-jacket",
      qty: 1,
      branchId: "anna-nagar",
      state: "Reserved"
    },
    {
      productId: "prd-face-cream",
      qty: 2,
      branchId: "anna-nagar",
      state: "Reserved"
    }
  ],

  customer: {
    id: "CRM-TN-10482",
    name: "Priya Raman",
    phone: "+91 98765 43210",
    email: "priya.raman@email.com",
    tier: "Gold",
    points: 1840,
    totalOrders: 24,
    totalSpend: 82430,
    defaultAddress: "Anna Nagar West, Chennai - 600040",
    addresses: [
      "Anna Nagar West, Chennai - 600040",
      "Kilpauk Garden Road, Chennai - 600010"
    ],
    wishlist: ["prd-earbuds", "prd-wallet", "prd-lipstick"],
    savedProducts: ["prd-shirt-white", "prd-face-cream"]
  },

  order: {
    id: "ORD-TN-78412",
    invoice: "INV-TN-78412",
    customerId: "CRM-TN-10482",
    branchId: "anna-nagar",
    status: "Picking",
    placedAt: "10:36 AM",
    delivery: "Today by 8 PM",
    payment: "UPI Paid",
    steps: ["Placed", "Picking", "Packed", "Out for Delivery", "Delivered"],
    activeStep: 1,
    items: [
      {
        productId: "prd-denim-jacket",
        qty: 1
      },
      {
        productId: "prd-face-cream",
        qty: 2
      }
    ]
  },

  returns: [
    {
      id: "RET-TN-20491",
      orderId: "ORD-TN-78412",
      productId: "prd-denim-jacket",
      reason: "Size issue",
      status: "Approved",
      refundStatus: "Exchange initiated",
      requestDate: "Today",
      inventoryAction: "Returned → Inspection"
    },
    {
      id: "RET-TN-20492",
      orderId: "ORD-TN-78104",
      productId: "prd-earbuds",
      reason: "Audio issue",
      status: "Under review",
      refundStatus: "Warranty validation",
      requestDate: "Yesterday",
      inventoryAction: "Warranty Claim"
    },
    {
      id: "RET-TN-20493",
      orderId: "ORD-TN-77982",
      productId: "prd-face-cream",
      reason: "Skin reaction",
      status: "Manager review",
      refundStatus: "Exception pending",
      requestDate: "2 days ago",
      inventoryAction: "Disposal"
    }
  ],

  returnAnalytics: {
    returnRate: "8.6%",
    refundAmount: 384250,
    mostReturnedProducts: [
      "Denim Jacket",
      "NoiseShield Earbuds Pro",
      "Herbal Face Cream 100ml"
    ]
  }
};

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getProduct(productId) {
  return TRENZ_ECOMMERCE_DATA.products.find((product) => product.id === productId);
}

function getBranch(branchId) {
  return TRENZ_ECOMMERCE_DATA.branches.find((branch) => branch.id === branchId);
}

function getVisibleProducts() {
  return TRENZ_ECOMMERCE_DATA.products.filter((product) => product.visible);
}

function getCartItems() {
  return TRENZ_ECOMMERCE_DATA.cart.map((cartItem) => {
    const product = getProduct(cartItem.productId);
    const branch = getBranch(cartItem.branchId);

    return {
      ...cartItem,
      product,
      branch
    };
  });
}

function getCartTotals() {
  const items = getCartItems();

  const subtotal = items.reduce((sum, item) => {
    return sum + item.product.price * item.qty;
  }, 0);

  const gst = items.reduce((sum, item) => {
    return sum + item.product.price * item.qty * (item.product.gst / 100);
  }, 0);

  const discount = 150;
  const deliveryFee = subtotal > 999 ? 0 : 49;

  return {
    subtotal,
    gst: Math.round(gst),
    discount,
    deliveryFee,
    total: Math.round(subtotal + gst + deliveryFee - discount)
  };
}

function branchStockText(product, branchId = "anna-nagar") {
  const qty = product.branchStock[branchId] || 0;

  if (qty <= 0) return "Out of stock";
  if (qty <= 10) return `Only ${qty} left`;
  return `${qty} available`;
}
