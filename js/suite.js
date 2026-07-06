let suiteWorkspace = null;
let currentSuite = null;

function renderSuiteDetail() {
    const products = suiteWorkspace.products.filter(function (product) {
        return product.suiteId === currentSuite.id;
    });

    const roadmapCount = suiteWorkspace.roadmap.filter(function (item) {
        return item.suiteId === currentSuite.id;
    }).length;

    const changelogCount = suiteWorkspace.changelog.filter(function (entry) {
        return entry.suiteId === currentSuite.id;
    }).length;

    $("#suiteDetail").html(`
    <section class="suite-hero">
      <div class="suite-hero-top">
        <div class="suite-hero-icon">${currentSuite.icon}</div>
        <div>
          <p class="eyebrow">Suite Detail</p>
          <h1 class="page-title">${escapeHtml(currentSuite.name)}</h1>
          <p class="page-description">${escapeHtml(currentSuite.tagline)}</p>
          <p class="page-description">${escapeHtml(currentSuite.description)}</p>
          <div class="actions-row">
            <a class="btn-lab" href="products.html" data-transition-link>Browse Products</a>
            <a class="btn-ghost" href="roadmap.html" data-transition-link>Open Roadmap</a>
          </div>
        </div>
      </div>

      <div class="grid suite-stats">
        <article class="stat-card">
          <p class="kpi-value">${products.length}</p>
          <p class="kpi-label">Products</p>
        </article>
        <article class="stat-card">
          <p class="kpi-value">${roadmapCount}</p>
          <p class="kpi-label">Roadmap Items</p>
        </article>
        <article class="stat-card">
          <p class="kpi-value">${changelogCount}</p>
          <p class="kpi-label">Changelog Entries</p>
        </article>
        <article class="stat-card">
          <p class="kpi-value">${currentSuite.futureAdditions.length}</p>
          <p class="kpi-label">Future Additions</p>
        </article>
      </div>
    </section>
  `);

    document.title = `${currentSuite.name} | Fazal Labs`;
}

function renderSuiteProducts() {
    const products = suiteWorkspace.products.filter(function (product) {
        return product.suiteId === currentSuite.id;
    });

    $("#suiteProducts").html(
        products.length
            ? products.map(renderProductCard).join("")
            : renderEmptyState("No products are connected to this suite yet.")
    );
}

function renderSuiteRoadmap() {
    const items = suiteWorkspace.roadmap.filter(function (item) {
        return item.suiteId === currentSuite.id;
    }).slice(0, 6);

    $("#suiteRoadmap").html(items.map(function (item) {
        const product = getProductById(suiteWorkspace, item.productId);

        return `
      <article class="timeline-card">
        <div class="card-topline">
          <div>
            <p class="card-title">${escapeHtml(item.title)}</p>
            <p class="card-text">${escapeHtml(item.description)}</p>
          </div>
          ${renderStatusBadge(item.status)}
        </div>
        <div class="card-meta">
          <span class="stack-badge">${escapeHtml(item.priority)}</span>
          <span class="stack-badge">${escapeHtml(product ? product.name : "Suite")}</span>
        </div>
      </article>
    `;
    }).join("") || renderEmptyState("No roadmap items for this suite yet."));
}

function renderSuiteChangelog() {
    const entries = suiteWorkspace.changelog.filter(function (entry) {
        return entry.suiteId === currentSuite.id;
    }).slice(0, 6);

    $("#suiteChangelog").html(entries.map(function (entry) {
        const product = getProductById(suiteWorkspace, entry.productId);

        return `
      <article class="timeline-card">
        <div class="card-topline">
          <div>
            <p class="card-title">${escapeHtml(entry.title)}</p>
            <p class="card-text">${escapeHtml(entry.description)}</p>
          </div>
          <span class="badge-soft">${escapeHtml(entry.type)}</span>
        </div>
        <div class="card-meta">
          <span class="stack-badge">${escapeHtml(formatTimestamp(entry.date))}</span>
          <span class="stack-badge">${escapeHtml(product ? product.name : "Suite")}</span>
        </div>
      </article>
    `;
    }).join("") || renderEmptyState("No changelog entries for this suite yet."));
}

function renderRelatedSuites() {
    const related = suiteWorkspace.suites.filter(function (suite) {
        return suite.id !== currentSuite.id;
    }).slice(0, 4);

    $("#relatedSuites").html(related.map(function (suite) {
        return `
      <a href="suite.html?suite=${encodeURIComponent(suite.slug)}" data-transition-link>
        <span>${suite.icon} ${escapeHtml(suite.name)}</span>
        <span>${escapeHtml(suite.tagline)}</span>
      </a>
    `;
    }).join(""));
}

function renderFutureAdditions() {
    $("#suiteFutureAdditions").html((currentSuite.futureAdditions || []).map(function (item) {
        return `<li><span>${escapeHtml(item)}</span><span class="badge-soft">Future</span></li>`;
    }).join("") || `<li><span>No future additions listed yet.</span></li>`);
}

$(function () {
    suiteWorkspace = loadWorkspace();
    $("#sidebar-root").replaceWith(renderSidebar("suite"));

    const slug = getQueryParam("suite");
    currentSuite = getSuiteBySlug(suiteWorkspace, slug) || suiteWorkspace.suites[0];

    if (!currentSuite) {
        $("#suiteDetail").html(renderEmptyState("No suite data is available."));
        return;
    }

    renderSuiteDetail();
    renderSuiteProducts();
    renderSuiteRoadmap();
    renderSuiteChangelog();
    renderRelatedSuites();
    renderFutureAdditions();
});