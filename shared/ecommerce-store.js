(function () {
  function getStoreProducts() {
    return trenzDbGet(TRENZ_DB_KEYS.products, []).filter((product) => product.websiteVisible);
  }

  function getCart() {
    return trenzDbGet(TRENZ_DB_KEYS.cart, []);
  }

  function saveCart(cart) {
    trenzDbSet(TRENZ_DB_KEYS.cart, cart);
  }

  function getProduct(productId) {
    return trenzDbGet(TRENZ_DB_KEYS.products, []).find((product) => product.id === productId);
  }

  function addToCart(productId, qty = 1) {
    const cart = getCart();
    const existing = cart.find((item) => item.productId === productId);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        productId,
        qty,
        branch: "BEST CHOICE ANNA NAGAR BRANCH",
        state: "Reserved"
      });
    }

    saveCart(cart);
    return cart;
  }

  function updateCartQty(productId, qty) {
    let cart = getCart();

    cart = cart.map((item) => {
      if (item.productId === productId) {
        return { ...item, qty: Math.max(Number(qty), 1) };
      }

      return item;
    });

    saveCart(cart);
  }

  function removeFromCart(productId) {
    const cart = getCart().filter((item) => item.productId !== productId);
    saveCart(cart);
  }

  function cartItems() {
    return getCart()
      .map((item) => {
        const product = getProduct(item.productId);
        if (!product) return null;

        return {
          ...item,
          product
        };
      })
      .filter(Boolean);
  }

  function cartTotals() {
    const items = cartItems();

    const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.qty, 0);
    const gst = items.reduce((sum, item) => sum + Number(item.product.price) * item.qty * (Number(item.product.gst || 0) / 100), 0);
    const discount = subtotal > 500 ? 150 : 0;
    const delivery = subtotal > 999 ? 0 : 49;

    return {
      subtotal,
      gst: Math.round(gst),
      discount,
      delivery,
      total: Math.round(subtotal + gst + delivery - discount)
    };
  }

  function createOrderFromCart() {
    const cart = getCart();
    const orders = trenzDbGet(TRENZ_DB_KEYS.orders, []);

    const totals = cartTotals();

    const order = {
      id: trenzCreateId("ORD-TN"),
      invoice: trenzCreateId("INV-TN"),
      channel: "Website",
      customer: "Priya Raman",
      branch: "BEST CHOICE ANNA NAGAR BRANCH",
      cart,
      amount: totals.total,
      status: "Picking",
      stockState: "Reserved",
      payment: "UPI Paid",
      createdAt: new Date().toISOString()
    };

    orders.unshift(order);
    trenzDbSet(TRENZ_DB_KEYS.orders, orders);
    saveCart([]);

    return order;
  }

  function createReturnRequest(orderId, productId, reason) {
    const returns = trenzDbGet(TRENZ_DB_KEYS.returns, []);

    const product = getProduct(productId);

    const request = {
      id: trenzCreateId("RET-TN"),
      orderId,
      product: product?.name || "Product",
      customer: "Priya Raman",
      reason,
      status: "Pending Approval",
      refundStatus: "Pending",
      inventoryAction: "Returned → Inspection",
      createdAt: new Date().toISOString()
    };

    returns.unshift(request);
    trenzDbSet(TRENZ_DB_KEYS.returns, returns);

    return request;
  }

  function renderStoreProductCards(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const products = getStoreProducts();

    container.innerHTML = products.map((product) => `
      <article class="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden hover:border-slate-700 transition">
        <div class="h-40 bg-slate-950 flex items-center justify-center border-b border-slate-800">
          <div class="h-20 w-20 rounded-3xl bg-indigo-500/10 text-indigo-300 flex items-center justify-center text-xl font-black">
            ${product.category.slice(0, 2).toUpperCase()}
          </div>
        </div>

        <div class="p-5">
          <p class="text-xs text-slate-400">${product.brand || "TRENZ"} · ${product.sku}</p>
          <h3 class="mt-2 font-semibold">${product.name}</h3>
          <p class="mt-1 text-xs text-slate-400">${product.variant || "Standard"}</p>

          <div class="mt-3 flex items-center gap-2">
            <span class="text-xl font-semibold">₹${Number(product.price).toLocaleString("en-IN")}</span>
            <span class="text-sm text-slate-500 line-through">₹${Number(product.mrp || product.price).toLocaleString("en-IN")}</span>
          </div>

          <div class="mt-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-400">Anna Nagar</span>
              <span class="text-emerald-300">${product.branchStock?.["BEST CHOICE ANNA NAGAR BRANCH"] || 0} available</span>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2">
            <a href="product-detail.html?id=${product.id}" class="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-center text-sm hover:bg-slate-800">
              View
            </a>
            <button onclick="trenzAddToCart('${product.id}'); alert('Added to cart')" class="rounded-xl bg-indigo-500 px-3 py-2.5 text-sm font-semibold hover:bg-indigo-400">
              Add
            </button>
          </div>
        </div>
      </article>
    `).join("");
  }

  function renderPersistentCart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = cartItems();

    if (!items.length) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          Cart is empty.
        </div>
      `;
      return;
    }

    container.innerHTML = items.map((item) => `
      <div class="flex gap-4 p-5 border-b border-slate-800 last:border-b-0">
        <div class="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-300 flex items-center justify-center font-black shrink-0">
          ${item.product.category.slice(0, 2).toUpperCase()}
        </div>

        <div class="flex-1">
          <p class="font-medium">${item.product.name}</p>
          <p class="mt-1 text-xs text-slate-400">${item.product.sku}</p>

          <div class="mt-3 flex items-center gap-3">
            <input
              type="number"
              min="1"
              value="${item.qty}"
              onchange="trenzUpdateCartQty('${item.productId}', this.value); trenzRenderPersistentCart('${containerId}')"
              class="w-20 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
            />
            <button onclick="trenzRemoveFromCart('${item.productId}'); trenzRenderPersistentCart('${containerId}')" class="text-xs text-red-300">
              Remove
            </button>
          </div>
        </div>

        <p class="font-semibold">₹${(item.product.price * item.qty).toLocaleString("en-IN")}</p>
      </div>
    `).join("");
  }

  function renderPersistentOrderSummary(containerId, checkout = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const totals = cartTotals();

    container.innerHTML = `
      <div class="space-y-3 text-sm">
        <div class="flex justify-between text-slate-400">
          <span>Subtotal</span>
          <span>₹${totals.subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>GST</span>
          <span>₹${totals.gst.toLocaleString("en-IN")}</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>Delivery</span>
          <span>${totals.delivery === 0 ? "Free" : `₹${totals.delivery}`}</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>Discount</span>
          <span class="text-emerald-300">-₹${totals.discount.toLocaleString("en-IN")}</span>
        </div>
        <div class="pt-3 border-t border-slate-800 flex justify-between">
          <span class="font-semibold">Total</span>
          <span class="text-2xl font-semibold">₹${totals.total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      ${
        checkout
          ? `<button onclick="const order = trenzCreateOrderFromCart(); window.location.href='order-tracking.html?id=' + order.id" class="mt-5 w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400">Place Order</button>`
          : `<a href="checkout.html" class="mt-5 block w-full rounded-xl bg-indigo-500 py-3 text-center text-sm font-semibold hover:bg-indigo-400">Checkout</a>`
      }
    `;
  }

  window.trenzGetStoreProducts = getStoreProducts;
  window.trenzAddToCart = addToCart;
  window.trenzUpdateCartQty = updateCartQty;
  window.trenzRemoveFromCart = removeFromCart;
  window.trenzRenderStoreProductCards = renderStoreProductCards;
  window.trenzRenderPersistentCart = renderPersistentCart;
  window.trenzRenderPersistentOrderSummary = renderPersistentOrderSummary;
  window.trenzCreateOrderFromCart = createOrderFromCart;
  window.trenzCreateReturnRequest = createReturnRequest;
})();
