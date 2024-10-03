import React, { useState } from 'react';
import {
  AppBar as MuiAppBar, Box, Toolbar, IconButton, Typography, Badge, Button, ButtonGroup, Fab, Menu,
  MenuItem, Divider
} from '@mui/material';
import {
  MenuRounded, NotificationsRounded, PersonRounded, LightModeRounded, DarkModeRounded,
  PowerSettingsNewRounded, FaceRounded, ManageAccountsRounded
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../providers/AuthProvider';
import { useMode } from '../providers/ModeProvider';
import { useDetails } from '../providers/DetailsProvider';
import AppNotifications from './AppNotifications';
//#region Responsive
const drawerWidth = 180;
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
  const { logout } = useAuth();
  const { mode, toggleColorMode } = useMode();
  const [anchorElUser, setAnchorElUser] = useState('');
  // const [anchorNotif, setAnchorNotif] = useState('');
  // const [user, setUser] = useState('');
  const { loggedUser, userValues } = useDetails();
  let userName
  //#region Menu

  const fetchUser = () => {

    const username = userValues.filter((user) => user.username === loggedUser)
    userName = username[0]?.uName
  }
  fetchUser();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // const handleOpenNotification = (event) => {
  //   setAnchorNotif(event.currentTarget);
  // };

  // const handleCloseNotification = () => {
  //   setAnchorNotif(null);
  // };
  
  

  const settings = [
    {
      name: userName,
      icon: <FaceRounded color='primary' />
    },
    {
      name: 'Profile',
      icon: <ManageAccountsRounded color='primary' />
    }
  ]
  //#end region

  return (
    <>
      <AppBar position="fixed" color="inherit" open={open}>
        <Toolbar>

          {/* Menu */}
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

          {/* Title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, alignContent: 'center', fontWeight: 'bold' }}
          >
            Lead Management System
          </Typography>
          <Box sx={{ flexGrow: 1 }} />

          {/* Mode */}
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
                variant={mode == 'light' ? "contained" : "outlined"}
                sx={{ '&:focus': { outline: 'none' }, p: 0 }}
                onClick={toggleColorMode}
              >
                {mode == 'light' ? (
                  <LightModeRounded color='inherit' />

                ) : (
                  <LightModeRounded color='primary' />
                )}

              </Button>
              <Button
                aria-label="dark mode"
                color='primary'
                variant={mode == 'light' ? "outlined" : "contained"}
                sx={{ '&:focus': { outline: 'none' }, p: 0 }}
                onClick={toggleColorMode}
              >
                {mode == 'light' ? (
                  <DarkModeRounded color='primary' />
                ) : (
                  <DarkModeRounded color='inherit' />

                )}
              </Button>
            </ButtonGroup>

            {/* Notification */}
            {/* <IconButton
              aria-label="new notifications"
              sx={{ mr: 1, pt: 0, pb: 0, '&:focus': { outline: 'none' } }}
              color='primary'
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNotification}
              >
              <Badge badgeContent={2} color="error">
                <NotificationsRounded color='primary' />
              </Badge>
            </IconButton> */}

            {/* User */}
            <Box className='flex-grow'>
              <Fab
                color="primary"
                aria-label="account"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenUserMenu}
                size='small'
                sx={{ ml: 1, mr: 2, '&:focus': { outline: 'none' } }}
              >
                <PersonRounded />
              </Fab>

              {/* User-Menu */}
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, index) => (
                  <MenuItem key={index} onClick={handleCloseUserMenu} >
                    <div className='flex'>
                      <div>{setting.icon}</div>
                      <div className='ml-2'>
                        <p>{setting.name}</p>
                      </div>
                    </div>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={() => { logout() }}>
                  <div className='flex'>
                    <div><PowerSettingsNewRounded color='primary' /></div>
                    <div className='ml-2'>
                      <p>Logout</p>
                    </div>
                  </div>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
        {/* <AppNotifications anchorNotif={anchorNotif} handleCloseNotification={handleCloseNotification} /> */}
      </AppBar>
    </>
  )
};

export default AppHeader;
