import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 460, p: 4, borderRadius: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="h5">Access Denied</Typography>
          <Typography color="text.secondary">
            You do not have permission to access this route.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/', { replace: true })}>
            Back To Home
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
