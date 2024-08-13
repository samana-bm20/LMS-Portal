import React, { useState, useEffect } from 'react'
import {
    Box, Button, TextField, InputLabel, Select, MenuItem, FormControl, alpha, useTheme,
    Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material'
import Config from '../../Config';
import axios from 'axios';
import { useDetails } from '../../providers/DetailsProvider';

const AddFollowUp = ({ openAddFollowUp, setOpenAddFollowUp, lid, pid, sid }) => {
    const theme = useTheme();
    const { statusValues } = useDetails();
    const primaryColorWithOpacity = alpha(theme.palette.primary.main, 0.1);
    const [addErrorMessage, setAddErrorMessage] = useState('');
    const [addFollowUpError, setAddFollowUpError] = useState(false);
    const [addFollowUpSuccess, setAddFollowUpSuccess] = useState(false);
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
        debugger
        if (!followUpData.date || !followUpData.type || !followUpData.remarks || !followUpData.SID) {
            setAddErrorMessage('Required fields cannot be empty.')
            setAddFollowUpError(true);
            return;
        }
        try {
            const _ = await axios.post(`${Config.apiUrl}/addFollowUp`, followUpData);
            setOpenAddFollowUp(false);
            setType(''); setNextType('');
            setAddFollowUpSuccess(true);
            setAddErrorMessage('');
        } catch (error) {
            if (error.response && error.response.data) {
                setAddFollowUpError(true);
                setAddErrorMessage(error.response.data);
            } else {
                setAddErrorMessage('An unexpected error occurred.');
            }
        }
    };

    //#region Snackbar
    const addFollowUpErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAddFollowUpError(false);
    };

    const addFollowUpSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAddFollowUpSuccess(false);
    };

    return (
        <>
            <Dialog
                open={openAddFollowUp}
                onClose={closeAddFollowUp}
            >
                <DialogTitle>Add Follow-Up</DialogTitle>
                <DialogContent>
                    <Box className="p-4 rounded-lg shadow-md" component="form" sx={{ backgroundColor: primaryColorWithOpacity }}>
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
                    </Box>

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
                open={addFollowUpError}
                autoHideDuration={2000}
                onClose={addFollowUpErrorClose}>
                <Alert onClose={addFollowUpErrorClose} severity="error" variant='filled'>
                    {addErrorMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={addFollowUpSuccess}
                autoHideDuration={2000}
                onClose={addFollowUpSuccessClose}>
                <Alert onClose={addFollowUpSuccessClose} severity="success" variant='filled'>
                    Follow-up added successfully!
                </Alert>
            </Snackbar>
        </>
    );
}

export default AddFollowUp;