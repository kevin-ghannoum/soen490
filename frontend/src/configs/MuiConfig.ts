import { createTheme, responsiveFontSizes } from '@material-ui/core';

export const mainTheme = responsiveFontSizes(
  createTheme({
    typography: {
      fontFamily: 'Circular,sans-serif;',
    },
    palette: {
      primary: {
        main: '#2BB1E4',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#3C58E8',
        contrastText: '#FFFFFF',
      },
    },
  })
);
