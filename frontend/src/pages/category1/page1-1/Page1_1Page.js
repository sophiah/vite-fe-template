import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { AppBox, AppCard } from '@core/components';

export default function Page1_1Page() {
  return (
    <Grid container spacing={2.25}>
      <Grid size={12}>
        <AppBox title="Category 1 / Page 1-1" subtitle="Permission is declared at this page level.">
          <Typography color="text.secondary">
            Effective permissions are merged from parent and page route meta.
          </Typography>
        </AppBox>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AppCard title="Parent Permission" subtitle="Inherited" value="category1:read" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AppCard title="Page Permission" subtitle="Declared here" value="category1:page1-1:read" />
      </Grid>
    </Grid>
  );
}
