import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { AppBox, AppCard } from '@core/components';

export default function DeepPage() {
  return (
    <Grid container spacing={2.25}>
      <Grid item xs={12}>
        <AppBox
          title="Category 1 / Group A / Deep Page"
          subtitle="Multi-level auto route generation from nested folders."
        >
          <Typography color="text.secondary">
            Effective permission chain: `category1:read` + `group-a:read` + `deep-page:read`.
          </Typography>
        </AppBox>
      </Grid>
      <Grid item xs={12} md={4}>
        <AppCard title="Path" subtitle="Auto from folders" value="/category1/group-a/deep-page" />
      </Grid>
      <Grid item xs={12} md={4}>
        <AppCard title="Layout" subtitle="Inherited from ancestors" value="left-menu" />
      </Grid>
      <Grid item xs={12} md={4}>
        <AppCard title="Permission" subtitle="Page-level setting" value="deep-page:read" />
      </Grid>
    </Grid>
  );
}
