import React, { useState, useEffect } from 'react';
import {
  Drawer as MuiDrawer, Divider, List, ListItemButton, ListItemText, ListItemIcon, Box
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import RoutesConfig from './RoutesConfig';
import Logo from '../assets/newLogo.svg'

const drawerWidth = 240;

const AppDrawer = ({ open, onClose }) => {
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState();

  useEffect(() => {
    const currentPath = location.pathname;
    const selectedItemIndex = RoutesConfig.findIndex(item => item.to === currentPath);
    setSelectedIndex(selectedItemIndex);
  }, [location.pathname]);

  return (
    <MuiDrawer
      variant="persistent"
      open={open}
      onClose={onClose}
      sx={{
        w: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#0245A3',
          color: '#fff',
        },
      }}
    >
      <div className="flex items-center p-1 justify-end">
        <div className="flex justify-center w-full">
          <img
            className="h-20 w-40 object-fill m-2"
            alt="ML INFOMAP"
            src={Logo}
          />
        </div>
      </div>
      <Divider />
      <List>
        {RoutesConfig.map((route, index) => (
          <ListItemButton component={Link} to={route.to} key={route.to}
            selected={selectedIndex == index}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.dark',
                color: 'primary.contrastText',
              },
              '&:focus': {
                backgroundColor: 'primary.dark',
                color: 'primary.contrastText',
                borderRadius: '10px',
                ml: '5px', mr: '5px', mt: '1px', mb: '1px'
              }
            }}
          >
            <ListItemIcon primary={route.name} sx={{ color: '#fff' }}>{route.icon}</ListItemIcon>
            <ListItemText primary={route.name} />
          </ListItemButton>
        ))}
      </List>
    </MuiDrawer>
  );
}
export default AppDrawer;
