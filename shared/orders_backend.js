(function () {

  function getOrders() {
    return trenzDbGet(TRENZ_DB_KEYS.orders, []);
  }

  function saveOrders(orders) {
    trenzDbSet(TRENZ_DB_KEYS.orders, orders);
  }

  function createOrder(orderInput) {

    const order = {
      id: trenzCreateId("ORD"),
      invoice: orderInput.invoice || trenzCreateId("INV"),
      channel: orderInput.channel || "Website",
      customer: orderInput.customer || "Walk-in Customer",
      branch: orderInput.branch || "BEST CHOICE ANNA NAGAR BRANCH",
      amount: Number(orderInput.amount || 0),

      status: "Picking",
      stockState: "Reserved",

      items: orderInput.items || [],

      crmUpdated: false,
      analyticsUpdated: false,

      createdAt: new Date().toISOString()
    };

    const orders = getOrders();

    orders.unshift(order);

    saveOrders(orders);

    return order;
  }

  function updateOrder(orderId, updates) {

    const orders = getOrders();

    const index = orders.findIndex(
      order => order.id === orderId
    );

    if (index < 0) return null;

    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveOrders(orders);

    return orders[index];
  }

  function advanceOrder(orderId) {

    const order = getOrders().find(
      item => item.id === orderId
    );

    if (!order) return;

    if (order.status === "Picking") {
      return updateOrder(orderId, {
        status: "Packed"
      });
    }

    if (order.status === "Packed") {
      return updateOrder(orderId, {
        status: "Dispatch Ready"
      });
    }

    if (order.status === "Dispatch Ready") {
      return updateOrder(orderId, {
        status: "Delivered",
        stockState: "Sold",
        crmUpdated: true,
        analyticsUpdated: true
      });
    }

    return order;
  }

  function renderOrderRows(containerId) {

    const container =
      document.getElementById(containerId);

    if (!container) return;

    const orders = getOrders();

    container.innerHTML = orders.map(order => `
      <tr class="hover:bg-slate-800/40">

        <td class="px-5 py-4">
          <p class="font-medium">${order.id}</p>
          <p class="mt-1 text-xs text-slate-400">
            ${order.invoice}
          </p>
        </td>

        <td class="px-5 py-4">
          ${order.channel}
        </td>

        <td class="px-5 py-4">
          ${order.customer}
        </td>

        <td class="px-5 py-4">
          ${order.branch}
        </td>

        <td class="px-5 py-4">
          ₹${order.amount.toLocaleString("en-IN")}
        </td>

        <td class="px-5 py-4">
          ${order.stockState}
        </td>

        <td class="px-5 py-4">
          ${order.status}
        </td>

        <td class="px-5 py-4">
          ${order.crmUpdated ? "Updated" : "Pending"}
        </td>

        <td class="px-5 py-4 text-right">
          <button
            onclick="
              trenzAdvanceOrder('${order.id}');
              trenzRenderOrderRows('${containerId}');
            "
            class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold"
          >
            Advance
          </button>
        </td>

      </tr>
    `).join("");
  }

  function getOrderStats() {

    const orders = getOrders();

    return {
      totalOrders: orders.length,

      websiteOrders:
        orders.filter(
          o => o.channel === "Website"
        ).length,

      posOrders:
        orders.filter(
          o => o.channel === "POS"
        ).length,

      revenue:
        orders.reduce(
          (sum, order) => sum + order.amount,
          0
        ),

      delivered:
        orders.filter(
          o => o.status === "Delivered"
        ).length,

      picking:
        orders.filter(
          o => o.status === "Picking"
        ).length
    };
  }

  window.trenzGetOrders = getOrders;
  window.trenzCreateOrder = createOrder;
  window.trenzUpdateOrder = updateOrder;
  window.trenzAdvanceOrder = advanceOrder;
  window.trenzRenderOrderRows = renderOrderRows;
  window.trenzGetOrderStats = getOrderStats;

})();