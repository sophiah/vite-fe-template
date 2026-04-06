import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';

export default function BlankDemoPage() {
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
      <Paper sx={{ width: '100%', maxWidth: 420, p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Blank Layout Page
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Example page without default nav shell.
        </Typography>

        <Stack spacing={1.5}>
          <TextField label="Email" size="small" fullWidth />
          <TextField label="Password" size="small" type="password" fullWidth />
          <Button variant="contained" size="large">
            Sign In
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
