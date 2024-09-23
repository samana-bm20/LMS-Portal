import React, { useState, useEffect } from 'react'
import { Paper, TextField, InputLabel, Select, MenuItem, FormControl } from '@mui/material'
import { useDetails } from '../../providers/DetailsProvider';

const AddLead = ({ handleLeadDataChange }) => {
    const { statusValues, productValues, userValues, loggedUser } = useDetails();
    const user = userValues.filter((user) => user.username === loggedUser);
    const [product, setProduct] = useState('');
    const [status, setStatus] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [newLeadData, setNewLeadData] = useState({
        name: '',
        designationDept: '',
        organizationName: '',
        contact: {
            mobileNo: '',
            emailID: ''
        },
        address: '',
        PID: '',
        SID: '',
        UID: '',
        source: '',
    });

    //#region Field Change
    const handleNewLeadChange = (e) => {
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
        setNewLeadData((prev) => ({
            ...prev,
            [name]: value,
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
        <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
            <div className="grid gap-2">
                {/* <div className="mb-2">
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
                </div> */}
                <div className="mb-2">
                    <TextField
                        required
                        name='name'
                        id="outlined-required"
                        label="Lead Name"
                        size='small'
                        onChange={handleNewLeadChange}
                        fullWidth
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="mb-2">
                    <TextField
                        name='mobileNo'
                        id="outlined"
                        label="Mobile No."
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
                    <FormControl required fullWidth>
                        <InputLabel id="demo-simple-select-label">Product Name</InputLabel>
                        <Select
                            name='PID'
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Product Name"
                            value={product}
                            onChange={handleNewLeadChange}
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
                            onChange={handleNewLeadChange}
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
                        onChange={handleNewLeadChange}
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
                            onChange={handleNewLeadChange}
                            size='small'
                        >
                            {user[0]?.userType === 1 ? (
                                userValues.map((user) => (
                                    <MenuItem key={user.UID} value={user.UID}>{user.uName}</MenuItem>
                                ))
                            ) : (
                                userValues
                                .filter((userItem) => userItem.UID == user[0]?.UID)
                                .map((userItem) => (
                                    <MenuItem key={userItem.UID} value={userItem.UID}>{userItem.uName}</MenuItem>
                                ))
                            )}

                        </Select>
                    </FormControl>
                </div>
            </div>
        </Paper>
    );
}

export default AddLead;