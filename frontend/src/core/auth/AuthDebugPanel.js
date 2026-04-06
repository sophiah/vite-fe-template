import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';

import { login, logout, setStoredPermissions } from './login';

const PRESET_PERMISSIONS = [
  { label: 'Admin', permissions: ['*'] },
  { label: 'Category1', permissions: ['category1:read'] },
  { label: 'No Access', permissions: [] }
];

function toInputValue(permissions = []) {
  return permissions.join(', ');
}

function parseInputPermissions(inputValue) {
  return inputValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export default function AuthDebugPanel({
  isLoggedIn,
  permissions = [],
  onAuthChange
}) {
  const [inputValue, setInputValue] = React.useState(() => toInputValue(permissions));

  React.useEffect(() => {
    setInputValue(toInputValue(permissions));
  }, [permissions]);

  const handleToggleLogin = (event) => {
    if (event.target.checked) {
      login(permissions);
    } else {
      logout();
    }

    onAuthChange();
  };

  const handleApplyPermissions = () => {
    const nextPermissions = parseInputPermissions(inputValue);

    setStoredPermissions(nextPermissions);

    if (!isLoggedIn) {
      login(nextPermissions);
    }

    onAuthChange();
  };

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        width: 320,
        zIndex: (theme) => theme.zIndex.snackbar + 1,
        p: 2,
        borderRadius: 2.5
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AdminPanelSettingsRoundedIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2">Auth Debug Panel</Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2">Logged In</Typography>
          <Switch size="small" checked={isLoggedIn} onChange={handleToggleLogin} />
        </Stack>

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
            Permission Presets
          </Typography>
          <Stack direction="row" spacing={0.75} flexWrap="wrap">
            {PRESET_PERMISSIONS.map((preset) => (
              <Chip
                key={preset.label}
                size="small"
                label={preset.label}
                onClick={() => {
                  setInputValue(toInputValue(preset.permissions));
                }}
              />
            ))}
          </Stack>
        </Box>

        <TextField
          size="small"
          label="Permissions (comma-separated)"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="*, category1:read"
        />

        <Button variant="contained" size="small" onClick={handleApplyPermissions}>
          Apply
        </Button>
      </Stack>
    </Paper>
  );
}
