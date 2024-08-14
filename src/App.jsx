<<<<<<< HEAD
import React from 'react';
=======
// src/App.js
import React from 'react';
import { AuthProvider } from './providers/AuthProvider';
import { ModeProvider } from './providers/ModeProvider';
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
import AppRoutes from './router/Routes';
import { Theme } from './Theme'
import { CssBaseline } from '@mui/material';

<<<<<<< HEAD
//providers
import { AuthProvider } from './providers/AuthProvider';
import { ModeProvider } from './providers/ModeProvider';
import { DetailsProvider } from './providers/DetailsProvider';
import { FetchLeadsProvider } from './providers/FetchLeadsProvider';

=======
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
const App = () => {

  return (
    <>
      <ModeProvider>
        <Theme>
          <CssBaseline />
          <AuthProvider>
<<<<<<< HEAD
            <DetailsProvider>
              <FetchLeadsProvider>
                <AppRoutes />
              </FetchLeadsProvider>
            </DetailsProvider>
=======
            <AppRoutes />
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
          </AuthProvider>
        </Theme>
      </ModeProvider>
    </>
  );
}

export default App;
