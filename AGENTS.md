# AGENTS.md (Repository)

This file provides AI-agent readable context for `react-fe-template`.

## Machine-Readable Summary

```yaml
project:
  name: react-fe-template
  type: react-mui-quick-start
  package_manager: npm
  node_version: ">=18"
frontend:
  bundler: vite
  dev_url: http://localhost:3000
  alias:
    - key: "@core/*"
      target: "src/core/*"
    - key: "@pages"
      target: "src/pages/index.js"
    - key: "@pages/*"
      target: "src/pages/*"
color_system:
  light: src/core/defaultColorCode.js
  dark: src/core/darkModeColorCode.js
  mui_theme_factory: src/core/theme/createAppTheme.js
components:
  location: src/core/components
  style: folder-based
  shared:
    - CAppCard
    - CAppBox
    - CSpinner
    - CHeaderNav
    - CFooter
    - CLeftMenu
layouts:
  location: src/core/layouts
  available:
    - BlankLayout
    - HeaderFooterLayout
    - LeftMenuLayout
routing:
  app_routes: src/core/routes/AppRoutes/AppRoutes.js
  auto_route_builder: src/core/routes/autoRoutes/buildAutoRoutes.js
  strategy: file-based routing from src/pages/**/index.js with routeMeta
  left_menu_visibility:
    - layout must be left-menu
    - leftMenu must not be false
    - route must not be disabled
  misc_routes:
    forbidden: src/pages/_misc/forbidden/index.js
    not_found: src/pages/_misc/not-found/index.js
pages:
  location: src/pages
  demos:
    - DashboardPage
    - SpinnerDemoPage
    - HeaderFooterDemoPage
    - BlankDemoPage
    - category1
commands:
  install: npm install
  dev: npm run dev
  build: npm run build
  preview: npm run preview
  lint: npm run lint
  lint_fix: npm run lint:fix
  docker_up: make docker-up
  docker_down: make docker-down
```

## Working Rules For Agents

1. Keep alias configuration stable.
- `vite.config.mjs` and `jsconfig.json` must resolve:
- `@core/*` -> `src/core/*`
- `@pages` -> `src/pages/index.js`
- `@pages/*` -> `src/pages/*`

2. Use alias-based imports for project modules.
- For modules under `src/core`, import through `@core/*`.
- For modules under `src/pages`, import through `@pages` or `@pages/*`.

3. Keep theme colors sourced from color-code modules.
- All MUI theme color values should come from `src/core/defaultColorCode.js` or `src/core/darkModeColorCode.js`.

4. Preserve folder-based component structure.
- Shared UI components should live in their own folders under `src/core/components/<ComponentName>/`.

5. Keep pages under `src/pages`.
- Page routes are generated from `src/pages/**/index.js`.
- Folder path maps to route path automatically (supports multi-level nesting).
- Use `routeMeta` in each page `index.js` for `path`, `aliases`, `layout`, `permissions`, `leftMenu`, `headerNav`.
- Parent folder `routeMeta` can provide inherited defaults for child pages.

6. Keep spinner reusable from `@core/components`.
- `CSpinner` is the default loading component for demos and should remain available from the shared component export.

7. When editing layout/navigation, verify both demos remain reachable.
- `/` should render the non-spinner dashboard demo.
- `/spinner-demo` should render spinner demo behavior.
- `/header-footer-demo` should render HeaderFooterLayout demo.
- `/blank-demo` should render BlankLayout demo.
- `/category1/page1-1`, `/category1/page1-2`, `/category1/group-a/deep-page` should render nested demo behavior.
- Left menu should render nested folders as collapsible groups.
- `header-footer` and `blank` layout routes should not appear in left menu.

8. Keep lint baseline healthy.
- Run `npm run lint` before handoff for non-trivial JS/JSX changes.
