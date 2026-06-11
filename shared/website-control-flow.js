function websiteControlBadge(value = "") {
  const text = String(value).toLowerCase();

  if (text.includes("live") || text.includes("visible") || text.includes("approved") || text.includes("enabled")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (text.includes("scheduled") || text.includes("pending") || text.includes("watch") || text.includes("low") || text.includes("reorder")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (text.includes("hidden") || text.includes("issue") || text.includes("disabled")) {
    return "bg-red-500/10 text-red-300";
  }

  if (text.includes("owner")) {
    return "bg-indigo-500/10 text-indigo-300";
  }

  return "bg-slate-800 text-slate-300";
}

function websiteCategoryClass(category = "") {
  const map = {
    Clothing: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    Electronics: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    Cosmetics: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
    Accessories: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
  };

  return map[category] || "bg-slate-800 text-slate-300 border-slate-700";
}

function renderWebsiteControlSummary(prefix = "owner") {
  const s = TRENZ_WEBSITE_CONTROL_DATA.summary;

  const map = {
    [`${prefix}LiveProducts`]: s.liveProducts.toLocaleString("en-IN"),
    [`${prefix}VisibleCategories`]: s.visibleCategories,
    [`${prefix}ActiveBanners`]: s.activeBanners,
    [`${prefix}ActiveOffers`]: s.activeOffers,
    [`${prefix}SyncedBranches`]: s.syncedBranches,
    [`${prefix}StockIssues`]: s.stockIssues
  };

  Object.entries(map).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

function renderWebsiteBranchCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = TRENZ_WEBSITE_CONTROL_DATA.branches.map((branch) => `
    <div class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-semibold">${branch.name}</p>
          <p class="mt-1 text-sm text-slate-400">${branch.city}</p>
        </div>

        <span class="rounded-full px-3 py-1 text-xs ${websiteControlBadge(branch.sync)}">
          ${branch.sync}
        </span>
      </div>

      <div class="mt-5 grid grid-cols-2 gap-3 text-xs">
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">Website Stock</p>
          <p class="mt-1 font-semibold">${branch.websiteStock.toLocaleString("en-IN")}</p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">Orders</p>
          <p class="mt-1 font-semibold text-blue-300">${branch.localOrders}</p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">Pickup</p>
          <p class="mt-1 font-semibold text-emerald-300">${branch.pickupEnabled ? "Enabled" : "Disabled"}</p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">Issues</p>
          <p class="mt-1 font-semibold text-amber-300">${branch.issues}</p>
        </div>
      </div>
    </div>
  `).join("");
}

function renderWebsiteBannerRows(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = TRENZ_WEBSITE_CONTROL_DATA.banners.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <p class="font-medium">${item.title}</p>
        <p class="mt-1 text-xs text-slate-400">${item.id}</p>
      </td>

      <td class="px-5 py-4">${item.placement}</td>

      <td class="px-5 py-4">
        <span class="rounded-full border px-3 py-1 text-xs ${websiteCategoryClass(item.category)}">${item.category}</span>
      </td>

      <td class="px-5 py-4">${item.branch}</td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${websiteControlBadge(item.status)}">${item.status}</span>
      </td>

      <td class="px-5 py-4">${item.linkedCampaign}</td>
      <td class="px-5 py-4 text-emerald-300">${item.conversion}</td>

      <td class="px-5 py-4 text-right">
        <button class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">Edit</button>
      </td>
    </tr>
  `).join("");
}

function renderWebsiteProductRows(containerId, products = TRENZ_WEBSITE_CONTROL_DATA.websiteProducts, role = "owner") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <p class="font-medium">${item.name}</p>
        <p class="mt-1 text-xs text-slate-400">${item.sku}</p>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full border px-3 py-1 text-xs ${websiteCategoryClass(item.category)}">${item.category}</span>
      </td>

      <td class="px-5 py-4">${item.branch}</td>

      <td class="px-5 py-4">
        <p class="font-medium">${item.branchStock}</p>
        <p class="mt-1 text-xs text-slate-400">Branch units</p>
      </td>

      <td class="px-5 py-4">
        <p>${websiteControlMoney(item.overridePrice || item.price)}</p>
        ${item.overridePrice ? `<p class="mt-1 text-xs text-amber-300">Override active</p>` : `<p class="mt-1 text-xs text-slate-500">Base price</p>`}
      </td>

      <td class="px-5 py-4">${item.offer}</td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${websiteControlBadge(item.status)}">${item.status}</span>
        ${item.issue !== "None" ? `<p class="mt-2 text-xs text-amber-300">${item.issue}</p>` : ""}
      </td>

      <td class="px-5 py-4 text-right">
        ${
          role === "owner"
            ? `<div class="flex justify-end gap-2">
                <button onclick="toggleWebsiteProduct('${item.id}')" class="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300 hover:bg-blue-500/20">Toggle</button>
                <button class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">Override</button>
              </div>`
            : `<button onclick="requestLocalWebsiteOffer('${item.id}')" class="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20">Request</button>`
        }
      </td>
    </tr>
  `).join("");
}

function renderCategoryVisibility(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = TRENZ_WEBSITE_CONTROL_DATA.categories.map((item) => `
    <div class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-semibold">${item.name}</p>
          <p class="mt-1 text-sm text-slate-400">${item.products.toLocaleString("en-IN")} products</p>
        </div>

        <span class="rounded-full px-3 py-1 text-xs ${item.visible ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}">
          ${item.visible ? "Visible" : "Hidden"}
        </span>
      </div>

      <div class="mt-4 flex items-center justify-between text-xs">
        <span class="text-slate-400">Featured</span>
        <span class="${item.featured ? "text-blue-300" : "text-slate-500"}">${item.featured ? "Yes" : "No"}</span>
      </div>
    </div>
  `).join("");
}

function renderSeoSettings(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const seo = TRENZ_WEBSITE_CONTROL_DATA.seoSettings;

  container.innerHTML = `
    <div class="space-y-4">
      <div>
        <label class="text-xs text-slate-400">Meta Title</label>
        <input value="${seo.title}" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400" />
      </div>

      <div>
        <label class="text-xs text-slate-400">Meta Description</label>
        <textarea rows="3" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">${seo.description}</textarea>
      </div>

      <div>
        <label class="text-xs text-slate-400">Keywords</label>
        <textarea rows="3" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">${seo.keywords}</textarea>
      </div>

      <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div class="flex justify-between text-sm">
          <span>SEO Score</span>
          <span class="text-emerald-300">${seo.score}</span>
        </div>
      </div>

      <button class="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold hover:bg-indigo-400">Save SEO Settings</button>
    </div>
  `;
}

function renderLocalOfferRequests(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = TRENZ_WEBSITE_CONTROL_DATA.localOfferRequests.map((item) => `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-medium">${item.request}</p>
          <p class="mt-1 text-xs text-slate-400">${item.branch} · ${item.manager}</p>
          <p class="mt-1 text-xs text-slate-500">${item.reason}</p>
        </div>

        <span class="rounded-full px-3 py-1 text-xs ${websiteControlBadge(item.status)}">${item.status}</span>
      </div>
    </div>
  `).join("");
}

function toggleWebsiteProduct(productId) {
  const item = TRENZ_WEBSITE_CONTROL_DATA.websiteProducts.find((product) => product.id === productId);
  if (!item) return;

  item.visibleOnline = !item.visibleOnline;
  item.status = item.visibleOnline ? "Visible" : "Hidden";

  renderWebsiteProductRows("ownerWebsiteProductRows", TRENZ_WEBSITE_CONTROL_DATA.websiteProducts, "owner");
}

function requestLocalWebsiteOffer(productId) {
  const item = TRENZ_WEBSITE_CONTROL_DATA.websiteProducts.find((product) => product.id === productId);
  if (!item) return;

  TRENZ_WEBSITE_CONTROL_DATA.localOfferRequests.unshift({
    id: `REQ-WEB-${Math.floor(Math.random() * 900 + 100)}`,
    branch: item.branch,
    manager: "Branch Manager",
    request: `Promote ${item.name} on local website`,
    status: "Owner Approval Pending",
    product: item.name,
    reason: "Manager requested local visibility boost"
  });

  const alert = document.getElementById("managerWebsiteAlert");
  if (alert) {
    alert.classList.remove("hidden");
    alert.innerHTML = `
      <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <p class="text-sm font-semibold text-emerald-300">Request submitted</p>
        <p class="mt-1 text-xs text-slate-300">${item.name} promotion request sent to owner.</p>
      </div>
    `;
  }

  renderLocalOfferRequests("managerLocalRequests");
}
