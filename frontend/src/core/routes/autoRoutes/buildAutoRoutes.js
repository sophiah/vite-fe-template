const PAGE_MODULES = import.meta.glob('/src/pages/**/index.{js,jsx}', { eager: true });

const DEFAULT_LAYOUT = 'left-menu';
const DEFAULT_ROUTE_ORDER = 1000;

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function normalizeRouteSegment(segment) {
  if (segment.startsWith('_')) {
    return '';
  }

  return toKebabCase(segment);
}

function isRootPagesIndex(filePath) {
  return /^\/src\/pages\/index\.(js|jsx)$/.test(filePath);
}

function getFolderPathFromFilePath(filePath) {
  return filePath
    .replace(/^\/src\/pages\//, '')
    .replace(/\/index\.(js|jsx)$/, '');
}

function normalizePathFromFolderPath(folderPath) {
  if (!folderPath) {
    return '/';
  }

  const segments = folderPath
    .split('/')
    .filter(Boolean)
    .map(normalizeRouteSegment)
    .filter(Boolean);

  if (!segments.length) {
    return '/';
  }

  return `/${segments.join('/')}`;
}

function normalizePath(value, fallbackPath) {
  if (typeof value !== 'string' || !value.trim()) {
    return fallbackPath;
  }

  const trimmedPath = value.trim();

  if (trimmedPath === '*' || trimmedPath === '/*') {
    return '*';
  }

  if (trimmedPath === '/') {
    return '/';
  }

  const withLeadingSlash = trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;

  return withLeadingSlash.replace(/\/+$/, '');
}

function normalizeAliases(routeMeta = {}) {
  const rawAliases = routeMeta.aliases ?? routeMeta.alias;

  if (!rawAliases) {
    return [];
  }

  const aliasList = Array.isArray(rawAliases) ? rawAliases : [rawAliases];

  return aliasList
    .filter((value) => typeof value === 'string' && value.trim())
    .map((value) => normalizePath(value, ''))
    .filter(Boolean);
}

function inferPermissionsFromPath(pathname) {
  if (pathname === '*' || pathname === '/') {
    return [];
  }

  const normalizedPath = pathname.replace(/^\/+|\/+$/g, '');

  if (!normalizedPath) {
    return [];
  }

  const firstSegment = normalizedPath.split('/')[0];
  const resource = firstSegment
    .replace(/[^a-zA-Z0-9-]/g, '')
    .trim();

  if (!resource) {
    return [];
  }

  return [`${resource}:read`];
}

function readExplicitPermissions(meta = {}) {
  const rawPermissions = meta.permissions ?? meta.permission;

  if (rawPermissions === undefined) {
    return null;
  }

  if (rawPermissions === false || rawPermissions === null) {
    return false;
  }

  if (Array.isArray(rawPermissions)) {
    return rawPermissions.filter(Boolean);
  }

  if (typeof rawPermissions === 'string' && rawPermissions.trim()) {
    return [rawPermissions.trim()];
  }

  return [];
}

function dedupeList(values = []) {
  return [...new Set(values)];
}

function getAncestorFolderPaths(folderPath) {
  const segments = folderPath.split('/').filter(Boolean);
  const ancestors = [];

  for (let index = 1; index < segments.length; index += 1) {
    ancestors.push(segments.slice(0, index).join('/'));
  }

  return ancestors;
}

function getAncestorMetas(folderPath, metaByFolder) {
  return getAncestorFolderPaths(folderPath)
    .map((path) => metaByFolder.get(path))
    .filter(Boolean);
}

function getNearestAncestorValue(ancestorMetas, getter) {
  for (let index = ancestorMetas.length - 1; index >= 0; index -= 1) {
    const value = getter(ancestorMetas[index]);

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function normalizeLeftMenuConfig(leftMenuConfig) {
  if (leftMenuConfig === undefined) {
    return null;
  }

  if (leftMenuConfig === false) {
    return false;
  }

  if (typeof leftMenuConfig === 'string') {
    return { label: leftMenuConfig };
  }

  if (leftMenuConfig && typeof leftMenuConfig === 'object') {
    return leftMenuConfig;
  }

  return {};
}

function resolvePermissions(pathname, routeMeta, ancestorMetas) {
  let inheritedPermissions = [];

  ancestorMetas.forEach((ancestorMeta) => {
    const ancestorPermissions = readExplicitPermissions(ancestorMeta);

    if (ancestorPermissions === null) {
      return;
    }

    if (ancestorPermissions === false) {
      inheritedPermissions = [];
      return;
    }

    inheritedPermissions = dedupeList([...inheritedPermissions, ...ancestorPermissions]);
  });

  const ownPermissions = readExplicitPermissions(routeMeta);

  if (ownPermissions === false) {
    return [];
  }

  if (Array.isArray(ownPermissions)) {
    return dedupeList([...inheritedPermissions, ...ownPermissions]);
  }

  if (inheritedPermissions.length) {
    return inheritedPermissions;
  }

  return inferPermissionsFromPath(pathname);
}

function resolveLeftMenu(route, routeMeta, ancestorMetas) {
  if (route.layout !== 'left-menu') {
    return null;
  }

  const ownLeftMenu = normalizeLeftMenuConfig(routeMeta.leftMenu);

  if (ownLeftMenu === false) {
    return null;
  }

  const inheritedLeftMenu = normalizeLeftMenuConfig(
    getNearestAncestorValue(ancestorMetas, (meta) => meta.leftMenu)
  );

  return {
    label: ownLeftMenu?.label || route.title,
    path: ownLeftMenu?.path || route.path,
    icon: ownLeftMenu?.icon || inheritedLeftMenu?.icon,
    order: ownLeftMenu?.order ?? route.order
  };
}

function normalizeHeaderNav(headerNavConfig, route) {
  if (headerNavConfig === false) {
    return null;
  }

  if (typeof headerNavConfig === 'string') {
    return {
      label: headerNavConfig,
      path: route.path,
      order: route.order
    };
  }

  if (headerNavConfig && typeof headerNavConfig === 'object') {
    return {
      label: headerNavConfig.label || route.title,
      path: headerNavConfig.path || route.path,
      order: headerNavConfig.order ?? route.order
    };
  }

  if (route.layout === 'header-footer') {
    return {
      label: route.title,
      path: route.path,
      order: route.order
    };
  }

  return null;
}

function createTitleFromPath(pathname) {
  if (pathname === '/') {
    return 'Home';
  }

  if (pathname === '*') {
    return 'Not Found';
  }

  const lastSegment = pathname.split('/').filter(Boolean).pop() || '';

  return lastSegment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function expandAliases(route, aliases) {
  if (!aliases.length) {
    return [route];
  }

  const aliasRoutes = aliases.map((aliasPath) => ({
    ...route,
    path: aliasPath,
    leftMenu: null,
    headerNav: null
  }));

  return [route, ...aliasRoutes];
}

export function buildAutoRoutes() {
  const pageEntries = Object.entries(PAGE_MODULES)
    .filter(([filePath]) => !isRootPagesIndex(filePath))
    .map(([filePath, moduleContent]) => ({
      filePath,
      moduleContent,
      routeMeta: moduleContent.routeMeta || {},
      folderPath: getFolderPathFromFilePath(filePath)
    }));

  const metaByFolder = new Map(
    pageEntries.map((entry) => [entry.folderPath, entry.routeMeta])
  );

  const routes = pageEntries.flatMap((entry) => {
    const { moduleContent, routeMeta, folderPath } = entry;
    const PageComponent = moduleContent.default;

    if (!PageComponent || routeMeta.disableRoute === true || routeMeta.route === false) {
      return [];
    }

    const ancestorMetas = getAncestorMetas(folderPath, metaByFolder);
    const autoPath = normalizePathFromFolderPath(folderPath);
    const path = normalizePath(routeMeta.path, autoPath);
    const inheritedLayout = getNearestAncestorValue(ancestorMetas, (meta) => meta.layout);
    const inheritedOrder = getNearestAncestorValue(ancestorMetas, (meta) => {
      if (typeof meta.order === 'number') {
        return meta.order;
      }

      return undefined;
    });

    const order = typeof routeMeta.order === 'number'
      ? routeMeta.order
      : (inheritedOrder ?? DEFAULT_ROUTE_ORDER);

    const route = {
      path,
      layout: routeMeta.layout || inheritedLayout || DEFAULT_LAYOUT,
      order,
      kind: routeMeta.kind,
      title: routeMeta.title || createTitleFromPath(path),
      permissions: resolvePermissions(path, routeMeta, ancestorMetas),
      component: PageComponent
    };

    const normalizedRoute = {
      ...route,
      leftMenu: resolveLeftMenu(route, routeMeta, ancestorMetas),
      headerNav: normalizeHeaderNav(routeMeta.headerNav, route)
    };

    return expandAliases(normalizedRoute, normalizeAliases(routeMeta));
  });

  const routeByPath = new Map();

  routes.forEach((route) => {
    if (!routeByPath.has(route.path)) {
      routeByPath.set(route.path, route);
    }
  });

  return [...routeByPath.values()].sort((a, b) => {
    if (a.path === '*') {
      return 1;
    }

    if (b.path === '*') {
      return -1;
    }

    if (a.order === b.order) {
      return a.path.localeCompare(b.path);
    }

    return a.order - b.order;
  });
}
