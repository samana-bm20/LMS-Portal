// src/components/AppFooter.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const AppFooter = () => (
  <Box sx={{ p: 2, mt: 'auto', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
    <Typography variant="body2" color="textSecondary">
      © {new Date().getFullYear()} My App. All rights reserved.
    </Typography>
  </Box>
);

export default AppFooter;
