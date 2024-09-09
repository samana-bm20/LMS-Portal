import React from 'react'
import {
   Menu, MenuItem, Divider
  } from '@mui/material';

const AppNotifications = ({anchorNotif, handleCloseNotification}) => {
  return (
    <Menu
    sx={{ mt: '45px' }}
    id="menu-appbar"
    anchorEl={anchorNotif}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    keepMounted
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    open={Boolean(anchorNotif)}
    onClose={handleCloseNotification}
  >
<div className='px-2'>
<MenuItem>
      <div className='flex'>
        <div className='ml-2'>
          <p>Logout</p>
        </div>
      </div>
    </MenuItem>
</div>
  </Menu>
  )
}

export default AppNotifications