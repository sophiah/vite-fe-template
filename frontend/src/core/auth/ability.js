import { AbilityBuilder, createMongoAbility } from '@casl/ability';

import { getStoredPermissions, initializeMockAuth, isLoggedIn } from './login';

function parsePermission(permission) {
  if (typeof permission !== 'string' || !permission.trim()) {
    return null;
  }

  const normalizedPermission = permission.trim();

  if (normalizedPermission === '*') {
    return { action: 'manage', subject: 'all' };
  }

  const segments = normalizedPermission.split(':').filter(Boolean);

  if (!segments.length) {
    return null;
  }

  const resource = segments[0];
  const actionToken = segments.length > 1 ? segments[segments.length - 1] : 'read';
  const action = actionToken === '*' ? 'manage' : actionToken;

  if (resource === '*') {
    return { action: 'manage', subject: 'all' };
  }

  return {
    action,
    subject: resource
  };
}

export function buildAbilityFromPermissions(permissions = []) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  permissions.forEach((permission) => {
    const parsedPermission = parsePermission(permission);

    if (!parsedPermission) {
      return;
    }

    can(parsedPermission.action, parsedPermission.subject);
  });

  return build();
}

export function canByPermission(ability, requiredPermission) {
  const parsedPermission = parsePermission(requiredPermission);

  if (!parsedPermission) {
    return true;
  }

  if (!ability) {
    return false;
  }

  return (
    ability.can(parsedPermission.action, parsedPermission.subject)
    || ability.can('manage', parsedPermission.subject)
    || ability.can(parsedPermission.action, 'all')
    || ability.can('manage', 'all')
  );
}

export function canAccessRoute({ ability, isLoggedIn: loggedIn, requiredPermissions = [] }) {
  if (!requiredPermissions.length) {
    return true;
  }

  if (!loggedIn) {
    return false;
  }

  return requiredPermissions.every((permission) => canByPermission(ability, permission));
}

export function readAuthState() {
  initializeMockAuth();

  const loggedIn = isLoggedIn();
  const permissions = getStoredPermissions();
  const ability = buildAbilityFromPermissions(permissions);

  return {
    isLoggedIn: loggedIn,
    permissions,
    ability
  };
}
