import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { APP_CONFIG } from '@root/Config';
import { canAccessRoute } from '@core/auth';
import { BlankLayout, HeaderFooterLayout, LAYOUT, LeftMenuLayout } from '@core/layouts';
import { buildAutoRoutes } from '@core/routes/autoRoutes';

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
    .filter((route) => route.layout === LAYOUT.LEFT_MENU && route.leftMenu)
    .map((route) => route.leftMenu);

  const sortedMenuItems = dedupeAndSortItems(menuRoutes);
  const nodeByPath = new Map();

  sortedMenuItems.forEach((item) => {
    nodeByPath.set(item.path, {
      key: item.path,
      path: item.path,
      label: item.label,
      icon: item.icon,
      order: item.order,
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
        label: toTitleCasePathSegment(ancestorSegment),
        icon: null,
        order: Number.MAX_SAFE_INTEGER,
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

function getSafeFallbackPath(routes = [], ability, isLoggedIn) {
  const accessibleRoutes = routes.filter(
    (route) =>
      route.path !== '*'
      && canAccessRoute({
        ability,
        isLoggedIn,
        requiredPermissions: route.permissions
      })
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

const LAYOUT_COMPONENT_BY_TYPE = {
  [LAYOUT.LEFT_MENU]: LeftMenuLayout,
  [LAYOUT.HEADER_FOOTER]: HeaderFooterLayout,
  [LAYOUT.BLANK]: BlankLayout
};

function getLayoutComponent(layoutType) {
  return LAYOUT_COMPONENT_BY_TYPE[layoutType] || LeftMenuLayout;
}

function getLayoutProps(layoutType, layoutContext) {
  const {
    leftMenuItems,
    headerNavItems,
    pageTitleMap,
    mode,
    onToggleMode,
    isLoggedIn
  } = layoutContext;

  if (layoutType === LAYOUT.LEFT_MENU) {
    return {
      brandLabel: APP_CONFIG.BRAND_LABEL,
      menuItems: leftMenuItems,
      pageTitleMap,
      mode,
      onToggleMode,
      isLoggedIn
    };
  }

  if (layoutType === LAYOUT.HEADER_FOOTER) {
    return {
      brandLabel: APP_CONFIG.BRAND_LABEL,
      navItems: headerNavItems,
      pageTitleMap,
      mode,
      onToggleMode,
      isLoggedIn
    };
  }

  return {};
}

function renderRouteElement(route, ability, isLoggedIn, forbiddenPath, layoutContext) {
  if (
    !canAccessRoute({
      ability,
      isLoggedIn,
      requiredPermissions: route.permissions
    })
  ) {
    return <Navigate to={forbiddenPath} replace />;
  }

  const LayoutComponent = getLayoutComponent(route.layout);
  const PageComponent = route.component;

  return (
    <LayoutComponent {...getLayoutProps(route.layout, layoutContext)}>
      <PageComponent />
    </LayoutComponent>
  );
}

export default function AppRoutes({ mode, onToggleMode, ability, isLoggedIn }) {
  const routes = React.useMemo(() => buildAutoRoutes(), []);
  const forbiddenPath = routes.find((route) => route.kind === 'forbidden')?.path || '/403';
  const hasNotFoundWildcard = routes.some((route) => route.path === '*' && route.kind === 'not-found');

  const leftMenuItems = React.useMemo(() => buildLeftMenuTree(routes), [routes]);
  const headerNavItems = React.useMemo(
    () => dedupeAndSortItems(routes.map((route) => route.headerNav).filter(Boolean)),
    [routes]
  );
  const pageTitleMap = React.useMemo(
    () => routes.reduce((titleMap, route) => {
      titleMap[route.path] = route.title;
      return titleMap;
    }, {}),
    [routes]
  );

  const fallbackPath = getSafeFallbackPath(routes, ability, isLoggedIn);
  const layoutContext = {
    leftMenuItems,
    headerNavItems,
    pageTitleMap,
    mode,
    onToggleMode,
    isLoggedIn
  };

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={`${route.path}:${route.kind || 'page'}`}
          path={route.path}
          element={renderRouteElement(route, ability, isLoggedIn, forbiddenPath, layoutContext)}
        />
      ))}

      {!hasNotFoundWildcard && <Route path="*" element={<Navigate to={fallbackPath} replace />} />}
    </Routes>
  );
}
