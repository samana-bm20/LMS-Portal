// src/components/AppFooter.js
import React from 'react';
import { Box, Typography } from '@mui/material';
const drawerWidth = 240;

const AppFooter = ({ open }) => (
  <Box
    className='p-4 text-center shadow-md text-sm text-gray-600 flex justify-between item-center'
    sx={{
      backgroundColor: 'background.footer',
      color: 'text.secondary',
      w: open ? `calc(auto - ${drawerWidth}px)` : 'auto',
      ml: open ? `${drawerWidth}px` : 0,
      transition: 'width 0.3s ease, margin-left 0.3s ease'
    }}
  >
    <div>
        © {new Date().getFullYear()} LMS
      </div>
      <div>
        All rights reserved by ML Infomap.
      </div>
  </Box>
);

export default AppFooter;
