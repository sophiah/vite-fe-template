import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { isRouteActive } from './subcomponents/navUtils';

export default function CHeaderNav({
  brandLabel = 'React MUI Kit',
  pageTitle,
  navItems = [],
  ctaLabel = 'Log In',
  mode,
  onToggleMode,
  sticky = true
}) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppBar
      position={sticky ? 'sticky' : 'static'}
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        px: { xs: 1, md: 2 }
      }}
    >
      <Toolbar sx={{ minHeight: 70, gap: 1 }}>
        <Typography variant="h5" sx={{ mr: { xs: 0.5, md: 2 }, whiteSpace: 'nowrap' }}>
          {brandLabel}
        </Typography>

        {pageTitle && (
          <Typography
            variant="h6"
            sx={{
              ml: { xs: 0, md: 1 },
              display: { xs: 'none', sm: 'block' },
              color: 'text.secondary'
            }}
          >
            {pageTitle}
          </Typography>
        )}

        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: { xs: 'none', md: 'flex' }
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                px: 1.5,
                color: isRouteActive(location.pathname, item.path) ? 'primary.main' : 'text.primary',
                fontWeight: isRouteActive(location.pathname, item.path) ? 700 : 500
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton aria-label="toggle mode" onClick={onToggleMode}>
            {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>
        </Tooltip>

        <IconButton aria-label="notifications">
          <Badge color="primary" variant="dot">
            <NotificationsNoneRoundedIcon />
          </Badge>
        </IconButton>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button variant="contained" disableElevation>
            {ctaLabel}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
