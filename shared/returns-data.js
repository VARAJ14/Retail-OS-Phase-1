const TRENZ_RETURNS_DATA = {
  summary: {
    totalRequests: 42,
    pendingApproval: 18,
    approvedToday: 9,
    rejectedToday: 3,
    refundAmount: 384250,
    exchangeRequests: 14,
    warrantyClaims: 7,
    disposalItems: 5,
    returnRate: "8.6%"
  },

  branches: [
    {
      id: "anna-nagar",
      name: "BEST CHOICE ANNA NAGAR BRANCH",
      pending: 8,
      approved: 4,
      rejected: 1,
      refundValue: 124800
    },
    {
      id: "padi",
      name: "PADI BRANCH",
      pending: 6,
      approved: 3,
      rejected: 1,
      refundValue: 98250
    },
    {
      id: "spencer",
      name: "SPENCER",
      pending: 4,
      approved: 2,
      rejected: 1,
      refundValue: 161200
    }
  ],

  requests: [
    {
      id: "RET-TN-20491",
      orderId: "ORD-TN-78412",
      invoice: "INV-TN-78412",
      customer: "Priya Raman",
      customerId: "CRM-TN-10482",
      phone: "+91 98765 43210",
      branchId: "anna-nagar",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      product: "Denim Jacket",
      sku: "CLO-JKT-DNM-BLU-L",
      category: "Clothing",
      reason: "Size issue",
      resolution: "Exchange item",
      requestDate: "Today",
      amount: 2499,
      status: "Pending Approval",
      validation: "Eligible",
      inventoryAction: "Returned → Inspection",
      nextState: "Returned",
      refundStatus: "Exchange pending",
      risk: "Normal",
      priority: "High",
      rule: "Size exchange allowed after inspection"
    },
    {
      id: "RET-TN-20492",
      orderId: "ORD-TN-78104",
      invoice: "INV-TN-78104",
      customer: "Arun Prakash",
      customerId: "CRM-TN-20918",
      phone: "+91 98401 22110",
      branchId: "padi",
      branch: "PADI BRANCH",
      product: "NoiseShield Earbuds Pro",
      sku: "ELE-EAR-NSP-BLK",
      category: "Electronics",
      reason: "Audio issue",
      resolution: "Warranty claim",
      requestDate: "Yesterday",
      amount: 3499,
      status: "Under Review",
      validation: "Serial Required",
      inventoryAction: "Sold → Warranty Claim",
      nextState: "Warranty Claim",
      refundStatus: "Warranty validation",
      risk: "Normal",
      priority: "High",
      rule: "Serial verification and warranty validation required"
    },
    {
      id: "RET-TN-20493",
      orderId: "ORD-TN-77982",
      invoice: "INV-TN-77982",
      customer: "Meena Lakshmi",
      customerId: "CRM-TN-31844",
      phone: "+91 98844 77120",
      branchId: "spencer",
      branch: "SPENCER",
      product: "Herbal Face Cream 100ml",
      sku: "COS-FC-HERBAL100",
      category: "Cosmetics",
      reason: "Skin reaction",
      resolution: "Refund exception",
      requestDate: "2 days ago",
      amount: 649,
      status: "Manager Review",
      validation: "Restricted",
      inventoryAction: "Sold → Disposal",
      nextState: "Disposal",
      refundStatus: "Exception pending",
      risk: "Sensitive",
      priority: "Medium",
      rule: "Opened hygiene-sensitive product cannot be restocked"
    },
    {
      id: "RET-TN-20494",
      orderId: "ORD-TN-78022",
      invoice: "INV-TN-78022",
      customer: "Suresh Kumar",
      customerId: "CRM-TN-44021",
      phone: "+91 90031 88442",
      branchId: "anna-nagar",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      product: "Brown Leather Wallet",
      sku: "ACC-WLT-BRN-LEA",
      category: "Accessories",
      reason: "Changed mind",
      resolution: "Refund to original payment",
      requestDate: "Today",
      amount: 999,
      status: "Pending Approval",
      validation: "Condition Check",
      inventoryAction: "Sold → Inspection",
      nextState: "Returned",
      refundStatus: "Refund pending",
      risk: "Return-prone",
      priority: "Medium",
      rule: "Return allowed only if unused and tagged"
    },
    {
      id: "RET-TN-20495",
      orderId: "ORD-TN-78218",
      invoice: "INV-TN-78218",
      customer: "Jaya Sree",
      customerId: "CRM-TN-55321",
      phone: "+91 97910 11223",
      branchId: "padi",
      branch: "PADI BRANCH",
      product: "USB-C Fast Charger 45W",
      sku: "ELE-CHG-USB45W",
      category: "Electronics",
      reason: "Not charging",
      resolution: "Warranty claim",
      requestDate: "Today",
      amount: 1499,
      status: "Pending Approval",
      validation: "Serial Required",
      inventoryAction: "Sold → Warranty Claim",
      nextState: "Warranty Claim",
      refundStatus: "Warranty validation",
      risk: "Normal",
      priority: "High",
      rule: "Warranty claim requires product and serial verification"
    }
  ],

  activity: [
    {
      time: "11:10 AM",
      title: "Return approved",
      detail: "RET-TN-20491 approved for clothing exchange at Anna Nagar.",
      module: "Inventory + CRM"
    },
    {
      time: "10:58 AM",
      title: "Warranty review opened",
      detail: "RET-TN-20492 moved to warranty claim queue at Padi.",
      module: "Electronics"
    },
    {
      time: "10:42 AM",
      title: "Cosmetics exception flagged",
      detail: "RET-TN-20493 requires manager review before refund.",
      module: "Returns"
    },
    {
      time: "10:25 AM",
      title: "Refund pending",
      detail: "RET-TN-20494 waiting for item condition inspection.",
      module: "Finance"
    }
  ],

  analytics: {
    returnRate: "8.6%",
    refundAmount: 384250,
    mostReturnedProducts: [
      {
        product: "Denim Jacket",
        category: "Clothing",
        count: 18,
        reason: "Size issue"
      },
      {
        product: "NoiseShield Earbuds Pro",
        category: "Electronics",
        count: 11,
        reason: "Warranty issue"
      },
      {
        product: "Herbal Face Cream 100ml",
        category: "Cosmetics",
        count: 8,
        reason: "Skin reaction"
      }
    ],
    categoryBreakdown: [
      {
        category: "Clothing",
        rate: "9.2%",
        action: "Improve size guidance"
      },
      {
        category: "Electronics",
        rate: "6.8%",
        action: "Warranty verification"
      },
      {
        category: "Cosmetics",
        rate: "4.1%",
        action: "Hygiene exception review"
      },
      {
        category: "Accessories",
        rate: "3.8%",
        action: "Condition validation"
      }
    ]
  }
};

function returnMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getReturnBranch(branchId) {
  return TRENZ_RETURNS_DATA.branches.find((branch) => branch.id === branchId);
}

function getReturnsByBranch(branchId) {
  if (!branchId || branchId === "all") {
    return TRENZ_RETURNS_DATA.requests;
  }

  return TRENZ_RETURNS_DATA.requests.filter((item) => item.branchId === branchId);
}
