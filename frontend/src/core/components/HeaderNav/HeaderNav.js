import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import React from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import GoogleIcon from '@mui/icons-material/Google';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';

import { APP_CONFIG } from '@root/Config';
import LoginIcon from './subcomponents/LoginIcon';

export default function HeaderNav({
  isLoggedIn = false,
  userAvatarSrc = APP_CONFIG.USER_AVATAR_SRC,
  userAvatarAlt = APP_CONFIG.USER_AVATAR_ALT,
  mode = 'light',
  onToggleMode = () => {},
  sticky = true
}) {
  const [rightMenuOpen, setRightMenuOpen] = React.useState(false);

  const handleToggleMenu = () => {
    setRightMenuOpen((open) => !open);
  };

  const handleCloseMenu = () => {
    setRightMenuOpen(false);
  };

  return (
    <>
      <AppBar
        position={sticky ? 'sticky' : 'static'}
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          px: { xs: 1, md: 2 },
          backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.72),
          border: 0,
          borderLeft: 0,
          borderBottom: 0,
          boxShadow: 'none',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 48, sm: 52 }, justifyContent: 'flex-end' }}>
          <LoginIcon
            isLoggedIn={isLoggedIn}
            userAvatarSrc={userAvatarSrc}
            userAvatarAlt={userAvatarAlt}
            onClick={handleToggleMenu}
          />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="right"
        open={rightMenuOpen}
        PaperProps={{
          sx: {
            width: { xs: 312, sm: 360 },
            maxWidth: '100vw',
            zIndex: (theme) => theme.zIndex.drawer + 2,
            borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
            top: { xs: 48, sm: 52 },
            height: { xs: 'calc(100% - 48px)', sm: 'calc(100% - 52px)' }
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <IconButton aria-label="close menu" onClick={handleCloseMenu}>
              <CloseRoundedIcon />
            </IconButton>

            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton aria-label="toggle css mode" onClick={onToggleMode}>
                {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
              </IconButton>
            </Tooltip>
          </Stack>

          {isLoggedIn ? (
            <>
              <Stack alignItems="center" spacing={1.25} sx={{ pt: 2, pb: 2.5 }}>
                <Avatar
                  src={userAvatarSrc}
                  alt={userAvatarAlt}
                  sx={{
                    width: 88,
                    height: 88,
                    border: (theme) => `2px solid ${theme.palette.success.main}`
                  }}
                >
                  {(userAvatarAlt || 'U').charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {APP_CONFIG.USER_DISPLAY_NAME}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {APP_CONFIG.USER_EMAIL}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 1.25 }} />

              <List disablePadding>
                <ListItemButton sx={{ borderRadius: 2, mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <HomeRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton sx={{ borderRadius: 2, mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton sx={{ borderRadius: 2, mb: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <WorkRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Projects" />
                </ListItemButton>
                <ListItemButton sx={{ borderRadius: 2, mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <SettingsRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </List>

              <Button
                fullWidth
                color="error"
                variant="outlined"
                startIcon={<LogoutRoundedIcon />}
                sx={{ borderRadius: 2.5, mt: 1 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Stack spacing={1.25} sx={{ pt: 2, pb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Welcome
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue with your account.
              </Typography>
              <Button fullWidth variant="contained" startIcon={<GoogleIcon />} sx={{ mt: 1 }}>
                Login
              </Button>
              <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
                Signup
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </>
  );
}
