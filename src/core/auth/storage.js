export const AUTH_STORAGE_KEYS = {
  loggedIn: 'app.auth.loggedIn',
  permissions: 'app.auth.permissions',
  legacyPermissions: 'app.permissions'
};

function isBrowser() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function hasStorageKey(key) {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(key) !== null;
}

export function readJSONFromStorage(key, fallbackValue) {
  if (!isBrowser()) {
    return fallbackValue;
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

export function writeJSONToStorage(key, value) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readBooleanFromStorage(key, fallbackValue = false) {
  if (!isBrowser()) {
    return fallbackValue;
  }

  const rawValue = window.localStorage.getItem(key);

  if (rawValue === null) {
    return fallbackValue;
  }

  if (rawValue === 'true') {
    return true;
  }

  if (rawValue === 'false') {
    return false;
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return typeof parsedValue === 'boolean' ? parsedValue : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export function writeBooleanToStorage(key, value) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, value ? 'true' : 'false');
}
