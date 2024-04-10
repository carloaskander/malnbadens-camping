import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';


const theme = createTheme({
  typography: {
    h1: {
      fontFamily: 'Bebas Neue, Arial, sans-serif', 
      fontWeight: 500,
    },
    h2: {
      fontFamily: 'Bebas Neue, Arial, sans-serif', 
      fontWeight: 500,
    },
    h3: {
      fontFamily: 'Bebas Neue, Arial, sans-serif', 
      fontWeight: 500,
    },
    h4: {
      fontFamily: 'Bebas Neue, Arial, sans-serif', 
      fontWeight: 500,
    },
    h5: {
      fontFamily: 'Bebas Neue, Arial, sans-serif', 
      fontWeight: 500,
    },
    h6: {
      fontFamily: 'Bebas Neue, Arial, sans-serif', 
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'Noto Serif, Arial, sans-serif',
      fontWeight: 500,
      fontSize: '18px'
    },
    body2: {
      fontFamily: 'Noto Serif, Arial, sans-serif',
      fontWeight: 500,
      fontSize: '16px'
    },
    body3: {
      fontFamily: 'Noto Serif, Arial, sans-serif',
      fontWeight: 500,
      fontSize: '15px'
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
    MuiListItemText: {
      styleOverrides: {
        primary: { // Targeting the primary text within ListItemText
          fontFamily: '"Bebas Neue", Arial, sans-serif',
          fontSize: '1.25rem',
          letterSpacing: '1px',
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
          padding: '10px',
          borderRadius: '0', // Apply no border radius to all buttons
          backgroundColor: '#D66B27',
          fontFamily: 'Bebas Neue, Arial, sans-serif',
          fontSize: '18px',
          wordSpacing: '1px',
          letterSpacing: '1px',
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