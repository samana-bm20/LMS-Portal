import React, { useState } from 'react'
import { Card, CardContent, Avatar, IconButton, useTheme, alpha } from '@mui/material'
import { EmailRounded, PhoneRounded, PersonRounded, EditRounded } from '@mui/icons-material';
import { useDetails } from '../../providers/DetailsProvider';
import EditUser from './EditUser';

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#00';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name) {
  if (!name) {
    return {
      sx: {
        bgcolor: '#ccc', // Default color if name is not provided
      },
      children: 'ML', // Default placeholder if name is empty
    };
  }

  const nameParts = name.split(' ');
  const firstInitial = nameParts[0] ? nameParts[0][0] : '';
  const secondInitial = nameParts[1] ? nameParts[1][0] : '';

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${firstInitial}${secondInitial}`,
  };
}


const UserList = () => {
  const theme = useTheme();
  const { userValues } = useDetails();
  const loguser = JSON.parse(sessionStorage.getItem('user'));
  const [userID, setUserID] = useState();
  const [openEditUser, setOpenEditUser] = useState(false);

  const handleEditUser = (uid) => {
    setUserID(uid);
    setOpenEditUser(true);
  }
  return (
    <>
      <div className='grid gap-2 grid-cols-1'>
        {userValues.map(user => (
          <Card key={user.UID} className="flex border" sx={{ borderColor: theme.palette.primary.main }}>
            <div className='flex items-center'>
              <Avatar {...stringAvatar(`${user.uName}`)} className='mx-4 p-7 font-bold' />
            </div>
            <CardContent sx={{ flexGrow: 1 }}>
              <div className='flex items-center'>
                <div className="flex items-center">
                  <div className="text-lg font-semibold mr-2">{user.uName}</div>
                </div>
                <div className="text-sm rounded-md px-2" style={{
                  border: '1px solid',
                  borderColor: user.uStatus == 'Active' ? theme.palette.success.main : theme.palette.error.main,
                  color: user.uStatus == 'Active' ? theme.palette.success.main : theme.palette.error.main,
                  backgroundColor: user.uStatus == 'Active' ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2)
                }}>
                  {user.uStatus}
                </div>
              </div>
              <div className='flex gap-10'>
                <div className="flex">
                  <EmailRounded fontSize='small' color='primary' />
                  <div className="ml-2 text-sm">{user.email}</div>
                </div>
                <div className="flex">
                  <PhoneRounded fontSize='small' color='primary' />
                  <div className='ml-2 text-sm'>{user.mobile}</div>
                </div>
                <div className="flex">
                  <PersonRounded fontSize='small' color='primary' />
                  <div className='ml-2 text-sm'>{user.userType == 1 ? 'Admin' : 'User'}</div>
                </div>
              </div>
            </CardContent>
            <div className="flex items-center justify-end mb-2">
              <div className="text-md font-semibold rounded-lg px-2 py-1 mx-4" style={{
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                border: '1px solid',
                borderColor: theme.palette.primary.main
              }}>
                {user.UID}
              </div>
              {loguser.userType == 1 && (
                <IconButton aria-label="edit" sx={{ mx: 1 }} onClick={() => handleEditUser(user.UID)} >
                  <EditRounded color='primary' />
                </IconButton>
              )}
            </div>
          </Card>
        ))}
      </div>
      <EditUser
        openEditUser={openEditUser}
        setOpenEditUser={setOpenEditUser}
        uid={userID}
      />
    </>
  )
}

export default UserList