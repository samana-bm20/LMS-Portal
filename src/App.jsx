import React from 'react';
import AppRoutes from './router/Routes';
import { Theme } from './Theme'
import { CssBaseline } from '@mui/material';

//providers
import { AuthProvider } from './providers/AuthProvider';
import { ModeProvider } from './providers/ModeProvider';
import { DetailsProvider } from './providers/DetailsProvider';
import { FetchLeadsProvider } from './providers/FetchLeadsProvider';

const App = () => {

  return (
    <>
      <ModeProvider>
        <Theme>
          <CssBaseline />
          <AuthProvider>
            <DetailsProvider>
              <FetchLeadsProvider>
                <AppRoutes />
              </FetchLeadsProvider>
            </DetailsProvider>
          </AuthProvider>
        </Theme>
      </ModeProvider>
    </>
  );
}

export default App;
