const TRENZOS_RBAC = {
  roles: {
    owner: {
      label: "Owner",
      redirect: 'owner-dashboard.html',
      branchScope: "all",
      permissions: [
        "dashboard:global",
        "inventory:master",
        "branch:all",
        "pos:monitor",
        "website:manage",
        "crm:full",
        "analytics:global",
        "reports:full",
        "settings:full",
        "staff:manage"
      ]
    },

    manager: {
      label: "Manager",
      redirect: "manager-dashboard.html",
      branchScope: "assigned",
      permissions: [
        "dashboard:branch",
        "branch:assigned",
        "orders:branch",
        "pos:monitor",
        "crm:branch",
        "returns:approve_branch",
        "reports:branch"
      ]
    },

    cashier: {
      label: "Cashier",
      redirect: "cashier/pos.html",
      branchScope: "assigned",
      permissions: [
        "pos:billing",
        "invoice:create",
        "customer:lookup",
        "orders:lookup",
        "returns:initiate",
        "crm:note"
      ]
    },

    staff: {
      label: "Staff",
      redirect: "staff/tasks.html",
      branchScope: "assigned",
      permissions: [
        "tasks:view",
        "customer:lookup",
        "orders:lookup",
        "returns:initiate"
      ]
    }
  },

  branches: {
    all: {
      label: "Select All",
      code: "ALL"
    },

    "anna-nagar": {
      label: "BEST CHOICE ANNA NAGAR BRANCH",
      code: "BCA"
    },

    padi: {
      label: "PADI BRANCH",
      code: "PDI"
    },

    spencer: {
      label: "SPENCER",
      code: "SPN"
    }
  }
};

function getRoleConfig(role) {
  return TRENZOS_RBAC.roles[role] || TRENZOS_RBAC.roles.staff;
}

function getBranchConfig(branch) {
  return TRENZOS_RBAC.branches[branch] || TRENZOS_RBAC.branches["anna-nagar"];
}

function canRoleUseBranch(role, branch) {
  if (role === "owner") return true;
  return branch !== "all";
}

function getRoleRedirect(role) {
  return getRoleConfig(role).redirect;
}
