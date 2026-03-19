import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { CAppBox, CAppCard } from '@core/components';

export default function GroupAPage() {
  return (
    <Grid container spacing={2.25}>
      <Grid item xs={12}>
        <CAppBox title="Category 1 / Group A" subtitle="Second-level layer meta for deeper routes.">
          <Typography color="text.secondary">
            Nested child route `/category1/group-a/deep-page` inherits this layer and parent layer.
          </Typography>
        </CAppBox>
      </Grid>
      <Grid item xs={12} md={6}>
        <CAppCard title="Inherited Parent" subtitle="From category1" value="category1:read" />
      </Grid>
      <Grid item xs={12} md={6}>
        <CAppCard title="Layer Permission" subtitle="From this level" value="group-a:read" />
      </Grid>
    </Grid>
  );
}
