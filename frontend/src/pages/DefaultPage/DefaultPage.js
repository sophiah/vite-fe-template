import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { AppBox, AppCard } from '@core/components';

export default function DefaultPage({
  title = 'Default Page',
  subtitle = 'This page is shown after the loading spinner finishes.'
}) {
  return (
    <Grid container spacing={2.25}>
      <Grid item xs={12}>
        <AppBox title={title} subtitle={subtitle}>
          <Typography color="text.secondary">
            Use this page as a base screen for API-loaded modules.
          </Typography>
        </AppBox>
      </Grid>

      <Grid item xs={12} md={4}>
        <AppCard
          title="Status"
          subtitle="Page state"
          value="Ready"
          trend={6}
          icon={<CheckCircleRoundedIcon />}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <AppCard
          title="Data"
          subtitle="Records loaded"
          value="1,248"
          trend={4}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <AppCard
          title="Response"
          subtitle="Average time"
          value="310ms"
          trend={-2}
        />
      </Grid>
    </Grid>
  );
}
