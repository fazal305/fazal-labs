let settingsWorkspace = null;

function renderBrandSettings() {
    $("#brandSettingsForm").html(`
    <div>
      <label class="form-label" for="brandName">Brand name</label>
      <input id="brandName" class="form-control" value="${escapeHtml(settingsWorkspace.brand.name)}">
    </div>

    <div>
      <label class="form-label" for="founderName">Founder name</label>
      <input id="founderName" class="form-control" value="${escapeHtml(settingsWorkspace.brand.founder)}">
    </div>

    <div>
      <label class="form-label" for="brandTagline">Tagline</label>
      <input id="brandTagline" class="form-control" value="${escapeHtml(settingsWorkspace.brand.tagline)}">
    </div>

    <div>
      <label class="form-label" for="brandDescription">Description</label>
      <textarea id="brandDescription" class="form-control" rows="4">${escapeHtml(settingsWorkspace.brand.description)}</textarea>
    </div>

    <button class="btn-lab" type="submit">Save Brand Settings</button>
  `);

    $("#brandSettingsForm").on("submit", function (event) {
        event.preventDefault();

        if (!$("#brandName").val().trim()) {
            showStatus("Brand name is required", "warning");
            return;
        }
        if (!$("#founderName").val().trim()) {
            showStatus("Founder name is required", "warning");
            return;
        }

        saveBrandSettings();
    });
}

function saveBrandSettings() {
    settingsWorkspace.brand = {
        name: $("#brandName").val().trim(),
        founder: $("#founderName").val().trim(),
        tagline: $("#brandTagline").val().trim(),
        description: $("#brandDescription").val().trim()
    };

    saveWorkspace(settingsWorkspace);
    addActivityLog("Settings", "Updated brand settings", settingsWorkspace.brand.name);
    settingsWorkspace = loadWorkspace();
    $("#sidebar-root").replaceWith(renderSidebar("settings"));
    showStatus("Brand settings saved", "success");
}

function renderThemeCustomizer() {
    const colorTokens = ["bg", "bgSoft", "text", "muted", "primary", "secondary", "success", "warning", "danger"];

    $("#themeCustomizer").html(`
    ${colorTokens.map(function (token) {
        const label = token.replace(/[A-Z]/g, function (letter) {
            return " " + letter.toLowerCase();
        });

        return `
        <div>
          <label class="form-label" for="theme-${token}">${escapeHtml(label)}</label>
          <div class="color-input-row">
            <input id="theme-${token}" type="color" value="${escapeHtml(settingsWorkspace.theme[token])}" onchange="updateThemeToken('${token}', this.value)">
            <input class="form-control" value="${escapeHtml(settingsWorkspace.theme[token])}" oninput="updateThemeToken('${token}', this.value)">
          </div>
        </div>
      `;
    }).join("")}

    <div>
      <label class="form-label" for="themeCard">Card surface</label>
      <input id="themeCard" class="form-control" value="${escapeHtml(settingsWorkspace.theme.card)}" oninput="updateThemeToken('card', this.value)">
    </div>

    <div>
      <label class="form-label" for="fontFamily">Font family</label>
      <select id="fontFamily" class="form-select" onchange="updateThemeToken('fontFamily', this.value)">
        ${["Inter, sans-serif", "system-ui, sans-serif", "Georgia, serif", "Arial, sans-serif", "Verdana, sans-serif"].map(function (font) {
        return `<option value="${escapeHtml(font)}" ${settingsWorkspace.theme.fontFamily === font ? "selected" : ""}>${escapeHtml(font)}</option>`;
    }).join("")}
      </select>
    </div>

    <div>
      <label class="form-label" for="radiusRange">Border radius: <span class="range-value" id="radiusValue">${settingsWorkspace.theme.radius}px</span></label>
      <input id="radiusRange" class="form-range" type="range" min="4" max="32" value="${settingsWorkspace.theme.radius}" oninput="updateThemeToken('radius', Number(this.value))">
    </div>
  `);
}

function updateThemeToken(name, value) {
    settingsWorkspace.theme[name] = value;
    saveWorkspace(settingsWorkspace);
    applyThemeSettings();

    if (name === "radius") {
        $("#radiusValue").text(`${value}px`);
    }
}

function resetThemeToDefault() {
    settingsWorkspace.theme = { ...defaultWorkspace.theme };
    saveWorkspace(settingsWorkspace);
    applyThemeSettings();
    renderThemeCustomizer();
    addActivityLog("Settings", "Reset theme", "Restored default Fazal Labs theme tokens");
    showStatus("Theme reset", "success");
}

function renderTransitionSettings() {
    $("#transitionSettings").html(`
    <div>
      <label class="form-label" for="transitionSpeed">Transition speed:
        <span class="range-value" id="transitionSpeedValue">${settingsWorkspace.settings.transitionSpeedMs}ms</span>
      </label>
      <input id="transitionSpeed" class="form-range" type="range" min="120" max="1000" step="20" value="${settingsWorkspace.settings.transitionSpeedMs}">
    </div>

    <div>
      <label class="form-label" for="loaderDelay">Loader delay:
        <span class="range-value" id="loaderDelayValue">${settingsWorkspace.settings.loaderDelayMs}ms</span>
      </label>
      <input id="loaderDelay" class="form-range" type="range" min="0" max="1000" step="20" value="${settingsWorkspace.settings.loaderDelayMs}">
    </div>

    <div>
      <label class="form-label" for="loaderText">Loader text</label>
      <input id="loaderText" class="form-control" value="${escapeHtml(settingsWorkspace.settings.loaderText || "Loading Fazal Labs...")}">
    </div>

    <div>
      <label class="form-label" for="overlayBackground">Overlay background</label>
      <input id="overlayBackground" class="form-control" value="${escapeHtml(settingsWorkspace.settings.overlayBackground || settingsWorkspace.theme.bg)}">
    </div>

    <button class="btn-lab" type="button" onclick="saveTransitionSettings()">Save Transition Settings</button>
  `);

    $("#transitionSpeed").on("input", function () {
        $("#transitionSpeedValue").text(`${this.value}ms`);
        setTransitionSpeed(Number(this.value));
    });

    $("#loaderDelay").on("input", function () {
        $("#loaderDelayValue").text(`${this.value}ms`);
        setLoaderDelay(Number(this.value));
    });
}

function setTransitionSpeed(ms) {
    settingsWorkspace.settings.transitionSpeedMs = ms;
    saveWorkspace(settingsWorkspace);
    applyThemeSettings();
}

function setLoaderDelay(ms) {
    settingsWorkspace.settings.loaderDelayMs = ms;
    saveWorkspace(settingsWorkspace);
}

function saveTransitionSettings() {
    settingsWorkspace.settings.loaderText = $("#loaderText").val().trim();
    settingsWorkspace.settings.overlayBackground = $("#overlayBackground").val().trim();
    saveWorkspace(settingsWorkspace);
    addActivityLog("Settings", "Updated transition settings", `${settingsWorkspace.settings.transitionSpeedMs}ms transition`);
    showStatus("Transition settings saved", "success");
}

function exportWorkspace() {
    const workspace = loadWorkspace();
    downloadJson("fazal-labs-workspace.json", workspace);
    addActivityLog("Settings", "Exported workspace", "Downloaded ecosystem JSON");
}

function importWorkspace(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
        try {
            const imported = JSON.parse(reader.result);
            const workspace = {
                ...defaultWorkspace,
                ...imported,
                brand: { ...defaultWorkspace.brand, ...(imported.brand || {}) },
                settings: { ...defaultWorkspace.settings, ...(imported.settings || {}) },
                theme: { ...defaultWorkspace.theme, ...(imported.theme || {}) },
                suites: imported.suites || [],
                products: imported.products || [],
                roadmap: imported.roadmap || [],
                changelog: imported.changelog || [],
                activityLog: imported.activityLog || []
            };

            saveWorkspace(workspace);
            addActivityLog("Settings", "Imported workspace", file.name);
            settingsWorkspace = loadWorkspace();
            applyThemeSettings();
            renderBrandSettings();
            renderThemeCustomizer();
            renderTransitionSettings();
            $("#sidebar-root").replaceWith(renderSidebar("settings"));
            showStatus("Workspace imported", "success");
        } catch (error) {
            showStatus("Import failed. Use a valid Fazal Labs JSON file.", "danger");
        }
    };

    reader.readAsText(file);
}

function resetDemoWorkspace() {
    if (!confirm("Reset all workspace data to demo defaults?")) return;

    settingsWorkspace = resetWorkspace();
    applyThemeSettings();
    renderBrandSettings();
    renderThemeCustomizer();
    renderTransitionSettings();
    $("#sidebar-root").replaceWith(renderSidebar("settings"));
    showStatus("Demo workspace restored", "success");
}

function clearWorkspace() {
    if (!confirm("Clear localStorage and rebuild demo data?")) return;

    localStorage.removeItem(WORKSPACE_KEY);
    settingsWorkspace = seedDemoData();
    applyThemeSettings();
    renderBrandSettings();
    renderThemeCustomizer();
    renderTransitionSettings();
    $("#sidebar-root").replaceWith(renderSidebar("settings"));
    showStatus("localStorage cleared and demo data restored", "warning");
}

$(function () {
    settingsWorkspace = loadWorkspace();
    $("#sidebar-root").replaceWith(renderSidebar("settings"));
    renderBrandSettings();
    renderThemeCustomizer();
    renderTransitionSettings();
});