import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { CAppBox, CAppCard } from '@core/components';

export default function Page1_1Page() {
  return (
    <Grid container spacing={2.25}>
      <Grid item xs={12}>
        <CAppBox title="Category 1 / Page 1-1" subtitle="Permission is declared at this page level.">
          <Typography color="text.secondary">
            Effective permissions are merged from parent and page route meta.
          </Typography>
        </CAppBox>
      </Grid>
      <Grid item xs={12} md={6}>
        <CAppCard title="Parent Permission" subtitle="Inherited" value="category1:read" />
      </Grid>
      <Grid item xs={12} md={6}>
        <CAppCard title="Page Permission" subtitle="Declared here" value="category1:page1-1:read" />
      </Grid>
    </Grid>
  );
}
