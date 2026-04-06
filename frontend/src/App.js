import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';

import { readAuthState } from '@core/auth';
import AppRoutes from '@core/routes/AppRoutes';
import { createAppTheme } from '@core/theme/createAppTheme';

export default function App() {
  const [mode, setMode] = React.useState('light');
  const authState = React.useMemo(() => readAuthState(), []);
  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  const handleToggleMode = () => {
    setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes
        mode={mode}
        onToggleMode={handleToggleMode}
        ability={authState.ability}
        isLoggedIn={authState.isLoggedIn}
      />
    </ThemeProvider>
  );
}
