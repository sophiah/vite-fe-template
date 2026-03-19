import Box from '@mui/material/Box';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { CHeaderNav, CLeftMenu } from '@core/components';

const DEFAULT_DRAWER_WIDTH = 272;
const DEFAULT_COLLAPSED_WIDTH = 88;

export default function LeftMenuLayout({
  brandLabel,
  menuItems,
  pageTitleMap,
  mode,
  onToggleMode,
  drawerWidth = DEFAULT_DRAWER_WIDTH,
  collapsedWidth = DEFAULT_COLLAPSED_WIDTH
}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = React.useState(true);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', backgroundColor: 'background.default' }}>
      <CLeftMenu
        brandLabel={brandLabel}
        items={menuItems}
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
        desktopOpen={desktopMenuOpen}
        onToggleDesktop={() => setDesktopMenuOpen((open) => !open)}
        mobileOpen={mobileMenuOpen}
        onOpenMobile={() => setMobileMenuOpen(true)}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <Box
        sx={{
          minWidth: 0,
          flexGrow: 1,
          transition: (currentTheme) =>
            currentTheme.transitions.create(['margin', 'width'], {
              easing: currentTheme.transitions.easing.sharp,
              duration: currentTheme.transitions.duration.shorter
            })
        }}
      >
        <CHeaderNav
          brandLabel={brandLabel}
          pageTitle={pageTitleMap[location.pathname]}
          mode={mode}
          onToggleMode={onToggleMode}
          sticky
        />

        <Box component="main" sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
