import React, { useState, useCallback } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material'
<<<<<<< HEAD
import { AddCircleRounded, FileUploadRounded } from '@mui/icons-material'
import AddLead from './AddLead'
import Config from '../../Config';
import axios from 'axios';
import { useFetchLeads } from '../../providers/FetchLeadsProvider';

const LeadButtons = () => {
    const { fetchLeadsData } = useFetchLeads();
    const [openAddLeadDialog, setOpenAddLeadDialog] = useState(false);
    const [addLeadData, setAddLeadData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    //#region Add Lead Dialog
=======
import { AddCircleRounded, FileUploadRounded, FileDownloadRounded } from '@mui/icons-material'
import AddLead from './AddLead'
import Config from '../../Config';
import axios from 'axios';

const LeadButtons = () => {
    const [openAddLeadDialog, setOpenAddLeadDialog] = useState(false);
    const [addLeadData, setAddLeadData] = useState([]);
    const [addLeadError, setAddLeadError] = useState(false);
    const [addErrorMessage, setAddErrorMessage] = useState('');
    const [addLeadSuccess, setAddLeadSuccess] = useState(false);

>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
    const openAddLead = () => {
        setOpenAddLeadDialog(true);
    }

    const closeAddLead = () => {
        setOpenAddLeadDialog(false);
    }

    const handleLeadDataChange = useCallback((data) => {
        setAddLeadData(data);
    }, []);

<<<<<<< HEAD
    //#region Add Lead
    const handleAddLead = async () => {
        if (!addLeadData.name || !addLeadData.organizationName || !addLeadData.PID ||
            !addLeadData.SID || !addLeadData.source || !addLeadData.UID) {
            setErrorMessage('Required fields cannot be empty.')
            setError(true);
            return;
        }
        try {
            const _ = await axios.post(`${Config.apiUrl}/addLead`, addLeadData);
            fetchLeadsData();
            setOpenAddLeadDialog(false);
            setSuccess(true);
            setErrorMessage('');
        } catch (error) {
            if (error.response && error.response.data) {
                setError(true);
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage('An unexpected error occurred.');
=======
    const handleAddLead = async () => {
        if (!addLeadData.name || !addLeadData.organizationName || !addLeadData.pName ||
            !addLeadData.status || !addLeadData.source || !addLeadData.assignedTo) {
            setAddErrorMessage('Required fields cannot be empty.')
            setAddLeadError(true);
            return;
        }
        try {
            debugger
            const response = await axios.post(`${Config.apiUrl}/addLead`, addLeadData);
            console.log(response.data);
            setOpenAddLeadDialog(false);
            setAddLeadSuccess(true);
            setAddErrorMessage('');
        } catch (error) {
            if (error.response && error.response.data) {
                setAddLeadError(true);
                setAddErrorMessage(error.response.data);
            } else {
                setAddErrorMessage('An unexpected error occurred.');
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
            }
        }
    };

<<<<<<< HEAD
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
=======
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
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
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
<<<<<<< HEAD
                <DialogTitle>Add New Lead</DialogTitle>
=======
                <DialogTitle>Add Lead</DialogTitle>
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
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
<<<<<<< HEAD
                open={error}
                autoHideDuration={2000}
                onClose={errorClose}>
                <Alert onClose={errorClose} severity="error" variant='filled'>
                    {errorMessage}
=======
                open={addLeadError}
                autoHideDuration={2000}
                onClose={addLeadErrorClose}>
                <Alert onClose={addLeadErrorClose} severity="error" variant='filled'>
                    {addErrorMessage}
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
<<<<<<< HEAD
                open={success}
                autoHideDuration={2000}
                onClose={successClose}>
                <Alert onClose={successClose} severity="success" variant='filled'>
=======
                open={addLeadSuccess}
                autoHideDuration={2000}
                onClose={addLeadSuccessClose}>
                <Alert onClose={addLeadSuccessClose} severity="success" variant='filled'>
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
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
<<<<<<< HEAD
=======

            {/* Export Lead */}
            <Button
                sx={{ m: '5px' }}
                variant="contained"
                startIcon={<FileDownloadRounded />}
            >
                Export Lead
            </Button>
>>>>>>> 5145d8b87a2573e55d07671c07279ccd5d427e5c
        </div>
    )
}

export default LeadButtons