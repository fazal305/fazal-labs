# Fazal Labs

A browser-based software-lab portfolio ecosystem that connects multiple
projects under one shared brand, design system, documentation style,
architecture strategy, roadmap, changelog, and deployment story.

## Live Links

- GitHub Repository: [fazal305/fazal-labs](https://github.com/fazal305/fazal-labs)
- Live Demo: [https://fazal305.github.io/fazal-labs/](https://fazal305.github.io/fazal-labs/)

## Overview

Fazal Labs turns a collection of standalone repositories into one coherent product ecosystem. It organizes portfolio projects into suites, connects every product to shared architecture and design language, and presents roadmap, changelog, documentation, GitHub, and live demo links through one browser-based hub.

The platform is intentionally no-build and static, so it can run locally by opening `index.html` and can be deployed directly to GitHub Pages.

## Ecosystem Suites

- NIGHTCITY OS
- DevKit Studio
- BrowserLab
- WorkSuite
- Civic Suite
- Design Suite
- Physics Engine

## Products

### NIGHTCITY OS

- NIGHTCITY OS
- NIGHTSHIFT FM Radio Dashboard
- Markdown Knowledge Base
- Fake Hacker Terminal
- DevBoard

### DevKit Studio

- DevKit Studio
- SpecForge API Explorer
- Postman Lite
- DataForge
- JSON Schema Builder
- Data Mapper
- JSON Database Studio
- API Response Comparator
- Config File Manager
- JSON API Explorer
- REST Flow Designer

### BrowserLab

- Browser DevTools Clone
- Browser Memory Visualizer
- Flexbox Grid Builder
- RSS News Dashboard
- Sitemap Visualizer
- Product Data Importer

### WorkSuite

- DevBoard
- Jira Lite Sprint Manager
- CRM Dashboard
- CMS Admin Panel
- HR Management Portal
- School Management Dashboard
- Firebase Habit Tracker

### Civic Suite

- Karachi Transit Tracker
- Civic Issue Resolution
- Rainwater Harvesting eProject

### Design Suite

- Figma Lite
- Visual Query Builder
- Visual Algorithm Studio

### Physics Engine

- Physics Playground
- Particle Reactor

## Pages

- `index.html` - ecosystem dashboard
- `products.html` - searchable product catalog
- `suite.html?suite=devkit-studio` - dynamic suite detail page
- `product.html?product=json-schema-builder` - dynamic product detail page
- `architecture.html` - ecosystem architecture overview
- `design-system.html` - live token and component viewer
- `roadmap.html` - editable roadmap board
- `changelog.html` - editable ecosystem changelog
- `settings.html` - brand, theme, transition, import, and export controls

## Features

- Multi-page browser architecture
- Shared sidebar and navigation
- Smooth internal page transitions
- Loader fallback for slower navigation
- Dynamic theme system powered by CSS custom properties
- Product suites rendered from shared workspace data
- Product cards generated from configuration
- Dynamic suite detail pages
- Dynamic product detail pages
- Generated ecosystem tree
- Searchable and filterable products page
- Editable roadmap with localStorage persistence
- Editable changelog with localStorage persistence
- Design token viewer and component previews
- Brand settings and theme customizer
- Workspace JSON export and import
- GitHub repository links
- Generated GitHub Pages live demo links
- Responsive layout

## Technologies Used

- HTML5
- CSS3 dynamic custom properties
- Bootstrap 5
- jQuery
- Vanilla JavaScript
- LocalStorage
- Blob API
- Clipboard API

## Learning Outcomes

- Designing a product ecosystem instead of a flat portfolio
- Building a no-build multi-page frontend architecture
- Modeling shared state with localStorage
- Rendering product and suite interfaces from data
- Creating dynamic route-style pages with query parameters
- Implementing smooth transitions across normal HTML pages
- Building editable roadmap and changelog workflows
- Creating a runtime theme system with CSS variables
- Preparing a GitHub Pages friendly static project

## Architecture Notes

Fazal Labs uses a multi-page frontend architecture where each major area has its own HTML file, JavaScript file, and CSS file. Shared behavior lives in `js/shared.js`, while page-specific behavior lives in files such as `js/products.js`, `js/roadmap.js`, and `js/settings.js`.

The CSS architecture is split between `styles.css` for shared layout, component, navigation, token, form, card, badge, and transition styles, and page-level CSS files inside `css/` for focused page layouts. Theme values are stored in `workspace.theme`, applied at runtime to `:root`, and consumed throughout the UI through CSS custom properties.

The suite and product data model is the center of the platform. Suites contain product groups, future additions, featured product IDs, and metadata. Products contain repository links, generated live demo links, tech stacks, feature lists, architecture notes, future additions, and related product IDs.

Roadmap and changelog items are stored inside the shared workspace and persisted with localStorage. Users can create, edit, delete, filter, export, import, reset, and restore workspace data without a backend.

The transition system keeps normal multi-page navigation while improving the perceived experience. Internal links are intercepted by `js/shared.js`, a full-screen overlay fades in, a loader appears after the configured delay, and then the browser navigates to the target page.

GitHub Pages live demo links are generated with the product slug through `createGithubPagesUrl(slug)`, giving every product a predictable deployment URL.

The project uses a no-build browser architecture. There are no frameworks, bundlers, compilers, package managers, or backend services required.

## Folder Structure

```text
fazal-labs/
  index.html
  products.html
  suite.html
  product.html
  architecture.html
  design-system.html
  roadmap.html
  changelog.html
  settings.html

  styles.css

  css/
    dashboard.css
    products.css
    suite.css
    product.css
    architecture.css
    design-system.css
    roadmap.css
    changelog.css
    settings.css

  js/
    shared.js
    dashboard.js
    products.js
    suite.js
    product.js
    architecture.js
    design-system.js
    roadmap.js
    changelog.js
    settings.js

  README.md
  LICENSE
  .gitignore
```

How To Run Locally
git clone https://github.com/fazal305/fazal-labs.git
cd fazal-labs
start index.html
You can also open index.html directly in a browser.
How To Use
Open index.html.
Browse the dashboard overview.
Use Products to search and filter all projects.
Open a suite page to see products, roadmap items, and changelog entries for that suite.
Open a product detail page to see repository links, live demo links, tech stack, features, architecture notes, roadmap, and changelog.
Visit Architecture to understand the ecosystem structure.
Visit Design System to inspect tokens and component previews.
Add or edit roadmap items.
Add or edit changelog entries.
Customize brand, theme, loader, and transition settings.
Export the workspace JSON when you want a portable snapshot.
Sample Workflow
Browse the ecosystem from the dashboard.
Filter products by suite on the Products page.
Open suite.html?suite=devkit-studio.
Open product.html?product=json-schema-builder.
View the Architecture page to understand shared layers.
Explore the Design System page and copy token values.
Add a roadmap item for a product.
Add a changelog entry for a suite.
Customize the theme in Settings.
Export ecosystem JSON for backup or sharing.
