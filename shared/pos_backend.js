(function () {

  function getPosCart() {
    return trenzDbGet(TRENZ_DB_KEYS.cart, []);
  }

  function savePosCart(cart) {
    trenzDbSet(TRENZ_DB_KEYS.cart, cart);
  }

  function addToCart(productId) {
    const products = trenzGetProducts();
    const product = products.find(item => item.id === productId);

    if (!product) {
      alert("Product not found");
      return;
    }

    const cart = getPosCart();

    const existing = cart.find(item => item.id === productId);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        gst: product.gst,
        qty: 1
      });
    }

    savePosCart(cart);

    window.dispatchEvent(
      new CustomEvent("trenz-pos-cart-updated")
    );
  }

  function removeFromCart(productId) {
    let cart = getPosCart();

    cart = cart.filter(item => item.id !== productId);

    savePosCart(cart);

    window.dispatchEvent(
      new CustomEvent("trenz-pos-cart-updated")
    );
  }

  function clearCart() {
    savePosCart([]);

    window.dispatchEvent(
      new CustomEvent("trenz-pos-cart-updated")
    );
  }

  function calculateCartTotals() {
    const cart = getPosCart();

    let subtotal = 0;
    let gst = 0;

    cart.forEach(item => {
      subtotal += item.price * item.qty;
      gst += ((item.price * item.qty) * item.gst) / 100;
    });

    return {
      subtotal,
      gst,
      loyaltyDiscount: 0,
      total: subtotal + gst
    };
  }

  window.trenzGetPosCart = getPosCart;
  window.trenzSavePosCart = savePosCart;
  window.trenzAddToCart = addToCart;
  window.trenzRemoveFromCart = removeFromCart;
  window.trenzClearCart = clearCart;
  window.calculateCartTotals = calculateCartTotals;

})();