import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { AppBox, AppCard } from '@core/components';

import { featureCards } from './subcomponents/featureData';

export default function HeaderFooterDemoPage() {
  return (
    <Grid container spacing={2.25}>
      <Grid size={12}>
        <AppBox
          title="Header + Footer Layout"
          subtitle="Use this for marketing or public pages where sidebar is unnecessary."
          gradient
        >
          <Typography color="text.secondary">
            This route is mounted through `HeaderFooterLayout` with `HeaderNav` and `Footer`.
          </Typography>
        </AppBox>
      </Grid>

      {featureCards.map((card) => (
        <Grid size={{ xs: 12, md: 4 }} key={card.title}>
          <AppCard title={card.title} subtitle={card.description} value="Ready" />
        </Grid>
      ))}
    </Grid>
  );
}
