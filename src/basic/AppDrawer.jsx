<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer as MuiDrawer, Divider, List, ListItemButton, ListItemText, ListItemIcon
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import RoutesConfig from './RoutesConfig';
import Logo from '../assets/Logo/newLogo.svg';
import blackLogo from '../assets/Logo/blackLogo.svg';
=======
import React, { useState, useEffect } from 'react';
import {
  Drawer as MuiDrawer, Divider, List, ListItemButton, ListItemText, ListItemIcon, Box
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import RoutesConfig from './RoutesConfig';
import Logo from '../assets/Logo/newLogo.svg'
import blackLogo from '../assets/Logo/blackLogo.svg'
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
import { useMode } from '../providers/ModeProvider';

const drawerWidth = 240;

const AppDrawer = ({ open, onClose }) => {
  const location = useLocation();
<<<<<<< HEAD
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { mode } = useMode();
  const listItemRefs = useRef([]);
=======
  const [selectedIndex, setSelectedIndex] = useState();
  const { mode } = useMode();
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c

  useEffect(() => {
    const currentPath = location.pathname;
    const selectedItemIndex = RoutesConfig.findIndex(item => item.to === currentPath);
<<<<<<< HEAD

    setSelectedIndex(selectedItemIndex);

    // Manage session storage and logging
    
    
  }, [location.pathname]);

  useEffect(() => {
    if (selectedIndex !== null && listItemRefs.current[selectedIndex]) {
      listItemRefs.current[selectedIndex].focus();
    }
  }, [selectedIndex]);

=======
    setSelectedIndex(selectedItemIndex);
  }, [location.pathname]);

>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
  return (
    <MuiDrawer
      variant="persistent"
      open={open}
      onClose={onClose}
      sx={{
<<<<<<< HEAD
        width: drawerWidth,
=======
        w: drawerWidth,
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        },
      }}
    >
      <div className="flex items-center p-1 justify-end">
        <div className="flex justify-center w-full">
          <img
            className="h-20 w-40 object-fill m-2"
            alt="ML INFOMAP"
<<<<<<< HEAD
            src={mode === 'light' ? Logo : blackLogo}
          />
        </div>
      </div>
      <Divider sx={{ backgroundColor: 'divider' }} />
      <List>
        {RoutesConfig.map((route, index) => (
          <ListItemButton
            component={Link}
            to={route.to}
            key={route.to}
            ref={el => listItemRefs.current[index] = el} // Assign ref to the button
            selected={selectedIndex === index} // Use `selected` for styling
            sx={{
              '&.Mui-selected': {
=======
            src={mode == 'light' ? Logo : blackLogo}
          />
        </div>
      </div>
      <Divider sx={{backgroundColor: 'divider'}}/>
      <List>
        {RoutesConfig.map((route, index) => (
          <ListItemButton component={Link} to={route.to} key={route.to}
            // selected={selectedIndex === index}
            autoFocus={selectedIndex === index}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.dark',
                color: 'primary.contrastText',
              },
              '&:focus': {
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
                backgroundColor: 'primary.dark',
                color: 'primary.contrastText',
                borderRadius: '10px',
                ml: '5px', mr: '5px', mt: '1px', mb: '1px'
              },
<<<<<<< HEAD
              // '&:hover': {
              //   backgroundColor: 'primary.dark',
              //   color: 'primary.contrastText',
              //   borderRadius: '10px',
              //   ml: '5px', mr: '5px', mt: '1px', mb: '1px'
              // },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.contrastText' }}>{route.icon}</ListItemIcon>
=======
            }}
          >
            <ListItemIcon primary={route.name} sx={{ color: 'primary.contrastText' }}>{route.icon}</ListItemIcon>
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
            <ListItemText primary={route.name} />
          </ListItemButton>
        ))}
      </List>
    </MuiDrawer>
  );
<<<<<<< HEAD
};

export default AppDrawer;
=======
}
export default AppDrawer;
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
