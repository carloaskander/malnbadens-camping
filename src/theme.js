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
      main: 'rgba(4, 43, 42)',
    },
    secondary: {
      main: 'rgba(214, 107, 39)',
    },
    text: {
      primary: 'rgba(4, 43, 42)',
      secondary: '#fff',
    },
    background: {
      default: '#fff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(4, 51, 40, 0.97)',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontFamily: '"Bebas Neue", Arial, sans-serif',
          fontSize: '1.25rem',
          letterSpacing: '1px',
        },
        secondary: {
          fontFamily: '"Bebas Neue", Arial, sans-serif',
          fontSize: '1.25rem',
          letterSpacing: '1px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(4, 43, 42, 0.85)',
          color: 'white',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: '#021a19',
          borderRadius: '1px',
          boxShadow: '0px 2px 8px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          height: '160px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white',
          backgroundColor: '#D66B27',
          padding: '10px',
          borderRadius: '0',
          fontFamily: 'Bebas Neue, Arial, sans-serif',
          fontSize: '18px',
          wordSpacing: '1px',
          letterSpacing: '1px',
          '&:hover': {
            backgroundColor: 'rgba(4, 51, 40)'
          }
        },
        outlined: {
          color: 'rgba(214, 107, 39)',
          border: '2px solid rgba(214, 107, 39)',
          backgroundColor: 'transparent',
          '&:hover': {
            color: 'white',
            border: '2px solid rgba(214, 107, 39)',
            backgroundColor: 'rgba(214, 107, 39)',
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiInputLabel: { 
      styleOverrides: {
        root: {
          color: 'rgba(4, 43, 42)',
          '&.Mui-focused': {
            color: '#D66B27',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid rgba(4, 43, 42, 0.5)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: '2px solid rgba(4, 43, 42)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px solid #30824d',
          },
        },
      },
    },
  },
});

export default theme;