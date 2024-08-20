import React, { useState, useEffect } from 'react'
import {
    Paper, Button, TextField, InputLabel, Select, MenuItem, FormControl, 
    Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material'
import Config from '../../Config';
import axios from 'axios';
import { useDetails } from '../../providers/DetailsProvider';
import { useFetchLeads } from '../../providers/FetchLeadsProvider';

const AddFollowUp = ({ openAddFollowUp, setOpenAddFollowUp, lid, pid, sid }) => {
    const { fetchLeadsData } = useFetchLeads();
    const { statusValues } = useDetails();
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [nextType, setNextType] = useState('');
    const [followUpData, setFollowUpData] = useState({
        LID: 0,
        PID: '',
        date: '',
        type: '',
        SID: '',
        UID: 'U1',
        remarks: ''
    });

    //#region Set IDs
    useEffect(() => {
        const setIDs = () => {
            setFollowUpData((prev) => ({
                ...prev,
                LID: lid,
                PID: pid,
                SID: sid,
            }));

            const initialStatus = statusValues.find(status => status.SID === sid);
            if (initialStatus) {
                setStatus(initialStatus.SID);
            }
        }
        setIDs();
    }, [lid, pid, sid]);

    //#region Field Change
    const handleFollowUpChange = (e) => {
        const { name, value } = e.target;
        if (name === 'SID') {
            setStatus(value);
        }
        if (name === 'type') {
            setType(value);
        }
        if (name === 'nextType') {
            setNextType(value);
        }
        setFollowUpData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const closeAddFollowUp = () => {
        setOpenAddFollowUp(false);
        setType(''); setNextType('');
    }
    //#region Add Follow-up
    const handleAddFollowUp = async () => {
        if (!followUpData.date || !followUpData.type || !followUpData.remarks || !followUpData.SID) {
            setErrorMessage('Required fields cannot be empty.')
            setError(true);
            return;
        }
        try {
            const _ = await axios.post(`${Config.apiUrl}/addFollowUp`, followUpData);
            fetchLeadsData();
            setOpenAddFollowUp(false);
            setType('');
            setNextType('');
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
                open={openAddFollowUp}
                onClose={closeAddFollowUp}
            >
                <DialogTitle>Add Follow-Up</DialogTitle>
                <DialogContent>
                    <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
                        <div className="grid grid-cols-1 gap-2">
                            <div className="mb-2">
                                <TextField
                                    required
                                    name='date'
                                    id="outlined-required"
                                    label="Follow-Up Date"
                                    size='small'
                                    type="datetime-local"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleFollowUpChange}
                                    fullWidth
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="mb-3">
                                    <FormControl required fullWidth>
                                        <InputLabel id="type-select-label">Type</InputLabel>
                                        <Select
                                            name='type'
                                            labelId="type-select-label"
                                            id="type-select"
                                            label="Type"
                                            value={type}
                                            onChange={handleFollowUpChange}
                                            size='small'
                                        >
                                            <MenuItem value='call'>Call</MenuItem>
                                            <MenuItem value='email'>Email</MenuItem>
                                            <MenuItem value='physical'>Physical</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="mb-3">
                                    <FormControl required fullWidth>
                                        <InputLabel id="status-select-label">Status</InputLabel>
                                        <Select
                                            name='SID'
                                            labelId="status-select-label"
                                            id="status-select"
                                            label="Status"
                                            value={status}
                                            onChange={handleFollowUpChange}
                                            size='small'
                                        >
                                            {statusValues.map((status) => (
                                                <MenuItem key={status.SID} value={status.SID}>{status.sName}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div className='mt-2 mb-4'>
                                <TextField
                                    name='remarks'
                                    id="outlined"
                                    label="Remarks"
                                    fullWidth
                                    multiline
                                    onChange={handleFollowUpChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="mb-2">
                                    <TextField
                                        name='nextDate'
                                        id="outlined-required"
                                        label="Next Follow-Up"
                                        size='small'
                                        type="datetime-local"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleFollowUpChange}
                                        fullWidth
                                    />
                                </div>
                                <div className="mb-3">
                                    <FormControl fullWidth>
                                        <InputLabel id="type-select-label">Type</InputLabel>
                                        <Select
                                            name='nextType'
                                            labelId="type-select-label"
                                            id="type-select"
                                            label="Type"
                                            value={nextType}
                                            onChange={handleFollowUpChange}
                                            size='small'
                                        >
                                            <MenuItem value='call'>Call</MenuItem>
                                            <MenuItem value='email'>Email</MenuItem>
                                            <MenuItem value='physical'>Physical</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                    </Paper>

                </DialogContent>
                <DialogActions>
                    <div className='m-4'>
                        <Button onClick={closeAddFollowUp}>Cancel</Button>
                        <Button variant='contained' onClick={handleAddFollowUp}>Submit</Button>
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
                    Follow-up added successfully!
                </Alert>
            </Snackbar>
        </>
    );
}

export default AddFollowUp;