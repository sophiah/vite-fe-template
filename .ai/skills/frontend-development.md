# Frontend Development Guidelines

## Language

JavaScript only: use `.js` / `.jsx`. Never create `.ts` / `.tsx`, `type`, `interface`, generics, or TypeScript annotations.

## Structure

Reusable components:

```bash
frontend/core/{ComponentName}/
```

Page folders:

```bash
frontend/pages/{PageName}/
```

Page-only components:

```bash
frontend/pages/{PageName}/components/{ComponentName}/
```

## Rules

* Use `PascalCase` for component and page folders.
* Keep related files colocated.
* `frontend/core` is for reusable, page-independent UI components.
* `frontend/pages` is for route-level pages, page state, hooks, constants, and page-specific business logic.
* Pages may import from `frontend/core`.
* `frontend/core` must never import from `frontend/pages`.

## Decision Rule

Reusable across multiple pages → `frontend/core`.

Only used by one page → keep inside that page folder.
