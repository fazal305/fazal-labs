let changelogWorkspace = null;
let changelogModal = null;
let changelogFiltersState = {
    suiteId: "all",
    productId: "all",
    type: "all"
};

function renderChangelogFilters() {
    const types = ["Feature", "Fix", "Refactor", "Documentation", "Release"];

    $("#changelogFilters").html(`
    <input id="changelogSearch" class="form-control" type="search" placeholder="Search changelog...">

    <select id="changelogSuiteFilter" class="form-select">
      <option value="all">All suites</option>
      ${changelogWorkspace.suites.map(function (suite) {
        return `<option value="${suite.id}">${escapeHtml(suite.name)}</option>`;
    }).join("")}
    </select>

    <select id="changelogProductFilter" class="form-select">
      <option value="all">All products</option>
      ${changelogWorkspace.products.map(function (product) {
        return `<option value="${product.id}">${escapeHtml(product.name)}</option>`;
    }).join("")}
    </select>

    <select id="changelogTypeFilter" class="form-select">
      <option value="all">All types</option>
      ${types.map(function (type) {
        return `<option value="${type}">${escapeHtml(type)}</option>`;
    }).join("")}
    </select>
  `);

    $("#changelogSearch").on("input", filterChangelogEntries);
    $("#changelogSuiteFilter").on("change", function () {
        changelogFiltersState.suiteId = $(this).val();
        renderChangelog();
    });
    $("#changelogProductFilter").on("change", function () {
        changelogFiltersState.productId = $(this).val();
        renderChangelog();
    });
    $("#changelogTypeFilter").on("change", function () {
        changelogFiltersState.type = $(this).val();
        renderChangelog();
    });
}

function filterChangelogEntries() {
    renderChangelog();
}

function getFilteredChangelogEntries() {
    const query = ($("#changelogSearch").val() || "").toLowerCase();

    return changelogWorkspace.changelog.filter(function (entry) {
        const product = getProductById(changelogWorkspace, entry.productId);
        const suite = getSuiteById(changelogWorkspace, entry.suiteId);
        const searchable = [entry.title, entry.description, entry.type, product ? product.name : "", suite ? suite.name : ""].join(" ").toLowerCase();

        return (!query || searchable.includes(query))
            && (changelogFiltersState.suiteId === "all" || entry.suiteId === changelogFiltersState.suiteId)
            && (changelogFiltersState.productId === "all" || entry.productId === changelogFiltersState.productId)
            && (changelogFiltersState.type === "all" || entry.type === changelogFiltersState.type);
    }).sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
}

function renderChangelog() {
    const entries = getFilteredChangelogEntries();

    $("#changelogFeed").html(entries.map(function (entry) {
        const product = getProductById(changelogWorkspace, entry.productId);
        const suite = getSuiteById(changelogWorkspace, entry.suiteId);

        return `
      <article class="change-entry">
        <div class="change-entry-header">
          <div>
            <p class="change-date">${escapeHtml(formatTimestamp(entry.date))}</p>
            <h2 class="card-title">${escapeHtml(entry.title)}</h2>
            <p class="card-text">${escapeHtml(entry.description)}</p>
          </div>
          <span class="badge-soft type-${escapeHtml(entry.type.toLowerCase())}">${escapeHtml(entry.type)}</span>
        </div>
        <div class="card-meta">
          <span class="stack-badge">${escapeHtml(product ? product.name : "Product")}</span>
          <span class="stack-badge">${escapeHtml(suite ? suite.name : "Suite")}</span>
        </div>
        <div class="item-actions">
          <button class="btn-ghost" type="button" onclick="editChangelogEntry('${escapeHtml(entry.id)}')">Edit</button>
          <button class="btn-danger-soft" type="button" onclick="deleteChangelogEntry('${escapeHtml(entry.id)}')">Delete</button>
        </div>
      </article>
    `;
    }).join("") || renderEmptyState("No changelog entries match the current filters."));

    renderTypeSummary(entries);
}

function renderTypeSummary(entries) {
    const types = ["Feature", "Fix", "Refactor", "Documentation", "Release"];

    $("#typeSummary").html(types.map(function (type) {
        const count = entries.filter(function (entry) {
            return entry.type === type;
        }).length;

        return `
      <article class="timeline-card">
        <div class="card-topline">
          <span class="type-${escapeHtml(type.toLowerCase())}">${escapeHtml(type)}</span>
          <strong>${count}</strong>
        </div>
      </article>
    `;
    }).join(""));
}

function populateChangelogFormOptions(selectedSuiteId, selectedProductId) {
    const suiteId = selectedSuiteId || changelogWorkspace.suites[0].id;
    const products = changelogWorkspace.products.filter(function (product) {
        return product.suiteId === suiteId;
    });

    $("#changeSuite").html(changelogWorkspace.suites.map(function (suite) {
        return `<option value="${suite.id}" ${suite.id === suiteId ? "selected" : ""}>${escapeHtml(suite.name)}</option>`;
    }).join(""));

    $("#changeProduct").html(products.map(function (product) {
        return `<option value="${product.id}" ${product.id === selectedProductId ? "selected" : ""}>${escapeHtml(product.name)}</option>`;
    }).join(""));
}

function openChangelogModal(entry) {
    const today = new Date().toISOString().slice(0, 10);

    $("#changeId").val(entry ? entry.id : "");
    $("#changeTitle").val(entry ? entry.title : "");
    $("#changeDescription").val(entry ? entry.description : "");
    $("#changeType").val(entry ? entry.type : "Feature");
    $("#changeDate").val(entry ? new Date(entry.date).toISOString().slice(0, 10) : today);
    populateChangelogFormOptions(entry ? entry.suiteId : null, entry ? entry.productId : null);
    changelogModal.show();
}

function createChangelogEntry() {
    const id = $("#changeId").val();
    const productId = $("#changeProduct").val();
    const product = getProductById(changelogWorkspace, productId);
    const now = new Date().toISOString();

    const payload = {
        id: id || generateId("change"),
        productId,
        suiteId: $("#changeSuite").val(),
        title: $("#changeTitle").val().trim(),
        type: $("#changeType").val(),
        description: $("#changeDescription").val().trim(),
        date: new Date($("#changeDate").val()).toISOString(),
        createdAt: id ? changelogWorkspace.changelog.find(function (entry) { return entry.id === id; }).createdAt : now
    };

    if (id) {
        changelogWorkspace.changelog = changelogWorkspace.changelog.map(function (entry) {
            return entry.id === id ? payload : entry;
        });
        showStatus("Changelog entry updated", "success");
    } else {
        changelogWorkspace.changelog.unshift(payload);
        showStatus("Changelog entry created", "success");
    }

    saveWorkspace(changelogWorkspace);
    addActivityLog("Changelog", id ? "Updated changelog entry" : "Created changelog entry", `${payload.title} for ${product ? product.name : "product"}`);
    changelogWorkspace = loadWorkspace();
    changelogModal.hide();
    renderChangelog();
}

function editChangelogEntry(id) {
    const entry = changelogWorkspace.changelog.find(function (item) {
        return item.id === id;
    });
    if (entry) openChangelogModal(entry);
}

function deleteChangelogEntry(id) {
    const entry = changelogWorkspace.changelog.find(function (item) {
        return item.id === id;
    });
    if (!entry || !confirm("Delete this changelog entry?")) return;

    changelogWorkspace.changelog = changelogWorkspace.changelog.filter(function (item) {
        return item.id !== id;
    });
    saveWorkspace(changelogWorkspace);
    addActivityLog("Changelog", "Deleted changelog entry", entry.title);
    changelogWorkspace = loadWorkspace();
    showStatus("Changelog entry deleted", "warning");
    renderChangelog();
}

$(function () {
    changelogWorkspace = loadWorkspace();
    $("#sidebar-root").replaceWith(renderSidebar("changelog"));

    changelogModal = new bootstrap.Modal(document.getElementById("changelogModal"));
    renderChangelogFilters();
    renderChangelog();

    $("#changeSuite").on("change", function () {
        populateChangelogFormOptions($(this).val(), null);
    });

    $("#changelogForm").on("submit", function (event) {
        event.preventDefault();

        if (!$("#changeTitle").val().trim()) {
            showStatus("Title is required", "warning");
            return;
        }
        if (!$("#changeProduct").val()) {
            showStatus("Product is required", "warning");
            return;
        }
        if (!$("#changeDate").val()) {
            showStatus("Date is required", "warning");
            return;
        }

        createChangelogEntry();
    });
});