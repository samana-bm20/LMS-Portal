import React, { useState, useEffect } from 'react'
import {
  Paper, Button, MenuItem, FormControl, TextField, InputLabel, Select, Dialog,
  DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { Config } from '../../Config';
import axios from 'axios';
import { useDetails } from '../../providers/DetailsProvider';
import { useAuth } from '../../providers/AuthProvider';

const AddNewProduct = ({ openAddProduct, setOpenAddProduct }) => {
  const token = sessionStorage.getItem('token');
  const user = JSON.parse(sessionStorage.getItem('user'));
  const { socket } = useAuth();
  const { fetchProducts } = useDetails();
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addProductData, setAddProductData] = useState({});

  useEffect(() => {
    if (openAddProduct) {
      setAddProductData({
        pName: '',
        tagline: '',
        pDescription: '',
        owner: '',
      })
    }
  }, [openAddProduct]);

  //#region Field Change
  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setAddProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const closeAddProduct = () => {
    setOpenAddProduct(false);
  }

  //#region Add Product
  const handleAddProduct = async () => {
    if (!addProductData.pName || !addProductData.tagline || !addProductData.owner || !addProductData.pDescription) {
      setErrorMessage('Required fields cannot be empty.')
      setError(true);
      return;
    }
    try {
      const _ = await axios.post(`${Config.apiUrl}/addNewProduct`, addProductData, {
        headers: {
          'Authorization': token
        }
      });

      socket.emit('newProduct', addProductData.pName, user.UID);
      setOpenAddProduct(false);
      fetchProducts();
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
        open={openAddProduct}
        onClose={closeAddProduct}
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
            <div className="mb-4">
              <TextField
                required
                name='pName'
                id="outlined-required"
                label="Product Name"
                size='small'
                value={addProductData?.pName}
                onChange={handleDataChange}
              />
            </div>
            <div className="mb-4">
              <TextField
                required
                name='tagline'
                id="outlined-required"
                label="Tagline"
                size='small'
                value={addProductData?.tagline}
                onChange={handleDataChange}
              />
            </div>
            <div className="mb-4">
              <FormControl required fullWidth>
                <InputLabel id="demo-simple-select-label">Owned By</InputLabel>
                <Select
                  name='owner'
                  id="demo-simple-select"
                  label="Owned By"
                  value={addProductData?.owner}
                  onChange={handleDataChange}
                  size='small'
                >
                  <MenuItem value='ESRI'>ESRI</MenuItem>
                  <MenuItem value='ML Infomap Pvt. Ltd'>ML Infomap Pvt. Ltd</MenuItem>
                </Select>

              </FormControl>
            </div>
            <div className='mb-4'>
              <TextField
                required
                name='pDescription'
                id="outlined"
                label="Description"
                fullWidth
                multiline
                variant="outlined"
                value={addProductData?.pDescription}
                onChange={handleDataChange}
                inputProps={{
                  style: {
                    overflow: 'auto',
                    whiteSpace: 'nowrap',
                  },
                }}
              />
            </div>
          </Paper>
        </DialogContent>
        <DialogActions>
          <div className='m-4'>
            <Button onClick={closeAddProduct}>Cancel</Button>
            <Button variant='contained' onClick={handleAddProduct}>Add</Button>
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
          New product added successfully!
        </Alert>
      </Snackbar>

    </>
  )
}

export default AddNewProduct