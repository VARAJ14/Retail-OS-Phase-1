function inventoryStateClass(state) {
  const value = state.toLowerCase();

  if (value.includes("available")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (value.includes("low") || value.includes("watch") || value.includes("reorder")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (value.includes("critical") || value.includes("expired") || value.includes("disposal")) {
    return "bg-red-500/10 text-red-300";
  }

  if (value.includes("reserved")) {
    return "bg-blue-500/10 text-blue-300";
  }

  return "bg-slate-800 text-slate-300";
}

function categoryClass(category) {
  const value = category.toLowerCase();

  if (value === "clothing") return "bg-indigo-500/15 text-indigo-200 border-indigo-500/20";
  if (value === "electronics") return "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";
  if (value === "cosmetics") return "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20";
  if (value === "accessories") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";

  return "bg-slate-800 text-slate-300 border-slate-700";
}

function renderInventoryTotals() {
  const totals = getInventoryTotals();

  const map = {
    totalSkus: totals.totalSkus,
    branchStock: totals.branchStock.toLocaleString("en-IN"),
    reserved: totals.reserved.toLocaleString("en-IN"),
    soldToday: totals.soldToday.toLocaleString("en-IN"),
    lowStock: totals.lowStock,
    websiteVisible: totals.websiteVisible
  };

  Object.entries(map).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

function renderBranchInventoryTable(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_INVENTORY_DATA.stocks.map((item) => {
    const posStatus = item.posAvailable ? "POS Ready" : "Blocked";
    const websiteStatus = item.websiteVisible ? "Visible" : "Hidden";

    return `
      <tr class="hover:bg-slate-800/40">
        <td class="px-5 py-4">
          <div class="flex items-center gap-3">
            <div class="h-11 w-11 rounded-2xl border flex items-center justify-center text-xs font-semibold ${categoryClass(item.category)}">
              ${item.category.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p class="font-medium">${item.name}</p>
              <p class="mt-1 text-xs text-slate-400">${item.sku}</p>
            </div>
          </div>
        </td>

        <td class="px-5 py-4">
          <p>${item.category}</p>
          <p class="mt-1 text-xs text-slate-400">${item.variant}</p>
        </td>

        <td class="px-5 py-4">
          <p class="font-medium">${item.branchStock}</p>
          <p class="mt-1 text-xs text-slate-400">Reserved: ${item.reserved} · Sold: ${item.sold}</p>
        </td>

        <td class="px-5 py-4">
          <span class="rounded-full px-3 py-1 text-xs ${inventoryStateClass(item.state)}">${item.state}</span>
        </td>

        <td class="px-5 py-4">
          <span class="rounded-full px-3 py-1 text-xs ${item.posAvailable ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}">
            ${posStatus}
          </span>
        </td>

        <td class="px-5 py-4">
          <span class="rounded-full px-3 py-1 text-xs ${item.websiteVisible ? "bg-blue-500/10 text-blue-300" : "bg-red-500/10 text-red-300"}">
            ${websiteStatus}
          </span>
        </td>

        <td class="px-5 py-4">
          <p class="text-xs text-slate-400">${item.returnRule}</p>
          ${item.expiry ? `<p class="mt-1 text-xs text-amber-300">Expiry: ${item.expiry}</p>` : ""}
        </td>

        <td class="px-5 py-4 text-right">
          <div class="flex justify-end gap-2">
            <button onclick="simulateReservation('${item.sku}')" class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">
              Reserve
            </button>
            <button onclick="simulateSale('${item.sku}')" class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">
              Sell
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderMovementTable(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_INVENTORY_DATA.movements.map((movement) => {
    return `
      <tr class="hover:bg-slate-800/40">
        <td class="px-5 py-4">
          <p class="font-medium">${movement.id}</p>
          <p class="mt-1 text-xs text-slate-400">${movement.time}</p>
        </td>
        <td class="px-5 py-4">${movement.event}</td>
        <td class="px-5 py-4">${movement.sku}</td>
        <td class="px-5 py-4">${movement.from}</td>
        <td class="px-5 py-4">${movement.to}</td>
        <td class="px-5 py-4">${movement.qty}</td>
        <td class="px-5 py-4 text-slate-400">${movement.impact}</td>
      </tr>
    `;
  }).join("");
}

function renderSyncImpact(containerId, saleOverride) {
  const container = document.getElementById(containerId);

  if (!container) return;

  const sale = saleOverride || TRENZOS_INVENTORY_DATA.syncImpact.selectedSale;

  container.innerHTML = `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p class="text-sm font-semibold">${sale.invoice}</p>
      <p class="mt-1 text-xs text-slate-400">${sale.customer} · ${sale.customerId}</p>
    </div>

    <div class="space-y-3 text-sm">
      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Branch Inventory</span>
        <span class="text-cyan-300">${sale.previousState} → ${sale.nextState}</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Website Stock</span>
        <span class="text-blue-300">${sale.websiteAction}</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">CRM Profile</span>
        <span class="text-fuchsia-300">${sale.crmAction}</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Analytics</span>
        <span class="text-amber-300">${sale.analyticsAction}</span>
      </div>
    </div>
  `;
}

function pushMovement(event, sku, from, to, qty, impact) {
  TRENZOS_INVENTORY_DATA.movements.unshift({
    id: `MOV-AN-${Math.floor(Math.random() * 900 + 100)}`,
    event,
    sku,
    from,
    to,
    qty,
    impact,
    time: "Live"
  });
}

function simulateReservation(sku) {
  const item = getInventoryBySku(sku);

  if (!item || item.branchStock <= 0) return;

  item.branchStock -= 1;
  item.reserved += 1;
  item.state = item.branchStock <= 10 ? "Low Stock" : item.state;

  pushMovement(
    "POS Cart Reservation",
    sku,
    "Available",
    "Reserved",
    1,
    "Branch stock reserved for POS checkout"
  );

  refreshInventoryUI({
    invoice: "DRAFT-POS-AN",
    customer: "Counter Customer",
    customerId: "CRM Pending",
    branch: TRENZOS_INVENTORY_DATA.branch.name,
    sku,
    item: `${item.name} - ${item.variant}`,
    qty: 1,
    amount: item.price,
    previousState: "Available",
    nextState: "Reserved",
    websiteAction: "Available stock reduced",
    crmAction: "Pending until payment",
    analyticsAction: "Cart reservation tracked"
  });
}

function simulateSale(sku) {
  const item = getInventoryBySku(sku);

  if (!item) return;

  if (item.reserved > 0) {
    item.reserved -= 1;
  } else if (item.branchStock > 0) {
    item.branchStock -= 1;
  }

  item.sold += 1;

  if (item.branchStock <= 10) {
    item.state = "Critical";
    item.websiteVisible = false;
  }

  pushMovement(
    "POS Sale",
    sku,
    "Reserved",
    "Sold",
    1,
    "Website stock updated, CRM purchase added, analytics sale logged"
  );

  refreshInventoryUI({
    invoice: "INV-AN-LIVE",
    customer: "Priya Raman",
    customerId: "CRM-TN-10482",
    branch: TRENZOS_INVENTORY_DATA.branch.name,
    sku,
    item: `${item.name} - ${item.variant}`,
    qty: 1,
    amount: item.price,
    previousState: "Reserved",
    nextState: "Sold",
    websiteAction: item.websiteVisible ? "Stock reduced" : "Hidden due to low stock",
    crmAction: "Purchase added",
    analyticsAction: "Sale logged"
  });
}

function refreshInventoryUI(syncImpact) {
  renderInventoryTotals();
  renderBranchInventoryTable("branchInventoryRows");
  renderMovementTable("movementRows");
  renderSyncImpact("syncImpactPanel", syncImpact);
}
