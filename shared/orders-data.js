const TRENZ_ORDERS_DATA = {
  summary: {
    totalOrders: 701,
    websiteOrders: 286,
    posInvoices: 415,
    picking: 42,
    packed: 31,
    dispatched: 28,
    delivered: 540,
    returnLinked: 19,
    revenue: 1635930
  },

  branches: [
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

  orders: [
    {
      id: "ORD-TN-78412",
      invoice: "INV-TN-78412",
      channel: "Website",
      customer: "Priya Raman",
      customerId: "CRM-TN-10482",
      branchId: "anna-nagar",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      items: 3,
      amount: 4177,
      payment: "UPI Paid",
      stockState: "Reserved",
      fulfillment: "Picking",
      delivery: "Today by 8 PM",
      crm: "Purchase added",
      analytics: "Logged",
      returnStatus: "Eligible"
    },
    {
      id: "POS-AN-58291",
      invoice: "INV-AN-58291",
      channel: "POS",
      customer: "Priya Raman",
      customerId: "CRM-TN-10482",
      branchId: "anna-nagar",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      items: 2,
      amount: 2597,
      payment: "Paid",
      stockState: "Sold",
      fulfillment: "Completed",
      delivery: "Counter sale",
      crm: "Purchase added",
      analytics: "Logged",
      returnStatus: "Eligible"
    },
    {
      id: "ORD-TN-78413",
      invoice: "INV-TN-78413",
      channel: "Website",
      customer: "Arun Prakash",
      customerId: "CRM-TN-20918",
      branchId: "padi",
      branch: "PADI BRANCH",
      items: 1,
      amount: 3499,
      payment: "Card Paid",
      stockState: "Reserved",
      fulfillment: "Packed",
      delivery: "Tomorrow",
      crm: "Purchase added",
      analytics: "Logged",
      returnStatus: "Warranty Eligible"
    },
    {
      id: "ORD-TN-78414",
      invoice: "INV-TN-78414",
      channel: "Website",
      customer: "Meena Lakshmi",
      customerId: "CRM-TN-31844",
      branchId: "spencer",
      branch: "SPENCER",
      items: 4,
      amount: 2896,
      payment: "UPI Paid",
      stockState: "Reserved",
      fulfillment: "Dispatch Ready",
      delivery: "Today by 9 PM",
      crm: "Purchase added",
      analytics: "Logged",
      returnStatus: "Restricted"
    },
    {
      id: "POS-PD-88214",
      invoice: "INV-PD-88214",
      channel: "POS",
      customer: "Walk-in Customer",
      customerId: "Guest",
      branchId: "padi",
      branch: "PADI BRANCH",
      items: 1,
      amount: 1499,
      payment: "Cash Paid",
      stockState: "Sold",
      fulfillment: "Completed",
      delivery: "Counter sale",
      crm: "Guest sale",
      analytics: "Logged",
      returnStatus: "Invoice Required"
    }
  ],

  fulfillmentSteps: [
    "Order Created",
    "Stock Reserved",
    "Picking",
    "Packing",
    "Dispatch / Pickup",
    "Delivered",
    "CRM + Analytics"
  ]
};

function orderMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}
