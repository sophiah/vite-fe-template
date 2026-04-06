import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import { formatTrend } from './subcomponents/metricUtils';

export default function AppCard({ title, subtitle, value, trend, icon }) {
  const trendLabel = formatTrend(trend);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
            {trendLabel && (
              <Typography
                variant="body2"
                color={trend >= 0 ? 'success.main' : 'error.main'}
                sx={{ mt: 1, fontWeight: 700 }}
              >
                {trendLabel}
              </Typography>
            )}
          </Box>
          {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
        </Stack>
      </CardContent>
    </Card>
  );
}
