/* eslint-disable no-unused-vars */
// src/layouts/MainLayout.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Toolbar } from '@mui/material';
import AppHeader from '../basic/AppHeader';
import AppDrawer from '../basic/AppDrawer'
import AppFooter from '../basic/AppFooter'
import { Outlet } from 'react-router-dom';
const drawerWidth = 180;

const MainLayout = () => {
  const drawerShow = useSelector((state) => state.drawerShow)
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    dispatch({ type: 'set', drawerShow: !drawerShow })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      <AppHeader onMenuClick={handleDrawerToggle} open={drawerShow}/>
      <AppDrawer open={drawerShow} onClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: drawerShow ? `${drawerWidth}px` : 0,
          transition: 'width 0.3s ease, margin-left 0.3s ease'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      <AppFooter open={drawerShow}/>
    </Box>
  );
};

export default MainLayout;
