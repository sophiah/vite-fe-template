import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';

import { APP_CONFIG } from '@root/Config';

import { logout as clearLocalAuth, readAuthState, setLoggedIn } from '@core/auth';
import AppRoutes from '@core/routes/AppRoutes';
import { createAppTheme } from '@core/theme/createAppTheme';

export default function App() {
  const [mode, setMode] = React.useState('light');
  const [authState, setAuthState] = React.useState(() => readAuthState());
  const [authUser, setAuthUser] = React.useState(null);
  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  const handleToggleMode = () => {
    setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
  };

  const refreshAuthState = React.useCallback(() => {
    setAuthState(readAuthState());
  }, []);

  const applyLoggedOutState = React.useCallback(() => {
    setLoggedIn(false);
    setAuthUser(null);
    refreshAuthState();
  }, [refreshAuthState]);

  const applySessionPayload = React.useCallback(
    (payload) => {
      const loggedIn = Boolean(payload?.loggedIn);
      setLoggedIn(loggedIn);

      if (loggedIn) {
        const resolvedUser = payload?.user || {
          email: payload?.email || null,
          provider: payload?.provider || null,
          displayName: payload?.displayName || null,
          avatarUrl: payload?.avatarUrl || null
        };
        setAuthUser(resolvedUser);
      } else {
        setAuthUser(null);
      }

      refreshAuthState();
    },
    [refreshAuthState]
  );

  const syncAuthSession = React.useCallback(async () => {
    try {
      const sessionResponse = await fetch(APP_CONFIG.SSO_SESSION_PATH, {
        method: 'GET',
        credentials: 'include'
      });

      if (!sessionResponse.ok) {
        throw new Error('session request failed');
      }

      const sessionPayload = await sessionResponse.json();
      if (sessionPayload?.loggedIn) {
        applySessionPayload(sessionPayload);
        return;
      }

      if (!sessionPayload?.canRefresh) {
        applyLoggedOutState();
        return;
      }

      const refreshResponse = await fetch(APP_CONFIG.SSO_REFRESH_PATH, {
        method: 'POST',
        credentials: 'include'
      });

      if (!refreshResponse.ok) {
        applyLoggedOutState();
        return;
      }

      const refreshPayload = await refreshResponse.json();
      applySessionPayload(refreshPayload);
    } catch {
      applyLoggedOutState();
    }
  }, [applyLoggedOutState, applySessionPayload]);

  React.useEffect(() => {
    syncAuthSession();
  }, [syncAuthSession]);

  const handleLogout = React.useCallback(async () => {
    try {
      await fetch(APP_CONFIG.SSO_LOGOUT_PATH, {
        method: 'POST',
        credentials: 'include'
      });
    } catch {
      // Intentionally ignore network errors and still clear local state.
    } finally {
      clearLocalAuth();
      setAuthUser(null);
      refreshAuthState();
    }
  }, [refreshAuthState]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes
        mode={mode}
        onToggleMode={handleToggleMode}
        ability={authState.ability}
        isLoggedIn={authState.isLoggedIn}
        authUser={authUser}
        onLogout={handleLogout}
      />
    </ThemeProvider>
  );
}
