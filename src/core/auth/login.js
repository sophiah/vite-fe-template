import {
  AUTH_STORAGE_KEYS,
  hasStorageKey,
  readBooleanFromStorage,
  readJSONFromStorage,
  writeBooleanToStorage,
  writeJSONToStorage
} from './storage';

const DEFAULT_LOGIN_STATE = true;
const DEFAULT_PERMISSIONS = ['*'];

function normalizePermissions(permissions) {
  if (!Array.isArray(permissions)) {
    return [];
  }

  return [...new Set(permissions.filter((permission) => typeof permission === 'string' && permission.trim()))];
}

export function getStoredPermissions() {
  const scopedPermissions = readJSONFromStorage(AUTH_STORAGE_KEYS.permissions, null);

  if (Array.isArray(scopedPermissions)) {
    return normalizePermissions(scopedPermissions);
  }

  const legacyPermissions = readJSONFromStorage(AUTH_STORAGE_KEYS.legacyPermissions, null);

  if (Array.isArray(legacyPermissions)) {
    return normalizePermissions(legacyPermissions);
  }

  return DEFAULT_PERMISSIONS;
}

export function setStoredPermissions(permissions) {
  const normalizedPermissions = normalizePermissions(permissions);
  const nextPermissions = normalizedPermissions.length ? normalizedPermissions : DEFAULT_PERMISSIONS;

  writeJSONToStorage(AUTH_STORAGE_KEYS.permissions, nextPermissions);
  writeJSONToStorage(AUTH_STORAGE_KEYS.legacyPermissions, nextPermissions);

  return nextPermissions;
}

export function isLoggedIn() {
  return readBooleanFromStorage(AUTH_STORAGE_KEYS.loggedIn, DEFAULT_LOGIN_STATE);
}

export function setLoggedIn(loggedIn) {
  writeBooleanToStorage(AUTH_STORAGE_KEYS.loggedIn, Boolean(loggedIn));
}

export function initializeMockAuth() {
  if (!hasStorageKey(AUTH_STORAGE_KEYS.loggedIn)) {
    writeBooleanToStorage(AUTH_STORAGE_KEYS.loggedIn, DEFAULT_LOGIN_STATE);
  }

  if (!hasStorageKey(AUTH_STORAGE_KEYS.permissions) && !hasStorageKey(AUTH_STORAGE_KEYS.legacyPermissions)) {
    setStoredPermissions(DEFAULT_PERMISSIONS);
  }
}

export function login(nextPermissions = DEFAULT_PERMISSIONS) {
  setLoggedIn(true);
  return setStoredPermissions(nextPermissions);
}

export function logout() {
  setLoggedIn(false);
}
