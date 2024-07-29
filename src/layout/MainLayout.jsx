// src/layouts/MainLayout.js
import React from 'react';
import { Box, Toolbar } from '@mui/material';
import AppBar from '../basic/AppBar';
import AppDrawer from '../basic/AppDrawer'
import AppFooter from '../basic/AppFooter'
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar onMenuClick={handleDrawerToggle} />
      <AppDrawer open={drawerOpen} onClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${240}px` }, // Adjust margin based on drawer width
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
