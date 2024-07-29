// src/App.js
import React from 'react';
import { AuthProvider } from './providers/AuthProvider';
import AppRoutes from './router/Routes';

const App = () => (
  <>
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
  </>
);

export default App;
