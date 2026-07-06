let productWorkspace = null;
let currentProduct = null;
let currentProductSuite = null;

function renderProductDetail() {
    $("#productHero").html(`
    <section class="product-hero">
      <p class="eyebrow">${escapeHtml(currentProductSuite.name)} Product</p>
      <h1 class="page-title">${escapeHtml(currentProduct.name)}</h1>
      <p class="page-description">${escapeHtml(currentProduct.tagline)}</p>
      <p class="page-description">${escapeHtml(currentProduct.description)}</p>

      <div class="product-meta-row">
        ${renderStatusBadge(currentProduct.status)}
        <a class="badge-soft" href="suite.html?suite=${encodeURIComponent(currentProductSuite.slug)}" data-transition-link>${escapeHtml(currentProductSuite.name)}</a>
        <span class="badge-soft">Updated ${escapeHtml(formatTimestamp(currentProduct.updatedAt))}</span>
      </div>

      <div class="actions-row">
        <a class="btn-lab" href="${escapeHtml(currentProduct.liveUrl)}" target="_blank" rel="noreferrer">Open Live Demo</a>
        <a class="btn-ghost" href="${escapeHtml(currentProduct.repositoryUrl)}" target="_blank" rel="noreferrer">GitHub Repository</a>
        <a class="btn-ghost" href="products.html" data-transition-link>Back to Products</a>
      </div>
    </section>
  `);

    $("#productDocumentation").text(
        `${currentProduct.name} is documented as part of the ${currentProductSuite.name} suite. Its repository, live demo, feature set, architecture notes, roadmap entries, and changelog history all resolve from the shared Fazal Labs workspace model, keeping the product page reusable and data-driven.`
    );

    $("#productLinks").html(`
    <a class="btn-lab" href="${escapeHtml(currentProduct.liveUrl)}" target="_blank" rel="noreferrer">Live Demo</a>
    <a class="btn-ghost" href="${escapeHtml(currentProduct.repositoryUrl)}" target="_blank" rel="noreferrer">GitHub</a>
  `);

    $("#productTechStack").html((currentProduct.techStack || []).map(function (tech) {
        return `<span class="stack-badge">${escapeHtml(tech)}</span>`;
    }).join(""));

    $("#productFutureAdditions").html((currentProduct.futureAdditions || []).map(function (item) {
        return `<li>${escapeHtml(item)}</li>`;
    }).join(""));

    document.title = `${currentProduct.name} | Fazal Labs`;
}

function renderProductFeatures(product) {
    $("#productFeatures").html((product.features || []).map(function (feature) {
        return `<li>${escapeHtml(feature)}</li>`;
    }).join("") || `<li>No features documented yet.</li>`);
}

function renderProductArchitecture(product) {
    $("#productArchitecture").html((product.architectureNotes || []).map(function (note) {
        return `<li>${escapeHtml(note)}</li>`;
    }).join("") || `<li>No architecture notes documented yet.</li>`);
}

function renderRelatedProducts(product) {
    const related = (product.relatedProductIds || [])
        .map(function (id) {
            return getProductById(productWorkspace, id);
        })
        .filter(Boolean);

    $("#relatedProducts").html(related.map(function (item) {
        return `
      <a href="product.html?product=${encodeURIComponent(item.slug)}" data-transition-link>
        <strong>${escapeHtml(item.name)}</strong>
        <span class="card-text">${escapeHtml(item.tagline)}</span>
      </a>
    `;
    }).join("") || renderEmptyState("No related products yet."));
}

function renderProductRoadmap(product) {
    const items = productWorkspace.roadmap.filter(function (item) {
        return item.productId === product.id;
    });

    $("#productRoadmap").html(items.map(function (item) {
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
          <span class="stack-badge">${escapeHtml(formatTimestamp(item.updatedAt))}</span>
        </div>
      </article>
    `;
    }).join("") || renderEmptyState("No roadmap items connected to this product yet."));
}

function renderProductChangelog(product) {
    const entries = productWorkspace.changelog.filter(function (entry) {
        return entry.productId === product.id;
    });

    $("#productChangelog").html(entries.map(function (entry) {
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
        </div>
      </article>
    `;
    }).join("") || renderEmptyState("No changelog entries connected to this product yet."));
}

$(function () {
    productWorkspace = loadWorkspace();
    $("#sidebar-root").replaceWith(renderSidebar("product"));

    const slug = getQueryParam("product");
    currentProduct = getProductBySlug(productWorkspace, slug) || productWorkspace.products[0];

    if (!currentProduct) {
        $("#productHero").html(renderEmptyState("No product data is available."));
        return;
    }

    currentProductSuite = getSuiteById(productWorkspace, currentProduct.suiteId);

    renderProductDetail();
    renderProductFeatures(currentProduct);
    renderProductArchitecture(currentProduct);
    renderRelatedProducts(currentProduct);
    renderProductRoadmap(currentProduct);
    renderProductChangelog(currentProduct);
});