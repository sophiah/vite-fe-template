import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { CAppBox, CAppCard } from '@core/components';

export default function Page1_2Page() {
  return (
    <Grid container spacing={2.25}>
      <Grid item xs={12}>
        <CAppBox
          title="Category 1 / Page 1-2"
          subtitle="No page-level permission is set here, so inherited layer permission is applied."
        >
          <Typography color="text.secondary">
            The route path is auto-generated from folder path.
          </Typography>
        </CAppBox>
      </Grid>
      <Grid item xs={12} md={6}>
        <CAppCard title="Inherited Permission" subtitle="From category1/index.js" value="category1:read" />
      </Grid>
      <Grid item xs={12} md={6}>
        <CAppCard title="Path Mapping" subtitle="Folder-driven route" value="/category1/page1-2" />
      </Grid>
    </Grid>
  );
}
