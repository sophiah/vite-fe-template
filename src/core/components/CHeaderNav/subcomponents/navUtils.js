export const isRouteActive = (pathname, targetPath) => {
  if (targetPath === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(targetPath);
};
