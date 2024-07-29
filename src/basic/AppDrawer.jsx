// src/components/AppDrawer.js
import React from 'react';
import { Drawer as MuiDrawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import RoutesConfig from './RoutesConfig';

const drawerWidth = 240;

const AppDrawer = ({ open, onClose }) => (
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
      },
    }}
  >
    <List>
      {RoutesConfig.map((route) => (
        <ListItem button component={Link} to={route.path} key={route.path}>
          <ListItemText primary={route.label} />
        </ListItem>
      ))}
    </List>
  </MuiDrawer>
);

export default AppDrawer;
