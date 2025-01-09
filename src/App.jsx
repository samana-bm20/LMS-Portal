/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import AppRoutes from './router/Routes';
import { Theme } from './theme';
import { CssBaseline } from '@mui/material';

// providers
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { ModeProvider } from './providers/ModeProvider';
import { DetailsProvider } from './providers/DetailsProvider';
import { FetchLeadsProvider } from './providers/FetchLeadsProvider';

const AppProviders = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && (
        <DetailsProvider>
          <FetchLeadsProvider>
            {children}
          </FetchLeadsProvider>
        </DetailsProvider>
      )}
      {!isAuthenticated && children}
    </>
  );
};

const App = () => {
  return (
    <ModeProvider>
      <Theme>
        <CssBaseline />
        <AuthProvider>
          <AppProviders>
            <AppRoutes />
          </AppProviders>
        </AuthProvider>
      </Theme>
    </ModeProvider>
  );
};

export default App;

