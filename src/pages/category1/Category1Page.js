import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { CAppBox, CAppCard } from '@core/components';

export default function Category1Page() {
  return (
    <Grid container spacing={2.25}>
      <Grid item xs={12}>
        <CAppBox
          title="Category 1"
          subtitle="Parent level route meta drives inherited layout, permissions, and left menu defaults."
          gradient
        >
          <Typography color="text.secondary">
            Try nested routes: `/category1/page1-1`, `/category1/page1-2`, and
            `/category1/group-a/deep-page`.
          </Typography>
        </CAppBox>
      </Grid>
      <Grid item xs={12} md={4}>
        <CAppCard title="Layer Permission" subtitle="Defined in category1/index.js" value="category1:read" />
      </Grid>
      <Grid item xs={12} md={4}>
        <CAppCard title="Menu Icon" subtitle="Inherited to child routes" value="Folder icon" />
      </Grid>
      <Grid item xs={12} md={4}>
        <CAppCard title="Menu Order" subtitle="Controlled at layer level" value="100" />
      </Grid>
    </Grid>
  );
}
