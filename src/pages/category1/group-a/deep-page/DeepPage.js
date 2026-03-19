import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { CAppBox, CAppCard } from '@core/components';

export default function DeepPage() {
  return (
    <Grid container spacing={2.25}>
      <Grid item xs={12}>
        <CAppBox
          title="Category 1 / Group A / Deep Page"
          subtitle="Multi-level auto route generation from nested folders."
        >
          <Typography color="text.secondary">
            Effective permission chain: `category1:read` + `group-a:read` + `deep-page:read`.
          </Typography>
        </CAppBox>
      </Grid>
      <Grid item xs={12} md={4}>
        <CAppCard title="Path" subtitle="Auto from folders" value="/category1/group-a/deep-page" />
      </Grid>
      <Grid item xs={12} md={4}>
        <CAppCard title="Layout" subtitle="Inherited from ancestors" value="left-menu" />
      </Grid>
      <Grid item xs={12} md={4}>
        <CAppCard title="Permission" subtitle="Page-level setting" value="deep-page:read" />
      </Grid>
    </Grid>
  );
}
