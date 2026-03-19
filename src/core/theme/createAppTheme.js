import { createTheme } from '@mui/material/styles';

import { darkModeColorCode } from '@core/darkModeColorCode';
import { defaultColorCode } from '@core/defaultColorCode';

const getColorCode = (mode) => (mode === 'dark' ? darkModeColorCode : defaultColorCode);

export const createAppTheme = (mode = 'light') => {
  const colorCode = getColorCode(mode);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colorCode.primaryMain,
        dark: colorCode.primaryDark
      },
      secondary: {
        main: colorCode.secondaryMain
      },
      info: {
        main: colorCode.infoMain
      },
      success: {
        main: colorCode.successMain
      },
      warning: {
        main: colorCode.warningMain
      },
      error: {
        main: colorCode.errorMain
      },
      background: {
        default: colorCode.backgroundDefault,
        paper: colorCode.backgroundPaper
      },
      text: {
        primary: colorCode.textPrimary,
        secondary: colorCode.textSecondary
      },
      divider: colorCode.divider
    },
    shape: {
      borderRadius: 14
    },
    typography: {
      fontFamily: '"DM Sans", "Segoe UI", sans-serif',
      h4: {
        fontWeight: 700
      },
      h5: {
        fontWeight: 700
      },
      h6: {
        fontWeight: 700
      },
      body1: {
        fontWeight: 500
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colorCode.backgroundDefault,
            color: colorCode.textPrimary
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: colorCode.headerBackground,
            color: colorCode.textPrimary,
            boxShadow: 'none',
            borderBottom: `1px solid ${colorCode.border}`
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colorCode.sidebarBackground,
            borderRight: `1px solid ${colorCode.border}`
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            border: `1px solid ${colorCode.border}`,
            boxShadow: `0 10px 24px ${colorCode.cardShadow}`
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${colorCode.border}`,
            boxShadow: `0 10px 24px ${colorCode.cardShadow}`
          }
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            '&:hover': {
              backgroundColor: colorCode.hoverBackground
            }
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: colorCode.divider
          }
        }
      }
    }
  });
};
