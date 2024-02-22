import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontWeight: 500,
      color: 'rgba(4, 43, 42)', // Apply the color to h1
    },
    h2: {
      fontWeight: 400,
      color: 'rgba(4, 43, 42)', // Apply the color to h2
    },
    h3: {
      fontWeight: 400,
      color: 'rgba(4, 43, 42)', // Apply the color to h3
    },
    h4: {
      fontWeight: 500,
      color: 'rgba(4, 43, 42)', // Apply the color to h4
    },
    h5: {
      fontWeight: 500,
      color: 'rgba(4, 43, 42)', // Apply the color to h5
    },
    h6: {
      fontWeight: 500,
      color: 'rgba(4, 43, 42)', // Apply the color to h6
    },
    body1: {
      fontWeight: 500,
      wordSpacing: '1px',
      color: 'rgba(100, 130, 130)', //Light shade of our primary color.
    }
  },
  palette: {
    primary: {
      main: 'rgba(4, 43, 42)', // Primary color
    },
    secondary: {
      main: 'rgba(214, 107, 39)', // Secondary color
    },
    text: {
      primary: 'rgba(4, 43, 42)', // Dark text color
      secondary: '#fff', // Light text color
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
    MuiListItemText: {
      styleOverrides: {
        primary: { // Target the primary text
          color: 'white', // Set your desired color
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
          padding: '10px',
          wordSpacing: '1px',
          // Add other global button styles here
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Set border radius to 0 for all Paper components
        },
      },
    },
    // Additional component overrides can be placed here
  },
});

export default theme;