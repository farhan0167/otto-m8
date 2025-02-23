import { createTheme, styled } from '@mui/material/styles';

// Define the custom theme
export const theme = createTheme({
    palette: {
      primary: {
        main: '#0d0d0d', // Custom primary color
      },
      secondary: {
        main: '#d32f2f', // Custom secondary color
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            height: '38px',
            minWidth: '100px',
            borderRadius: '8px',
          },
        },
      },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
      //fontFamily: ["ui-sans-serif", "-apple-system", "BlinkMacSystemFont", "Segoe UI Variable Display", "Segoe UI", "Helvetica", "Apple Color Emoji", "Arial", "sans-serif", "Segoe UI Emoji", "Segoe UI Symbol"].join(","),
      //fontFamily: ['Inter', 'sans-serif'].join(','),
      button: {
        textTransform: 'none',
        fontSize: '15px',
      }
    },
  });