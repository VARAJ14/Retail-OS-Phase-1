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
      returns: "owner/returns.html"
    },

    manager: {
      dashboard: "manager/dashboard.html",
      returns: "manager/returns.html"
    },

    cashier: {
      pos: "cashier/pos.html",
      openShift: "cashier/pos.html#open-shift",
      closeShift: "cashier/pos.html#close-shift",
      productSearch: "cashier/pos.html#product-search",
      barcodeBilling: "cashier/pos.html#barcode-billing",
      skuSearch: "cashier/pos.html#sku-search",
      customerSearch: "cashier/pos.html#customer-search",
      customerCreate: "cashier/pos.html#customer-create",
      holdBills: "cashier/pos.html#hold-bills",
      resumeBills: "cashier/pos.html#resume-bills",
      invoiceSearch: "cashier/pos.html#invoice-search",
      paymentHistory: "cashier/pos.html#payment-history",
      receiptHistory: "cashier/pos.html#receipt-history",
      receiptReprint: "cashier/pos.html#receipt-reprint",
      returns: "cashier/pos.html#returns",
      refunds: "cashier/pos.html#refunds",
      exchanges: "cashier/pos.html#exchanges",
      loyalty: "cashier/pos.html#loyalty",
      coupons: "cashier/pos.html#coupons",
      giftCards: "cashier/pos.html#gift-cards",
      cashDrawer: "cashier/pos.html#cash-drawer",
      shiftSummary: "cashier/pos.html#shift-summary",
      dayEndSummary: "cashier/pos.html#day-end-summary"
    },

    staff: {
      tasks: "staff/tasks.html"
    },

    app: {
      dashboard: "owner/dashboard.html",
      inventory: "inventory.html",
      branchInventory: "branch-inventory.html",
      products: "product-create.html",
      orders: "orders.html",
      crm: "crm.html",
      campaigns: "campaigns.html",
      returns: "owner/returns.html",
      analytics: "analytics.html",
      reports: "reports.html",
      websiteControl: "website-control.html",
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

  const ROLE_NAVIGATION = {
    owner: [
      { label: "Dashboard", route: ROUTES.owner.dashboard, badge: "Owner" },
      { label: "Main Inventory", route: ROUTES.app.inventory },
      { label: "Branch Inventory", route: ROUTES.app.branchInventory },
      { label: "Products", route: ROUTES.app.products },
      { label: "Orders", route: ROUTES.app.orders },
      { label: "CRM", route: ROUTES.app.crm },
      { label: "Campaigns", route: ROUTES.app.campaigns },
      { label: "Returns & Refunds", route: ROUTES.owner.returns },
      { label: "Analytics", route: ROUTES.app.analytics },
      { label: "Reports", route: ROUTES.app.reports },
      { label: "Website Control", route: ROUTES.app.websiteControl },
      { label: "Staff Management", route: ROUTES.app.staffManagement },
      { label: "Settings", route: ROUTES.app.settings }
    ],

    manager: [
      { label: "Dashboard", route: ROUTES.manager.dashboard, badge: "Branch" },
      { label: "Branch Inventory", route: ROUTES.app.branchInventory },
      { label: "Orders", route: ROUTES.app.orders },
      { label: "POS Monitoring", route: "pos.html" },
      { label: "CRM", route: ROUTES.app.crm },
      { label: "Returns", route: ROUTES.manager.returns },
      { label: "Staff Monitoring", route: ROUTES.app.staffManagement },
      { label: "Branch Reports", route: ROUTES.app.reports }
    ],

    cashier: [
      { label: "POS", route: ROUTES.cashier.pos, badge: "Billing" },
      { label: "Open Shift", route: ROUTES.cashier.openShift },
      { label: "Product Search", route: ROUTES.cashier.productSearch },
      { label: "Invoice Search", route: ROUTES.cashier.invoiceSearch },
      { label: "Payments", route: ROUTES.cashier.paymentHistory },
      { label: "Returns", route: ROUTES.cashier.returns },
      { label: "Day End", route: ROUTES.cashier.dayEndSummary },
      { label: "Logout", route: ROUTES.auth.login }
    ],

    staff: [
      { label: "Tasks", route: ROUTES.staff.tasks, badge: "Staff" },
      { label: "POS Support", route: ROUTES.cashier.pos },
      { label: "Order Lookup", route: ROUTES.app.orders },
      { label: "Return Initiation", route: ROUTES.website.returns },
      { label: "Logout", route: ROUTES.auth.login }
    ]
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

  function roleNavigationFor(roleKey) {
    return ROLE_NAVIGATION[roleKey] || ROLE_NAVIGATION.staff;
  }

  function renderRoleSidebar(containerId, roleKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const navItems = roleNavigationFor(roleKey).map((item) => {
      const activeClass = isCurrentRoute(item.route)
        ? "bg-indigo-500/15 text-indigo-200"
        : "text-slate-300 hover:bg-slate-900";
      const badge = item.badge ? `<span class="text-xs">${item.badge}</span>` : "";

      return `
        <a href="${pathTo(item.route)}" class="flex items-center justify-between rounded-xl ${activeClass} px-4 py-3">
          <span>${item.label}</span>
          ${badge}
        </a>
      `;
    }).join("");

    container.innerHTML = `
      <aside class="hidden lg:flex w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
        <div class="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
          <div class="h-11 w-11 rounded-2xl bg-indigo-500 flex items-center justify-center font-black">T</div>
          <div>
            <h1 class="font-semibold">TRENZ OS</h1>
            <p class="text-xs text-slate-400">Role Access</p>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 py-5 space-y-1 text-sm">
          ${navItems}
        </nav>
      </aside>
    `;
  }

  function renderMobileRoleNav(containerId, roleKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const navItems = roleNavigationFor(roleKey).slice(0, 4).map((item) => {
      const activeClass = isCurrentRoute(item.route) ? "text-indigo-300" : "text-slate-300";

      return `
        <a href="${pathTo(item.route)}" class="${activeClass}">
          ${item.label}
        </a>
      `;
    }).join("");

    container.innerHTML = `
      <nav class="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 gap-1 border-t border-slate-800 bg-slate-950 px-3 py-3 text-center text-xs lg:hidden">
        ${navItems}
      </nav>
    `;
  }

  window.TRENZ_ROUTES = ROUTES;
  window.trenzPathTo = pathTo;
  window.trenzCurrentFile = currentFile;
  window.trenzCurrentFolder = currentFolder;
  window.trenzIsCurrentRoute = isCurrentRoute;
  window.renderRoleSidebar = renderRoleSidebar;
  window.renderMobileRoleNav = renderMobileRoleNav;
})();
