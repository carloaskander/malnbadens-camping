import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    primary: {
      main: '#042B2A', // Primary color
    },
    secondary: {
      main: '#D66B27', // Secondary color
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
          backgroundColor: 'rgba(4, 43, 42, 0.95)', // Primary green color with 0.7 opacity
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
          backgroundColor: grey[100], // Using MUI's light grey
          color: '#021a19', // Consider using the dark text color for better contrast
          borderRadius: '1px',
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          height: '160px', // Standardize the height for all card media
          // Add any additional styles you want for the card media here
        },
      },
    },
    // You can also add overrides for other card-related components like MuiCardContent here
  },
});

export default theme;
