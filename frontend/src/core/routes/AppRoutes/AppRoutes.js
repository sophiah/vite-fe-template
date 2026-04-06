import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { APP_CONFIG } from '@root/Config';

import { BlankLayout, HeaderFooterLayout, LAYOUT, LeftMenuLayout } from '@core/layouts';
import { buildAutoRoutes } from '@core/routes/autoRoutes';

const DEFAULT_ROUTE_PERMISSION = Object.freeze({
  public: false,
  auth: true,
  ability: null,
  subject: null
});

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

function hasAbilityPermission(ability, action, subject) {
  if (!ability || !action || !subject) {
    return false;
  }

  return (
    ability.can(action, subject)
    || ability.can('manage', subject)
    || ability.can(action, 'all')
    || ability.can('manage', 'all')
  );
}

function normalizePermissionRule(permissionRule) {
  if (!permissionRule || typeof permissionRule !== 'object') {
    return { ...DEFAULT_ROUTE_PERMISSION };
  }

  const normalizedRule = {
    public: typeof permissionRule.public === 'boolean' ? permissionRule.public : DEFAULT_ROUTE_PERMISSION.public,
    auth: typeof permissionRule.auth === 'boolean' ? permissionRule.auth : DEFAULT_ROUTE_PERMISSION.auth,
    ability: typeof permissionRule.ability === 'string' && permissionRule.ability.trim()
      ? permissionRule.ability.trim()
      : null,
    subject: typeof permissionRule.subject === 'string' && permissionRule.subject.trim()
      ? permissionRule.subject.trim()
      : null
  };

  if (normalizedRule.ability || normalizedRule.subject) {
    normalizedRule.public = false;
    normalizedRule.auth = true;
  }

  return normalizedRule;
}

function canAccessPermissionRule(permissionRule, ability, isLoggedIn) {
  const normalizedRule = normalizePermissionRule(permissionRule);

  if (normalizedRule.public === true) {
    return true;
  }

  if (normalizedRule.auth === true && !isLoggedIn) {
    return false;
  }

  const hasAbilityConstraint = Boolean(normalizedRule.ability || normalizedRule.subject);
  if (hasAbilityConstraint) {
    if (!isLoggedIn) {
      return false;
    }

    if (!normalizedRule.ability || !normalizedRule.subject) {
      return false;
    }

    return hasAbilityPermission(ability, normalizedRule.ability, normalizedRule.subject);
  }

  if (normalizedRule.public === false && normalizedRule.auth !== true) {
    return false;
  }

  return true;
}

function buildPermissionChainByPath(routes = []) {
  const routeByPath = new Map();

  routes.forEach((route) => {
    if (!routeByPath.has(route.path)) {
      routeByPath.set(route.path, route);
    }
  });

  const permissionChainByPath = new Map();

  routes.forEach((route) => {
    const lineagePaths = [...getAncestorPaths(route.path), route.path].filter((path) => routeByPath.has(path));
    const permissionChain = lineagePaths
      .map((path) => normalizePermissionRule(routeByPath.get(path)?.permission));

    permissionChainByPath.set(route.path, permissionChain);
  });

  return permissionChainByPath;
}

function canAccessRoute(route, ability, isLoggedIn, permissionChainByPath) {
  const permissionChain = permissionChainByPath.get(route.path) || [];

  if (!permissionChain.length) {
    return true;
  }

  return permissionChain.every((permissionRule) => canAccessPermissionRule(permissionRule, ability, isLoggedIn));
}

function getSafeFallbackPath(routes = [], ability, isLoggedIn, permissionChainByPath) {
  const accessibleRoutes = routes.filter(
    (route) =>
      route.path !== '*'
      && canAccessRoute(route, ability, isLoggedIn, permissionChainByPath)
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
    isLoggedIn,
    authUser,
    onLogout
  } = layoutContext;

  if (layoutType === LAYOUT.LEFT_MENU) {
    return {
      brandLabel: APP_CONFIG.BRAND_LABEL,
      menuItems: leftMenuItems,
      pageTitleMap,
      mode,
      onToggleMode,
      isLoggedIn,
      authUser,
      onLogout
    };
  }

  if (layoutType === LAYOUT.HEADER_FOOTER) {
    return {
      brandLabel: APP_CONFIG.BRAND_LABEL,
      navItems: headerNavItems,
      pageTitleMap,
      mode,
      onToggleMode,
      isLoggedIn,
      authUser,
      onLogout
    };
  }

  return {};
}

function renderRouteElement(route, ability, isLoggedIn, forbiddenPath, layoutContext, permissionChainByPath) {
  if (!canAccessRoute(route, ability, isLoggedIn, permissionChainByPath)) {
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

export default function AppRoutes({ mode, onToggleMode, ability, isLoggedIn, authUser, onLogout }) {
  const routes = React.useMemo(() => buildAutoRoutes(), []);
  const permissionChainByPath = React.useMemo(() => buildPermissionChainByPath(routes), [routes]);
  const forbiddenPath = routes.find((route) => route.kind === 'forbidden')?.path || '/403';
  const hasNotFoundWildcard = routes.some((route) => route.path === '*' && route.kind === 'not-found');
  const accessibleRoutes = React.useMemo(
    () => routes.filter((route) => canAccessRoute(route, ability, isLoggedIn, permissionChainByPath)),
    [routes, ability, isLoggedIn, permissionChainByPath]
  );

  const leftMenuItems = React.useMemo(() => buildLeftMenuTree(accessibleRoutes), [accessibleRoutes]);
  const headerNavItems = React.useMemo(
    () => dedupeAndSortItems(accessibleRoutes.map((route) => route.headerNav).filter(Boolean)),
    [accessibleRoutes]
  );
  const pageTitleMap = React.useMemo(
    () => accessibleRoutes.reduce((titleMap, route) => {
      titleMap[route.path] = route.title;
      return titleMap;
    }, {}),
    [accessibleRoutes]
  );

  const fallbackPath = getSafeFallbackPath(routes, ability, isLoggedIn, permissionChainByPath);
  const layoutContext = {
    leftMenuItems,
    headerNavItems,
    pageTitleMap,
    mode,
    onToggleMode,
    isLoggedIn,
    authUser,
    onLogout
  };

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={`${route.path}:${route.kind || 'page'}`}
          path={route.path}
          element={renderRouteElement(route, ability, isLoggedIn, forbiddenPath, layoutContext, permissionChainByPath)}
        />
      ))}

      {!hasNotFoundWildcard && <Route path="*" element={<Navigate to={fallbackPath} replace />} />}
    </Routes>
  );
}
