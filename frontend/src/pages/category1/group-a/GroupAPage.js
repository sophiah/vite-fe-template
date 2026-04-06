import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { AppBox, AppCard } from '@core/components';

export default function GroupAPage() {
  return (
    <Grid container spacing={2.25}>
      <Grid size={12}>
        <AppBox title="Category 1 / Group A" subtitle="Second-level layer meta for deeper routes.">
          <Typography color="text.secondary">
            Nested child route `/category1/group-a/deep-page` inherits this layer and parent layer.
          </Typography>
        </AppBox>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AppCard title="Inherited Parent" subtitle="From category1" value="category1:read" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <AppCard title="Layer Permission" subtitle="From this level" value="group-a:read" />
      </Grid>
    </Grid>
  );
}
