(function () {
  const POS_KEYS = {
    session: "trenzos_pos_session",
    heldBills: "trenzos_pos_held_bills",
    shiftHistory: "trenzos_pos_shift_history",
    transactionHistory: "trenzos_pos_transaction_history",
    lastReceipt: "trenzos_pos_last_receipt"
  };

  const POS_BRANCH = "BEST CHOICE ANNA NAGAR BRANCH";
  const POS_COUNTER = "POS-AN-01";

  function money(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function numberValue(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function dbGet(key, fallback) {
    if (typeof trenzDbGet === "function") return trenzDbGet(key, fallback);

    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function dbSet(key, value) {
    if (typeof trenzDbSet === "function") {
      trenzDbSet(key, value);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  function notify(message, type = "info") {
    window.dispatchEvent(new CustomEvent("trenz-pos-message", { detail: { message, type } }));
  }

  function refresh() {
    window.dispatchEvent(new CustomEvent("trenz-pos-updated"));
    window.dispatchEvent(new CustomEvent("trenz-pos-cart-updated"));
  }

  function createId(prefix) {
    if (typeof trenzCreateId === "function") return trenzCreateId(prefix);
    return `${prefix}-${Date.now().toString().slice(-6)}`;
  }

  function getProducts() {
    const products = typeof trenzGetProducts === "function"
      ? trenzGetProducts()
      : dbGet(TRENZ_DB_KEYS.products, []);

    return products.map((product) => ({
      barcode: product.barcode || product.sku,
      inclusiveGst: Boolean(product.inclusiveGst),
      returnRule: product.returnRule || "Invoice required",
      ...product
    }));
  }

  function saveProducts(products) {
    dbSet(TRENZ_DB_KEYS.products, products);
    dbSet(TRENZ_DB_KEYS.inventory, products);
  }

  function branchStock(product) {
    if (!product) return 0;
    if (product.branchStock && Object.prototype.hasOwnProperty.call(product.branchStock, POS_BRANCH)) {
      return numberValue(product.branchStock[POS_BRANCH]);
    }
    return numberValue(product.stock);
  }

  function setProductBranchStock(productId, nextStock) {
    const products = getProducts();
    const index = products.findIndex((product) => product.id === productId);
    if (index < 0) return null;

    const current = products[index];
    const currentBranchStock = branchStock(current);
    const delta = numberValue(nextStock) - currentBranchStock;

    products[index] = {
      ...current,
      stock: Math.max(0, numberValue(current.stock) + delta),
      state: nextStock <= 0 ? "Out of Stock" : nextStock <= 5 ? "Low Stock" : "Available",
      branchStock: {
        ...(current.branchStock || {}),
        [POS_BRANCH]: Math.max(0, numberValue(nextStock))
      },
      updatedAt: new Date().toISOString()
    };

    saveProducts(products);
    return products[index];
  }

  function getCustomers() {
    const existing = dbGet(TRENZ_DB_KEYS.customers, []);
    const seeded = (window.TRENZ_POS_DATA && window.TRENZ_POS_DATA.customers) || [];
    const merged = [...existing];

    seeded.forEach((customer) => {
      if (!merged.some((item) => item.id === customer.id)) merged.push(customer);
    });

    return merged;
  }

  function saveCustomers(customers) {
    dbSet(TRENZ_DB_KEYS.customers, customers);
  }

  function getStaff() {
    return dbGet(TRENZ_DB_KEYS.staff, []);
  }

  function getDefaultSalesperson() {
    const staff = getStaff();
    return staff.find((person) => person.role === "Cashier" && person.status === "Active") || staff[0] || {
      id: "STF-POS",
      name: "Counter Sales",
      role: "Cashier"
    };
  }

  function defaultCustomer() {
    return getCustomers()[0] || {
      id: "WALK-IN",
      name: "Walk-in Customer",
      phone: "",
      tier: "Guest",
      points: 0,
      orders: 0,
      spend: 0,
      returns: 0,
      history: []
    };
  }

  function defaultSession() {
    const customer = defaultCustomer();
    const salesperson = getDefaultSalesperson();

    return {
      shift: {
        id: "",
        status: "Closed",
        openingCash: 0,
        openedAt: "",
        closedAt: ""
      },
      customerId: customer.id,
      salespersonId: salesperson.id,
      orderNotes: "",
      payments: [],
      adjustments: {
        manualDiscountType: "amount",
        manualDiscountValue: 0,
        couponCode: "",
        loyaltyPoints: 0,
        giftCardCode: ""
      },
      lastInvoiceId: "",
      selectedInvoiceId: "",
      returnMode: "Full Return"
    };
  }

  function getSession() {
    const saved = dbGet(POS_KEYS.session, {});
    const base = defaultSession();

    return {
      ...base,
      ...saved,
      shift: { ...base.shift, ...(saved.shift || {}) },
      adjustments: { ...base.adjustments, ...(saved.adjustments || {}) },
      payments: Array.isArray(saved.payments) ? saved.payments : []
    };
  }

  function saveSession(session) {
    dbSet(POS_KEYS.session, session);
  }

  function getPosCart() {
    return dbGet(TRENZ_DB_KEYS.cart, []);
  }

  function savePosCart(cart) {
    dbSet(TRENZ_DB_KEYS.cart, cart);
  }

  function getHeldBills() {
    return dbGet(POS_KEYS.heldBills, []);
  }

  function saveHeldBills(heldBills) {
    dbSet(POS_KEYS.heldBills, heldBills);
  }

  function getInvoices() {
    return dbGet(TRENZ_DB_KEYS.invoices, []);
  }

  function saveInvoices(invoices) {
    dbSet(TRENZ_DB_KEYS.invoices, invoices);
  }

  function getPayments() {
    return dbGet(TRENZ_DB_KEYS.payments, []);
  }

  function savePayments(payments) {
    dbSet(TRENZ_DB_KEYS.payments, payments);
  }

  function getOrders() {
    return dbGet(TRENZ_DB_KEYS.orders, []);
  }

  function saveOrders(orders) {
    dbSet(TRENZ_DB_KEYS.orders, orders);
  }

  function getReturns() {
    return dbGet(TRENZ_DB_KEYS.returns, []);
  }

  function saveReturns(returns) {
    dbSet(TRENZ_DB_KEYS.returns, returns);
  }

  function getShiftHistory() {
    return dbGet(POS_KEYS.shiftHistory, []);
  }

  function saveShiftHistory(history) {
    dbSet(POS_KEYS.shiftHistory, history);
  }

  function getTransactionHistory() {
    return dbGet(POS_KEYS.transactionHistory, []);
  }

  function saveTransactionHistory(history) {
    dbSet(POS_KEYS.transactionHistory, history);
  }

  function addTransaction(type, detail, amount = 0) {
    const history = getTransactionHistory();
    history.unshift({
      id: createId("TXN"),
      type,
      detail,
      amount: numberValue(amount),
      cashier: getDefaultSalesperson().name,
      branch: POS_BRANCH,
      createdAt: new Date().toISOString()
    });
    saveTransactionHistory(history.slice(0, 75));
  }

  function isShiftOpen() {
    return getSession().shift.status === "Open";
  }

  function requireOpenShift() {
    if (isShiftOpen()) return true;
    notify("Open a POS shift before billing.", "error");
    return false;
  }

  function openShift(openingCash) {
    const session = getSession();
    if (session.shift.status === "Open") {
      notify("Shift is already open.", "info");
      return session.shift;
    }

    session.shift = {
      id: createId("SHIFT-AN"),
      status: "Open",
      openingCash: numberValue(openingCash),
      openedAt: new Date().toISOString(),
      closedAt: ""
    };

    saveSession(session);
    addTransaction("Shift Opened", `Opening cash ${money(openingCash)}`, numberValue(openingCash));
    notify("Shift opened and validated.", "success");
    refresh();
    return session.shift;
  }

  function closeShift() {
    const session = getSession();
    if (session.shift.status !== "Open") {
      notify("No open shift to close.", "error");
      return null;
    }

    const payments = getPayments().filter((payment) => payment.shiftId === session.shift.id);
    const totals = payments.reduce((acc, payment) => {
      acc[payment.method] = (acc[payment.method] || 0) + numberValue(payment.amount);
      acc.total += numberValue(payment.amount);
      return acc;
    }, { total: 0 });

    const closedShift = {
      ...session.shift,
      status: "Closed",
      closedAt: new Date().toISOString(),
      payments: totals,
      expectedCash: numberValue(session.shift.openingCash) + numberValue(totals.Cash)
    };

    const history = getShiftHistory();
    history.unshift(closedShift);
    saveShiftHistory(history);

    session.shift = defaultSession().shift;
    saveSession(session);
    addTransaction("Shift Closed", `Closed ${closedShift.id}`, closedShift.payments.total);
    notify("Shift closed with summary recorded.", "success");
    refresh();
    return closedShift;
  }

  function searchProducts(query = "", category = "All Categories", stockState = "All Stock") {
    const normalized = query.trim().toLowerCase();

    return getProducts()
      .filter((product) => product.posVisible !== false)
      .filter((product) => {
        if (!normalized) return true;

        return [
          product.name,
          product.sku,
          product.barcode,
          product.category,
          product.variant,
          product.brand
        ].some((value) => String(value || "").toLowerCase().includes(normalized));
      })
      .filter((product) => category === "All Categories" || product.category === category)
      .filter((product) => {
        const stock = branchStock(product);
        if (stockState === "Available in Branch") return stock > 0;
        if (stockState === "Low Stock") return stock > 0 && stock <= 5;
        if (stockState === "Out of Stock") return stock <= 0;
        return true;
      });
  }

  function lookupProductByCode(code) {
    const normalized = String(code || "").trim().toLowerCase();
    return getProducts().find((product) => {
      return [product.sku, product.barcode, product.id].some((value) => String(value || "").toLowerCase() === normalized);
    });
  }

  function addToCart(productId, qty = 1) {
    if (!requireOpenShift()) return false;

    const products = getProducts();
    const product = products.find((item) => item.id === productId);

    if (!product) {
      notify("Product not found.", "error");
      return false;
    }

    const stock = branchStock(product);
    if (stock <= 0) {
      notify(`${product.name} is out of stock at ${POS_BRANCH}.`, "error");
      return false;
    }

    const cart = getPosCart();
    const existing = cart.find((item) => item.id === productId);
    const requestedQty = numberValue(qty, 1);
    const currentQty = existing ? numberValue(existing.qty) : 0;

    if (currentQty + requestedQty > stock) {
      notify(`Only ${stock} units available for ${product.name}.`, "error");
      return false;
    }

    if (existing) {
      existing.qty += requestedQty;
    } else {
      cart.push({
        id: product.id,
        sku: product.sku,
        barcode: product.barcode || product.sku,
        name: product.name,
        category: product.category,
        variant: product.variant || "Standard",
        price: numberValue(product.price),
        gst: numberValue(product.gst),
        inclusiveGst: Boolean(product.inclusiveGst),
        qty: requestedQty,
        note: "",
        returnRule: product.returnRule || "Invoice required"
      });
    }

    savePosCart(cart);
    addTransaction("Cart Updated", `${product.name} added`, product.price);
    notify(`${product.name} added to cart.`, "success");
    refresh();
    return true;
  }

  function addByCode(code) {
    const product = lookupProductByCode(code);
    if (!product) {
      notify("No product found for that barcode/SKU.", "error");
      return false;
    }
    return addToCart(product.id, 1);
  }

  function addCustomItem(input = {}) {
    if (!requireOpenShift()) return false;

    const product = {
      id: createId("PRD"),
      sku: input.sku || createId("SKU"),
      barcode: input.barcode || input.sku || createId("BAR"),
      name: input.name || "Custom POS Item",
      brand: "POS Custom",
      category: input.category || "Accessories",
      variant: input.variant || "Counter item",
      price: numberValue(input.price, 1),
      mrp: numberValue(input.mrp, input.price || 1),
      gst: numberValue(input.gst, 18),
      stock: numberValue(input.stock, 1),
      state: "Available",
      websiteVisible: false,
      posVisible: true,
      returnRule: "Invoice required",
      branchStock: {
        [POS_BRANCH]: numberValue(input.stock, 1)
      },
      createdAt: new Date().toISOString()
    };

    const products = getProducts();
    products.unshift(product);
    saveProducts(products);
    return addToCart(product.id, 1);
  }

  function updateCartQuantity(productId, qty) {
    const cart = getPosCart();
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (!item) return false;

    const product = getProducts().find((productItem) => productItem.id === productId);
    const nextQty = Math.max(1, numberValue(qty, 1));

    if (product && nextQty > branchStock(product)) {
      notify(`Only ${branchStock(product)} units available for ${product.name}.`, "error");
      return false;
    }

    item.qty = nextQty;
    savePosCart(cart);
    addTransaction("Cart Updated", `${item.name} quantity changed to ${nextQty}`, item.price * nextQty);
    refresh();
    return true;
  }

  function updateCartPrice(productId, price) {
    const cart = getPosCart();
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (!item) return false;

    item.price = Math.max(0, numberValue(price));
    savePosCart(cart);
    addTransaction("Cart Updated", `${item.name} price changed`, item.price);
    refresh();
    return true;
  }

  function setItemNote(productId, note) {
    const cart = getPosCart();
    const item = cart.find((cartItem) => cartItem.id === productId);
    if (!item) return false;

    item.note = note || "";
    savePosCart(cart);
    refresh();
    return true;
  }

  function removeFromCart(productId) {
    const item = getPosCart().find((cartItem) => cartItem.id === productId);
    savePosCart(getPosCart().filter((cartItem) => cartItem.id !== productId));
    if (item) addTransaction("Cart Updated", `${item.name} removed`, item.price * item.qty);
    notify("Item removed from cart.", "success");
    refresh();
    return true;
  }

  function clearCart() {
    savePosCart([]);
    const session = getSession();
    session.payments = [];
    session.orderNotes = "";
    session.adjustments = defaultSession().adjustments;
    saveSession(session);
    refresh();
  }

  function holdBill() {
    const cart = getPosCart();
    if (!cart.length) {
      notify("Add items before holding a bill.", "error");
      return false;
    }

    const session = getSession();
    const customer = getSelectedCustomer();
    const heldBills = getHeldBills();

    heldBills.unshift({
      id: createId("HOLD"),
      cart,
      session,
      customerName: customer.name,
      amount: calculateCartTotals().total,
      createdAt: new Date().toISOString()
    });

    saveHeldBills(heldBills);
    clearCart();
    notify("Bill parked successfully.", "success");
    return true;
  }

  function resumeBill(holdId) {
    const heldBills = getHeldBills();
    const heldBill = heldBills.find((bill) => bill.id === holdId);
    if (!heldBill) {
      notify("Held bill not found.", "error");
      return false;
    }

    savePosCart(heldBill.cart || []);
    saveSession({ ...getSession(), ...(heldBill.session || {}) });
    saveHeldBills(heldBills.filter((bill) => bill.id !== holdId));
    notify("Held bill resumed.", "success");
    refresh();
    return true;
  }

  function cancelBill() {
    clearCart();
    addTransaction("Bill Cancelled", "Current POS bill cancelled", 0);
    notify("Current bill cancelled.", "success");
  }

  function getSelectedCustomer() {
    const session = getSession();
    return getCustomers().find((customer) => customer.id === session.customerId) || defaultCustomer();
  }

  function searchCustomers(query = "") {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return getCustomers();

    return getCustomers().filter((customer) => {
      return [customer.name, customer.phone, customer.id, customer.email, customer.tier].some((value) => {
        return String(value || "").toLowerCase().includes(normalized);
      });
    });
  }

  function selectCustomer(customerId) {
    const customer = getCustomers().find((item) => item.id === customerId);
    if (!customer) {
      notify("Customer not found.", "error");
      return false;
    }

    const session = getSession();
    session.customerId = customer.id;
    saveSession(session);
    notify(`${customer.name} linked to bill.`, "success");
    refresh();
    return true;
  }

  function createCustomer(input = {}) {
    const customers = getCustomers();
    const customer = {
      id: createId("CRM-TN"),
      name: input.name || "New POS Customer",
      phone: input.phone || "",
      email: input.email || "",
      tier: "Silver",
      points: 0,
      orders: 0,
      spend: 0,
      returns: 0,
      history: [],
      createdAt: new Date().toISOString()
    };

    customers.unshift(customer);
    saveCustomers(customers);
    selectCustomer(customer.id);
    addTransaction("Customer Created", customer.name, 0);
    return customer;
  }

  function getSelectedSalesperson() {
    const session = getSession();
    return getStaff().find((person) => person.id === session.salespersonId) || getDefaultSalesperson();
  }

  function selectSalesperson(staffId) {
    const staff = getStaff().find((person) => person.id === staffId);
    if (!staff) return false;

    const session = getSession();
    session.salespersonId = staff.id;
    saveSession(session);
    notify(`${staff.name} selected as salesperson.`, "success");
    refresh();
    return true;
  }

  function setOrderNotes(notes) {
    const session = getSession();
    session.orderNotes = notes || "";
    saveSession(session);
  }

  function setManualDiscount(type, value) {
    const session = getSession();
    session.adjustments.manualDiscountType = type === "percent" ? "percent" : "amount";
    session.adjustments.manualDiscountValue = Math.max(0, numberValue(value));
    saveSession(session);
    refresh();
  }

  function applyCoupon(code) {
    const session = getSession();
    const normalized = String(code || "").trim().toUpperCase();
    const coupons = (window.TRENZ_POS_DATA && window.TRENZ_POS_DATA.coupons) || [];
    const coupon = coupons.find((item) => item.code === normalized && item.active !== false);

    if (!normalized) {
      session.adjustments.couponCode = "";
      saveSession(session);
      refresh();
      return true;
    }

    if (!coupon) {
      notify("Coupon code is invalid or inactive.", "error");
      return false;
    }

    const totals = calculateCartTotals({ ignoreCoupon: true });
    if (totals.gross < numberValue(coupon.minTotal)) {
      notify(`Coupon requires minimum bill ${money(coupon.minTotal)}.`, "error");
      return false;
    }

    session.adjustments.couponCode = normalized;
    saveSession(session);
    notify(`Coupon ${normalized} applied.`, "success");
    refresh();
    return true;
  }

  function redeemLoyalty(points) {
    const customer = getSelectedCustomer();
    const session = getSession();
    const requested = Math.max(0, Math.floor(numberValue(points)));
    const allowed = Math.min(requested, numberValue(customer.points), Math.floor(calculateCartTotals({ ignoreLoyalty: true }).gross * 0.2));

    session.adjustments.loyaltyPoints = allowed;
    saveSession(session);
    notify(`${allowed} loyalty points applied.`, "success");
    refresh();
    return allowed;
  }

  function validateGiftCard(code) {
    const normalized = String(code || "").trim().toUpperCase();
    const giftCards = (window.TRENZ_POS_DATA && window.TRENZ_POS_DATA.giftCards) || [];
    return giftCards.find((card) => card.code === normalized && card.active !== false);
  }

  function setGiftCard(code) {
    const session = getSession();
    if (!code) {
      session.adjustments.giftCardCode = "";
      saveSession(session);
      refresh();
      return true;
    }

    const card = validateGiftCard(code);
    if (!card) {
      notify("Gift card is invalid or inactive.", "error");
      return false;
    }

    session.adjustments.giftCardCode = card.code;
    saveSession(session);
    notify(`Gift card ${card.code} validated.`, "success");
    refresh();
    return true;
  }

  function lineTotals(item) {
    const qty = numberValue(item.qty, 1);
    const rate = numberValue(item.price);
    const gstRate = numberValue(item.gst);
    const grossRate = rate * qty;

    if (item.inclusiveGst) {
      const taxable = grossRate / (1 + gstRate / 100);
      const gst = grossRate - taxable;
      return { taxable, gst, total: grossRate, gstRate };
    }

    const taxable = grossRate;
    const gst = taxable * gstRate / 100;
    return { taxable, gst, total: taxable + gst, gstRate };
  }

  function couponDiscountFor(gross, code) {
    const coupons = (window.TRENZ_POS_DATA && window.TRENZ_POS_DATA.coupons) || [];
    const coupon = coupons.find((item) => item.code === code);
    if (!coupon) return 0;

    if (coupon.type === "percent") {
      return Math.min(gross * numberValue(coupon.value) / 100, numberValue(coupon.maxDiscount, gross));
    }

    return Math.min(numberValue(coupon.value), gross);
  }

  function calculateCartTotals(options = {}) {
    const cart = getPosCart();
    const session = getSession();

    const taxSummary = {};
    let subtotal = 0;
    let gst = 0;

    cart.forEach((item) => {
      const line = lineTotals(item);
      subtotal += line.taxable;
      gst += line.gst;
      const key = `${line.gstRate}%`;
      if (!taxSummary[key]) taxSummary[key] = { slab: key, taxable: 0, gst: 0, total: 0 };
      taxSummary[key].taxable += line.taxable;
      taxSummary[key].gst += line.gst;
      taxSummary[key].total += line.total;
    });

    const gross = subtotal + gst;
    const manualDiscount = session.adjustments.manualDiscountType === "percent"
      ? Math.min(gross, gross * numberValue(session.adjustments.manualDiscountValue) / 100)
      : Math.min(gross, numberValue(session.adjustments.manualDiscountValue));
    const couponDiscount = options.ignoreCoupon ? 0 : couponDiscountFor(gross - manualDiscount, session.adjustments.couponCode);
    const loyaltyDiscount = options.ignoreLoyalty ? 0 : Math.min(numberValue(session.adjustments.loyaltyPoints), gross - manualDiscount - couponDiscount);
    const discountTotal = manualDiscount + couponDiscount + loyaltyDiscount;
    const total = Math.max(0, gross - discountTotal);
    const paid = session.payments.reduce((sum, payment) => sum + numberValue(payment.amount), 0);

    return {
      subtotal,
      gst,
      gross,
      manualDiscount,
      couponDiscount,
      loyaltyDiscount,
      discountTotal,
      total,
      paid,
      balance: Math.max(0, total - paid),
      changeDue: Math.max(0, paid - total),
      taxSummary: Object.values(taxSummary)
    };
  }

  function addPayment(method, amount, reference = "") {
    if (!requireOpenShift()) return false;

    const totals = calculateCartTotals();
    const due = totals.balance;
    const paymentAmount = Math.min(numberValue(amount, due), due || numberValue(amount));

    if (paymentAmount <= 0) {
      notify("Payment amount must be greater than zero.", "error");
      return false;
    }

    if (method === "Gift Card") {
      const session = getSession();
      const card = validateGiftCard(reference || session.adjustments.giftCardCode);
      if (!card) {
        notify("Validate a gift card before taking gift-card payment.", "error");
        return false;
      }
      if (paymentAmount > numberValue(card.balance)) {
        notify(`Gift card balance is ${money(card.balance)}.`, "error");
        return false;
      }
      reference = card.code;
    }

    const session = getSession();
    session.payments.push({
      id: createId("PAY"),
      method,
      amount: paymentAmount,
      reference,
      createdAt: new Date().toISOString()
    });

    saveSession(session);
    notify(`${method} payment added.`, "success");
    refresh();
    return true;
  }

  function removePayment(paymentId) {
    const session = getSession();
    session.payments = session.payments.filter((payment) => payment.id !== paymentId);
    saveSession(session);
    refresh();
  }

  function validateSale() {
    if (!isShiftOpen()) return "Open shift before checkout.";
    if (!getPosCart().length) return "Cart is empty.";
    if (calculateCartTotals().balance > 0) return "Collect full payment before invoice generation.";
    if (!getSelectedSalesperson()) return "Select a salesperson.";
    return "";
  }

  function updateCustomerAfterSale(invoice) {
    const customers = getCustomers();
    const index = customers.findIndex((customer) => customer.id === invoice.customerId);
    if (index < 0) return;

    const pointsRedeemed = numberValue(invoice.loyaltyPoints);
    const pointsEarned = Math.floor(numberValue(invoice.amount) / 100);
    const history = customers[index].history || [];

    customers[index] = {
      ...customers[index],
      orders: numberValue(customers[index].orders) + 1,
      spend: numberValue(customers[index].spend) + numberValue(invoice.amount),
      points: Math.max(0, numberValue(customers[index].points) - pointsRedeemed + pointsEarned),
      history: [
        {
          invoice: invoice.id,
          amount: invoice.amount,
          items: invoice.items.length,
          createdAt: invoice.createdAt
        },
        ...history
      ].slice(0, 10)
    };

    saveCustomers(customers);
  }

  function applyInventoryImpact(items, direction) {
    items.forEach((item) => {
      const product = getProducts().find((productItem) => productItem.id === item.id);
      if (!product) return;

      const currentStock = branchStock(product);
      const nextStock = direction === "restore"
        ? currentStock + numberValue(item.qty)
        : currentStock - numberValue(item.qty);
      setProductBranchStock(item.id, nextStock);
    });
  }

  function completeSale() {
    const validationMessage = validateSale();
    if (validationMessage) {
      notify(validationMessage, "error");
      return null;
    }

    const session = getSession();
    const cart = getPosCart();
    const totals = calculateCartTotals();
    const customer = getSelectedCustomer();
    const salesperson = getSelectedSalesperson();
    const now = new Date();
    const invoiceId = `INV-AN-${now.getTime().toString().slice(-6)}`;
    const orderId = `POS-AN-${now.getTime().toString().slice(-6)}`;

    const invoice = {
      id: invoiceId,
      orderId,
      customer: customer.name,
      customerId: customer.id,
      salesperson: salesperson.name,
      salespersonId: salesperson.id,
      branch: POS_BRANCH,
      counter: POS_COUNTER,
      shiftId: session.shift.id,
      items: cart.map((item) => ({ ...item, totals: lineTotals(item) })),
      itemCount: cart.reduce((sum, item) => sum + numberValue(item.qty), 0),
      subtotal: totals.subtotal,
      gst: totals.gst,
      gross: totals.gross,
      discount: totals.discountTotal,
      amount: totals.total,
      paid: totals.paid,
      changeDue: totals.changeDue,
      taxSummary: totals.taxSummary,
      payments: session.payments,
      notes: session.orderNotes,
      loyaltyPoints: session.adjustments.loyaltyPoints,
      couponCode: session.adjustments.couponCode,
      giftCardCode: session.adjustments.giftCardCode,
      status: "Paid",
      paymentStatus: "Paid",
      sync: "Inventory + CRM + Analytics Updated",
      receiptStatus: "Ready",
      createdAt: now.toISOString(),
      time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    };

    const invoices = getInvoices();
    invoices.unshift(invoice);
    saveInvoices(invoices);

    const paymentHistory = getPayments();
    session.payments.forEach((payment) => {
      paymentHistory.unshift({
        ...payment,
        invoice: invoice.id,
        customer: invoice.customer,
        shiftId: session.shift.id,
        branch: POS_BRANCH,
        status: "Captured"
      });
    });
    savePayments(paymentHistory);

    const orders = getOrders();
    orders.unshift({
      id: orderId,
      invoice: invoice.id,
      channel: "POS",
      customer: invoice.customer,
      customerId: invoice.customerId,
      branch: POS_BRANCH,
      amount: invoice.amount,
      items: invoice.itemCount,
      payment: "Paid",
      stockState: "Sold",
      fulfillment: "Completed",
      delivery: "Counter sale",
      crm: "Purchase added",
      analytics: "Logged",
      returnStatus: "Eligible",
      createdAt: invoice.createdAt
    });
    saveOrders(orders);

    applyInventoryImpact(cart, "deduct");
    updateCustomerAfterSale(invoice);
    dbSet(POS_KEYS.lastReceipt, invoice);

    session.lastInvoiceId = invoice.id;
    session.selectedInvoiceId = invoice.id;
    session.payments = [];
    session.orderNotes = "";
    session.adjustments = defaultSession().adjustments;
    saveSession(session);
    savePosCart([]);

    addTransaction("Sale Completed", invoice.id, invoice.amount);
    notify(`Invoice ${invoice.id} generated.`, "success");
    refresh();
    return invoice;
  }

  function nextBill() {
    const session = getSession();
    session.payments = [];
    session.orderNotes = "";
    session.adjustments = defaultSession().adjustments;
    session.selectedInvoiceId = "";
    saveSession(session);
    savePosCart([]);
    notify("Ready for next bill.", "success");
    refresh();
  }

  function selectInvoice(invoiceId) {
    const invoice = getInvoices().find((item) => item.id === invoiceId);
    if (!invoice) {
      notify("Invoice not found.", "error");
      return false;
    }

    const session = getSession();
    session.selectedInvoiceId = invoice.id;
    session.lastInvoiceId = invoice.id;
    saveSession(session);
    dbSet(POS_KEYS.lastReceipt, invoice);
    refresh();
    return true;
  }

  function getSelectedInvoice() {
    const session = getSession();
    return getInvoices().find((invoice) => invoice.id === session.selectedInvoiceId)
      || dbGet(POS_KEYS.lastReceipt, null)
      || getInvoices()[0]
      || null;
  }

  function printReceipt() {
    const invoice = getSelectedInvoice();
    if (!invoice) {
      notify("No receipt available to print.", "error");
      return false;
    }

    dbSet(POS_KEYS.lastReceipt, invoice);
    addTransaction("Receipt Printed", invoice.id, invoice.amount);
    notify(`Receipt ${invoice.id} sent to printer.`, "success");
    window.print();
    return true;
  }

  function reprintLastReceipt() {
    const invoice = dbGet(POS_KEYS.lastReceipt, null);
    if (!invoice) {
      notify("No last receipt found.", "error");
      return false;
    }

    selectInvoice(invoice.id);
    window.print();
    return true;
  }

  function voidInvoice(invoiceId) {
    const invoices = getInvoices();
    const index = invoices.findIndex((invoice) => invoice.id === invoiceId);
    if (index < 0) {
      notify("Invoice not found.", "error");
      return false;
    }

    if (invoices[index].status === "Voided") {
      notify("Invoice already voided.", "info");
      return false;
    }

    invoices[index] = {
      ...invoices[index],
      status: "Voided",
      voidedAt: new Date().toISOString()
    };
    saveInvoices(invoices);
    applyInventoryImpact(invoices[index].items || [], "restore");
    addTransaction("Invoice Voided", invoiceId, invoices[index].amount);
    notify(`${invoiceId} voided and stock restored.`, "success");
    refresh();
    return true;
  }

  function processReturn(invoiceId, mode = "Full Return", amountOverride) {
    const invoice = getInvoices().find((item) => item.id === invoiceId);
    if (!invoice && mode !== "Return Without Invoice") {
      notify("Select a valid invoice for return/refund.", "error");
      return false;
    }

    const refundAmount = mode === "Partial Return"
      ? Math.min(numberValue(amountOverride, invoice ? invoice.amount : 0), invoice ? invoice.amount : 0)
      : invoice ? invoice.amount : numberValue(amountOverride);
    const returnRecord = {
      id: createId("RET-POS"),
      invoice: invoice ? invoice.id : "No Invoice",
      orderId: invoice ? invoice.orderId : "Counter Return",
      customer: invoice ? invoice.customer : "Walk-in Customer",
      customerId: invoice ? invoice.customerId : "Guest",
      branch: POS_BRANCH,
      product: invoice ? invoice.items.map((item) => item.name).join(", ") : "Unlinked item",
      sku: invoice ? invoice.items.map((item) => item.sku).join(", ") : "Manual",
      reason: mode,
      resolution: mode === "Exchange" ? "Exchange processed" : "Refund processed",
      amount: refundAmount,
      status: "Completed",
      validation: invoice ? "Invoice Validated" : "Manager Approval Required",
      inventoryAction: mode === "Return Without Invoice" ? "No stock impact" : "Sold → Returned",
      refundStatus: mode === "Exchange" ? "Exchange completed" : "Refund completed",
      createdAt: new Date().toISOString()
    };

    const returns = getReturns();
    returns.unshift(returnRecord);
    saveReturns(returns);

    if (invoice && mode !== "Partial Return") {
      applyInventoryImpact(invoice.items || [], "restore");
    }

    if (invoice) {
      const invoices = getInvoices();
      const index = invoices.findIndex((item) => item.id === invoice.id);
      if (index >= 0) {
        invoices[index] = {
          ...invoices[index],
          status: mode === "Partial Return" ? "Partially Returned" : mode === "Exchange" ? "Exchanged" : "Returned",
          returnId: returnRecord.id
        };
        saveInvoices(invoices);
      }
    }

    const payments = getPayments();
    payments.unshift({
      id: createId("RFND"),
      method: "Refund",
      amount: -refundAmount,
      invoice: invoice ? invoice.id : "No Invoice",
      customer: returnRecord.customer,
      shiftId: getSession().shift.id,
      branch: POS_BRANCH,
      status: returnRecord.refundStatus,
      createdAt: new Date().toISOString()
    });
    savePayments(payments);
    addTransaction("Return Processed", `${returnRecord.id} ${mode}`, -refundAmount);
    notify(`${mode} completed.`, "success");
    refresh();
    return returnRecord;
  }

  function seedPosReferenceData() {
    const invoices = getInvoices();
    if (!invoices.length && window.TRENZ_POS_DATA && Array.isArray(window.TRENZ_POS_DATA.invoices)) {
      saveInvoices(window.TRENZ_POS_DATA.invoices.map((invoice) => ({
        ...invoice,
        amount: numberValue(invoice.amount),
        items: invoice.items || [],
        payments: invoice.payments || [],
        taxSummary: invoice.taxSummary || [],
        status: invoice.status || "Paid",
        createdAt: invoice.createdAt || new Date().toISOString()
      })));
    }

    if (!getPosCart().length && window.TRENZ_POS_DATA && Array.isArray(window.TRENZ_POS_DATA.cart)) {
      savePosCart(window.TRENZ_POS_DATA.cart.map((item) => ({ ...item, id: item.id || item.sku })));
    }
  }

  window.TRENZ_POS_KEYS = POS_KEYS;
  window.TRENZ_POS_BRANCH = POS_BRANCH;
  window.formatINR = window.formatINR || money;
  window.trenzPosMoney = money;
  window.trenzSeedPosReferenceData = seedPosReferenceData;
  window.trenzGetPosSession = getSession;
  window.trenzSavePosSession = saveSession;
  window.trenzOpenShift = openShift;
  window.trenzCloseShift = closeShift;
  window.trenzIsShiftOpen = isShiftOpen;
  window.trenzSearchPosProducts = searchProducts;
  window.trenzLookupPosProductByCode = lookupProductByCode;
  window.trenzGetProductBranchStock = branchStock;
  window.trenzGetPosCart = getPosCart;
  window.trenzSavePosCart = savePosCart;
  window.trenzAddToCart = addToCart;
  window.trenzAddPosItemByCode = addByCode;
  window.trenzAddCustomPosItem = addCustomItem;
  window.trenzUpdateCartQuantity = updateCartQuantity;
  window.trenzUpdateCartPrice = updateCartPrice;
  window.trenzSetPosItemNote = setItemNote;
  window.trenzRemoveFromCart = removeFromCart;
  window.trenzClearCart = clearCart;
  window.trenzHoldBill = holdBill;
  window.trenzResumeBill = resumeBill;
  window.trenzCancelBill = cancelBill;
  window.trenzGetHeldBills = getHeldBills;
  window.trenzGetPosCustomers = getCustomers;
  window.trenzSearchPosCustomers = searchCustomers;
  window.trenzSelectPosCustomer = selectCustomer;
  window.trenzCreatePosCustomer = createCustomer;
  window.trenzGetSelectedPosCustomer = getSelectedCustomer;
  window.trenzGetPosStaff = getStaff;
  window.trenzGetSelectedSalesperson = getSelectedSalesperson;
  window.trenzSelectSalesperson = selectSalesperson;
  window.trenzSetOrderNotes = setOrderNotes;
  window.trenzSetManualDiscount = setManualDiscount;
  window.trenzApplyCoupon = applyCoupon;
  window.trenzRedeemLoyalty = redeemLoyalty;
  window.trenzSetGiftCard = setGiftCard;
  window.trenzAddPosPayment = addPayment;
  window.trenzRemovePosPayment = removePayment;
  window.trenzCompleteSale = completeSale;
  window.trenzNextBill = nextBill;
  window.trenzGetPosInvoices = getInvoices;
  window.trenzSelectPosInvoice = selectInvoice;
  window.trenzGetSelectedInvoice = getSelectedInvoice;
  window.trenzVoidInvoice = voidInvoice;
  window.trenzPrintReceipt = printReceipt;
  window.trenzReprintLastReceipt = reprintLastReceipt;
  window.trenzProcessPosReturn = processReturn;
  window.trenzGetPosPayments = getPayments;
  window.trenzGetShiftHistory = getShiftHistory;
  window.trenzGetTransactionHistory = getTransactionHistory;
  window.calculateCartTotals = calculateCartTotals;
})();