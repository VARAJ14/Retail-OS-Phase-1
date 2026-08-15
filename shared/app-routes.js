(function () {
  const ROUTES = {
    auth: {
      login: "index.html",
      forgotPassword: "forgot-password.html",
      verifyOtp: "verify-otp.html",
      resetPassword: "reset-password.html"
    },

    owner: {
      dashboard: "owner/dashboard.html",
      returns: "owner/returns.html",
      websiteControl: "owner/website-control.html"
    },

    manager: {
      dashboard: "manager/dashboard.html",
      returns: "manager/returns.html",
      websiteControl: "manager/website-control.html"
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
      pos: "pos.html",
      orders: "orders.html",
      crm: "crm.html",
      campaigns: "campaigns.html",
      analytics: "analytics.html",
      reports: "reports.html",
      staffManagement: "staff.html",
      settings: "settings.html",
      websiteControl: "website-control.html",
      systemMap: "system-map.html"
    },

    website: {
      home: "website.html/index.html",
      products: "website.html/products.html",
      detail: "website.html/product-detail.html",
      cart: "website.html/cart.html",
      checkout: "website.html/checkout.html",
      tracking: "website.html/order-tracking.html",
      account: "website.html/account.html",
      returnRequest: "website.html/return-request.html"
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
