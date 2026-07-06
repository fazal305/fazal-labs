const WORKSPACE_KEY = "fazalLabsWorkspace";

const defaultWorkspace = {
    brand: {
        name: "Fazal Labs",
        founder: "Fazal Abbas",
        tagline: "One ecosystem. Many tools. One architecture.",
        description: "A browser-first software lab that connects developer tools, civic technology, design systems, productivity apps, browser experiments, simulations, and operating-system-style interfaces into one coherent portfolio ecosystem."
    },
    settings: {
        compactSidebar: false,
        transitionSpeedMs: 320,
        loaderDelayMs: 180,
        loaderText: "Loading Fazal Labs...",
        overlayBackground: "#040712"
    },
    theme: {
        bg: "#040712",
        bgSoft: "#07111f",
        card: "rgba(10, 18, 36, 0.9)",
        text: "#f7fbff",
        muted: "#9aabc7",
        primary: "#22d3ee",
        secondary: "#a855f7",
        success: "#4ade80",
        warning: "#facc15",
        danger: "#fb7185",
        radius: 18,
        fontFamily: "Inter, sans-serif"
    },
    suites: [],
    products: [],
    roadmap: [],
    changelog: [],
    activityLog: []
};

function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#039;"
        }[char];
    });
}

function slugify(text) {
    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTimestamp(dateString) {
    if (!dateString) return "Not dated";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function createGithubPagesUrl(slug) {
    return `https://fazal305.github.io/${slug}/`;
}

function loadWorkspace() {
    const saved = localStorage.getItem(WORKSPACE_KEY);
    if (!saved) return seedDemoData();

    try {
        const parsed = JSON.parse(saved);
        return {
            ...defaultWorkspace,
            ...parsed,
            brand: { ...defaultWorkspace.brand, ...(parsed.brand || {}) },
            settings: { ...defaultWorkspace.settings, ...(parsed.settings || {}) },
            theme: { ...defaultWorkspace.theme, ...(parsed.theme || {}) },
            suites: parsed.suites || [],
            products: parsed.products || [],
            roadmap: parsed.roadmap || [],
            changelog: parsed.changelog || [],
            activityLog: parsed.activityLog || []
        };
    } catch (error) {
        console.warn("Workspace could not be parsed. Demo data restored.", error);
        return seedDemoData();
    }
}

function saveWorkspace(workspace) {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace, null, 2));
    return workspace;
}

function resetWorkspace() {
    localStorage.removeItem(WORKSPACE_KEY);
    return seedDemoData();
}

function seedDemoData() {
    const now = new Date().toISOString();

    const suiteSeeds = [
        ["suite-nightcity-os", "NIGHTCITY OS", "nightcity-os", "🌃", "The browser operating system ecosystem.", "Operating-system-style browser projects for dashboards, terminals, radios, knowledge bases, and developer workspaces.", ["File Explorer", "Browser IDE", "Terminal Extensions", "Package Manager"]],
        ["suite-devkit-studio", "DevKit Studio", "devkit-studio", "🛠", "Everything built for developers.", "Developer tools for APIs, JSON, XML, schemas, config files, databases, mapping, and debugging workflows.", ["Shared snippets", "Request history cloud sync", "Schema marketplace", "Plugin SDK"]],
        ["suite-browserlab", "BrowserLab", "browserlab", "🧪", "Projects exploring browser APIs and frontend engineering.", "Experiments that turn browser APIs, layout systems, feeds, memory, and import workflows into practical interfaces.", ["Performance lab", "Storage inspector", "Accessibility scanner"]],
        ["suite-worksuite", "WorkSuite", "worksuite", "💼", "Business and productivity applications.", "Dashboards and operational tools for projects, teams, customers, content, habits, schools, and HR workflows.", ["Invoice manager", "Team calendar", "Workflow automations"]],
        ["suite-civic-suite", "Civic Suite", "civic-suite", "🌍", "Projects solving public or mapping problems.", "Civic technology projects focused on transit, reporting, public issue resolution, and sustainability education.", ["Ward map explorer", "Public service tracker", "Civic open data portal"]],
        ["suite-design-suite", "Design Suite", "design-suite", "🎨", "Creative tools and UI engineering.", "Design, animation, query, and algorithm visualization tools for building interactive frontend experiences.", ["Icon studio", "Theme generator", "Prototype recorder"]],
        ["suite-physics-engine", "Physics Engine", "physics-engine", "⚛", "Simulation and graphics.", "Simulation projects for particles, physics, collision systems, graphics, and interactive experiments.", ["2D Physics Engine", "Collision Sandbox", "Soft Body Simulator", "Fluid Simulator"]]
    ];

    const suites = suiteSeeds.map(function (suite) {
        return {
            id: suite[0],
            name: suite[1],
            slug: suite[2],
            icon: suite[3],
            tagline: suite[4],
            description: suite[5],
            futureAdditions: suite[6],
            featuredProductIds: [],
            createdAt: now,
            updatedAt: now
        };
    });

    const productSeeds = [
        ["NIGHTCITY OS", "suite-nightcity-os", "https://github.com/fazal305/nightcity-os", "A browser desktop shell for launching tools, panels, notes, and operating-system-style workflows."],
        ["NIGHTSHIFT FM Radio Dashboard", "suite-nightcity-os", "https://github.com/fazal305/nightshift-fm-radio-dashboard", "A late-night radio dashboard with stations, playback panels, visual styling, and saved preferences."],
        ["Markdown Knowledge Base", "suite-nightcity-os", "https://github.com/fazal305/markdown-knowledge-base", "A local-first markdown wiki for structured notes, documentation, search, and project knowledge."],
        ["Fake Hacker Terminal", "suite-nightcity-os", "https://github.com/fazal305/fake-hacker-terminal", "A cinematic terminal simulator with commands, scripted output, and portfolio-friendly interactions."],
        ["DevBoard", "suite-nightcity-os", "https://github.com/fazal305/devboard", "A developer dashboard for tasks, links, logs, and project operations."],

        ["DevKit Studio", "suite-devkit-studio", "https://github.com/fazal305/devkit-studio", "A modular browser-based developer toolkit for API testing, JSON/XML tools, response comparison, schema generation, and mock response workflows."],
        ["SpecForge API Explorer", "suite-devkit-studio", "https://github.com/fazal305/specforge-api-explorer", "A SpecForge API Explorer interface for requests, headers, parameters, OpenAPI-style workflows, and response inspection."],
        ["Postman Lite", "suite-devkit-studio", "https://github.com/fazal305/postman-lite", "A lightweight browser alternative for organizing and testing HTTP requests."],
        ["DataForge", "suite-devkit-studio", "https://github.com/fazal305/dataforge", "A data transformation workbench for shaping, converting, and cleaning structured data."],
        ["JSON Schema Builder", "suite-devkit-studio", "https://github.com/fazal305/json-schema-builder", "A visual schema builder for modeling JSON objects, validation rules, and reusable definitions."],
        ["Data Mapper", "suite-devkit-studio", "https://github.com/fazal305/data-mapper", "A mapping tool for connecting fields between source and target data structures."],
        ["JSON Database Studio", "suite-devkit-studio", "https://github.com/fazal305/json-database-studio", "A browser database studio for exploring JSON collections and local datasets."],
        ["API Response Comparator", "suite-devkit-studio", "https://github.com/fazal305/api-response-comparator", "A comparison utility for spotting differences between API responses and payload versions."],
        ["Config File Manager", "suite-devkit-studio", "https://github.com/fazal305/config-file-manager", "A configuration editor for managing environment-style files, app settings, and structured configs."],
        ["JSON API Explorer", "suite-devkit-studio", "https://github.com/fazal305/json-api-explorer", "A JSON-focused API browser with readable responses, paths, and collection workflows."],
        ["REST Flow Designer", "suite-devkit-studio", "https://github.com/fazal305/rest-flow-designer", "A visual planner for request flows, endpoints, dependencies, and API workflow documentation."],

        ["Browser DevTools Clone", "suite-browserlab", "https://github.com/fazal305/browser-devtools-clone", "A browser-native recreation of core developer tools panels and inspection concepts."],
        ["Browser Memory Visualizer", "suite-browserlab", "https://github.com/fazal305/browser-memory-visualizer", "A visual tool for understanding memory concepts, object lifecycles, and frontend performance."],
        ["Flexbox Grid Builder", "suite-browserlab", "https://github.com/fazal305/flexbox-grid-builder", "An interactive layout builder for learning and generating responsive flex and grid patterns."],
        ["RSS News Dashboard", "suite-browserlab", "https://github.com/fazal305/rss-news-dashboard", "A news dashboard that organizes RSS feeds into readable browser cards, channels, and saved news workflows."],
        ["Sitemap Visualizer", "suite-browserlab", "https://github.com/fazal305/sitemap-visualizer", "A visual sitemap explorer for understanding website structure and page relationships."],
        ["Product Data Importer", "suite-browserlab", "https://github.com/fazal305/product-data-importer", "A browser utility for importing, reviewing, and preparing product data files."],

        ["DevBoard", "suite-worksuite", "https://github.com/fazal305/devboard", "A productivity dashboard for developer work, project status, and everyday planning."],
        ["Jira Lite Sprint Manager", "suite-worksuite", "https://github.com/fazal305/jira-lite-sprint-manager", "A compact sprint planning and issue tracking dashboard with boards, statuses, priorities, and project workflow management."],
        ["CRM Dashboard", "suite-worksuite", "https://github.com/fazal305/crm-dashboard", "A customer relationship dashboard for leads, accounts, metrics, and activity tracking."],
        ["CMS Admin Panel", "suite-worksuite", "https://github.com/fazal305/cms-admin-panel", "A content management admin shell for entries, publishing states, and editorial workflows."],
        ["HR Management Portal", "suite-worksuite", "https://github.com/fazal305/hr-management-portal", "An HR portal concept for employees, attendance, roles, and internal operations."],
        ["School Management Dashboard", "suite-worksuite", "https://github.com/fazal305/school-management-dashboard", "A school operations dashboard for students, classes, analytics, and administration."],
        ["Firebase Habit Tracker", "suite-worksuite", "https://github.com/fazal305/firebase-habit-tracker", "A habit tracking app concept with streaks, goals, progress, and persistence workflows."],

        ["Karachi Transit Tracker", "suite-civic-suite", "https://github.com/fazal305/karachi-transit-tracker", "A civic transit dashboard for routes, stops, commute status, and public mobility information."],
        ["Civic Issue Resolution", "suite-civic-suite", "https://github.com/fazal305/civic-issue-resolution", "A reporting workflow for public issues, citizen submissions, status tracking, and resolution notes."],
        ["Rainwater Harvesting eProject", "suite-civic-suite", "https://github.com/fazal305/rainwater-harvesting-eproject", "An educational sustainability project explaining rainwater harvesting systems and impact."],

        ["Figma Lite", "suite-design-suite", "https://github.com/fazal305/figma-lite", "A browser design tool inspired by canvas editing, panels, layers, and smooth multipage workflows."],
        ["Visual Query Builder", "suite-design-suite", "https://github.com/fazal305/visual-query-builder", "A visual interface for building query logic, conditions, groups, and readable output."],
        ["Visual Algorithm Studio", "suite-design-suite", "https://github.com/fazal305/visual-algorithm-studio", "An interactive algorithm visualizer for steps, states, explanations, and learning flows."],

        ["Physics Playground", "suite-physics-engine", "https://github.com/fazal305/physics-playground", "An interactive simulation sandbox for motion, forces, collisions, and visual physics experiments."],
        ["Particle Reactor", "suite-physics-engine", "https://github.com/fazal305/particle-reactor", "A particle simulation playground for emitters, motion fields, visual effects, and reactive systems."]
    ];

    const products = productSeeds.map(function (item, index) {
        const name = item[0];
        const slug = slugify(name);
        const id = `product-${slug}-${index + 1}`;
        return {
            id,
            name,
            slug,
            suiteId: item[1],
            status: index % 7 === 0 ? "In Progress" : "Active",
            tagline: makeTagline(name, item[1]),
            description: item[3],
            repositoryUrl: item[2],
            liveUrl: createGithubPagesUrl(slug),
            techStack: makeTechStack(item[1]),
            features: makeFeatures(name),
            architectureNotes: makeArchitectureNotes(name),
            futureAdditions: makeFutureAdditions(name),
            relatedProductIds: [],
            createdAt: now,
            updatedAt: now
        };
    });

    products.forEach(function (product) {
        product.relatedProductIds = products
            .filter(function (candidate) {
                return candidate.suiteId === product.suiteId && candidate.id !== product.id;
            })
            .slice(0, 3)
            .map(function (candidate) {
                return candidate.id;
            });
    });

    suites.forEach(function (suite) {
        suite.featuredProductIds = products
            .filter(function (product) {
                return product.suiteId === suite.id;
            })
            .slice(0, 3)
            .map(function (product) {
                return product.id;
            });
    });

    const roadmap = makeRoadmap(products, suites, now);
    const changelog = makeChangelog(products, suites, now);

    const activityLog = [
        ["Workspace", "Seeded demo data", "Created default suites, products, roadmap, and changelog"],
        ["Design System", "Applied theme", "Loaded Fazal Labs runtime theme tokens"],
        ["Products", "Generated product map", "Connected repositories and live demo links"],
        ["Roadmap", "Initialized roadmap", "Added ecosystem roadmap examples"],
        ["Changelog", "Initialized changelog", "Added release-style changelog examples"]
    ].map(function (entry) {
        return { id: generateId("log"), module: entry[0], action: entry[1], detail: entry[2], createdAt: now };
    });

    const workspace = {
        ...structuredClone(defaultWorkspace),
        suites,
        products,
        roadmap,
        changelog,
        activityLog
    };

    saveWorkspace(workspace);
    return workspace;
}

function makeTagline(name, suiteId) {
    const bySuite = {
        "suite-nightcity-os": "A desktop-style browser experience inside the Fazal Labs universe.",
        "suite-devkit-studio": "A practical developer workflow tool for browser-first engineering.",
        "suite-browserlab": "A browser API and frontend engineering experiment with real utility.",
        "suite-worksuite": "A productivity product for operational dashboards and everyday work.",
        "suite-civic-suite": "A civic technology interface for public systems and useful information.",
        "suite-design-suite": "A creative interface for visual thinking and frontend craft.",
        "suite-physics-engine": "An interactive simulation product for motion and visual systems."
    };
    return name === "DevKit Studio" ? "VS Code meets Postman in the browser." : bySuite[suiteId];
}

function makeTechStack(suiteId) {
    const common = ["HTML5", "CSS3", "JavaScript", "Bootstrap", "jQuery", "localStorage"];
    const extras = {
        "suite-design-suite": ["Canvas", "CSS Variables"],
        "suite-physics-engine": ["Canvas", "Animation Frames"],
        "suite-browserlab": ["Browser APIs", "DOM APIs"],
        "suite-civic-suite": ["Maps Concept", "Data Visualization"],
        "suite-worksuite": ["Dashboard UI", "CRUD Patterns"],
        "suite-nightcity-os": ["Shell UI", "Widget System"],
        "suite-devkit-studio": ["JSON", "REST", "Schema Tools"]
    };
    return [...common, ...(extras[suiteId] || [])];
}

function makeFeatures(name) {
    return [
        `${name} dashboard interface`,
        "Searchable and filterable records",
        "LocalStorage persistence",
        "Responsive browser layout",
        "Reusable Fazal Labs UI components",
        "Export-friendly data structure"
    ];
}

function makeArchitectureNotes(name) {
    return [
        `${name} uses a local-first browser architecture with no required backend.`,
        "State is modeled as structured JSON so it can be exported, imported, and reused.",
        "The interface follows shared Fazal Labs theme tokens and navigation patterns.",
        "Feature modules are separated so the product can evolve without a full rewrite."
    ];
}

function makeFutureAdditions(name) {
    return [
        `${name} screenshot gallery`,
        "GitHub API integration",
        "Offline PWA support",
        "Command palette",
        "Cross-product workspace sync"
    ];
}

function makeRoadmap(products, suites, now) {
    const titles = [
        "Add shared component library",
        "Connect GitHub repository metadata",
        "Create screenshot gallery",
        "Add product comparison matrix",
        "Improve mobile dashboard layout",
        "Add command palette search",
        "Create offline PWA mode",
        "Add deployment status cards",
        "Build documentation templates",
        "Add workspace import validation",
        "Create suite analytics view",
        "Add release notes export",
        "Improve roadmap filters",
        "Add changelog timeline grouping",
        "Create product health score",
        "Add architecture decision records",
        "Build theme preset library",
        "Add live demo availability checks",
        "Create onboarding walkthrough",
        "Add portfolio case-study pages"
    ];

    return titles.map(function (title, index) {
        const product = products[index % products.length];
        return {
            id: `roadmap-${index + 1}`,
            productId: product.id,
            suiteId: product.suiteId,
            title,
            description: `${title} for ${product.name} and related Fazal Labs workflows.`,
            status: ["Planned", "In Progress", "Completed"][index % 3],
            priority: ["High", "Medium", "Low"][index % 3],
            createdAt: now,
            updatedAt: now
        };
    });
}

function makeChangelog(products, suites, now) {
    const titles = [
        "Initial ecosystem dashboard",
        "Product filtering system",
        "Suite detail pages",
        "Product documentation view",
        "Architecture overview added",
        "Design token viewer added",
        "Roadmap persistence added",
        "Changelog editor added",
        "Settings theme controls",
        "Smooth page transitions",
        "Loader fallback added",
        "GitHub Pages link generation",
        "Responsive sidebar updates",
        "Workspace export added",
        "Workspace import added",
        "Activity log seeded",
        "Dynamic ecosystem tree",
        "Repository link buttons",
        "LocalStorage reset controls",
        "Shared card renderer"
    ];

    return titles.map(function (title, index) {
        const product = products[index % products.length];
        return {
            id: `change-${index + 1}`,
            productId: product.id,
            suiteId: product.suiteId,
            title,
            type: ["Feature", "Fix", "Refactor", "Documentation", "Release"][index % 5],
            description: `${title} connected to ${product.name} inside the Fazal Labs portfolio ecosystem.`,
            date: new Date(Date.now() - index * 86400000).toISOString(),
            createdAt: now
        };
    });
}

function addActivityLog(module, action, detail) {
    const workspace = loadWorkspace();
    workspace.activityLog.unshift({
        id: generateId("log"),
        module,
        action,
        detail,
        createdAt: new Date().toISOString()
    });
    saveWorkspace(workspace);
}

function applyThemeSettings() {
    const workspace = loadWorkspace();
    const root = document.documentElement;
    const theme = workspace.theme;

    Object.keys(theme).forEach(function (key) {
        const cssKey = key.replace(/[A-Z]/g, function (letter) {
            return `-${letter.toLowerCase()}`;
        });
        const value = key === "radius" ? `${theme[key]}px` : theme[key];
        root.style.setProperty(`--${cssKey}`, value);
    });

    root.style.setProperty("--transition-speed", `${workspace.settings.transitionSpeedMs}ms`);
}

function renderSidebar(activePage) {
    const workspace = loadWorkspace();
    const navItems = [
        { label: "Dashboard", page: "dashboard", href: "index.html", icon: "⌂" },
        { label: "Products", page: "products", href: "products.html", icon: "▦" },
        { label: "Architecture", page: "architecture", href: "architecture.html", icon: "◇" },
        { label: "Design System", page: "design-system", href: "design-system.html", icon: "◐" },
        { label: "Roadmap", page: "roadmap", href: "roadmap.html", icon: "↗" },
        { label: "Changelog", page: "changelog", href: "changelog.html", icon: "✦" },
        { label: "Settings", page: "settings", href: "settings.html", icon: "⚙" }
    ];

    return `
    <aside class="sidebar">
      <a class="sidebar-brand" href="index.html" data-transition-link>
        <div class="brand-mark">FL</div>
        <div>
          <p class="brand-title">${escapeHtml(workspace.brand.name)}</p>
          <p class="brand-subtitle">${escapeHtml(workspace.brand.founder)}</p>
        </div>
      </a>

      <p class="nav-section-label">Platform</p>
      <ul class="nav-list">
        ${navItems.map(function (item) {
        return `
            <li>
              <a class="nav-link ${item.page === activePage ? "active" : ""}" href="${item.href}" data-page="${item.page}" data-transition-link>
                <span class="nav-icon">${item.icon}</span>
                <span>${item.label}</span>
              </a>
            </li>
          `;
    }).join("")}
      </ul>

      <p class="nav-section-label">Suites</p>
      <ul class="nav-list">
        ${workspace.suites.map(function (suite) {
        return `
            <li>
              <a class="nav-link" href="suite.html?suite=${encodeURIComponent(suite.slug)}" data-transition-link>
                <span class="nav-icon">${suite.icon}</span>
                <span>${escapeHtml(suite.name)}</span>
              </a>
            </li>
          `;
    }).join("")}
      </ul>

      <div class="sidebar-footer">
        <strong>One brand.</strong><br>
        One architecture.<br>
        One design system.<br>
        Many products.
      </div>
    </aside>
  `;
}

function setActiveNav() {
    const file = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(function (link) {
        const hrefFile = link.getAttribute("href").split("?")[0];
        link.classList.toggle("active", hrefFile === file);
    });
}

function showStatus(message, type) {
    let toast = document.querySelector(".status-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "status-toast";
        document.body.appendChild(toast);
    }

    toast.className = `status-toast ${type || "success"}`;
    toast.textContent = message;
    requestAnimationFrame(function () {
        toast.classList.add("show");
    });

    setTimeout(function () {
        toast.classList.remove("show");
    }, 2800);
}

function renderEmptyState(message) {
    return `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function downloadJson(filename, data) {
    downloadTextFile(filename, JSON.stringify(data, null, 2));
}

function downloadTextFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

function copyText(text, message) {
    navigator.clipboard.writeText(text).then(function () {
        showStatus(message || "Copied to clipboard", "success");
    }).catch(function () {
        showStatus("Clipboard permission was not available", "warning");
    });
}

function initPageTransitions() {
    applyThemeSettings();

    if (!document.querySelector(".transition-overlay")) {
        const overlay = document.createElement("div");
        overlay.className = "transition-overlay";
        overlay.innerHTML = `
      <div class="loader-panel">
        <div class="loader-ring"></div>
        <p class="loader-text">${escapeHtml(loadWorkspace().settings.loaderText || "Loading Fazal Labs...")}</p>
      </div>
    `;
        document.body.appendChild(overlay);
    }

    document.addEventListener("click", function (event) {
        const link = event.target.closest("a[href]");
        if (!link) return;

        const href = link.getAttribute("href");
        const isInternal = href && !href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("#");
        if (!isInternal) return;

        event.preventDefault();
        navigateWithTransition(href);
    });

    window.addEventListener("pageshow", function () {
        hideTransitionOverlay();
    });

    setTimeout(hideTransitionOverlay, 80);
}

function showTransitionOverlay(withLoader) {
    const workspace = loadWorkspace();
    const overlay = document.querySelector(".transition-overlay");
    if (!overlay) return;

    overlay.style.background = workspace.settings.overlayBackground || workspace.theme.bg;
    overlay.classList.remove("is-hidden");
    overlay.classList.toggle("show-loader", Boolean(withLoader));
}

function hideTransitionOverlay() {
    const overlay = document.querySelector(".transition-overlay");
    if (!overlay) return;
    overlay.classList.add("is-hidden");
    overlay.classList.remove("show-loader");
}

function navigateWithTransition(url) {
    const workspace = loadWorkspace();
    const speed = Number(workspace.settings.transitionSpeedMs || 320);
    const loaderDelay = Number(workspace.settings.loaderDelayMs || 180);

    showTransitionOverlay(false);

    const loaderTimer = setTimeout(function () {
        showTransitionOverlay(true);
    }, loaderDelay);

    setTimeout(function () {
        clearTimeout(loaderTimer);
        window.location.href = url;
    }, Math.max(speed, 120));
}

function getSuiteById(workspace, id) {
    return workspace.suites.find(function (suite) {
        return suite.id === id;
    });
}

function getSuiteBySlug(workspace, slug) {
    return workspace.suites.find(function (suite) {
        return suite.slug === slug;
    });
}

function getProductById(workspace, id) {
    return workspace.products.find(function (product) {
        return product.id === id;
    });
}

function getProductBySlug(workspace, slug) {
    return workspace.products.find(function (product) {
        return product.slug === slug;
    });
}

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function renderStatusBadge(status) {
    const normalized = slugify(status);
    return `<span class="status-badge status-${normalized}">${escapeHtml(status)}</span>`;
}

function renderProductCard(product) {
    const workspace = loadWorkspace();
    const suite = getSuiteById(workspace, product.suiteId);
    const stack = (product.techStack || []).slice(0, 4);

    return `
    <article class="product-card card-hover">
      <div class="card-topline">
        <div>
          <p class="card-title">${escapeHtml(product.name)}</p>
          <p class="card-text">${escapeHtml(product.tagline)}</p>
        </div>
        ${renderStatusBadge(product.status)}
      </div>

      <p class="card-text">${escapeHtml(product.description)}</p>

      <div class="card-meta">
        <a class="badge-soft" href="suite.html?suite=${encodeURIComponent(suite.slug)}" data-transition-link>${escapeHtml(suite.name)}</a>
        ${stack.map(function (item) {
        return `<span class="stack-badge">${escapeHtml(item)}</span>`;
    }).join("")}
      </div>

      <div class="card-actions actions-row">
        <a class="btn-ghost" href="product.html?product=${encodeURIComponent(product.slug)}" data-transition-link>Details</a>
        <a class="btn-ghost" href="${escapeHtml(product.repositoryUrl)}" target="_blank" rel="noreferrer">GitHub</a>
        <a class="btn-lab" href="${escapeHtml(product.liveUrl)}" target="_blank" rel="noreferrer">Live Demo</a>
      </div>
    </article>
  `;
}

function renderSuiteCard(suite) {
    const workspace = loadWorkspace();
    const products = workspace.products.filter(function (product) {
        return product.suiteId === suite.id;
    });

    return `
    <article class="suite-card card-hover">
      <div class="card-topline">
        <div class="card-icon">${suite.icon}</div>
        <span class="badge-soft">${products.length} products</span>
      </div>
      <div>
        <p class="card-title">${escapeHtml(suite.name)}</p>
        <p class="card-text">${escapeHtml(suite.tagline)}</p>
      </div>
      <p class="card-text">${escapeHtml(suite.description)}</p>
      <div class="card-meta">
        ${(suite.futureAdditions || []).slice(0, 3).map(function (item) {
        return `<span class="stack-badge">${escapeHtml(item)}</span>`;
    }).join("")}
      </div>
      <a class="btn-lab" href="suite.html?suite=${encodeURIComponent(suite.slug)}" data-transition-link>Open Suite</a>
    </article>
  `;
}

function buildEcosystemTree(workspace) {
    const lines = [workspace.brand.name, ""];
    workspace.suites.forEach(function (suite, suiteIndex) {
        const suiteLast = suiteIndex === workspace.suites.length - 1;
        const suitePrefix = suiteLast ? "└── " : "├── ";
        const childPrefix = suiteLast ? "    " : "│   ";
        const products = workspace.products.filter(function (product) {
            return product.suiteId === suite.id;
        });

        lines.push(`${suitePrefix}${suite.name}`);
        products.forEach(function (product, productIndex) {
            const productLast = productIndex === products.length - 1;
            lines.push(`${childPrefix}${productLast ? "└── " : "├── "}${product.name}`);
        });
        if (!suiteLast) lines.push("");
    });
    return lines.join("\n");
}

document.addEventListener("DOMContentLoaded", function () {
    applyThemeSettings();
    initPageTransitions();
    setActiveNav();
});