(function () {
  function getStaffList() {
    return trenzDbGet(TRENZ_DB_KEYS.staff, []);
  }

  function saveStaffList(staff) {
    trenzDbSet(TRENZ_DB_KEYS.staff, staff);
  }

  function badge(value = "") {
    const text = value.toLowerCase();

    if (text.includes("owner")) return "bg-indigo-500/10 text-indigo-300";
    if (text.includes("manager")) return "bg-cyan-500/10 text-cyan-300";
    if (text.includes("cashier")) return "bg-emerald-500/10 text-emerald-300";
    if (text.includes("staff")) return "bg-amber-500/10 text-amber-300";
    if (text.includes("disabled")) return "bg-red-500/10 text-red-300";
    if (text.includes("active")) return "bg-emerald-500/10 text-emerald-300";

    return "bg-slate-800 text-slate-300";
  }

  function roleRestrictionText(role) {
    const map = {
      Owner: "Full system access",
      Manager: "Assigned branch operations",
      Cashier: "POS, invoices, customer lookup, returns",
      Staff: "Tasks, lookup, return initiation"
    };

    return map[role] || "Limited access";
  }

  function renderStaffTable() {
    const container = document.getElementById("staffCrudRows");
    if (!container) return;

    const staff = getStaffList();

    container.innerHTML = staff.map((item) => `
      <tr class="hover:bg-slate-800/40">
        <td class="px-5 py-4">
          <p class="font-medium">${item.name}</p>
          <p class="mt-1 text-xs text-slate-400">${item.id} · ${item.email}</p>
        </td>

        <td class="px-5 py-4">${item.phone}</td>

        <td class="px-5 py-4">
          <span class="rounded-full px-3 py-1 text-xs ${badge(item.role)}">${item.role}</span>
          <p class="mt-1 text-xs text-slate-500">${roleRestrictionText(item.role)}</p>
        </td>

        <td class="px-5 py-4">${item.branch}</td>

        <td class="px-5 py-4">
          <span class="rounded-full px-3 py-1 text-xs ${badge(item.status)}">${item.status}</span>
        </td>

        <td class="px-5 py-4 text-right">
          <div class="flex justify-end gap-2">
            <button onclick="trenzOpenEditStaff('${item.id}')" class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">Edit</button>
            <button onclick="trenzToggleStaffStatus('${item.id}')" class="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20">${item.status === "Active" ? "Disable" : "Enable"}</button>
            <button onclick="trenzResetStaffPassword('${item.id}')" class="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-500/20">Reset</button>
            <button onclick="trenzDeleteStaff('${item.id}')" class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20">Delete</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  function openModal(mode, staff = null) {
    const modal = document.getElementById("staffModal");
    const title = document.getElementById("staffModalTitle");

    if (!modal || !title) return;

    title.textContent = mode === "edit" ? "Edit Staff" : "Add Staff";

    document.getElementById("staffIdInput").value = staff?.id || "";
    document.getElementById("staffNameInput").value = staff?.name || "";
    document.getElementById("staffEmailInput").value = staff?.email || "";
    document.getElementById("staffPhoneInput").value = staff?.phone || "";
    document.getElementById("staffRoleInput").value = staff?.role || "Staff";
    document.getElementById("staffBranchInput").value = staff?.branch || "BEST CHOICE ANNA NAGAR BRANCH";

    updateRolePreview();
    modal.classList.remove("hidden");
  }

  function closeModal() {
    const modal = document.getElementById("staffModal");
    if (modal) modal.classList.add("hidden");
  }

  function updateRolePreview() {
    const role = document.getElementById("staffRoleInput")?.value || "Staff";
    const preview = document.getElementById("roleRestrictionPreview");

    if (!preview) return;

    const permissions = {
      Owner: ["All branches", "Inventory", "Website", "Reports", "Settings", "Staff"],
      Manager: ["Assigned branch", "Orders", "CRM", "Returns", "Staff monitoring"],
      Cashier: ["POS", "Invoices", "Customer search", "Return initiation"],
      Staff: ["Tasks", "Order lookup", "Customer lookup", "Return initiation"]
    };

    preview.innerHTML = `
      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p class="text-sm font-semibold">${role} access</p>
        <div class="mt-3 flex flex-wrap gap-2">
          ${(permissions[role] || []).map((permission) => `
            <span class="rounded-full px-3 py-1 text-xs ${badge(role)}">${permission}</span>
          `).join("")}
        </div>
      </div>
    `;
  }

  function saveFromModal() {
    const id = document.getElementById("staffIdInput").value;
    const name = document.getElementById("staffNameInput").value.trim();
    const email = document.getElementById("staffEmailInput").value.trim();
    const phone = document.getElementById("staffPhoneInput").value.trim();
    const role = document.getElementById("staffRoleInput").value;
    const branch = document.getElementById("staffBranchInput").value;

    if (!name || !email || !phone) {
      showActionAlert("Missing details", "Please enter name, email and phone.", "red");
      return;
    }

    const staff = getStaffList();

    if (id) {
      const index = staff.findIndex((item) => item.id === id);
      if (index >= 0) {
        staff[index] = {
          ...staff[index],
          name,
          email,
          phone,
          role,
          branch
        };
      }
    } else {
      staff.unshift({
        id: trenzCreateId("STF"),
        name,
        email,
        phone,
        role,
        branch,
        status: "Active",
        createdAt: new Date().toISOString()
      });
    }

    saveStaffList(staff);
    closeModal();
    renderStaffTable();
    showActionAlert("Staff saved", `${name} has been saved with ${role} access.`, "emerald");
  }

  function showActionAlert(title, detail, color = "emerald") {
    const alert = document.getElementById("staffActionAlert");
    if (!alert) return;

    const classes = {
      emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      red: "border-red-500/30 bg-red-500/10 text-red-300",
      cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
    };

    alert.classList.remove("hidden");
    alert.innerHTML = `
      <div class="rounded-2xl border ${classes[color] || classes.emerald} p-4">
        <p class="text-sm font-semibold">${title}</p>
        <p class="mt-1 text-xs text-slate-300">${detail}</p>
      </div>
    `;
  }

  function openAddStaff() {
    openModal("add");
  }

  function openEditStaff(id) {
    const staff = getStaffList();
    const item = staff.find((record) => record.id === id);
    if (item) openModal("edit", item);
  }

  function toggleStaffStatus(id) {
    const staff = getStaffList();
    const item = staff.find((record) => record.id === id);

    if (!item) return;

    item.status = item.status === "Active" ? "Disabled" : "Active";
    saveStaffList(staff);
    renderStaffTable();
    showActionAlert("Status updated", `${item.name} is now ${item.status}.`, "cyan");
  }

  function deleteStaff(id) {
    const staff = getStaffList();
    const item = staff.find((record) => record.id === id);
    const updated = staff.filter((record) => record.id !== id);

    saveStaffList(updated);
    renderStaffTable();
    showActionAlert("Staff deleted", `${item?.name || id} has been removed from staff list.`, "red");
  }

  function resetPassword(id) {
    const staff = getStaffList();
    const item = staff.find((record) => record.id === id);
    showActionAlert("Password reset", `Temporary password for ${item?.name || id}: Trenzos@123`, "cyan");
  }

  window.trenzRenderStaffTable = renderStaffTable;
  window.trenzOpenAddStaff = openAddStaff;
  window.trenzOpenEditStaff = openEditStaff;
  window.trenzCloseStaffModal = closeModal;
  window.trenzSaveStaffFromModal = saveFromModal;
  window.trenzToggleStaffStatus = toggleStaffStatus;
  window.trenzDeleteStaff = deleteStaff;
  window.trenzResetStaffPassword = resetPassword;
  window.trenzUpdateRolePreview = updateRolePreview;
})();
