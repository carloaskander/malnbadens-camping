// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    primary: {
      main: '#042B2A', // primary color
    },
    secondary: {
      main: '#D66B27', // secondary color
    },
    text: {
      primary: '#021a19', // dark text color
      secondary: '#ededed', // light text color
    },
    background: {
      default: '#fff', //background color
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(4, 43, 42, 0.95)', //Primary green color with 0.7 opacity
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(4, 43, 42, 0.85)', //Primary green color with 0.85 opacity
          color: 'white', // Text color for the items in the drawer
        },
      },
    },
  },
});

export default theme;
