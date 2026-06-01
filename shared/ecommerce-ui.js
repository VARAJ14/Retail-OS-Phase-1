function categoryChipClass(category) {
  const map = {
    Clothing: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    Electronics: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    Cosmetics: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
    Accessories: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
  };

  return map[category] || "bg-slate-800 text-slate-300 border-slate-700";
}

function badgeClass(label = "") {
  const value = label.toLowerCase();

  if (value.includes("best") || value.includes("top")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (value.includes("few") || value.includes("low") || value.includes("limited")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (value.includes("deal") || value.includes("offer")) {
    return "bg-indigo-500/10 text-indigo-300";
  }

  return "bg-slate-800 text-slate-300";
}

function renderCustomerHeader(active = "home") {
  const nav = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "products", label: "Products", href: "products.html" },
    { id: "orders", label: "Orders", href: "order-tracking.html" },
    { id: "returns", label: "Returns", href: "return-request.html" },
    { id: "account", label: "Account", href: "account.html" }
  ];

  const header = document.getElementById("customerHeader");

  if (!header) return;

  header.innerHTML = `
    <header class="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div class="mx-auto max-w-7xl px-4 py-3">
        <div class="flex items-center gap-3">
          <a href="index.html" class="flex items-center gap-2 shrink-0">
            <div class="h-10 w-10 rounded-2xl bg-indigo-500 flex items-center justify-center font-black">
              T
            </div>
            <div class="hidden sm:block">
              <p class="font-semibold leading-tight">TRENZ OS</p>
              <p class="text-xs text-slate-400">Retail</p>
            </div>
          </a>

          <div class="relative flex-1">
            <input
              id="globalSearch"
              placeholder="Search products, brands, categories, SKU..."
              class="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 pr-12 text-sm outline-none focus:border-indigo-400"
            />
            <button class="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-indigo-500 px-3 py-1.5 text-sm font-semibold">
              Search
            </button>

            <div id="searchPanel" class="hidden absolute left-0 right-0 top-[115%] z-50 rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-2xl shadow-black/40">
              <div>
                <p class="text-xs font-medium text-slate-400">Instant suggestions</p>
                <div id="instantSuggestions" class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2"></div>
              </div>

              <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-medium text-slate-400">Recent searches</p>
                  <div id="recentSearches" class="mt-3 flex flex-wrap gap-2"></div>
                </div>

                <div>
                  <p class="text-xs font-medium text-slate-400">Popular searches</p>
                  <div id="popularSearches" class="mt-3 flex flex-wrap gap-2"></div>
                </div>
              </div>
            </div>
          </div>

          <a href="cart.html" class="relative rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm hover:bg-slate-800">
            Cart
            <span class="absolute -right-2 -top-2 rounded-full bg-indigo-500 px-2 py-0.5 text-xs">
              ${TRENZ_ECOMMERCE_DATA.cart.length}
            </span>
          </a>
        </div>

        <nav class="mt-3 hidden md:flex items-center gap-2 text-sm">
          ${nav.map((item) => `
            <a href="${item.href}" class="rounded-xl px-3 py-2 ${
              item.id === active
                ? "bg-indigo-500/15 text-indigo-200"
                : "text-slate-300 hover:bg-slate-900"
            }">
              ${item.label}
            </a>
          `).join("")}

          <div class="ml-auto flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span class="text-xs text-emerald-300">Live branch stock</span>
          </div>
        </nav>
      </div>
    </header>
  `;

  hydrateSearch();
}

function renderMobileBottomNav(active = "home") {
  const footer = document.getElementById("mobileBottomNav");

  if (!footer) return;

  const nav = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "products", label: "Shop", href: "products.html" },
    { id: "cart", label: "Cart", href: "cart.html" },
    { id: "orders", label: "Orders", href: "order-tracking.html" },
    { id: "account", label: "Account", href: "account.html" }
  ];

  footer.innerHTML = `
    <nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur md:hidden">
      <div class="grid grid-cols-5 text-xs">
        ${nav.map((item) => `
          <a href="${item.href}" class="py-3 text-center ${
            item.id === active ? "text-indigo-300" : "text-slate-400"
          }">
            ${item.label}
          </a>
        `).join("")}
      </div>
    </nav>
  `;
}

function hydrateSearch() {
  const search = document.getElementById("globalSearch");
  const panel = document.getElementById("searchPanel");
  const suggestions = document.getElementById("instantSuggestions");
  const recent = document.getElementById("recentSearches");
  const popular = document.getElementById("popularSearches");

  if (!search || !panel) return;

  function renderSearchContent(query = "") {
    const q = query.toLowerCase();

    const matches = TRENZ_ECOMMERCE_DATA.products.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q)
      );
    }).slice(0, 4);

    suggestions.innerHTML = matches.map((product) => `
      <a href="product-detail.html?id=${product.id}" class="rounded-2xl border border-slate-800 bg-slate-950 p-3 hover:border-indigo-400">
        <p class="text-sm font-medium">${product.name}</p>
        <p class="mt-1 text-xs text-slate-400">${product.brand} · ${product.sku}</p>
      </a>
    `).join("");

    recent.innerHTML = TRENZ_ECOMMERCE_DATA.recentSearches.map((item) => `
      <button class="rounded-full bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">${item}</button>
    `).join("");

    popular.innerHTML = TRENZ_ECOMMERCE_DATA.popularSearches.map((item) => `
      <button class="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-xs text-indigo-300">${item}</button>
    `).join("");
  }

  search.addEventListener("focus", () => {
    panel.classList.remove("hidden");
    renderSearchContent(search.value);
  });

  search.addEventListener("input", () => {
    panel.classList.remove("hidden");
    renderSearchContent(search.value);
  });

  document.addEventListener("click", (event) => {
    if (!search.contains(event.target) && !panel.contains(event.target)) {
      panel.classList.add("hidden");
    }
  });
}

function productCard(product) {
  return `
    <article class="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-slate-700 transition">
      <a href="product-detail.html?id=${product.id}">
        <div class="h-44 bg-slate-950 flex items-center justify-center border-b border-slate-800">
          <div class="h-24 w-24 rounded-3xl flex items-center justify-center text-2xl font-black border ${categoryChipClass(product.category)}">
            ${product.imageCode}
          </div>
        </div>
      </a>

      <div class="p-5">
        <div class="flex items-center justify-between gap-2">
          <span class="rounded-full px-3 py-1 text-xs ${badgeClass(product.badge)}">${product.badge}</span>
          <span class="text-xs text-emerald-300">${product.discount}% off</span>
        </div>

        <a href="product-detail.html?id=${product.id}">
          <h3 class="mt-3 font-semibold">${product.name}</h3>
        </a>

        <p class="mt-1 text-xs text-slate-400">${product.brand} · ${product.variant}</p>

        <div class="mt-3 flex items-center gap-2">
          <span class="text-xl font-semibold">${money(product.price)}</span>
          <span class="text-sm text-slate-500 line-through">${money(product.mrp)}</span>
        </div>

        <div class="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <span>★ ${product.rating}</span>
          <span>·</span>
          <span>${product.reviews} reviews</span>
        </div>

        <div class="mt-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Anna Nagar</span>
            <span class="${product.branchStock["anna-nagar"] <= 10 ? "text-amber-300" : "text-emerald-300"}">
              ${branchStockText(product)}
            </span>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-2">
          <a href="product-detail.html?id=${product.id}" class="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-center text-sm hover:bg-slate-800">
            View
          </a>
          <a href="cart.html" class="rounded-xl bg-indigo-500 px-3 py-2.5 text-center text-sm font-semibold hover:bg-indigo-400">
            Add
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderProductSection(containerId, filterFn, limit = 4) {
  const container = document.getElementById(containerId);

  if (!container) return;

  const products = getVisibleProducts().filter(filterFn).slice(0, limit);

  container.innerHTML = products.map(productCard).join("");
}

function renderCategories(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_ECOMMERCE_DATA.categories.map((category) => `
    <a href="products.html?category=${category.name}" class="rounded-3xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700">
      <div class="h-14 w-14 rounded-2xl flex items-center justify-center border ${categoryChipClass(category.name)}">
        ${category.name.slice(0, 2).toUpperCase()}
      </div>
      <p class="mt-4 font-semibold">${category.name}</p>
      <p class="mt-1 text-sm text-slate-400">${category.subtitle}</p>
    </a>
  `).join("");
}

function renderBranchHighlights(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_ECOMMERCE_DATA.branches.map((branch) => `
    <div class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-semibold">${branch.name}</p>
          <p class="mt-1 text-sm text-slate-400">${branch.area}</p>
        </div>
        <span class="rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs">
          Live
        </span>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">Available</p>
          <p class="mt-1 font-semibold">${branch.availableItems.toLocaleString("en-IN")}</p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">Speed</p>
          <p class="mt-1 font-semibold text-cyan-300">${branch.speed}</p>
        </div>
      </div>
    </div>
  `).join("");
}

function renderCartItems(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  const items = getCartItems();

  container.innerHTML = items.map((item) => `
    <div class="flex gap-4 p-5 border-b border-slate-800 last:border-b-0">
      <div class="h-20 w-20 rounded-2xl border ${categoryChipClass(item.product.category)} flex items-center justify-center text-xl font-black shrink-0">
        ${item.product.imageCode}
      </div>

      <div class="flex-1 min-w-0">
        <p class="font-semibold">${item.product.name}</p>
        <p class="mt-1 text-xs text-slate-400">${item.product.sku} · ${item.product.variant}</p>
        <p class="mt-1 text-xs text-slate-500">${item.branch.name}</p>

        <div class="mt-3 flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
            <button class="text-slate-400 hover:text-white">−</button>
            <span class="text-sm font-semibold">${item.qty}</span>
            <button class="text-slate-400 hover:text-white">+</button>
          </div>

          <span class="rounded-full bg-blue-500/10 text-blue-300 px-3 py-1 text-xs">
            ${item.state}
          </span>

          <button class="text-xs text-red-300 hover:text-red-200">Remove</button>
        </div>
      </div>

      <div class="text-right">
        <p class="font-semibold">${money(item.product.price * item.qty)}</p>
        <p class="mt-1 text-xs text-slate-400">${money(item.product.price)} each</p>
      </div>
    </div>
  `).join("");
}

function renderOrderSummary(containerId, checkout = false) {
  const container = document.getElementById(containerId);

  if (!container) return;

  const totals = getCartTotals();

  container.innerHTML = `
    <div class="space-y-3 text-sm">
      <div class="flex justify-between text-slate-400">
        <span>Subtotal</span>
        <span>${money(totals.subtotal)}</span>
      </div>

      <div class="flex justify-between text-slate-400">
        <span>GST</span>
        <span>${money(totals.gst)}</span>
      </div>

      <div class="flex justify-between text-slate-400">
        <span>Delivery</span>
        <span>${totals.deliveryFee === 0 ? "Free" : money(totals.deliveryFee)}</span>
      </div>

      <div class="flex justify-between text-slate-400">
        <span>Coupon</span>
        <span class="text-emerald-300">−${money(totals.discount)}</span>
      </div>

      <div class="pt-3 border-t border-slate-800 flex justify-between">
        <span class="font-semibold">Total</span>
        <span class="text-2xl font-semibold">${money(totals.total)}</span>
      </div>
    </div>

    ${
      checkout
        ? `<a href="order-tracking.html" class="mt-5 block w-full rounded-xl bg-emerald-500 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-emerald-400">Place Order</a>`
        : `<a href="checkout.html" class="mt-5 block w-full rounded-xl bg-indigo-500 py-3 text-center text-sm font-semibold hover:bg-indigo-400">Checkout</a>`
    }

    <div class="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p class="text-sm font-medium">Live sync after order</p>
      <div class="mt-3 space-y-2 text-xs">
        <div class="flex justify-between">
          <span class="text-slate-400">Branch Stock</span>
          <span class="text-cyan-300">Reserved → Sold</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">CRM</span>
          <span class="text-fuchsia-300">Purchase added</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Analytics</span>
          <span class="text-amber-300">Order logged</span>
        </div>
      </div>
    </div>
  `;
}

function renderOrderTracking(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  const order = TRENZ_ECOMMERCE_DATA.order;
  const branch = getBranch(order.branchId);

  container.innerHTML = `
    <section class="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p class="text-xs text-slate-400">Order ID</p>
          <h1 class="mt-1 text-2xl font-semibold">${order.id}</h1>
          <p class="mt-1 text-sm text-slate-400">${branch.name} · ${order.delivery}</p>
        </div>

        <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <p class="text-sm font-semibold text-emerald-300">${order.status}</p>
          <p class="mt-1 text-xs text-slate-400">${order.payment}</p>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-5 gap-2">
        ${order.steps.map((step, index) => `
          <div class="text-center">
            <div class="mx-auto h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold ${
              index <= order.activeStep
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-500"
            }">
              ${index <= order.activeStep ? "✓" : index + 1}
            </div>
            <p class="mt-2 text-[11px] ${index === order.activeStep ? "text-indigo-300 font-semibold" : "text-slate-500"}">${step}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderReturnList(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_ECOMMERCE_DATA.returns.map((item) => {
    const product = getProduct(item.productId);

    return `
      <div class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div class="flex items-start gap-4">
          <div class="h-16 w-16 rounded-2xl border ${categoryChipClass(product.category)} flex items-center justify-center text-lg font-black">
            ${product.imageCode}
          </div>

          <div class="flex-1">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold">${product.name}</p>
                <p class="mt-1 text-xs text-slate-400">${item.id} · ${item.orderId}</p>
              </div>

              <span class="rounded-full px-3 py-1 text-xs ${badgeClass(item.status)}">
                ${item.status}
              </span>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <p class="text-slate-400">Reason</p>
                <p class="mt-1 font-medium">${item.reason}</p>
              </div>

              <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <p class="text-slate-400">Refund</p>
                <p class="mt-1 font-medium text-amber-300">${item.refundStatus}</p>
              </div>

              <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <p class="text-slate-400">Inventory</p>
                <p class="mt-1 font-medium text-cyan-300">${item.inventoryAction}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
