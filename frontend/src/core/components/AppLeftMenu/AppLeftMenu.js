import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getMenuItemSx } from './subcomponents/menuStyle';

const DRAWER_STYLES = (drawerWidth) => ({
  width: drawerWidth,
  boxSizing: 'border-box'
});

function DrawerContent({ brandLabel, items, onNavigate, pathname }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="h5">{brandLabel}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          React + MUI quick-start template
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 1.5 }}>
        {items.map((item) => {
          const isActive = pathname === item.path;
          const MenuIcon = item.icon;

          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton sx={getMenuItemSx(isActive)} onClick={() => onNavigate(item.path)}>
                <ListItemIcon>
                  <MenuIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ mt: 'auto', p: 2, color: 'text.secondary' }}>
        <Typography variant="caption">Template base for new projects</Typography>
      </Box>
    </Box>
  );
}

export default function AppLeftMenu({
  brandLabel,
  items,
  drawerWidth,
  mobileOpen,
  onCloseMobile
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onCloseMobile();
  };

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': DRAWER_STYLES(drawerWidth)
        }}
      >
        <DrawerContent
          brandLabel={brandLabel}
          items={items}
          onNavigate={handleNavigate}
          pathname={location.pathname}
        />
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': DRAWER_STYLES(drawerWidth)
        }}
      >
        <DrawerContent
          brandLabel={brandLabel}
          items={items}
          onNavigate={handleNavigate}
          pathname={location.pathname}
        />
      </Drawer>
    </Box>
  );
}
