// src/layouts/MainLayout.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Toolbar } from '@mui/material';
import AppBar from '../basic/AppBar';
import AppDrawer from '../basic/AppDrawer'
import AppFooter from '../basic/AppFooter'
import { Outlet } from 'react-router-dom';
const drawerWidth = 240;

const MainLayout = () => {
    const drawerShow = useSelector((state) => state.drawerShow)
    const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    dispatch({ type: 'set', drawerShow: !drawerShow })
  };

  return (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        ml: drawerShow ? 0 : '-240px'
        }}
        >
      <AppBar open={drawerShow} onMenuClick={handleDrawerToggle} />
      <AppDrawer open={drawerShow} onClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: drawerShow ? 0 : `-${drawerWidth}px`,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      <AppFooter />
    </Box>
  );
};

export default MainLayout;
