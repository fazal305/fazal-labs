let architectureWorkspace = null;

function renderArchitectureOverview() {
    const strategies = [
        {
            title: "Shared Design System",
            text: "All pages consume the same theme tokens and component classes, so product suites feel connected."
        },
        {
            title: "Shared localStorage Strategy",
            text: "Workspace data is persisted as one JSON model with brand, theme, suites, products, roadmap, changelog, and activity."
        },
        {
            title: "Shared Deployment Strategy",
            text: "Every product receives a predictable GitHub Pages URL generated from its product slug."
        },
        {
            title: "Documentation Style",
            text: "Product pages behave like living documentation cards generated from repository metadata and product configuration."
        },
        {
            title: "Transition Layer",
            text: "Internal navigation is still normal multi-page navigation, but a shared overlay smooths the page change."
        }
    ];

    $("#architectureOverview").html(strategies.map(function (item) {
        return `
      <article class="strategy-item">
        <h3 class="card-title">${escapeHtml(item.title)}</h3>
        <p class="card-text">${escapeHtml(item.text)}</p>
      </article>
    `;
    }).join(""));
}

function renderArchitectureCards() {
    const cards = [
        ["UI Layer", "HTML pages, Bootstrap primitives, shared sidebar, cards, forms, tables, timelines, and responsive grids."],
        ["State Layer", "Workspace JSON loaded from localStorage and saved through shared helper functions."],
        ["Data Layer", "Suites, products, roadmap items, changelog entries, activity logs, links, badges, and stack metadata."],
        ["Export Layer", "Blob downloads, JSON workspace export, import workflows, and text file generation helpers."],
        ["Documentation Layer", "Product detail pages resolve features, architecture notes, future additions, roadmap, and changelog data."],
        ["Deployment Layer", "No-build static files designed for direct browser opening and GitHub Pages hosting."]
    ];

    $("#architectureCards").html(cards.map(function (card, index) {
        return `
      <article class="architecture-card card-hover">
        <div class="card-icon">${index + 1}</div>
        <h3>${escapeHtml(card[0])}</h3>
        <p class="card-text">${escapeHtml(card[1])}</p>
      </article>
    `;
    }).join(""));
}

function renderEcosystemDiagram() {
    const workspace = architectureWorkspace;
    const layers = [
        {
            name: workspace.brand.name,
            meta: `${workspace.suites.length} suites, ${workspace.products.length} products`
        },
        {
            name: "Shared Workspace Model",
            meta: "brand, settings, theme, suites, products, roadmap, changelog"
        },
        {
            name: "Multi-page Shell",
            meta: "dashboard, products, suite, product, architecture, design system, roadmap, changelog, settings"
        },
        {
            name: "Static Deployment",
            meta: "open index.html locally or deploy through GitHub Pages"
        }
    ];

    $("#ecosystemDiagram").html(layers.map(function (layer) {
        return `
      <div class="diagram-layer">
        <strong>${escapeHtml(layer.name)}</strong>
        <p class="card-text">${escapeHtml(layer.meta)}</p>
      </div>
    `;
    }).join(""));
}

$(function () {
    architectureWorkspace = loadWorkspace();
    $("#sidebar-root").replaceWith(renderSidebar("architecture"));
    renderArchitectureOverview();
    renderArchitectureCards();
    renderEcosystemDiagram();
    $("#architectureTree").text(buildEcosystemTree(architectureWorkspace));
});