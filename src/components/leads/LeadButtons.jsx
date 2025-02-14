import React, { useState, useCallback } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material'
import { AddCircleRounded, FileUploadRounded } from '@mui/icons-material'
import AddLead from './AddLead'
import { Config } from '../../Config';
import axios from 'axios';
import { useFetchLeads } from '../../providers/FetchLeadsProvider';
import { useAuth } from '../../providers/AuthProvider';
import ImportLead from './ImportLead';
import { useDetails } from '../../providers/DetailsProvider'

const LeadButtons = () => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const { fetchLeadsData } = useFetchLeads();
    const {socket} = useAuth();
    const [openAddLeadDialog, setOpenAddLeadDialog] = useState(false);
    const [openImportLead, setOpenImportLead] = useState(false);
    const [addLeadData, setAddLeadData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    // const phoneRegex = /^\+?[1-9]\d{0,2}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,9}([-.\s]?\d{1,9})?$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { fetchDetails } = useDetails();
    

    

    //#region Add Lead Dialog
    const openAddLead = () => {
        setOpenAddLeadDialog(true);
    }

    const closeAddLead = () => {
        setOpenAddLeadDialog(false);
    }

    const handleLeadDataChange = useCallback((data) => {
        setAddLeadData(data);
    }, []);

    //#region Add Lead
    const handleAddLead = async () => {
        if (!addLeadData.name || !addLeadData.organizationName || !addLeadData.PID ||
            !addLeadData.SID || !addLeadData.source || !addLeadData.UID) {
            setErrorMessage('Required fields cannot be empty.')
            setError(true);
            return;
        }
        // if (addLeadData.contact?.mobileNo && !phoneRegex.test(addLeadData.contact.mobileNo)) {
        //     setErrorMessage('Invalid contact number.')
        //     setError(true);
        //     return;
        // }
        if (addLeadData.contact?.emailID && !emailRegex.test(addLeadData.contact.emailID)) {
            setErrorMessage('Invalid email ID.')
            setError(true);
            return;
        }
        try {
            const _ = await axios.post(`${Config.apiUrl}/addLead`, addLeadData, {
                headers: {
                    'Authorization': token
                }
            });
            console.log(socket);
            socket.emit('addLead', addLeadData, user.UID);
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
            }
        }
    };

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
        fetchDetails()
        setSuccess(false);
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
                    New lead added successfully!
                </Alert>
            </Snackbar>

            {/* Import Lead */}
            <Button
                sx={{ m: '5px' }}
                variant="contained"
                startIcon={<FileUploadRounded />}
                onClick={() => setOpenImportLead(true)}
            >
                Import Lead
            </Button>
            <ImportLead openImportLead={openImportLead} setOpenImportLead={setOpenImportLead} />
        </div >
    )
}

export default LeadButtons