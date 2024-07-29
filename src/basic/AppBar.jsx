// src/components/AppBar.js
import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const AppBar = ({ onMenuClick }) => {

  return (
  <MuiAppBar position="fixed">
    <Toolbar>
      <IconButton color="inherit" edge="start" onClick={onMenuClick}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap>
        My App
      </Typography>
    </Toolbar>
  </MuiAppBar>
  )
};

export default AppBar;
