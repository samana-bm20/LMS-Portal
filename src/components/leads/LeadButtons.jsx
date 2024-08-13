import React, { useState, useCallback } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material'
import { AddCircleRounded, FileUploadRounded } from '@mui/icons-material'
import AddLead from './AddLead'
import Config from '../../Config';
import axios from 'axios';

const LeadButtons = () => {
    const [openAddLeadDialog, setOpenAddLeadDialog] = useState(false);
    const [addLeadData, setAddLeadData] = useState([]);
    const [addLeadError, setAddLeadError] = useState(false);
    const [addErrorMessage, setAddErrorMessage] = useState('');
    const [addLeadSuccess, setAddLeadSuccess] = useState(false);

    const openAddLead = () => {
        setOpenAddLeadDialog(true);
    }

    const closeAddLead = () => {
        setOpenAddLeadDialog(false);
    }

    const handleLeadDataChange = useCallback((data) => {
        setAddLeadData(data);
    }, []);

    const handleAddLead = async () => {
        if (!addLeadData.name || !addLeadData.organizationName || !addLeadData.PID ||
            !addLeadData.SID || !addLeadData.source || !addLeadData.UID) {
            setAddErrorMessage('Required fields cannot be empty.')
            setAddLeadError(true);
            return;
        }
        try {
            const _ = await axios.post(`${Config.apiUrl}/addLead`, addLeadData);
            setOpenAddLeadDialog(false);
            setAddLeadSuccess(true);
            setAddErrorMessage('');
        } catch (error) {
            if (error.response && error.response.data) {
                setAddLeadError(true);
                setAddErrorMessage(error.response.data);
            } else {
                setAddErrorMessage('An unexpected error occurred.');
            }
        }
    };

    const addLeadErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAddLeadError(false);
    };

    const addLeadSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAddLeadSuccess(false);
    };


    return (
        <div className="flex flex-col md:flex-row justify-end space-x-reverse p-2 m-1 ">
            {/* Add Lead */}
            <Button
                sx={{ m: '5px' }}
                variant="contained"
                startIcon={<AddCircleRounded />}
                onClick={openAddLead}
            >
                Add Lead
            </Button>
            <Dialog
                open={openAddLeadDialog}
                onClose={closeAddLead}
            >
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogContent>
                    <AddLead handleLeadDataChange={handleLeadDataChange} />
                </DialogContent>
                <DialogActions>
                    <div className='m-4'>
                        <Button onClick={closeAddLead}>Cancel</Button>
                        <Button variant='contained' onClick={handleAddLead}>Submit</Button>
                    </div>
                </DialogActions>
            </Dialog>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={addLeadError}
                autoHideDuration={2000}
                onClose={addLeadErrorClose}>
                <Alert onClose={addLeadErrorClose} severity="error" variant='filled'>
                    {addErrorMessage}
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={addLeadSuccess}
                autoHideDuration={2000}
                onClose={addLeadSuccessClose}>
                <Alert onClose={addLeadSuccessClose} severity="success" variant='filled'>
                    New lead added successfully!
                </Alert>
            </Snackbar>

            {/* Import Lead */}
            <Button
                sx={{ m: '5px' }}
                variant="contained"
                startIcon={<FileUploadRounded />}
            >
                Import Lead
            </Button>
        </div>
    )
}

export default LeadButtons