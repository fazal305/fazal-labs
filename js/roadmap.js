let roadmapWorkspace = null;
let roadmapModal = null;
let roadmapFiltersState = {
    suiteId: "all",
    productId: "all"
};

function renderRoadmapFilters() {
    $("#roadmapFilters").html(`
    <input id="roadmapSearch" class="form-control" type="search" placeholder="Search roadmap...">

    <select id="roadmapSuiteFilter" class="form-select">
      <option value="all">All suites</option>
      ${roadmapWorkspace.suites.map(function (suite) {
        return `<option value="${suite.id}">${escapeHtml(suite.name)}</option>`;
    }).join("")}
    </select>

    <select id="roadmapProductFilter" class="form-select">
      <option value="all">All products</option>
      ${roadmapWorkspace.products.map(function (product) {
        return `<option value="${product.id}">${escapeHtml(product.name)}</option>`;
    }).join("")}
    </select>

    <button class="btn-ghost" type="button" onclick="resetRoadmapFilters()">Reset Filters</button>
  `);

    $("#roadmapSearch").on("input", filterRoadmapItems);
    $("#roadmapSuiteFilter").on("change", function () {
        roadmapFiltersState.suiteId = $(this).val();
        renderRoadmap();
    });
    $("#roadmapProductFilter").on("change", function () {
        roadmapFiltersState.productId = $(this).val();
        renderRoadmap();
    });
}

function filterRoadmapItems() {
    renderRoadmap();
}

function getFilteredRoadmapItems() {
    const query = ($("#roadmapSearch").val() || "").toLowerCase();

    return roadmapWorkspace.roadmap.filter(function (item) {
        const product = getProductById(roadmapWorkspace, item.productId);
        const suite = getSuiteById(roadmapWorkspace, item.suiteId);
        const searchable = [item.title, item.description, item.priority, item.status, product ? product.name : "", suite ? suite.name : ""].join(" ").toLowerCase();

        return (!query || searchable.includes(query))
            && (roadmapFiltersState.suiteId === "all" || item.suiteId === roadmapFiltersState.suiteId)
            && (roadmapFiltersState.productId === "all" || item.productId === roadmapFiltersState.productId);
    });
}

function renderRoadmap() {
    const statuses = ["Planned", "In Progress", "Completed"];
    const items = getFilteredRoadmapItems();

    $("#roadmapBoard").html(statuses.map(function (status) {
        const columnItems = items.filter(function (item) {
            return item.status === status;
        });

        return `
      <section class="roadmap-column">
        <div class="column-title">
          <h2>${escapeHtml(status)}</h2>
          <span class="badge-soft">${columnItems.length}</span>
        </div>
        <div class="roadmap-list">
          ${columnItems.map(renderRoadmapItemCard).join("") || renderEmptyState("No items here.")}
        </div>
      </section>
    `;
    }).join(""));
}

function renderRoadmapItemCard(item) {
    const product = getProductById(roadmapWorkspace, item.productId);
    const suite = getSuiteById(roadmapWorkspace, item.suiteId);

    return `
    <article class="roadmap-item">
      <div class="card-topline">
        <p class="card-title">${escapeHtml(item.title)}</p>
        <span class="stack-badge priority-${escapeHtml(item.priority.toLowerCase())}">${escapeHtml(item.priority)}</span>
      </div>
      <p class="card-text">${escapeHtml(item.description)}</p>
      <div class="card-meta">
        <span class="stack-badge">${escapeHtml(product ? product.name : "Product")}</span>
        <span class="stack-badge">${escapeHtml(suite ? suite.name : "Suite")}</span>
      </div>
      <div class="item-actions">
        <button class="btn-ghost" type="button" onclick="editRoadmapItem('${escapeHtml(item.id)}')">Edit</button>
        <button class="btn-danger-soft" type="button" onclick="deleteRoadmapItem('${escapeHtml(item.id)}')">Delete</button>
      </div>
    </article>
  `;
}

function populateRoadmapFormOptions(selectedSuiteId, selectedProductId) {
    const suiteId = selectedSuiteId || roadmapWorkspace.suites[0].id;
    const products = roadmapWorkspace.products.filter(function (product) {
        return product.suiteId === suiteId;
    });

    $("#roadmapSuite").html(roadmapWorkspace.suites.map(function (suite) {
        return `<option value="${suite.id}" ${suite.id === suiteId ? "selected" : ""}>${escapeHtml(suite.name)}</option>`;
    }).join(""));

    $("#roadmapProduct").html(products.map(function (product) {
        return `<option value="${product.id}" ${product.id === selectedProductId ? "selected" : ""}>${escapeHtml(product.name)}</option>`;
    }).join(""));
}

function openRoadmapModal(item) {
    $("#roadmapId").val(item ? item.id : "");
    $("#roadmapTitle").val(item ? item.title : "");
    $("#roadmapDescription").val(item ? item.description : "");
    $("#roadmapStatus").val(item ? item.status : "Planned");
    $("#roadmapPriority").val(item ? item.priority : "High");
    populateRoadmapFormOptions(item ? item.suiteId : null, item ? item.productId : null);
    roadmapModal.show();
}

function createRoadmapItem() {
    const id = $("#roadmapId").val();
    const productId = $("#roadmapProduct").val();
    const product = getProductById(roadmapWorkspace, productId);
    const now = new Date().toISOString();

    const payload = {
        id: id || generateId("roadmap"),
        productId,
        suiteId: $("#roadmapSuite").val(),
        title: $("#roadmapTitle").val().trim(),
        description: $("#roadmapDescription").val().trim(),
        status: $("#roadmapStatus").val(),
        priority: $("#roadmapPriority").val(),
        createdAt: id ? roadmapWorkspace.roadmap.find(function (item) { return item.id === id; }).createdAt : now,
        updatedAt: now
    };

    if (id) {
        roadmapWorkspace.roadmap = roadmapWorkspace.roadmap.map(function (item) {
            return item.id === id ? payload : item;
        });
        showStatus("Roadmap item updated", "success");
    } else {
        roadmapWorkspace.roadmap.unshift(payload);
        showStatus("Roadmap item created", "success");
    }

    saveWorkspace(roadmapWorkspace);
    addActivityLog("Roadmap", id ? "Updated roadmap item" : "Created roadmap item", `${payload.title} for ${product ? product.name : "product"}`);
    roadmapWorkspace = loadWorkspace();
    roadmapModal.hide();
    renderRoadmap();
}

function editRoadmapItem(id) {
    const item = roadmapWorkspace.roadmap.find(function (roadmapItem) {
        return roadmapItem.id === id;
    });
    if (item) openRoadmapModal(item);
}

function deleteRoadmapItem(id) {
    const item = roadmapWorkspace.roadmap.find(function (roadmapItem) {
        return roadmapItem.id === id;
    });
    if (!item || !confirm("Delete this roadmap item?")) return;

    roadmapWorkspace.roadmap = roadmapWorkspace.roadmap.filter(function (roadmapItem) {
        return roadmapItem.id !== id;
    });
    saveWorkspace(roadmapWorkspace);
    addActivityLog("Roadmap", "Deleted roadmap item", item.title);
    roadmapWorkspace = loadWorkspace();
    showStatus("Roadmap item deleted", "warning");
    renderRoadmap();
}

function resetRoadmapFilters() {
    roadmapFiltersState = { suiteId: "all", productId: "all" };
    $("#roadmapSearch").val("");
    $("#roadmapSuiteFilter").val("all");
    $("#roadmapProductFilter").val("all");
    renderRoadmap();
}

$(function () {
    roadmapWorkspace = loadWorkspace();
    $("#sidebar-root").replaceWith(renderSidebar("roadmap"));

    roadmapModal = new bootstrap.Modal(document.getElementById("roadmapModal"));
    renderRoadmapFilters();
    renderRoadmap();

    $("#roadmapSuite").on("change", function () {
        populateRoadmapFormOptions($(this).val(), null);
    });

    $("#roadmapForm").on("submit", function (event) {
        event.preventDefault();
        createRoadmapItem();
    });
});