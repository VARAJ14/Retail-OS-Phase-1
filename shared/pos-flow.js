function posBadge(status) {
  const value = String(status || "").toLowerCase();

  if (value.includes("available") || value.includes("paid") || value.includes("updated") || value.includes("open") || value.includes("ready") || value.includes("completed")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (value.includes("low") || value.includes("watch") || value.includes("pending") || value.includes("eligible") || value.includes("partial")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (value.includes("out") || value.includes("high") || value.includes("void") || value.includes("closed") || value.includes("restricted")) {
    return "bg-red-500/10 text-red-300";
  }

  return "bg-slate-800 text-slate-300";
}

function posEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function posDate(value) {
  if (!value) return "Not recorded";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function posMoney(value) {
  if (typeof trenzPosMoney === "function") return trenzPosMoney(value);
  if (typeof formatINR === "function") return formatINR(value);
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function posCurrentFilters() {
  return {
    query: document.getElementById("posSearchInput")?.value || "",
    category: document.getElementById("posCategoryFilter")?.value || "All Categories",
    stock: document.getElementById("posStockFilter")?.value || "All Stock"
  };
}

function renderPosMessage(message, type = "info") {
  const container = document.getElementById("posMessage");
  if (!container) return;

  const color = type === "error"
    ? "border-red-500/30 bg-red-500/10 text-red-200"
    : type === "success"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : "border-slate-700 bg-slate-900 text-slate-200";

  container.innerHTML = `
    <div class="rounded-2xl border ${color} px-4 py-3 text-sm">
      ${posEscape(message)}
    </div>
  `;

  window.clearTimeout(window.__trenzPosMessageTimer);
  window.__trenzPosMessageTimer = window.setTimeout(() => {
    container.innerHTML = "";
  }, 3500);
}

function renderShiftPanel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const session = trenzGetPosSession();
  const shift = session.shift;
  const isOpen = shift.status === "Open";

  container.innerHTML = `
    <div class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full px-3 py-1 text-xs ${posBadge(shift.status)}">Shift ${posEscape(shift.status)}</span>
            <span class="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">Counter POS-AN-01</span>
            <span class="rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">GST Ready</span>
          </div>
          <h3 class="mt-3 text-xl font-semibold">Open Shift → Shift Validation → Billing</h3>
          <p class="mt-1 text-sm text-slate-400">
            ${isOpen ? `Opened ${posDate(shift.openedAt)} with ${posMoney(shift.openingCash)} opening cash.` : "Open a shift before adding products or taking payments."}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <input id="openingCashInput" type="number" min="0" value="${Number(shift.openingCash || 5000)}" class="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
          <button id="openShiftBtn" class="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
            Open Shift
          </button>
          <button id="closeShiftBtn" class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm hover:bg-slate-800">
            Close Shift
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderPosStatusCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const session = trenzGetPosSession();
  const cart = trenzGetPosCart();
  const customer = trenzGetSelectedPosCustomer();
  const salesperson = trenzGetSelectedSalesperson();
  const totals = calculateCartTotals();

  const cards = [
    ["Branch", "Anna Nagar", "Live"],
    ["Shift", session.shift.status, session.shift.status === "Open" ? "Validated" : "Open required"],
    ["Cart", `${cart.length} line(s)`, totals.balance ? `${posMoney(totals.balance)} due` : "Balanced"],
    ["Customer", customer.name, `${customer.tier || "Guest"} · ${Number(customer.points || 0)} pts`],
    ["Salesperson", salesperson.name, "Selected"]
  ];

  container.innerHTML = cards.map(([label, value, hint]) => `
    <div class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
      <p class="text-sm text-slate-400">${posEscape(label)}</p>
      <p class="mt-2 font-semibold">${posEscape(value)}</p>
      <p class="mt-1 text-xs ${hint.includes("required") ? "text-red-300" : "text-emerald-300"}">${posEscape(hint)}</p>
    </div>
  `).join("");
}

function renderProductCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const filters = posCurrentFilters();
  const products = trenzSearchPosProducts(filters.query, filters.category, filters.stock);

  if (!products.length) {
    container.innerHTML = `
      <div class="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
        No products match the current search, SKU, barcode or category filter.
      </div>
    `;
    return;
  }

  container.innerHTML = products.map((product) => {
    const stock = trenzGetProductBranchStock(product);
    const isOut = stock <= 0;
    const state = isOut ? "Out of Stock" : stock <= 5 ? "Low Stock" : product.state || "Available";
    const variants = product.variants || [product.variant || "Standard"];

    return `
      <article class="rounded-3xl border border-slate-800 bg-slate-900 p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold">${posEscape(product.name)}</p>
            <p class="mt-1 text-xs text-slate-400">${posEscape(product.sku)} · ${posEscape(product.barcode || product.sku)}</p>
          </div>
          <span class="rounded-full px-3 py-1 text-xs ${posBadge(state)}">${posEscape(state)}</span>
        </div>

        <div class="mt-4 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Category</span>
            <span>${posEscape(product.category)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Variant</span>
            <span>${posEscape(product.variant || "Standard")}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Branch stock</span>
            <span class="${isOut ? "text-red-300" : "text-emerald-300"}">${stock}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">GST</span>
            <span>${Number(product.gst || 0)}% ${product.inclusiveGst ? "inclusive" : "exclusive"}</span>
          </div>
          <div class="rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-400">
            <p>${posEscape(product.details || product.returnRule || "Product details available at counter.")}</p>
            <p class="mt-2 text-slate-300">Variants: ${variants.map(posEscape).join(", ")}</p>
          </div>
        </div>

        <div class="mt-5 flex items-center justify-between">
          <p class="text-xl font-semibold">${posMoney(product.price)}</p>
          <button
            onclick="trenzAddToCart('${posEscape(product.id)}')"
            class="rounded-xl ${isOut ? "bg-slate-800 text-slate-500" : "bg-indigo-500 hover:bg-indigo-400"} px-4 py-2 text-sm font-semibold"
            ${isOut ? "disabled" : ""}
          >
            ${isOut ? "Out" : "Add"}
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderCustomerPanel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const query = document.getElementById("customerSearchInput")?.value || "";
  const selected = trenzGetSelectedPosCustomer();
  const matches = trenzSearchPosCustomers(query).slice(0, 4);
  const history = selected.history || [];

  container.innerHTML = `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-medium">${posEscape(selected.name)}</p>
          <p class="mt-1 text-xs text-slate-400">${posEscape(selected.id)} · ${posEscape(selected.phone || "No phone")} · ${posEscape(selected.tier || "Guest")}</p>
        </div>
        <span class="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-300">${Number(selected.points || 0).toLocaleString("en-IN")} pts</span>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-3 text-xs">
        <div class="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <p class="text-slate-400">Purchases</p>
          <p class="mt-1 font-medium">${Number(selected.orders || 0)}</p>
        </div>
        <div class="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <p class="text-slate-400">Spend</p>
          <p class="mt-1 font-medium">${posMoney(selected.spend || 0)}</p>
        </div>
        <div class="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <p class="text-slate-400">Returns</p>
          <p class="mt-1 font-medium text-amber-300">${Number(selected.returns || 0)}</p>
        </div>
      </div>
    </div>

    <div class="mt-4 space-y-2">
      ${matches.map((customer) => `
        <button onclick="trenzSelectPosCustomer('${posEscape(customer.id)}')" class="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-left text-xs hover:bg-slate-800">
          <span class="font-medium text-slate-200">${posEscape(customer.name)}</span>
          <span class="ml-2 text-slate-400">${posEscape(customer.phone || customer.id)}</span>
        </button>
      `).join("")}
    </div>

    <div class="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p class="text-sm font-medium">Customer History</p>
      <div class="mt-3 space-y-2 text-xs text-slate-400">
        ${history.length ? history.map((item) => `
          <div class="flex justify-between">
            <span>${posEscape(item.invoice)} · ${Number(item.items || 0)} item(s)</span>
            <span>${posMoney(item.amount)}</span>
          </div>
        `).join("") : "<p>No previous purchase history for this customer.</p>"}
      </div>
    </div>
  `;
}

function renderSalespersonOptions(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const selected = trenzGetSelectedSalesperson();
  select.innerHTML = trenzGetPosStaff().filter((staff) => staff.status !== "Inactive").map((staff) => `
    <option value="${posEscape(staff.id)}" ${staff.id === selected.id ? "selected" : ""}>${posEscape(staff.name)} · ${posEscape(staff.role)}</option>
  `).join("");
}

function renderCart(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cart = trenzGetPosCart();

  if (!cart.length) {
    container.innerHTML = `
      <div class="p-5 text-sm text-slate-400">
        Cart is empty. Search SKU, scan barcode, or choose a product to begin.
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map((item) => {
    const lineTotal = item.inclusiveGst
      ? Number(item.price || 0) * Number(item.qty || 0)
      : Number(item.price || 0) * Number(item.qty || 0) * (1 + Number(item.gst || 0) / 100);

    return `
      <div class="border-b border-slate-800 p-4 last:border-b-0">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium">${posEscape(item.name)}</p>
            <p class="mt-1 text-xs text-slate-400">${posEscape(item.sku)} · ${posEscape(item.variant || "Standard")} · GST ${Number(item.gst || 0)}%</p>
          </div>
          <p class="text-sm font-semibold">${posMoney(lineTotal)}</p>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          <label class="text-xs text-slate-400">
            Qty
            <input type="number" min="1" value="${Number(item.qty || 1)}" onchange="trenzUpdateCartQuantity('${posEscape(item.id)}', this.value)" class="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-indigo-400" />
          </label>
          <label class="text-xs text-slate-400">
            Price
            <input type="number" min="0" value="${Number(item.price || 0)}" onchange="trenzUpdateCartPrice('${posEscape(item.id)}', this.value)" class="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-indigo-400" />
          </label>
          <label class="col-span-2 text-xs text-slate-400">
            Item notes
            <input value="${posEscape(item.note || "")}" onchange="trenzSetPosItemNote('${posEscape(item.id)}', this.value)" class="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-indigo-400" placeholder="Serial, batch, alteration, return note" />
          </label>
        </div>

        <div class="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>State: Reserved until invoice</span>
          <button onclick="trenzRemoveFromCart('${posEscape(item.id)}')" class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-300 hover:bg-red-500/20">
            Remove
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderCartTotals(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const totals = calculateCartTotals();

  container.innerHTML = `
    <div class="flex justify-between text-slate-400">
      <span>Taxable Subtotal</span>
      <span>${posMoney(totals.subtotal)}</span>
    </div>
    <div class="flex justify-between text-slate-400">
      <span>GST</span>
      <span>${posMoney(totals.gst)}</span>
    </div>
    <div class="flex justify-between text-slate-400">
      <span>Gross</span>
      <span>${posMoney(totals.gross)}</span>
    </div>
    <div class="flex justify-between text-slate-400">
      <span>Discounts / Coupons / Loyalty</span>
      <span class="text-emerald-300">-${posMoney(totals.discountTotal)}</span>
    </div>
    <div class="flex justify-between text-slate-400">
      <span>Paid</span>
      <span>${posMoney(totals.paid)}</span>
    </div>
    <div class="border-t border-slate-800 pt-3 flex justify-between">
      <span class="font-medium">Balance Due</span>
      <span class="text-2xl font-semibold">${posMoney(totals.balance)}</span>
    </div>
    ${totals.changeDue > 0 ? `
      <div class="flex justify-between text-emerald-300">
        <span>Change Due</span>
        <span>${posMoney(totals.changeDue)}</span>
      </div>
    ` : ""}
  `;
}

function renderTaxSummary(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const rows = calculateCartTotals().taxSummary;
  container.innerHTML = rows.length ? rows.map((row) => `
    <div class="flex justify-between">
      <span>${posEscape(row.slab)} taxable ${posMoney(row.taxable)}</span>
      <span>${posMoney(row.gst)}</span>
    </div>
  `).join("") : `<p class="text-slate-400">Tax summary appears after products are added.</p>`;
}

function renderPromotionPanel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const session = trenzGetPosSession();
  const adjustments = session.adjustments;
  const coupons = (window.TRENZ_POS_DATA?.coupons || []).map((coupon) => coupon.code).join(", ");
  const giftCards = (window.TRENZ_POS_DATA?.giftCards || []).map((card) => card.code).join(", ");

  container.innerHTML = `
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
      <label class="text-xs text-slate-400">
        Discount Type
        <select id="discountTypeInput" class="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-indigo-400">
          <option value="amount" ${adjustments.manualDiscountType === "amount" ? "selected" : ""}>Amount</option>
          <option value="percent" ${adjustments.manualDiscountType === "percent" ? "selected" : ""}>Percent</option>
        </select>
      </label>
      <label class="text-xs text-slate-400">
        Discount Value
        <input id="discountValueInput" value="${Number(adjustments.manualDiscountValue || 0)}" class="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-indigo-400" />
      </label>
      <label class="text-xs text-slate-400">
        Coupon (${posEscape(coupons)})
        <input id="couponInput" value="${posEscape(adjustments.couponCode || "")}" class="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs uppercase outline-none focus:border-indigo-400" />
      </label>
      <label class="text-xs text-slate-400">
        Loyalty Points
        <input id="loyaltyInput" value="${Number(adjustments.loyaltyPoints || 0)}" class="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs outline-none focus:border-indigo-400" />
      </label>
      <label class="text-xs text-slate-400 md:col-span-2">
        Gift Card (${posEscape(giftCards)})
        <input id="giftCardInput" value="${posEscape(adjustments.giftCardCode || "")}" class="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs uppercase outline-none focus:border-indigo-400" />
      </label>
    </div>
    <div class="mt-3 grid grid-cols-2 gap-3">
      <button id="applyPromotionBtn" class="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-400">Apply Promotions</button>
      <button id="clearPromotionBtn" class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm hover:bg-slate-800">Clear Promotions</button>
    </div>
  `;
}

function renderPaymentControls(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const session = trenzGetPosSession();
  const methods = window.TRENZ_POS_DATA?.paymentMethods || ["Cash", "UPI", "Card", "Gift Card", "Customer Credit"];

  container.innerHTML = `
    <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
      <input id="paymentAmountInput" type="number" min="0" placeholder="Amount (blank = due)" class="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-indigo-400" />
      <input id="paymentReferenceInput" placeholder="Reference / UPI / approval" class="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 md:col-span-2" />
    </div>
    <div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
      ${methods.map((method) => `
        <button onclick="trenzAddPaymentFromUI('${posEscape(method)}')" class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm hover:bg-slate-800">
          ${posEscape(method)}
        </button>
      `).join("")}
    </div>
    <div class="mt-4 space-y-2 text-xs">
      ${session.payments.length ? session.payments.map((payment) => `
        <div class="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
          <span>${posEscape(payment.method)} · ${posEscape(payment.reference || "No ref")}</span>
          <span>
            ${posMoney(payment.amount)}
            <button onclick="trenzRemovePosPayment('${posEscape(payment.id)}')" class="ml-3 text-red-300">Remove</button>
          </span>
        </div>
      `).join("") : `<p class="text-slate-400">Add cash, UPI, card, gift-card, customer-credit, or mixed payments.</p>`}
    </div>
  `;
}

function renderInvoices(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const query = (document.getElementById("invoiceSearchInput")?.value || "").toLowerCase();
  const invoices = trenzGetPosInvoices().filter((invoice) => {
    return !query || [invoice.id, invoice.customer, invoice.status, invoice.orderId].some((value) => String(value || "").toLowerCase().includes(query));
  });

  container.innerHTML = invoices.map((invoice) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <p class="font-medium">${posEscape(invoice.id)}</p>
        <p class="mt-1 text-xs text-slate-400">${posEscape(invoice.time || posDate(invoice.createdAt))}</p>
      </td>
      <td class="px-5 py-4">${posEscape(invoice.customer)}</td>
      <td class="px-5 py-4">${posMoney(invoice.amount)}</td>
      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${posBadge(invoice.status)}">${posEscape(invoice.status)}</span>
      </td>
      <td class="px-5 py-4 text-slate-400">${posEscape(invoice.sync || "Synced")}</td>
      <td class="px-5 py-4 text-right">
        <div class="flex justify-end gap-2">
          <button onclick="trenzSelectPosInvoice('${posEscape(invoice.id)}')" class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">View</button>
          <button onclick="trenzSelectPosInvoice('${posEscape(invoice.id)}'); trenzPrintReceipt()" class="rounded-lg border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800">Print</button>
          <button onclick="trenzSelectPosInvoice('${posEscape(invoice.id)}'); trenzRenderAllPos()" class="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20">Return</button>
          <button onclick="trenzVoidInvoice('${posEscape(invoice.id)}')" class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20">Void</button>
        </div>
      </td>
    </tr>
  `).join("") || `
    <tr>
      <td colspan="6" class="px-5 py-6 text-center text-sm text-slate-400">No invoices found.</td>
    </tr>
  `;
}

function renderReceiptPreview(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const invoice = trenzGetSelectedInvoice();
  if (!invoice) {
    container.innerHTML = `<p class="text-sm text-slate-400">Complete a sale or select an invoice to preview receipt.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
      <div class="text-center">
        <p class="font-semibold text-slate-100">TRENZOS RETAIL</p>
        <p class="text-slate-400">${posEscape(invoice.branch || "BEST CHOICE ANNA NAGAR BRANCH")}</p>
        <p class="text-slate-400">${posEscape(invoice.id)} · ${posDate(invoice.createdAt)}</p>
      </div>
      <div class="my-3 border-t border-dashed border-slate-700"></div>
      <p>Customer: ${posEscape(invoice.customer || "Walk-in Customer")}</p>
      <p>Salesperson: ${posEscape(invoice.salesperson || "Counter Sales")}</p>
      <div class="my-3 border-t border-dashed border-slate-700"></div>
      ${(invoice.items || []).map((item) => `
        <div class="flex justify-between gap-3">
          <span>${posEscape(item.name)} x ${Number(item.qty || 0)}</span>
          <span>${posMoney((Number(item.price || 0) * Number(item.qty || 0)) * (item.inclusiveGst ? 1 : 1 + Number(item.gst || 0) / 100))}</span>
        </div>
      `).join("")}
      <div class="my-3 border-t border-dashed border-slate-700"></div>
      <div class="flex justify-between"><span>Taxable</span><span>${posMoney(invoice.subtotal || 0)}</span></div>
      <div class="flex justify-between"><span>GST</span><span>${posMoney(invoice.gst || 0)}</span></div>
      <div class="flex justify-between"><span>Discount</span><span>-${posMoney(invoice.discount || 0)}</span></div>
      <div class="mt-2 flex justify-between text-sm font-semibold text-slate-100"><span>Total</span><span>${posMoney(invoice.amount)}</span></div>
      <div class="my-3 border-t border-dashed border-slate-700"></div>
      <p>Payments: ${(invoice.payments || []).map((payment) => `${payment.method} ${posMoney(payment.amount)}`).join(", ") || "Recorded"}</p>
      <p class="mt-2 text-center text-slate-400">Thermal receipt ready · Thank you</p>
    </div>
    <div class="mt-4 grid grid-cols-2 gap-3">
      <button id="printReceiptBtn" class="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-400">Print Receipt</button>
      <button id="reprintLastReceiptBtn" class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm hover:bg-slate-800">Reprint Last Receipt</button>
    </div>
  `;
}

function renderHeldBills(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const heldBills = trenzGetHeldBills();
  container.innerHTML = heldBills.length ? heldBills.map((bill) => `
    <div class="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs">
      <span>${posEscape(bill.id)} · ${posEscape(bill.customerName)} · ${posMoney(bill.amount)}</span>
      <button onclick="trenzResumeBill('${posEscape(bill.id)}')" class="rounded-lg bg-indigo-500 px-3 py-1.5 font-semibold hover:bg-indigo-400">Resume</button>
    </div>
  `).join("") : `<p class="text-sm text-slate-400">No parked orders. Hold Bill will park the current cart here.</p>`;
}

function renderReturnPanel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const invoice = trenzGetSelectedInvoice();
  const modes = window.TRENZ_POS_DATA?.returnModes || ["Full Return", "Partial Return", "Exchange", "Return Without Invoice"];

  container.innerHTML = `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p class="text-sm font-medium">Selected Invoice</p>
      <p class="mt-1 text-xs text-slate-400">${invoice ? `${posEscape(invoice.id)} · ${posEscape(invoice.customer)} · ${posMoney(invoice.amount)}` : "No invoice selected. Use Recent Invoices > View."}</p>
      <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <select id="returnModeInput" class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-400">
          ${modes.map((mode) => `<option>${posEscape(mode)}</option>`).join("")}
        </select>
        <input id="returnAmountInput" type="number" min="0" placeholder="Partial/no-invoice amount" class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
        <button id="processReturnBtn" class="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400">Process Return / Refund</button>
      </div>
    </div>
  `;
}

function renderReporting(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const payments = trenzGetPosPayments().slice(0, 5);
  const invoices = trenzGetPosInvoices().slice(0, 5);
  const shifts = trenzGetShiftHistory().slice(0, 5);
  const transactions = trenzGetTransactionHistory().slice(0, 6);

  container.innerHTML = `
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p class="text-sm font-medium">Payment History</p>
        <div class="mt-3 space-y-2 text-xs text-slate-400">
          ${payments.map((payment) => `<div class="flex justify-between"><span>${posEscape(payment.method)} · ${posEscape(payment.invoice || "")}</span><span>${posMoney(payment.amount)}</span></div>`).join("") || "No payments yet."}
        </div>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p class="text-sm font-medium">Sales History</p>
        <div class="mt-3 space-y-2 text-xs text-slate-400">
          ${invoices.map((invoice) => `<div class="flex justify-between"><span>${posEscape(invoice.id)}</span><span>${posMoney(invoice.amount)}</span></div>`).join("") || "No sales yet."}
        </div>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p class="text-sm font-medium">Shift History</p>
        <div class="mt-3 space-y-2 text-xs text-slate-400">
          ${shifts.map((shift) => `<div><span>${posEscape(shift.id)}</span><span class="block text-slate-500">${posDate(shift.closedAt)}</span></div>`).join("") || "No closed shifts yet."}
        </div>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p class="text-sm font-medium">Transaction History</p>
        <div class="mt-3 space-y-2 text-xs text-slate-400">
          ${transactions.map((txn) => `<div><span>${posEscape(txn.type)}</span><span class="block text-slate-500">${posEscape(txn.detail)}</span></div>`).join("") || "No transactions yet."}
        </div>
      </div>
    </div>
  `;
}

function renderWorkflowStatus(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const session = trenzGetPosSession();
  const cart = trenzGetPosCart();
  const totals = calculateCartTotals();
  const selectedInvoice = trenzGetSelectedInvoice();
  const steps = [
    ["Open Shift", session.shift.status === "Open"],
    ["Product Search", true],
    ["Cart", cart.length > 0],
    ["Customer", Boolean(session.customerId)],
    ["Payments", totals.total > 0 && totals.balance === 0],
    ["Invoice", Boolean(session.lastInvoiceId || selectedInvoice)],
    ["Receipt", Boolean(selectedInvoice)]
  ];

  container.innerHTML = steps.map(([label, done], index) => `
    <div class="rounded-2xl border ${done ? "border-emerald-500/30 bg-emerald-500/10" : "border-slate-800 bg-slate-950"} p-4">
      <p class="text-xs ${done ? "text-emerald-300" : "text-slate-400"}">Step ${String(index + 1).padStart(2, "0")}</p>
      <p class="mt-1 text-sm font-medium">${posEscape(label)}</p>
    </div>
  `).join("");
}

function trenzAddPaymentFromUI(method) {
  const amount = document.getElementById("paymentAmountInput")?.value;
  const reference = document.getElementById("paymentReferenceInput")?.value;
  trenzAddPosPayment(method, amount, reference);
}

function trenzApplyPromotionsFromUI() {
  const type = document.getElementById("discountTypeInput")?.value || "amount";
  const value = document.getElementById("discountValueInput")?.value || 0;
  const coupon = document.getElementById("couponInput")?.value || "";
  const loyalty = document.getElementById("loyaltyInput")?.value || 0;
  const giftCard = document.getElementById("giftCardInput")?.value || "";

  trenzSetManualDiscount(type, value);
  if (coupon || trenzGetPosSession().adjustments.couponCode) trenzApplyCoupon(coupon);
  trenzRedeemLoyalty(loyalty);
  if (giftCard || trenzGetPosSession().adjustments.giftCardCode) trenzSetGiftCard(giftCard);
}

function trenzClearPromotionsFromUI() {
  trenzSetManualDiscount("amount", 0);
  trenzApplyCoupon("");
  trenzRedeemLoyalty(0);
  trenzSetGiftCard("");
}

function trenzScanBarcodeFromUI() {
  const code = window.prompt("Scan or enter barcode");
  if (code) trenzAddPosItemByCode(code);
}

function trenzManualSkuFromUI() {
  const sku = window.prompt("Enter SKU");
  if (sku) trenzAddPosItemByCode(sku);
}

function trenzAddCustomItemFromUI() {
  const name = window.prompt("Custom item name", "Custom POS Item");
  if (!name) return;

  const price = window.prompt("Selling price", "999");
  const gst = window.prompt("GST rate", "18");
  trenzAddCustomPosItem({ name, price, gst, stock: 1, sku: `CUSTOM-${Date.now().toString().slice(-5)}` });
}

function trenzCreateCustomerFromUI() {
  const name = window.prompt("Customer name");
  if (!name) return;

  const phone = window.prompt("Customer phone", "");
  const email = window.prompt("Customer email", "");
  trenzCreatePosCustomer({ name, phone, email });
}

function trenzSearchCustomerFromUI() {
  const query = document.getElementById("customerSearchInput")?.value || "";
  const match = trenzSearchPosCustomers(query)[0];
  if (match) trenzSelectPosCustomer(match.id);
  renderCustomerPanel("customerPanel");
}

function trenzProcessReturnFromUI() {
  const invoice = trenzGetSelectedInvoice();
  const mode = document.getElementById("returnModeInput")?.value || "Full Return";
  const amount = document.getElementById("returnAmountInput")?.value;
  trenzProcessPosReturn(invoice?.id, mode, amount);
}

function trenzRenderAllPos() {
  renderShiftPanel("shiftPanel");
  renderPosStatusCards("posStatusCards");
  renderWorkflowStatus("posWorkflowStatus");
  renderProductCards("productCards");
  renderCustomerPanel("customerPanel");
  renderSalespersonOptions("salespersonSelect");
  renderCart("cartItems");
  renderPromotionPanel("promotionPanel");
  renderCartTotals("cartTotals");
  renderTaxSummary("taxSummary");
  renderPaymentControls("paymentControls");
  renderInvoices("invoiceTable");
  renderReceiptPreview("receiptPreview");
  renderHeldBills("heldBills");
  renderReturnPanel("returnPanel");
  renderReporting("reportingPanel");

  const orderNotes = document.getElementById("orderNotesInput");
  if (orderNotes && orderNotes.value !== trenzGetPosSession().orderNotes) {
    orderNotes.value = trenzGetPosSession().orderNotes || "";
  }
}

function trenzBindPosEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === "openShiftBtn") trenzOpenShift(document.getElementById("openingCashInput")?.value || 0);
    if (target.id === "closeShiftBtn") trenzCloseShift();
    if (target.id === "scanBarcodeBtn") trenzScanBarcodeFromUI();
    if (target.id === "manualSkuBtn") trenzManualSkuFromUI();
    if (target.id === "addCustomItemBtn") trenzAddCustomItemFromUI();
    if (target.id === "filterProductsBtn") renderProductCards("productCards");
    if (target.id === "customerSearchBtn") trenzSearchCustomerFromUI();
    if (target.id === "customerCreateBtn") trenzCreateCustomerFromUI();
    if (target.id === "applyPromotionBtn") trenzApplyPromotionsFromUI();
    if (target.id === "clearPromotionBtn") trenzClearPromotionsFromUI();
    if (target.id === "completeSaleBtn") trenzCompleteSale();
    if (target.id === "nextBillBtn") trenzNextBill();
    if (target.id === "holdBillBtn" || target.id === "holdBillCartBtn") trenzHoldBill();
    if (target.id === "cancelBillBtn") trenzCancelBill();
    if (target.id === "printReceiptBtn") trenzPrintReceipt();
    if (target.id === "reprintLastReceiptBtn") trenzReprintLastReceipt();
    if (target.id === "processReturnBtn") trenzProcessReturnFromUI();
    if (target.id === "quickActionsBtn") renderPosMessage("Quick actions: scan barcode, hold bill, reprint last receipt, or close shift.", "info");
    if (target.id === "alertsBtn") renderPosMessage("No blocking POS alerts. Validate low-stock items before billing.", "info");
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (["posSearchInput", "posCategoryFilter", "posStockFilter"].includes(target.id)) renderProductCards("productCards");
    if (target.id === "invoiceSearchInput") renderInvoices("invoiceTable");
    if (target.id === "customerSearchInput") renderCustomerPanel("customerPanel");
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
    if (target.id === "salespersonSelect") trenzSelectSalesperson(target.value);
    if (target.id === "orderNotesInput") trenzSetOrderNotes(target.value);
  });

  window.addEventListener("trenz-pos-updated", trenzRenderAllPos);
  window.addEventListener("trenz-pos-cart-updated", trenzRenderAllPos);
  window.addEventListener("trenz-pos-message", (event) => {
    renderPosMessage(event.detail.message, event.detail.type);
  });
}

function trenzInitPosPage() {
  if (typeof trenzSeedPosReferenceData === "function") trenzSeedPosReferenceData();
  trenzBindPosEvents();
  trenzRenderAllPos();
}

window.renderProductCards = renderProductCards;
window.renderCart = renderCart;
window.renderCartTotals = renderCartTotals;
window.renderInvoices = renderInvoices;
window.trenzAddPaymentFromUI = trenzAddPaymentFromUI;
window.trenzRenderAllPos = trenzRenderAllPos;
window.trenzInitPosPage = trenzInitPosPage;
