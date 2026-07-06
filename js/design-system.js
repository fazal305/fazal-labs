let designWorkspace = null;

function renderThemeTokens() {
    const theme = designWorkspace.theme;

    $("#themeTokens").html(Object.keys(theme).map(function (tokenName) {
        const value = theme[tokenName];
        const isVisual = typeof value === "string" && (value.startsWith("#") || value.startsWith("rgb"));

        return `
      <button class="token-card text-start" type="button" onclick="copyTokenValue('${escapeHtml(tokenName)}')">
        <div class="token-swatch" style="--token-preview: ${isVisual ? escapeHtml(value) : "var(--card)"}"></div>
        <p class="token-name">--${escapeHtml(tokenName.replace(/[A-Z]/g, function (letter) { return "-" + letter.toLowerCase(); }))}</p>
        <p class="token-value">${escapeHtml(String(value))}</p>
      </button>
    `;
    }).join(""));
}

function renderComponentPreviews() {
    $("#componentPreviews").html(`
    <div class="d-grid gap-3">
      <div class="actions-row">
        <button class="btn-lab" type="button">Primary Action</button>
        <button class="btn-ghost" type="button">Ghost Action</button>
        <button class="btn-danger-soft" type="button">Danger Action</button>
      </div>

      <article class="product-card">
        <div class="card-topline">
          <div>
            <p class="card-title">Reusable Product Card</p>
            <p class="card-text">Cards use shared border, radius, shadow, text, and badge tokens.</p>
          </div>
          ${renderStatusBadge("Active")}
        </div>
        <div class="card-meta">
          <span class="stack-badge">HTML5</span>
          <span class="stack-badge">CSS Variables</span>
          <span class="stack-badge">JavaScript</span>
        </div>
      </article>

      <div class="preview-table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>--primary</td>
              <td>Actions and highlights</td>
            </tr>
            <tr>
              <td>--card</td>
              <td>Panels and cards</td>
            </tr>
          </tbody>
        </table>
      </div>

      <form class="d-grid gap-2">
        <label class="form-label" for="previewInput">Form Preview</label>
        <input id="previewInput" class="form-control" placeholder="Token-driven input">
        <select class="form-select">
          <option>Token-driven select</option>
        </select>
      </form>
    </div>
  `);
}

function copyTokenValue(tokenName) {
    const value = designWorkspace.theme[tokenName];
    copyText(String(value), `Copied ${tokenName}`);
}

function renderTypographyPreview() {
    $("#typographyPreview").html(`
    <div class="typography-sample">
      <p class="eyebrow">${escapeHtml(designWorkspace.brand.name)}</p>
      <h2 class="page-title" style="font-size: 2.5rem;">Design tokens with runtime personality.</h2>
      <p class="page-description">${escapeHtml(designWorkspace.brand.tagline)}</p>
      <p>Default text uses the current <strong>font family</strong>, text token, and spacing rhythm.</p>
      <p class="card-text">Muted supporting copy uses the shared muted token.</p>
    </div>
  `);
}

function renderLiveThemePreview() {
    const previewTokens = ["bg", "bgSoft", "card", "primary", "secondary", "success", "warning", "danger"];

    $("#liveThemePreview").html(previewTokens.map(function (token) {
        return `
      <div class="live-theme-chip" style="--token-preview: var(--${token.replace(/[A-Z]/g, function (letter) { return "-" + letter.toLowerCase(); })})">
        <strong>${escapeHtml(token)}</strong>
        <p class="token-value">${escapeHtml(String(designWorkspace.theme[token]))}</p>
      </div>
    `;
    }).join(""));
}

$(function () {
    designWorkspace = loadWorkspace();
    $("#sidebar-root").replaceWith(renderSidebar("design-system"));
    renderThemeTokens();
    renderLiveThemePreview();
    renderTypographyPreview();
    renderComponentPreviews();
});