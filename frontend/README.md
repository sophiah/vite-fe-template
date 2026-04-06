# react-fe-template

Quick-start template for React + MUI projects with:
- `@core` alias (`src/core`)
- Color-code driven MUI theme (`defaultColorCode` and `darkModeColorCode`)
- Folder-style shared components
- Vite-based build/dev server
- File-based auto routing with route metadata (`src/pages/**/index.js`)
- Demo pages under `src/pages`

## Quick Start

```bash
yarn install
yarn dev
```

Open `http://localhost:3000`.

## Template Structure

- `src/core/defaultColorCode.js` and `src/core/darkModeColorCode.js`
- `src/core/theme/createAppTheme.js`
- `src/core/components/` 
- `src/core/layouts/`
- `src/pages/`
- `src/core/routes/autoRoutes/buildAutoRoutes.js`

## Route Metadata

Each page folder can define `routeMeta` in `index.js`:

```js
export { default } from './MyPage';

export const routeMeta = {
  path: '/my-page', // optional: defaults from folder path
  aliases: ['/legacy-my-page'], // optional extra mappings
  layout: 'left-menu', // left-menu | header-footer | blank
  permission: {
    public: false,
    auth: true,
    ability: 'read',
    subject: 'my-page'
  },
  leftMenu: { label: 'My Page' }, // optional for left-menu routes
  headerNav: { label: 'My Page' } // optional for top nav
};
```

- Permission checking is centralized in `src/core/routes/AppRoutes/AppRoutes.js`.
- Permission is evaluated as a path-hierarchy chain (parent -> child), and all layers must pass.
- If `permission` is omitted, default is:
  - `public: false`
  - `auth: true`
  - `ability: null`
  - `subject: null`
- If `ability` or `subject` is set, route is treated as protected (`public: false`, `auth: true`).
- Folder names map directly to route paths, including multi-level nesting.
- Left menu auto-builds a tree from folder paths; routes with sub-pages are collapsible.
- You can inject current permissions via localStorage key `app.permissions` (JSON array).

## Left Menu Visibility Rules

Only routes that match all conditions below will appear in Left Menu:
- `layout` is `left-menu`
- `leftMenu` is not `false`
- route is enabled (for example, not `disableRoute: true`)

Why some pages are not in Left Menu:
- `layout: 'header-footer'` pages appear in top nav, not left menu.
- `layout: 'blank'` pages are intentionally outside app shell navigation.
- `_misc/forbidden` and `_misc/not-found` are utility routes and use `leftMenu: false`.
- pages with `disableRoute: true` are helper pages and do not register routes.

Nested folders:
- Left Menu is auto-built as a tree from route paths.
- Parent folders with child pages are rendered as collapsible groups.

## Commands

```bash
cd frontend
yarn install
yarn dev
yarn build
yarn lint
yarn lint:fix
cd ..
make docker-up
make docker-down
make docker-restart
make docker-logs
```
