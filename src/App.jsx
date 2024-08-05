// src/App.js
import React from 'react';
import { AuthProvider } from './providers/AuthProvider';
import { ModeProvider } from './providers/ModeProvider';
import AppRoutes from './router/Routes';
import { Theme } from './Theme'
import { CssBaseline } from '@mui/material';

const App = () => {

  return (
    <>
      <ModeProvider>
        <Theme>
          <CssBaseline />
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Theme>
      </ModeProvider>
    </>
  );
}

export default App;
