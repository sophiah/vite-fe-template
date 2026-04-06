import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import { AppBox, AppCard } from '@core/components';

import { monthlyBars } from './subcomponents/overviewData';

export default function DashboardPage() {
  return (
    <Grid container spacing={2.25}>
      <Grid item xs={12} lg={8}>
        <AppBox title="Welcome back, Product Team" subtitle="Template dashboard page" gradient>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} divider={<Divider orientation="vertical" flexItem />}>
            <Box>
              <Typography variant="h4">$23,420</Typography>
              <Typography variant="body1" color="text.secondary">
                Today&apos;s sales
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4">35%</Typography>
              <Typography variant="body1" color="text.secondary">
                Performance growth
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 34, height: 34 }}>A</Avatar>
              <Chip color="primary" label="Template" size="small" />
            </Stack>
          </Stack>
        </AppBox>
      </Grid>
      <Grid item xs={12} sm={6} lg={2}>
        <AppCard
          title="Expense"
          value="$10,230"
          subtitle="Current month"
          trend={-3}
          icon={<DonutLargeRoundedIcon />}
        />
      </Grid>
      <Grid item xs={12} sm={6} lg={2}>
        <AppCard
          title="Sales"
          value="$65,432"
          subtitle="Current month"
          trend={12}
          icon={<AttachMoneyRoundedIcon />}
        />
      </Grid>

      <Grid item xs={12} md={7}>
        <AppBox title="Revenue Updates" subtitle="Overview of profit">
          <Stack direction="row" alignItems="flex-end" spacing={1.2} sx={{ mt: 2, minHeight: 180 }}>
            {monthlyBars.map((height, index) => (
              <Box
                key={`bar-${index}`}
                sx={{
                  width: 20,
                  height,
                  borderRadius: 2,
                  backgroundColor: index % 2 === 0 ? 'primary.main' : 'secondary.main'
                }}
              />
            ))}
          </Stack>
        </AppBox>
      </Grid>
      <Grid item xs={12} md={5}>
        <AppBox title="Sales Overview" subtitle="Every month">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <TimelineRoundedIcon />
            </Avatar>
            <Box>
              <Typography variant="h4">$500,458</Typography>
              <Typography color="text.secondary">Year to date</Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <AppCard
            title="Monthly orders"
            value="16.5k"
            subtitle="Compared to last month"
            trend={7}
            icon={<ShoppingCartRoundedIcon />}
          />
        </AppBox>
      </Grid>
    </Grid>
  );
}
