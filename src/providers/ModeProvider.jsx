import React, { useMemo, useState, useContext } from 'react';
import { ModeContext } from '../context'

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }

  return (
    <ModeContext.Provider value={{ toggleColorMode, mode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);