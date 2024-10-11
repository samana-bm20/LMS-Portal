import React, { useState, useEffect } from 'react'
import {
  Paper, Button, MenuItem, FormControl, TextField, InputLabel, Select, Dialog,
  DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { Config } from '../../Config';
import axios from 'axios';
import { useDetails } from '../../providers/DetailsProvider';
import { useAuth } from '../../providers/AuthProvider';

const AddUser = ({ openAddUser, setOpenAddUser }) => {
  const token = sessionStorage.getItem('token');
  const { fetchUsers } = useDetails();
  const {socket} = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addUserData, setAddUserData] = useState({});

  useEffect(() => {
    if (openAddUser) {
      setAddUserData({
        uName: '',
        username: '',
        password: '',
        email: '',
        mobile: '',
        userType: '',
        uStatus: '',
      })
    }
  }, [openAddUser]);

  //#region Field Change
  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setAddUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const closeAddUser = () => {
    setOpenAddUser(false);
  }

  //#region Add Product
  const handleAddUser = async () => {
    if (!addUserData.uName || !addUserData.username || !addUserData.password || !addUserData.email ||
      !addUserData.mobile || !addUserData.userType || !addUserData.uStatus) {
      setErrorMessage('Required fields cannot be empty.')
      setError(true);
      return;
    }
    try {
      const _ = await axios.post(`${Config.apiUrl}/addUser`, addUserData, {
        headers: {
          'Authorization': token
        }
      });
      socket.emit('newUser', addUserData);
      setOpenAddUser(false);
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
        open={openAddUser}
        onClose={closeAddUser}
      >
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
            <div className="mb-4">
              <TextField
                required
                name='uName'
                id="outlined-required"
                label="Name"
                size='small'
                value={addUserData?.uName}
                onChange={handleDataChange}
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
                  value={addUserData?.username}
                  onChange={handleDataChange}
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
                  value={addUserData?.password}
                  onChange={handleDataChange}
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
                  value={addUserData?.email}
                  onChange={handleDataChange}
                />
              </div>
              <div className="mb-4">
                <TextField
                  required
                  name='mobile'
                  id="outlined-required"
                  label="Mobile"
                  size='small'
                  value={addUserData?.mobile}
                  onChange={handleDataChange}
                />
              </div>
              <div className="mb-4">
                <FormControl required fullWidth>
                  <InputLabel id="demo-simple-select-label">User Type</InputLabel>
                  <Select
                    name='userType'
                    id="demo-simple-select"
                    label="User Type"
                    value={addUserData?.userType}
                    onChange={handleDataChange}
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
                    value={addUserData?.uStatus}
                    onChange={handleDataChange}
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
            <Button onClick={closeAddUser}>Cancel</Button>
            <Button variant='contained' onClick={handleAddUser}>Add</Button>
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
          New user added successfully!
        </Alert>
      </Snackbar>

    </>
  )
}

export default AddUser