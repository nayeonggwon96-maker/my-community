import { createTheme } from '@mui/material/styles';

/**
 * 포우포우 테마 - 밝은 테마 + 소프트 민트
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3DBE9B',
      light: '#A8E6CF',
      dark: '#2A9D7E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFB4A2',
      contrastText: '#5A3A31',
    },
    background: {
      default: '#F4FBF8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2F3E3A',
      secondary: '#6B7D78',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.125rem',
      fontWeight: 500,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 16px rgba(61, 190, 155, 0.12)',
        },
      },
    },
  },
});

export default theme;
