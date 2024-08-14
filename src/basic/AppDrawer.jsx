import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer as MuiDrawer, Divider, List, ListItemButton, ListItemText, ListItemIcon
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import RoutesConfig from './RoutesConfig';
import Logo from '../assets/Logo/newLogo.svg';
import blackLogo from '../assets/Logo/blackLogo.svg';
import { useMode } from '../providers/ModeProvider';

const drawerWidth = 240;

const AppDrawer = ({ open, onClose }) => {
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { mode } = useMode();
  const listItemRefs = useRef([]);

  useEffect(() => {
    const currentPath = location.pathname;
    const selectedItemIndex = RoutesConfig.findIndex(item => item.to === currentPath);

    setSelectedIndex(selectedItemIndex);

    // Manage session storage and logging
    
    
  }, [location.pathname]);

  useEffect(() => {
    if (selectedIndex !== null && listItemRefs.current[selectedIndex]) {
      listItemRefs.current[selectedIndex].focus();
    }
  }, [selectedIndex]);

  return (
    <MuiDrawer
      variant="persistent"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
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
                backgroundColor: 'primary.dark',
                color: 'primary.contrastText',
                borderRadius: '10px',
                ml: '5px', mr: '5px', mt: '1px', mb: '1px'
              },
              // '&:hover': {
              //   backgroundColor: 'primary.dark',
              //   color: 'primary.contrastText',
              //   borderRadius: '10px',
              //   ml: '5px', mr: '5px', mt: '1px', mb: '1px'
              // },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.contrastText' }}>{route.icon}</ListItemIcon>
            <ListItemText primary={route.name} />
          </ListItemButton>
        ))}
      </List>
    </MuiDrawer>
  );
};

export default AppDrawer;
