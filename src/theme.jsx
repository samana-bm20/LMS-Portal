import { useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useMode } from './providers/ModeProvider';

export const Theme = ({children}) => {
  const { mode } = useMode();

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
          // palette values for light mode
          primary: {
            main: '#0245A3',
            light: '#c9e5ff',
          },
          background: {
            default: '#fff',
            paper: '#fff',
            footer: '#eee',
            header: '#e0e0e0',
          },
        }
        : {
          // palette values for dark mode
          primary: {
            main: '#90caf9',
            dark: '#5F9ACB',
          },
          background: {
            default: '#121212',
            paper: '#121212',
            footer: '#272727',
            header: '#383838',
          },
        }),
    },
  }), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

// export default getTheme;

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#0245A3', //'#1976d2'
//       light: '#c9e5ff',
//       dark: '#013073',
//       contrastText: '#fff',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//     text: {
//       main: '#fff',
//     }
//   },
//   typography: {
//     fontFamily: '"Helvetica", "Roboto", "Arial", "sans-serif"',
//   },
// });

// export default theme;
