import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';

import { darkModeColorCode } from '@core/darkModeColorCode';
import { defaultColorCode } from '@core/defaultColorCode';

import { getSpinnerMessage } from './subcomponents/spinnerMessage';

export default function Spinner({ message, size = 52, fullHeight = false }) {
  const theme = useTheme();
  const colorCode = theme.palette.mode === 'dark' ? darkModeColorCode : defaultColorCode;

  return (
    <Box
      sx={{
        minHeight: fullHeight ? 240 : 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 999,
          backgroundColor: colorCode.spinnerTrack
        }}
      >
        <CircularProgress size={size} thickness={4} sx={{ color: colorCode.spinnerMain }} />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {getSpinnerMessage(message)}
      </Typography>
    </Box>
  );
}
