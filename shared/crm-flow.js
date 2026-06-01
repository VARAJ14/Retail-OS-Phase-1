function crmBadge(value = "") {
  const text = value.toLowerCase();

  if (text.includes("gold") || text.includes("vip") || text.includes("high trust") || text.includes("campaign")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (text.includes("silver") || text.includes("warranty")) {
    return "bg-cyan-500/10 text-cyan-300";
  }

  if (text.includes("return") || text.includes("manual")) {
    return "bg-red-500/10 text-red-300";
  }

  if (text.includes("beauty")) {
    return "bg-fuchsia-500/10 text-fuchsia-300";
  }

  return "bg-indigo-500/10 text-indigo-300";
}

function renderCrmSummary() {
  const s = TRENZ_CRM_DATA.summary;

  const map = {
    crmCustomers: s.customers,
    crmRepeatBuyers: s.repeatBuyers,
    crmLoyaltyMembers: s.loyaltyMembers,
    crmCampaignEligible: s.campaignEligible,
    crmReturnRisk: s.returnRisk,
    crmGoldMembers: s.goldMembers
  };

  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = Number(value).toLocaleString("en-IN");
  });
}

function renderCrmCustomers(containerId, customers = TRENZ_CRM_DATA.customers) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = customers.map((customer) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <p class="font-medium">${customer.name}</p>
        <p class="mt-1 text-xs text-slate-400">${customer.id} · ${customer.phone}</p>
      </td>

      <td class="px-5 py-4">${customer.branch}</td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${crmBadge(customer.tier)}">${customer.tier}</span>
        <p class="mt-2 text-xs text-slate-400">${customer.points.toLocaleString("en-IN")} points</p>
      </td>

      <td class="px-5 py-4">
        <p>${customer.orders} orders</p>
        <p class="mt-1 text-xs text-slate-400">${crmMoney(customer.spend)}</p>
      </td>

      <td class="px-5 py-4">
        <p class="${customer.returns >= 5 ? "text-red-300" : "text-amber-300"}">${customer.returns} returns</p>
        <p class="mt-1 text-xs text-slate-400">${customer.returnRate}</p>
      </td>

      <td class="px-5 py-4">
        <div class="flex flex-wrap gap-1">
          ${customer.segment.map((item) => `
            <span class="rounded-full px-2 py-1 text-xs ${crmBadge(item)}">${item}</span>
          `).join("")}
        </div>
      </td>

      <td class="px-5 py-4">
        <p class="text-cyan-300">${customer.nextAction}</p>
        <p class="mt-1 text-xs text-slate-400">${customer.lastPurchase}</p>
      </td>

      <td class="px-5 py-4 text-right">
        <button onclick="selectCustomer('${customer.id}')" class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">
          View
        </button>
      </td>
    </tr>
  `).join("");
}

function renderCustomerPanel(containerId, customer = TRENZ_CRM_DATA.customers[0]) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p class="font-semibold">${customer.name}</p>
      <p class="mt-1 text-xs text-slate-400">${customer.id} · ${customer.email}</p>
    </div>

    <div class="grid grid-cols-2 gap-3 text-xs">
      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p class="text-slate-400">Spend</p>
        <p class="mt-1 text-lg font-semibold">${crmMoney(customer.spend)}</p>
      </div>

      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p class="text-slate-400">Orders</p>
        <p class="mt-1 text-lg font-semibold">${customer.orders}</p>
      </div>

      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p class="text-slate-400">Returns</p>
        <p class="mt-1 text-lg font-semibold text-amber-300">${customer.returns}</p>
      </div>

      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p class="text-slate-400">Points</p>
        <p class="mt-1 text-lg font-semibold text-emerald-300">${customer.points}</p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p class="text-sm font-semibold">Next action</p>
      <p class="mt-2 text-xs text-cyan-300">${customer.nextAction}</p>
    </div>
  `;
}

function renderCrmTimeline(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_CRM_DATA.timeline.map((item) => `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-medium">${item.type}</p>
          <p class="mt-1 text-xs text-slate-400">${item.detail}</p>
          <p class="mt-1 text-xs text-emerald-300">${item.impact}</p>
        </div>
        <span class="text-xs text-slate-500">${item.time}</span>
      </div>
    </div>
  `).join("");
}

function selectCustomer(id) {
  const customer = TRENZ_CRM_DATA.customers.find((item) => item.id === id);

  if (!customer) return;

  renderCustomerPanel("crmCustomerPanel", customer);
}
