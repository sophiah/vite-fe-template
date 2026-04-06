import Box from '@mui/material/Box';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { HeaderNav, LeftMenu } from '@core/components';

const DEFAULT_DRAWER_WIDTH = 272;
const DEFAULT_COLLAPSED_WIDTH = 88;

export default function LeftMenuLayout({
  brandLabel,
  menuItems,
  isLoggedIn,
  mode,
  onToggleMode,
  drawerWidth = DEFAULT_DRAWER_WIDTH,
  collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
  children
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = React.useState(true);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', backgroundColor: 'background.default' }}>
      <LeftMenu
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
        <HeaderNav
          isLoggedIn={isLoggedIn}
          mode={mode}
          onToggleMode={onToggleMode}
          sticky
        />

        <Box component="main" sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
}
