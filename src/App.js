import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';

import AppRoutes from '@core/routes/AppRoutes';
import { createAppTheme } from '@core/theme/createAppTheme';

function readUserPermissions() {
  if (typeof window === 'undefined') {
    return ['*'];
  }

  const rawPermissions = window.localStorage.getItem('app.permissions');

  if (!rawPermissions) {
    return ['*'];
  }

  try {
    const parsedPermissions = JSON.parse(rawPermissions);

    if (Array.isArray(parsedPermissions)) {
      return parsedPermissions;
    }
  } catch {
    // Ignore malformed localStorage value and fallback to wildcard.
  }

  return ['*'];
}

export default function App() {
  const [mode, setMode] = React.useState('light');
  const [userPermissions] = React.useState(() => readUserPermissions());
  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  const handleToggleMode = () => {
    setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes mode={mode} onToggleMode={handleToggleMode} userPermissions={userPermissions} />
    </ThemeProvider>
  );
}
