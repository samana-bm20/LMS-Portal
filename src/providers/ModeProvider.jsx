import React, { useMemo, useState, useContext } from 'react';
import { ModeContext } from '../context'

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme');
    return savedMode ? savedMode : 'light';
  });

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode); 
      return newMode;
    });
  };

  return (
    <ModeContext.Provider value={{ toggleColorMode, mode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);