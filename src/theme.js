import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    primary: {
      main: 'rgba(4, 43, 42)', // Primary color
    },
    secondary: {
      main: 'rgba(214, 107, 39)', // Secondary color
    },
    text: {
      primary: '#021a19', // Dark text color
      secondary: '#ededed', // Light text color
    },
    background: {
      default: '#fff', // Background color
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(4, 43, 42, 0.95)', // Primary green color with 0.95 opacity
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(4, 43, 42, 0.85)', // Primary green color with 0.85 opacity
          color: 'white', // Text color for the items in the drawer
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff', // Using MUI's light grey
          color: '#021a19', // Dark text color for better contrast
          borderRadius: '1px',
          boxShadow: '0px 2px 8px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          height: '160px', // Standardize the height for all card media
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0', // Apply no border radius to all buttons
          backgroundColor: '#D66B27',
          // Add other global button styles here
        },
      },
    },
    // Additional component overrides can be placed here
  },
});

export default theme;