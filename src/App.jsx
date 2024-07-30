// src/App.js
import React from 'react';
import { AuthProvider } from './providers/AuthProvider';
import AppRoutes from './router/Routes';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

const App = () => (
  <>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  </>
);

export default App;
