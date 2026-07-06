let dashboardWorkspace = null;

function renderBrandHero() {
    const workspace = dashboardWorkspace;
    $("#brandHero").html(`
    <section class="hero-panel">
      <div class="hero-content">
        <p class="eyebrow">${escapeHtml(workspace.brand.founder)} Portfolio Ecosystem</p>
        <h1 class="page-title">${escapeHtml(workspace.brand.name)}</h1>
        <p class="page-description">${escapeHtml(workspace.brand.description)}</p>
        <div class="hero-actions">
          <a class="btn-lab" href="products.html" data-transition-link>Explore Products</a>
          <a class="btn-ghost" href="architecture.html" data-transition-link>View Architecture</a>
          <a class="btn-ghost" href="design-system.html" data-transition-link>Design System</a>
        </div>
        <div class="hero-message">
          <span>One brand.</span>
          <span>One architecture.</span>
          <span>One design system.</span>
          <span>Many products.</span>
        </div>
      </div>
    </section>
  `);
}

function renderEcosystemStats() {
    const workspace = dashboardWorkspace;
    const tech = new Set();
    workspace.products.forEach(function (product) {
        (product.techStack || []).forEach(function (item) {
            tech.add(item);
        });
    });

    const stats = [
        ["Total products", workspace.products.length],
        ["Active suites", workspace.suites.length],
        ["Live demos", workspace.products.filter(function (product) { return product.liveUrl; }).length],
        ["GitHub repositories", workspace.products.filter(function (product) { return product.repositoryUrl; }).length],
        ["Technologies used", tech.size]
    ];

    $("#ecosystemStats").html(stats.map(function (stat) {
        return `
      <article class="stat-card">
        <p class="kpi-value">${stat[1]}</p>
        <p class="kpi-label">${escapeHtml(stat[0])}</p>
      </article>
    `;
    }).join(""));
}

function renderSuiteCards() {
    $("#suiteCards").html(dashboardWorkspace.suites.map(renderSuiteCard).join(""));
}

function renderFeaturedProducts() {
    const workspace = dashboardWorkspace;
    const featuredIds = workspace.suites.flatMap(function (suite) {
        return suite.featuredProductIds || [];
    });

    const featured = featuredIds
        .map(function (id) {
            return getProductById(workspace, id);
        })
        .filter(Boolean)
        .slice(0, 4);

    $("#featuredProducts").html(featured.map(renderProductCard).join("") || renderEmptyState("No featured products yet."));
}

function renderEcosystemMap() {
    $("#ecosystemMap").text(buildEcosystemTree(dashboardWorkspace));
}

function renderRecentChangelog() {
    const workspace = dashboardWorkspace;
    const entries = workspace.changelog
        .slice()
        .sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        })
        .slice(0, 5);

    $("#recentChangelog").html(entries.map(function (entry) {
        const product = getProductById(workspace, entry.productId);
        const suite = getSuiteById(workspace, entry.suiteId);

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
          <span class="stack-badge">${escapeHtml(product ? product.name : "Ecosystem")}</span>
          <span class="stack-badge">${escapeHtml(suite ? suite.name : "Fazal Labs")}</span>
        </div>
      </article>
    `;
    }).join("") || renderEmptyState("No changelog entries yet."));
}

function bindSearchShortcut() {
    $("#searchShortcutForm").on("submit", function (event) {
        event.preventDefault();
        const query = $("#searchShortcutInput").val().trim();
        navigateWithTransition(`products.html${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    });
}

$(function () {
    dashboardWorkspace = loadWorkspace();
    $("#sidebar-root").replaceWith(renderSidebar("dashboard"));
    renderBrandHero();
    renderEcosystemStats();
    renderSuiteCards();
    renderFeaturedProducts();
    renderEcosystemMap();
    renderRecentChangelog();
    bindSearchShortcut();
});