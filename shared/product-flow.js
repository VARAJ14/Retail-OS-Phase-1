function productAccentClass(category) {
  const map = {
    Clothing: "bg-indigo-500/15 text-indigo-200 border-indigo-500/20",
    Electronics: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    Cosmetics: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
    Accessories: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
  };

  return map[category] || map.Clothing;
}

function productStateClass(state) {
  const value = String(state || "").toLowerCase();

  if (value.includes("available") || value.includes("visible") || value.includes("active")) {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (value.includes("pending") || value.includes("review") || value.includes("setup")) {
    return "bg-amber-500/10 text-amber-300";
  }

  if (value.includes("blocked") || value.includes("expired")) {
    return "bg-red-500/10 text-red-300";
  }

  return "bg-slate-800 text-slate-300";
}

function renderCategoryRulePanel(category) {
  const panel = document.getElementById("categoryRulePanel");

  if (!panel) return;

  const rule = getCategoryRule(category);

  panel.innerHTML = `
    <div class="rounded-3xl border ${productAccentClass(category)} p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold">${category} Rules</p>
          <p class="mt-1 text-xs text-slate-400">Category logic applied automatically to SKU, returns and website visibility.</p>
        </div>

        <span class="rounded-full px-3 py-1 text-xs ${productStateClass(rule.inventoryState)}">
          ${rule.inventoryState}
        </span>
      </div>

      <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${rule.requiredFields.map((field) => `
          <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p class="text-xs text-slate-400">${field}</p>
            <p class="mt-1 text-sm font-medium">Required</p>
          </div>
        `).join("")}
      </div>

      <div class="mt-5 space-y-3 text-xs">
        <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <span class="text-slate-400">Return Rule</span>
          <span class="text-slate-200">${rule.returnRule}</span>
        </div>

        <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <span class="text-slate-400">Website Rule</span>
          <span class="text-blue-300">${rule.websiteRule}</span>
        </div>

        <div class="flex justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">
          <span class="text-slate-400">Analytics Tag</span>
          <span class="text-amber-300">${rule.analyticsTag}</span>
        </div>
      </div>
    </div>
  `;
}

function renderDynamicCategoryFields(category) {
  const container = document.getElementById("dynamicCategoryFields");

  if (!container) return;

  if (category === "Clothing") {
    container.innerHTML = `
      <div>
        <label class="text-xs text-slate-400">Size</label>
        <select id="variantInput" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>M</option>
          <option>S</option>
          <option>L</option>
          <option>XL</option>
          <option>XXL</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Color</label>
        <select id="colorInput" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>White</option>
          <option>Blue</option>
          <option>Black</option>
          <option>Brown</option>
          <option>Red</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Season</label>
        <select class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>Summer</option>
          <option>Festival</option>
          <option>Winter</option>
          <option>All Season</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Exchange Rule</label>
        <select class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>Size exchange allowed</option>
          <option>Color exchange allowed</option>
          <option>No exchange</option>
        </select>
      </div>
    `;
  }

  if (category === "Electronics") {
    container.innerHTML = `
      <div>
        <label class="text-xs text-slate-400">Warranty</label>
        <select id="variantInput" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>12 Months</option>
          <option>6 Months</option>
          <option>24 Months</option>
          <option>No Warranty</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Serial Verification</label>
        <select class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>Required</option>
          <option>Optional</option>
          <option>Not Required</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Compatibility</label>
        <input value="USB-C devices" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400" />
      </div>

      <div>
        <label class="text-xs text-slate-400">Warranty Claim Rule</label>
        <select class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>Serial verification required</option>
          <option>Invoice required</option>
          <option>Manager approval required</option>
        </select>
      </div>
    `;
  }

  if (category === "Cosmetics") {
    container.innerHTML = `
      <div>
        <label class="text-xs text-slate-400">Batch Number</label>
        <input id="variantInput" value="COS-TN-884" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400" />
      </div>

      <div>
        <label class="text-xs text-slate-400">Expiry Date</label>
        <input type="date" value="2026-12-31" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400" />
      </div>

      <div>
        <label class="text-xs text-slate-400">Hygiene Rule</label>
        <select class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>No return after opening</option>
          <option>Manager exception only</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Disposal Rule</label>
        <select class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>Move to Disposal if opened</option>
          <option>Move to Expired if past expiry</option>
        </select>
      </div>
    `;
  }

  if (category === "Accessories") {
    container.innerHTML = `
      <div>
        <label class="text-xs text-slate-400">Material</label>
        <select id="variantInput" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>Leather</option>
          <option>Fabric</option>
          <option>Metal</option>
          <option>Plastic</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Color</label>
        <select id="colorInput" class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>Brown</option>
          <option>Black</option>
          <option>Blue</option>
          <option>Red</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Condition Rule</label>
        <select class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>Unused and tagged</option>
          <option>Packaging required</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-400">Return Rule</label>
        <select class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-400">
          <option>Conditional return</option>
          <option>No return</option>
        </select>
      </div>
    `;
  }
}

function renderRecentProducts(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_PRODUCT_DATA.recentProducts.map((item) => `
    <tr class="hover:bg-slate-800/40">
      <td class="px-5 py-4">
        <p class="font-medium">${item.name}</p>
        <p class="mt-1 text-xs text-slate-400">${item.sku}</p>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full border px-3 py-1 text-xs ${productAccentClass(item.category)}">
          ${item.category}
        </span>
      </td>

      <td class="px-5 py-4">${item.stock.toLocaleString("en-IN")}</td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${productStateClass(item.state)}">
          ${item.state}
        </span>
      </td>

      <td class="px-5 py-4">
        <span class="rounded-full px-3 py-1 text-xs ${productStateClass(item.website)}">
          ${item.website}
        </span>
      </td>

      <td class="px-5 py-4 text-right">
        <a href="branch-inventory.html" class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400">
          ${item.nextStep}
        </a>
      </td>
    </tr>
  `).join("");
}

function renderCreationEvents(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = TRENZ_PRODUCT_DATA.creationEvents.map((item) => `
    <div class="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-medium">${item.event}</p>
          <p class="mt-1 text-xs text-slate-400">${item.detail}</p>
        </div>

        <span class="text-xs text-slate-500">${item.time}</span>
      </div>
    </div>
  `).join("");
}

function updateSkuPreview() {
  const category = document.getElementById("categoryInput")?.value || "Clothing";
  const code = document.getElementById("productCodeInput")?.value || "SHT";
  const gender = document.getElementById("segmentInput")?.value || "MEN";
  const color = document.getElementById("colorInput")?.value || "WHT";
  const variant = document.getElementById("variantInput")?.value || "M";

  const sku = generateSkuPreview(category, code, gender, color, variant);

  const skuInput = document.getElementById("skuPreviewInput");
  const skuBadge = document.getElementById("skuPreviewBadge");

  if (skuInput) skuInput.value = sku;
  if (skuBadge) skuBadge.textContent = sku;
}

function refreshProductCategoryUI() {
  const category = document.getElementById("categoryInput")?.value || "Clothing";

  renderCategoryRulePanel(category);
  renderDynamicCategoryFields(category);

  setTimeout(updateSkuPreview, 50);
}

function simulateProductSave() {
  const category = document.getElementById("categoryInput")?.value || "Clothing";
  const sku = document.getElementById("skuPreviewInput")?.value || TRENZ_PRODUCT_DATA.draftProduct.sku;
  const name = document.getElementById("productNameInput")?.value || TRENZ_PRODUCT_DATA.draftProduct.name;
  const openingStock = Number(document.getElementById("openingStockInput")?.value || 0);

  TRENZ_PRODUCT_DATA.recentProducts.unshift({
    sku,
    name,
    category,
    stock: openingStock,
    state: "Available",
    website: "Visible",
    nextStep: "Allocate to Branch"
  });

  TRENZ_PRODUCT_DATA.creationEvents.unshift({
    time: "Live",
    event: "Product saved",
    detail: `${sku} created and initialized with ${openingStock.toLocaleString("en-IN")} units in Main Inventory.`,
    module: "Products"
  });

  renderRecentProducts("recentProductsRows");
  renderCreationEvents("creationEvents");

  const saveStatus = document.getElementById("saveStatus");

  if (saveStatus) {
    saveStatus.classList.remove("hidden");
    saveStatus.innerHTML = `
      <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <p class="text-sm font-semibold text-emerald-300">Product created successfully</p>
        <p class="mt-1 text-xs text-slate-400">${sku} is now available in Main Inventory and ready for branch allocation.</p>
      </div>
    `;
  }
}
