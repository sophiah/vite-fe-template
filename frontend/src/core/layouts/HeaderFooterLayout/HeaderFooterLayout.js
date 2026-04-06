import Box from '@mui/material/Box';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { Footer, HeaderNav } from '@core/components';

export default function HeaderFooterLayout({
  isLoggedIn,
  mode,
  onToggleMode,
  children
}) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderNav isLoggedIn={isLoggedIn} mode={mode} onToggleMode={onToggleMode} sticky />
      <Box component="main" sx={{ px: { xs: 2, md: 5 }, py: { xs: 2, md: 3 }, flexGrow: 1 }}>
        {children || <Outlet />}
      </Box>
      <Footer />
    </Box>
  );
}
