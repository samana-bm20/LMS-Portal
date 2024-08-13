// src/App.js
import React from 'react';
import { AuthProvider } from './providers/AuthProvider';
import { ModeProvider } from './providers/ModeProvider';
import { DetailsProvider } from './providers/DetailsProvider';
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
            <DetailsProvider>
              <AppRoutes />
            </DetailsProvider>
          </AuthProvider>
        </Theme>
      </ModeProvider>
    </>
  );
}

export default App;
