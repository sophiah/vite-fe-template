# AGENTS.md (Repository)

This file provides AI-agent readable context for this workspace.

## Machine-Readable Summary

```yaml
project:
  name: react-fe-template-workspace
  type: frontend-backend-workspace
  package_manager: yarn
  node_version: ">=18"
frontend:
  root: frontend
  bundler: vite
  dev_url: http://localhost:3000
  alias:
    - key: "@root/*"
      target: "frontend/src/*"
    - key: "@core/*"
      target: "frontend/src/core/*"
    - key: "@pages"
      target: "frontend/src/pages/index.js"
    - key: "@pages/*"
      target: "frontend/src/pages/*"
color_system:
  light: frontend/src/core/defaultColorCode.js
  dark: frontend/src/core/darkModeColorCode.js
  mui_theme_factory: frontend/src/core/theme/createAppTheme.js
components:
  location: frontend/src/core/components
  style: folder-based
  shared:
    - AppCard
    - AppBox
    - Spinner
    - HeaderNav
    - Footer
    - LeftMenu
layouts:
  location: frontend/src/core/layouts
  available:
    - BlankLayout
    - HeaderFooterLayout
    - LeftMenuLayout
routing:
  app_routes: frontend/src/core/routes/AppRoutes/AppRoutes.js
  auto_route_builder: frontend/src/core/routes/autoRoutes/buildAutoRoutes.js
  strategy: file-based routing from frontend/src/pages/**/index.js with routeMeta
  left_menu_visibility:
    - layout must be left-menu
    - leftMenu must not be false
    - route must not be disabled
  misc_routes:
    forbidden: frontend/src/pages/_misc/forbidden/index.js
    not_found: frontend/src/pages/_misc/not-found/index.js
pages:
  location: frontend/src/pages
  demos:
    - DashboardPage
    - SpinnerDemoPage
    - HeaderFooterDemoPage
    - BlankDemoPage
    - category1
backend:
  root: backend
  status: placeholder
commands:
  frontend_install: cd frontend && yarn install
  frontend_dev: cd frontend && yarn dev
  frontend_build: cd frontend && yarn build
  frontend_preview: cd frontend && yarn preview
  frontend_lint: cd frontend && yarn lint
  frontend_lint_fix: cd frontend && yarn lint:fix
  frontend_docker_up: make docker-up
  frontend_docker_down: make docker-down
```

## Working Rules For Agents

1. Keep alias configuration stable.
- `frontend/vite.config.mjs` and `frontend/jsconfig.json` must resolve:
- `@root/*` -> `src/*`
- `@core/*` -> `src/core/*`
- `@pages` -> `src/pages/index.js`
- `@pages/*` -> `src/pages/*`

2. Use alias-based imports for project modules.
- For modules under `frontend/src`, import through `@root/*` where it improves path clarity.
- For modules under `frontend/src/core`, import through `@core/*`.
- For modules under `frontend/src/pages`, import through `@pages` or `@pages/*`.

3. Keep theme colors sourced from color-code modules.
- All MUI theme color values should come from `frontend/src/core/defaultColorCode.js` or `frontend/src/core/darkModeColorCode.js`.

4. Preserve folder-based component structure.
- Shared UI components should live in their own folders under `frontend/src/core/components/<ComponentName>/`.

5. Keep pages under `frontend/src/pages`.
- Page routes are generated from `frontend/src/pages/**/index.js`.
- Folder path maps to route path automatically (supports multi-level nesting).
- Use `routeMeta` in each page `index.js` for `path`, `aliases`, `layout`, `permission`, `leftMenu`, `headerNav`.
- Route access control is centralized in `frontend/src/core/routes/AppRoutes/AppRoutes.js` using permission chain inheritance by path.
- Parent folder `routeMeta` can provide inherited defaults for child pages.

6. Keep spinner reusable from `@core/components`.
- `Spinner` is the default loading component for demos and should remain available from the shared component export.

7. When editing layout/navigation, verify both demos remain reachable.
- `/` should render the non-spinner dashboard demo.
- `/spinner-demo` should render spinner demo behavior.
- `/header-footer-demo` should render HeaderFooterLayout demo.
- `/blank-demo` should render BlankLayout demo.
- `/category1/page1-1`, `/category1/page1-2`, `/category1/group-a/deep-page` should render nested demo behavior.
- Left menu should render nested folders as collapsible groups.
- `header-footer` and `blank` layout routes should not appear in left menu.

8. Keep lint baseline healthy.
- Run `cd frontend && yarn lint` before handoff for non-trivial JS/JSX changes.
