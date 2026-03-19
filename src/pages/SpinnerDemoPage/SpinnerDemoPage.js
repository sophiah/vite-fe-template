import Box from '@mui/material/Box';
import React from 'react';

import { CSpinner } from '@core/components';

import DefaultPage from '@pages/DefaultPage';

export default function SpinnerDemoPage() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CSpinner size={60} message="Loading default page..." />
      </Box>
    );
  }

  return (
    <DefaultPage
      title="Spinner Demo Loaded"
      subtitle="This page first shows CSpinner for a few seconds, then renders DefaultPage content."
    />
  );
}
