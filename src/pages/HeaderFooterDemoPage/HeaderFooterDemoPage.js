import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import { CAppBox, CAppCard } from '@core/components';

import { featureCards } from './subcomponents/featureData';

export default function HeaderFooterDemoPage() {
  return (
    <Grid container spacing={2.25}>
      <Grid item xs={12}>
        <CAppBox
          title="Header + Footer Layout"
          subtitle="Use this for marketing or public pages where sidebar is unnecessary."
          gradient
        >
          <Typography color="text.secondary">
            This route is mounted through `HeaderFooterLayout` with `CHeaderNav` and `CFooter`.
          </Typography>
        </CAppBox>
      </Grid>

      {featureCards.map((card) => (
        <Grid item xs={12} md={4} key={card.title}>
          <CAppCard title={card.title} subtitle={card.description} value="Ready" />
        </Grid>
      ))}
    </Grid>
  );
}
