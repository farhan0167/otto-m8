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
            height: '45px',
            minWidth: '120px',
            borderRadius: '8px',
          },
        },
      },
    }
  });