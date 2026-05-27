function badgeClass(color) {
  const classes = {
    indigo: "bg-indigo-500/15 text-indigo-200 border-indigo-500/30",
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    fuchsia: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    red: "bg-red-500/10 text-red-300 border-red-500/30"
  };

  return classes[color] || classes.indigo;
}

function statusBadge(status) {
  const normalized = status.toLowerCase();

  if (normalized.includes("healthy") || normalized.includes("live") || normalized.includes("ready")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (normalized.includes("watch") || normalized.includes("receive") || normalized.includes("inspect")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (normalized.includes("low") || normalized.includes("critical")) {
    return "bg-red-500/10 text-red-300";
  }

  return "bg-slate-800 text-slate-300";
}

function renderLifecycle(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_DASHBOARD_DATA.liveFlow.map((item, index) => {
    return `
      <div class="rounded-2xl border ${badgeClass(item.color)} p-4">
        <p class="text-xs">Step ${String(index + 1).padStart(2, "0")}</p>
        <p class="mt-1 text-sm font-semibold">${item.step}</p>
        <div class="mt-3 flex items-center justify-between gap-2">
          <span class="text-xs">${item.status}</span>
          <span class="text-xs text-slate-400">${item.count}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderOwnerBranchTable(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_DASHBOARD_DATA.branches.map((branch) => {
    return `
      <tr class="hover:bg-slate-800/40">
        <td class="px-5 py-4">
          <p class="font-medium">${branch.name}</p>
          <p class="mt-1 text-xs text-slate-400">${branch.city} · Manager: ${branch.manager}</p>
        </td>
        <td class="px-5 py-4">${formatINR(branch.salesToday)}</td>
        <td class="px-5 py-4">${branch.ordersToday}</td>
        <td class="px-5 py-4">
          <span class="rounded-full px-3 py-1 text-xs ${statusBadge(branch.stockHealth)}">${branch.stockHealth}</span>
        </td>
        <td class="px-5 py-4">${branch.lowStock}</td>
        <td class="px-5 py-4">${branch.returnsPending}</td>
        <td class="px-5 py-4">
          <span class="rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs">${branch.sync}</span>
        </td>
        <td class="px-5 py-4 text-right">
          <a href="../manager/dashboard.html?branch=${branch.id}" class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">
            View
          </a>
        </td>
      </tr>
    `;
  }).join("");
}

function renderInventoryAlerts(containerId, limit = 4) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_DASHBOARD_DATA.inventoryAlerts.slice(0, limit).map((alert) => {
    const color = alert.state === "Critical" ? "red" : alert.state === "Expiry Watch" ? "amber" : "cyan";

    return `
      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium">${alert.item}</p>
            <p class="mt-1 text-xs text-slate-400">${alert.sku} · ${alert.branch}</p>
          </div>
          <span class="rounded-full border px-3 py-1 text-xs ${badgeClass(color)}">${alert.state}</span>
        </div>

        <div class="mt-4 flex items-center justify-between">
          <span class="text-xs text-slate-400">Qty: ${alert.qty}</span>
          <button class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">
            ${alert.action}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderActivity(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_DASHBOARD_DATA.recentActivity.map((activity) => {
    return `
      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium">${activity.title}</p>
            <p class="mt-1 text-xs text-slate-400">${activity.detail}</p>
          </div>
          <span class="text-xs text-slate-500">${activity.time}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderManagerQueue(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_DASHBOARD_DATA.branchQueue.map((item) => {
    return `
      <tr class="hover:bg-slate-800/40">
        <td class="px-5 py-4">
          <p class="font-medium">${item.id}</p>
          <p class="mt-1 text-xs text-slate-400">${item.type}</p>
        </td>
        <td class="px-5 py-4">${item.item}</td>
        <td class="px-5 py-4">${item.qty}</td>
        <td class="px-5 py-4">${item.from}</td>
        <td class="px-5 py-4">${item.to}</td>
        <td class="px-5 py-4 text-right">
          <button class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">
            ${item.status}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}
