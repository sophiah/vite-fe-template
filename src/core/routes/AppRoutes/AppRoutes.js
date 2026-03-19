import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BlankLayout, HeaderFooterLayout, LeftMenuLayout } from '@core/layouts';
import { buildAutoRoutes, hasPermission } from '@core/routes/autoRoutes';

const BRAND_LABEL = 'React MUI Kit';

function dedupeAndSortItems(items = []) {
  const uniqueItemByPath = new Map();

  items.forEach((item) => {
    if (!item || !item.path) {
      return;
    }

    if (!uniqueItemByPath.has(item.path)) {
      uniqueItemByPath.set(item.path, item);
    }
  });

  return [...uniqueItemByPath.values()].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;

    if (orderA === orderB) {
      return a.path.localeCompare(b.path);
    }

    return orderA - orderB;
  });
}

function toTitleCasePathSegment(pathSegment = '') {
  return pathSegment
    .split('-')
    .filter(Boolean)
    .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
    .join(' ');
}

function getParentPath(pathname) {
  if (!pathname || pathname === '/' || pathname === '*') {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) {
    return null;
  }

  return `/${segments.slice(0, -1).join('/')}`;
}

function getAncestorPaths(pathname) {
  if (!pathname || pathname === '/' || pathname === '*') {
    return [];
  }

  const segments = pathname.split('/').filter(Boolean);
  const ancestors = [];

  for (let index = 1; index < segments.length; index += 1) {
    ancestors.push(`/${segments.slice(0, index).join('/')}`);
  }

  return ancestors;
}

function buildLeftMenuTree(routes = []) {
  const menuRoutes = routes
    .filter((route) => route.layout === 'left-menu' && route.leftMenu)
    .map((route) => ({
      ...route.leftMenu,
      routePath: route.path
    }));

  const sortedMenuItems = dedupeAndSortItems(menuRoutes);
  const nodeByPath = new Map();

  sortedMenuItems.forEach((item) => {
    nodeByPath.set(item.path, {
      key: item.path,
      path: item.path,
      routePath: item.routePath,
      label: item.label,
      icon: item.icon,
      order: item.order,
      virtual: false,
      children: []
    });
  });

  sortedMenuItems.forEach((item) => {
    const ancestorPaths = getAncestorPaths(item.path);

    ancestorPaths.forEach((ancestorPath) => {
      if (nodeByPath.has(ancestorPath)) {
        return;
      }

      const ancestorSegment = ancestorPath.split('/').filter(Boolean).pop() || '';

      nodeByPath.set(ancestorPath, {
        key: ancestorPath,
        path: null,
        routePath: null,
        label: toTitleCasePathSegment(ancestorSegment),
        icon: null,
        order: Number.MAX_SAFE_INTEGER,
        virtual: true,
        children: []
      });
    });
  });

  const rootNodes = [];

  nodeByPath.forEach((node) => {
    const parentPath = getParentPath(node.key);

    if (parentPath && nodeByPath.has(parentPath)) {
      nodeByPath.get(parentPath).children.push(node);
      return;
    }

    rootNodes.push(node);
  });

  const getEffectiveOrder = (node) => {
    if (typeof node.order === 'number' && Number.isFinite(node.order)) {
      return node.order;
    }

    if (!node.children.length) {
      return Number.MAX_SAFE_INTEGER;
    }

    return Math.min(...node.children.map((child) => getEffectiveOrder(child)));
  };

  const sortNodes = (nodes) => {
    nodes.sort((nodeA, nodeB) => {
      const orderA = getEffectiveOrder(nodeA);
      const orderB = getEffectiveOrder(nodeB);

      if (orderA === orderB) {
        return nodeA.key.localeCompare(nodeB.key);
      }

      return orderA - orderB;
    });

    nodes.forEach((node) => {
      if (node.children.length) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(rootNodes);

  return rootNodes;
}

function getSafeFallbackPath(routes = [], userPermissions = []) {
  const accessibleRoutes = routes.filter(
    (route) => route.path !== '*' && hasPermission(userPermissions, route.permissions)
  );
  const rootRoute = accessibleRoutes.find((route) => route.path === '/');

  if (rootRoute) {
    return rootRoute.path;
  }

  if (accessibleRoutes.length > 0) {
    return accessibleRoutes[0].path;
  }

  return '/403';
}

function renderRouteElement(route, userPermissions, forbiddenPath) {
  if (!hasPermission(userPermissions, route.permissions)) {
    return <Navigate to={forbiddenPath} replace />;
  }

  const PageComponent = route.component;

  return <PageComponent />;
}

export default function AppRoutes({ mode, onToggleMode, userPermissions = [] }) {
  const routes = React.useMemo(() => buildAutoRoutes(), []);
  const forbiddenPath = routes.find((route) => route.kind === 'forbidden')?.path || '/403';
  const hasNotFoundWildcard = routes.some((route) => route.path === '*' && route.kind === 'not-found');

  const leftMenuRoutes = routes.filter((route) => route.layout === 'left-menu');
  const headerFooterRoutes = routes.filter((route) => route.layout === 'header-footer');
  const blankRoutes = routes.filter((route) => route.layout === 'blank');

  const leftMenuItems = React.useMemo(() => buildLeftMenuTree(routes), [routes]);
  const headerNavItems = dedupeAndSortItems(routes.map((route) => route.headerNav).filter(Boolean));

  const pageTitleMap = routes.reduce((titleMap, route) => {
    titleMap[route.path] = route.title;
    return titleMap;
  }, {});

  const fallbackPath = getSafeFallbackPath(routes, userPermissions);

  return (
    <Routes>
      <Route
        element={
          <LeftMenuLayout
            brandLabel={BRAND_LABEL}
            menuItems={leftMenuItems}
            pageTitleMap={pageTitleMap}
            mode={mode}
            onToggleMode={onToggleMode}
          />
        }
      >
        {leftMenuRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={renderRouteElement(route, userPermissions, forbiddenPath)}
          />
        ))}
      </Route>

      <Route
        element={
          <HeaderFooterLayout
            brandLabel={BRAND_LABEL}
            navItems={headerNavItems}
            pageTitleMap={pageTitleMap}
            mode={mode}
            onToggleMode={onToggleMode}
          />
        }
      >
        {headerFooterRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={renderRouteElement(route, userPermissions, forbiddenPath)}
          />
        ))}
      </Route>

      <Route element={<BlankLayout />}>
        {blankRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={renderRouteElement(route, userPermissions, forbiddenPath)}
          />
        ))}
      </Route>

      {!hasNotFoundWildcard && <Route path="*" element={<Navigate to={fallbackPath} replace />} />}
    </Routes>
  );
}
