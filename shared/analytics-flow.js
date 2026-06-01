function renderAnalyticsSummary() {
  const s = TRENZ_ANALYTICS_DATA.summary;

  const map = {
    analyticsSales: analyticsMoney(s.netSales),
    analyticsOrders: s.orders.toLocaleString("en-IN"),
    analyticsReturns: s.returnRate,
    analyticsTurnover: s.inventoryTurnover,
    analyticsRetention: s.retention,
    analyticsDeadStock: analyticsMoney(s.deadStock)
  };

  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

function renderBranchAnalytics(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = TRENZ_ANALYTICS_DATA.branchPerformance.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4 font-medium">${item.branch}</td>
      <td class="px-5 py-4">${analyticsMoney(item.sales)}</td>
      <td class="px-5 py-4">${item.orders.toLocaleString("en-IN")}</td>
      <td class="px-5 py-4 text-amber-300">${item.returns}</td>
      <td class="px-5 py-4">${item.stockHealth}</td>
    </tr>
  `).join("");
}

function renderCategoryAnalytics(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = TRENZ_ANALYTICS_DATA.categoryPerformance.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4 font-medium">${item.category}</td>
      <td class="px-5 py-4">${analyticsMoney(item.sales)}</td>
      <td class="px-5 py-4 text-emerald-300">${item.trend}</td>
      <td class="px-5 py-4 text-amber-300">${item.returns}</td>
      <td class="px-5 py-4 text-cyan-300">${item.action}</td>
    </tr>
  `).join("");
}

function renderReportRows(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = TRENZ_ANALYTICS_DATA.reports.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4 font-medium">${item.name}</td>
      <td class="px-5 py-4">${item.data}</td>
      <td class="px-5 py-4">${item.format}</td>
      <td class="px-5 py-4">${item.frequency}</td>
      <td class="px-5 py-4">${item.owner}</td>
      <td class="px-5 py-4 text-right">
        <button class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">Run</button>
      </td>
    </tr>
  `).join("");
}
