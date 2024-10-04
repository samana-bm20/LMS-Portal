import React, { useState, useEffect } from 'react'
import {
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
    TextField, InputLabel, Select, MenuItem, FormControl
} from '@mui/material'
import { useDetails } from '../../providers/DetailsProvider'
import { Config } from '../../Config'
import axios from 'axios'

const EditFollowUp = ({ openEditFollowUp, setOpenEditFollowUp, selectedFollowUp }) => {
    const { userValues, fetchFollowUps } = useDetails();
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const uid = user.UID;
    const [assignedTo, setAssignedTo] = useState('');
    const [nextType, setNextType] = useState('');
    const [nextDate, setNextDate] = useState('');
    const [editFollowUpData, setEditFollowUpData] = useState({
        editedBy: '',
        nextDate: '',
        nextType: '',
        UID: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const activeUsers = userValues.filter(user => user.uStatus == 'Active');

    //#region Fetch Data
    const getSelectedFollowUp = () => {
        if (selectedFollowUp.length !== 0) {
            setAssignedTo(selectedFollowUp.UID);
            setNextType(selectedFollowUp.nextType);
            const formattedDate = new Date(selectedFollowUp.nextDate).toISOString().slice(0, 16);
            setNextDate(formattedDate);
            setEditFollowUpData((prev) => ({
                ...prev,
                nextDate: formattedDate,
                nextType: selectedFollowUp.nextType,
                UID: selectedFollowUp.UID,
                editedBy: uid,
            }));
        }
    }

    useEffect(() => {
        getSelectedFollowUp();
    }, [selectedFollowUp, uid]);

    //#region Field Change
    const handleEditFollowUpChange = (e) => {
        const { name, value } = e.target;
        if (name === 'UID') {
            setAssignedTo(value);
        }
        if (name === 'nextType') {
            setNextType(value);
        }
        if (name === 'nextDate') {
            setNextDate(value);
        }
        setEditFollowUpData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //#region Edit Followup
    const handleEditFollowUp = async () => {
        if (!editFollowUpData.nextDate || !editFollowUpData.nextType || !editFollowUpData.UID) {
            setErrorMessage('Required fields cannot be empty.')
            setError(true);
            return;
        }
        const params = {
            FID: selectedFollowUp.FID,
            data: editFollowUpData
        }
        try {
            const _ = await axios.put(`${Config.apiUrl}/editFollowUp`, params, {
                headers: {
                    'Authorization': token
                }
            });
            setOpenEditFollowUp(false);
            fetchFollowUps();
            getSelectedFollowUp();
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

    const closeEditFollowUp = () => {
        setOpenEditFollowUp(false);
        getSelectedFollowUp();
    }

    // #region Snackbar
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
                open={openEditFollowUp}
                onClose={closeEditFollowUp}
            >
                <DialogTitle>Edit Follow-up</DialogTitle>
                <DialogContent>
                    <Paper elevation={3} className="p-4 rounded-lg shadow-md" component="form" >
                        <div className="grid grid-cols-1 gap-2">
                            <div className="mb-2">
                                <TextField
                                    required
                                    name='nextDate'
                                    id="outlined-required"
                                    label="Next Date"
                                    size='small'
                                    type="datetime-local"
                                    value={nextDate}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleEditFollowUpChange}
                                    fullWidth
                                />
                            </div>

                            <div className="mb-2">
                                <FormControl required fullWidth>
                                    <InputLabel id="demo-simple-select-label">Next Type</InputLabel>
                                    <Select
                                        name='nextType'
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Next Type"
                                        value={nextType}
                                        onChange={handleEditFollowUpChange}
                                        size='small'
                                    >
                                        <MenuItem value='call'>Call</MenuItem>
                                        <MenuItem value='email'>Email</MenuItem>
                                        <MenuItem value='physical'>Physical</MenuItem>

                                    </Select>
                                </FormControl>
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
                                        onChange={handleEditFollowUpChange}
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
                        <Button onClick={closeEditFollowUp}>Cancel</Button>
                        <Button variant='contained' onClick={handleEditFollowUp}>Update</Button>
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
                    Upcoming follow-up edited successfully!
                </Alert>
            </Snackbar>
        </>
    )
}

export default EditFollowUp