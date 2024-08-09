import React, { useState, useEffect } from 'react'
import { Box, TextField, InputLabel, Select, MenuItem, FormControl, alpha, useTheme } from '@mui/material'
import Config from '../../Config';
import axios from 'axios';

const AddLead = ({ handleLeadDataChange }) => {
    const theme = useTheme();
    const primaryColorWithOpacity = alpha(theme.palette.primary.main, 0.1); // Adjust opacity as needed
    const [leadID, setLeadID] = useState('');
    const [product, setProduct] = useState('');
    const [status, setStatus] = useState('');
    const [newLeadData, setNewLeadData] = useState({
        LID: 0,
        name: '',
        designationDept: '',
        organizationName: '',
        contact: {
            mobileNo: '',
            emailID: ''
        },
        address: '',
        PID: '',
        pName: '',
        status: '',
        source: '',
        assignedTo: ''
    });
    const productOptions = {
        'P1': 'Business Analyst',
        'P2': 'EIGAP',
        'P3': 'MapData',
        'P4': 'LRS',
      };

    //#region Max LID
    useEffect(() => {
        const getMaxLID = async () => {
            try {
                const response = await axios.get(`${Config.apiUrl}/getMaxLID`);
                setLeadID(response.data[0].LID);
                setNewLeadData((prev) => ({
                    ...prev,
                    LID: parseInt(response.data[0].LID + 1, 10),
                }));
            } catch (error) {
                console.error(error);
            }
        };
        getMaxLID();
    }, []);

    //#region Field Change
    const handleNewLeadChange = (e) => {
        const { name, value } = e.target;
        if (name == 'status') {
            setStatus(value);
        }
        setNewLeadData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setProduct(value);
        setNewLeadData((prev) => ({
            ...prev,
            PID: value,
            [name]: productOptions[value],
        }));
    };

    const handleNestedChange = (e) => {
        const { name, value } = e.target;
        setNewLeadData(prev => ({
            ...prev,
            contact: {
                ...prev.contact,
                [name]: value
            }
        }));
    };

    //#region Form Data
    useEffect(() => {
        handleLeadDataChange(newLeadData);
    }, [newLeadData, handleLeadDataChange]);

    return (
        <Box className="p-4 rounded-lg shadow-md" component="form"
            sx={{ backgroundColor: primaryColorWithOpacity }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="mb-2">
                    <TextField
                        required
                        name='LID'
                        id="outlined-required"
                        label="LID"
                        size='small'
                        value={leadID + 1}
                        disabled
                    // onChange={handleNewLeadChange}
                    />
                </div>
                <div className="mb-2">
                    <TextField
                        required
                        name='name'
                        id="outlined-required"
                        label="Lead Name"
                        size='small'
                        onChange={handleNewLeadChange}
                    />
                </div>
                <div className="mb-2">
                    <TextField
                        name='mobileNo'
                        id="outlined"
                        label="Contact"
                        size='small'
                        onChange={handleNestedChange}
                    />
                </div>
                <div className="mb-2">
                    <TextField
                        name='emailID'
                        id="outlined"
                        label="Email ID"
                        size='small'
                        onChange={handleNestedChange}
                    />
                </div>
                <div className="mb-2">
                    <TextField
                        name='designationDept'
                        id="outlined"
                        label="Designation/Dept."
                        size='small'
                        onChange={handleNewLeadChange}
                    />
                </div>
                <div className="mb-2">
                    <TextField
                        required
                        name='organizationName'
                        id="outlined-required"
                        label="Organization"
                        size='small'
                        onChange={handleNewLeadChange}
                    />
                </div>
            </div>
            <div className='mt-2 mb-4'>
                <TextField
                    name='address'
                    id="outlined"
                    label="Address"
                    fullWidth
                    onChange={handleNewLeadChange}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="mb-2">
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Product Name</InputLabel>
                    <Select
                        name='pName'
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Product Name"
                        value={product}
                        onChange={handleProductChange}
                        size='small'
                    >
                        <MenuItem value='P1'>Business Analyst</MenuItem>
                        <MenuItem value='P2'>EIGAP</MenuItem>
                        <MenuItem value='P3'>MapData</MenuItem>
                        <MenuItem value='P4'>LRS</MenuItem>
                    </Select>
                    </FormControl>
                </div>
                <div className="mb-2">
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                        name='status'
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Status"
                        value={status}
                        onChange={handleNewLeadChange}
                        size='small'
                    >
                        <MenuItem value='spoke'>spoke</MenuItem>
                        <MenuItem value='proposal sent'>proposal sent</MenuItem>
                        <MenuItem value='active'>active</MenuItem>
                        <MenuItem value='inactive'>inactive</MenuItem>
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
                        onChange={handleNewLeadChange}
                    />
                </div>
                <div className="mb-2">
                    <TextField
                        required
                        name='assignedTo'
                        id="outlined-required"
                        label="Assigned To"
                        size='small'
                        onChange={handleNewLeadChange}
                    />
                </div>
            </div>
        </Box>
    );
}

export default AddLead;