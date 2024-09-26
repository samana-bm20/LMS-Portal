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
            main: '#006A62', //'#0245A3',
            light: '#a2e0db',
            contrastSecondary: 'rgba(255, 255, 255, 0.7)'
          },
          background: {
            default: '#fff',
            paper: '#fff',
            footer: '#eee',
            header: '#e0e0e0',
            card: '#fff',
          },
        }
        : {
          // palette values for dark mode
          primary: {
            main: '#78ded6',//'#90caf9',
            dark: '#62b5af',//'#5F9ACB',
            contrastSecondary: 'rgba(0, 0, 0, 0.6)'
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

