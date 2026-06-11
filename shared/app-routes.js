(function () {
  const ROUTES = {
    auth: {
      login: "login.html",
      forgotPassword: "forgot-password.html",
      verifyOtp: "verify-otp.html",
      resetPassword: "reset-password.html"
    },

    owner: {
      dashboard: "owner/dashboard.html",
      returns: "owner/returns.html"
    },

    manager: {
      dashboard: "manager/dashboard.html",
      returns: "manager/returns.html"
    },

    cashier: {
      pos: "cashier/pos.html"
    },

    staff: {
      tasks: "staff/tasks.html"
    },

    app: {
      inventory: "inventory.html",
      branchInventory: "branch-inventory.html",
      products: "product-create.html",
      orders: "orders.html",
      crm: "crm.html",
      campaigns: "campaigns.html",
      analytics: "analytics.html",
      reports: "reports.html",
      staffManagement: "staff.html",
      settings: "settings.html",
      systemMap: "system-map.html"
    },

    website: {
      home: "website/index.html",
      products: "website/products.html",
      detail: "website/product-detail.html",
      cart: "website/cart.html",
      checkout: "website/checkout.html",
      tracking: "website/order-tracking.html",
      account: "website/account.html",
      returns: "website/returns.html"
    }
  };

  function getProjectDepth() {
    const pathname = window.location.pathname;
    const parts = pathname.split("/").filter(Boolean);
    const fileName = parts[parts.length - 1] || "";

    if (!fileName.includes(".")) return 0;

    return Math.max(parts.length - 1, 0);
  }

  function pathTo(target) {
    const depth = getProjectDepth();
    return "../".repeat(depth) + target;
  }

  function currentFile() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "index.html";
  }

  function currentFolder() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return "root";
    return parts[parts.length - 2];
  }

  function isCurrentRoute(target) {
    const normalizedTarget = target.split("/").pop();
    return currentFile() === normalizedTarget;
  }

  window.TRENZ_ROUTES = ROUTES;
  window.trenzPathTo = pathTo;
  window.trenzCurrentFile = currentFile;
  window.trenzCurrentFolder = currentFolder;
  window.trenzIsCurrentRoute = isCurrentRoute;
})();
