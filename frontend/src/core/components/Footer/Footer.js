import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import { APP_CONFIG } from '@root/Config';
import { footerSections } from './subcomponents/footerSections';

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 4, px: { xs: 2, md: 5 }, pb: 3 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {footerSections.map((section) => (
          <Grid size={{ xs: 12, sm: 4 }} key={section.title}>
            <Typography variant="h6" sx={{ mb: 1.25 }}>
              {section.title}
            </Typography>
            <Stack spacing={0.5}>
              {section.links.map((link) => (
                <Typography key={link} color="text.secondary">
                  {link}
                </Typography>
              ))}
            </Stack>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 2 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
        <Typography variant="body2" color="text.secondary">
          {APP_CONFIG.FOOTER_COPYRIGHT_TEXT}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {APP_CONFIG.FOOTER_PRODUCER_TEXT}
        </Typography>
      </Stack>
    </Box>
  );
}
