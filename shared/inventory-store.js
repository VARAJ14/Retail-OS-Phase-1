(function () {
  function getInventory() {
    return trenzDbGet(TRENZ_DB_KEYS.inventory, []);
  }

  function saveInventory(inventory) {
    trenzDbSet(TRENZ_DB_KEYS.inventory, inventory);
    trenzDbSet(TRENZ_DB_KEYS.products, inventory);
  }

  function inventoryBadge(value = "") {
    const text = value.toLowerCase();

    if (text.includes("available") || text.includes("active")) {
      return "bg-emerald-500/10 text-emerald-300";
    }

    if (text.includes("reserved") || text.includes("transfer")) {
      return "bg-blue-500/10 text-blue-300";
    }

    if (text.includes("low") || text.includes("reorder") || text.includes("watch")) {
      return "bg-amber-500/10 text-amber-300";
    }

    if (text.includes("damaged") || text.includes("disposal") || text.includes("expired")) {
      return "bg-red-500/10 text-red-300";
    }

    if (text.includes("warranty")) {
      return "bg-cyan-500/10 text-cyan-300";
    }

    return "bg-slate-800 text-slate-300";
  }

  function renderInventoryTable(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const inventory = getInventory();

    container.innerHTML = inventory.map((item) => {
      const branchStock = item.branchStock || {};
      const totalBranchStock = Object.values(branchStock).reduce((sum, qty) => sum + Number(qty || 0), 0);

      return `
        <tr class="hover:bg-slate-800/40">
          <td class="px-5 py-4">
            <p class="font-medium">${item.name}</p>
            <p class="mt-1 text-xs text-slate-400">${item.sku} · ${item.brand || "TRENZ"}</p>
          </td>

          <td class="px-5 py-4">
            <p>${item.category}</p>
            <p class="mt-1 text-xs text-slate-400">${item.variant || "Standard"}</p>
          </td>

          <td class="px-5 py-4">
            <p class="font-medium">${Number(item.stock || 0).toLocaleString("en-IN")}</p>
            <p class="mt-1 text-xs text-slate-400">Branch: ${totalBranchStock.toLocaleString("en-IN")}</p>
          </td>

          <td class="px-5 py-4">
            <span class="rounded-full px-3 py-1 text-xs ${inventoryBadge(item.state)}">${item.state || "Available"}</span>
          </td>

          <td class="px-5 py-4">
            <div class="space-y-1 text-xs">
              <div class="flex justify-between gap-4">
                <span class="text-slate-400">Anna Nagar</span>
                <span>${branchStock["BEST CHOICE ANNA NAGAR BRANCH"] || 0}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-slate-400">Padi</span>
                <span>${branchStock["PADI BRANCH"] || 0}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-slate-400">Spencer</span>
                <span>${branchStock["SPENCER"] || 0}</span>
              </div>
            </div>
          </td>

          <td class="px-5 py-4">
            <div class="space-y-1 text-xs">
              <p class="${item.posVisible ? "text-emerald-300" : "text-amber-300"}">POS: ${item.posVisible ? "Visible" : "Hidden"}</p>
              <p class="${item.websiteVisible ? "text-blue-300" : "text-red-300"}">Website: ${item.websiteVisible ? "Visible" : "Hidden"}</p>
            </div>
          </td>

          <td class="px-5 py-4 text-right">
            <div class="flex justify-end gap-2">
              <button onclick="trenzOpenStockModal('${item.id}')" class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">
                Stock
              </button>
              <button onclick="trenzToggleWebsiteVisibility('${item.id}'); trenzRenderInventoryTable('${containerId}')" class="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-300 hover:bg-blue-500/20">
                Website
              </button>
              <button onclick="trenzTogglePosVisibility('${item.id}'); trenzRenderInventoryTable('${containerId}')" class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20">
                POS
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function openStockModal(productId) {
    const inventory = getInventory();
    const item = inventory.find((record) => record.id === productId);

    if (!item) return;

    const modal = document.getElementById("stockModal");
    if (!modal) return;

    document.getElementById("stockProductId").value = item.id;
    document.getElementById("stockProductName").textContent = item.name;
    document.getElementById("stockMainInput").value = item.stock || 0;
    document.getElementById("stockAnnaInput").value = item.branchStock?.["BEST CHOICE ANNA NAGAR BRANCH"] || 0;
    document.getElementById("stockPadiInput").value = item.branchStock?.["PADI BRANCH"] || 0;
    document.getElementById("stockSpencerInput").value = item.branchStock?.["SPENCER"] || 0;
    document.getElementById("stockStateInput").value = item.state || "Available";

    modal.classList.remove("hidden");
  }

  function closeStockModal() {
    const modal = document.getElementById("stockModal");
    if (modal) modal.classList.add("hidden");
  }

  function saveStockModal() {
    const productId = document.getElementById("stockProductId").value;
    const inventory = getInventory();
    const item = inventory.find((record) => record.id === productId);

    if (!item) return;

    item.stock = Number(document.getElementById("stockMainInput").value || 0);
    item.branchStock = {
      "BEST CHOICE ANNA NAGAR BRANCH": Number(document.getElementById("stockAnnaInput").value || 0),
      "PADI BRANCH": Number(document.getElementById("stockPadiInput").value || 0),
      "SPENCER": Number(document.getElementById("stockSpencerInput").value || 0)
    };
    item.state = document.getElementById("stockStateInput").value;
    item.posVisible = Object.values(item.branchStock).some((qty) => Number(qty) > 0);
    item.websiteVisible = item.posVisible;

    saveInventory(inventory);
    closeStockModal();

    if (document.getElementById("mainInventoryRows")) {
      renderInventoryTable("mainInventoryRows");
    }

    if (document.getElementById("branchInventoryRows")) {
      renderInventoryTable("branchInventoryRows");
    }
  }

  function toggleWebsiteVisibility(productId) {
    const inventory = getInventory();
    const item = inventory.find((record) => record.id === productId);

    if (!item) return;

    item.websiteVisible = !item.websiteVisible;
    saveInventory(inventory);
  }

  function togglePosVisibility(productId) {
    const inventory = getInventory();
    const item = inventory.find((record) => record.id === productId);

    if (!item) return;

    item.posVisible = !item.posVisible;
    saveInventory(inventory);
  }

  window.trenzGetInventory = getInventory;
  window.trenzSaveInventory = saveInventory;
  window.trenzRenderInventoryTable = renderInventoryTable;
  window.trenzOpenStockModal = openStockModal;
  window.trenzCloseStockModal = closeStockModal;
  window.trenzSaveStockModal = saveStockModal;
  window.trenzToggleWebsiteVisibility = toggleWebsiteVisibility;
  window.trenzTogglePosVisibility = togglePosVisibility;
})();
