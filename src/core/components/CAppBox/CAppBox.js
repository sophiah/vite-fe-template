import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';

import { darkModeColorCode } from '@core/darkModeColorCode';
import { defaultColorCode } from '@core/defaultColorCode';

import { getCAppBoxSx } from './subcomponents/boxStyle';

export default function CAppBox({ title, subtitle, gradient = false, actions, children }) {
  const theme = useTheme();
  const colorCode = theme.palette.mode === 'dark' ? darkModeColorCode : defaultColorCode;

  return (
    <Paper
      sx={{
        ...getCAppBoxSx(gradient),
        '--capp-hero-start': colorCode.heroGradientStart,
        '--capp-hero-end': colorCode.heroGradientEnd
      }}
    >
      {(title || subtitle || actions) && (
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box>
            {title && <Typography variant="h5">{title}</Typography>}
            {subtitle && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box>{actions}</Box>}
        </Stack>
      )}
      {children}
    </Paper>
  );
}
