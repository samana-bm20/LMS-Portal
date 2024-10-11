import React, { useEffect, useState } from 'react'
import {
  Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, Snackbar, Alert,
} from '@mui/material';
import { useDetails } from '../../providers/DetailsProvider'
import { useAuth } from '../../providers/AuthProvider';
import axios from 'axios';
import { Config } from '../../Config';

const EditUser = ({ openEditUser, setOpenEditUser, uid }) => {
  const token = sessionStorage.getItem('token');
  const { fetchUsers, userValues } = useDetails();
  const { socket } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  let currentUser;
  const [editUserData, setEditUserData] = useState({
    uName: '',
    username: '',
    password: '',
    email: '',
    mobile: '',
    userType: '',
    uStatus: '',
  });

  //#region Fetch Data
  const getUserData = async () => {
    try {
      currentUser = userValues.filter(user => user.UID === uid)
      setEditUserData((prev) => ({
        ...prev,
        uName: currentUser[0]?.uName,
        username: currentUser[0]?.username,
        password: currentUser[0]?.password,
        email: currentUser[0]?.email,
        mobile: currentUser[0]?.mobile,
        userType: currentUser[0]?.userType,
        uStatus: currentUser[0]?.uStatus
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (openEditUser) {
      getUserData();
    }
  }, [uid, openEditUser]);

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  //#region Edit User
  const handleEditUser = async () => {
    if (!editUserData.uName || !editUserData.username || !editUserData.password ||
      !editUserData.email || !editUserData.mobile) {
      setErrorMessage('Required fields cannot be empty.')
      setError(true);
      return;
    }

    const params = {
      UID: uid,
      data: editUserData
    }
    try {
      await axios.put(`${Config.apiUrl}/editUser`, params, {
        headers: {
          'Authorization': token
        }
      });
      socket.emit('editUser', editUserData, uid);
      setOpenEditUser(false);
      fetchUsers();
      setSuccess(true);
      setErrorMessage('');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(true);
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  const closeEditUser = () => {
    setOpenEditUser(false);
  }

  //#region Snackbar
  const errorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(false);
  };

  const successClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess(false);
  };

  return (
    <>
      <Dialog
        open={openEditUser}
        onClose={closeEditUser}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
            <div className="mb-4">
              <TextField
                required
                name='uName'
                id="outlined-required"
                label="Name"
                size='small'
                value={editUserData?.uName}
                onChange={handleEditUserChange}
                fullWidth
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="mb-4">
                <TextField
                  required
                  name='username'
                  id="outlined-required"
                  label="Username"
                  size='small'
                  value={editUserData?.username}
                  onChange={handleEditUserChange}
                />
              </div>
              <div className="mb-4">
                <TextField
                  required
                  type='password'
                  name='password'
                  id="outlined-required"
                  label="Password"
                  size='small'
                  value={editUserData?.password}
                  onChange={handleEditUserChange}
                  autoComplete='new-password'
                />
              </div>
              <div className="mb-4">
                <TextField
                  required
                  name='email'
                  id="outlined-required"
                  label="Email"
                  size='small'
                  value={editUserData?.email}
                  onChange={handleEditUserChange}
                />
              </div>
              <div className="mb-4">
                <TextField
                  required
                  name='mobile'
                  id="outlined-required"
                  label="Mobile"
                  size='small'
                  value={editUserData?.mobile}
                  onChange={handleEditUserChange}
                />
              </div>
              <div className="mb-4">
                <FormControl required fullWidth>
                  <InputLabel id="demo-simple-select-label">User Type</InputLabel>
                  <Select
                    name='userType'
                    id="demo-simple-select"
                    label="User Type"
                    value={editUserData?.userType}
                    onChange={handleEditUserChange}
                    size='small'
                  >
                    <MenuItem value='1'>Admin</MenuItem>
                    <MenuItem value='2'>User</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="mb-4">
                <FormControl required fullWidth>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    name='uStatus'
                    id="demo-simple-select"
                    label="Status"
                    value={editUserData?.uStatus}
                    onChange={handleEditUserChange}
                    size='small'
                  >
                    <MenuItem value='Active'>Active</MenuItem>
                    <MenuItem value='Inactive'>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </Paper>
        </DialogContent>
        <DialogActions>
          <div className='m-4'>
            <Button onClick={closeEditUser}>Cancel</Button>
            <Button variant='contained' onClick={handleEditUser}>Edit</Button>
          </div>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={error}
        autoHideDuration={2000}
        onClose={errorClose}>
        <Alert onClose={errorClose} severity="error" variant='filled'>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={success}
        autoHideDuration={2000}
        onClose={successClose}>
        <Alert onClose={successClose} severity="success" variant='filled'>
          Product edited successfully!
        </Alert>
      </Snackbar>
    </>
  )
}


export default EditUser