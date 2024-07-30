import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0245A3', //'#1976d2'
      light: '#c9e5ff',
      dark: '#013073',
      contrastText: '#fff',   
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Helvetica", "Roboto", "Arial", sans-serif',
  },
});

export default theme;
