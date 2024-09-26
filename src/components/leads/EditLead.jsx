import React, { useEffect, useState } from 'react'
import {
    Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, 
} from '@mui/material';
import { useFetchLeads } from '../../providers/FetchLeadsProvider';
import axios from 'axios';
import Config from '../../Config';

const EditLead = ({ openEditLead, setOpenEditLead, lid }) => {
    const { fetchLeadsData, data } = useFetchLeads();
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    let currentLead;
    const [editLeadData, setEditLeadData] = useState({
        name: '',
        designationDept: '',
        organizationName: '',
        contact: {
            mobileNo: '',
            emailID: ''
        },
        address: '',
    });

    //#region Fetch Details
    const getLeadData = async () => {
        try {
            currentLead = data.filter(lead => lead.LID === lid)
            setEditLeadData((prev) => ({
                ...prev,
                name: currentLead[0]?.name || null,
                designationDept: currentLead[0]?.designationDept || null,
                organizationName: currentLead[0]?.organizationName || null,
                contact: {
                    mobileNo: currentLead[0]?.contact?.mobileNo || null,
                    emailID: currentLead[0]?.contact?.emailID || null
                },
                address: currentLead[0]?.address || null,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (openEditLead) {
            getLeadData();
        }
    }, [lid, openEditLead]);

    //#region Edit Lead
    const handleEditLeadChange = (e) => {
        const { name, value } = e.target;
        if (name == 'mobileNo' || name == 'emailID') {
            setEditLeadData((prev) => ({
                ...prev,
                contact: {
                    ...prev.contact,
                    [name]: value,
                }
            }));
        } else {
            setEditLeadData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    const handleEditLead = async () => {
        if (!editLeadData.name || !editLeadData.organizationName) {
            setErrorMessage('Required fields cannot be empty.')
            setError(true);
            return;
        }
        if ((editLeadData.contact.mobileNo == null || editLeadData.contact.mobileNo == "") && 
        (editLeadData.contact.emailID == null || editLeadData.contact.emailID == "")) {
            setErrorMessage('Fill atleast one contact field.')
            setError(true);
            return;
        }

        try {
            await axios.put(`${Config.apiUrl}/editLead/${lid}`, editLeadData);
            setOpenEditLead(false);
            setEditLeadData({});
            fetchLeadsData();
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

    const closeEditLead = () => {
        setEditLeadData({
            name: '',
            designationDept: '',
            organizationName: '',
            contact: {
                mobileNo: '',
                emailID: ''
            },
            address: '',
        });
        setOpenEditLead(false);
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
                open={openEditLead}
                onClose={closeEditLead}
            >
                <DialogTitle>Edit Lead</DialogTitle>
                <DialogContent>
                    <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
                        <div className="mb-2">
                            <TextField
                                required
                                name='name'
                                id="outlined-required"
                                label="Lead Name"
                                size='small'
                                value={editLeadData?.name}
                                onChange={handleEditLeadChange}
                                fullWidth
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="mb-2">
                                <TextField
                                    name='mobileNo'
                                    id="outlined"
                                    label="Mobile No."
                                    size='small'
                                    value={editLeadData?.contact?.mobileNo || ''}
                                    onChange={handleEditLeadChange}
                                />
                            </div>
                            <div className="mb-2">
                                <TextField
                                    name='emailID'
                                    id="outlined"
                                    label="Email ID"
                                    size='small'
                                    value={editLeadData?.contact?.emailID || ''}
                                    onChange={handleEditLeadChange}
                                />
                            </div>
                            <div className="mb-2">
                                <TextField
                                    name='designationDept'
                                    id="outlined"
                                    label="Designation/Dept."
                                    size='small'
                                    value={editLeadData?.designationDept || ''}
                                    onChange={handleEditLeadChange}
                                />
                            </div>
                            <div className="mb-2">
                                <TextField
                                    required
                                    name='organizationName'
                                    id="outlined-required"
                                    label="Organization"
                                    size='small'
                                    value={editLeadData?.organizationName}
                                    onChange={handleEditLeadChange}
                                />
                            </div>
                        </div>
                        <div className='mt-2 mb-4'>
                            <TextField
                                name='address'
                                id="outlined"
                                label="Address"
                                fullWidth
                                value={editLeadData?.address || ''}
                                onChange={handleEditLeadChange}
                            />
                        </div>
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <div className='m-4'>
                        <Button onClick={closeEditLead}>Cancel</Button>
                        <Button variant='contained' onClick={handleEditLead}>Edit</Button>
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
                    Lead edited successfully!
                </Alert>
            </Snackbar>
        </>
    )
}

export default EditLead