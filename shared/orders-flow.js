function orderBadge(value = "") {
  const text = value.toLowerCase();

  if (text.includes("paid") || text.includes("completed") || text.includes("delivered") || text.includes("logged")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (text.includes("picking") || text.includes("packed") || text.includes("reserved") || text.includes("eligible")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (text.includes("website")) {
    return "bg-blue-500/10 text-blue-300";
  }

  if (text.includes("pos")) {
    return "bg-cyan-500/10 text-cyan-300";
  }

  if (text.includes("restricted")) {
    return "bg-red-500/10 text-red-300";
  }

  return "bg-slate-800 text-slate-300";
}

function renderOrderSummary() {
  const summary = TRENZ_ORDERS_DATA.summary;

  const values = {
    orderTotalOrders: summary.totalOrders,
    orderWebsiteOrders: summary.websiteOrders,
    orderPosInvoices: summary.posInvoices,
    orderPicking: summary.picking,
    orderDelivered: summary.delivered,
    orderRevenue: orderMoney(summary.revenue)
  };

  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

function renderOrderTable(containerId, orders = TRENZ_ORDERS_DATA.orders) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = orders.map((order) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <p class="font-medium">${order.id}</p>
        <p class="mt-1 text-xs text-slate-400">${order.invoice}</p>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${orderBadge(order.channel)}">${order.channel}</span>
      </td>

      <td class="px-5 py-4">
        <p>${order.customer}</p>
        <p class="mt-1 text-xs text-slate-400">${order.customerId}</p>
      </td>

      <td class="px-5 py-4">
        <p>${order.branch}</p>
        <p class="mt-1 text-xs text-slate-400">${order.delivery}</p>
      </td>

      <td class="px-5 py-4">
        <p class="font-medium">${orderMoney(order.amount)}</p>
        <p class="mt-1 text-xs text-slate-400">${order.items} item(s)</p>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${orderBadge(order.stockState)}">${order.stockState}</span>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${orderBadge(order.fulfillment)}">${order.fulfillment}</span>
      </td>

      <td class="px-5 py-4">
        <p class="text-fuchsia-300 text-xs">${order.crm}</p>
        <p class="mt-1 text-amber-300 text-xs">${order.analytics}</p>
      </td>

      <td class="px-5 py-4 text-right">
        <div class="flex justify-end gap-2">
          <button onclick="advanceFulfillment('${order.id}')" class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">
            Advance
          </button>
          <a href="owner/returns.html" class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">
            Return
          </a>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderOrderFlow(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_ORDERS_DATA.fulfillmentSteps.map((step, index) => `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p class="text-xs text-indigo-300">Step ${String(index + 1).padStart(2, "0")}</p>
      <p class="mt-1 text-sm font-semibold">${step}</p>
    </div>
  `).join("");
}

function advanceFulfillment(orderId) {
  const order = TRENZ_ORDERS_DATA.orders.find((item) => item.id === orderId);

  if (!order) return;

  const sequence = ["Picking", "Packed", "Dispatch Ready", "Delivered", "Completed"];
  const currentIndex = sequence.indexOf(order.fulfillment);
  const next = sequence[Math.min(currentIndex + 1, sequence.length - 1)];

  order.fulfillment = next;

  if (next === "Delivered" || next === "Completed") {
    order.stockState = "Sold";
    order.crm = "Customer updated";
    order.analytics = "Revenue confirmed";
  }

  renderOrderTable("orderRows", window.currentOrders || TRENZ_ORDERS_DATA.orders);
  renderOrderImpact("orderImpactPanel", order);
}

function renderOrderImpact(containerId, order = TRENZ_ORDERS_DATA.orders[0]) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p class="text-sm font-semibold">${order.id}</p>
      <p class="mt-1 text-xs text-slate-400">${order.customer} · ${order.branch}</p>
    </div>

    <div class="space-y-3 text-xs">
      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Branch Inventory</span>
        <span class="text-cyan-300">${order.stockState}</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Fulfillment</span>
        <span class="text-emerald-300">${order.fulfillment}</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">CRM</span>
        <span class="text-fuchsia-300">${order.crm}</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Analytics</span>
        <span class="text-amber-300">${order.analytics}</span>
      </div>
    </div>
  `;
}

function filterOrders() {
  const channel = document.getElementById("orderChannelFilter")?.value || "All";
  const branch = document.getElementById("orderBranchFilter")?.value || "all";
  const status = document.getElementById("orderStatusFilter")?.value || "All";

  let orders = TRENZ_ORDERS_DATA.orders;

  if (channel !== "All") {
    orders = orders.filter((order) => order.channel === channel);
  }

  if (branch !== "all") {
    orders = orders.filter((order) => order.branchId === branch);
  }

  if (status !== "All") {
    orders = orders.filter((order) => order.fulfillment === status);
  }

  window.currentOrders = orders;
  renderOrderTable("orderRows", orders);
}
