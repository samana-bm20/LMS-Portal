import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Avatar, useTheme, alpha } from '@mui/material';
import { FiberManualRecordRounded } from '@mui/icons-material';
import { useDetails } from '../providers/DetailsProvider';
import { useAuth } from '../providers/AuthProvider';
import axios from 'axios';
import { Config } from '../Config';

const AppNotifications = ({ anchorNotif, handleCloseNotification, fetchNotifCount }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { socket } = useAuth();
  const user = JSON.parse(sessionStorage.getItem('user'));
  const token = sessionStorage.getItem('token');
  const { notifications, fetchNotifications, userValues } = useDetails();
  const userNotifications = notifications
    .filter(notification => notification.targetUsers.some(target => target.uid === user.UID))
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  //#region Socket
  useEffect(() => {
    if (socket) {
      const fetchNotification = () => {
        fetchNotifications(); // Fetch new notifications
        fetchNotifCount(); // Fetch the updated count
      };
  
      // Attach listener
      socket.on("receiveNotification", fetchNotification);
  
      // Cleanup on unmount or socket change
      return () => {
        socket.off('receiveNotification', fetchNotification);
      };
    }
  }, [socket]);  // Trigger only when socket changes
  

  //#region Avatar
  const stringToColor = (string) => {
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

  const stringAvatar = (name) => {
    if (!name) {
      return {
        sx: {
          bgcolor: '#ccc',
        },
        children: 'ML',
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

  //#region Type-Message
  const typeMessage = {
    "newLead": "assigned you a new lead",
    "newLeadUser": "added a new lead",
    "newFollowup": "added a new follow-up for lead",
    "nextFollowup": "added a new and scheduled next follow-up for lead",
    "newTask": "assigned you a new task",
    "newTaskUser": "scheduled a new task",
    "newProduct": "added a new product",
    "newUser": "added a new user",
    "leadProduct": "assigned you a new product for lead",
    "leadProductSelf": "added a new product for lead",
    "leadProductUser": "assigned someone a new product for lead",
    "editLead": "updated details of lead",
    "editTask": "updated details of task",
    "editProduct": "updated details of product",
    "editUser": "updated details of user",
    "editFollowup": "changed the next follow-up of lead",
    "assignFollowup": "assigned you the next follow-up of lead",
    "adminFollowup": "assigned someone the next follow-up of lead"
  }

  //#region Time Difference
  const formatTimeDifference = (time) => {
    const currentTime = new Date();
    const recordTime = new Date(time);
    const differenceInSeconds = Math.floor((currentTime - recordTime) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds}s ago`; // Less than 1 minute
    }

    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    if (differenceInMinutes === 1) {
      return `${differenceInMinutes} min ago`; // Exactly 1 min
    }

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} mins ago`; // Less than 1 hour
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours === 1) {
      return `${differenceInHours} hour ago`; // Exactly 1 hour
    }

    if (differenceInHours < 24) {
      return `${differenceInHours} hours ago`; // Less than 24 hours
    }

    const differenceInDays = Math.floor(differenceInHours / 24);
    if (differenceInDays === 1) {
      return `${differenceInDays} day ago`; // Exactly 1 day
    } else if (differenceInDays < 7) {
      return `${differenceInDays} days ago`; // Less than 7 days
    } else if (differenceInDays === 7) {
      return '1 week ago';          // Exactly 1 week    
    } else if (differenceInDays > 7) {
      return `${recordTime.getDate()} ${recordTime.toLocaleString('default', { month: 'short' })} ${recordTime.getFullYear()}`;
    }
  }

  //#region Mark As Read
  const markAsRead = async (notification) => {
    const targetUser = notification.targetUsers.find(target => target.uid === user.UID);
    if (targetUser && !targetUser.hasRead) {
      const params = {
        notificationId: notification._id,
        userId: user.UID
      }
      try {
        await axios.put(`${Config.apiUrl}/readNotification`, params, {
          headers: {
            'Authorization': token
          }
        });
        fetchNotifications();
        fetchNotifCount();
      } catch (error) {
        console.error('Error updating notification status:', error);
      }
    }
    navigate(`/lms/${notification.redirect}`);
    window.location.reload();
    handleCloseNotification();
  };


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
      PaperProps={{
        sx: {
          width: '400px',
          maxHeight: '400px',
          overflow: 'auto',
          scrollbarWidth: 'thin'
        }
      }}
    >
      {userNotifications.length == 0 ? (
        <div className='m-2 p-2 text-md font semibold text-center italic'
          style={{ color: theme.palette.text.secondary }}>No notifications</div>
      ) : (
        userNotifications.map((notif, index) => {
          const currentUser = userValues.find((user) => user.UID === notif.sentBy);
          const userName = currentUser.uName
          return (
            <MenuItem key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
              onClick={() => markAsRead(notif)}
            >
              <div className='flex items-center'>
                <div>
                  <Avatar {...stringAvatar(userName)} className='mr-4 p-5 w-20 h-20' />
                </div>
                <div className="grid">
                  <div
                    className='text-sm pr-1 text-wrap'
                    style={{
                      color: notif.targetUsers.find(target => target.uid === user.UID)?.hasRead ?
                        theme.palette.text.secondary : theme.palette.text.primary
                    }}
                  >
                    <b>{userName}</b> {typeMessage[notif.eventType]} <b>{notif.keyword}</b>
                  </div>
                  <div className="text-xs" style={{ color: theme.palette.text.secondary }} >{formatTimeDifference(notif.time)}</div>
                </div>
              </div>
              <div
                className='flex'
                style={{ visibility: !notif.targetUsers.find(target => target.uid === user.UID)?.hasRead ? 'visible' : 'hidden' }}
              >
                <FiberManualRecordRounded color='primary' fontSize='small' />
              </div>
            </MenuItem>
          );
        }))}
    </Menu>
  )
}

export default AppNotifications