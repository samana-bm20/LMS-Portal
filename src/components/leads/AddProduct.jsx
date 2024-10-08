import React, { useState, useEffect } from 'react'
import {
    Paper, Button, MenuItem, FormControl, TextField, InputLabel, Select, Dialog,
    DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { Config } from '../../Config';
import axios from 'axios';
import { useDetails } from '../../providers/DetailsProvider';
import { useFetchLeads } from '../../providers/FetchLeadsProvider';
import { useAuth } from '../../providers/AuthProvider';

const AddProduct = ({ openAddProduct, setOpenAddProduct, lid }) => {
    const token = sessionStorage.getItem('token');
    const { fetchLeadsData } = useFetchLeads();
    const { socket } = useAuth();
    const { statusValues, productValues, userValues } = useDetails();
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [product, setProduct] = useState('');
    const [status, setStatus] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [productData, setProductData] = useState({
        LID: 0,
        PID: '',
        SID: '',
        UID: '',
        source: '',
    });
    const activeUsers = userValues.filter(user => user.uStatus == 'Active');

    //#region Set LID
    useEffect(() => {
        const setLID = () => {
            setProductData((prev) => ({
                ...prev,
                LID: lid,
            }));
        }
        setLID();
    }, [lid]);

    //#region Field Change
    const handleDataChange = (e) => {
        const { name, value } = e.target;
        if (name == 'PID') {
            setProduct(value);
        }
        if (name == 'SID') {
            setStatus(value);
        }
        if (name == 'UID') {
            setAssignedTo(value);
        }
        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const closeAddProduct = () => {
        setOpenAddProduct(false);
        setProduct('');
        setStatus('');
        setAssignedTo('');
    }

    //#region Add Product
    const handleAddProduct = async () => {
        if (!productData.PID || !productData.SID || !productData.source || !productData.UID) {
            setErrorMessage('Required fields cannot be empty.')
            setError(true);
            return;
        }
        try {
            const _ = await axios.post(`${Config.apiUrl}/addProduct`, productData, {
                headers: {
                    'Authorization': token
                }
            });
            socket.emit('leadProduct', productData);
            fetchLeadsData();
            setOpenAddProduct(false);
            setSuccess(true);
            setProductData({
                LID: 0,
                PID: '',
                SID: '',
                UID: '',
                source: '',
            });
            setProduct('');
            setStatus('');
            setAssignedTo('');
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
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="mb-2">
                                <FormControl required fullWidth>
                                    <InputLabel id="demo-simple-select-label">Product Name</InputLabel>
                                    <Select
                                        required
                                        name='PID'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Product Name"
                                        value={product}
                                        onChange={handleDataChange}
                                        size='small'
                                    >
                                        {productValues.map((product) => (
                                            <MenuItem key={product.PID} value={product.PID}>{product.pName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="mb-2">
                                <FormControl required fullWidth>
                                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                    <Select
                                        name='SID'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Status"
                                        value={status}
                                        onChange={handleDataChange}
                                        size='small'
                                    >
                                        {statusValues.map((status) => (
                                            <MenuItem key={status.SID} value={status.SID}>{status.sName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="mb-2">
                                <TextField
                                    required
                                    name='source'
                                    id="outlined-required"
                                    label="Source"
                                    size='small'
                                    onChange={handleDataChange}
                                />
                            </div>
                            <div className="mb-2">
                                <FormControl required fullWidth>
                                    <InputLabel id="demo-simple-select-label">Assigned To</InputLabel>
                                    <Select
                                        name='UID'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Assigned To"
                                        value={assignedTo}
                                        onChange={handleDataChange}
                                        size='small'
                                    >
                                        {activeUsers.map((user) => (
                                            <MenuItem key={user.UID} value={user.UID}>{user.uName}</MenuItem>
                                        ))}
                                    </Select>

                                </FormControl>
                            </div>
                        </div>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <div className='m-4'>
                        <Button onClick={closeAddProduct}>Cancel</Button>
                        <Button variant='contained' onClick={handleAddProduct}>Submit</Button>
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

export default AddProduct