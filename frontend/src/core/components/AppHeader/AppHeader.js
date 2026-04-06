import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';

import { getModeSwitchTooltip } from './subcomponents/headerActions';

export default function AppHeader({ pageTitle, mode, onToggleMode, onToggleMenu }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        px: { xs: 1, md: 2 }
      }}
    >
      <Toolbar sx={{ minHeight: 70 }}>
        <Tooltip title="Open menu">
          <IconButton
            aria-label="open menu"
            onClick={onToggleMenu}
            edge="start"
            sx={{ mr: 1, display: { md: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Tooltip>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {pageTitle}
        </Typography>

        <Tooltip title={getModeSwitchTooltip(mode)}>
          <IconButton aria-label="toggle mode" onClick={onToggleMode}>
            {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>
        </Tooltip>

        <IconButton aria-label="notifications">
          <Badge color="primary" variant="dot">
            <NotificationsNoneRoundedIcon />
          </Badge>
        </IconButton>

        <Avatar sx={{ width: 34, height: 34, ml: 1 }}>A</Avatar>
      </Toolbar>
    </AppBar>
  );
}
