function posBadge(status) {
  const value = status.toLowerCase();

  if (value.includes("available") || value.includes("paid") || value.includes("updated") || value.includes("open")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (value.includes("low") || value.includes("watch") || value.includes("pending") || value.includes("eligible")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (value.includes("high")) {
    return "bg-red-500/10 text-red-300";
  }

  return "bg-slate-800 text-slate-300";
}

function renderProductCards(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_POS_DATA.products.map((product) => {
    return `
      <article class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold">${product.name}</p>
            <p class="mt-1 text-xs text-slate-400">${product.sku}</p>
          </div>
          <span class="rounded-full px-3 py-1 text-xs ${posBadge(product.state)}">${product.state}</span>
        </div>

        <div class="mt-4 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Category</span>
            <span>${product.category}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Variant</span>
            <span>${product.variant}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Branch stock</span>
            <span>${product.stock}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Return rule</span>
            <span>${product.returnRule}</span>
          </div>
        </div>

        <div class="mt-5 flex items-center justify-between">
          <p class="text-xl font-semibold">${formatINR(product.price)}</p>
          <button class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400">
            Add
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderCart(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_POS_DATA.cart.map((item) => {
    return `
      <div class="p-4 border-b border-slate-800 last:border-b-0">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium">${item.name}</p>
            <p class="mt-1 text-xs text-slate-400">${item.sku} · GST ${item.gst}%</p>
          </div>
          <p class="text-sm font-semibold">${formatINR(item.price * item.qty)}</p>
        </div>

        <div class="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Qty: ${item.qty}</span>
          <span>State: Reserved</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderCartTotals(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  const totals = calculateCartTotals(TRENZOS_POS_DATA.cart);

  container.innerHTML = `
    <div class="flex justify-between text-slate-400">
      <span>Subtotal</span>
      <span>${formatINR(totals.subtotal)}</span>
    </div>

    <div class="flex justify-between text-slate-400">
      <span>GST</span>
      <span>${formatINR(totals.gst)}</span>
    </div>

    <div class="flex justify-between text-slate-400">
      <span>Loyalty discount</span>
      <span class="text-emerald-300">-${formatINR(totals.loyaltyDiscount)}</span>
    </div>

    <div class="pt-3 border-t border-slate-800 flex justify-between">
      <span class="font-medium">Total</span>
      <span class="text-2xl font-semibold">${formatINR(totals.total)}</span>
    </div>
  `;
}

function renderInvoices(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_POS_DATA.invoices.map((invoice) => {
    return `
      <tr class="hover:bg-slate-800/40">
        <td class="px-5 py-4">
          <p class="font-medium">${invoice.id}</p>
          <p class="mt-1 text-xs text-slate-400">${invoice.time}</p>
        </td>
        <td class="px-5 py-4">${invoice.customer}</td>
        <td class="px-5 py-4">${formatINR(invoice.amount)}</td>
        <td class="px-5 py-4">
          <span class="rounded-full px-3 py-1 text-xs ${posBadge(invoice.status)}">${invoice.status}</span>
        </td>
        <td class="px-5 py-4 text-slate-400">${invoice.sync}</td>
        <td class="px-5 py-4 text-right">
          <button class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">
            View
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderStaffTasks(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZOS_POS_DATA.staffTasks.map((task) => {
    return `
      <tr class="hover:bg-slate-800/40">
        <td class="px-5 py-4">
          <p class="font-medium">${task.id}</p>
          <p class="mt-1 text-xs text-slate-400">${task.module}</p>
        </td>
        <td class="px-5 py-4">
          <p>${task.title}</p>
          <p class="mt-1 text-xs text-slate-400">${task.item}</p>
        </td>
        <td class="px-5 py-4">${task.qty}</td>
        <td class="px-5 py-4">
          <span class="rounded-full px-3 py-1 text-xs ${posBadge(task.priority)}">${task.priority}</span>
        </td>
        <td class="px-5 py-4">
          <span class="rounded-full px-3 py-1 text-xs ${posBadge(task.status)}">${task.status}</span>
        </td>
        <td class="px-5 py-4 text-right">
          <button class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">
            Start
          </button>
        </td>
      </tr>
    `;
  }).join("");
}
