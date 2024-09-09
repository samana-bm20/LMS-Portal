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
            card: '#D1D5DB',
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
            card: '#373737'
          },
        }),
    },
  }), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

