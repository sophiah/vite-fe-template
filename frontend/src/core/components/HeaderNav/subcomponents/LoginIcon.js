import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import React from 'react';

import { APP_CONFIG } from '@root/Config';

export default function LoginIcon({
  isLoggedIn = false,
  userAvatarSrc = APP_CONFIG.USER_AVATAR_SRC,
  userAvatarAlt = APP_CONFIG.USER_AVATAR_ALT,
  onClick
}) {
  return (
    <IconButton
      aria-label={isLoggedIn ? 'user avatar' : 'guest user icon'}
      onClick={onClick}
      sx={{ p: 0.5 }}
    >
      {isLoggedIn ? (
        <Avatar
          src={userAvatarSrc}
          alt={userAvatarAlt}
          sx={{
            width: 34,
            height: 34,
            border: (theme) => `1px solid ${theme.palette.divider}`
          }}
        >
          {(userAvatarAlt || 'U').charAt(0).toUpperCase()}
        </Avatar>
      ) : (
        <Box
          component="i"
          className={APP_CONFIG.HEADER_GUEST_ICON_CLASS}
          sx={{
            fontSize: 28,
            lineHeight: 1,
            color: 'text.secondary',
            display: 'inline-flex',
            fontStyle: 'normal'
          }}
        />
      )}
    </IconButton>
  );
}
