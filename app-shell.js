function resolveDashboardHref() {
  if (typeof getCurrentSession === "function") {
    const session = getCurrentSession();
    if (session && session.redirect) return session.redirect;
  }
  return "owner/dashboard.html";
}

function resolveReturnsHref() {
  if (typeof getCurrentSession === "function") {
    const session = getCurrentSession();
    if (session && session.role === "manager") return "manager/returns.html";
  }
  return "owner/returns.html";
}

function getRetailNavigation() {
  return [
    { label: "Dashboard", href: resolveDashboardHref(), badge: "Hub" },
    { label: "Main Inventory", href: "inventory.html", badge: "Master" },
    { label: "Branch Inventory", href: "branch-inventory.html", badge: "Live" },
    { label: "Products", href: "product-create.html" },
    { label: "POS", href: "pos.html", badge: "Sync" },
    { label: "Orders", href: "orders.html" },
    { label: "CRM & Customers", href: "crm.html", badge: "Live" },
    { label: "Campaigns", href: "campaigns.html" },
    { label: "Returns & Refunds", href: resolveReturnsHref(), badge: "Critical" },
    { label: "Analytics", href: "analytics.html", badge: "Live" },
    { label: "Reports", href: "reports.html" },
    { label: "Staff Management", href: "staff.html", badge: "RBAC" },
    { label: "Settings", href: "settings.html" },
    { label: "Website Flow", href: "website.html/index.html", badge: "Sync" },
    { label: "System Map", href: "system-map.html" }
  ];
}

const pageMeta = {
  "dashboard.html": {
    title: "Central Operations Dashboard",
    subtitle: "Main Inventory → Branch Inventory → POS → Website → CRM → Analytics"
  },
  "inventory.html": {
    title: "Main Inventory Management",
    subtitle: "Main Inventory → Branch Inventory → Live POS Sync → Website Sync → CRM Update → Analytics Update"
  },
  "branch-inventory.html": {
    title: "Branch Inventory Management",
    subtitle: "Main Inventory → Branch Inventory → Live POS Sync → Website Sync → CRM Update → Analytics Update"
  },
  "product-create.html": {
    title: "Product Creation",
    subtitle: "SKU creation → Category logic → Inventory initialization → Branch allocation"
  },
  "pos.html": {
    title: "POS Billing Console",
    subtitle: "POS Sale → Branch Inventory Update → Website Stock Update → CRM Update → Analytics Update"
  },
  "orders.html": {
    title: "Unified Order Management",
    subtitle: "Online Orders + POS Orders → Branch Assignment → Fulfillment → CRM + Analytics"
  },
  "website.html": {
    title: "E-Commerce Website Flow",
    subtitle: "Branch Inventory → Website Stock Visibility → Cart Reservation → Order → CRM → Analytics"
  },
  "crm.html": {
    title: "CRM & Customer Intelligence",
    subtitle: "POS + Website Orders → Customer Profile → Segmentation → Campaigns → Analytics"
  },
  "campaigns.html": {
    title: "Campaign Management",
    subtitle: "CRM Segments → Offers → WhatsApp Campaigns → Orders → Analytics"
  },
  "returns.html": {
    title: "Returns & Refunds Management",
    subtitle: "Customer Return → Validation → Approval → Inventory State → Refund / Exchange → CRM → Analytics"
  },
  "analytics.html": {
    title: "Enterprise Analytics Dashboard",
    subtitle: "Inventory → Branches → POS → Website → CRM → Returns → Analytics"
  },
  "reports.html": {
    title: "Reports & Export Center",
    subtitle: "Analytics → Scheduled Reports → GST Exports → Compliance"
  },
  "staff.html": {
    title: "Staff Management & Role Access",
    subtitle: "Admin → Branch Manager → Cashier → Operations → Marketing → Finance"
  },
  "settings.html": {
    title: "System Settings",
    subtitle: "Inventory Rules → Branch Rules → POS Rules → Website Rules → CRM Rules → Analytics Rules"
  },
  "system-map.html": {
    title: "Connected System Map",
    subtitle: "One unified operating model across all RetailOS modules"
  }
};

function getCurrentPage() {
  const path = window.location.pathname;
  return path.split("/").pop() || "dashboard.html";
}

function createSidebar(activePage) {
  const navItems = getRetailNavigation().map((item) => {
    const isActive = item.href === activePage;
    const activeClass = isActive
      ? "bg-indigo-500/15 text-indigo-200"
      : "text-slate-300 hover:bg-slate-900";

    const badge = item.badge
      ? `<span class="text-xs">${item.badge}</span>`
      : "";

    return `
      <a href="${item.href}" class="flex items-center justify-between rounded-xl ${activeClass} px-4 py-3">
        <span>${item.label}</span>
        ${badge}
      </a>
    `;
  }).join("");

  return `
    <aside class="hidden lg:flex w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950">
      <div class="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
        <div class="h-11 w-11 rounded-2xl bg-indigo-500 flex items-center justify-center font-black">
          T
        </div>
        <div>
          <h1 class="font-semibold">TRENZ OS</h1>
          <p class="text-xs text-slate-400">Enterprise Commerce</p>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-4 py-5 space-y-1 text-sm retail-scrollbar">
        ${navItems}
      </nav>

      <div class="p-4 border-t border-slate-800">
        <div class="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <p class="text-xs text-slate-400">Lifecycle Status</p>
          <p class="mt-2 text-sm font-medium text-emerald-300">All systems synced</p>
          <div class="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div class="h-full w-[94%] bg-emerald-400"></div>
          </div>
        </div>
      </div>
    </aside>
  `;
}

function createTopbar(activePage) {
  const meta = pageMeta[activePage] || pageMeta["dashboard.html"];

  return `
    <header class="sticky top-0 z-30 h-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div class="h-full flex items-center justify-between gap-4 px-5 lg:px-8">
        <div class="flex items-center gap-3">
          <button class="lg:hidden rounded-xl border border-slate-800 px-3 py-2 text-sm" id="mobileMenuButton">
            Menu
          </button>

          <div>
            <h2 class="text-lg font-semibold">${meta.title}</h2>
            <p class="text-xs text-slate-400">${meta.subtitle}</p>
          </div>
        </div>

        <div class="hidden md:flex flex-1 max-w-xl items-center gap-3">
          <input
            placeholder="Search SKU, order, customer, branch, report..."
            class="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div class="flex items-center gap-3">
          <select class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm">
            <option>Select All</option>
            <option>BEST CHOICE ANNA NAGAR BRANCH</option>
            <option>PADI BRANCH</option>
            <option>SPENCER</option>
          </select>

          <button class="hidden sm:block rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm" id="quickActionsButton">
            Quick Actions
          </button>

          <div class="hidden xl:flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span class="text-xs text-emerald-300">Live Sync</span>
          </div>

          <button class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm">
            Alerts
          </button>

          <button class="h-10 w-10 rounded-xl bg-slate-800 text-sm">
            AD
          </button>
        </div>
      </div>
    </header>
  `;
}

function createMobileMenu(activePage) {
  const navItems = getRetailNavigation().map((item) => {
    const isActive = item.href === activePage;
    const activeClass = isActive
      ? "bg-indigo-500/15 text-indigo-200"
      : "text-slate-300 hover:bg-slate-900";

    return `
      <a href="${item.href}" class="block rounded-xl ${activeClass} px-4 py-3">
        ${item.label}
      </a>
    `;
  }).join("");

  return `
    <div id="mobileMenu" class="fixed inset-0 z-50 hidden lg:hidden">
      <div class="absolute inset-0 bg-black/60" data-close-mobile-menu></div>
      <aside class="relative h-full w-80 max-w-[85vw] border-r border-slate-800 bg-slate-950 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-2xl bg-indigo-500 flex items-center justify-center font-black">T</div>
            <div>
              <p class="font-semibold">TRENZ OS</p>
              <p class="text-xs text-slate-400">Enterprise Commerce</p>
            </div>
          </div>

          <button class="rounded-xl border border-slate-800 px-3 py-2 text-sm" data-close-mobile-menu>
            Close
          </button>
        </div>

        <nav class="mt-6 space-y-1 text-sm">
          ${navItems}
        </nav>
      </aside>
    </div>
  `;
}

function createQuickActionsPanel() {
  return `
    <div id="quickActionsPanel" class="fixed right-5 top-24 z-40 hidden w-80 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-black/40">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">Quick Actions</h3>
          <p class="mt-1 text-xs text-slate-400">Connected operational shortcuts</p>
        </div>

        <button class="rounded-lg border border-slate-700 px-2 py-1 text-xs" id="closeQuickActions">
          Close
        </button>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-3 text-sm">
        <a href="product-create.html" class="rounded-2xl border border-slate-800 bg-slate-950 p-4 hover:border-indigo-400">
          Create product SKU
          <p class="mt-1 text-xs text-slate-400">Category logic and inventory initialization</p>
        </a>

        <a href="inventory.html" class="rounded-2xl border border-slate-800 bg-slate-950 p-4 hover:border-indigo-400">
          Allocate main stock
          <p class="mt-1 text-xs text-slate-400">Main inventory to branch inventory</p>
        </a>

        <a href="pos.html" class="rounded-2xl border border-slate-800 bg-slate-950 p-4 hover:border-emerald-400">
          Open POS billing
          <p class="mt-1 text-xs text-slate-400">Branch sale to CRM and analytics</p>
        </a>

        <a href="analytics.html" class="rounded-2xl border border-slate-800 bg-slate-950 p-4 hover:border-amber-400">
          View analytics
          <p class="mt-1 text-xs text-slate-400">Sales, inventory, returns and CRM intelligence</p>
        </a>
      </div>
    </div>
  `;
}

function hydrateRetailShell() {
  const shellRoot = document.querySelector("[data-retail-shell]");
  if (!shellRoot) return;

  const activePage = getCurrentPage();

  const existingContent = shellRoot.innerHTML;

  shellRoot.innerHTML = `
    ${createSidebar(activePage)}
    <div class="flex-1 min-w-0">
      ${createTopbar(activePage)}
      ${existingContent}
    </div>
    ${createMobileMenu(activePage)}
    ${createQuickActionsPanel()}
  `;

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMobileButtons = document.querySelectorAll("[data-close-mobile-menu]");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("hidden");
    });
  }

  closeMobileButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });

  const quickActionsButton = document.getElementById("quickActionsButton");
  const quickActionsPanel = document.getElementById("quickActionsPanel");
  const closeQuickActions = document.getElementById("closeQuickActions");

  if (quickActionsButton && quickActionsPanel) {
    quickActionsButton.addEventListener("click", () => {
      quickActionsPanel.classList.toggle("hidden");
    });
  }

  if (closeQuickActions && quickActionsPanel) {
    closeQuickActions.addEventListener("click", () => {
      quickActionsPanel.classList.add("hidden");
    });
  }
}

document.addEventListener("DOMContentLoaded", hydrateRetailShell);
