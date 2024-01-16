// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#042B2A', // Your primary color
    },
    secondary: {
      main: '#D66B27', // Your secondary color
    },
    text: {
      primary: '#021a19', // Your dark text color
      secondary: '#ededed', // Your light text color
    },
    background: {
      default: '#fff', // Your background color
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(4, 43, 42, 0.7)', // Your primary color with 0.7 opacity
        },
      },
    },
  },
  // ... any other theme customization ...
});

export default theme;
