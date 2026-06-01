function campaignBadge(value = "") {
  const text = value.toLowerCase();

  if (text.includes("active") || text.includes("enabled")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (text.includes("scheduled")) {
    return "bg-blue-500/10 text-blue-300";
  }

  if (text.includes("draft")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (text.includes("whatsapp")) {
    return "bg-green-500/10 text-green-300";
  }

  return "bg-indigo-500/10 text-indigo-300";
}

function renderCampaignSummary() {
  const s = TRENZ_CAMPAIGN_DATA.summary;

  const map = {
    campaignActive: s.activeCampaigns,
    campaignWhatsapp: s.whatsappSent,
    campaignConversion: s.conversionRate,
    campaignRevenue: campaignMoney(s.revenue),
    campaignEligible: s.eligibleCustomers,
    campaignBanners: s.websiteBanners
  };

  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

function renderCampaignRows(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_CAMPAIGN_DATA.campaigns.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <p class="font-medium">${item.name}</p>
        <p class="mt-1 text-xs text-slate-400">${item.id}</p>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${campaignBadge(item.type)}">${item.type}</span>
      </td>

      <td class="px-5 py-4">
        <p>${item.segment}</p>
        <p class="mt-1 text-xs text-slate-400">${item.branch}</p>
      </td>

      <td class="px-5 py-4">
        <p>${item.offer}</p>
        <p class="mt-1 text-xs text-slate-400">${item.products}</p>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${campaignBadge(item.status)}">${item.status}</span>
      </td>

      <td class="px-5 py-4">
        <p>${item.sent.toLocaleString("en-IN")} sent</p>
        <p class="mt-1 text-xs text-emerald-300">${item.conversion}</p>
      </td>

      <td class="px-5 py-4">${campaignMoney(item.revenue)}</td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${campaignBadge(item.websiteBanner)}">${item.websiteBanner}</span>
      </td>

      <td class="px-5 py-4 text-right">
        <button class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">
          Manage
        </button>
      </td>
    </tr>
  `).join("");
}

function renderCampaignBuilder(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4">
      <div>
        <label class="text-xs text-slate-400">Campaign name</label>
        <input value="Weekend Chennai Retail Offer" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400" />
      </div>

      <div>
        <label class="text-xs text-slate-400">Customer segment</label>
        <select class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          ${TRENZ_CAMPAIGN_DATA.segments.map((item) => `<option>${item}</option>`).join("")}
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Branch</label>
        <select class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>Select All</option>
          <option>BEST CHOICE ANNA NAGAR BRANCH</option>
          <option>PADI BRANCH</option>
          <option>SPENCER</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Offer</label>
        <input value="Flat 10% off on selected products" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400" />
      </div>

      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p class="text-sm font-semibold">Connected impact</p>
        <div class="mt-3 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">CRM</span>
            <span class="text-fuchsia-300">Segment targeted</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Website</span>
            <span class="text-blue-300">Banner ready</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Orders</span>
            <span class="text-emerald-300">Conversion tracked</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Analytics</span>
            <span class="text-amber-300">ROI measured</span>
          </div>
        </div>
      </div>

      <button class="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold hover:bg-indigo-400">
        Launch Campaign
      </button>
    </div>
  `;
}
