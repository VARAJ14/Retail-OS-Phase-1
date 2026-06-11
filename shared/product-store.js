(function () {
  function getProducts() {
    return trenzDbGet(TRENZ_DB_KEYS.products, []);
  }

  function saveProducts(products) {
    trenzDbSet(TRENZ_DB_KEYS.products, products);
    trenzDbSet(TRENZ_DB_KEYS.inventory, products);
  }

  function createProduct(productInput) {
    const product = {
      id: trenzCreateId("PRD"),
      sku: productInput.sku,
      name: productInput.name,
      brand: productInput.brand || "TRENZ",
      category: productInput.category,
      variant: productInput.variant || "Standard",
      price: Number(productInput.price || 0),
      mrp: Number(productInput.mrp || productInput.price || 0),
      gst: Number(productInput.gst || 0),
      stock: Number(productInput.stock || 0),
      state: "Available",
      websiteVisible: Boolean(productInput.websiteVisible),
      posVisible: Boolean(productInput.posVisible),
      branchStock: {
        "BEST CHOICE ANNA NAGAR BRANCH": 0,
        "PADI BRANCH": 0,
        "SPENCER": 0
      },
      createdAt: new Date().toISOString()
    };

    const products = getProducts();
    products.unshift(product);
    saveProducts(products);

    return product;
  }

  function updateProduct(productId, updates) {
    const products = getProducts();
    const index = products.findIndex((item) => item.id === productId);

    if (index < 0) return null;

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveProducts(products);
    return products[index];
  }

  function deleteProduct(productId) {
    const products = getProducts().filter((item) => item.id !== productId);
    saveProducts(products);
  }

  function updateStock(productId, stock) {
    return updateProduct(productId, { stock: Number(stock) });
  }

  function renderProductRows(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let products = getProducts();

    if (options.websiteOnly) {
      products = products.filter((item) => item.websiteVisible);
    }

    if (options.posOnly) {
      products = products.filter((item) => item.posVisible);
    }

    container.innerHTML = products.map((item) => `
      <tr class="hover:bg-slate-800/40">
        <td class="px-5 py-4">
          <p class="font-medium">${item.name}</p>
          <p class="mt-1 text-xs text-slate-400">${item.sku} · ${item.brand}</p>
        </td>

        <td class="px-5 py-4">${item.category}</td>
        <td class="px-5 py-4">${item.variant || "Standard"}</td>
        <td class="px-5 py-4">₹${Number(item.price).toLocaleString("en-IN")}</td>

        <td class="px-5 py-4">
          <input
            value="${item.stock}"
            onchange="trenzUpdateProductStock('${item.id}', this.value); trenzRenderProductRows('${containerId}')"
            class="w-24 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </td>

        <td class="px-5 py-4">
          <span class="rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs">${item.state}</span>
        </td>

        <td class="px-5 py-4">
          <div class="flex flex-col gap-1 text-xs">
            <span class="${item.websiteVisible ? "text-blue-300" : "text-red-300"}">Website: ${item.websiteVisible ? "Visible" : "Hidden"}</span>
            <span class="${item.posVisible ? "text-emerald-300" : "text-red-300"}">POS: ${item.posVisible ? "Visible" : "Hidden"}</span>
          </div>
        </td>

        <td class="px-5 py-4 text-right">
          <button onclick="trenzDeleteProduct('${item.id}'); trenzRenderProductRows('${containerId}')" class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20">
            Delete
          </button>
        </td>
      </tr>
    `).join("");
  }

  function productFromCreatePage() {
    const name = document.getElementById("productNameInput")?.value || "New Product";
    const category = document.getElementById("categoryInput")?.value || "Clothing";
    const sku = document.getElementById("skuPreviewInput")?.value || trenzCreateId("SKU");
    const stock = Number(document.getElementById("openingStockInput")?.value || 0);

    const priceInput =
      document.querySelector("[data-product-selling-price]") ||
      document.querySelector("[data-product-price]");

    const mrpInput = document.querySelector("[data-product-mrp]");
    const gstInput = document.querySelector("[data-product-gst]");
    const variantInput = document.getElementById("variantInput");

    return {
      sku,
      name,
      brand: "TRENZ",
      category,
      variant: variantInput?.value || "Standard",
      price: Number(priceInput?.value || 999),
      mrp: Number(mrpInput?.value || 1299),
      gst: Number(gstInput?.value || (category === "Clothing" ? 5 : 18)),
      stock,
      websiteVisible: true,
      posVisible: stock > 0
    };
  }

  function saveProductFromCreatePage() {
    const product = createProduct(productFromCreatePage());

    const status = document.getElementById("saveStatus");
    if (status) {
      status.classList.remove("hidden");
      status.innerHTML = `
        <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p class="text-sm font-semibold text-emerald-300">Product saved successfully</p>
          <p class="mt-1 text-xs text-slate-300">${product.name} now appears in Inventory, Website and POS data stores.</p>
        </div>
      `;
    }

    return product;
  }

  window.trenzGetProducts = getProducts;
  window.trenzCreateProduct = createProduct;
  window.trenzUpdateProduct = updateProduct;
  window.trenzDeleteProduct = deleteProduct;
  window.trenzUpdateProductStock = updateStock;
  window.trenzRenderProductRows = renderProductRows;
  window.trenzSaveProductFromCreatePage = saveProductFromCreatePage;
})();
