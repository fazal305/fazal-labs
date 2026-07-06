let productsWorkspace = null;
let productFiltersState = {
    query: "",
    suiteId: "all",
    status: "all",
    tech: "all"
};

function renderProductFilters() {
    const workspace = productsWorkspace;
    const queryParam = getQueryParam("q") || "";
    productFiltersState.query = queryParam;

    const statuses = [...new Set(workspace.products.map(function (product) {
        return product.status;
    }))];

    const techStack = [...new Set(workspace.products.flatMap(function (product) {
        return product.techStack || [];
    }))].sort();

    $("#productFilters").html(`
    <input id="productSearch" class="form-control" type="search" placeholder="Search products..." value="${escapeHtml(queryParam)}">

    <select id="suiteFilter" class="form-select" aria-label="Filter by suite">
      <option value="all">All suites</option>
      ${workspace.suites.map(function (suite) {
        return `<option value="${suite.id}">${escapeHtml(suite.name)}</option>`;
    }).join("")}
    </select>

    <select id="statusFilter" class="form-select" aria-label="Filter by status">
      <option value="all">All statuses</option>
      ${statuses.map(function (status) {
        return `<option value="${escapeHtml(status)}">${escapeHtml(status)}</option>`;
    }).join("")}
    </select>

    <select id="techFilter" class="form-select" aria-label="Filter by technology">
      <option value="all">All technologies</option>
      ${techStack.map(function (tech) {
        return `<option value="${escapeHtml(tech)}">${escapeHtml(tech)}</option>`;
    }).join("")}
    </select>
  `);

    $("#productSearch").on("input", function () {
        productFiltersState.query = $(this).val();
        renderProducts();
    });

    $("#suiteFilter").on("change", function () {
        productFiltersState.suiteId = $(this).val();
        renderProducts();
    });

    $("#statusFilter").on("change", function () {
        productFiltersState.status = $(this).val();
        renderProducts();
    });

    $("#techFilter").on("change", function () {
        productFiltersState.tech = $(this).val();
        renderProducts();
    });
}

function filterProducts() {
    const workspace = productsWorkspace;
    const query = productFiltersState.query.trim().toLowerCase();

    return workspace.products.filter(function (product) {
        const suite = getSuiteById(workspace, product.suiteId);
        const searchable = [
            product.name,
            product.tagline,
            product.description,
            suite ? suite.name : "",
            ...(product.techStack || [])
        ].join(" ").toLowerCase();

        const matchesQuery = !query || searchable.includes(query);
        const matchesSuite = productFiltersState.suiteId === "all" || product.suiteId === productFiltersState.suiteId;
        const matchesStatus = productFiltersState.status === "all" || product.status === productFiltersState.status;
        const matchesTech = productFiltersState.tech === "all" || (product.techStack || []).includes(productFiltersState.tech);

        return matchesQuery && matchesSuite && matchesStatus && matchesTech;
    });
}

function renderProducts() {
    const products = filterProducts();

    $("#resultCount").text(products.length);
    $("#activeFilterSummary").text([
        productFiltersState.suiteId === "all" ? "All suites" : getSuiteById(productsWorkspace, productFiltersState.suiteId).name,
        productFiltersState.status === "all" ? "all statuses" : productFiltersState.status,
        productFiltersState.tech === "all" ? "all technologies" : productFiltersState.tech
    ].join(", "));

    $("#productsGrid").html(
        products.length
            ? products.map(renderProductCard).join("")
            : renderEmptyState("No products match the current filters.")
    );
}

$(function () {
    productsWorkspace = loadWorkspace();
    $("#sidebar-root").replaceWith(renderSidebar("products"));
    renderProductFilters();
    renderProducts();
});