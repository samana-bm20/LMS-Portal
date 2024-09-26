import React, { useEffect, useState } from 'react'
import {
  Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, 
  InputLabel, Select, MenuItem, Snackbar, Alert,
} from '@mui/material';
import { useDetails } from '../../providers/DetailsProvider'
import axios from 'axios';
import Config from '../../Config';

const EditProduct = ({ openEditProduct, setOpenEditProduct, pid }) => {
  const { fetchProducts, productValues } = useDetails();
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  let currentProduct;
  const [editProductData, setEditProductData] = useState({
    pName: '',
    tagline: '',
    pDescription: '',
    owner: '',
  });

  const getProductData = async () => {
    try {
      currentProduct = productValues.filter(product => product.PID === pid)
      setEditProductData((prev) => ({
        ...prev,
        pName: currentProduct[0]?.pName,
        tagline: currentProduct[0]?.tagline,
        pDescription: currentProduct[0]?.pDescription,
        owner: currentProduct[0]?.owner,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (openEditProduct) {
      getProductData();
    }
  }, [pid, openEditProduct]);

  const handleEditProductChange = (e) => {
    const { name, value } = e.target;
    setEditProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleEditProduct = async () => {
    if (!editProductData.pName || !editProductData.tagline || !editProductData.owner || !editProductData.pDescription) {
      setErrorMessage('Required fields cannot be empty.')
      setError(true);
      return;
    }

    try {
      await axios.put(`${Config.apiUrl}/editProduct/${pid}`, editProductData);
      setOpenEditProduct(false);
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

  const closeEditProduct = () => {
    setOpenEditProduct(false);
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
        open={openEditProduct}
        onClose={closeEditProduct}
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
        <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
            <div className="mb-4">
              <TextField
                required
                name='pName'
                id="outlined-required"
                label="Product Name"
                size='small'
                value={editProductData?.pName}
                onChange={handleEditProductChange}
              />
            </div>
            <div className="mb-4">
              <TextField
                required
                name='tagline'
                id="outlined-required"
                label="Tagline"
                size='small'
                value={editProductData?.tagline}
                onChange={handleEditProductChange}
              />
            </div>
            <div className="mb-4">
              <FormControl required fullWidth>
                <InputLabel id="demo-simple-select-label">Owned By</InputLabel>
                <Select
                  name='owner'
                  id="demo-simple-select"
                  label="Owned By"
                  value={editProductData?.owner}
                  onChange={handleEditProductChange}
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
                value={editProductData?.pDescription}
                onChange={handleEditProductChange}
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
            <Button onClick={closeEditProduct}>Cancel</Button>
            <Button variant='contained' onClick={handleEditProduct}>Edit</Button>
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

export default EditProduct