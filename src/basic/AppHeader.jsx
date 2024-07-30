// src/components/AppBar.js
import React, { useState } from 'react';
import {
  AppBar as MuiAppBar, Box, Toolbar, IconButton, Typography, Badge, Button, ButtonGroup,
} from '@mui/material';
import {
  MenuRounded, NotificationsRounded, AccountCircleRounded, LightModeRounded, DarkModeRounded,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

//#region Responsive
const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
//#end region

const AppHeader = ({ onMenuClick, open }) => {
  const [lightMode, setLightMode] = useState(true);

  return (
    <>
      <AppBar position="fixed" color="inherit" open={open}>
        <Toolbar>
          <IconButton
            size="large"
            aria-label="open drawer"
            sx={{
              mr: 2,
              '&:focus': {
                outline: 'none'
              }
            }}
            color='primary'
            onClick={onMenuClick}
          >
            <MenuRounded color="primary" />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, alignContent: 'center', fontWeight: 'bold' }}
          >
            Lead Management System
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <ButtonGroup
              size='large'
              variant="outlined"
              sx={{ m: 1, p: 1, pt: 0, pb: 0 }}
              aria-label="mode buttons"
            >
              <Button
                aria-label="light mode"
                color='primary'
                variant={lightMode ? "contained" : "outlined"}
                sx={{ '&:focus': { outline: 'none' }, p: 0 }}
                onClick={(e) => { setLightMode(true) }}
              >
                {lightMode ? (
                  <LightModeRounded color='inherit' />

                ) : (
                  <LightModeRounded color='primary' />
                )}

              </Button>
              <Button
                aria-label="dark mode"
                color='primary'
                variant={lightMode ? "outlined" : "contained"}
                sx={{ '&:focus': { outline: 'none' }, p: 0 }}
                onClick={(e) => { setLightMode(false) }}
              >
                {lightMode ? (
                  <DarkModeRounded color='primary' />
                ) : (
                  <DarkModeRounded color='inherit' />

                )}
              </Button>
            </ButtonGroup>
            <IconButton
              aria-label="new notifications"
              sx={{ mr: 1, pt: 0, pb: 0, '&:focus': { outline: 'none' } }}
              color='primary'
            >
              <Badge badgeContent={2} color="error">
                <NotificationsRounded color='primary' />
              </Badge>
            </IconButton>
            <Button
              variant="outlined"
              size='large'
              sx={{ m: 1, p: 1, pt: 0, pb: 0, fontWeight: 'bold', '&:focus': { outline: 'none' } }}
              startIcon={<AccountCircleRounded />}
            >
              User
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
};

export default AppHeader;
