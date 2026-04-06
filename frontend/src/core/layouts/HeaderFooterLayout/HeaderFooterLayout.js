import Box from '@mui/material/Box';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Footer, HeaderNav } from '@core/components';

export default function HeaderFooterLayout({ brandLabel, navItems, pageTitleMap, mode, onToggleMode }) {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderNav
        brandLabel={brandLabel}
        navItems={navItems}
        pageTitle={pageTitleMap[location.pathname]}
        mode={mode}
        onToggleMode={onToggleMode}
        sticky
      />
      <Box component="main" sx={{ px: { xs: 2, md: 5 }, py: { xs: 2, md: 3 }, flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
