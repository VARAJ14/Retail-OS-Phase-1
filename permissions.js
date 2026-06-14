const RETAIL_ROLES = {
  owner: {
    label: "owner",
    level: 100,
    defaultBranch: "all",
    dashboard: "owner/dashboard.html",
    sidebar: [
      "Dashboard",
      "Main Inventory",
      "Branch Inventory",
      "Products",
      "POS Monitoring",
      "Orders",
      "Customers",
      "CRM",
      "Campaigns",
      "Returns & Refunds",
      "Analytics",
      "Reports",
      "Website Control",
      "Staff Management",
      "Settings"
    ],
    permissions: {
      dashboard: "full",
      mainInventory: "full",
      branchInventory: "full",
      products: "full",
      pos: "monitor_override",
      orders: "full",
      customers: "full",
      crm: "full",
      campaigns: "full",
      returns: "full_approval",
      analytics: "global",
      reports: "full",
      websiteControl: "full",
      staff: "full",
      settings: "full",
      pricing: "full",
      financials: "full"
    }
  },

  manager: {
    label: "manager",
    level: 60,
    defaultBranch: "mumbai",
    dashboard: "manager/dashboard.html",
    sidebar: [
      "Dashboard",
      "Branch Inventory",
      "Orders",
      "POS Monitoring",
      "CRM",
      "Returns",
      "Staff Monitoring",
      "Branch Reports"
    ],
    permissions: {
      dashboard: "branch",
      mainInventory: "none",
      branchInventory: "assigned_branch",
      products: "view",
      pos: "branch_monitor",
      orders: "branch",
      customers: "branch",
      crm: "branch_update",
      campaigns: "none",
      returns: "branch_approval",
      analytics: "branch",
      reports: "branch",
      websiteControl: "none",
      staff: "branch_monitor",
      settings: "none",
      pricing: "none",
      financials: "none"
    }
  },

  cashier: {
    label: "cashier",
    level: 30,
    defaultBranch: "mumbai",
    dashboard: "cashier/pos.html",
    sidebar: [
      "POS",
      "Invoices",
      "Customer Search",
      "Returns",
      "Logout"
    ],
    permissions: {
      dashboard: "none",
      mainInventory: "none",
      branchInventory: "none",
      products: "lookup",
      pos: "billing",
      orders: "lookup",
      customers: "lookup",
      crm: "notes_only",
      campaigns: "none",
      returns: "initiate",
      analytics: "none",
      reports: "none",
      websiteControl: "none",
      staff: "none",
      settings: "none",
      pricing: "none",
      financials: "none"
    }
  },

  staff: {
    label: "Staff",
    level: 20,
    defaultBranch: "mumbai",
    dashboard: "staff/tasks.html",
    sidebar: [
      "POS",
      "Invoices",
      "Customer Search",
      "Returns",
      "Logout"
    ],
    permissions: {
      dashboard: "none",
      mainInventory: "none",
      branchInventory: "none",
      products: "lookup",
      pos: "limited_billing",
      orders: "lookup",
      customers: "lookup",
      crm: "lookup_only",
      campaigns: "none",
      returns: "initiate",
      analytics: "none",
      reports: "none",
      websiteControl: "none",
      staff: "none",
      settings: "none",
      pricing: "none",
      financials: "none"
    }
  }
};

const RETAIL_BRANCHES = {
  all: {
    label: "All Branches",
    scope: "global"
  },
  mumbai: {
    label: "Mumbai Flagship",
    scope: "branch",
    categories: ["clothing", "accessories", "cosmetics"]
  },
  delhi: {
    label: "Delhi Electronics",
    scope: "branch",
    categories: ["electronics", "accessories"]
  },
  bengaluru: {
    label: "Bengaluru Beauty",
    scope: "branch",
    categories: ["cosmetics", "clothing"]
  },
  chennai: {
    label: "Chennai Accessories",
    scope: "branch",
    categories: ["accessories", "clothing"]
  }
};

const PAGE_PERMISSION_MAP = {
  "owner/dashboard.html": "dashboard",
  "manager/dashboard.html": "dashboard",
  "cashier/pos.html": "pos",
  "staff/tasks.html": "orders",
  "dashboard.html": "dashboard",
  "inventory.html": "mainInventory",
  "branch-inventory.html": "branchInventory",
  "product-create.html": "products",
  "pos.html": "pos",
  "orders.html": "orders",
  "website/index.html": "websiteControl",
  "website/products.html": "websiteControl",
  "website/product-detail.html": "websiteControl",
  "website/cart.html": "websiteControl",
  "website/checkout.html": "websiteControl",
  "website/order-tracking.html": "websiteControl",
  "website/account.html": "websiteControl",
  "website/returns.html": "returns",
  "website-control.html": "websiteControl",
  "owner/website-control.html": "websiteControl",
  "manager/website-control.html": "websiteControl",
  "crm.html": "crm",
  "campaigns.html": "campaigns",
  "owner/returns.html": "returns",
  "manager/returns.html": "returns",
  "analytics.html": "analytics",
  "reports.html": "reports",
  "staff.html": "staff",
  "Products/barcode.html": "products",
  "settings.html": "settings"
};

function getRetailRole(roleKey) {
  return RETAIL_ROLES[roleKey] || RETAIL_ROLES.staff;
}

function getRetailBranch(branchKey) {
  return RETAIL_BRANCHES[branchKey] || RETAIL_BRANCHES.mumbai;
}

function getPermissionForPage(roleKey, pageName) {
  const role = getRetailRole(roleKey);
  const permissionKey = PAGE_PERMISSION_MAP[pageName];

  if (!permissionKey) {
    return "view";
  }

  return role.permissions[permissionKey] || "none";
}

function hasPermission(roleKey, pageName) {
  const permission = getPermissionForPage(roleKey, pageName);
  return permission !== "none";
}

function canAccessGlobalBranch(roleKey) {
  return roleKey === "owner";
}

function validateRoleBranch(roleKey, branchKey) {
  if (roleKey === "owner") {
    return true;
  }

  return branchKey !== "all";
}

function createSessionPayload({ roleKey, branchKey, email, remember }) {
  const role = getRetailRole(roleKey);
  const branch = getRetailBranch(branchKey);

  return {
    authenticated: true,
    ssl: true,
    tokenType: "session-ready",
    sessionId: `retailos-${roleKey}-${Date.now()}`,
    roleKey,
    roleLabel: role.label,
    roleLevel: role.level,
    branchKey,
    branchLabel: branch.label,
    email,
    remember,
    permissions: role.permissions,
    sidebar: role.sidebar,
    dashboard: role.dashboard,
    lifecycle: [
      "Main Inventory",
      "Branch Inventory",
      "POS Billing",
      "Website Stock Sync",
      "CRM Customer Update",
      "Analytics Update"
    ],
    createdAt: new Date().toISOString()
  };
}
