import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { AppBox, AppCard } from '@core/components';

export default function Page1_2Page() {
  return (
    <Grid container spacing={2.25}>
      <Grid size={12}>
        <AppBox
          title="Category 1 / Page 1-2"
          subtitle="No page-level permission is set here, so inherited layer permission is applied."
        >
          <Typography color="text.secondary">
            The route path is auto-generated from folder path.
          </Typography>
        </AppBox>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AppCard title="Inherited Permission" subtitle="From category1/index.js" value="category1:read" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AppCard title="Path Mapping" subtitle="Folder-driven route" value="/category1/page1-2" />
      </Grid>
    </Grid>
  );
}
