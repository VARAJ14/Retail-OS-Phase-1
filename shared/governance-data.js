const TRENZ_GOVERNANCE_DATA = {
  staff: [
    { name: "R. Santhosh", role: "Owner", branch: "Select All", access: "Full", status: "Active" },
    { name: "S. Karthik", role: "Manager", branch: "BEST CHOICE ANNA NAGAR BRANCH", access: "Branch Operations", status: "Active" },
    { name: "R. Meena", role: "Manager", branch: "PADI BRANCH", access: "Branch Operations", status: "Active" },
    { name: "A. Rahman", role: "Manager", branch: "SPENCER", access: "Branch Operations", status: "Active" },
    { name: "M. Divya", role: "Cashier", branch: "BEST CHOICE ANNA NAGAR BRANCH", access: "POS Billing", status: "Active" },
    { name: "K. Nisha", role: "Staff", branch: "SPENCER", access: "Tasks + Lookup", status: "Active" }
  ],

  permissions: [
    { module: "Main Inventory", owner: "Full", manager: "No", cashier: "No", staff: "No" },
    { module: "Branch Inventory", owner: "Full", manager: "Assigned Branch", cashier: "No", staff: "View Task" },
    { module: "POS Billing", owner: "Monitor", manager: "Monitor", cashier: "Billing", staff: "Support" },
    { module: "Website Control", owner: "Full", manager: "No", cashier: "No", staff: "No" },
    { module: "CRM", owner: "Full", manager: "Branch Update", cashier: "Lookup + Notes", staff: "Lookup" },
    { module: "Returns", owner: "Full Approval", manager: "Branch Approval", cashier: "Initiate", staff: "Initiate" },
    { module: "Analytics", owner: "Global", manager: "Branch", cashier: "No", staff: "No" },
    { module: "Settings", owner: "Full", manager: "No", cashier: "No", staff: "No" }
  ],

  settings: [
    { setting: "Inventory state model", value: "Available, Reserved, Sold, Returned, Damaged, Transfer Pending, Warranty Claim, Disposal, Expired", status: "Active" },
    { setting: "GST slabs", value: "5%, 12%, 18%", status: "Active" },
    { setting: "Return window", value: "7 days default", status: "Active" },
    { setting: "Website stock visibility", value: "Branch stock based", status: "Active" },
    { setting: "Low stock alerts", value: "SKU threshold based", status: "Active" },
    { setting: "SSL session", value: "Frontend session-ready", status: "Active" }
  ]

};

function governanceStatusBadge(value = "") {
  const text = value.toLowerCase();

  if (text.includes("active") || text.includes("full") || text.includes("billing") || text.includes("assigned")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (text.includes("no")) {
    return "bg-red-500/10 text-red-300";
  }

  if (text.includes("branch") || text.includes("support") || text.includes("lookup")) {
    return "bg-cyan-500/10 text-cyan-300";
  }

  return "bg-slate-800 text-slate-300";
}
