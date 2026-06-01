function renderStaffRows(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = TRENZ_GOVERNANCE_DATA.staff.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4 font-medium">${item.name}</td>
      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${governanceStatusBadge(item.role)}">${item.role}</span>
      </td>
      <td class="px-5 py-4">${item.branch}</td>
      <td class="px-5 py-4">${item.access}</td>
      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${governanceStatusBadge(item.status)}">${item.status}</span>
      </td>
      <td class="px-5 py-4 text-right">
        <button class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">
          Manage
        </button>
      </td>
    </tr>
  `).join("");
}

function renderPermissionRows(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = TRENZ_GOVERNANCE_DATA.permissions.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4 font-medium">${item.module}</td>
      <td class="px-5 py-4"><span class="rounded-full px-3 py-1 text-xs ${governanceStatusBadge(item.owner)}">${item.owner}</span></td>
      <td class="px-5 py-4"><span class="rounded-full px-3 py-1 text-xs ${governanceStatusBadge(item.manager)}">${item.manager}</span></td>
      <td class="px-5 py-4"><span class="rounded-full px-3 py-1 text-xs ${governanceStatusBadge(item.cashier)}">${item.cashier}</span></td>
      <td class="px-5 py-4"><span class="rounded-full px-3 py-1 text-xs ${governanceStatusBadge(item.staff)}">${item.staff}</span></td>
    </tr>
  `).join("");
}

function renderSettingsRows(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = TRENZ_GOVERNANCE_DATA.settings.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4 font-medium">${item.setting}</td>
      <td class="px-5 py-4 text-slate-300">${item.value}</td>
      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${governanceStatusBadge(item.status)}">${item.status}</span>
      </td>
      <td class="px-5 py-4 text-right">
        <button class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">
          Edit
        </button>
      </td>
    </tr>
  `).join("");
}
