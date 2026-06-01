function returnBadgeClass(value = "") {
  const status = value.toLowerCase();

  if (status.includes("approved") || status.includes("eligible")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (status.includes("pending") || status.includes("review") || status.includes("required") || status.includes("validation")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (status.includes("restricted") || status.includes("rejected") || status.includes("sensitive") || status.includes("return-prone")) {
    return "bg-red-500/10 text-red-300";
  }

  if (status.includes("warranty")) {
    return "bg-cyan-500/10 text-cyan-300";
  }

  return "bg-slate-800 text-slate-300";
}

function categoryReturnClass(category) {
  const map = {
    Clothing: "bg-indigo-500/15 text-indigo-200 border-indigo-500/20",
    Electronics: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    Cosmetics: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
    Accessories: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
  };

  return map[category] || "bg-slate-800 text-slate-300 border-slate-700";
}

function renderReturnSummary(prefix, summary = TRENZ_RETURNS_DATA.summary) {
  const values = {
    [`${prefix}TotalRequests`]: summary.totalRequests,
    [`${prefix}PendingApproval`]: summary.pendingApproval,
    [`${prefix}ApprovedToday`]: summary.approvedToday,
    [`${prefix}RefundAmount`]: returnMoney(summary.refundAmount),
    [`${prefix}ExchangeRequests`]: summary.exchangeRequests,
    [`${prefix}WarrantyClaims`]: summary.warrantyClaims
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });
}

function renderReturnTable(containerId, requests) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = requests.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <p class="font-medium">${item.id}</p>
        <p class="mt-1 text-xs text-slate-400">${item.orderId} · ${item.invoice}</p>
      </td>

      <td class="px-5 py-4">
        <p>${item.customer}</p>
        <p class="mt-1 text-xs text-slate-400">${item.customerId}</p>
      </td>

      <td class="px-5 py-4">
        <div class="flex items-center gap-3">
          <div class="h-11 w-11 rounded-2xl border flex items-center justify-center text-xs font-black ${categoryReturnClass(item.category)}">
            ${item.category.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <p class="font-medium">${item.product}</p>
            <p class="mt-1 text-xs text-slate-400">${item.sku}</p>
          </div>
        </div>
      </td>

      <td class="px-5 py-4">
        <p>${item.reason}</p>
        <p class="mt-1 text-xs text-slate-400">${item.resolution}</p>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${returnBadgeClass(item.validation)}">
          ${item.validation}
        </span>
        <p class="mt-2 text-xs text-slate-500">${item.rule}</p>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${returnBadgeClass(item.status)}">
          ${item.status}
        </span>
        <p class="mt-2 text-xs text-slate-500">${item.requestDate}</p>
      </td>

      <td class="px-5 py-4">
        <p class="text-cyan-300">${item.inventoryAction}</p>
        <p class="mt-1 text-xs text-slate-400">Next: ${item.nextState}</p>
      </td>

      <td class="px-5 py-4 text-right">
        <div class="flex justify-end gap-2">
          <button onclick="approveReturn('${item.id}')" class="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400">
            Approve
          </button>
          <button onclick="rejectReturn('${item.id}')" class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20">
            Reject
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderBranchReturnCards(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_RETURNS_DATA.branches.map((branch) => `
    <div class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-semibold">${branch.name}</p>
          <p class="mt-1 text-sm text-slate-400">Return queue</p>
        </div>

        <span class="rounded-full bg-amber-500/10 text-amber-300 px-3 py-1 text-xs">
          ${branch.pending} pending
        </span>
      </div>

      <div class="mt-5 grid grid-cols-3 gap-3 text-xs">
        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">Approved</p>
          <p class="mt-1 font-semibold text-emerald-300">${branch.approved}</p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">Rejected</p>
          <p class="mt-1 font-semibold text-red-300">${branch.rejected}</p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-950 p-3">
          <p class="text-slate-400">Refund</p>
          <p class="mt-1 font-semibold text-amber-300">${returnMoney(branch.refundValue)}</p>
        </div>
      </div>
    </div>
  `).join("");
}

function renderReturnActivity(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_RETURNS_DATA.activity.map((item) => `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-medium">${item.title}</p>
          <p class="mt-1 text-xs text-slate-400">${item.detail}</p>
        </div>

        <span class="text-xs text-slate-500">${item.time}</span>
      </div>
    </div>
  `).join("");
}

function renderReturnAnalytics(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  const analytics = TRENZ_RETURNS_DATA.analytics;

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <p class="text-sm text-slate-400">Return Rate</p>
        <p class="mt-3 text-3xl font-semibold text-amber-300">${analytics.returnRate}</p>
      </div>

      <div class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <p class="text-sm text-slate-400">Refund Amount</p>
        <p class="mt-3 text-3xl font-semibold text-red-300">${returnMoney(analytics.refundAmount)}</p>
      </div>

      <div class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <p class="text-sm text-slate-400">Most Returned</p>
        <p class="mt-3 text-lg font-semibold">${analytics.mostReturnedProducts[0].product}</p>
        <p class="mt-1 text-xs text-slate-400">${analytics.mostReturnedProducts[0].reason}</p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div class="p-5 border-b border-slate-800">
          <h3 class="font-semibold">Most returned products</h3>
        </div>

        <div class="divide-y divide-slate-800">
          ${analytics.mostReturnedProducts.map((item) => `
            <div class="p-5 flex items-center justify-between gap-4">
              <div>
                <p class="font-medium">${item.product}</p>
                <p class="mt-1 text-xs text-slate-400">${item.category} · ${item.reason}</p>
              </div>
              <span class="rounded-full bg-amber-500/10 text-amber-300 px-3 py-1 text-xs">
                ${item.count} returns
              </span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div class="p-5 border-b border-slate-800">
          <h3 class="font-semibold">Category breakdown</h3>
        </div>

        <div class="divide-y divide-slate-800">
          ${analytics.categoryBreakdown.map((item) => `
            <div class="p-5 flex items-center justify-between gap-4">
              <div>
                <p class="font-medium">${item.category}</p>
                <p class="mt-1 text-xs text-slate-400">${item.action}</p>
              </div>
              <span class="rounded-full bg-indigo-500/10 text-indigo-300 px-3 py-1 text-xs">
                ${item.rate}
              </span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderApprovalPanel(containerId, itemId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  const item = TRENZ_RETURNS_DATA.requests.find((request) => request.id === itemId) || TRENZ_RETURNS_DATA.requests[0];

  container.innerHTML = `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p class="text-sm font-semibold">${item.id}</p>
      <p class="mt-1 text-xs text-slate-400">${item.customer} · ${item.customerId}</p>
    </div>

    <div class="space-y-3 text-xs">
      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Product</span>
        <span>${item.product}</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Validation</span>
        <span class="text-amber-300">${item.validation}</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Inventory</span>
        <span class="text-cyan-300">${item.inventoryAction}</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Refund</span>
        <span class="text-emerald-300">${item.refundStatus}</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">CRM</span>
        <span class="text-fuchsia-300">Return history +1</span>
      </div>

      <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <span class="text-slate-400">Analytics</span>
        <span class="text-amber-300">Return rate updated</span>
      </div>
    </div>
  `;
}

function approveReturn(id) {
  const item = TRENZ_RETURNS_DATA.requests.find((request) => request.id === id);

  if (!item) return;

  item.status = "Approved";
  item.refundStatus = item.resolution.includes("Exchange") ? "Exchange initiated" : "Refund processing";

  renderApprovalPanel("approvalImpactPanel", id);
  renderReturnTable("returnTableRows", window.currentReturnRequests || TRENZ_RETURNS_DATA.requests);
}

function rejectReturn(id) {
  const item = TRENZ_RETURNS_DATA.requests.find((request) => request.id === id);

  if (!item) return;

  item.status = "Rejected";
  item.refundStatus = "Refund rejected";

  renderApprovalPanel("approvalImpactPanel", id);
  renderReturnTable("returnTableRows", window.currentReturnRequests || TRENZ_RETURNS_DATA.requests);
}
