function mainInvCategoryClass(category) {
  const map = {
    Clothing: "bg-indigo-500/15 text-indigo-200 border-indigo-500/20",
    Electronics: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    Cosmetics: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
    Accessories: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
  };

  return map[category] || "bg-slate-800 text-slate-300 border-slate-700";
}

function mainInvStateClass(state) {
  const value = String(state || "").toLowerCase();

  if (value.includes("available")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (value.includes("low") || value.includes("reorder") || value.includes("watch") || value.includes("pending")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (value.includes("warranty")) {
    return "bg-cyan-500/10 text-cyan-300";
  }

  if (value.includes("disposal") || value.includes("expired") || value.includes("damaged")) {
    return "bg-red-500/10 text-red-300";
  }

  return "bg-slate-800 text-slate-300";
}

function renderMainInventoryTotals() {
  const totals = getMainInventoryTotals();

  const values = {
    totalSkus: totals.totalSkus,
    mainStock: totals.mainStock.toLocaleString("en-IN"),
    availableStock: totals.available.toLocaleString("en-IN"),
    transferPendingStock: totals.transferPending.toLocaleString("en-IN"),
    riskStock: totals.riskStock.toLocaleString("en-IN"),
    lowStockCount: totals.lowStock
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

function renderMainInventoryTable(containerId, products = TRENZ_MAIN_INVENTORY_DATA.products) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = products.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <div class="flex items-center gap-3">
          <div class="h-11 w-11 rounded-2xl border flex items-center justify-center text-xs font-black ${mainInvCategoryClass(item.category)}">
            ${item.category.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <p class="font-medium">${item.name}</p>
            <p class="mt-1 text-xs text-slate-400">${item.sku} · ${item.brand}</p>
          </div>
        </div>
      </td>

      <td class="px-5 py-4">
        <p>${item.category}</p>
        <p class="mt-1 text-xs text-slate-400">${item.variant}</p>
        ${item.expiry ? `<p class="mt-1 text-xs text-amber-300">Expiry: ${item.expiry}</p>` : ""}
      </td>

      <td class="px-5 py-4">
        <p class="font-medium">${item.mainStock.toLocaleString("en-IN")}</p>
        <p class="mt-1 text-xs text-slate-400">Available: ${item.available.toLocaleString("en-IN")}</p>
      </td>

      <td class="px-5 py-4">
        <p class="text-cyan-300">${item.allocated.toLocaleString("en-IN")}</p>
        <p class="mt-1 text-xs text-slate-400">Pending: ${item.transferPending.toLocaleString("en-IN")}</p>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${mainInvStateClass(item.state)}">
          ${item.state}
        </span>
      </td>

      <td class="px-5 py-4">
        <div class="space-y-1 text-xs">
          <div class="flex justify-between gap-4">
            <span class="text-slate-400">Returned</span>
            <span>${item.returned}</span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-slate-400">Warranty</span>
            <span>${item.warrantyClaim}</span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-slate-400">Disposal</span>
            <span>${item.discount}$<span>

                      </div>
        </div>
      </td>

      <td class="px-5 py-4">
        <div class="space-y-1 text-xs">
          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">POS</span>
            <span class="${item.posReady ? "text-emerald-300" : "text-amber-300"}">
              ${item.posReady ? "Ready" : "After allocation"}
            </span>
          </div>

          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">Website</span>
            <span class="${item.websiteReady ? "text-blue-300" : "text-red-300"}">
              ${item.websiteReady ? "Ready" : "Hidden"}
            </span>
          </div>
        </div>
      </td>

      <td class="px-5 py-4 text-right">
        <div class="flex justify-end gap-2">
          <button onclick="selectAllocationSku('${item.sku}')" class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">
            Select
          </button>

          <button onclick="quickAllocate('${item.sku}')" class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">
            Allocate
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAllocationRows(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_MAIN_INVENTORY_DATA.allocations.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <p class="font-medium">${item.id}</p>
        <p class="mt-1 text-xs text-slate-400">${item.createdBy}</p>
      </td>

      <td class="px-5 py-4">
        <p>${item.product}</p>
        <p class="mt-1 text-xs text-slate-400">${item.sku}</p>
      </td>

      <td class="px-5 py-4">${item.from}</td>
      <td class="px-5 py-4">${item.to}</td>
      <td class="px-5 py-4">${item.qty.toLocaleString("en-IN")}</td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${mainInvStateClass(item.state)}">
          ${item.state}
        </span>
      </td>

      <td class="px-5 py-4">
        <p class="text-xs text-slate-400">${item.status}</p>
      </td>
    </tr>
  `).join("");
}

function renderMainMovementRows(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_MAIN_INVENTORY_DATA.movementLog.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <p class="font-medium">${item.id}</p>
        <p class="mt-1 text-xs text-slate-400">${item.time}</p>
      </td>

      <td class="px-5 py-4">${item.event}</td>
      <td class="px-5 py-4">${item.sku}</td>
      <td class="px-5 py-4">${item.from}</td>
      <td class="px-5 py-4">${item.to}</td>
      <td class="px-5 py-4">${item.qty.toLocaleString("en-IN")}</td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${mainInvStateClass(item.state)}">
          ${item.state}
        </span>
      </td>

      <td class="px-5 py-4 text-slate-400">${item.impact}</td>
    </tr>
  `).join("");
}

function renderAllocationImpact(containerId, allocation) {
  const container = document.getElementById(containerId);

  if (!container) return;

  const active = allocation || TRENZ_MAIN_INVENTORY_DATA.allocations[0];

  container.innerHTML = `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p class="text-sm font-semibold">${active.id}</p>
      <p class="mt-1 text-xs text-slate-400">${active.product} · ${active.sku}</p>
    </div>

    <div class="space-y-3 text-xs">
      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Main Inventory</span>
        <span class="text-red-300">Available stock reduced</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Transfer State</span>
        <span class="text-amber-300">Transfer Pending</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Branch Inventory</span>
        <span class="text-cyan-300">Incoming stock created</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">POS</span>
        <span class="text-emerald-300">Enabled after receiving</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Website</span>
        <span class="text-blue-300">Visibility recalculated</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Analytics</span>
        <span class="text-amber-300">Movement logged</span>
      </div>
    </div>
  `;
}

function selectAllocationSku(sku) {
  const item = findMainInventoryItem(sku);

  if (!item) return;

  const skuInput = document.getElementById("allocationSkuInput");
  const qtyInput = document.getElementById("allocationQtyInput");
  const productLabel = document.getElementById("allocationProductLabel");

  if (skuInput) skuInput.value = item.sku;
  if (qtyInput) qtyInput.value = Math.min(40, item.available);
  if (productLabel) productLabel.textContent = `${item.name} · Available ${item.available.toLocaleString("en-IN")}`;
}

function pushMainMovement(event, sku, from, to, qty, state, impact) {
  TRENZ_MAIN_INVENTORY_DATA.movementLog.unshift({
    id: `MOV-MAIN-${Math.floor(Math.random() * 900 + 100)}`,
    event,
    sku,
    from,
    to,
    qty,
    state,
    impact,
    time: "Live"
  });
}

function pushAllocation(sku, destinationBranchId, qty) {
  const item = findMainInventoryItem(sku);
  const branch = TRENZ_MAIN_INVENTORY_DATA.branches.find((branchItem) => branchItem.id === destinationBranchId);

  if (!item || !branch || qty <= 0 || item.available < qty) return null;

  item.available -= qty;
  item.allocated += qty;
  item.transferPending += qty;

  if (item.available <= item.lowThreshold) {
    item.state = "Low Stock";
  }

  const allocation = {
    id: `TRF-MAIN-${Math.floor(Math.random() * 9000 + 1000)}`,
    sku: item.sku,
    product: item.name,
    from: "Main Inventory",
    to: branch.name,
    qty,
    state: "Transfer Pending",
    createdBy: "Owner",
    status: "Awaiting branch receive"
  };

  TRENZ_MAIN_INVENTORY_DATA.allocations.unshift(allocation);

  pushMainMovement(
    "Manual Branch Allocation",
    item.sku,
    "Main Inventory",
    branch.name,
    qty,
    "Transfer Pending",
    "Branch receiving queue created, POS and website enabled after receiving"
  );

  return allocation;
}

function quickAllocate(sku) {
  const allocation = pushAllocation(sku, "anna-nagar", 20);

  if (!allocation) return;

  refreshMainInventoryUI(allocation);
}

function createManualAllocation() {
  const sku = document.getElementById("allocationSkuInput")?.value;
  const destination = document.getElementById("allocationBranchInput")?.value || "anna-nagar";
  const qty = Number(document.getElementById("allocationQtyInput")?.value || 0);

  const allocation = pushAllocation(sku, destination, qty);

  if (!allocation) return;

  refreshMainInventoryUI(allocation);
}

function filterMainInventory() {
  const search = document.getElementById("mainInventorySearch")?.value.toLowerCase() || "";
  const category = document.getElementById("mainInventoryCategoryFilter")?.value || "All";
  const state = document.getElementById("mainInventoryStateFilter")?.value || "All";

  let products = TRENZ_MAIN_INVENTORY_DATA.products;

  if (search) {
    products = products.filter((item) => {
      return (
        item.name.toLowerCase().includes(search) ||
        item.sku.toLowerCase().includes(search) ||
        item.brand.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
      );
    });
  }

  if (category !== "All") {
    products = products.filter((item) => item.category === category);
  }

  if (state !== "All") {
    products = products.filter((item) => item.state === state);
  }

  renderMainInventoryTable("mainInventoryRows", products);
}

function refreshMainInventoryUI(allocation) {
  renderMainInventoryTotals();
  renderMainInventoryTable("mainInventoryRows");
  renderAllocationRows("allocationRows");
  renderMainMovementRows("mainMovementRows");
  renderAllocationImpact("allocationImpactPanel", allocation);
}
